from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime

class JobDescriptionCreate(BaseModel):
    title: Optional[str] = Field(None, max_length=255)
    company: Optional[str] = Field(None, max_length=255)
    raw_text: str = Field(..., min_length=50)

class JobDescriptionResponse(BaseModel):
    id: int
    title: Optional[str] = None
    company: Optional[str] = None
    required_skills: Optional[List[str]] = None
    keywords: Optional[List[str]] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class JobDescriptionDetail(JobDescriptionResponse):
    raw_text: str
    parsed_data: Optional[Dict[str, Any]] = None
