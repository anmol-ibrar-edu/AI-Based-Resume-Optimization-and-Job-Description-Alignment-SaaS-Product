"""
File: api/v1/auth.py
Purpose: API router for authentication, handling user registration and login (both OAuth2 form and JSON formats).
Missing Impact: Users would be unable to create accounts or log in, making it impossible to access any personalized features or store data.
"""
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime
from app.db.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
from app.schemas.token import Token, LoginRequest, ForgotPasswordRequest, ResetPasswordRequest
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    create_email_token,
    decode_email_token,
)
from app.utils.email import send_verification_email, send_password_reset_email

router = APIRouter()

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    
    new_user = User(
        email=user_data.email,
        full_name=user_data.full_name,
        hashed_password=get_password_hash(user_data.password),
        is_verified=False,
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Send verification email in background
    token = create_email_token(new_user.email, purpose="verify", expires_minutes=1440)
    background_tasks.add_task(send_verification_email, new_user.email, new_user.full_name, token)

    return new_user


@router.get("/verify-email")
async def verify_email(token: str, db: Session = Depends(get_db)):
    """Verify user email using the token from the verification link."""
    email = decode_email_token(token, expected_purpose="verify")
    if email is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification link",
        )

    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    if user.is_verified:
        return {"message": "Email is already verified"}

    user.is_verified = True
    db.commit()

    return {"message": "Email verified successfully"}


@router.post("/resend-verification")
async def resend_verification(
    data: ForgotPasswordRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    """Resend email verification link."""
    user = db.query(User).filter(User.email == data.email).first()

    # Always return success to prevent email enumeration
    if not user or user.is_verified:
        return {"message": "If that email is registered and not yet verified, a new verification link has been sent."}

    token = create_email_token(user.email, purpose="verify", expires_minutes=1440)
    background_tasks.add_task(send_verification_email, user.email, user.full_name, token)

    return {"message": "If that email is registered and not yet verified, a new verification link has been sent."}


@router.post("/forgot-password")
async def forgot_password(
    data: ForgotPasswordRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    """Send password reset email."""
    user = db.query(User).filter(User.email == data.email).first()

    # Always return success to prevent email enumeration
    if user and user.is_active:
        token = create_email_token(user.email, purpose="reset", expires_minutes=60)
        background_tasks.add_task(send_password_reset_email, user.email, user.full_name, token)

    return {"message": "If an account exists with that email, a password reset link has been sent."}


@router.post("/reset-password")
async def reset_password(
    data: ResetPasswordRequest,
    db: Session = Depends(get_db),
):
    """Reset user password using the token from the reset email."""
    email = decode_email_token(data.token, expected_purpose="reset")
    if email is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset link. Please request a new one.",
        )

    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    user.hashed_password = get_password_hash(data.new_password)
    db.commit()

    return {"message": "Password has been reset successfully. You can now sign in with your new password."}


@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Account is inactive")

    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Please verify your email before logging in. Check your inbox for a verification link.",
        )

    user.last_login = datetime.utcnow()
    db.commit()
    
    access_token = create_access_token(subject=user.id)
    return Token(access_token=access_token, token_type="bearer")

@router.post("/login/json", response_model=Token)
async def login_json(login_data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()
    
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
    
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Account is inactive")

    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Please verify your email before logging in. Check your inbox for a verification link.",
        )

    user.last_login = datetime.utcnow()
    db.commit()
    
    access_token = create_access_token(subject=user.id)
    return Token(access_token=access_token, token_type="bearer")
