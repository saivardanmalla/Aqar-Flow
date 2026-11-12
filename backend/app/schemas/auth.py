from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: str
    full_name: str
    phone: str
    role: str = "agent"
    agency_id: str

class UserCreate(BaseModel):
    full_name: str
    agency_name: str
    email: str
    phone: str
    password: str = Field(..., min_length=6)

class GoogleAuthRequest(BaseModel):
    credential: Optional[str] = None
    email: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: dict

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(..., min_length=6)

class UserOut(BaseModel):
    id: str
    email: str
    full_name: str
    phone: str
    role: str
    agency_id: str
    is_active: bool
    avatar_url: Optional[str] = None
    created_at: Optional[datetime] = None
