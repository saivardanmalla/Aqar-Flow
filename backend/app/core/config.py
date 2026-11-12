import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "AQARFLOW"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "aqarflow-super-secret-jwt-key-2026-vireleo")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "postgresql://postgres:postgres@localhost:5432/aqarflow_db"
    )
    
    # Agency Isolation
    DEFAULT_AGENCY_ID: str = "agency-vireleo-001"

settings = Settings()
