import os


ALLOWED_EXTENSIONS = [

    ".jpg",
    ".jpeg",
    ".png",

    ".mp4",

    ".pdf",

    ".doc",
    ".docx",

    ".txt",
    
    ".mp3",
    ".wav",
    ".ogg",
    ".m4a",
    
    ".webm",
    
]


MAX_FILE_SIZE = 10 * 1024 * 1024
# 10 MB


def validate_chat_file(uploaded_file):

    if not uploaded_file:
        return None
    
    
    if uploaded_file.size == 0:
        return (
            False,
            "Empty files are not allowed"
        )

    extension = os.path.splitext(
        uploaded_file.name
    )[1].lower()

    if extension not in ALLOWED_EXTENSIONS:

        return (
            False,
            "File type not allowed"
        )
        
        
    content_type = uploaded_file.content_type

    if content_type not in ALLOWED_MIME_TYPES:

        return (
            False,
            "Invalid file content type"
        )

    if uploaded_file.size > MAX_FILE_SIZE:

        return (
            False,
            "File size exceeds 10MB"
        )

    return (
        True,
        None
    )
    
    
    
ALLOWED_MIME_TYPES = [

    "image/jpeg",
    "image/png",

    "video/mp4",

    "application/pdf",

    "application/msword",

    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

    "text/plain",
    
    "audio/mpeg",
    "audio/wav",
    "audio/ogg",
    "audio/x-m4a",
    "audio/webm",
]