"""
Email utility for sending verification and password reset emails via SMTP.
Uses aiosmtplib for async email delivery through Hostinger mail service.
"""
import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging

from app.config import settings

logger = logging.getLogger(__name__)


async def send_email(to_email: str, subject: str, html_body: str) -> bool:
    """
    Send an email using SMTP (Hostinger or any provider).

    Args:
        to_email: Recipient email address
        subject: Email subject line
        html_body: HTML content of the email

    Returns:
        bool: True if email sent successfully, False otherwise
    """
    try:
        message = MIMEMultipart("alternative")
        message["From"] = f"{settings.MAIL_FROM_NAME} <{settings.MAIL_FROM}>"
        message["To"] = to_email
        message["Subject"] = subject

        html_part = MIMEText(html_body, "html")
        message.attach(html_part)

        await aiosmtplib.send(
            message,
            hostname=settings.MAIL_SERVER,
            port=settings.MAIL_PORT,
            username=settings.MAIL_USERNAME,
            password=settings.MAIL_PASSWORD,
            use_tls=settings.MAIL_USE_TLS,
            start_tls=settings.MAIL_USE_STARTTLS,
        )

        logger.info(f"Email sent successfully to {to_email}")
        return True

    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {str(e)}")
        return False


async def send_verification_email(to_email: str, full_name: str, token: str) -> bool:
    """
    Send email verification link to newly registered user.

    Args:
        to_email: User's email address
        full_name: User's full name
        token: JWT verification token

    Returns:
        bool: True if email sent successfully
    """
    verification_url = f"{settings.FRONTEND_URL}/verify-email?token={token}"

    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#030712;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#030712;padding:40px 20px;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#0f172a 0%,#1e1b4b 100%);border-radius:24px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;">
                        <!-- Header -->
                        <tr>
                            <td style="padding:40px 40px 20px;text-align:center;">
                                <div style="display:inline-block;background:#4f46e5;padding:12px;border-radius:16px;margin-bottom:20px;">
                                    <span style="font-size:28px;">🎯</span>
                                </div>
                                <h1 style="color:#ffffff;font-size:28px;font-weight:800;margin:0 0 8px;letter-spacing:-0.5px;">
                                    Verify Your Email
                                </h1>
                                <p style="color:#94a3b8;font-size:16px;margin:0;">
                                    Welcome to ResumeAI, {full_name}!
                                </p>
                            </td>
                        </tr>

                        <!-- Body -->
                        <tr>
                            <td style="padding:20px 40px;">
                                <p style="color:#cbd5e1;font-size:15px;line-height:1.7;margin:0 0 24px;">
                                    Thank you for creating your account. To get started with AI-powered resume optimization, please verify your email address by clicking the button below.
                                </p>

                                <!-- CTA Button -->
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td align="center" style="padding:10px 0 30px;">
                                            <a href="{verification_url}"
                                               style="display:inline-block;background:linear-gradient(135deg,#06b6d4,#4f46e5,#7c3aed);color:#ffffff;text-decoration:none;padding:16px 48px;border-radius:14px;font-weight:700;font-size:16px;letter-spacing:0.3px;box-shadow:0 8px 32px rgba(79,70,229,0.4);">
                                                ✓&nbsp; Verify Email Address
                                            </a>
                                        </td>
                                    </tr>
                                </table>

                                <p style="color:#64748b;font-size:13px;line-height:1.6;margin:0 0 16px;">
                                    If the button doesn't work, copy and paste this link into your browser:
                                </p>
                                <p style="color:#06b6d4;font-size:13px;word-break:break-all;background:rgba(6,182,212,0.08);padding:14px 18px;border-radius:12px;border:1px solid rgba(6,182,212,0.15);margin:0 0 24px;">
                                    {verification_url}
                                </p>

                                <p style="color:#64748b;font-size:13px;margin:0;">
                                    This verification link will expire in <strong style="color:#94a3b8;">24 hours</strong>.
                                </p>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="padding:24px 40px 32px;border-top:1px solid rgba(255,255,255,0.06);">
                                <p style="color:#475569;font-size:12px;line-height:1.6;margin:0;text-align:center;">
                                    If you didn't create an account with ResumeAI, you can safely ignore this email.
                                    <br/>© {settings.APP_NAME}. All rights reserved.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """

    return await send_email(to_email, "Verify Your Email – ResumeAI", html_body)


async def send_password_reset_email(to_email: str, full_name: str, token: str) -> bool:
    """
    Send password reset link email.

    Args:
        to_email: User's email address
        full_name: User's full name
        token: JWT reset token

    Returns:
        bool: True if email sent successfully
    """
    reset_url = f"{settings.FRONTEND_URL}/reset-password?token={token}"

    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#030712;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#030712;padding:40px 20px;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#0f172a 0%,#1e1b4b 100%);border-radius:24px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;">
                        <!-- Header -->
                        <tr>
                            <td style="padding:40px 40px 20px;text-align:center;">
                                <div style="display:inline-block;background:#dc2626;padding:12px;border-radius:16px;margin-bottom:20px;">
                                    <span style="font-size:28px;">🔒</span>
                                </div>
                                <h1 style="color:#ffffff;font-size:28px;font-weight:800;margin:0 0 8px;letter-spacing:-0.5px;">
                                    Reset Your Password
                                </h1>
                                <p style="color:#94a3b8;font-size:16px;margin:0;">
                                    Hi {full_name}, we received a password reset request.
                                </p>
                            </td>
                        </tr>

                        <!-- Body -->
                        <tr>
                            <td style="padding:20px 40px;">
                                <p style="color:#cbd5e1;font-size:15px;line-height:1.7;margin:0 0 24px;">
                                    Someone requested a password reset for your ResumeAI account. If this was you, click the button below to set a new password.
                                </p>

                                <!-- CTA Button -->
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td align="center" style="padding:10px 0 30px;">
                                            <a href="{reset_url}"
                                               style="display:inline-block;background:linear-gradient(135deg,#f43f5e,#dc2626,#b91c1c);color:#ffffff;text-decoration:none;padding:16px 48px;border-radius:14px;font-weight:700;font-size:16px;letter-spacing:0.3px;box-shadow:0 8px 32px rgba(220,38,38,0.4);">
                                                🔑&nbsp; Reset Password
                                            </a>
                                        </td>
                                    </tr>
                                </table>

                                <p style="color:#64748b;font-size:13px;line-height:1.6;margin:0 0 16px;">
                                    If the button doesn't work, copy and paste this link into your browser:
                                </p>
                                <p style="color:#f43f5e;font-size:13px;word-break:break-all;background:rgba(244,63,94,0.08);padding:14px 18px;border-radius:12px;border:1px solid rgba(244,63,94,0.15);margin:0 0 24px;">
                                    {reset_url}
                                </p>

                                <p style="color:#64748b;font-size:13px;margin:0;">
                                    This link will expire in <strong style="color:#94a3b8;">1 hour</strong>. If you didn't request this, you can safely ignore this email.
                                </p>
                            </td>
                        </tr>

                        <!-- Security Notice -->
                        <tr>
                            <td style="padding:0 40px 24px;">
                                <div style="background:rgba(251,191,36,0.06);border:1px solid rgba(251,191,36,0.12);border-radius:12px;padding:16px 20px;">
                                    <p style="color:#fbbf24;font-size:13px;font-weight:600;margin:0 0 4px;">⚠️ Security Notice</p>
                                    <p style="color:#64748b;font-size:12px;line-height:1.5;margin:0;">
                                        Never share this link with anyone. ResumeAI will never ask for your password via email.
                                    </p>
                                </div>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="padding:24px 40px 32px;border-top:1px solid rgba(255,255,255,0.06);">
                                <p style="color:#475569;font-size:12px;line-height:1.6;margin:0;text-align:center;">
                                    If you didn't request a password reset, no action is needed.
                                    <br/>© {settings.APP_NAME}. All rights reserved.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """

    return await send_email(to_email, "Reset Your Password – ResumeAI", html_body)
