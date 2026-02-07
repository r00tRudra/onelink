from pydantic import BaseModel, EmailStr, HttpUrl, Field
from typing import Optional, List
from datetime import datetime


class UserBase(BaseModel):
    github_username: str
    bio: Optional[str] = None
    location: Optional[str] = None


class UserCreate(UserBase):
    pass


class UserUpdate(BaseModel):
    bio: Optional[str] = None
    location: Optional[str] = None
    is_public: Optional[bool] = None
    resume_text: Optional[str] = None


class UserResponse(UserBase):
    id: int
    github_id: int
    portfolio_username: str
    avatar_url: Optional[str]
    profile_url: Optional[str]
    email: Optional[str]
    is_public: bool
    resume_text: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    last_sync: Optional[datetime]

    class Config:
        from_attributes = True


class UserPublicResponse(BaseModel):
    """Public profile data (no sensitive info)"""
    portfolio_username: str
    github_username: str
    bio: Optional[str]
    location: Optional[str]
    avatar_url: Optional[str]
    profile_url: Optional[str]
    is_public: bool
    resume_text: Optional[str] = None

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int


class OAuthCallbackRequest(BaseModel):
    code: str
    state: str
