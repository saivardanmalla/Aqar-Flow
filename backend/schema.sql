-- ====================================================================
-- AQARFLOW BY VIRELEO - POSTGRESQL PRODUCTION RELATIONAL SCHEMA
-- Multi-Tenant Real Estate Operations, ERP & CRM Engine
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";

-- 1. AGENCIES (Tenant Root)
CREATE TABLE IF NOT EXISTS agencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    tagline VARCHAR(500),
    email CITEXT NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    default_currency VARCHAR(10) NOT NULL DEFAULT 'PKR',
    timezone VARCHAR(50) NOT NULL DEFAULT 'Asia/Karachi',
    logo_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. USERS (Admins & Agents)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email CITEXT UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('agency_admin', 'agent')),
    phone VARCHAR(50) NOT NULL,
    avatar_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_agency_role ON users (agency_id, role);
CREATE INDEX idx_users_email ON users (email);

-- 3. PROPERTIES
CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    reference_code VARCHAR(50) NOT NULL,
    title VARCHAR(300) NOT NULL,
    slug VARCHAR(350) NOT NULL,
    description TEXT,
    purpose VARCHAR(20) NOT NULL CHECK (purpose IN ('sale', 'rent', 'lease')),
    category VARCHAR(50) NOT NULL CHECK (category IN ('residential', 'commercial', 'plot', 'industrial')),
    property_type VARCHAR(50) NOT NULL,
    price NUMERIC(15, 2) NOT NULL CHECK (price >= 0),
    currency VARCHAR(10) NOT NULL DEFAULT 'PKR',
    area_value NUMERIC(10, 2) NOT NULL,
    area_unit VARCHAR(20) NOT NULL CHECK (area_unit IN ('sqft', 'marla', 'kanal', 'sqyd')),
    bedrooms INT NOT NULL DEFAULT 0,
    bathrooms INT NOT NULL DEFAULT 0,
    covered_area NUMERIC(10, 2),
    plot_area NUMERIC(10, 2),
    address TEXT,
    city VARCHAR(100) NOT NULL,
    locality VARCHAR(150),
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    amenities JSONB DEFAULT '[]'::jsonb,
    furnishing_status VARCHAR(50) NOT NULL DEFAULT 'unfurnished',
    construction_status VARCHAR(50) NOT NULL DEFAULT 'ready',
    possession_status VARCHAR(50) NOT NULL DEFAULT 'immediate',
    assigned_agent_id UUID REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'available', 'reserved', 'under_offer', 'sold', 'rented', 'leased', 'inactive')),
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    views_count INT NOT NULL DEFAULT 0,
    inquiries_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_agency_reference_code UNIQUE (agency_id, reference_code)
);

CREATE INDEX idx_properties_agency_status ON properties (agency_id, status);
CREATE INDEX idx_properties_published_city ON properties (is_published, city, purpose);
CREATE INDEX idx_properties_price ON properties (price);

-- 4. PROPERTY MEDIA
CREATE TABLE IF NOT EXISTS property_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    caption VARCHAR(255),
    is_cover BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INT NOT NULL DEFAULT 0,
    file_size INT,
    mime_type VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_media_property ON property_media (property_id, display_order);

-- 5. LEADS (CRM)
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    customer_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email CITEXT,
    preferred_contact_method VARCHAR(20) NOT NULL DEFAULT 'phone' CHECK (preferred_contact_method IN ('phone', 'whatsapp', 'email')),
    inquiry_purpose VARCHAR(20) NOT NULL DEFAULT 'buy' CHECK (inquiry_purpose IN ('buy', 'rent', 'invest')),
    budget NUMERIC(15, 2),
    preferred_location VARCHAR(255),
    property_type VARCHAR(50),
    lead_source VARCHAR(50) NOT NULL DEFAULT 'website_inquiry' CHECK (lead_source IN ('website_inquiry', 'phone_call', 'walk_in', 'referral', 'social_media')),
    stage VARCHAR(50) NOT NULL DEFAULT 'new' CHECK (stage IN ('new', 'contacted', 'qualified', 'visit_scheduled', 'negotiation', 'converted', 'lost')),
    related_property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    assigned_agent_id UUID REFERENCES users(id) ON DELETE SET NULL,
    notes TEXT,
    next_follow_up_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_leads_agency_stage ON leads (agency_id, stage);
CREATE INDEX idx_leads_agent ON leads (assigned_agent_id);

-- 6. VISITS (Scheduling & Conflict Engine)
CREATE TABLE IF NOT EXISTS visits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    assigned_agent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    visit_date DATE NOT NULL,
    start_time TIME NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 45,
    meeting_location TEXT NOT NULL,
    visitor_count INT NOT NULL DEFAULT 1,
    notes TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'confirmed' CHECK (status IN ('requested', 'confirmed', 'completed', 'cancelled', 'no_show')),
    outcome_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_visits_agent_date ON visits (assigned_agent_id, visit_date, start_time);

-- 7. DEALS (Pipeline & Transactions)
CREATE TABLE IF NOT EXISTS deals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    assigned_agent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    seller_contact_name VARCHAR(255),
    offer_amount NUMERIC(15, 2) NOT NULL,
    agreed_amount NUMERIC(15, 2),
    expected_closing_date DATE,
    stage VARCHAR(50) NOT NULL DEFAULT 'offer' CHECK (stage IN ('inquiry', 'qualified', 'visit', 'offer', 'negotiation', 'booking', 'documentation', 'closed_won', 'closed_lost')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_deals_agency_stage ON deals (agency_id, stage);
CREATE INDEX idx_deals_property ON deals (property_id);

-- 8. AUDIT LOGS & ACTIVITIES
CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action_type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_activities_agency_lead ON activities (agency_id, lead_id, created_at DESC);
