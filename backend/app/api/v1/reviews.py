from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.models.user import User
from app.models.review import Review
from app.schemas.review import ReviewCreate, ReviewResponse
from app.api.deps import get_current_active_user

router = APIRouter()

@router.post("/", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
def create_review(
    *,
    db: Session = Depends(get_db),
    review_in: ReviewCreate,
    current_user: User = Depends(get_current_active_user)
) -> Review:
    """
    Submit a new review/testimonial.
    """
    review = Review(
        user_id=current_user.id,
        content=review_in.content,
        rating=review_in.rating,
        is_visible=False  # Must be approved by admin
    )
    db.add(review)
    db.commit()
    db.refresh(review)
    
    # Add user_name for response
    review.user_name = current_user.full_name
    return review

@router.get("/public", response_model=List[ReviewResponse])
def get_public_reviews(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 10
):
    """
    Get visible reviews for public display (e.g., on homepage).
    """
    reviews = db.query(Review).filter(Review.is_visible == True).order_by(Review.created_at.desc()).offset(skip).limit(limit).all()
    
    # Attach user_name manually
    for review in reviews:
        review.user_name = review.user.full_name
        
    return reviews
