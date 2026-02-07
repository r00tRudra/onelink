from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.user import User
from app.models.project import Project
from app.models.experience import Experience
from app.models.education import Education
from app.models.skill import Skill
from app.models.media import Media
from app.schemas.portfolio import PortfolioResponse

router = APIRouter()


@router.get("/{portfolio_username}", response_model=dict)
async def get_public_portfolio(
    portfolio_username: str,
    db: Session = Depends(get_db),
):
    """Get public portfolio by username (no authentication required)"""
    user = db.query(User).filter(
        User.portfolio_username == portfolio_username,
        User.is_public == True
    ).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio not found",
        )
    
    # Get visible projects only
    projects = db.query(Project).filter(
        Project.user_id == user.id,
        Project.is_visible == True
    ).all()
    
    # Get experiences
    experiences = db.query(Experience).filter(
        Experience.user_id == user.id
    ).all()
    
    # Get education
    education = db.query(Education).filter(
        Education.user_id == user.id
    ).all()
    
    # Get skills
    skills = db.query(Skill).filter(
        Skill.user_id == user.id
    ).all()
    
    # Get media
    media = db.query(Media).filter(
        Media.user_id == user.id,
        Media.project_id == None  # Portfolio-level media
    ).all()
    
    return {
        "user": {
            "portfolio_username": user.portfolio_username,
            "github_username": user.github_username,
            "bio": user.bio,
            "location": user.location,
            "avatar_url": user.avatar_url,
            "profile_url": user.profile_url,
            "resume_text": user.resume_text,
            "created_at": user.created_at.isoformat() if user.created_at else None,
        },
        "projects": [
            {
                "id": p.id,
                "name": p.name,
                "description": p.description,
                "url": p.url,
                "deployed_url": p.deployed_url,
                "status": p.status,
                "languages": p.languages,
                "stars": p.stars,
                "forks": p.forks,
                "media": db.query(Media).filter(Media.project_id == p.id).all()
            }
            for p in projects
        ],
        "experiences": [
            {
                "id": e.id,
                "title": e.title,
                "company": e.company,
                "location": e.location,
                "description": e.description,
                "start_date": e.start_date.isoformat() if e.start_date else None,
                "end_date": e.end_date.isoformat() if e.end_date else None,
                "is_current": bool(e.is_current),
            }
            for e in experiences
        ],
        "education": [
            {
                "id": ed.id,
                "school": ed.school,
                "degree": ed.degree,
                "field_of_study": ed.field_of_study,
                "description": ed.description,
                "start_date": ed.start_date.isoformat() if ed.start_date else None,
                "end_date": ed.end_date.isoformat() if ed.end_date else None,
                "is_current": bool(ed.is_current),
            }
            for ed in education
        ],
        "skills": [
            {
                "id": s.id,
                "name": s.name,
                "proficiency": s.proficiency,
                "category": s.category,
            }
            for s in skills
        ],
        "media": [
            {
                "id": m.id,
                "filename": m.filename,
                "file_path": m.file_path,
                "media_type": m.media_type,
                "mime_type": m.mime_type,
                "title": m.title,
                "description": m.description,
                "order": m.order,
            }
            for m in media
        ],
    }
