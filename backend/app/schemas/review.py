from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ReviewBase(BaseModel):
    content: str = Field(..., min_length=10)
    rating: int = Field(5, ge=1, le=5)

class ReviewCreate(ReviewBase):
    pass

class ReviewUpdate(BaseModel):
    is_visible: bool

class ReviewResponse(ReviewBase):
    id: int
    user_id: int
    is_visible: bool
    created_at: datetime
    
    # Optional: include basic user info
    user_name: Optional[str] = None
    
    class Config:
        from_attributes = True
