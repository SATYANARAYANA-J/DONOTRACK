from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timedelta, timezone
import uuid
import json

from .. import schemas, models, dependencies
from ..database import get_db
from ..services.blockfrost_service import blockfrost_service

router = APIRouter(
    prefix="/wallet",
    tags=["Wallet"]
)

METADATA_LABEL = 674

@router.post("/create-intent", response_model=schemas.DonationIntentResponse)
async def create_intent(intent: schemas.DonationIntentCreate, db: AsyncSession = Depends(get_db)):
    # 1. Validate Metadata Schema (Basic check for now)
    if "donation_id" not in intent.metadata or "ngo_id" not in intent.metadata:
        raise HTTPException(status_code=400, detail="Invalid metadata: Missing required fields")

    # 2. Get NGO Address (For now, mock or fetch from user profile if we stored it)
    # In a real app, we'd fetch the NGO's wallet address from their profile
    ngo_address = "addr_test1..." # Placeholder or fetch from DB
    
    # 3. Create Intent Record
    intent_id = str(uuid.uuid4())
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=30)
    
    new_intent = models.DonationIntent(
        intent_id=intent_id,
        ngo_id=intent.ngo_id,
        amount=intent.amount,
        expires_at=expires_at
    )
    db.add(new_intent)
    await db.commit()
    
    return schemas.DonationIntentResponse(
        intent_id=intent_id,
        ngo_address=ngo_address,
        expected_amount_lovelace=int(intent.amount * 1000000), # Convert ADA to Lovelace
        expires_at=expires_at
    )

@router.post("/submit-tx")
async def submit_tx(request: schemas.SubmitTxRequest, db: AsyncSession = Depends(get_db)):
    # 1. Check Intent
    result = await db.execute(select(models.DonationIntent).where(models.DonationIntent.intent_id == request.intent_id))
    intent_record = result.scalar_one_or_none()
    
    if not intent_record:
        raise HTTPException(status_code=404, detail="Intent not found")
        
    if intent_record.status == "CONFIRMED":
        return {"status": "success", "message": "Transaction already confirmed", "tx_hash": intent_record.tx_hash}

    # 2. Submit to Blockfrost via thread executor to keep event loop responsive
    try:
        import asyncio
        submitted_tx_hash = await asyncio.to_thread(blockfrost_service.submit_tx, request.tx_cbor)
        
        # Verify it matches what frontend said (optional but good sanity check)
        # if submitted_tx_hash != request.tx_hash:
        #     print("Warning: Submitted hash differs from request hash")

        # 3. Update DB
        intent_record.status = "CONFIRMED"
        intent_record.tx_hash = submitted_tx_hash
        await db.commit()
        
        return {"status": "success", "tx_hash": submitted_tx_hash}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transaction submission failed: {str(e)}")
