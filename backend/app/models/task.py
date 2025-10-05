from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class Priority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"


class TaskStatus(str, Enum):
    BACKLOG = "backlog"
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    DONE = "done"


class EisenhowerQuadrant(str, Enum):
    URGENT_IMPORTANT = "urgent_important"
    URGENT_NOT_IMPORTANT = "urgent_not_important"
    NOT_URGENT_IMPORTANT = "not_urgent_important"
    NOT_URGENT_NOT_IMPORTANT = "not_urgent_not_important"


class TimeEntry(BaseModel):
    start_time: datetime
    end_time: Optional[datetime] = None
    duration_seconds: Optional[int] = None


class Subtask(BaseModel):
    id: Optional[str] = None
    title: str
    completed: bool = False


class Resource(BaseModel):
    name: str
    url: Optional[str] = None
    description: Optional[str] = None


class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: TaskStatus = TaskStatus.BACKLOG
    priority: Priority = Priority.MEDIUM
    due_date: Optional[datetime] = None
    tags: List[str] = []
    board_id: Optional[str] = None
    list_name: Optional[str] = "Pendientes"
    eisenhower_quadrant: Optional[EisenhowerQuadrant] = None
    time_entries: List[TimeEntry] = []
    total_time_spent: int = 0  # in seconds
    is_running: bool = False
    current_session_start: Optional[datetime] = None
    completion_date: Optional[datetime] = None
    main_objectives: List[str] = []
    secondary_objectives: List[str] = []
    resources: List[Resource] = []
    resource_links: List[str] = []
    additional_notes: Optional[str] = None
    subtasks: List[Subtask] = []


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    priority: Optional[Priority] = None
    due_date: Optional[datetime] = None
    tags: Optional[List[str]] = None
    board_id: Optional[str] = None
    list_name: Optional[str] = None
    eisenhower_quadrant: Optional[EisenhowerQuadrant] = None
    time_entries: Optional[List[TimeEntry]] = None
    total_time_spent: Optional[int] = None
    is_running: Optional[bool] = None
    current_session_start: Optional[datetime] = None
    completion_date: Optional[datetime] = None
    main_objectives: Optional[List[str]] = None
    secondary_objectives: Optional[List[str]] = None
    resources: Optional[List[Resource]] = None
    resource_links: Optional[List[str]] = None
    additional_notes: Optional[str] = None
    subtasks: Optional[List[Subtask]] = None


class TaskResponse(TaskBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "507f1f77bcf86cd799439011",
                "title": "Complete project documentation",
                "description": "Write comprehensive docs",
                "status": "todo",
                "priority": "high",
                "user_id": "507f1f77bcf86cd799439012",
                "created_at": "2023-01-01T00:00:00",
                "updated_at": "2023-01-01T00:00:00"
            }
        }
