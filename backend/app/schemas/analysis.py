from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime

class AnalysisRequest(BaseModel):
    resume_id: int
    job_id: int

class ScoreBreakdown(BaseModel):
    skills_score: float = Field(..., ge=0, le=100)
    experience_score: float = Field(..., ge=0, le=100)
    keywords_score: float = Field(..., ge=0, le=100)
    achievements_score: float = Field(..., ge=0, le=100)
    format_score: float = Field(..., ge=0, le=100)

class Recommendation(BaseModel):
    priority: str
    category: str
    message: str
    details: Optional[str] = None

class AnalysisResponse(BaseModel):
    id: int
    ats_score: float
    score_breakdown: Optional[Dict[str, float]] = None
    matched_skills: Optional[List[str]] = None
    missing_skills: Optional[List[str]] = None
    matched_keywords: Optional[List[str]] = None
    missing_keywords: Optional[List[str]] = None
    recommendations: Optional[List[Dict[str, Any]]] = None
    original_summary: Optional[str] = None
    improved_summary: Optional[str] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class AnalysisHistory(BaseModel):
    id: int
    resume_filename: str
    job_title: Optional[str] = None
    ats_score: float
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class DashboardStats(BaseModel):
    total_analyses: int
    average_score: float
    best_score: float
    improvement: float
    recent_analyses: List[AnalysisHistory]
