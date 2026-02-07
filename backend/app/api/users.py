from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime

from app.db.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.experience import Experience
from app.models.education import Education
from app.models.skill import Skill
from app.schemas.user import UserResponse, UserUpdate, UserPublicResponse
from app.schemas.resume import (
    ExperienceResponse, ExperienceCreate, ExperienceUpdate,
    EducationResponse, EducationCreate, EducationUpdate,
    SkillResponse, SkillCreate, SkillUpdate,
)

router = APIRouter()


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    current_user: User = Depends(get_current_user),
):
    """Get current user's profile"""
    return current_user


@router.put("/me", response_model=UserResponse)
async def update_user_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update current user's profile"""
    if user_update.bio is not None:
        current_user.bio = user_update.bio
    if user_update.location is not None:
        current_user.location = user_update.location
    if user_update.is_public is not None:
        current_user.is_public = user_update.is_public
    if user_update.resume_text is not None:
        current_user.resume_text = user_update.resume_text[:5000]
    
    current_user.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(current_user)
    return current_user


@router.get("/{portfolio_username}", response_model=UserPublicResponse)
async def get_public_user_profile(
    portfolio_username: str,
    db: Session = Depends(get_db),
):
    """Get public user profile by portfolio username"""
    user = db.query(User).filter(
        User.portfolio_username == portfolio_username,
        User.is_public == True
    ).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    return user


# Experience endpoints
@router.post("/me/experience", response_model=ExperienceResponse)
async def create_experience(
    experience: ExperienceCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Add work experience"""
    db_experience = Experience(
        user_id=current_user.id,
        **experience.dict()
    )
    db.add(db_experience)
    db.commit()
    db.refresh(db_experience)
    return db_experience


@router.get("/me/experience", response_model=list[ExperienceResponse])
async def get_user_experiences(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all work experiences"""
    return db.query(Experience).filter(
        Experience.user_id == current_user.id
    ).all()


@router.put("/me/experience/{experience_id}", response_model=ExperienceResponse)
async def update_experience(
    experience_id: int,
    experience_update: ExperienceUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update work experience"""
    db_experience = db.query(Experience).filter(
        Experience.id == experience_id,
        Experience.user_id == current_user.id
    ).first()
    
    if not db_experience:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Experience not found",
        )
    
    for key, value in experience_update.dict(exclude_unset=True).items():
        setattr(db_experience, key, value)
    
    db.commit()
    db.refresh(db_experience)
    return db_experience


@router.delete("/me/experience/{experience_id}")
async def delete_experience(
    experience_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete work experience"""
    db_experience = db.query(Experience).filter(
        Experience.id == experience_id,
        Experience.user_id == current_user.id
    ).first()
    
    if not db_experience:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Experience not found",
        )
    
    db.delete(db_experience)
    db.commit()
    return {"message": "Experience deleted"}


# Education endpoints
@router.post("/me/education", response_model=EducationResponse)
async def create_education(
    education: EducationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Add education"""
    db_education = Education(
        user_id=current_user.id,
        **education.dict()
    )
    db.add(db_education)
    db.commit()
    db.refresh(db_education)
    return db_education


@router.get("/me/education", response_model=list[EducationResponse])
async def get_user_education(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all education"""
    return db.query(Education).filter(
        Education.user_id == current_user.id
    ).all()


@router.put("/me/education/{education_id}", response_model=EducationResponse)
async def update_education(
    education_id: int,
    education_update: EducationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update education"""
    db_education = db.query(Education).filter(
        Education.id == education_id,
        Education.user_id == current_user.id
    ).first()
    
    if not db_education:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Education not found",
        )
    
    for key, value in education_update.dict(exclude_unset=True).items():
        setattr(db_education, key, value)
    
    db.commit()
    db.refresh(db_education)
    return db_education


@router.delete("/me/education/{education_id}")
async def delete_education(
    education_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete education"""
    db_education = db.query(Education).filter(
        Education.id == education_id,
        Education.user_id == current_user.id
    ).first()
    
    if not db_education:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Education not found",
        )
    
    db.delete(db_education)
    db.commit()
    return {"message": "Education deleted"}


# Skills endpoints
@router.post("/me/skills", response_model=SkillResponse)
async def create_skill(
    skill: SkillCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Add skill"""
    db_skill = Skill(
        user_id=current_user.id,
        **skill.dict()
    )
    db.add(db_skill)
    db.commit()
    db.refresh(db_skill)
    return db_skill


@router.get("/me/skills", response_model=list[SkillResponse])
async def get_user_skills(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all skills"""
    return db.query(Skill).filter(
        Skill.user_id == current_user.id
    ).all()


@router.put("/me/skills/{skill_id}", response_model=SkillResponse)
async def update_skill(
    skill_id: int,
    skill_update: SkillUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update skill"""
    db_skill = db.query(Skill).filter(
        Skill.id == skill_id,
        Skill.user_id == current_user.id
    ).first()
    
    if not db_skill:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found",
        )
    
    for key, value in skill_update.dict(exclude_unset=True).items():
        setattr(db_skill, key, value)
    
    db.commit()
    db.refresh(db_skill)
    return db_skill


@router.delete("/me/skills/{skill_id}")
async def delete_skill(
    skill_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete skill"""
    db_skill = db.query(Skill).filter(
        Skill.id == skill_id,
        Skill.user_id == current_user.id
    ).first()
    
    if not db_skill:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found",
        )
    
    db.delete(db_skill)
    db.commit()
    return {"message": "Skill deleted"}