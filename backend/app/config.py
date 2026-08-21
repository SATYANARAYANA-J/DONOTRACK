from pydantic_settings import BaseSettings
from pydantic import ConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite+aiosqlite:///:memory:"
    SECRET_KEY: str = "donotrack_secret_key_change_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    BLOCKFROST_PROJECT_ID: str | None = None
    BLOCKFROST_IPFS_PROJECT_ID: str | None = None
    CLERK_DOMAIN: str = "moral-rabbit-21.clerk.accounts.dev"

    model_config = ConfigDict(env_file=".env", extra="ignore")

settings = Settings()

