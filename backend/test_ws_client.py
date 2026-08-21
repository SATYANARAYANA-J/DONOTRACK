import asyncio
import websockets
import json
import httpx

async def listen():
    uri = "ws://127.0.0.1:8000/ws"
    async with websockets.connect(uri) as websocket:
        print("✅ Connected to WebSocket")
        
        # Trigger a donation in parallel
        asyncio.create_task(trigger_donation())
        
        try:
            while True:
                message = await websocket.recv()
                print(f"📩 Received: {message}")
                data = json.loads(message)
                if data.get("type") == "new_donation":
                    print("🎉 Verification Successful: Real-time update received!")
                    return
        except websockets.exceptions.ConnectionClosed:
            print("❌ Connection Closed")

async def trigger_donation():
    await asyncio.sleep(2) # Wait for WS connection
    print("🚀 Triggering Donation via API...")
    
    # Login first to get token
    async with httpx.AsyncClient() as client:
        # Signup a temp user
        import uuid
        email = f"donor_{uuid.uuid4()}@example.com"
        password = "password123"
        
        signup_res = await client.post("http://127.0.0.1:8000/auth/signup", json={
            "email": email,
            "password": password,
            "role": "donor"
        })
        
        if signup_res.status_code not in [200, 201]:
            print(f"❌ Signup Failed: {signup_res.text}")
            # Try login anyway if user exists
        
        # Login
        login_res = await client.post("http://127.0.0.1:8000/auth/login", json={
            "email": email,
            "password": password
        })
        
        if login_res.status_code != 200:
            print(f"❌ Login Failed: {login_res.text}")
            return

        token = login_res.json()["access_token"]
        
        # Create Donation
        donation_res = await client.post(
            "http://localhost:8000/donations/",
            json={"amount": 100.0, "campaign_id": 1},
            headers={"Authorization": f"Bearer {token}"}
        )
        
        if donation_res.status_code == 200:
            print("✅ Donation Created via API")
        else:
            print(f"❌ Donation Failed: {donation_res.text}")

if __name__ == "__main__":
    asyncio.run(listen())
