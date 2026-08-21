from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from .. import models
from ..database import get_db

router = APIRouter(
    prefix="/stats",
    tags=["Stats"]
)

@router.get("/public")
async def get_public_stats(db: AsyncSession = Depends(get_db)):
    # Total Donations Amount
    total_donations_query = select(func.sum(models.Donation.amount))
    total_donations_result = await db.execute(total_donations_query)
    total_donations = total_donations_result.scalar() or 0.0

    # Total NGOs
    total_ngos_query = select(func.count(models.User.id)).where(models.User.role == models.UserRole.NGO)
    total_ngos_result = await db.execute(total_ngos_query)
    total_ngos = total_ngos_result.scalar() or 0

    # Total Campaigns
    total_campaigns_query = select(func.count(models.Campaign.id))
    total_campaigns_result = await db.execute(total_campaigns_query)
    total_campaigns = total_campaigns_result.scalar() or 0

    # Transparency score based on ratio of spending updates with IPFS proofs attached
    total_updates_res = await db.execute(select(func.count(models.SpendingUpdate.id)))
    total_updates = total_updates_res.scalar() or 0

    proof_updates_res = await db.execute(
        select(func.count(models.SpendingUpdate.id)).where(models.SpendingUpdate.proof_url.isnot(None))
    )
    proof_updates = proof_updates_res.scalar() or 0

    transparency_score = round((proof_updates / total_updates * 100), 1) if total_updates > 0 else 100.0

    return {
        "total_donations": total_donations,
        "total_ngos": total_ngos,
        "total_campaigns": total_campaigns,
        "transparency_score": transparency_score
    }
