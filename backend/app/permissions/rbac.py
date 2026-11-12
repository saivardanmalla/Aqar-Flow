from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.security import decode_token

security_scheme = HTTPBearer(auto_error=False)

def get_current_user_payload(credentials: HTTPAuthorizationCredentials = Depends(security_scheme)):
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token required.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    payload = decode_token(credentials.credentials)
    if not payload or payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return payload

def require_admin(payload: dict = Depends(get_current_user_payload)):
    if payload.get("role") != "agency_admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Admin access privileges required.",
        )
    return payload

def require_agent_or_admin(payload: dict = Depends(get_current_user_payload)):
    if payload.get("role") not in ["agency_admin", "agent"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Unauthorized role.",
        )
    return payload

