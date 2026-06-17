import os
from app.config import settings

def delete_file(file_path: str) -> bool:
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            return True
        return False
    except Exception:
        return False

def get_file_extension(filename: str) -> str:
    return filename.split(".")[-1].lower() if "." in filename else ""

def is_allowed_file(filename: str) -> bool:
    ext = get_file_extension(filename)
    return ext in settings.ALLOWED_EXTENSIONS
