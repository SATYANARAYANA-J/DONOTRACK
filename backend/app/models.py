from sqlalchemy import String, Boolean, Integer, DateTime, Enum, Float, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime, timezone
from .database import Base
import enum

def utc_now():
    return datetime.now(timezone.utc)

class UserRole(str, enum.Enum):
    DONOR = "donor"
    NGO = "ngo"
    ADMIN = "admin"

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=True) # Nullable for Clerk users
    clerk_id: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=True)
    full_name: Mapped[str] = mapped_column(String(255), nullable=True)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole), default=UserRole.DONOR)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_suspended: Mapped[bool] = mapped_column(Boolean, default=False)
    is_email_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    
    campaigns: Mapped[list["Campaign"]] = relationship(back_populates="ngo")
    donations: Mapped[list["Donation"]] = relationship(back_populates="donor")
    ngo_profile: Mapped["NGOProfile"] = relationship(back_populates="user", uselist=False)
    donor_profile: Mapped["DonorProfile"] = relationship(back_populates="user", uselist=False)
    notifications: Mapped[list["Notification"]] = relationship(back_populates="user")
    disputes: Mapped[list["Dispute"]] = relationship(back_populates="user")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    action: Mapped[str] = mapped_column(String(255))
    actor_id: Mapped[int] = mapped_column(Integer) # ID of user performing action
    target_id: Mapped[int] = mapped_column(Integer, nullable=True) # ID of affected entity
    details: Mapped[str] = mapped_column(Text, nullable=True) # JSON string
    ip_address: Mapped[str] = mapped_column(String(50), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class CampaignStatus(str, enum.Enum):
    ACTIVE = "active"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class Campaign(Base):
    __tablename__ = "campaigns"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255), index=True)
    description: Mapped[str] = mapped_column(String(1000)) # Using String for now, could be Text
    goal_amount: Mapped[float] = mapped_column(Float)
    current_amount: Mapped[float] = mapped_column(Float, default=0.0)
    start_date: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    end_date: Mapped[datetime] = mapped_column(DateTime)
    status: Mapped[CampaignStatus] = mapped_column(Enum(CampaignStatus), default=CampaignStatus.ACTIVE)
    wallet_address: Mapped[str] = mapped_column(String(255), nullable=True) # Cardano wallet address
    ngo_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

    ngo: Mapped["User"] = relationship(back_populates="campaigns")
    donations: Mapped[list["Donation"]] = relationship(back_populates="campaign")
    updates: Mapped[list["SpendingUpdate"]] = relationship(back_populates="campaign")

class DonationStatus(str, enum.Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"

class Donation(Base):
    __tablename__ = "donations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    amount: Mapped[float] = mapped_column(Float)
    transaction_hash: Mapped[str] = mapped_column(String(255), nullable=True)
    status: Mapped[DonationStatus] = mapped_column(Enum(DonationStatus), default=DonationStatus.PENDING)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    
    donor_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    campaign_id: Mapped[int] = mapped_column(ForeignKey("campaigns.id"))

    donor: Mapped["User"] = relationship(back_populates="donations")
    campaign: Mapped["Campaign"] = relationship(back_populates="donations")

class SpendingUpdate(Base):
    __tablename__ = "spending_updates"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(Text)
    ngo_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    amount: Mapped[float] = mapped_column(Float)
    status: Mapped[str] = mapped_column(String(50), default="PENDING")
    proof_url: Mapped[str] = mapped_column(String(500), nullable=True)
    tx_hash: Mapped[str] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    expires_at: Mapped[datetime] = mapped_column(DateTime)
    campaign_id: Mapped[int] = mapped_column(ForeignKey("campaigns.id"))

    campaign: Mapped["Campaign"] = relationship(back_populates="updates")

class KYCStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class NGOProfile(Base):
    __tablename__ = "ngo_profiles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True)
    org_name: Mapped[str] = mapped_column(String(255))
    reg_number: Mapped[str] = mapped_column(String(255), nullable=True)
    address: Mapped[str] = mapped_column(Text, nullable=True)
    contact_person: Mapped[str] = mapped_column(String(255), nullable=True)
    kyc_status: Mapped[KYCStatus] = mapped_column(Enum(KYCStatus), default=KYCStatus.PENDING)
    wallet_address: Mapped[str] = mapped_column(String(255), nullable=True)
    
    user: Mapped["User"] = relationship(back_populates="ngo_profile")
    kyc_documents: Mapped[list["KYCDocument"]] = relationship(back_populates="ngo_profile")

class KYCDocument(Base):
    __tablename__ = "kyc_documents"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    ngo_id: Mapped[int] = mapped_column(ForeignKey("ngo_profiles.id"))
    document_type: Mapped[str] = mapped_column(String(50)) # e.g., "registration_cert", "pan_card"
    file_url: Mapped[str] = mapped_column(String(255)) # IPFS or local URL
    uploaded_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    
    ngo_profile: Mapped["NGOProfile"] = relationship(back_populates="kyc_documents")

class DonorProfile(Base):
    __tablename__ = "donor_profiles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True)
    country: Mapped[str] = mapped_column(String(100), nullable=True)
    state_city: Mapped[str] = mapped_column(String(100), nullable=True)
    phone_number: Mapped[str] = mapped_column(String(20), nullable=True)
    profile_picture_url: Mapped[str] = mapped_column(String(500), nullable=True)
    preferred_causes: Mapped[str] = mapped_column(Text, nullable=True) # JSON array
    preferred_ngo_types: Mapped[str] = mapped_column(Text, nullable=True) # JSON array
    monthly_donation_goal: Mapped[float] = mapped_column(Float, nullable=True)
    preferred_currency: Mapped[str] = mapped_column(String(10), default="ADA")
    wallet_address: Mapped[str] = mapped_column(String(255), nullable=True)
    wallet_provider: Mapped[str] = mapped_column(String(50), nullable=True)
    wallet_connected: Mapped[bool] = mapped_column(Boolean, default=False)
    consent_onchain_storage: Mapped[bool] = mapped_column(Boolean, default=False)
    is_anonymous: Mapped[bool] = mapped_column(Boolean, default=False)
    
    user: Mapped["User"] = relationship(back_populates="donor_profile")

class DonationIntent(Base):
    __tablename__ = "donation_intents"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    intent_id: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    ngo_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    amount: Mapped[float] = mapped_column(Float)
    status: Mapped[str] = mapped_column(String(50), default="PENDING")
    tx_hash: Mapped[str] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    expires_at: Mapped[datetime] = mapped_column(DateTime)

class Notification(Base):
    __tablename__ = "notifications"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    title: Mapped[str] = mapped_column(String(255))
    message: Mapped[str] = mapped_column(Text)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

    user: Mapped["User"] = relationship(back_populates="notifications")

class DisputeStatus(str, enum.Enum):
    OPEN = "open"
    RESOLVED = "resolved"
    CLOSED = "closed"

class Dispute(Base):
    __tablename__ = "disputes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    donation_id: Mapped[int] = mapped_column(ForeignKey("donations.id"), nullable=True)
    subject: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(Text)
    status: Mapped[DisputeStatus] = mapped_column(Enum(DisputeStatus), default=DisputeStatus.OPEN)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

    user: Mapped["User"] = relationship(back_populates="disputes")
    donation: Mapped["Donation"] = relationship()

class EmailVerification(Base):
    __tablename__ = "email_verifications"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), index=True)
    otp: Mapped[str] = mapped_column(String(10))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    is_used: Mapped[bool] = mapped_column(Boolean, default=False)
    failed_attempts: Mapped[int] = mapped_column(Integer, default=0)

