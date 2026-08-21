import random
import string
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta, timezone
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

class EmailService:
    """
    Email service for sending verification OTPs.
    Supports both SMTP (real email) and Console (mock) modes.
    """
    
    def __init__(self):
        self.smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.sender_email = os.getenv("SMTP_EMAIL")
        self.sender_password = os.getenv("SMTP_PASSWORD")
    
    @staticmethod
    def generate_otp(length: int = 6) -> str:
        """Generate a random numeric OTP"""
        return ''.join(random.choices(string.digits, k=length))
    
    def send_verification_email(self, email: str, otp: str) -> bool:
        """
        Send verification email with OTP.
        If SMTP credentials are set, sends real email.
        Otherwise, prints to console.
        """
        if self.sender_email and self.sender_password:
            return self._send_smtp_email(email, otp)
        else:
            return self._send_console_email(email, otp)

    def _send_console_email(self, email: str, otp: str) -> bool:
        print(f"\n{'='*50}")
        print(f"📧 EMAIL VERIFICATION (MOCK)")
        print(f"{'='*50}")
        print(f"To: {email}")
        print(f"Subject: Verify Your Email - Dono Platform")
        print(f"\nYour verification code is: {otp}")
        print(f"This code will expire in 10 minutes.")
        print(f"{'='*50}\n")
        return True

    def _send_smtp_email(self, email: str, otp: str) -> bool:
        try:
            message = MIMEMultipart()
            message["From"] = self.sender_email
            message["To"] = email
            message["Subject"] = "Verify Your Email - Dono Platform"

            body = f"""
            <html>
                <body>
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                        <h2 style="color: #4F46E5; text-align: center;">Welcome to Dono!</h2>
                        <p>Thank you for signing up. Please use the verification code below to activate your account:</p>
                        <div style="background-color: #F3F4F6; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
                            <h1 style="letter-spacing: 5px; color: #1F2937; margin: 0;">{otp}</h1>
                        </div>
                        <p>This code will expire in 10 minutes.</p>
                        <p style="color: #6B7280; font-size: 12px; text-align: center; margin-top: 30px;">If you didn't request this, please ignore this email.</p>
                    </div>
                </body>
            </html>
            """
            
            message.attach(MIMEText(body, "html"))

            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.sender_email, self.sender_password)
                server.send_message(message)
            
            print(f"✅ Email sent successfully to {email}")
            return True
        except Exception as e:
            print(f"❌ Failed to send email: {str(e)}")
            # Fallback to console if SMTP fails
            return self._send_console_email(email, otp)
    
    @staticmethod
    def is_otp_expired(created_at: datetime, expiry_minutes: int = 10) -> bool:
        """Check if OTP has expired"""
        expiry_time = created_at + timedelta(minutes=expiry_minutes)
        if created_at.tzinfo is None:
            return datetime.now(timezone.utc).replace(tzinfo=None) > expiry_time
        return datetime.now(timezone.utc) > expiry_time

email_service = EmailService()
