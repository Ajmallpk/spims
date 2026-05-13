import firebase_admin

from firebase_admin import credentials

from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent.parent

firebase_cred_path = (
    BASE_DIR
    / "config"
    / "firebase"
    / "serviceAccountKey.json"
)


if not firebase_admin._apps:

    cred = credentials.Certificate(
        firebase_cred_path
    )

    firebase_admin.initialize_app(cred)