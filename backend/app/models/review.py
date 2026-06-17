from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from typing import TYPE_CHECKING

from app.db.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.user import User

class Review(Base, TimestampMixin):
    """Review model representing user feedback and testimonials."""
    
    __tablename__ = "reviews"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    content = Column(Text, nullable=False)
    rating = Column(Integer, nullable=False, default=5)
    is_visible = Column(Boolean, default=False, nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="reviews")
    
    def __repr__(self) -> str:
        return f"<Review(id={self.id}, user_id={self.user_id}, rating={self.rating}, is_visible={self.is_visible})>"
