import asyncio
import os
from dotenv import load_dotenv

# Load env vars BEFORE importing services that rely on them
load_dotenv()

from app.services.ipfs_service import ipfs_service

def test_ipfs_upload():
    print("🚀 Testing IPFS Upload...")
    
    # Create a dummy file
    dummy_file = "test_proof.txt"
    with open(dummy_file, "w") as f:
        f.write("This is a test proof for DoNoTrack IPFS integration.")
        
    try:
        print(f"1️⃣  Uploading {dummy_file} to IPFS...")
        cid = ipfs_service.upload_file(dummy_file)
        
        if cid:
            print(f"   ✅ Upload Successful!")
            print(f"   📦 CID: {cid}")
            print(f"   🔗 Gateway URL: {ipfs_service.get_gateway_url(cid)}")
        else:
            print("   ❌ Upload Failed: No CID returned.")
            
    except Exception as e:
        print(f"   ❌ Error: {e}")
    finally:
        # Cleanup
        if os.path.exists(dummy_file):
            os.remove(dummy_file)

if __name__ == "__main__":
    test_ipfs_upload()
