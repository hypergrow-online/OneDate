from typing import Optional, List
from datetime import datetime
from bson import ObjectId
from app.db.mongodb_utils import get_database
from app.models.note import NoteCreate, NoteUpdate


def create_note(note: NoteCreate, user_id: str) -> dict:
    """Create a new note."""
    db = get_database()
    note_dict = note.model_dump()
    note_dict["user_id"] = user_id
    note_dict["created_at"] = datetime.utcnow()
    note_dict["updated_at"] = datetime.utcnow()
    
    result = db.notes.insert_one(note_dict)
    note_dict["_id"] = str(result.inserted_id)
    return note_dict


def get_note(note_id: str, user_id: str) -> Optional[dict]:
    """Get a note by ID."""
    db = get_database()
    note = db.notes.find_one({"_id": ObjectId(note_id), "user_id": user_id})
    if note:
        note["_id"] = str(note["_id"])
    return note


def get_notes(user_id: str, skip: int = 0, limit: int = 100) -> List[dict]:
    """Get all notes for a user."""
    db = get_database()
    notes = list(db.notes.find({"user_id": user_id}).skip(skip).limit(limit))
    for note in notes:
        note["_id"] = str(note["_id"])
    return notes


def search_notes(user_id: str, query: str) -> List[dict]:
    """Search notes by title or content."""
    db = get_database()
    notes = list(db.notes.find({
        "user_id": user_id,
        "$or": [
            {"title": {"$regex": query, "$options": "i"}},
            {"content": {"$regex": query, "$options": "i"}}
        ]
    }))
    for note in notes:
        note["_id"] = str(note["_id"])
    return notes


def update_note(note_id: str, note_update: NoteUpdate, user_id: str) -> Optional[dict]:
    """Update a note."""
    db = get_database()
    update_dict = {k: v for k, v in note_update.model_dump().items() if v is not None}
    update_dict["updated_at"] = datetime.utcnow()
    
    result = db.notes.find_one_and_update(
        {"_id": ObjectId(note_id), "user_id": user_id},
        {"$set": update_dict},
        return_document=True
    )
    
    if result:
        result["_id"] = str(result["_id"])
    return result


def delete_note(note_id: str, user_id: str) -> bool:
    """Delete a note."""
    db = get_database()
    result = db.notes.delete_one({"_id": ObjectId(note_id), "user_id": user_id})
    return result.deleted_count > 0
