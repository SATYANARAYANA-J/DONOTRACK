import pytest
from httpx import AsyncClient
from app import models
from app.utils import get_password_hash
from sqlalchemy.ext.asyncio import AsyncSession

@pytest.mark.asyncio
async def test_create_campaign(async_client: AsyncClient, db_session: AsyncSession):
    # 1. Create NGO User
    ngo_email = "ngo@test.com"
    ngo_password = "password"
    hashed_password = get_password_hash(ngo_password)
    ngo_user = models.User(email=ngo_email, hashed_password=hashed_password, role=models.UserRole.NGO, is_email_verified=True)
    db_session.add(ngo_user)
    await db_session.commit()
    
    # 2. Login to get token
    response = await async_client.post("/auth/login", json={"email": ngo_email, "password": ngo_password})
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 3. Create Campaign
    campaign_data = {
        "title": "Test Campaign",
        "description": "Test Description",
        "goal_amount": 1000.0,
        "end_date": "2025-12-31T23:59:59",
        "wallet_address": "addr_test123"
    }
    response = await async_client.post("/campaigns/", json=campaign_data, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == campaign_data["title"]
    assert data["wallet_address"] == campaign_data["wallet_address"]

@pytest.mark.asyncio
async def test_get_campaigns(async_client: AsyncClient):
    response = await async_client.get("/campaigns/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
