import os
import io
from typing import Optional
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload
from app.core.config import settings


class GoogleDriveService:
    """Service for interacting with Google Drive API."""
    
    def __init__(self):
        self.credentials = None
        self.service = None
        self._initialize_service()
    
    def _initialize_service(self):
        """Initialize Google Drive service with credentials."""
        try:
            # Check if credentials file exists
            creds_file = getattr(settings, 'GOOGLE_DRIVE_CREDENTIALS_FILE', None)
            if creds_file and os.path.exists(creds_file):
                self.credentials = service_account.Credentials.from_service_account_file(
                    creds_file,
                    scopes=['https://www.googleapis.com/auth/drive.file']
                )
                self.service = build('drive', 'v3', credentials=self.credentials)
        except Exception as e:
            print(f"Warning: Could not initialize Google Drive service: {e}")
            # Service remains None, which is handled in upload methods
    
    def _get_or_create_folder(self, folder_path: str) -> Optional[str]:
        """Get or create a folder in Google Drive."""
        if not self.service:
            return None
        
        try:
            # Split path into parts (e.g., "Video/Notas" -> ["Video", "Notas"])
            parts = folder_path.split('/')
            parent_id = 'root'
            
            for folder_name in parts:
                # Search for folder
                query = f"name='{folder_name}' and '{parent_id}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false"
                results = self.service.files().list(
                    q=query,
                    spaces='drive',
                    fields='files(id, name)'
                ).execute()
                
                folders = results.get('files', [])
                
                if folders:
                    parent_id = folders[0]['id']
                else:
                    # Create folder
                    folder_metadata = {
                        'name': folder_name,
                        'mimeType': 'application/vnd.google-apps.folder',
                        'parents': [parent_id]
                    }
                    folder = self.service.files().create(
                        body=folder_metadata,
                        fields='id'
                    ).execute()
                    parent_id = folder['id']
            
            return parent_id
        except Exception as e:
            print(f"Error creating folder: {e}")
            return None
    
    def upload_video(self, file_content: bytes, filename: str, mime_type: str = 'video/webm') -> Optional[str]:
        """
        Upload video to Google Drive in Video/Notas folder.
        
        Args:
            file_content: Video file content as bytes
            filename: Name of the file
            mime_type: MIME type of the video
            
        Returns:
            URL to access the file in Google Drive or None if upload fails
        """
        if not self.service:
            print("Google Drive service not initialized. Video will not be uploaded to Drive.")
            return None
        
        try:
            # Get or create Video/Notas folder
            folder_id = self._get_or_create_folder('Video/Notas')
            if not folder_id:
                return None
            
            # Prepare file metadata
            file_metadata = {
                'name': filename,
                'parents': [folder_id]
            }
            
            # Create media upload
            media = MediaIoBaseUpload(
                io.BytesIO(file_content),
                mimetype=mime_type,
                resumable=True
            )
            
            # Upload file
            file = self.service.files().create(
                body=file_metadata,
                media_body=media,
                fields='id, webViewLink, webContentLink'
            ).execute()
            
            # Make file accessible (optional - adjust permissions as needed)
            # For now, keeping it private (accessible only via authenticated Drive)
            
            # Return web view link
            return file.get('webViewLink') or file.get('webContentLink')
            
        except Exception as e:
            print(f"Error uploading video to Google Drive: {e}")
            return None
    
    def delete_video(self, file_url: str) -> bool:
        """
        Delete a video from Google Drive.
        
        Args:
            file_url: The Google Drive URL of the file
            
        Returns:
            True if deletion was successful, False otherwise
        """
        if not self.service or not file_url:
            return False
        
        try:
            # Extract file ID from URL
            # URLs are like: https://drive.google.com/file/d/FILE_ID/view
            file_id = None
            if '/d/' in file_url:
                file_id = file_url.split('/d/')[1].split('/')[0]
            
            if not file_id:
                return False
            
            # Delete file
            self.service.files().delete(fileId=file_id).execute()
            return True
            
        except Exception as e:
            print(f"Error deleting video from Google Drive: {e}")
            return False


# Singleton instance
google_drive_service = GoogleDriveService()
