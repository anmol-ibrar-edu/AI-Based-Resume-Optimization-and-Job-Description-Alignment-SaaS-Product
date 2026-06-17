"""
File: api/v1/analysis.py
Purpose: API router for handling resume analysis requests, including ATS scoring and recommendation generation.
Missing Impact: Users would not be able to run diagnostics on their resumes or see how they align with job descriptions.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List
from app.db.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.resume import Resume
from app.models.job import JobDescription
from app.models.analysis import Analysis
from app.schemas.analysis import AnalysisRequest, AnalysisResponse, AnalysisHistory
from app.ml.scorer import ATSScorer
from app.ml.recommender import ResumeRecommender
from app.ml.jd_parser import JDParser
from app.ml.ai_generator import ai_generator
from app.config import settings

router = APIRouter()

@router.post("/analyze", response_model=AnalysisResponse, status_code=status.HTTP_201_CREATED)
async def analyze_resume(
    request: AnalysisRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resume = db.query(Resume).filter(Resume.id == request.resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")
    
    job = db.query(JobDescription).filter(JobDescription.id == request.job_id, JobDescription.user_id == current_user.id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job description not found")
    
    try:
        # Parse job description if not already parsed
        if not job.required_skills or not job.keywords:
            jd_parser = JDParser()
            jd_data = jd_parser.parse(job.raw_text)
            job.required_skills = jd_data.get("required_skills", [])
            job.keywords = jd_data.get("keywords", [])
            job.parsed_data = jd_data
            db.commit()

        preferred_skills = (job.parsed_data or {}).get("preferred_skills", [])
        original_summary = resume.parsed_data.get("summary", "") if resume.parsed_data else ""

        # ── AI-Enhanced Path (Gemini or OpenAI) ──────────────────────────────
        ai_result = None
        if settings.GOOGLE_API_KEY or settings.OPENAI_API_KEY:
            try:
                ai_result = await ai_generator.analyze_ats_match(
                    resume_text=resume.raw_text or "",
                    job_text=job.raw_text or ""
                )
            except Exception as ai_err:
                print(f"AI analysis error (falling back to local): {ai_err}")
                ai_result = None

        if ai_result:
            # Use AI-generated results — already deduplicated inside ai_generator
            score_result = {
                "total_score": float(ai_result.get("ats_score", 0)),
                "breakdown": ai_result.get("score_breakdown", {}),
                "matched_skills": ai_result.get("matched_skills", []),
                "missing_skills": ai_result.get("missing_skills", []),
                "extra_skills": ai_result.get("extra_skills", []),
                "matched_keywords": ai_result.get("matched_keywords", []),
                "missing_keywords": ai_result.get("missing_keywords", []),
            }
            # Recommendations from Gemini are already structured dicts
            ai_recs = ai_result.get("recommendations", [])
            recommendations = [
                r if isinstance(r, dict) else {
                    "priority": "medium", "category": "ai",
                    "title": "Improvement tip", "message": str(r), "details": ""
                }
                for r in ai_recs
            ]
            improved_summary = ai_result.get("improved_summary") or None
        else:
            # ── Local ML Fallback ─────────────────────────────────────────────
            scorer = ATSScorer()
            score_result = scorer.calculate_score(
                resume_skills=resume.skills or [],
                resume_text=resume.raw_text or "",
                job_skills=(job.required_skills or []) + preferred_skills,
                job_keywords=job.keywords or [],
                job_text=job.raw_text
            )

            recommender = ResumeRecommender()
            job_data = {
                "required_skills": job.required_skills or [],
                "preferred_skills": preferred_skills,
                "keywords": job.keywords or [],
            }
            recommendations = recommender.generate_recommendations(
                resume_data=resume.parsed_data or {},
                job_data=job_data,
                score_data=score_result
            )
            improved_summary = None

        # ── Deduplicate all skill/keyword lists (case-insensitive) ────────────
        def dedup(lst):
            seen = set()
            result = []
            for item in (lst or []):
                key = item.lower().strip()
                if key not in seen:
                    seen.add(key)
                    result.append(item)
            return result

        score_result["matched_skills"] = dedup(score_result.get("matched_skills", []))
        score_result["missing_skills"] = dedup(score_result.get("missing_skills", []))
        # Ensure missing_skills has no overlap with matched_skills
        matched_lower = {s.lower().strip() for s in score_result["matched_skills"]}
        score_result["missing_skills"] = [s for s in score_result["missing_skills"] if s.lower().strip() not in matched_lower]
        score_result["matched_keywords"] = dedup(score_result.get("matched_keywords", []))
        score_result["missing_keywords"] = dedup(score_result.get("missing_keywords", []))
        matched_kw_lower = {k.lower().strip() for k in score_result["matched_keywords"]}
        score_result["missing_keywords"] = [k for k in score_result["missing_keywords"] if k.lower().strip() not in matched_kw_lower]

        analysis = Analysis(
            user_id=current_user.id,
            resume_id=resume.id,
            job_id=job.id,
            ats_score=score_result["total_score"],
            score_breakdown=score_result["breakdown"],
            matched_skills=score_result["matched_skills"],
            missing_skills=score_result["missing_skills"],
            extra_skills=score_result.get("extra_skills", []),
            matched_keywords=score_result.get("matched_keywords", []),
            missing_keywords=score_result.get("missing_keywords", []),
            recommendations=recommendations,
            original_summary=original_summary,
            improved_summary=improved_summary
        )

        db.add(analysis)
        db.commit()
        db.refresh(analysis)

        return analysis
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error analyzing resume: {str(e)}")


@router.get("/", response_model=List[AnalysisHistory])
async def get_analysis_history(
    limit: int = 10,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    analyses = (
        db.query(Analysis)
        .options(
            joinedload(Analysis.resume),
            joinedload(Analysis.job_description)
        )
        .filter(Analysis.user_id == current_user.id)
        .order_by(Analysis.created_at.desc())
        .limit(limit)
        .all()
    )
    
    result = [
        AnalysisHistory(
            id=analysis.id,
            resume_filename=analysis.resume.filename if analysis.resume else "Unknown",
            job_title=analysis.job_description.title if analysis.job_description else "Unknown",
            ats_score=analysis.ats_score,
            created_at=analysis.created_at
        )
        for analysis in analyses
    ]
    
    return result

@router.get("/{analysis_id}", response_model=AnalysisResponse)
async def get_analysis(
    analysis_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id, Analysis.user_id == current_user.id).first()
    if not analysis:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Analysis not found")
    return analysis

@router.delete("/{analysis_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_analysis(
    analysis_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id, Analysis.user_id == current_user.id).first()
    if not analysis:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Analysis not found")
    
    db.delete(analysis)
    db.commit()
    return None
