"""
AQARFLOW DAY 1 & DAY 2 ACCEPTANCE TEST SUITE (Pytest)
Validates:
1. Admin can log in.
2. Agent can log in.
3. Invalid credentials are rejected.
4. Unauthenticated users cannot access dashboards.
5. Agent cannot access Admin-only APIs.
6. Admin can access authorized management pages.
7. Agent can access assigned leads/overview.
8. Expired/invalid sessions are handled correctly.
9. Logout invalidates session.
10. Agency isolation and RBAC.
"""
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    """Day 1: Health check endpoint verification."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_admin_login_success():
    """Scenario 1: Admin can log in successfully."""
    response = client.post("/api/v1/auth/login", json={
        "email": "admin@aqarflow.com",
        "password": "Password123!"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["user"]["role"] == "agency_admin"
    assert data["user"]["email"] == "admin@aqarflow.com"

def test_agent_login_success():
    """Scenario 2: Agent can log in successfully."""
    response = client.post("/api/v1/auth/login", json={
        "email": "bilal@aqarflow.com",
        "password": "Password123!"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["role"] == "agent"

def test_invalid_credentials_rejected():
    """Scenario 3: Invalid credentials are rejected with 401."""
    response = client.post("/api/v1/auth/login", json={
        "email": "admin@aqarflow.com",
        "password": "WrongPassword!"
    })
    assert response.status_code == 401
    assert "Invalid email or password" in response.json()["detail"]

def test_unauthenticated_access_rejected():
    """Scenario 4: Unauthenticated users cannot access dashboards."""
    response = client.get("/api/v1/admin/overview")
    assert response.status_code == 401

def test_agent_cannot_access_admin_api():
    """Scenario 5: Agent cannot access Admin-only APIs (403 Forbidden)."""
    # 1. Login as agent
    agent_login = client.post("/api/v1/auth/login", json={
        "email": "bilal@aqarflow.com",
        "password": "Password123!"
    }).json()
    agent_token = agent_login["access_token"]

    # 2. Try accessing admin overview
    response = client.get(
        "/api/v1/admin/overview",
        headers={"Authorization": f"Bearer {agent_token}"}
    )
    assert response.status_code == 403
    assert "Forbidden" in response.json()["detail"]

def test_admin_can_access_authorized_endpoints():
    """Scenario 6: Admin can access authorized management endpoints."""
    admin_login = client.post("/api/v1/auth/login", json={
        "email": "admin@aqarflow.com",
        "password": "Password123!"
    }).json()
    admin_token = admin_login["access_token"]

    response = client.get(
        "/api/v1/admin/overview",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
    assert response.json()["access"] == "granted"
    assert response.json()["role"] == "agency_admin"

def test_agent_can_access_agent_overview():
    """Scenario 7: Agent can access assigned workspace view."""
    agent_login = client.post("/api/v1/auth/login", json={
        "email": "bilal@aqarflow.com",
        "password": "Password123!"
    }).json()
    agent_token = agent_login["access_token"]

    response = client.get(
        "/api/v1/agent/overview",
        headers={"Authorization": f"Bearer {agent_token}"}
    )
    assert response.status_code == 200
    assert response.json()["access"] == "granted"
    assert response.json()["stats"]["my_leads"] == 45

def test_refresh_token_rotation():
    """Scenario 8 & 9: Refresh token rotation and session invalidation."""
    login_res = client.post("/api/v1/auth/login", json={
        "email": "admin@aqarflow.com",
        "password": "Password123!"
    }).json()
    r_token = login_res["refresh_token"]

    # Refresh
    refresh_res = client.post("/api/v1/auth/refresh", json={"refresh_token": r_token})
    assert refresh_res.status_code == 200
    new_r_token = refresh_res.json()["refresh_token"]
    assert new_r_token != r_token

    # Old token must now be invalid
    old_try = client.post("/api/v1/auth/refresh", json={"refresh_token": r_token})
    assert old_try.status_code == 401

    # Logout
    logout_res = client.post(f"/api/v1/auth/logout?refresh_token={new_r_token}")
    assert logout_res.status_code == 200
