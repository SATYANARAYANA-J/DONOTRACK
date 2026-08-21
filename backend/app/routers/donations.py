from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from .. import schemas, models, dependencies
from ..database import get_db

from ..services.blockfrost_service import blockfrost_service
from sqlalchemy.orm import selectinload

router = APIRouter(
    prefix="/donations",
    tags=["Donations"]
)

@router.post("/", response_model=schemas.DonationResponse)
async def create_donation(donation: schemas.DonationCreate, db: AsyncSession = Depends(get_db), current_user: models.User = Depends(dependencies.get_current_user)):
    # Verify campaign exists
    result = await db.execute(select(models.Campaign).where(models.Campaign.id == donation.campaign_id))
    campaign = result.scalar_one_or_none()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")

    from datetime import datetime, timezone
    if campaign.status != models.CampaignStatus.ACTIVE:
        raise HTTPException(status_code=400, detail="Campaign is not active")
    if campaign.end_date:
        now_utc = datetime.now(timezone.utc)
        cmp_end = campaign.end_date if campaign.end_date.tzinfo else campaign.end_date.replace(tzinfo=timezone.utc)
        if cmp_end < now_utc:
            raise HTTPException(status_code=400, detail="Campaign has expired")

    # On-chain verification using Blockfrost service
    status = models.DonationStatus.PENDING
    if donation.transaction_hash:
        expected_lovelace = int(donation.amount * 1_000_000) # Convert ADA to Lovelace
        is_valid_onchain = blockfrost_service.verify_tx_amount(
            tx_hash=donation.transaction_hash,
            expected_lovelace=expected_lovelace,
            receiver_address=campaign.wallet_address or ""
        )
        if is_valid_onchain:
            status = models.DonationStatus.COMPLETED

    new_donation = models.Donation(
        amount=donation.amount,
        campaign_id=donation.campaign_id,
        transaction_hash=donation.transaction_hash,
        status=status,
        donor_id=current_user.id
    )
    db.add(new_donation)
    
    # Update campaign current amount ONLY if on-chain verification passed
    if status == models.DonationStatus.COMPLETED:
        campaign.current_amount += donation.amount
    
    await db.commit()
    await db.refresh(new_donation)
    
    # Fetch donor profile to check anonymous flag
    donor_profile_res = await db.execute(select(models.DonorProfile).where(models.DonorProfile.user_id == current_user.id))
    donor_profile = donor_profile_res.scalar_one_or_none()
    is_anonymous = donor_profile.is_anonymous if donor_profile else False

    # Broadcast update respecting anonymity
    from ..websockets import manager
    import json
    
    donor_display_name = "Anonymous" if is_anonymous else (current_user.full_name or current_user.email.split("@")[0])
    
    message = json.dumps({
        "type": "new_donation",
        "data": {
            "id": new_donation.id,
            "amount": new_donation.amount,
            "campaign_id": new_donation.campaign_id,
            "status": new_donation.status.value,
            "donor_name": donor_display_name
        }
    })
    await manager.broadcast(message)
    
    return new_donation

@router.post("/{donation_id}/verify", response_model=schemas.DonationResponse)
async def verify_donation(donation_id: int, db: AsyncSession = Depends(get_db), current_user: models.User = Depends(dependencies.get_current_user)):
    result = await db.execute(
        select(models.Donation)
        .where(models.Donation.id == donation_id, models.Donation.donor_id == current_user.id)
        .options(selectinload(models.Donation.campaign))
    )
    donation = result.scalar_one_or_none()
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")
        
    if not donation.transaction_hash:
        raise HTTPException(status_code=400, detail="Donation does not have an attached transaction hash")

    expected_lovelace = int(donation.amount * 1_000_000)
    is_valid = blockfrost_service.verify_tx_amount(
        tx_hash=donation.transaction_hash,
        expected_lovelace=expected_lovelace,
        receiver_address=donation.campaign.wallet_address or ""
    )

    if is_valid:
        if donation.status != models.DonationStatus.COMPLETED:
            donation.status = models.DonationStatus.COMPLETED
            donation.campaign.current_amount += donation.amount
        await db.commit()
        await db.refresh(donation)
    else:
        raise HTTPException(status_code=400, detail="On-chain transaction verification failed")

    return donation

@router.get("/my-donations", response_model=List[schemas.DonationResponse])
async def read_my_donations(db: AsyncSession = Depends(get_db), current_user: models.User = Depends(dependencies.get_current_user)):
    result = await db.execute(select(models.Donation).where(models.Donation.donor_id == current_user.id))
    return result.scalars().all()

@router.get("/campaign/{campaign_id}", response_model=List[schemas.DonationResponse])
async def read_campaign_donations(campaign_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.Donation).where(models.Donation.campaign_id == campaign_id))
    return result.scalars().all()
