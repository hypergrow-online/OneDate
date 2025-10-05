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
    task_dict["id"] = str(result.inserted_id)
    task_dict.pop("_id", None)
    return task_dict


def get_task(task_id: str, user_id: str) -> Optional[dict]:
    """Get a task by ID."""
    db = get_database()
    task = db.tasks.find_one({"_id": ObjectId(task_id), "user_id": user_id})
    if task:
        task["id"] = str(task["_id"])
        del task["_id"]
    return task


def get_tasks(user_id: str, skip: int = 0, limit: int = 100) -> List[dict]:
    """Get all tasks for a user."""
    db = get_database()
    tasks = list(db.tasks.find({"user_id": user_id}).skip(skip).limit(limit))
    for task in tasks:
        task["id"] = str(task["_id"])
        del task["_id"]
    return tasks


def update_task(task_id: str, task_update: TaskUpdate, user_id: str) -> Optional[dict]:
    """Update a task."""
    db = get_database()
    # Get all fields that were explicitly provided in the update
    update_dict = task_update.model_dump(exclude_unset=True)
    update_dict["updated_at"] = datetime.utcnow()
    
    result = db.tasks.find_one_and_update(
        {"_id": ObjectId(task_id), "user_id": user_id},
        {"$set": update_dict},
        return_document=True
    )
    
    if result:
        result["id"] = str(result["_id"])
        del result["_id"]
    return result


def delete_task(task_id: str, user_id: str) -> bool:
    """Delete a task."""
    db = get_database()
    result = db.tasks.delete_one({"_id": ObjectId(task_id), "user_id": user_id})
    return result.deleted_count > 0


def start_timer(task_id: str, user_id: str) -> Optional[dict]:
    """Start the timer for a task."""
    db = get_database()
    
    # Check if task exists and is not already running
    task = db.tasks.find_one({"_id": ObjectId(task_id), "user_id": user_id})
    if not task:
        return None
    
    if task.get("is_running", False):
        # Already running, return current state
        task["id"] = str(task["_id"])
        del task["_id"]
        return task
    
    # Start the timer
    now = datetime.utcnow()
    result = db.tasks.find_one_and_update(
        {"_id": ObjectId(task_id), "user_id": user_id},
        {
            "$set": {
                "is_running": True,
                "current_session_start": now,
                "updated_at": now
            }
        },
        return_document=True
    )
    
    if result:
        result["id"] = str(result["_id"])
        del result["_id"]
    return result


def pause_timer(task_id: str, user_id: str) -> Optional[dict]:
    """Pause the timer for a task."""
    db = get_database()
    
    # Get the task
    task = db.tasks.find_one({"_id": ObjectId(task_id), "user_id": user_id})
    if not task or not task.get("is_running", False):
        return None
    
    # Calculate elapsed time
    now = datetime.utcnow()
    start_time = task.get("current_session_start")
    if not start_time:
        return None
    
    duration_seconds = int((now - start_time).total_seconds())
    
    # Create time entry
    time_entry = {
        "start_time": start_time,
        "end_time": now,
        "duration_seconds": duration_seconds
    }
    
    # Update task
    current_total = task.get("total_time_spent", 0)
    time_entries = task.get("time_entries", [])
    time_entries.append(time_entry)
    
    result = db.tasks.find_one_and_update(
        {"_id": ObjectId(task_id), "user_id": user_id},
        {
            "$set": {
                "is_running": False,
                "current_session_start": None,
                "total_time_spent": current_total + duration_seconds,
                "time_entries": time_entries,
                "updated_at": now
            }
        },
        return_document=True
    )
    
    if result:
        result["id"] = str(result["_id"])
        del result["_id"]
    return result


def complete_task(task_id: str, user_id: str) -> Optional[dict]:
    """Complete a task and stop the timer if running."""
    db = get_database()
    
    # Get the task
    task = db.tasks.find_one({"_id": ObjectId(task_id), "user_id": user_id})
    if not task:
        return None
    
    now = datetime.utcnow()
    update_data = {
        "status": "done",
        "completion_date": now,
        "updated_at": now
    }
    
    # If timer is running, stop it
    if task.get("is_running", False):
        start_time = task.get("current_session_start")
        if start_time:
            duration_seconds = int((now - start_time).total_seconds())
            
            time_entry = {
                "start_time": start_time,
                "end_time": now,
                "duration_seconds": duration_seconds
            }
            
            current_total = task.get("total_time_spent", 0)
            time_entries = task.get("time_entries", [])
            time_entries.append(time_entry)
            
            update_data.update({
                "is_running": False,
                "current_session_start": None,
                "total_time_spent": current_total + duration_seconds,
                "time_entries": time_entries
            })
    
    result = db.tasks.find_one_and_update(
        {"_id": ObjectId(task_id), "user_id": user_id},
        {"$set": update_data},
        return_document=True
    )
    
    if result:
        result["id"] = str(result["_id"])
        del result["_id"]
    return result
