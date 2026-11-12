# AqarFlow by VIRELEO
## Real Estate ERP, CRM & Property Discovery Platform

> **"One connected platform for modern real estate operations"**  
> *Developed by **VIRELEO** — Build • Innovate • Grow*

---

## 🌟 Overview
**AqarFlow** is a modern, unified real estate management platform that combines a **public property discovery marketplace** with a **private enterprise agency operations workspace**.

Engineered specifically for real estate agencies, dealers, builders, and brokers operating in Pakistan (Islamabad, Lahore, Karachi, Rawalpindi) with an architecture ready for international expansion.

### Key Capabilities
1. **Public Property Marketplace**: High-impact discovery portal with multi-filter search (For Sale, For Rent, Property Type, City, Price Range, Bedrooms), verified listings with reference codes, high-resolution architectural photography, and direct inquiry booking.
2. **Automated Inquiry-to-CRM Pipeline**: Every public inquiry automatically creates a CRM lead with stage `new`, logs a system activity event, and notifies the agency.
3. **Role-Based Access Control (RBAC)**: Strict tenant isolation between **Agency Admin** (full oversight, team roster, inventory control) and **Agent** (assigned leads and visits only).
4. **Intelligent Visit Scheduling & Conflict Engine**: On-site visit booking with backend timestamp overlap detection that prevents double-booking agents for buyer tours.
5. **Sales & Deal Pipeline**: End-to-end deal lifecycle management tracking initial offers, agreed amounts, token deposits, documentation, and property status transitions (`Sold`, `Rented`, `Under Offer`).
6. **Executive Operations Dashboard**: Real-time KPI cards, monthly inquiry trend line chart, lead pipeline donut chart, recent activity timeline, and upcoming visits.

---

## 🔑 Demo Seed Accounts

| Role | Name | Email | Password | Access Level |
|---|---|---|---|---|
| **Agency Admin** | Sarah Ahmed | `admin@aqarflow.com` | `Password123!` | Complete agency workspace, all leads, inventory CRUD, agent management |
| **Agent / Consultant** | Bilal Khan | `bilal@aqarflow.com` | `Password123!` | Assigned leads only, scheduled visits, deal pipeline |

*A 1-Click Role Switcher is also provided in the top header and sign-in modal for quick verification of permissions and tenant isolation.*

---

## 🛠️ Architecture & Tech Stack

### Running Applet Architecture (Port 3000)
- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Motion.
- **Backend / API**: Express 4 mounted with Vite middleware running on port 3000 via `server.ts`.
- **API Prefix**: `/api/v1`
- **Data Persistence**: Agency-isolated data engine seeded with realistic Pakistan real estate records (Islamabad Margalla villas, DHA Lahore apartments, Clifton Karachi residences, Bahria Town commercial plazas).

### Production PostgreSQL & FastAPI Architecture Deliverables
- **Relational Schema**: `backend/schema.sql` (UUID keys, foreign key constraints, indexes, timestamps, soft-deletes).
- **Alembic Migration**: `backend/migrations/versions/001_initial_schema.py`.
- **API Specification**: `docs/api/OPENAPI_SPEC.md`.
- **Pytest Automated Tests**: `backend/tests/test_api.py`.
- **Playwright E2E Tests**: `tests/e2e/marketplace_and_crm.spec.ts`.

---

## 📂 Project Structure

```
aqarflow/
├── backend/
│   ├── schema.sql                         # Complete PostgreSQL production schema
│   ├── migrations/versions/
│   │   └── 001_initial_schema.py          # Alembic versioned migration
│   └── tests/
│       └── test_api.py                    # Pytest test suite
├── docs/
│   ├── api/
│   │   └── OPENAPI_SPEC.md                # REST API documentation
│   └── user-guides/
│       ├── ADMIN_USER_GUIDE.md            # Agency Admin guide
│       └── AGENT_USER_GUIDE.md            # Agent / Consultant guide
├── tests/
│   └── e2e/
│       └── marketplace_and_crm.spec.ts    # Playwright E2E browser tests
├── src/
│   ├── assets/images/                     # Architectural photography assets
│   ├── components/
│   │   ├── workspace/                     # ERP & CRM modules
│   │   │   ├── WorkspaceLayout.tsx
│   │   │   ├── DashboardView.tsx
│   │   │   ├── PropertiesView.tsx
│   │   │   ├── LeadsView.tsx
│   │   │   ├── VisitsView.tsx
│   │   │   ├── DealsView.tsx
│   │   │   ├── AgentsView.tsx
│   │   │   └── SettingsView.tsx
│   │   ├── AqarFlowLogo.tsx               # Brand logo by VIRELEO
│   │   ├── Navbar.tsx                     # Top Bar Contract
│   │   ├── HeroSection.tsx                # Hero banner & search engine
│   │   ├── PropertyCard.tsx               # Listing card with metadata
│   │   ├── PropertyDetailModal.tsx        # Full specs & gallery modal
│   │   ├── InquiryModal.tsx               # Public inquiry capture
│   │   ├── AuthModal.tsx                  # Sign-in & demo switcher
│   │   └── Footer.tsx                     # Feature highlights & VIRELEO mark
│   ├── context/
│   │   └── AuthContext.tsx                # Authentication & RBAC state
│   ├── lib/
│   │   ├── api.ts                         # Client fetch library
│   │   └── utils.ts                       # PKR formatting & date helpers
│   ├── types/
│   │   └── index.ts                       # TypeScript schemas
│   ├── App.tsx                            # Root application router
│   ├── index.css                          # Tailwind v4 configuration
│   └── main.tsx                           # React 19 entry point
├── server.ts                              # Full-stack API & dev server
├── package.json
└── README.md
```

---

## 🚀 Running the Platform

To run the development server:
```bash
npm run dev
```

To build for production:
```bash
npm run build
npm start
```

---

## 🏆 MVP Acceptance Tests Verified
1. **Admin and Agent Authentication**: Secure sign in with role-based session generation.
2. **Role-Based Isolation**: Agents only see leads and visits explicitly assigned to them.
3. **Property Inventory CRUD**: Create, update, publish/unpublish, and filter properties with unique reference code enforcement.
4. **Public Marketplace Discovery**: Search by purpose, city, property type, price, and bedrooms.
5. **Inquiry-to-Lead Automation**: Every valid inquiry submitted on the website creates a corresponding CRM lead in stage `New`.
6. **Agent Visit Conflict Engine**: Double bookings on overlapping time slots are rejected with `409 Conflict`.
7. **Sales & Deal Tracking**: Complete lifecycle tracking from offer to closing.
8. **Live Real Statistics**: Dashboard metrics calculated from live database records.
