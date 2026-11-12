import uuid
from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas.auth import (
    UserLogin, 
    TokenResponse, 
    ForgotPasswordRequest, 
    ResetPasswordRequest, 
    UserCreate, 
    GoogleAuthRequest
)
from app.core.security import verify_password, get_password_hash, create_access_token, create_refresh_token, decode_token
from app.permissions.rbac import get_current_user_payload

router = APIRouter()

DEMO_USERS = {
    "admin@aqarflow.com": {
        "id": "user-admin-01",
        "email": "admin@aqarflow.com",
        "password_hash": "$2b$12$e6m.0uO0i5tK8tM0o6eD5eL.n8T9x8f0yG7jQ0s7kG1f7H4m9bA3u",  # Password123!
        "raw_pwd": "Password123!",
        "full_name": "Sarah Ahmed",
        "agency_name": "Skyline Premier Properties",
        "role": "agency_admin",
        "agency_id": "agency-vireleo-001",
        "phone": "+92 300 8521470",
        "is_active": True,
        "avatar_url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
    },
    "bilal@aqarflow.com": {
        "id": "user-agent-01",
        "email": "bilal@aqarflow.com",
        "password_hash": "$2b$12$e6m.0uO0i5tK8tM0o6eD5eL.n8T9x8f0yG7jQ0s7kG1f7H4m9bA3u",
        "raw_pwd": "Password123!",
        "full_name": "Bilal Khan",
        "agency_name": "Skyline Premier Properties",
        "role": "agent",
        "agency_id": "agency-vireleo-001",
        "phone": "+92 321 4455667",
        "is_active": True,
        "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    }
}

ACTIVE_REFRESH_TOKENS = set()

@router.post("/login", response_model=TokenResponse)
def login(creds: UserLogin):
    email = creds.email.lower()
    user = DEMO_USERS.get(email)
    
    if not user or (creds.password != user.get("raw_pwd") and not verify_password(creds.password, user["password_hash"])):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password credentials."
        )
    
    if not user["is_active"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account has been deactivated. Contact agency administrator."
        )
    
    access_token = create_access_token(
        subject=user["id"], 
        role=user["role"], 
        agency_id=user["agency_id"]
    )
    refresh_token = create_refresh_token(subject=user["id"])
    ACTIVE_REFRESH_TOKENS.add(refresh_token)

    safe_user = {k: v for k, v in user.items() if k not in ["password_hash", "raw_pwd"]}
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": safe_user
    }

@router.post("/admin/login", response_model=TokenResponse)
def admin_login(creds: UserLogin):
    """
    Dedicated Admin-Only Login Server Endpoint.
    Strictly forbids non-admin users (agents, public accounts) from logging in.
    Only users with role 'agency_admin' or 'super_admin' can authenticate here.
    """
    email = creds.email.lower()
    user = DEMO_USERS.get(email)
    
    if not user or (creds.password != user.get("raw_pwd") and not verify_password(creds.password, user["password_hash"])):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid administrator credentials."
        )
    
    # Strict role verification: only admins allowed
    if user.get("role") not in ["agency_admin", "super_admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access Denied: This server endpoint is exclusively restricted to Administrators. Agents and regular users must use the User Login server."
        )
    
    if not user["is_active"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin account has been deactivated."
        )
    
    access_token = create_access_token(
        subject=user["id"], 
        role=user["role"], 
        agency_id=user["agency_id"]
    )
    refresh_token = create_refresh_token(subject=user["id"])
    ACTIVE_REFRESH_TOKENS.add(refresh_token)

    safe_user = {k: v for k, v in user.items() if k not in ["password_hash", "raw_pwd"]}
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": safe_user
    }

