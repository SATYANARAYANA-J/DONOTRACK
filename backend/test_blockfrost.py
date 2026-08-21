import asyncio
import os
from dotenv import load_dotenv
from app.services.blockfrost_service import blockfrost_service

# Load env vars explicitly just in case
load_dotenv()

async def test_connection():
    print("🚀 Testing Blockfrost Connection...")
    
    api_key = os.getenv("BLOCKFROST_PROJECT_ID")
    if not api_key:
        print("❌ Error: BLOCKFROST_PROJECT_ID not found in environment.")
        return

    print(f"🔑 Using Project ID: {api_key[:5]}...{api_key[-5:]}")

    try:
        # 1. Get Latest Block
        print("\n1️⃣  Fetching Latest Block...")
        block = blockfrost_service.get_latest_block()
        print(f"   ✅ Success! Block Hash: {block.hash}")
        print(f"   📦 Slot: {block.slot}")
        print(f"   Height: {block.height}")

        # 2. Get a known transaction (Genesis or recent)
        # We'll try to fetch the latest block's first tx if available, or just skip
        # Actually, let's just check the health/clock if possible, but block is good enough.
        
        print("\n🎉 Blockfrost API is working correctly!")

    except Exception as e:
        print(f"\n❌ Connection Failed: {e}")
        print("Please check your Project ID and internet connection.")

if __name__ == "__main__":
    # We don't need asyncio for the synchronous blockfrost SDK, but good practice if we wrap it later
    # The current service uses the sync SDK.
    test_connection()
