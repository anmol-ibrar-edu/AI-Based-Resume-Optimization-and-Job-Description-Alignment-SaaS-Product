"""
File: api/v1/job.py
Purpose: API router for job description management, handling creation, parsing (via JDParser), and CRUD operations for job-related data.
Missing Impact: Users would be unable to provide job descriptions for comparison, disabling the ATS alignment functionality of the application.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.job import JobDescription
from app.schemas.job import JobDescriptionCreate, JobDescriptionResponse, JobDescriptionDetail
from app.ml.jd_parser import JDParser

router = APIRouter()

@router.post("/", response_model=JobDescriptionResponse, status_code=status.HTTP_201_CREATED)
async def create_job_description(
    job_data: JobDescriptionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        parser = JDParser()
        parsed_data = parser.parse(job_data.raw_text)
        
        job = JobDescription(
            user_id=current_user.id,
            title=job_data.title,
            company=job_data.company,
            raw_text=job_data.raw_text,
            parsed_data=parsed_data,
            required_skills=parsed_data.get("required_skills", []),
            keywords=parsed_data.get("keywords", [])
        )
        
        db.add(job)
        db.commit()
        db.refresh(job)
        
        return job
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error parsing job description: {str(e)}")

@router.get("/", response_model=List[JobDescriptionResponse])
async def get_user_job_descriptions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    jobs = db.query(JobDescription).filter(JobDescription.user_id == current_user.id).order_by(JobDescription.created_at.desc()).all()
    return jobs

@router.get("/{job_id}", response_model=JobDescriptionDetail)
async def get_job_description(
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    job = db.query(JobDescription).filter(JobDescription.id == job_id, JobDescription.user_id == current_user.id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job description not found")
    return job

@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_job_description(
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    job = db.query(JobDescription).filter(JobDescription.id == job_id, JobDescription.user_id == current_user.id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job description not found")
    
    db.delete(job)
    db.commit()
    return None
