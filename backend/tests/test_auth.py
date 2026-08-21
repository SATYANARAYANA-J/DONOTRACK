import pytest
from httpx import AsyncClient
from app import models
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

@pytest.mark.asyncio
async def test_signup(async_client: AsyncClient):
    response = await async_client.post("/auth/signup", json={
        "email": "test@example.com",
        "password": "Password123",
        "full_name": "Test User"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "id" in data

@pytest.mark.asyncio
async def test_login(async_client: AsyncClient, db_session: AsyncSession):
    await async_client.post("/auth/signup", json={
        "email": "test_login@example.com",
        "password": "Password123",
        "full_name": "Test User"
    })
    res = await db_session.execute(select(models.User).where(models.User.email == "test_login@example.com"))
    user = res.scalar_one()
    user.is_email_verified = True
    await db_session.commit()

    response = await async_client.post("/auth/login", json={
        "email": "test_login@example.com",
        "password": "Password123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data

