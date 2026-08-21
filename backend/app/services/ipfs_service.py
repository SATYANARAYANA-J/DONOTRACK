import os
from blockfrost import BlockFrostIPFS, ApiError

class IPFSService:
    def __init__(self):
        # Use the specific IPFS Project ID
        self.api_key = os.getenv("BLOCKFROST_IPFS_PROJECT_ID")
        self.ipfs = None
        
        if self.api_key:
            try:
                self.ipfs = BlockFrostIPFS(project_id=self.api_key)
            except Exception as e:
                print(f"Failed to initialize BlockFrostIPFS: {e}")

    def upload_file(self, file_path: str) -> str:
        """
        Uploads a file to IPFS via Blockfrost.
        Returns the IPFS CID (Hash).
        """
        if not self.ipfs:
            print("IPFS Service not initialized (Missing Project ID)")
            return None

        try:
            # Blockfrost SDK expects a file path
            response = self.ipfs.add(file_path)
            return response.ipfs_hash
        except ApiError as e:
            print(f"Blockfrost IPFS Upload Error: {e}")
            raise e

    def get_gateway_url(self, ipfs_hash: str) -> str:
        """
        Returns a public gateway URL for the given IPFS hash.
        """
        return f"https://ipfs.io/ipfs/{ipfs_hash}"

ipfs_service = IPFSService()
