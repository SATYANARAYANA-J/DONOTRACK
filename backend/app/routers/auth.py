from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from .. import schemas, models, utils, auth, dependencies
from ..database import get_db
from ..services.email_service import email_service
import re

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

def validate_password(password: str) -> bool:
    """
    Validate password strength:
    - At least 8 characters
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one digit
    """
    if len(password) < 8:
        return False
    if not re.search(r'[A-Z]', password):
        return False
    if not re.search(r'[a-z]', password):
        return False
    if not re.search(r'\d', password):
        return False
    return True

@router.post("/signup", response_model=schemas.UserResponse)
async def signup(user: schemas.UserCreate, db: AsyncSession = Depends(get_db)):
    # Check if email already exists
    result = await db.execute(select(models.User).where(models.User.email == user.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Validate password strength
    if not validate_password(user.password):
        raise HTTPException(
            status_code=400, 
            detail="Password must be at least 8 characters with uppercase, lowercase, and numeric characters"
        )
    
    hashed_password = utils.get_password_hash(user.password)
    new_user = models.User(
        email=user.email, 
        hashed_password=hashed_password, 
        full_name=user.full_name,
        role=models.UserRole(user.role)
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user

@router.post("/signup/ngo", response_model=schemas.UserResponse)
async def signup_ngo(ngo_data: schemas.NGOSignupRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.User).where(models.User.email == ngo_data.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Validate password strength
    if not validate_password(ngo_data.password):
        raise HTTPException(
            status_code=400, 
            detail="Password must be at least 8 characters with uppercase, lowercase, and numeric characters"
        )

    hashed_password = utils.get_password_hash(ngo_data.password)
    new_user = models.User(email=ngo_data.email, hashed_password=hashed_password, role=models.UserRole.NGO)
    db.add(new_user)
    await db.flush() # Flush to get the new_user.id
    
    new_profile = models.NGOProfile(
        user_id=new_user.id,
        org_name=ngo_data.org_name,
        reg_number=ngo_data.reg_number,
        address=ngo_data.address,
        contact_person=ngo_data.contact_person
    )
    db.add(new_profile)
    
    await db.commit()
    await db.refresh(new_user)
    return new_user

@router.post("/login", response_model=schemas.Token)
async def login(response: Response, login_data: schemas.LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.User).where(models.User.email == login_data.email))
    user = result.scalar_one_or_none()
    
    if not user or not utils.verify_password(login_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    # Check if email is verified
    if not user.is_email_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Email not verified. Please verify your email before logging in."
        )
    
    access_token = auth.create_access_token(data={"sub": user.email})
    refresh_token = auth.create_refresh_token(data={"sub": user.email})
    
    # Set refresh token in HttpOnly cookie
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        max_age=7 * 24 * 60 * 60, # 7 days
        samesite="lax", # or 'strict' depending on requirements
        secure=False # Set to True in production (HTTPS)
    )
    
    return {"access_token": access_token, "token_type": "bearer", "role": user.role.value}

from fastapi import Cookie
import jwt
from .. import config

@router.post("/refresh", response_model=schemas.Token)
async def refresh_token(refresh_token: str | None = Cookie(default=None), db: AsyncSession = Depends(get_db)):
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token missing")
        
    try:
        payload = jwt.decode(refresh_token, config.settings.SECRET_KEY, algorithms=[config.settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token payload")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

    result = await db.execute(select(models.User).where(models.User.email == email))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    new_access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": new_access_token, "token_type": "bearer", "role": user.role.value}

@router.get("/me", response_model=schemas.UserResponse)
async def read_users_me(current_user: models.User = Depends(dependencies.get_current_user)):
    return current_user

@router.get("/admin-only", dependencies=[Depends(dependencies.RoleChecker([models.UserRole.ADMIN]))])
async def admin_only():
    return {"message": "Hello Admin"}

@router.post("/send-otp")
async def send_otp(email_request: schemas.EmailRequest, db: AsyncSession = Depends(get_db)):
    """
    Send OTP to email for verification.
    """
    # Check if user exists
    result = await db.execute(select(models.User).where(models.User.email == email_request.email))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.is_email_verified:
        raise HTTPException(status_code=400, detail="Email already verified")
    
    # Generate OTP
    otp = email_service.generate_otp()
    
    # Store OTP in database
    email_verification = models.EmailVerification(
        email=email_request.email,
        otp=otp
    )
    db.add(email_verification)
    await db.commit()
    
    # Send email (currently mocked)
    email_service.send_verification_email(email_request.email, otp)
    
    return {"message": "OTP sent successfully"}

@router.post("/verify-email")
async def verify_email(verification: schemas.EmailVerificationRequest, db: AsyncSession = Depends(get_db)):
    """
    Verify email using OTP.
    """
    # Get the most recent unused OTP for this email
    result = await db.execute(
        select(models.EmailVerification)
        .where(
            models.EmailVerification.email == verification.email,
            models.EmailVerification.is_used == False
        )
        .order_by(models.EmailVerification.created_at.desc())
    )
    email_ver = result.scalar_one_or_none()
    
    if not email_ver:
        raise HTTPException(status_code=404, detail="No verification request found")
    
    # Check if OTP has exceeded maximum failed attempts
    if email_ver.failed_attempts >= 5:
        email_ver.is_used = True
        await db.commit()
        raise HTTPException(status_code=400, detail="OTP locked due to too many failed attempts. Please request a new OTP.")
    
    # Check if OTP is expired
    if email_service.is_otp_expired(email_ver.created_at):
        raise HTTPException(status_code=400, detail="OTP has expired. Please request a new one.")
    
    # Verify OTP
    if email_ver.otp != verification.otp:
        email_ver.failed_attempts += 1
        await db.commit()
        attempts_left = max(0, 5 - email_ver.failed_attempts)
        raise HTTPException(status_code=400, detail=f"Invalid OTP. {attempts_left} attempts remaining.")
    
    # Mark OTP as used
    email_ver.is_used = True
    
    # Update user's email verification status
    user_result = await db.execute(select(models.User).where(models.User.email == verification.email))
    user = user_result.scalar_one_or_none()
    
    if user:
        user.is_email_verified = True
    
    await db.commit()
    
    return {"message": "Email verified successfully"}
