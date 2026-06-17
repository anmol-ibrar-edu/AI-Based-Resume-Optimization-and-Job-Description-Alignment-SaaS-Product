"""
Analysis model for storing resume analysis results.
"""
from sqlalchemy import Column, Integer, Float, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from typing import TYPE_CHECKING

from app.db.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.resume import Resume
    from app.models.job import JobDescription


class Analysis(Base, TimestampMixin):
    """Analysis model representing resume analysis results against job descriptions."""
    
    __tablename__ = "analyses"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    resume_id = Column(
        Integer,
        ForeignKey("resumes.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    job_id = Column(
        Integer,
        ForeignKey("job_descriptions.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    ats_score = Column(Float, nullable=False)  # 0-100
    score_breakdown = Column(JSON, nullable=True)  # Detailed scores
    matched_skills = Column(JSON, nullable=True)  # List of matched skills
    missing_skills = Column(JSON, nullable=True)  # List of missing skills
    extra_skills = Column(JSON, nullable=True)  # Skills in resume but not in job
    matched_keywords = Column(JSON, nullable=True)  # List of matched keywords
    missing_keywords = Column(JSON, nullable=True)  # List of missing keywords
    recommendations = Column(JSON, nullable=True)  # List of recommendation objects
    original_summary = Column(Text, nullable=True)
    improved_summary = Column(Text, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="analyses")
    resume = relationship("Resume", back_populates="analyses")
    job_description = relationship("JobDescription", back_populates="analyses")
    
    def __repr__(self) -> str:
        return f"<Analysis(id={self.id}, user_id={self.user_id}, resume_id={self.resume_id}, job_id={self.job_id}, ats_score={self.ats_score})>"

