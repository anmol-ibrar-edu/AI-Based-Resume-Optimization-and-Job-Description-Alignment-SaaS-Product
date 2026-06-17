"""
File: config.py
Purpose: Central configuration management for the backend, handling environment variables and global settings.
Missing Impact: The application would fail to start as it wouldn't know how to connect to the database, secure the API, or where to store files.
"""
from pydantic_settings import BaseSettings
from typing import List
import os
from pathlib import Path


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Application
    APP_NAME: str = "AI Resume Optimizer"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # Security
    SECRET_KEY: str = "default-secret-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    
    # PostgreSQL Database
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "password123"
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: str = "5432"
    POSTGRES_DB: str = "resume_optimizer"
    DATABASE_URL: str | None = None  # Will be constructed if not provided
    
    # File Upload
    UPLOAD_DIR: str = "uploads/resumes"
    MAX_FILE_SIZE: int = 5 * 1024 * 1024  # 5MB
    ALLOWED_EXTENSIONS: List[str] = ["pdf", "docx"]
    
    # CORS
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:5173"
    
    # AI/ML API Keys (Optional - for enhanced parsing)
    OPENAI_API_KEY: str = ""
    GOOGLE_API_KEY: str = ""
    AI_SERVICE_PREFERRED: str = "local"  # openai, gemini, or local
    
    # Feature Flags
    USE_AI_PARSING: bool = False
    ENABLE_OCR: bool = False

    # Email / SMTP (Hostinger)
    MAIL_SERVER: str = "smtp.hostinger.com"
    MAIL_PORT: int = 465
    MAIL_USERNAME: str = ""
    MAIL_PASSWORD: str = ""
    MAIL_FROM: str = ""
    MAIL_FROM_NAME: str = "ResumeAI"
    MAIL_USE_TLS: bool = True
    MAIL_USE_STARTTLS: bool = False

    # Frontend URL (for email links)
    FRONTEND_URL: str = "http://localhost:5173"

    
    @property
    def database_url(self) -> str:
        """Construct PostgreSQL database URL"""
        if self.DATABASE_URL:
            return self.DATABASE_URL
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
    
    @property
    def cors_origins(self) -> List[str]:
        """Get CORS origins as a list"""
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"


# Create settings instance
settings = Settings()

# Create upload directories (uploads/resumes)
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

