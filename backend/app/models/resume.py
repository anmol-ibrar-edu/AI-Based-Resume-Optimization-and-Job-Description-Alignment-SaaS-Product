"""
Resume model for storing user resume files and parsed data.
"""
from sqlalchemy import Column, Integer, String, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from typing import TYPE_CHECKING

from app.db.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.analysis import Analysis


class Resume(Base, TimestampMixin):
    """Resume model representing uploaded resume files."""
    
    __tablename__ = "resumes"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_type = Column(String(10), nullable=False)  # pdf or docx
    file_size = Column(Integer, nullable=False)  # bytes
    raw_text = Column(Text, nullable=True)  # Extracted text
    parsed_data = Column(JSON, nullable=True)  # Structured data
    skills = Column(JSON, nullable=True)  # List of extracted skills
    
    # Relationships
    user = relationship("User", back_populates="resumes")
    analyses = relationship(
        "Analysis",
        back_populates="resume",
        cascade="all, delete-orphan",
        lazy="dynamic"
    )
    
    def __repr__(self) -> str:
        return f"<Resume(id={self.id}, user_id={self.user_id}, filename='{self.filename}')>"

