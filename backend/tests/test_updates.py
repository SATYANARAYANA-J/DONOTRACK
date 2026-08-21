import pytest
from httpx import AsyncClient
from app import models
from app.utils import get_password_hash
from sqlalchemy.ext.asyncio import AsyncSession

from datetime import datetime, timedelta, timezone

@pytest.mark.asyncio
async def test_create_update(async_client: AsyncClient, db_session: AsyncSession):
    # 1. Create NGO and Campaign
    ngo_email = "ngo_update@test.com"
    ngo_password = "password"
    hashed_password = get_password_hash(ngo_password)
    ngo_user = models.User(email=ngo_email, hashed_password=hashed_password, role=models.UserRole.NGO, is_email_verified=True)
    db_session.add(ngo_user)
    await db_session.commit()
    
    campaign = models.Campaign(
        title="Update Campaign", 
        description="Desc", 
        goal_amount=1000.0, 
        end_date=datetime.now(timezone.utc) + timedelta(days=30), 
        ngo_id=ngo_user.id
    )
    db_session.add(campaign)
    await db_session.commit()

    # 2. Login as NGO
    response = await async_client.post("/auth/login", json={"email": ngo_email, "password": ngo_password})
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 3. Create Update
    data = {
        "title": "First Update",
        "description": "We bought supplies.",
        "amount": "200.0",
        "campaign_id": str(campaign.id)
    }
    files = {
        "file": ("test_receipt.jpg", b"\xFF\xD8\xFFdummy image content", "image/jpeg")
    }
    response = await async_client.post("/updates/", data=data, files=files, headers=headers)
    assert response.status_code == 200
    res_data = response.json()
    assert res_data["title"] == "First Update"
    assert res_data["amount"] == 200.0

@pytest.mark.asyncio
async def test_get_updates(async_client: AsyncClient, db_session: AsyncSession):
    ngo_user = models.User(email="ngo_get_upd@test.com", hashed_password=get_password_hash("pass"), role=models.UserRole.NGO, is_email_verified=True)
    db_session.add(ngo_user)
    await db_session.commit()

    campaign = models.Campaign(
        title="Get Updates Campaign", 
        description="Desc", 
        goal_amount=1000.0, 
        end_date=datetime.now(timezone.utc) + timedelta(days=30), 
        ngo_id=ngo_user.id
    )
    db_session.add(campaign)
    await db_session.commit()

    response = await async_client.get(f"/updates/campaign/{campaign.id}")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
