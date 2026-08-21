from typing import Annotated, List
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import ValidationError

from . import models, schemas, config, database, auth_clerk

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], db: AsyncSession = Depends(database.get_db)) -> models.User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # 1. Try Clerk Token
    try:
        payload = auth_clerk.verify_clerk_token(token)
        clerk_id = payload.get("sub")
        email = payload.get("email") # Assuming custom claim or standard email claim
        
        # If email is missing in standard token, we might need to fetch it or handle it.
        # For now, let's try to find user by clerk_id
        result = await db.execute(select(models.User).where(models.User.clerk_id == clerk_id))
        user = result.scalar_one_or_none()
        
        if user:
            return user
            
        # If not found by clerk_id, check by email (if available)
        if email:
            result = await db.execute(select(models.User).where(models.User.email == email))
            user = result.scalar_one_or_none()
            if user:
                # Link account
                user.clerk_id = clerk_id
                await db.commit()
                await db.refresh(user)
                return user
        
        # If still not found, create new user (JIT Provisioning)
        # We need an email. If token doesn't have it, we can't create a valid User.
        if not email:
            # Fallback: try to get email from 'primary_email_address' or similar if Clerk provides it
            # Or raise error saying "Email required in token"
            # For this demo, let's assume email is present or fail.
            # print(f"Clerk Payload: {payload}") 
            raise credentials_exception
            
        new_user = models.User(
            email=email,
            hashed_password="CLERK_AUTH_NO_PASSWORD", # Placeholder
            clerk_id=clerk_id,
            role=models.UserRole.DONOR, # Default role
            is_email_verified=True
        )
        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)
        return new_user

    except Exception as e:
        # Not a valid Clerk token or verification failed.
        # Fallback to Local Token
        pass

    # 2. Local Token Verification
    try:
        payload = jwt.decode(token, config.settings.SECRET_KEY, algorithms=[config.settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
    
    result = await db.execute(select(models.User).where(models.User.email == email))
    user = result.scalar_one_or_none()
    
    if user is None:
        raise credentials_exception
    return user

class RoleChecker:
    def __init__(self, allowed_roles: List[models.UserRole]):
        self.allowed_roles = allowed_roles

    def __call__(self, user: Annotated[models.User, Depends(get_current_user)]):
        if user.role not in self.allowed_roles:
            raise HTTPException(status_code=403, detail="Operation not permitted")
        return user
