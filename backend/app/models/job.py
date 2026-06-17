"""
JobDescription model for storing job description data.
"""
from sqlalchemy import Column, Integer, String, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from typing import TYPE_CHECKING

from app.db.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.analysis import Analysis


class JobDescription(Base, TimestampMixin):
    """JobDescription model representing job postings."""
    
    __tablename__ = "job_descriptions"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    title = Column(String(255), nullable=True)
    company = Column(String(255), nullable=True)
    location = Column(String(255), nullable=True)
    raw_text = Column(Text, nullable=False)
    parsed_data = Column(JSON, nullable=True)  # Structured data
    required_skills = Column(JSON, nullable=True)  # List of required skills
    keywords = Column(JSON, nullable=True)  # List of keywords
    
    # Relationships
    user = relationship("User")
    analyses = relationship(
        "Analysis",
        back_populates="job_description",
        cascade="all, delete-orphan",
        lazy="dynamic"
    )
    
    def __repr__(self) -> str:
        return f"<JobDescription(id={self.id}, user_id={self.user_id}, title='{self.title}')>"

