"""
Security utilities for authentication and password hashing.
"""
from datetime import datetime, timedelta
from typing import Union, Optional
from jose import JWTError, jwt
from passlib.context import CryptContext

from app.config import settings

# Password hashing context using argon2 (more reliable than bcrypt)
pwd_context = CryptContext(schemes=["argon2", "bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify password against hash using bcrypt.
    
    Args:
        plain_password: The plain text password to verify
        hashed_password: The hashed password to compare against
        
    Returns:
        bool: True if password matches, False otherwise
    """
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """
    Generate bcrypt password hash.
    
    Args:
        password: The plain text password to hash
        
    Returns:
        str: The hashed password
    """
    # Truncate password to 72 bytes to avoid bcrypt limitation
    password_bytes = password.encode('utf-8')
    if len(password_bytes) > 72:
        password_bytes = password_bytes[:72]
    truncated_password = password_bytes.decode('utf-8', errors='ignore')
    
    return pwd_context.hash(truncated_password)


def create_access_token(
    subject: Union[str, int],
    expires_delta: Optional[timedelta] = None
) -> str:
    """
    Create JWT access token.
    
    Args:
        subject: The subject (user id) to encode in the token
        expires_delta: Optional custom expiration time. If not provided,
                      uses settings.ACCESS_TOKEN_EXPIRE_MINUTES
        
    Returns:
        str: The encoded JWT token
    """
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    
    # JWT payload
    to_encode = {
        "sub": str(subject),  # Subject (user id)
        "exp": expire,  # Expiration time
        "iat": datetime.utcnow(),  # Issued at time
    }
    
    # Encode token
    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )
    
    return encoded_jwt


def decode_access_token(token: str) -> Optional[int]:
    """
    Decode JWT token and return user_id.
    
    Args:
        token: The JWT token to decode
        
    Returns:
        Optional[int]: The user_id if token is valid, None otherwise
    """
    try:
        # Decode token
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        
        # Extract user_id from subject
        user_id: str = payload.get("sub")
        if user_id is None:
            return None
        
        # Convert to integer
        return int(user_id)
        
    except JWTError:
        # Token is invalid or expired
        return None
    except (ValueError, TypeError):
        # Invalid user_id format
        return None


def create_email_token(email: str, purpose: str, expires_minutes: int = 1440) -> str:
    """
    Create a JWT token for email verification or password reset.

    Args:
        email: The email address to encode
        purpose: Token purpose ('verify' or 'reset')
        expires_minutes: Token expiration in minutes (default 24h for verify, 60 for reset)

    Returns:
        str: The encoded JWT token
    """
    expire = datetime.utcnow() + timedelta(minutes=expires_minutes)
    to_encode = {
        "sub": email,
        "purpose": purpose,
        "exp": expire,
        "iat": datetime.utcnow(),
    }
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_email_token(token: str, expected_purpose: str) -> Optional[str]:
    """
    Decode a JWT email token and return the email address.

    Args:
        token: The JWT token to decode
        expected_purpose: Expected purpose ('verify' or 'reset')

    Returns:
        Optional[str]: The email if token is valid and purpose matches, None otherwise
    """
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        email: str = payload.get("sub")
        purpose: str = payload.get("purpose")
        if email is None or purpose != expected_purpose:
            return None
        return email
    except JWTError:
        return None

