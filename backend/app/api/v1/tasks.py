from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from app.models.task import TaskCreate, TaskUpdate, TaskResponse
from app.crud import crud_task
from app.core.deps import get_current_user

router = APIRouter()


@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(task: TaskCreate, current_user: dict = Depends(get_current_user)):
    """Create a new task."""
    db_task = crud_task.create_task(task, str(current_user["_id"]))
    return db_task


@router.get("/", response_model=List[TaskResponse])
async def get_tasks(
    skip: int = 0,
    limit: int = 100,
    current_user: dict = Depends(get_current_user)
):
    """Get all tasks for current user."""
    tasks = crud_task.get_tasks(str(current_user["_id"]), skip, limit)
    return tasks


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(task_id: str, current_user: dict = Depends(get_current_user)):
    """Get a specific task."""
    task = crud_task.get_task(task_id, str(current_user["_id"]))
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    return task


@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: str,
    task_update: TaskUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update a task."""
    task = crud_task.update_task(task_id, task_update, str(current_user["_id"]))
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(task_id: str, current_user: dict = Depends(get_current_user)):
    """Delete a task."""
    deleted = crud_task.delete_task(task_id, str(current_user["_id"]))
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
