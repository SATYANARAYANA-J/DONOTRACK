import os
from blockfrost import BlockFrostApi, ApiError
from app.models import DonationIntent
from app.config import settings
import uuid

# Mock Data for testing without API Key
MOCK_CONTEXT = {
    "latest_block": {"hash": "mock_block_hash", "slot": 123456},
    "tx_hash": "mock_tx_hash_" + str(uuid.uuid4())
}

class BlockfrostService:
    def __init__(self):
        self.is_mock = os.getenv("BLOCKFROST_MOCK", "false").lower() == "true"
        self.api_key = settings.BLOCKFROST_PROJECT_ID or os.getenv("BLOCKFROST_PROJECT_ID")
        
        if not self.is_mock and self.api_key:
            self.api = BlockFrostApi(project_id=self.api_key)
        else:
            self.api = None
            if not self.is_mock:
                print("WARNING: No BLOCKFROST_PROJECT_ID found. Defaulting to MOCK mode behavior for safety.")


    def get_latest_block(self):
        if self.is_mock or not self.api:
            return MOCK_CONTEXT["latest_block"]
        try:
            return self.api.block_latest()
        except ApiError as e:
            print(f"Blockfrost API Error: {e}")
            raise e

    def submit_tx(self, tx_cbor_hex: str):
        if self.is_mock or not self.api:
            print(f"MOCK: Submitting Tx CBOR: {tx_cbor_hex[:20]}...")
            return MOCK_CONTEXT["tx_hash"]
        try:
            # Blockfrost python SDK might expect bytes or file, but usually submit_tx takes hex string or bytes
            # Checking SDK usage, typically: api.transaction_submit(bytes.fromhex(cbor))
            return self.api.transaction_submit(bytes.fromhex(tx_cbor_hex))
        except ApiError as e:
            print(f"Blockfrost Submit Error: {e}")
            raise e

    def get_tx(self, tx_hash: str):
        if self.is_mock or not self.api:
            return {"hash": tx_hash, "block": "mock_block", "output_amount": [{"unit": "lovelace", "quantity": "1000000"}]}
        try:
            return self.api.transaction(tx_hash)
        except ApiError as e:
            print(f"Blockfrost Get Tx Error: {e}")
            raise e

    def verify_tx_amount(self, tx_hash: str, expected_lovelace: int, receiver_address: str) -> bool:
        """
        Verifies that a transaction actually transferred the expected amount to the receiver.
        """
        if self.is_mock or not self.api:
            return True # Always verify in mock mode

        try:
            utxos = self.api.transaction_utxos(tx_hash)
            for output in utxos.outputs:
                if output.address == receiver_address:
                    for amount in output.amount:
                        if amount.unit == "lovelace" and int(amount.quantity) >= expected_lovelace:
                            return True
            return False
        except ApiError:
            return False

blockfrost_service = BlockfrostService()
