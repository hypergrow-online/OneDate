#!/usr/bin/env python3
"""
Quick validation script to verify backend structure and imports
"""

import sys
import os

# Add the backend directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

def test_imports():
    """Test that all modules can be imported"""
    print("Testing imports...")
    
    try:
        from app.core.config import settings
        print("✓ Config imported successfully")
        print(f"  - Project: {settings.PROJECT_NAME}")
        
        from app.core.security import verify_password, get_password_hash, create_access_token
        print("✓ Security module imported successfully")
        
        from app.models.user import UserCreate, UserResponse
        from app.models.task import TaskCreate, TaskResponse
        from app.models.note import NoteCreate, NoteResponse
        print("✓ All models imported successfully")
        
        from app.crud import crud_user, crud_task, crud_note
        print("✓ All CRUD modules imported successfully")
        
        from app.api.v1 import auth, tasks, notes
        print("✓ All API routers imported successfully")
        
        from app.main import app
        print("✓ Main app imported successfully")
        
        print("\n✅ All imports successful!")
        return True
        
    except Exception as e:
        print(f"\n❌ Import error: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_password_hashing():
    """Test password hashing functions"""
    print("\nTesting password hashing...")
    
    try:
        from app.core.security import verify_password, get_password_hash
        
        password = "test_password_123"
        hashed = get_password_hash(password)
        
        if verify_password(password, hashed):
            print("✓ Password hashing works correctly")
            return True
        else:
            print("❌ Password verification failed")
            return False
            
    except Exception as e:
        print(f"❌ Password hashing error: {e}")
        return False

def test_jwt_token():
    """Test JWT token creation"""
    print("\nTesting JWT token creation...")
    
    try:
        from app.core.security import create_access_token, decode_token
        
        data = {"sub": "user123"}
        token = create_access_token(data)
        decoded = decode_token(token)
        
        if decoded and decoded.get("sub") == "user123":
            print("✓ JWT token creation and decoding works")
            return True
        else:
            print("❌ JWT token decoding failed")
            return False
            
    except Exception as e:
        print(f"❌ JWT token error: {e}")
        return False

def main():
    """Run all tests"""
    print("=" * 60)
    print("Backend Structure Validation")
    print("=" * 60)
    
    tests = [
        test_imports,
        test_password_hashing,
        test_jwt_token,
    ]
    
    results = [test() for test in tests]
    
    print("\n" + "=" * 60)
    if all(results):
        print("✅ All tests passed!")
        print("=" * 60)
        return 0
    else:
        print("❌ Some tests failed!")
        print("=" * 60)
        return 1

if __name__ == "__main__":
    sys.exit(main())
