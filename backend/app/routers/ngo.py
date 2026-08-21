from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List
import shutil
import os
from datetime import datetime, timezone
from .. import schemas, models, dependencies
from ..database import get_db

router = APIRouter(
    prefix="/ngo",
    tags=["NGO"]
)

UPLOAD_DIR = "uploads/kyc"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("/me", response_model=schemas.NGOProfileDetailResponse)
async def get_my_profile(
    current_user: models.User = Depends(dependencies.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if current_user.role != models.UserRole.NGO:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    result = await db.execute(
        select(models.NGOProfile)
        .where(models.NGOProfile.user_id == current_user.id)
        .options(selectinload(models.NGOProfile.kyc_documents))
    )
    profile = result.scalar_one_or_none()
    
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
        
    return profile

@router.post("/kyc/upload", response_model=schemas.KYCDocumentResponse)
async def upload_kyc_document(
    document_type: str = Form(...),
    file: UploadFile = File(...),
    current_user: models.User = Depends(dependencies.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if current_user.role != models.UserRole.NGO:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    # Get NGO Profile
    result = await db.execute(select(models.NGOProfile).where(models.NGOProfile.user_id == current_user.id))
    profile = result.scalar_one_or_none()
    
    if not profile:
        raise HTTPException(status_code=404, detail="NGO Profile not found")
        
    # Read and inspect magic bytes signature
    content = await file.read()
    await file.seek(0)
    from ..utils import validate_file_magic_bytes
    if not validate_file_magic_bytes(content, ["jpg", "jpeg", "png", "pdf"]):
        raise HTTPException(status_code=400, detail="Invalid file signature. Allowed formats are JPG, PNG, and PDF.")

    # Save file
    file_extension = os.path.splitext(file.filename)[1]
    filename = f"{profile.id}_{document_type}_{datetime.now(timezone.utc).timestamp()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    with open(file_path, "wb") as buffer:
        buffer.write(content)
        
    # Create DB entry
    # In a real app, we would upload to IPFS here
    file_url = f"/static/kyc/{filename}" 
    
    new_doc = models.KYCDocument(
        ngo_id=profile.id,
        document_type=document_type,
        file_url=file_url
    )
    db.add(new_doc)
    await db.commit()
    await db.refresh(new_doc)
    
    return new_doc

from sqlalchemy import func

@router.get("/stats")
async def get_ngo_stats(
    current_user: models.User = Depends(dependencies.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if current_user.role != models.UserRole.NGO:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    # Total raised across NGO campaigns
    total_raised_res = await db.execute(
        select(func.sum(models.Donation.amount))
        .join(models.Campaign, models.Donation.campaign_id == models.Campaign.id)
        .where(models.Campaign.ngo_id == current_user.id, models.Donation.status == models.DonationStatus.COMPLETED)
    )
    total_raised = total_raised_res.scalar() or 0.0

    # Total distinct active donors
    donors_res = await db.execute(
        select(func.count(func.distinct(models.Donation.donor_id)))
        .join(models.Campaign, models.Donation.campaign_id == models.Campaign.id)
        .where(models.Campaign.ngo_id == current_user.id)
    )
    active_donors = donors_res.scalar() or 0

    # Total active campaigns
    campaigns_res = await db.execute(
        select(func.count(models.Campaign.id))
        .where(models.Campaign.ngo_id == current_user.id, models.Campaign.status == models.CampaignStatus.ACTIVE)
    )
    active_campaigns = campaigns_res.scalar() or 0

    return {
        "total_raised": float(total_raised),
        "active_donors": active_donors,
        "active_campaigns": active_campaigns
    }
