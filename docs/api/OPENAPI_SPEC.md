# AQARFLOW REST API SPECIFICATION (v1)
### One Connected Real Estate ERP, CRM & Property Operations Platform by VIRELEO

Base URL: `/api/v1`

---

## 1. Authentication & Session

### `POST /api/v1/auth/login`
- **Description:** Authenticates Agency Admin or Agent. Sets secure HttpOnly cookie and returns Bearer token.
- **Request Body:**
  ```json
  {
    "email": "admin@aqarflow.com",
    "password": "Password123!"
  }
  ```
- **Responses:**
  - `200 OK`: Returns token and sanitized user profile.
  - `401 Unauthorized`: Invalid credentials.
  - `403 Forbidden`: Deactivated account.

### `POST /api/v1/auth/logout`
- **Description:** Terminates active session and clears authentication cookies.

### `GET /api/v1/auth/me`
- **Description:** Returns profile of currently authenticated user.

---

## 2. Public Marketplace APIs

### `GET /api/v1/public/properties`
- **Description:** Returns published property listings with search, price sorting, and geographic filtering.
- **Query Parameters:** `purpose`, `property_type`, `city`, `minPrice`, `maxPrice`, `bedrooms`, `search`, `sort`
- **Response:**
  ```json
  {
    "total": 6,
    "properties": [ ... ]
  }
  ```

### `GET /api/v1/public/properties/:slug`
- **Description:** Detailed view of a single listing. Increments view counter.

### `POST /api/v1/public/inquiries`
- **Description:** Receives public visitor inquiry for a property or general consultation. **Automatically creates a corresponding CRM Lead with stage `new` and logs a system activity event.**
- **Request Body:**
  ```json
  {
    "customer_name": "Tariq Mehmood",
    "phone": "+92 300 5112233",
    "email": "tariq@example.com",
    "preferred_contact_method": "whatsapp",
    "inquiry_purpose": "buy",
    "property_id": "prop-af-001",
    "notes": "Looking to schedule a viewing."
  }
  ```
- **Response `201 Created`**: Returns confirmation message and newly created CRM lead record.

---

## 3. Agency Properties Management

### `GET /api/v1/properties`
- **Access:** Authenticated Users (`agency_admin`, `agent`).
- **Description:** Complete inventory access.

### `POST /api/v1/properties`
- **Access:** `agency_admin` only.
- **Description:** Creates new property. Validates unique reference code within agency.

### `PATCH /api/v1/properties/:id`
- **Access:** `agency_admin` only.
- **Description:** Updates property fields, status, or publication flag.

### `DELETE /api/v1/properties/:id`
- **Access:** `agency_admin` only.
- **Description:** Removes or archives listing.

---

## 4. Lead Management CRM

### `GET /api/v1/leads`
- **Access:** Authenticated.
- **RBAC Rule:**
  - `agency_admin`: Retrieves all agency leads.
  - `agent`: Retrieves only leads assigned to the authenticated agent.

### `POST /api/v1/leads`
- **Description:** Manually creates a lead.

### `PATCH /api/v1/leads/:id`
- **Description:** Updates lead stage or appends follow-up consultation notes.

### `POST /api/v1/leads/:id/assign`
- **Access:** `agency_admin` only.
- **Description:** Assigns or reassigns lead to a consultant.

---

## 5. Property Visits & Conflict Engine

### `GET /api/v1/visits`
- **Description:** Returns scheduled visits.

### `POST /api/v1/visits`
- **Description:** Schedules an on-site property tour.
- **Backend Conflict Check:** Validates whether the assigned agent already has a confirmed visit overlapping the selected time on that date.
- **Conflict Response `409 Conflict`**:
  ```json
  {
    "error": "Scheduling Conflict: Bilal Khan already has a scheduled visit at 11:00 on 2026-11-09 (Duration: 45m). Please select an alternate time."
  }
  ```

---

## 6. Deal Pipeline & Sales Closing

### `GET /api/v1/deals`
- **Description:** Returns deal lifecycle records.

### `POST /api/v1/deals`
- **Description:** Records an offer or sales negotiation. Validates single active confirmed sale per property.

---

## 7. Dashboard & Analytics

### `GET /api/v1/reports/dashboard`
- **Description:** Returns aggregated business metrics computed from real database records (Total properties, published, available, new leads, scheduled visits, open deals, monthly inquiry trend, and pipeline distribution).
