from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str
    full_name: str
    role: str = "donor"

class UserResponse(UserBase):
    id: int
    role: str
    full_name: str | None = None
    is_active: bool
    is_email_verified: bool
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class EmailRequest(BaseModel):
    email: EmailStr

class EmailVerificationRequest(BaseModel):
    email: EmailStr
    otp: str

class CampaignBase(BaseModel):
    title: str
    description: str
    goal_amount: float
    end_date: datetime
    wallet_address: str | None = None

class CampaignCreate(CampaignBase):
    pass

class CampaignResponse(CampaignBase):
    id: int
    current_amount: float
    status: str
    ngo_id: int
    start_date: datetime
    
    model_config = ConfigDict(from_attributes=True)

class DonationCreate(BaseModel):
    amount: float
    campaign_id: int
    transaction_hash: str | None = None

class DonationResponse(BaseModel):
    id: int
    amount: float
    status: str
    transaction_hash: str | None
    created_at: datetime
    campaign_id: int
    
    model_config = ConfigDict(from_attributes=True)

class UpdateCreate(BaseModel):
    title: str
    description: str
    amount: float
    proof_url: str | None = None
    campaign_id: int

class UpdateResponse(BaseModel):
    id: int
    title: str
    description: str
    amount: float
    proof_url: str | None
    created_at: datetime
    campaign_id: int
    
    model_config = ConfigDict(from_attributes=True)

class DonationIntentCreate(BaseModel):
    ngo_id: int
    amount: float
    metadata: dict

class DonationIntentResponse(BaseModel):
    intent_id: str
    ngo_address: str
    expected_amount_lovelace: int
    expires_at: datetime

class SubmitTxRequest(BaseModel):
    intent_id: str
    tx_cbor: str
    tx_hash: str

class NGOProfileBase(BaseModel):
    org_name: str
    reg_number: str | None = None
    address: str | None = None
    contact_person: str | None = None
    wallet_address: str | None = None

class NGOProfileResponse(NGOProfileBase):
    id: int
    user_id: int
    kyc_status: str
    
    model_config = ConfigDict(from_attributes=True)

class NGOSignupRequest(BaseModel):
    email: EmailStr
    password: str
    org_name: str
    reg_number: str | None = None
    address: str | None = None
    contact_person: str | None = None

class KYCDocumentResponse(BaseModel):
    id: int
    document_type: str
    file_url: str
    uploaded_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class NGOProfileDetailResponse(NGOProfileResponse):
    kyc_documents: list[KYCDocumentResponse] = []

# Donor Profile Schemas
class DonorProfileBase(BaseModel):
    country: str | None = None
    state_city: str | None = None
    interests: str | None = None
    phone_number: str | None = None
    profile_picture_url: str | None = None
    preferred_causes: list[str] | None = None
    preferred_ngo_types: list[str] | None = None
    monthly_donation_goal: float | None = None
    preferred_currency: str = "ADA"
    wallet_address: str | None = None
    wallet_provider: str | None = None
    wallet_connected: bool = False
    consent_onchain_storage: bool = False
    is_anonymous: bool = False

class DonorProfileCreate(DonorProfileBase):
    pass

class DonorProfileUpdate(DonorProfileBase):
    pass

class DonorProfileResponse(DonorProfileBase):
    id: int
    user_id: int
    
    model_config = ConfigDict(from_attributes=True)

class NotificationBase(BaseModel):
    title: str
    message: str

class NotificationCreate(NotificationBase):
    user_id: int

class NotificationResponse(NotificationBase):
    id: int
    is_read: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class DisputeBase(BaseModel):
    subject: str
    description: str
    donation_id: int | None = None

class DisputeCreate(DisputeBase):
    pass

class DisputeResponse(DisputeBase):
    id: int
    user_id: int
    status: str
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

