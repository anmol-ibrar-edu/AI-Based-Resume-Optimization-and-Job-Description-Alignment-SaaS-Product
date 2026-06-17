import logging
import os
import sys

# Ensure we can import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.database import SessionLocal, engine
from app.db.base import Base
from app.models.user import User
from app.core.security import get_password_hash
from sqlalchemy import text

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_db() -> None:
    logger.info("Creating all tables in database...")
    Base.metadata.create_all(bind=engine)
    logger.info("Tables created.")
    
    # Optional: ensure we update the role column if we migrated from is_admin
    try:
        with engine.connect() as conn:
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user' NOT NULL;"))
            conn.commit()
    except Exception as e:
        logger.warning(f"Error altering users table (it might be fine): {e}")

    logger.info("Seeding initial admin data...")
    db = SessionLocal()
    try:
        # Get admin emails from environment, e.g., "admin1@example.com,admin2@example.com"
        admin_emails_str = os.getenv("ADMIN_EMAILS", "admin@example.com")
        admin_emails = [email.strip() for email in admin_emails_str.split(",") if email.strip()]
        
        default_password = os.getenv("ADMIN_DEFAULT_PASSWORD", "Admin123!")

        for email in admin_emails:
            user = db.query(User).filter(User.email == email).first()
            if not user:
                logger.info(f"Creating new admin user: {email}")
                new_admin = User(
                    email=email,
                    full_name=email.split("@")[0].capitalize(),
                    hashed_password=get_password_hash(default_password),
                    is_verified=True,
                    is_active=True,
                    role="admin"
                )
                db.add(new_admin)
            else:
                if user.role != "admin":
                    logger.info(f"Promoting user {email} to admin")
                    user.role = "admin"
        
        db.commit()
        logger.info("Database initialization completed successfully.")
    except Exception as e:
        logger.error(f"Error during database initialization: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
