from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from .. import schemas, models, dependencies
from ..database import get_db
import json
import os
import shutil
from datetime import datetime

router = APIRouter(
    prefix="/profile",
    tags=["Profile"]
)

@router.get("/donor", response_model=schemas.DonorProfileResponse)
async def get_donor_profile(
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(dependencies.get_current_user)
):
    """
    Get current donor's profile.
    """
    if current_user.role != models.UserRole.DONOR:
        raise HTTPException(status_code=403, detail="Only donors can access this endpoint")
    
    result = await db.execute(
        select(models.DonorProfile).where(models.DonorProfile.user_id == current_user.id)
    )
    profile = result.scalar_one_or_none()
    
    if not profile:
        # Create default profile if it doesn't exist
        profile = models.DonorProfile(user_id=current_user.id)
        db.add(profile)
        await db.commit()
        await db.refresh(profile)
    
    # Parse JSON fields
    response_data = {
        "id": profile.id,
        "user_id": profile.user_id,
        "country": profile.country,
        "state_city": profile.state_city,
        "phone_number": profile.phone_number,
        "profile_picture_url": profile.profile_picture_url,
        "preferred_causes": json.loads(profile.preferred_causes) if profile.preferred_causes else None,
        "preferred_ngo_types": json.loads(profile.preferred_ngo_types) if profile.preferred_ngo_types else None,
        "monthly_donation_goal": profile.monthly_donation_goal,
        "preferred_currency": profile.preferred_currency,
        "wallet_address": profile.wallet_address,
        "wallet_provider": profile.wallet_provider,
        "wallet_connected": profile.wallet_connected,
        "consent_onchain_storage": profile.consent_onchain_storage,
        "is_anonymous": profile.is_anonymous
    }
    
    return response_data

@router.put("/donor", response_model=schemas.DonorProfileResponse)
async def update_donor_profile(
    profile_update: schemas.DonorProfileUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(dependencies.get_current_user)
):
    """
    Update current donor's profile.
    """
    if current_user.role != models.UserRole.DONOR:
        raise HTTPException(status_code=403, detail="Only donors can access this endpoint")
    
    result = await db.execute(
        select(models.DonorProfile).where(models.DonorProfile.user_id == current_user.id)
    )
    profile = result.scalar_one_or_none()
    
    if not profile:
        # Create profile if it doesn't exist
        profile = models.DonorProfile(user_id=current_user.id)
        db.add(profile)
    
    # Update fields
    update_data = profile_update.model_dump(exclude_unset=True)
    
    # Convert lists to JSON strings for storage
    if "preferred_causes" in update_data and update_data["preferred_causes"] is not None:
        update_data["preferred_causes"] = json.dumps(update_data["preferred_causes"])
    
    if "preferred_ngo_types" in update_data and update_data["preferred_ngo_types"] is not None:
        update_data["preferred_ngo_types"] = json.dumps(update_data["preferred_ngo_types"])
    
    for key, value in update_data.items():
        setattr(profile, key, value)
    
    await db.commit()
    await db.refresh(profile)
    
    # Parse JSON fields for response
    response_data = {
        "id": profile.id,
        "user_id": profile.user_id,
        "country": profile.country,
        "state_city": profile.state_city,
        "phone_number": profile.phone_number,
        "profile_picture_url": profile.profile_picture_url,
        "preferred_causes": json.loads(profile.preferred_causes) if profile.preferred_causes else None,
        "preferred_ngo_types": json.loads(profile.preferred_ngo_types) if profile.preferred_ngo_types else None,
        "monthly_donation_goal": profile.monthly_donation_goal,
        "preferred_currency": profile.preferred_currency,
        "wallet_address": profile.wallet_address,
        "wallet_provider": profile.wallet_provider,
        "wallet_connected": profile.wallet_connected,
        "consent_onchain_storage": profile.consent_onchain_storage,
        "is_anonymous": profile.is_anonymous
    }
    
    return response_data

@router.post("/upload-picture")
async def upload_profile_picture(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(dependencies.get_current_user)
):
    """
    Upload profile picture.
    """
    if current_user.role != models.UserRole.DONOR:
        raise HTTPException(status_code=403, detail="Only donors can access this endpoint")
    
    # Validate file type and magic bytes signature
    if file.content_type not in ["image/jpeg", "image/png", "image/jpg"]:
        raise HTTPException(status_code=400, detail="Only JPEG and PNG images are allowed")
    
    content = await file.read()
    await file.seek(0)
    from ..utils import validate_file_magic_bytes
    if not validate_file_magic_bytes(content, ["jpg", "jpeg", "png"]):
        raise HTTPException(status_code=400, detail="Invalid file signature. File header does not match image format.")

    # Create uploads directory if it doesn't exist
    upload_dir = "uploads/profiles"
    os.makedirs(upload_dir, exist_ok=True)
    
    # Generate unique filename
    file_ext = file.filename.split(".")[-1]
    filename = f"{current_user.id}_{int(datetime.now().timestamp())}.{file_ext}"
    file_path = f"{upload_dir}/{filename}"
    
    # Save file
    with open(file_path, "wb") as buffer:
        buffer.write(content)
    
    # Update profile
    result = await db.execute(
        select(models.DonorProfile).where(models.DonorProfile.user_id == current_user.id)
    )
    profile = result.scalar_one_or_none()
    
    if not profile:
        profile = models.DonorProfile(user_id=current_user.id)
        db.add(profile)
    
    # Construct URL (assuming static mount at /static)
    # In production, this would be an S3 URL
    profile_url = f"/static/profiles/{filename}"
    profile.profile_picture_url = profile_url
    
    await db.commit()
    
    return {"url": profile_url}
