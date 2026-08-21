from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
import shutil
import os
from datetime import datetime, timedelta, timezone
from .. import models, schemas, dependencies
from ..database import get_db

router = APIRouter(
    prefix="/updates",
    tags=["updates"]
)

UPLOAD_DIR = "uploads/proofs"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/", response_model=schemas.UpdateResponse)
async def create_update(
    title: str = Form(...),
    description: str = Form(...),
    amount: float = Form(...),
    campaign_id: int = Form(...),
    file: UploadFile = File(...),
    current_user: models.User = Depends(dependencies.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Verify NGO role
    if current_user.role != models.UserRole.NGO:
        raise HTTPException(status_code=403, detail="Only NGOs can post updates")

    # Verify campaign ownership
    result = await db.execute(
        select(models.Campaign).where(models.Campaign.id == campaign_id)
    )
    campaign = result.scalar_one_or_none()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    if campaign.ngo_id != current_user.id:
        raise HTTPException(status_code=403, detail="You do not own this campaign")

    # Validate file magic bytes signature
    content = await file.read()
    await file.seek(0)
    from ..utils import validate_file_magic_bytes
    if not validate_file_magic_bytes(content, ["jpg", "jpeg", "png", "pdf"]):
        raise HTTPException(status_code=400, detail="Invalid file signature. Allowed formats are JPG, PNG, and PDF.")

    # Save file
    file_extension = os.path.splitext(file.filename)[1]
    file_name = f"{campaign_id}_{datetime.now(timezone.utc).timestamp()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, file_name)
    
    with open(file_path, "wb") as buffer:
        buffer.write(content)

    # Create update record
    from ..services.ipfs_service import ipfs_service
    import asyncio
    
    # Upload to IPFS in thread executor to prevent event loop freezing
    try:
        ipfs_hash = await asyncio.to_thread(ipfs_service.upload_file, file_path)
        proof_url = f"ipfs://{ipfs_hash}"
        print(f"Uploaded to IPFS: {ipfs_service.get_gateway_url(ipfs_hash)}")
        # Clean up local file after successful IPFS upload to prevent unbounded disk growth
        if os.path.exists(file_path):
            os.remove(file_path)
    except Exception as e:
        print(f"IPFS Upload failed: {e}")
        proof_url = f"/static/proofs/{file_name}"

    new_update = models.SpendingUpdate(
        title=title,
        description=description,
        amount=amount,
        campaign_id=campaign_id,
        ngo_id=current_user.id,
        proof_url=proof_url,
        status="PENDING",
        expires_at=datetime.now(timezone.utc) + timedelta(days=30) # Placeholder
    )
    
    db.add(new_update)
    await db.commit()
    await db.refresh(new_update)
    return new_update

@router.get("/campaign/{campaign_id}", response_model=List[schemas.UpdateResponse])
async def get_campaign_updates(
    campaign_id: int,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(models.SpendingUpdate)
        .where(models.SpendingUpdate.campaign_id == campaign_id)
        .order_by(models.SpendingUpdate.created_at.desc())
    )
    return result.scalars().all()
