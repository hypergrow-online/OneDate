from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class NoteBase(BaseModel):
    title: str
    content: str
    folder: Optional[str] = "General"
    tags: List[str] = []
    note_type: Optional[str] = "text"  # "text" or "video"
    video_url: Optional[str] = None  # Google Drive URL for video notes


class NoteCreate(NoteBase):
    pass


class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    folder: Optional[str] = None
    tags: Optional[List[str]] = None
    note_type: Optional[str] = None
    video_url: Optional[str] = None


class NoteResponse(NoteBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "507f1f77bcf86cd799439011",
                "title": "Meeting Notes",
                "content": "Discussion about project timeline...",
                "folder": "Work",
                "tags": ["meeting", "project"],
                "user_id": "507f1f77bcf86cd799439012",
                "created_at": "2023-01-01T00:00:00",
                "updated_at": "2023-01-01T00:00:00"
            }
        }
