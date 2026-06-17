from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime

class ResumeResponse(BaseModel):
    id: int
    filename: str
    file_type: str
    file_size: int
    skills: Optional[List[str]] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class ResumeDetail(ResumeResponse):
    raw_text: Optional[str] = None
    parsed_data: Optional[Dict[str, Any]] = None
