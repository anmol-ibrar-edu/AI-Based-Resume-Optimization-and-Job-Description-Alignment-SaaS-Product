"""
File: db/database.py
Purpose: Configures the database engine and provides a dependency for session management across the application.
Missing Impact: The backend would be unable to communicate with the PostgreSQL database, preventing any data persistence or retrieval.
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from typing import Generator

from app.config import settings

# PostgreSQL Database Engine
# pool_pre_ping: Check connection before using
# pool_size: Number of connections to keep
# max_overflow: Extra connections allowed
engine_kwargs = {"echo": settings.DEBUG}
if "sqlite" in settings.database_url:
    engine_kwargs["connect_args"] = {"check_same_thread": False}
else:
    engine_kwargs["pool_pre_ping"] = True
    engine_kwargs["pool_size"] = 10
    engine_kwargs["max_overflow"] = 20

engine = create_engine(
    settings.database_url,
    **engine_kwargs
)

# Session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


# Dependency to get database session
def get_db() -> Generator[Session, None, None]:
    """
    Database session dependency for FastAPI routes.
    Yields a session and ensures it's closed after request.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

