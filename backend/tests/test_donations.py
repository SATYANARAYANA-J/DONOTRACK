import pytest
from httpx import AsyncClient
from app import models
from app.utils import get_password_hash
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from datetime import datetime, timedelta, timezone

@pytest.mark.asyncio
async def test_create_donation(async_client: AsyncClient, db_session: AsyncSession):
    # 1. Create NGO and Campaign
    ngo_user = models.User(email="ngo_don@test.com", hashed_password=get_password_hash("pass"), role=models.UserRole.NGO, is_email_verified=True)
    db_session.add(ngo_user)
    await db_session.commit()
    
    campaign = models.Campaign(
        title="Donation Campaign", 
        description="Desc", 
        goal_amount=1000.0, 
        end_date=datetime.now(timezone.utc) + timedelta(days=30), 
        ngo_id=ngo_user.id
    )
    db_session.add(campaign)
    await db_session.commit()

    # 2. Create Donor
    donor_email = "donor@test.com"
    donor_password = "password"
    donor_user = models.User(email=donor_email, hashed_password=get_password_hash(donor_password), role=models.UserRole.DONOR, is_email_verified=True)
    db_session.add(donor_user)
    await db_session.commit()

    # 3. Login as Donor
    response = await async_client.post("/auth/login", json={"email": donor_email, "password": donor_password})
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 4. Make Donation
    donation_data = {
        "amount": 50.0,
        "campaign_id": campaign.id,
        "transaction_hash": "tx_123"
    }
    response = await async_client.post("/donations/", json=donation_data, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["amount"] == 50.0
    assert data["status"] in ["completed", "pending"]

    # 5. Verify Campaign Amount Updated
    await db_session.refresh(campaign)
    assert campaign.current_amount == 50.0

@pytest.mark.asyncio
async def test_my_donations(async_client: AsyncClient, db_session: AsyncSession):
    donor_email = "donor2@test.com"
    donor_password = "password"
    donor_user = models.User(email=donor_email, hashed_password=get_password_hash(donor_password), role=models.UserRole.DONOR, is_email_verified=True)
    db_session.add(donor_user)
    await db_session.commit()

    response = await async_client.post("/auth/login", json={"email": donor_email, "password": donor_password})
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    response = await async_client.get("/donations/my-donations", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)
