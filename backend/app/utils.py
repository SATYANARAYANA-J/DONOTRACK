from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def validate_file_magic_bytes(content: bytes, allowed_extensions: list[str]) -> bool:
    """
    Validates file magic bytes against allowed file signatures.
    """
    MAGIC_SIGNATURES = {
        "jpg": [b"\xFF\xD8\xFF"],
        "jpeg": [b"\xFF\xD8\xFF"],
        "png": [b"\x89PNG\r\n\x1a\n"],
        "pdf": [b"%PDF"]
    }
    
    if not content:
        return False
        
    for ext in allowed_extensions:
        ext_lower = ext.lower().lstrip(".")
        signatures = MAGIC_SIGNATURES.get(ext_lower, [])
        for sig in signatures:
            if content.startswith(sig):
                return True
    return False

