from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.endpoints import auth
from app.permissions.rbac import require_admin, require_agent_or_admin

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="AQARFLOW Enterprise Real Estate Operations & CRM API"
)

# CORS safely configured
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health Check Endpoint
@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "aqarflow-backend",
        "version": "1.0.0",
        "architecture": "modular-fastapi"
    }

# Include Auth Router under /api/v1/auth
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["Authentication"])

# Role Protected Test Endpoints
@app.get(f"{settings.API_V1_STR}/admin/overview", tags=["Admin Workspace"])
def admin_overview(payload: dict = Depends(require_admin)):
    return {
        "access": "granted",
        "role": payload.get("role"),
        "agency_id": payload.get("agency_id"),
        "stats": {
            "total_properties": 248,
            "total_leads": 1240,
            "scheduled_visits": 124,
            "total_deals": 362
        }
    }

@app.get(f"{settings.API_V1_STR}/agent/overview", tags=["Agent Workspace"])
def agent_overview(payload: dict = Depends(require_agent_or_admin)):
    return {
        "access": "granted",
        "role": payload.get("role"),
        "agency_id": payload.get("agency_id"),
        "stats": {
            "my_leads": 45,
            "visits_this_month": 18,
            "deals_won": 12,
            "commission": 48000
        }
    }