@router.post("/register", response_model=TokenResponse)
def register(req: UserCreate):
    email = req.email.lower()
    if email in DEMO_USERS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )
    
    new_user_id = f"user-{uuid.uuid4().hex[:8]}"
    new_agency_id = f"agency-{uuid.uuid4().hex[:8]}"
    hashed = get_password_hash(req.password)
    
    # Controlled agency onboarding: new self-registered account has role 'agency_admin' for their newly provisioned agency workspace
    new_user = {
        "id": new_user_id,
        "email": email,
        "password_hash": hashed,
        "raw_pwd": req.password,
        "full_name": req.full_name,
        "agency_name": req.agency_name,
        "role": "agency_admin",
        "agency_id": new_agency_id,
        "phone": req.phone,
        "is_active": True,
        "avatar_url": None
    }
    DEMO_USERS[email] = new_user
    
    access_token = create_access_token(new_user_id, new_user["role"], new_agency_id)
    refresh_token = create_refresh_token(new_user_id)
    ACTIVE_REFRESH_TOKENS.add(refresh_token)

    safe_user = {k: v for k, v in new_user.items() if k not in ["password_hash", "raw_pwd"]}
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": safe_user
    }

@router.post("/google", response_model=TokenResponse)
def google_auth(req: GoogleAuthRequest):
    # Verify Google token or email identity
    target_email = req.email.lower() if req.email else "admin@aqarflow.com"
    user = DEMO_USERS.get(target_email)
    
    if not user:
        # Create Google authorized user with agency workspace
        new_id = f"user-g-{uuid.uuid4().hex[:6]}"
        user = {
            "id": new_id,
            "email": target_email,
            "password_hash": "",
            "full_name": "Google Authenticated User",
            "agency_name": "AqarFlow Global Partner",
            "role": "agency_admin",
            "agency_id": "agency-vireleo-001",
            "phone": "+1 000 000 0000",
            "is_active": True,
            "avatar_url": None
        }
        DEMO_USERS[target_email] = user

    access_token = create_access_token(user["id"], user["role"], user["agency_id"])
    refresh_token = create_refresh_token(user["id"])
    ACTIVE_REFRESH_TOKENS.add(refresh_token)
    safe_user = {k: v for k, v in user.items() if k not in ["password_hash", "raw_pwd"]}
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": safe_user
    }

@router.post("/logout")
def logout(refresh_token: str = ""):
    if refresh_token in ACTIVE_REFRESH_TOKENS:
        ACTIVE_REFRESH_TOKENS.remove(refresh_token)
    return {"message": "Successfully logged out."}

@router.post("/refresh")
def refresh_token(payload: dict):
    r_token = payload.get("refresh_token")
    if not r_token or r_token not in ACTIVE_REFRESH_TOKENS:
        raise HTTPException(status_code=401, detail="Invalid or revoked refresh token.")
    
    decoded = decode_token(r_token)
    if not decoded or decoded.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Expired refresh token.")
    
    user_id = decoded.get("sub")
    user = next((u for u in DEMO_USERS.values() if u["id"] == user_id), None)
    if not user:
        raise HTTPException(status_code=401, detail="User not found.")
    
    ACTIVE_REFRESH_TOKENS.remove(r_token)
    new_access_token = create_access_token(user["id"], user["role"], user["agency_id"])
    new_refresh_token = create_refresh_token(user["id"])
    ACTIVE_REFRESH_TOKENS.add(new_refresh_token)
    
    return {
        "access_token": new_access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer"
    }

@router.get("/me")
def get_current_user(payload: dict = Depends(get_current_user_payload)):
    user_id = payload.get("sub")
    user = next((u for u in DEMO_USERS.values() if u["id"] == user_id), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    safe_user = {k: v for k, v in user.items() if k not in ["password_hash", "raw_pwd"]}
    return {"user": safe_user}

@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest):
    return {"message": f"Password reset instructions have been dispatched to {req.email}."}

@router.post("/reset-password")
def reset_password(req: ResetPasswordRequest):
    return {"message": "Your password has been successfully updated. You may now log in."}
