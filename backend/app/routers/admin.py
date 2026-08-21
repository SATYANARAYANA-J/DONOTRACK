from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from typing import List, Dict, Any
from datetime import datetime

from .. import schemas, models, dependencies
from ..database import get_db

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
    dependencies=[Depends(dependencies.RoleChecker([models.UserRole.ADMIN]))]
)

@router.get("/stats")
async def get_stats(db: AsyncSession = Depends(get_db)):
    # Total Users
    user_count = await db.scalar(select(func.count(models.User.id)))
    
    # Total Campaigns
    campaign_count = await db.scalar(select(func.count(models.Campaign.id)))
    
    # Total Donations (Count & Volume)
    donation_stats = await db.execute(
        select(
            func.count(models.Donation.id),
            func.sum(models.Donation.amount)
        ).where(models.Donation.status == models.DonationStatus.COMPLETED)
    )
    don_count, don_volume = donation_stats.one()
    
    return {
        "total_users": user_count,
        "total_campaigns": campaign_count,
        "total_donations_count": don_count,
        "total_donations_volume": don_volume or 0.0
    }

@router.get("/users", response_model=List[schemas.UserResponse])
async def list_users(role: str = None, db: AsyncSession = Depends(get_db)):
    query = select(models.User)
    if role:
        query = query.where(models.User.role == role)
    result = await db.execute(query)
    return result.scalars().all()

@router.put("/users/{user_id}/status")
async def update_user_status(user_id: int, is_suspended: bool, db: AsyncSession = Depends(get_db), current_user: models.User = Depends(dependencies.get_current_user)):
    user = await db.get(models.User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.is_suspended = is_suspended
    
    # Log Action
    log = models.AuditLog(
        action="SUSPEND_USER" if is_suspended else "ACTIVATE_USER",
        actor_id=current_user.id,
        target_id=user.id,
        details=f"User status changed to {'suspended' if is_suspended else 'active'}"
    )
    db.add(log)
    
    await db.commit()
    return {"status": "success", "is_suspended": is_suspended}

@router.get("/donations", response_model=List[schemas.DonationResponse])
async def list_donations(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.Donation).order_by(desc(models.Donation.created_at)))
    return result.scalars().all()

@router.get("/audit-logs")
async def list_audit_logs(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.AuditLog).order_by(desc(models.AuditLog.created_at)).limit(100))
    logs = result.scalars().all()
    return logs
