from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from .. import schemas, models, dependencies
from ..database import get_db

router = APIRouter(
    prefix="/donor",
    tags=["Donor"]
)

# Donor receipt and update endpoints. Profile management is handled canonically via profile.py (/profile/donor).

from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from fastapi.responses import StreamingResponse
import io

from sqlalchemy.orm import joinedload

@router.get("/donations/{donation_id}/receipt")
async def download_receipt(
    donation_id: int,
    current_user: models.User = Depends(dependencies.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if current_user.role != models.UserRole.DONOR:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    # Fetch donation with campaign and NGO details
    result = await db.execute(
        select(models.Donation)
        .where(models.Donation.id == donation_id, models.Donation.donor_id == current_user.id)
        .options(
            joinedload(models.Donation.campaign).joinedload(models.Campaign.ngo).joinedload(models.User.ngo_profile)
        )
    )
    donation = result.scalar_one_or_none()
    
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")
        
    # Generate PDF
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter
    
    # Header
    p.setFont("Helvetica-Bold", 24)
    p.drawString(50, height - 50, "Donation Receipt")
    
    p.setFont("Helvetica", 12)
    p.drawString(50, height - 80, f"Date: {donation.created_at.strftime('%Y-%m-%d')}")
    p.drawString(50, height - 100, f"Receipt ID: #{donation.id}")
    
    # Donor Details
    p.setFont("Helvetica-Bold", 14)
    p.drawString(50, height - 140, "Donor Information")
    p.setFont("Helvetica", 12)
    p.drawString(50, height - 160, f"Name: {current_user.email}") # Using email as name for now
    
    # Donation Details
    p.setFont("Helvetica-Bold", 14)
    p.drawString(50, height - 200, "Donation Details")
    p.setFont("Helvetica", 12)
    p.drawString(50, height - 220, f"Campaign: {donation.campaign.title}")
    p.drawString(50, height - 240, f"NGO: {donation.campaign.ngo.ngo_profile.org_name}")
    p.drawString(50, height - 260, f"Amount: {donation.amount} ADA")
    p.drawString(50, height - 280, f"Transaction Hash: {donation.transaction_hash or 'Pending'}")
    
    # Footer
    p.setFont("Helvetica-Oblique", 10)
    p.drawString(50, 50, "Thank you for your support! This receipt is electronically generated.")
    p.drawString(50, 35, "DoNoTrack - Transparent Giving on Cardano")
    
    p.showPage()
    p.save()
    
    buffer.seek(0)
    return StreamingResponse(
        buffer, 
        media_type="application/pdf", 
        headers={"Content-Disposition": f"attachment; filename=receipt_{donation.id}.pdf"}
    )

@router.get("/donations/{donation_id}/updates", response_model=list[schemas.UpdateResponse])
async def get_donation_updates(
    donation_id: int,
    current_user: models.User = Depends(dependencies.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if current_user.role != models.UserRole.DONOR:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    # Verify donation ownership
    result = await db.execute(
        select(models.Donation)
        .where(models.Donation.id == donation_id, models.Donation.donor_id == current_user.id)
    )
    donation = result.scalar_one_or_none()
    
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")
        
    # Fetch updates for the campaign
    result = await db.execute(
        select(models.SpendingUpdate)
        .where(models.SpendingUpdate.campaign_id == donation.campaign_id)
        .order_by(models.SpendingUpdate.created_at.desc())
    )
    return result.scalars().all()
