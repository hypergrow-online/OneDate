from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File
from app.models.note import NoteCreate, NoteUpdate, NoteResponse
from app.crud import crud_note
from app.core.deps import get_current_user
from app.services.google_drive import google_drive_service
from app.core.config import settings
import os
import uuid
from datetime import datetime

router = APIRouter()


@router.post("/", response_model=NoteResponse, status_code=status.HTTP_201_CREATED)
async def create_note(note: NoteCreate, current_user: dict = Depends(get_current_user)):
    """Create a new note."""
    db_note = crud_note.create_note(note, str(current_user["_id"]))
    return db_note


@router.get("/", response_model=List[NoteResponse])
async def get_notes(
    skip: int = 0,
    limit: int = 100,
    current_user: dict = Depends(get_current_user)
):
    """Get all notes for current user."""
    notes = crud_note.get_notes(str(current_user["_id"]), skip, limit)
    return notes


@router.get("/search", response_model=List[NoteResponse])
async def search_notes(
    q: str = Query(..., min_length=1),
    current_user: dict = Depends(get_current_user)
):
    """Search notes by title or content."""
    notes = crud_note.search_notes(str(current_user["_id"]), q)
    return notes


@router.get("/{note_id}", response_model=NoteResponse)
async def get_note(note_id: str, current_user: dict = Depends(get_current_user)):
    """Get a specific note."""
    note = crud_note.get_note(note_id, str(current_user["_id"]))
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        )
    return note


@router.put("/{note_id}", response_model=NoteResponse)
async def update_note(
    note_id: str,
    note_update: NoteUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update a note."""
    note = crud_note.update_note(note_id, note_update, str(current_user["_id"]))
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        )
    return note


@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_note(note_id: str, current_user: dict = Depends(get_current_user)):
    """Delete a note."""
    deleted = crud_note.delete_note(note_id, str(current_user["_id"]))
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        )


@router.post("/upload-video", response_model=NoteResponse, status_code=status.HTTP_201_CREATED)
async def upload_video_note(
    title: str,
    folder: str = "General",
    video: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """
    Upload a video note. The video will be uploaded to Google Drive 
    in the Video/Notas folder and a note will be created with the reference.
    """
    try:
        # Read video content
        video_content = await video.read()
        
        # Generate unique filename
        timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        file_extension = os.path.splitext(video.filename)[1] or '.webm'
        unique_filename = f"video_note_{timestamp}_{uuid.uuid4().hex[:8]}{file_extension}"
        
        # Upload to Google Drive
        drive_url = google_drive_service.upload_video(
            file_content=video_content,
            filename=unique_filename,
            mime_type=video.content_type or 'video/webm'
        )
        
        # Also save locally as backup (optional)
        upload_dir = settings.UPLOAD_DIR
        os.makedirs(upload_dir, exist_ok=True)
        local_path = os.path.join(upload_dir, unique_filename)
        
        with open(local_path, 'wb') as f:
            f.write(video_content)
        
        # Create note with video reference
        note_data = NoteCreate(
            title=title,
            content=f"Video note recorded on {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')}",
            folder=folder,
            tags=["video"],
            note_type="video",
            video_url=drive_url or f"/uploads/{unique_filename}"
        )
        
        db_note = crud_note.create_note(note_data, str(current_user["_id"]))
        return db_note
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error uploading video: {str(e)}"
        )
