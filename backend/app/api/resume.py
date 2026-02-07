from fastapi import APIRouter, File, UploadFile, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.services.resume_parser import resume_parser
from app.schemas.resume import ResumeUploadResponse
import tempfile
import os

router = APIRouter()


@router.post("/upload", response_model=ResumeUploadResponse)
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Upload and parse resume"""

    allowed_types = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ]

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF and DOCX files are supported",
        )

    suffix = ".pdf" if file.content_type == "application/pdf" else ".docx"

    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(await file.read())
        temp_path = tmp.name

    try:
        if suffix == ".pdf":
            text = resume_parser.extract_text_from_pdf(temp_path)
        else:
            text = resume_parser.extract_text_from_docx(temp_path)

        # Allow empty extraction safely
        if not text:
            text = ""

        parsed_data = resume_parser.parse_resume_text(text)

        current_user.resume_raw = text
        current_user.resume_text = text[:5000]
        db.commit()

        return {
            "message": f"Resume {file.filename} uploaded successfully",
            "parsed_data": {
                "experiences": parsed_data.get("experiences", []),
                "education": parsed_data.get("education", []),
                "skills": parsed_data.get("skills", []),
                "raw_text": text[:1000] + "..." if len(text) > 1000 else text,
            }
        }

    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)


@router.get("/text")
async def get_resume_text(
    current_user: User = Depends(get_current_user),
):
    """Always return resume text (empty if none)"""

    return {
        "resume_text": current_user.resume_raw or ""
    }


