from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from .. import schemas, models, dependencies
from ..database import get_db

router = APIRouter(
    prefix="/campaigns",
    tags=["Campaigns"]
)

@router.get("/", response_model=List[schemas.CampaignResponse])
async def read_campaigns(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.Campaign).offset(skip).limit(limit))
    return result.scalars().all()

@router.post("/", response_model=schemas.CampaignResponse, dependencies=[Depends(dependencies.RoleChecker([models.UserRole.NGO]))])
async def create_campaign(campaign: schemas.CampaignCreate, db: AsyncSession = Depends(get_db), current_user: models.User = Depends(dependencies.get_current_user)):
    new_campaign = models.Campaign(**campaign.model_dump(), ngo_id=current_user.id)
    db.add(new_campaign)
    await db.commit()
    await db.refresh(new_campaign)
    return new_campaign

@router.get("/{campaign_id}", response_model=schemas.CampaignResponse)
async def read_campaign(campaign_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.Campaign).where(models.Campaign.id == campaign_id))
    campaign = result.scalar_one_or_none()
    if campaign is None:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return campaign
