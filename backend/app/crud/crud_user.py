from typing import Optional
from datetime import datetime
from bson import ObjectId
from app.db.mongodb_utils import get_database
from app.core.security import get_password_hash, verify_password
from app.models.user import UserCreate


def create_user(user: UserCreate) -> dict:
    """Create a new user."""
    db = get_database()
    
    # Check if user already exists
    existing_user = db.users.find_one({"email": user.email})
    if existing_user:
        raise ValueError("User with this email already exists")
    
    user_dict = user.model_dump()
    user_dict["password"] = get_password_hash(user.password)
    user_dict["created_at"] = datetime.utcnow()
    
    result = db.users.insert_one(user_dict)
    user_dict["_id"] = str(result.inserted_id)
    del user_dict["password"]  # Don't return password
    return user_dict


def get_user_by_email(email: str) -> Optional[dict]:
    """Get a user by email."""
    db = get_database()
    user = db.users.find_one({"email": email})
    if user:
        user["_id"] = str(user["_id"])
    return user


def get_user_by_id(user_id: str) -> Optional[dict]:
    """Get a user by ID."""
    db = get_database()
    user = db.users.find_one({"_id": ObjectId(user_id)})
    if user:
        user["_id"] = str(user["_id"])
    return user


def authenticate_user(email: str, password: str) -> Optional[dict]:
    """Authenticate a user."""
    user = get_user_by_email(email)
    if not user:
        return None
    if not verify_password(password, user["password"]):
        return None
    return user
