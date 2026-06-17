from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.resume import Resume
from app.models.job import JobDescription
from app.models.analysis import Analysis
from app.schemas.analysis import DashboardStats, AnalysisHistory

router = APIRouter()

@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    stats = db.query(
        func.count(Analysis.id).label('total'),
        func.avg(Analysis.ats_score).label('average'),
        func.max(Analysis.ats_score).label('best')
    ).filter(Analysis.user_id == current_user.id).first()
    
    first_analysis = db.query(Analysis).filter(Analysis.user_id == current_user.id).order_by(Analysis.created_at.asc()).first()
    last_analysis = db.query(Analysis).filter(Analysis.user_id == current_user.id).order_by(Analysis.created_at.desc()).first()
    
    improvement = 0.0
    if first_analysis and last_analysis and first_analysis.id != last_analysis.id:
        improvement = last_analysis.ats_score - first_analysis.ats_score
    
    recent = db.query(Analysis).filter(Analysis.user_id == current_user.id).order_by(Analysis.created_at.desc()).limit(5).all()
    
    recent_analyses = []
    for analysis in recent:
        resume = db.query(Resume).filter(Resume.id == analysis.resume_id).first()
        job = db.query(JobDescription).filter(JobDescription.id == analysis.job_id).first()
        recent_analyses.append(AnalysisHistory(
            id=analysis.id,
            resume_filename=resume.filename if resume else "Unknown",
            job_title=job.title if job else "Unknown",
            ats_score=analysis.ats_score,
            created_at=analysis.created_at
        ))
    
    return DashboardStats(
        total_analyses=stats.total or 0,
        average_score=round(stats.average or 0, 2),
        best_score=stats.best or 0,
        improvement=round(improvement, 2),
        recent_analyses=recent_analyses
    )
