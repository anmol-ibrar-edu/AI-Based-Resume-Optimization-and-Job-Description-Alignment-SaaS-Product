from pydantic import BaseModel
from typing import List
from app.schemas.analysis import AnalysisHistory

class DashboardStats(BaseModel):
    total_analyses: int
    average_score: float
    best_score: float
    improvement: float
    recent_analyses: List[AnalysisHistory]
