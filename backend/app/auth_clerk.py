import jwt
from jwt import PyJWKClient
from fastapi import HTTPException, status
from .config import settings

# Derive JWKS URL from Publishable Key or set explicitly
# Example PK: pk_test_bW9yYWwtcmFiYml0LTIxLmNsZXJrLmFjY291bnRzLmRldiQ
# Domain: moral-rabbit-21.clerk.accounts.dev
# We can also just put the domain in .env
CLERK_DOMAIN = settings.CLERK_DOMAIN or "moral-rabbit-21.clerk.accounts.dev" 
JWKS_URL = f"https://{CLERK_DOMAIN}/.well-known/jwks.json"

jwks_client = PyJWKClient(JWKS_URL)

def verify_clerk_token(token: str):
    try:
        signing_key = jwks_client.get_signing_key_from_jwt(token)
        decode_options = {}
        if getattr(settings, "CLERK_AUDIENCE", None):
            decode_options["verify_aud"] = True
            aud = settings.CLERK_AUDIENCE
        else:
            decode_options["verify_aud"] = False
            aud = None

        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            audience=aud,
            options=decode_options
        )
        return payload
    except jwt.PyJWTError as e:
        print(f"JWT Verification Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        print(f"Unexpected Error verifying token: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )
