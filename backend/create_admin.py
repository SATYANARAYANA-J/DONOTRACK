import asyncio
from app.database import AsyncSessionLocal
from app import models
from app.utils import get_password_hash
from sqlalchemy import select

import os

async def create_admin():
    admin_email = os.getenv("ADMIN_EMAIL", "admin@donotrack.com")
    admin_password = os.getenv("ADMIN_PASSWORD", "AdminPassword123!")

    async with AsyncSessionLocal() as db:
        # Check if admin exists
        result = await db.execute(select(models.User).where(models.User.email == admin_email))
        existing_admin = result.scalar_one_or_none()
        
        if existing_admin:
            print("Admin user already exists.")
            return

        # Create Admin
        admin_user = models.User(
            email=admin_email,
            hashed_password=get_password_hash(admin_password),
            role=models.UserRole.ADMIN,
            is_active=True,
            is_email_verified=True
        )
        db.add(admin_user)
        await db.commit()
        print(f"Admin user ({admin_email}) created successfully!")

if __name__ == "__main__":
    asyncio.run(create_admin())
