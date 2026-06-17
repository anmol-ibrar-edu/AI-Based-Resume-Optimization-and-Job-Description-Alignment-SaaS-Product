"""
File: api/v1/career.py
Purpose: API router for career analysis, providing endpoints to analyze resumes against a database of career paths and retrieve career field information.
Missing Impact: Users would not be able to access the career matching features or explore different professional opportunities based on their resumes.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.models.resume import Resume
from app.schemas.career import (
    CareerAnalysisResponse,
    CareerAnalyzeRequest,
    CareerMatchSchema,
    FieldMatch,
)
from app.ml.career_analyzer import career_analyzer
from app.ml.skills_database import find_skills_in_text
from app.ml.career_database import CAREER_DATABASE, CAREER_FIELDS


router = APIRouter(prefix="/career", tags=["Career Analysis"])


@router.post("/analyze", response_model=CareerAnalysisResponse)
def analyze_career(
    request: CareerAnalyzeRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Analyze a resume and return career recommendations."""

    # Fetch the resume (only owner can analyze)
    resume = db.query(Resume).filter(
        Resume.id == request.resume_id,
        Resume.user_id == current_user.id,
    ).first()

    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found",
        )

    # Use raw_text — the real extracted text stored in the DB
    resume_text = resume.raw_text or ""
    if not resume_text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Resume has no extracted text. Please re-upload the resume.",
        )

    # Use pre-extracted skills if available, otherwise extract fresh
    resume_skills = resume.skills if resume.skills else find_skills_in_text(resume_text)
    resume_data = resume.parsed_data or {}

    # Run analysis
    analysis = career_analyzer.analyze(
        resume_text=resume_text,
        resume_skills=resume_skills,
        resume_data=resume_data,
    )

    # Build response
    return CareerAnalysisResponse(
        best_fit=_to_schema(analysis.best_fit) if analysis.best_fit else None,
        eligible_careers=[_to_schema(c) for c in analysis.eligible_careers],
        eligible_fields=[FieldMatch(**f) for f in analysis.eligible_fields],
        future_careers=[_to_schema(c) for c in analysis.future_careers],
        skills_summary=analysis.skills_summary,
        market_insights=analysis.market_insights,
        overall_profile=analysis.overall_profile,
    )


@router.get("/fields")
def get_all_fields():
    """Get all available career fields."""
    return CAREER_FIELDS


@router.get("/careers")
def get_all_careers():
    """Get all career titles with basic info."""
    return [
        {
            "title": name,
            "field": data["field"],
            "market_demand": data.get("market_demand", ""),
            "required_skills_count": len(data.get("required_skills", [])),
        }
        for name, data in CAREER_DATABASE.items()
    ]


def _to_schema(match) -> CareerMatchSchema:
    """Convert internal CareerMatch dataclass to Pydantic schema."""
    return CareerMatchSchema(
        career_title=match.career_title,
        match_percentage=match.match_percentage,
        field=match.career_field,
        alternate_titles=match.alternate_titles,
        matched_skills=match.matched_skills,
        missing_skills=match.missing_skills,
        experience_level=match.experience_level,
        salary_range=match.salary_range,
        market_demand=match.market_demand,
        growth_rate=match.growth_rate,
        description=match.description,
        match_category=match.match_category,
        recommendations=match.recommendations,
    )
