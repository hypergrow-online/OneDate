from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from app.models.note import NoteCreate, NoteUpdate, NoteResponse
from app.crud import crud_note
from app.core.deps import get_current_user

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
