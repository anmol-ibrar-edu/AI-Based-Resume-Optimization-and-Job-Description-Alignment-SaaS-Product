"""Pydantic schemas for Career Analysis API."""
from pydantic import BaseModel
from typing import Optional, List, Dict, Any


class CareerMatchSchema(BaseModel):
    career_title: str
    match_percentage: float
    field: str
    alternate_titles: List[str] = []
    matched_skills: List[str] = []
    missing_skills: List[str] = []
    experience_level: str = ""
    salary_range: str = ""
    market_demand: str = ""
    growth_rate: str = ""
    description: str = ""
    match_category: str = ""
    recommendations: List[str] = []


class FieldMatch(BaseModel):
    field: str
    description: str
    matching_careers: List[str]
    total_careers_in_field: int


class CareerAnalysisResponse(BaseModel):
    best_fit: Optional[CareerMatchSchema] = None
    eligible_careers: List[CareerMatchSchema] = []
    eligible_fields: List[FieldMatch] = []
    future_careers: List[CareerMatchSchema] = []
    skills_summary: Dict[str, Any] = {}
    market_insights: Dict[str, Any] = {}
    overall_profile: Dict[str, Any] = {}


class CareerAnalyzeRequest(BaseModel):
    resume_id: int
