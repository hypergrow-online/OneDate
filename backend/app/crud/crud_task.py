from typing import Optional, List
from datetime import datetime
from bson import ObjectId
from app.db.mongodb_utils import get_database
from app.models.task import TaskCreate, TaskUpdate


def create_task(task: TaskCreate, user_id: str) -> dict:
    """Create a new task."""
    db = get_database()
    task_dict = task.model_dump()
    task_dict["user_id"] = user_id
    task_dict["created_at"] = datetime.utcnow()
    task_dict["updated_at"] = datetime.utcnow()
    
    result = db.tasks.insert_one(task_dict)
    task_dict["_id"] = str(result.inserted_id)
    return task_dict


def get_task(task_id: str, user_id: str) -> Optional[dict]:
    """Get a task by ID."""
    db = get_database()
    task = db.tasks.find_one({"_id": ObjectId(task_id), "user_id": user_id})
    if task:
        task["_id"] = str(task["_id"])
    return task


def get_tasks(user_id: str, skip: int = 0, limit: int = 100) -> List[dict]:
    """Get all tasks for a user."""
    db = get_database()
    tasks = list(db.tasks.find({"user_id": user_id}).skip(skip).limit(limit))
    for task in tasks:
        task["_id"] = str(task["_id"])
    return tasks


def update_task(task_id: str, task_update: TaskUpdate, user_id: str) -> Optional[dict]:
    """Update a task."""
    db = get_database()
    update_dict = {k: v for k, v in task_update.model_dump().items() if v is not None}
    update_dict["updated_at"] = datetime.utcnow()
    
    result = db.tasks.find_one_and_update(
        {"_id": ObjectId(task_id), "user_id": user_id},
        {"$set": update_dict},
        return_document=True
    )
    
    if result:
        result["_id"] = str(result["_id"])
    return result


def delete_task(task_id: str, user_id: str) -> bool:
    """Delete a task."""
    db = get_database()
    result = db.tasks.delete_one({"_id": ObjectId(task_id), "user_id": user_id})
    return result.deleted_count > 0
