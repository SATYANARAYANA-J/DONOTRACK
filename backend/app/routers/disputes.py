from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from .. import models, schemas, dependencies
from ..database import get_db

router = APIRouter(
    prefix="/disputes",
    tags=["disputes"]
)

@router.post("/", response_model=schemas.DisputeResponse)
async def create_dispute(
    dispute: schemas.DisputeCreate,
    current_user: models.User = Depends(dependencies.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    new_dispute = models.Dispute(
        user_id=current_user.id,
        **dispute.model_dump()
    )
    db.add(new_dispute)
    await db.commit()
    await db.refresh(new_dispute)
    return new_dispute

@router.get("/", response_model=List[schemas.DisputeResponse])
async def get_my_disputes(
    current_user: models.User = Depends(dependencies.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(models.Dispute)
        .where(models.Dispute.user_id == current_user.id)
        .order_by(models.Dispute.created_at.desc())
    )
    return result.scalars().all()
