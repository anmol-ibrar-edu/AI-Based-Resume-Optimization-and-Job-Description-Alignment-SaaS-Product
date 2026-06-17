from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional

from app.db.database import get_db
from app.models.user import User
from app.models.review import Review
from app.models.analysis import Analysis
from app.models.resume import Resume
from app.schemas.user import UserResponse
from app.schemas.review import ReviewResponse, ReviewUpdate
from app.api.deps import get_current_admin_user

router = APIRouter()


# ── Stats ────────────────────────────────────────────────────────────────────

@router.get("/stats")
def get_admin_stats(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """
    Get high-level platform statistics (Admin only).
    Returns total registered users, active users, total analyses, and total resumes.
    """
    total_users = db.query(User).count()
    total_analyses = db.query(Analysis).count()
    active_users = db.query(User).filter(User.is_active == True).count()
    total_resumes = db.query(Resume).count()
    return {
        "total_users": total_users,
        "active_users": active_users,
        "total_analyses": total_analyses,
        "total_resumes": total_resumes,
    }


# ── Users ────────────────────────────────────────────────────────────────────

@router.get("/users", response_model=List[UserResponse])
def get_all_users(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    sort: str = "desc",
    search: str = "",
    current_admin: User = Depends(get_current_admin_user)
):
    """
    Get all users with optional search and sort (Admin only).
    """
    query = db.query(User)
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (User.full_name.ilike(search_term)) | (User.email.ilike(search_term))
        )
    if sort == "asc":
        query = query.order_by(User.id.asc())
    else:
        query = query.order_by(User.id.desc())
    users = query.offset(skip).limit(limit).all()
    return users


@router.patch("/users/{user_id}/toggle-active")
def toggle_user_active(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """
    Toggle a user's active status (Admin only).
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.role == "admin":
        raise HTTPException(status_code=400, detail="Cannot modify admin users")

    user.is_active = not user.is_active
    db.commit()
    db.refresh(user)
    return {
        "id": user.id,
        "is_active": user.is_active,
        "message": f"User {'activated' if user.is_active else 'deactivated'} successfully."
    }


@router.patch("/users/{user_id}/role")
def change_user_role(
    user_id: int,
    role: str,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """
    Change a user's role (Admin only).
    """
    valid_roles = ["user", "moderator", "admin"]
    if role not in valid_roles:
        raise HTTPException(status_code=400, detail=f"Invalid role. Must be one of: {valid_roles}")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.role = role
    db.commit()
    db.refresh(user)
    return {"id": user.id, "role": user.role}


@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """
    Delete a user permanently (Admin only). Cannot delete admin users.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.role == "admin":
        raise HTTPException(status_code=400, detail="Cannot delete admin users")

    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}


# ── Resumes ──────────────────────────────────────────────────────────────────

@router.get("/resumes")
def get_all_resumes(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 200,
    sort: str = "desc",
    current_admin: User = Depends(get_current_admin_user)
):
    """
    Get all resumes with user info and best ATS score (Admin only).
    """
    query = db.query(Resume)
    if sort == "asc":
        query = query.order_by(Resume.id.asc())
    else:
        query = query.order_by(Resume.id.desc())

    resumes = query.offset(skip).limit(limit).all()

    results = []
    for resume in resumes:
        # Get the best ATS score for this resume
        best_analysis = (
            db.query(func.max(Analysis.ats_score))
            .filter(Analysis.resume_id == resume.id)
            .scalar()
        )
        results.append({
            "id": resume.id,
            "filename": resume.filename,
            "file_type": resume.file_type,
            "file_size": resume.file_size,
            "skills": resume.skills or [],
            "user_name": resume.user.full_name if resume.user else "Unknown",
            "user_email": resume.user.email if resume.user else "Unknown",
            "user_id": resume.user_id,
            "best_score": best_analysis or 0,
            "created_at": resume.created_at.isoformat() if resume.created_at else None,
        })

    return results


@router.delete("/resumes/{resume_id}")
def delete_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """
    Delete a resume permanently (Admin only).
    """
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    db.delete(resume)
    db.commit()
    return {"message": "Resume deleted successfully"}


# ── Reviews ──────────────────────────────────────────────────────────────────

@router.get("/reviews", response_model=List[ReviewResponse])
def get_all_reviews(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_admin: User = Depends(get_current_admin_user)
):
    """
    Get all reviews, both visible and hidden (Admin only).
    """
    reviews = db.query(Review).order_by(Review.created_at.desc()).offset(skip).limit(limit).all()
    for review in reviews:
        review.user_name = review.user.full_name
    return reviews


@router.patch("/reviews/{review_id}", response_model=ReviewResponse)
def update_review_visibility(
    review_id: int,
    review_update: ReviewUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """
    Approve or reject a review by setting its visibility (Admin only).
    """
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
        
    review.is_visible = review_update.is_visible
    db.commit()
    db.refresh(review)
    
    review.user_name = review.user.full_name
    return review


@router.delete("/reviews/{review_id}")
def delete_review(
    review_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """
    Delete a review permanently (Admin only).
    """
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    db.delete(review)
    db.commit()
    return {"message": "Review deleted successfully"}