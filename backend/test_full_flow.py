import asyncio
import httpx
import random
import string

BASE_URL = "http://127.0.0.1:8000"

def generate_random_string(length=8):
    return ''.join(random.choices(string.ascii_lowercase, k=length))

async def run_flow():
    async with httpx.AsyncClient(base_url=BASE_URL, timeout=10.0) as client:
        print("Starting Backend Verification Flow...\n")

        # 1. Signup NGO
        ngo_email = f"ngo_{generate_random_string()}@example.com"
        ngo_password = "Password123"
        print(f"1. Signing up NGO ({ngo_email})...")
        response = await client.post("/auth/signup/ngo", json={
            "email": ngo_email,
            "password": ngo_password,
            "org_name": "Test NGO Foundation",
            "reg_number": "REG-999",
            "address": "123 Test Lane",
            "contact_person": "Test Director"
        })
        if response.status_code == 200:
            print("   NGO Signup Successful")
        else:
            print(f"   NGO Signup Failed: {response.text}")
            return

        # 1.5 Verify NGO Email
        print(f"   Verifying NGO Email...")
        
        # Trigger OTP generation
        otp_response = await client.post("/auth/send-otp", json={"email": ngo_email})
        if otp_response.status_code != 200:
             print(f"   ❌ Failed to send OTP: {otp_response.text}")
             return
        from sqlalchemy.ext.asyncio import create_async_engine
        from sqlalchemy import text
        DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///:memory:")
        engine = create_async_engine(DATABASE_URL)
        
        async with engine.connect() as conn:
             # Fetch OTP using parameterized query
             result = await conn.execute(
                 text("SELECT otp FROM email_verifications WHERE email = :email ORDER BY created_at DESC LIMIT 1"),
                 {"email": ngo_email}
             )
             otp = result.scalar()
             
             verify_res = await client.post("/auth/verify-otp", json={"email": ngo_email, "otp": otp})
             if verify_res.status_code == 200:
                  print("   ✅ NGO Email Verified")
             else:
                  print(f"   ❌ NGO Email Verification Failed: {verify_res.text}")
                  return

        # 2. Login NGO
        print(f"\n2. Logging in NGO...")
        response = await client.post("/auth/login", json={
            "email": ngo_email,
            "password": ngo_password
        })
        if response.status_code == 200:
            token = response.json()["access_token"]
            headers = {"Authorization": f"Bearer {token}"}
            print("   ✅ NGO Login Successful")
        else:
            print(f"   ❌ NGO Login Failed: {response.text}")
            return

        # 3. Create Campaign
        print(f"\n3. Creating Campaign...")
        response = await client.post("/campaigns/", json={
            "title": "Clean Water Initiative",
            "description": "Providing clean water to villages",
            "goal_amount": 5000.0,
            "end_date": "2025-12-31T23:59:59",
            "wallet_address": "addr_test1qpk2...test"
        }, headers=headers)
        if response.status_code == 200:
            campaign_id = response.json()["id"]
            print(f"   ✅ Campaign Created (ID: {campaign_id})")
        else:
            print(f"   ❌ Campaign Creation Failed: {response.text}")
            return

        # 4. Signup Donor
        donor_email = f"donor_{generate_random_string()}@example.com"
        donor_password = "Password123"
        print(f"\n4. Signing up Donor ({donor_email})...")
        response = await client.post("/auth/signup", json={
            "email": donor_email,
            "password": donor_password,
            "role": "donor",
            "full_name": "Test Donor"
        })
        if response.status_code == 200:
            print("   ✅ Donor Signup Successful")
        else:
            print(f"   ❌ Donor Signup Failed: {response.text}")
            return

        # 4.5 Verify Donor Email
        print(f"   Verifying Donor Email...")
        
        # Trigger OTP generation
        otp_response = await client.post("/auth/send-otp", json={"email": donor_email})
        if otp_response.status_code != 200:
             print(f"   ❌ Failed to send OTP: {otp_response.text}")
             return

        async with engine.connect() as conn:
             result = await conn.execute(
                 text("SELECT otp FROM email_verifications WHERE email = :email ORDER BY created_at DESC LIMIT 1"),
                 {"email": donor_email}
             )
             otp = result.scalar()
        
        if otp:
            print(f"   Found OTP: {otp}")
            verify_response = await client.post("/auth/verify-email", json={
                "email": donor_email,
                "otp": otp
            })
            if verify_response.status_code == 200:
                 print("   ✅ Donor Email Verified")
            else:
                 print(f"   ❌ Donor Email Verification Failed: {verify_response.text}")
                 return
        else:
             print("   ❌ Could not find OTP in database")
             return

        # 5. Login Donor
        print("\n5. Logging in Donor...")
        response = await client.post("/auth/login", json={
            "email": donor_email,
            "password": donor_password
        })
        if response.status_code == 200:
            donor_token = response.json()["access_token"]
            print("   ✅ Donor Login Successful")
        else:
            print(f"   ❌ Donor Login Failed: {response.text}")
            return

        # 6. Donate to Campaign
        print("\n6️⃣  Donating to Campaign...")
        donor_headers = {"Authorization": f"Bearer {donor_token}"}
        response = await client.post("/donations/", headers=donor_headers, json={
            "campaign_id": campaign_id,
            "amount": 100.0,
            "transaction_hash": "tx_hash_mock_123"
        })
        if response.status_code == 200:
            donation_id = response.json()["id"]
            print(f"   ✅ Donation Successful (ID: {donation_id})")
        else:
            print(f"   ❌ Donation Failed: {response.text}")
            return

        # 7. Verify Campaign Progress
        print("\n7️⃣  Verifying Campaign Progress...")
        response = await client.get(f"/campaigns/{campaign_id}")
        if response.status_code == 200:
            campaign_data = response.json()
            current_amount = campaign_data["current_amount"]
            print(f"   ✅ Campaign Current Amount: {current_amount} (Expected: 100.0)")
            if current_amount == 100.0:
                print("   🎉 Verification Complete: Backend is working correctly!")
            else:
                print("   ⚠️  Amount Mismatch!")
        else:
            print(f"   ❌ Failed to fetch campaign: {response.text}")

if __name__ == "__main__":
    asyncio.run(run_flow())
