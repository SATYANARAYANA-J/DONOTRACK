import pytest
from httpx import AsyncClient
from app import models
from app.utils import get_password_hash
from sqlalchemy.ext.asyncio import AsyncSession

@pytest.mark.asyncio
async def test_admin_access(async_client: AsyncClient, db_session: AsyncSession):
    # 1. Create Admin User
    admin_email = "admin_test@test.com"
    admin_password = "password"
    hashed_password = get_password_hash(admin_password)
    admin_user = models.User(email=admin_email, hashed_password=hashed_password, role=models.UserRole.ADMIN, is_email_verified=True)
    db_session.add(admin_user)
    await db_session.commit()

    # 2. Login as Admin
    response = await async_client.post("/auth/login", json={"email": admin_email, "password": admin_password})
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 3. Access Stats
    response = await async_client.get("/admin/stats", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "total_users" in data
    assert "total_campaigns" in data

    # 4. Access Users
    response = await async_client.get("/admin/users", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_admin_forbidden(async_client: AsyncClient, db_session: AsyncSession):
    # 1. Create Normal User
    user_email = "user_test@test.com"
    user_password = "password"
    hashed_password = get_password_hash(user_password)
    user = models.User(email=user_email, hashed_password=hashed_password, role=models.UserRole.DONOR, is_email_verified=True)
    db_session.add(user)
    await db_session.commit()

    # 2. Login as User
    response = await async_client.post("/auth/login", json={"email": user_email, "password": user_password})
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 3. Try Access Stats (Should Fail)
    response = await async_client.get("/admin/stats", headers=headers)
    assert response.status_code == 403
