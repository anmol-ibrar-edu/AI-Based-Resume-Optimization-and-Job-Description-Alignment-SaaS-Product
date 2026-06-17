"""
File: api/v1/resume.py
Purpose: API router for resume management, handling file uploads, validation (via ResumeValidator), parsing (via ResumeParser), and CRUD operations.
Missing Impact: Users would not be able to upload their resumes, list existing ones, or delete them, effectively disabling the core data input of the system.
"""
import os
import uuid
from datetime import datetime
from typing import List

from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.models.resume import Resume
from app.schemas.resume import ResumeResponse, ResumeDetail
from app.config import settings
from app.ml.resume_parser import ResumeParser
from app.ml.resume_validator import ResumeValidator
from app.utils.file_handler import delete_file

router = APIRouter()


@router.post("/upload", response_model=ResumeResponse, status_code=status.HTTP_201_CREATED)
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Upload and validate resume
    - Only PDF and DOCX allowed
    - Must be a REAL resume (not job description or random file)
    """
    
    # ===== STEP 1: File Type Validation =====
    filename = file.filename.lower()
    ext = filename.split('.')[-1] if '.' in filename else ""
    
    if ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "error": "Invalid file type",
                "message": f"Only {settings.ALLOWED_EXTENSIONS} files are allowed",
                "your_file": ext if ext else "unknown"
            }
        )
    
    # ===== STEP 2: File Size Validation =====
    content = await file.read()
    file_size = len(content)
    
    if file_size > settings.MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "error": "File too large",
                "message": f"Maximum file size is {settings.MAX_FILE_SIZE // 1024 // 1024}MB",
                "your_file_size": f"{file_size // 1024}KB"
            }
        )
    
    if file_size < 1000:  # Less than 1KB is suspicious
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "error": "File too small",
                "message": "File appears to be empty or corrupted",
            }
        )
    
    # ===== STEP 3: Save File Temporarily =====
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    
    unique_filename = f"{uuid.uuid4()}.{ext}"
    file_path = os.path.join(settings.UPLOAD_DIR, unique_filename)
    
    with open(file_path, 'wb') as f:
        f.write(content)
    
    try:
        # ===== STEP 4: Extract Text =====
        parser = ResumeParser()
        try:
            raw_text = parser.extract_text(file_path, ext)
        except Exception as e:
            os.remove(file_path)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "error": "Cannot read file",
                    "message": f"Failed to extract text from file: {str(e)}",
                    "suggestion": "Make sure the file is not corrupted or password-protected"
                }
            )
        
        # ===== STEP 5: STRICT RESUME VALIDATION =====
        validator = ResumeValidator()
        validation = validator.validate(raw_text)
        
        if not validation["is_valid"]:
            # DELETE THE FILE - it's not a valid resume
            os.remove(file_path)
            
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "error": "Not a valid resume",
                    "reason": validation["reason"],
                    "issues": validation["issues"],
                    "suggestions": validation["suggestions"],
                    "message": "Please upload a proper resume document"
                }
            )
        
        # ===== STEP 6: Parse Resume =====
        parsed_data = parser.parse_resume(file_path, ext)
        
        # Extract skills from parsed data
        skills_data = parsed_data.get("skills", {})
        all_skills = skills_data.get("all_skills", [])
        
        # ===== STEP 7: Save to Database =====
        resume = Resume(
            user_id=current_user.id,
            filename=file.filename,
            file_path=file_path,
            file_type=ext,
            file_size=file_size,
            raw_text=raw_text,
            parsed_data=parsed_data,
            skills=all_skills,
        )
        
        db.add(resume)
        db.commit()
        db.refresh(resume)
        
        return resume
        
    except HTTPException:
        # Re-raise HTTP exceptions (validation errors, etc.)
        if os.path.exists(file_path):
            os.remove(file_path)
        raise
    except Exception as e:
        # Clean up file on any error
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "error": "Upload failed",
                "message": str(e)
            }
        )


@router.get("/", response_model=List[ResumeResponse])
async def get_user_resumes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all resumes for current user"""
    resumes = db.query(Resume).filter(
        Resume.user_id == current_user.id
    ).order_by(Resume.created_at.desc()).all()
    return resumes


@router.get("/{resume_id}", response_model=ResumeDetail)
async def get_resume(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get specific resume by ID"""
    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()
    
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
    
    return resume


@router.delete("/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_resume(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a resume"""
    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()
    
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
    
    # Delete file
    delete_file(resume.file_path)
    
    db.delete(resume)
    db.commit()
    
    return None
