import asyncio
import asyncpg
import os
from dotenv import load_dotenv

load_dotenv()

# Extract connection details from DATABASE_URL or build manually
# DATABASE_URL=postgresql+asyncpg://postgres:password@localhost/donotrack
# We need to connect to 'postgres' db first to create 'donotrack'

DB_USER = os.getenv("POSTGRES_USER", "postgres")
DB_PASS = os.getenv("POSTGRES_PASSWORD", "postgres")
DB_HOST = os.getenv("POSTGRES_HOST", "localhost")
DB_NAME = os.getenv("POSTGRES_DB", "donotrack")

async def create_database():
    print(f"🔌 Connecting to PostgreSQL as {DB_USER}...")
    try:
        # Connect to default 'postgres' database
        conn = await asyncpg.connect(user=DB_USER, password=DB_PASS, host=DB_HOST, database="postgres")
        
        # Check if database exists
        exists = await conn.fetchval(f"SELECT 1 FROM pg_database WHERE datname = '{DB_NAME}'")
        
        if not exists:
            print(f"🔨 Creating database '{DB_NAME}'...")
            await conn.execute(f'CREATE DATABASE "{DB_NAME}"')
            print(f"✅ Database '{DB_NAME}' created successfully!")
        else:
            print(f"ℹ️  Database '{DB_NAME}' already exists.")
            
        await conn.close()
        
    except Exception as e:
        print(f"❌ Error creating database: {e}")

if __name__ == "__main__":
    asyncio.run(create_database())
