from pymongo import MongoClient
from app.core.config import settings

client = None
database = None


def connect_to_mongo():
    """Connect to MongoDB."""
    global client, database
    client = MongoClient(settings.MONGODB_URL)
    database = client[settings.DATABASE_NAME]
    print(f"Connected to MongoDB database: {settings.DATABASE_NAME}")


def close_mongo_connection():
    """Close MongoDB connection."""
    global client
    if client:
        client.close()
        print("Closed MongoDB connection")


def get_database():
    """Get database instance."""
    return database
