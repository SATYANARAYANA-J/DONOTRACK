import pytest
from httpx import AsyncClient
from app import models
from app.utils import get_password_hash
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

@pytest.mark.asyncio
async def test_wallet_flow(async_client: AsyncClient, db_session: AsyncSession):
    # 1. Create NGO
    ngo_email = "ngo_wallet@test.com"
    ngo_password = "password"
    hashed_password = get_password_hash(ngo_password)
    ngo_user = models.User(email=ngo_email, hashed_password=hashed_password, role=models.UserRole.NGO)
    db_session.add(ngo_user)
    await db_session.commit()

    # 2. Create Intent
    intent_data = {
        "ngo_id": ngo_user.id,
        "amount": 100.0,
        "metadata": {
            "donation_id": "123",
            "ngo_id": str(ngo_user.id)
        }
    }
    response = await async_client.post("/wallet/create-intent", json=intent_data)
    assert response.status_code == 200
    data = response.json()
    intent_id = data["intent_id"]
    assert data["expected_amount_lovelace"] == 100000000

    # 3. Submit Tx (Mock)
    submit_data = {
        "intent_id": intent_id,
        "tx_cbor": "mock_cbor_hex_string",
        "tx_hash": "mock_tx_hash_123"
    }
    response = await async_client.post("/wallet/submit-tx", json=submit_data)
    assert response.status_code == 200
    assert response.json()["status"] == "success"
    
    # 4. Verify DB Status
    result = await db_session.execute(select(models.DonationIntent).where(models.DonationIntent.intent_id == intent_id))
    intent_record = result.scalar_one()
    assert intent_record.status == "CONFIRMED"
