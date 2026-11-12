import express, { Request, Response, NextFunction } from 'express';
import cors from "cors";
import { createServer as createViteServer } from 'vite';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// -------------------------------------------------------------
// IN-MEMORY / SEED DATABASE ARCHITECTURE (Agency Isolated)
// -------------------------------------------------------------
const AGENCY_ID = 'agency-vireleo-001';

interface UserRecord {
  id: string;
  agency_id: string;
  full_name: string;
  email: string;
  password_hash: string;
  role: 'agency_admin' | 'agent';
  phone: string;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface PropertyRecord {
  id: string;
  agency_id: string;
  reference_code: string;
  title: string;
  slug: string;
  description: string;
  purpose: 'sale' | 'rent' | 'lease';
  category: 'residential' | 'commercial' | 'plot' | 'industrial';
  property_type: 'house' | 'apartment' | 'villa' | 'penthouse' | 'office' | 'shop' | 'plot_residential' | 'plot_commercial';
  price: number;
  currency: string;
  area_value: number;
  area_unit: 'sqft' | 'marla' | 'kanal' | 'sqyd';
  bedrooms: number;
  bathrooms: number;
  covered_area?: number;
  plot_area?: number;
  address: string;
  city: string;
  locality: string;
  latitude?: number;
  longitude?: number;
  amenities: string[];
  furnishing_status: 'unfurnished' | 'semi_furnished' | 'fully_furnished';
  construction_status: 'ready' | 'under_construction' | 'off_plan';
  possession_status: 'available' | 'immediate' | 'within_3_months';
  assigned_agent_id?: string;
  status: 'draft' | 'available' | 'reserved' | 'under_offer' | 'sold' | 'rented' | 'leased' | 'inactive';
  is_published: boolean;
  views_count: number;
  inquiries_count: number;
  media: {
    id: string;
    property_id: string;
    url: string;
    caption?: string;
    is_cover: boolean;
    display_order: number;
    created_at: string;
  }[];
  created_at: string;
  updated_at: string;
}

interface LeadRecord {
  id: string;
  agency_id: string;
  customer_name: string;
  phone: string;
  email: string;
  preferred_contact_method: 'phone' | 'whatsapp' | 'email';
  inquiry_purpose: 'buy' | 'rent' | 'invest';
  budget?: number;
  preferred_location?: string;
  property_type?: string;
  lead_source: 'website_inquiry' | 'phone_call' | 'walk_in' | 'referral' | 'social_media';
  stage: 'new' | 'contacted' | 'qualified' | 'visit_scheduled' | 'negotiation' | 'converted' | 'lost';
  related_property_id?: string;
  assigned_agent_id?: string;
  notes?: string;
  next_follow_up_date?: string;
  created_at: string;
  updated_at: string;
}

interface ActivityRecord {
  id: string;
  agency_id: string;
  lead_id?: string;
  property_id?: string;
  user_id?: string;
  user_name?: string;
  action_type: 'stage_change' | 'note_added' | 'visit_scheduled' | 'assigned' | 'inquiry_created' | 'deal_updated';
  description: string;
  created_at: string;
}

interface VisitRecord {
  id: string;
  agency_id: string;
  property_id: string;
  lead_id: string;
  assigned_agent_id: string;
  visit_date: string; // YYYY-MM-DD
  start_time: string; // HH:MM
  duration_minutes: number;
  meeting_location: string;
  visitor_count: number;
  notes?: string;
  status: 'requested' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  outcome_notes?: string;
  created_at: string;
  updated_at: string;
}

interface DealRecord {
  id: string;
  agency_id: string;
  property_id: string;
  lead_id: string;
  assigned_agent_id: string;
  seller_contact_name?: string;
  offer_amount: number;
  agreed_amount?: number;
  expected_closing_date?: string;
  stage: 'inquiry' | 'qualified' | 'visit' | 'offer' | 'negotiation' | 'booking' | 'documentation' | 'closed_won' | 'closed_lost';
  notes?: string;
  created_at: string;
  updated_at: string;
}

// -------------------------------------------------------------
// INITIAL SEED DATA (Pakistan Real Estate Market)
// -------------------------------------------------------------
const users: UserRecord[] = [
  {
    id: 'user-admin-01',
    agency_id: AGENCY_ID,
    full_name: 'Sarah Ahmed',
    email: 'admin@aqarflow.com',
    password_hash: 'Password123!', // In production bcrypt/argon2id
    role: 'agency_admin',
    phone: '+92 300 8521470',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    is_active: true,
    created_at: '2026-01-10T08:00:00Z',
    updated_at: '2026-01-10T08:00:00Z',
  },
  {
    id: 'user-agent-01',
    agency_id: AGENCY_ID,
    full_name: 'Bilal Khan',
    email: 'bilal@aqarflow.com',
    password_hash: 'Password123!',
    role: 'agent',
    phone: '+92 321 4455667',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    is_active: true,
    created_at: '2026-01-15T09:30:00Z',
    updated_at: '2026-01-15T09:30:00Z',
  },
  {
    id: 'user-agent-02',
    agency_id: AGENCY_ID,
    full_name: 'Ayesha Malik',
    email: 'ayesha@aqarflow.com',
    password_hash: 'Password123!',
    role: 'agent',
    phone: '+92 333 9988771',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    is_active: true,
    created_at: '2026-01-20T11:00:00Z',
    updated_at: '2026-01-20T11:00:00Z',
  },
  {
    id: 'user-agent-03',
    agency_id: AGENCY_ID,
    full_name: 'Hamza Tariq',
    email: 'hamza@aqarflow.com',
    password_hash: 'Password123!',
    role: 'agent',
    phone: '+92 345 1122334',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    is_active: true,
    created_at: '2026-02-01T10:15:00Z',
    updated_at: '2026-02-01T10:15:00Z',
  },
];

const properties: PropertyRecord[] = [
  {
    id: 'prop-af-001',
    agency_id: AGENCY_ID,
    reference_code: 'AF-001',
    title: 'Luxury 1 Kanal Contemporary Designer Villa',
    slug: 'luxury-1-kanal-contemporary-designer-villa-islamabad-af-001',
    description: 'An architectural masterpiece situated in prestigious Sector F-7/2 Islamabad with sweeping views of the Margalla Hills. Features imported Italian marble, automated climate control, private infinity lap pool, double height ceilings, designer show kitchen, and a landscaped Zen garden.',
    purpose: 'sale',
    category: 'residential',
    property_type: 'villa',
    price: 45000000,
    currency: 'PKR',
    area_value: 5000,
    area_unit: 'sqft',
    bedrooms: 5,
    bathrooms: 5,
    covered_area: 5000,
    plot_area: 5400,
    address: 'Street 14, Sector F-7/2',
    city: 'Islamabad',
    locality: 'Sector F-7',
    latitude: 33.7215,
    longitude: 73.0566,
    amenities: ['Margalla View', 'Infinity Pool', 'Solar Backup', 'Smart Automation', 'Servant Quarters', 'Gated Security', 'Central AC'],
    furnishing_status: 'fully_furnished',
    construction_status: 'ready',
    possession_status: 'immediate',
    assigned_agent_id: 'user-admin-01',
    status: 'available',
    is_published: true,
    views_count: 1420,
    inquiries_count: 38,
    media: [
      {
        id: 'media-01',
        property_id: 'prop-af-001',
        url: '/src/assets/images/property_islamabad_villa_1794204424374.jpg',
        caption: 'Exterior architectural twilight elevation and pool',
        is_cover: true,
        display_order: 1,
        created_at: '2026-01-12T10:00:00Z',
      },
    ],
    created_at: '2026-01-12T10:00:00Z',
    updated_at: '2026-01-12T10:00:00Z',
  },
  {
    id: 'prop-af-002',
    agency_id: AGENCY_ID,
    reference_code: 'AF-002',
    title: 'Signature High-Floor Modern Residence & Penthouse',
    slug: 'signature-high-floor-modern-residence-lahore-af-002',
    description: 'Luxury high-rise residential apartment located on Main Boulevard DHA Phase 6 Lahore. Boasts floor-to-ceiling soundproof glazing, private terrace balconies, designer lobby concierge, 24/7 power backup, and basement reserved parking.',
    purpose: 'rent',
    category: 'residential',
    property_type: 'apartment',
    price: 85000,
    currency: 'PKR',
    area_value: 2500,
    area_unit: 'sqft',
    bedrooms: 3,
    bathrooms: 3,
    covered_area: 2500,
    plot_area: 2500,
    address: 'DHA Phase 6 Main Boulevard',
    city: 'Lahore',
    locality: 'DHA Phase 6',
    latitude: 31.4822,
    longitude: 74.4533,
    amenities: ['Basement Parking', '24/7 Power Backup', 'Fitness Center', 'High-Speed Elevators', 'CCTV Security', 'Terrace Balcony'],
    furnishing_status: 'semi_furnished',
    construction_status: 'ready',
    possession_status: 'immediate',
    assigned_agent_id: 'user-agent-01',
    status: 'available',
    is_published: true,
    views_count: 980,
    inquiries_count: 24,
    media: [
      {
        id: 'media-02',
        property_id: 'prop-af-002',
        url: '/src/assets/images/property_lahore_apartment_1794204426205.jpg',
        caption: 'Building facade and contemporary glass balconies',
        is_cover: true,
        display_order: 1,
        created_at: '2026-01-18T14:30:00Z',
      },
    ],
    created_at: '2026-01-18T14:30:00Z',
    updated_at: '2026-01-18T14:30:00Z',
  },
  {
    id: 'prop-af-003',
    agency_id: AGENCY_ID,
    reference_code: 'AF-003',
    title: 'Executive Coastal Travertine Residence & Garden',
    slug: 'executive-coastal-travertine-residence-karachi-af-003',
    description: 'A bespoke architectural mansion in Clifton Block 4 Karachi. Features custom travertine stone cladding, tropical private courtyard with swimming pool, smart security surveillance, imported Turkish fittings, and grand entertaining halls.',
    purpose: 'sale',
    category: 'residential',
    property_type: 'house',
    price: 32000000,
    currency: 'PKR',
    area_value: 4200,
    area_unit: 'sqft',
    bedrooms: 4,
    bathrooms: 4,
    covered_area: 4200,
    plot_area: 4500,
    address: 'Block 4, Clifton',
    city: 'Karachi',
    locality: 'Clifton',
    latitude: 24.8198,
    longitude: 67.0322,
    amenities: ['Private Pool', 'Courtyard Garden', 'Solar Hybrid', 'Security Cameras', 'Guard Room', 'Driver Quarters'],
    furnishing_status: 'fully_furnished',
    construction_status: 'ready',
    possession_status: 'immediate',
    assigned_agent_id: 'user-agent-02',
    status: 'under_offer',
    is_published: true,
    views_count: 1850,
    inquiries_count: 42,
    media: [
      {
        id: 'media-03',
        property_id: 'prop-af-003',
        url: '/src/assets/images/property_karachi_bungalow_1794204425910.jpg',
        caption: 'Luxury exterior with courtyard pool and modern lighting',
        is_cover: true,
        display_order: 1,
        created_at: '2026-01-22T09:00:00Z',
      },
    ],
    created_at: '2026-01-22T09:00:00Z',
    updated_at: '2026-01-22T09:00:00Z',
  },
  {
    id: 'prop-af-004',
    agency_id: AGENCY_ID,
    reference_code: 'AF-004',
    title: 'Prime Corporate Plaza & Retail Boulevard Hub',
    slug: 'prime-corporate-plaza-retail-boulevard-hub-af-004',
    description: 'State-of-the-art multi-tenant commercial plaza in Bahria Town Civic Center Rawalpindi. Premium road frontage, high footfall retail ground floor, Grade-A executive office suites, backup generators, and expansive underground parking.',
    purpose: 'rent',
    category: 'commercial',
    property_type: 'office',
    price: 450000,
    currency: 'PKR',
    area_value: 8500,
    area_unit: 'sqft',
    bedrooms: 0,
    bathrooms: 6,
    covered_area: 8500,
    plot_area: 9000,
    address: 'Civic Center Commercial Area, Phase 4',
    city: 'Rawalpindi',
    locality: 'Bahria Town',
    latitude: 33.5651,
    longitude: 73.0845,
    amenities: ['High Footfall', 'Elevators', 'Basement Parking', 'Power Generator', 'Fire Suppression', 'Fiber Internet'],
    furnishing_status: 'unfurnished',
    construction_status: 'ready',
    possession_status: 'immediate',
    assigned_agent_id: 'user-agent-03',
    status: 'available',
    is_published: true,
    views_count: 1120,
    inquiries_count: 19,
    media: [
      {
        id: 'media-04',
        property_id: 'prop-af-004',
        url: '/src/assets/images/property_bahria_commercial_1794204426276.jpg',
        caption: 'Corporate building facade with retail boulevard',
        is_cover: true,
        display_order: 1,
        created_at: '2026-02-02T16:00:00Z',
      },
    ],
    created_at: '2026-02-02T16:00:00Z',
    updated_at: '2026-02-02T16:00:00Z',
  },
  {
    id: 'prop-af-005',
    agency_id: AGENCY_ID,
    reference_code: 'AF-005',
    title: 'Brand New 10 Marla Corner Modern House',
    slug: 'brand-new-10-marla-corner-modern-house-af-005',
    description: 'Corner plot double-unit house in Bahria Town Phase 8. Modern elevation, 2 separate utility connections, Ash wood woodwork, imported sanitary ware, and terrace BBQ zone.',
    purpose: 'sale',
    category: 'residential',
    property_type: 'house',
    price: 48000000,
    currency: 'PKR',
    area_value: 3200,
    area_unit: 'sqft',
    bedrooms: 5,
    bathrooms: 5,
    covered_area: 3200,
    plot_area: 3200,
    address: 'Sector F, Phase 8, Bahria Town',
    city: 'Rawalpindi',
    locality: 'Bahria Town Phase 8',
    latitude: 33.5412,
    longitude: 73.1023,
    amenities: ['Corner Plot', 'Double Unit', 'Solar Inverter', 'Car Porch for 2 Cars', 'Servant Room'],
    furnishing_status: 'semi_furnished',
    construction_status: 'ready',
    possession_status: 'immediate',
    assigned_agent_id: 'user-agent-03',
    status: 'sold',
    is_published: true,
    views_count: 890,
    inquiries_count: 21,
    media: [
      {
        id: 'media-05',
        property_id: 'prop-af-005',
        url: '/src/assets/images/property_islamabad_villa_1794204424374.jpg',
        caption: 'Corner front elevation with modern accents',
        is_cover: true,
        display_order: 1,
        created_at: '2026-02-05T12:00:00Z',
      },
    ],
    created_at: '2026-02-05T12:00:00Z',
    updated_at: '2026-02-05T12:00:00Z',
  },
  {
    id: 'prop-af-006',
    agency_id: AGENCY_ID,
    reference_code: 'AF-006',
    title: 'Modern 2-Bed Serviced Luxury Suite in Gulberg III',
    slug: 'modern-2-bed-serviced-luxury-suite-gulberg-af-006',
    description: 'Fully furnished serviced apartment in the heart of Gulberg III Lahore, walking distance to MM Alam Road dining and shopping. Rooftop pool, dedicated valet, and housekeeping.',
    purpose: 'rent',
    category: 'residential',
    property_type: 'apartment',
    price: 140000,
    currency: 'PKR',
    area_value: 1450,
    area_unit: 'sqft',
    bedrooms: 2,
    bathrooms: 2,
    covered_area: 1450,
    plot_area: 1450,
    address: 'MM Alam Road, Gulberg III',
    city: 'Lahore',
    locality: 'Gulberg III',
    latitude: 31.5204,
    longitude: 74.3587,
    amenities: ['Serviced Housekeeping', 'Rooftop Pool', 'Valet Parking', 'Backup Generator', 'Gym'],
    furnishing_status: 'fully_furnished',
    construction_status: 'ready',
    possession_status: 'immediate',
    assigned_agent_id: 'user-agent-01',
    status: 'available',
    is_published: true,
    views_count: 730,
    inquiries_count: 16,
    media: [
      {
        id: 'media-06',
        property_id: 'prop-af-006',
        url: '/src/assets/images/property_lahore_apartment_1794204426205.jpg',
        caption: 'Luxury serviced suite exterior',
        is_cover: true,
        display_order: 1,
        created_at: '2026-02-10T10:00:00Z',
      },
    ],
    created_at: '2026-02-10T10:00:00Z',
    updated_at: '2026-02-10T10:00:00Z',
  },
];

const leads: LeadRecord[] = [
  {
    id: 'lead-01',
    agency_id: AGENCY_ID,
    customer_name: 'Tariq Mehmood',
    phone: '+92 300 5112233',
    email: 'tariq.mehmood@example.com',
    preferred_contact_method: 'phone',
    inquiry_purpose: 'buy',
    budget: 50000000,
    preferred_location: 'Sector F-7, Islamabad',
    property_type: 'villa',
    lead_source: 'website_inquiry',
    stage: 'qualified',
    related_property_id: 'prop-af-001',
    assigned_agent_id: 'user-admin-01',
    notes: 'Overseas Pakistani buyer returning to Islamabad next month. Wants immediate possession.',
    next_follow_up_date: '2026-11-12T10:00:00Z',
    created_at: '2026-11-01T08:30:00Z',
    updated_at: '2026-11-05T14:20:00Z',
  },
  {
    id: 'lead-02',
    agency_id: AGENCY_ID,
    customer_name: 'Dr. Zainab Farooq',
    phone: '+92 321 8899001',
    email: 'dr.zainab@example.com',
    preferred_contact_method: 'whatsapp',
    inquiry_purpose: 'rent',
    budget: 90000,
    preferred_location: 'DHA Phase 6, Lahore',
    property_type: 'apartment',
    lead_source: 'website_inquiry',
    stage: 'visit_scheduled',
    related_property_id: 'prop-af-002',
    assigned_agent_id: 'user-agent-01',
    notes: 'Requires 3-bedroom apartment for medical family near Lahore Ring Road. Visit confirmed for today.',
    next_follow_up_date: '2026-11-09T11:00:00Z',
    created_at: '2026-11-03T11:15:00Z',
    updated_at: '2026-11-07T16:00:00Z',
  },
  {
    id: 'lead-03',
    agency_id: AGENCY_ID,
    customer_name: 'Usman Raza',
    phone: '+92 333 4567890',
    email: 'usman.raza@example.com',
    preferred_contact_method: 'phone',
    inquiry_purpose: 'buy',
    budget: 35000000,
    preferred_location: 'Clifton, Karachi',
    property_type: 'house',
    lead_source: 'referral',
    stage: 'negotiation',
    related_property_id: 'prop-af-003',
    assigned_agent_id: 'user-agent-02',
    notes: 'Offered 30M PKR on AF-003. Owner countered at 31.5M. In active closing negotiation.',
    next_follow_up_date: '2026-11-10T15:00:00Z',
    created_at: '2026-10-25T14:00:00Z',
    updated_at: '2026-11-06T18:30:00Z',
  },
  {
    id: 'lead-04',
    agency_id: AGENCY_ID,
    customer_name: 'Kamran Aslam',
    phone: '+92 345 7766554',
    email: 'kamran.aslam@example.com',
    preferred_contact_method: 'email',
    inquiry_purpose: 'invest',
    budget: 500000,
    preferred_location: 'Bahria Town, Rawalpindi',
    property_type: 'office',
    lead_source: 'website_inquiry',
    stage: 'new',
    related_property_id: 'prop-af-004',
    assigned_agent_id: undefined,
    notes: 'Inquired for corporate floor lease in Bahria Town commercial plaza. Needs 5000+ sqft.',
    created_at: '2026-11-08T19:30:00Z',
    updated_at: '2026-11-08T19:30:00Z',
  },
  {
    id: 'lead-05',
    agency_id: AGENCY_ID,
    customer_name: 'Fatima Noor',
    phone: '+92 312 3344556',
    email: 'fatima.noor@example.com',
    preferred_contact_method: 'whatsapp',
    inquiry_purpose: 'rent',
    budget: 150000,
    preferred_location: 'Gulberg III, Lahore',
    property_type: 'apartment',
    lead_source: 'social_media',
    stage: 'contacted',
    related_property_id: 'prop-af-006',
    assigned_agent_id: 'user-agent-01',
    notes: 'Looking for 2-bed fully furnished suite for 1-year corporate contract.',
    next_follow_up_date: '2026-11-11T12:00:00Z',
    created_at: '2026-11-07T09:00:00Z',
    updated_at: '2026-11-07T12:00:00Z',
  },
  {
    id: 'lead-06',
    agency_id: AGENCY_ID,
    customer_name: 'Waleed Sheikh',
    phone: '+92 300 9988776',
    email: 'waleed.sheikh@example.com',
    preferred_contact_method: 'phone',
    inquiry_purpose: 'buy',
    budget: 48000000,
    preferred_location: 'Bahria Town Phase 8, Rawalpindi',
    property_type: 'house',
    lead_source: 'walk_in',
    stage: 'converted',
    related_property_id: 'prop-af-005',
    assigned_agent_id: 'user-agent-03',
    notes: 'Deal finalized at 47.5M PKR. Token payment deposited. Booking completed.',
    created_at: '2026-10-15T11:00:00Z',
    updated_at: '2026-11-02T15:30:00Z',
  },
];

const activities: ActivityRecord[] = [
  {
    id: 'act-01',
    agency_id: AGENCY_ID,
    property_id: 'prop-af-005',
    lead_id: 'lead-06',
    user_id: 'user-agent-03',
    user_name: 'Hamza Tariq',
    action_type: 'deal_updated',
    description: 'Deal updated - PKR 47.5M booked for AF-005 Bahria Town',
    created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    id: 'act-02',
    agency_id: AGENCY_ID,
    property_id: 'prop-af-002',
    lead_id: 'lead-02',
    user_id: 'user-agent-01',
    user_name: 'Bilal Khan',
    action_type: 'visit_scheduled',
    description: 'Visit scheduled - DHA Phase 6 Lahore for Dr. Zainab Farooq',
    created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: 'act-03',
    agency_id: AGENCY_ID,
    property_id: 'prop-af-004',
    lead_id: 'lead-04',
    action_type: 'inquiry_created',
    description: 'New inquiry for Commercial Plaza received from Kamran Aslam',
    created_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
];

const visits: VisitRecord[] = [
  {
    id: 'visit-01',
    agency_id: AGENCY_ID,
    property_id: 'prop-af-002',
    lead_id: 'lead-02',
    assigned_agent_id: 'user-agent-01',
    visit_date: new Date().toISOString().split('T')[0],
    start_time: '11:00',
    duration_minutes: 45,
    meeting_location: 'Main Gate Reception, DHA Phase 6, Lahore',
    visitor_count: 2,
    notes: 'Client interested in top floor balcony orientation and parking accessibility.',
    status: 'confirmed',
    created_at: '2026-11-07T16:00:00Z',
    updated_at: '2026-11-07T16:00:00Z',
  },
  {
    id: 'visit-02',
    agency_id: AGENCY_ID,
    property_id: 'prop-af-004',
    lead_id: 'lead-04',
    assigned_agent_id: 'user-agent-03',
    visit_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    start_time: '15:00',
    duration_minutes: 60,
    meeting_location: 'Bahria Town Civic Center Entrance',
    visitor_count: 3,
    notes: 'Corporate management team walk-through for 2nd and 3rd floor office spaces.',
    status: 'confirmed',
    created_at: '2026-11-08T10:00:00Z',
    updated_at: '2026-11-08T10:00:00Z',
  },
  {
    id: 'visit-03',
    agency_id: AGENCY_ID,
    property_id: 'prop-af-001',
    lead_id: 'lead-01',
    assigned_agent_id: 'user-admin-01',
    visit_date: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
    start_time: '10:30',
    duration_minutes: 60,
    meeting_location: 'Sector F-7/2 Property Gate, Islamabad',
    visitor_count: 2,
    notes: 'VIP client viewing luxury villa with architect and civil engineer.',
    status: 'requested',
    created_at: '2026-11-08T14:00:00Z',
    updated_at: '2026-11-08T14:00:00Z',
  },
];

const deals: DealRecord[] = [
  {
    id: 'deal-01',
    agency_id: AGENCY_ID,
    property_id: 'prop-af-003',
    lead_id: 'lead-03',
    assigned_agent_id: 'user-agent-02',
    seller_contact_name: 'Malik Jahangir',
    offer_amount: 30000000,
    agreed_amount: 31500000,
    expected_closing_date: '2026-11-25',
    stage: 'negotiation',
    notes: 'Buyer has arranged 70% direct pay order, balance upon transfer registry.',
    created_at: '2026-10-28T10:00:00Z',
    updated_at: '2026-11-06T18:30:00Z',
  },
  {
    id: 'deal-02',
    agency_id: AGENCY_ID,
    property_id: 'prop-af-002',
    lead_id: 'lead-02',
    assigned_agent_id: 'user-agent-01',
    seller_contact_name: 'Farhan Tariq',
    offer_amount: 80000,
    agreed_amount: 85000,
    expected_closing_date: '2026-11-15',
    stage: 'offer',
    notes: 'Tenancy agreement draft prepared with 2 months advance security deposit.',
    created_at: '2026-11-04T12:00:00Z',
    updated_at: '2026-11-07T14:00:00Z',
  },
  {
    id: 'deal-03',
    agency_id: AGENCY_ID,
    property_id: 'prop-af-005',
    lead_id: 'lead-06',
    assigned_agent_id: 'user-agent-03',
    seller_contact_name: 'Chaudhry Akram',
    offer_amount: 47000000,
    agreed_amount: 47500000,
    expected_closing_date: '2026-11-05',
    stage: 'closed_won',
    notes: 'Successfully closed. Commission fee received. Property marked as sold.',
    created_at: '2026-10-18T10:00:00Z',
    updated_at: '2026-11-02T15:30:00Z',
  },
];

const agencySettings = {
  id: AGENCY_ID,
  name: 'Skyline Premier Properties',
  tagline: 'Leading Real Estate Advisory & Asset Management in Pakistan',
  email: 'operations@skylinepk.com',
  phone: '+92 51 2899000',
  address: 'Suite 401, Blue Area, Jinnah Avenue, Islamabad',
  default_currency: 'PKR',
  timezone: 'Asia/Karachi',
  website: 'https://aqarflow.vireleo.com',
};

// -------------------------------------------------------------
// AUTHENTICATION & AUTHORIZATION HELPERS
// -------------------------------------------------------------
const activeSessions = new Map<string, { userId: string; role: 'agency_admin' | 'agent'; agencyId: string }>();

// Seed default active sessions for quick demo and testing
activeSessions.set('session-token-admin', {
  userId: 'user-admin-01',
  role: 'agency_admin',
  agencyId: AGENCY_ID,
});

activeSessions.set('session-token-agent', {
  userId: 'user-agent-01',
  role: 'agent',
  agencyId: AGENCY_ID,
});

function getAuthenticatedUser(req: Request) {
  // Check Authorization header or HttpOnly cookie
  const authHeader = req.headers.authorization;
  let token = '';
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (req.cookies && req.cookies.aqarflow_token) {
    token = req.cookies.aqarflow_token;
  }

  if (!token) return null;
  const session = activeSessions.get(token);
  if (!session) return null;

  const user = users.find((u) => u.id === session.userId && u.is_active);
  return user || null;
}

function requireAuth(req: Request, res: Response, next: NextFunction) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Authentication required. Please sign in.' });
  }
  (req as any).user = user;
  next();
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Authentication required.' });
  }
  if (user.role !== 'agency_admin') {
    return res.status(403).json({ error: 'Forbidden: Admin access privileges required.' });
  }
  (req as any).user = user;
  next();
}

// -------------------------------------------------------------
// API V1 ROUTERS
// -------------------------------------------------------------

// --- AUTHENTICATION ---
app.post('/api/v1/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.password_hash !== password) {
    return res.status(401).json({ error: 'Invalid email or password credentials.' });
  }

  if (!user.is_active) {
    return res.status(403).json({ error: 'Account has been deactivated. Contact agency admin.' });
  }

  // Generate session token
  const token = `aqar_${crypto.randomBytes(24).toString('hex')}`;
  activeSessions.set(token, {
    userId: user.id,
    role: user.role,
    agencyId: user.agency_id,
  });

  // Set secure cookie
  res.cookie('aqarflow_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  const { password_hash, ...safeUser } = user;
  return res.json({
    token,
    user: safeUser,
    message: `Welcome back, ${user.full_name}!`,
  });
});

app.post('/api/v1/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  let token = '';
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (req.cookies && req.cookies.aqarflow_token) {
    token = req.cookies.aqarflow_token;
  }

  if (token) {
    activeSessions.delete(token);
  }
  res.clearCookie('aqarflow_token');
  return res.json({ message: 'Successfully logged out.' });
});

app.get('/api/v1/auth/me', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }
  const { password_hash, ...safeUser } = user;
  return res.json({ user: safeUser });
});

// --- PUBLIC PROPERTIES (Discovery Marketplace) ---
app.get('/api/v1/public/properties', (req: Request, res: Response) => {
  const { purpose, property_type, city, minPrice, maxPrice, bedrooms, search, sort } = req.query;

  let results = properties.filter((p) => p.is_published);

  if (purpose && typeof purpose === 'string' && purpose !== 'all') {
    results = results.filter((p) => p.purpose.toLowerCase() === purpose.toLowerCase());
  }

  if (property_type && typeof property_type === 'string' && property_type !== 'all') {
    results = results.filter((p) => p.property_type.toLowerCase() === property_type.toLowerCase());
  }

  if (city && typeof city === 'string' && city !== 'all') {
    results = results.filter((p) => p.city.toLowerCase() === city.toLowerCase());
  }

  if (minPrice && !isNaN(Number(minPrice))) {
    results = results.filter((p) => p.price >= Number(minPrice));
  }

  if (maxPrice && !isNaN(Number(maxPrice))) {
    results = results.filter((p) => p.price <= Number(maxPrice));
  }

  if (bedrooms && !isNaN(Number(bedrooms)) && Number(bedrooms) > 0) {
    results = results.filter((p) => p.bedrooms >= Number(bedrooms));
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    results = results.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.reference_code.toLowerCase().includes(q) ||
        p.locality.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q)
    );
  }

  // Sorting
  if (sort === 'price_asc') {
    results.sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    results.sort((a, b) => b.price - a.price);
  } else {
    // Newest first
    results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  // Attach assigned agent public summary
  const enriched = results.map((p) => {
    const agent = users.find((u) => u.id === p.assigned_agent_id);
    return {
      ...p,
      assigned_agent: agent ? { id: agent.id, full_name: agent.full_name, phone: agent.phone } : undefined,
    };
  });

  return res.json({
    total: enriched.length,
    properties: enriched,
  });
});

app.get('/api/v1/public/properties/:slug', (req: Request, res: Response) => {
  const { slug } = req.params;
  const property = properties.find((p) => p.slug === slug || p.id === slug || p.reference_code.toLowerCase() === slug.toLowerCase());
  if (!property || !property.is_published) {
    return res.status(404).json({ error: 'Property listing not found or unpublished.' });
  }

  // Increment view counter
  property.views_count += 1;

  const agent = users.find((u) => u.id === property.assigned_agent_id);
  return res.json({
    property: {
      ...property,
      assigned_agent: agent ? { id: agent.id, full_name: agent.full_name, phone: agent.phone, email: agent.email } : undefined,
    },
  });
});

// --- PUBLIC INQUIRIES (Automatically Creates CRM Lead) ---
app.post('/api/v1/public/inquiries', (req: Request, res: Response) => {
  const { customer_name, phone, email, preferred_contact_method, inquiry_purpose, budget, property_id, notes } = req.body;

  if (!customer_name || !phone) {
    return res.status(400).json({ error: 'Customer name and phone number are required.' });
  }

  const relatedProp = property_id ? properties.find((p) => p.id === property_id) : undefined;
  if (relatedProp) {
    relatedProp.inquiries_count += 1;
  }

  const newLead: LeadRecord = {
    id: `lead-${Date.now()}`,
    agency_id: AGENCY_ID,
    customer_name,
    phone,
    email: email || '',
    preferred_contact_method: preferred_contact_method || 'phone',
    inquiry_purpose: inquiry_purpose || (relatedProp ? (relatedProp.purpose === 'sale' ? 'buy' : 'rent') : 'buy'),
    budget: budget ? Number(budget) : relatedProp ? relatedProp.price : undefined,
    preferred_location: relatedProp ? `${relatedProp.locality}, ${relatedProp.city}` : undefined,
    property_type: relatedProp ? relatedProp.property_type : undefined,
    lead_source: 'website_inquiry',
    stage: 'new',
    related_property_id: relatedProp ? relatedProp.id : undefined,
    assigned_agent_id: relatedProp?.assigned_agent_id || undefined,
    notes: notes || `Direct website inquiry for ${relatedProp ? relatedProp.reference_code + ' - ' + relatedProp.title : 'General Portfolio'}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  leads.unshift(newLead);

  // Automatically record Activity
  const activity: ActivityRecord = {
    id: `act-${Date.now()}`,
    agency_id: AGENCY_ID,
    lead_id: newLead.id,
    property_id: relatedProp?.id,
    action_type: 'inquiry_created',
    description: `New online inquiry received from ${customer_name} for ${relatedProp ? relatedProp.reference_code : 'General Inquiry'}`,
    created_at: new Date().toISOString(),
  };
  activities.unshift(activity);

  return res.status(201).json({
    message: 'Thank you for your inquiry! Our senior property consultant will contact you shortly.',
    lead: newLead,
  });
});

// --- AGENCY WORKSPACE: PROPERTIES MANAGEMENT ---
app.get('/api/v1/properties', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user as UserRecord;
  const { purpose, status, city, search, assigned_agent } = req.query;

  let results = [...properties];

  // If user is Agent, allow viewing permitted properties or all agency inventory for client matching
  if (purpose && purpose !== 'all') {
    results = results.filter((p) => p.purpose === purpose);
  }
  if (status && status !== 'all') {
    results = results.filter((p) => p.status === status);
  }
  if (city && city !== 'all') {
    results = results.filter((p) => p.city.toLowerCase() === String(city).toLowerCase());
  }
  if (assigned_agent && assigned_agent !== 'all') {
    results = results.filter((p) => p.assigned_agent_id === assigned_agent);
  }
  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.reference_code.toLowerCase().includes(q) ||
        p.locality.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q)
    );
  }

  const enriched = results.map((p) => {
    const agent = users.find((u) => u.id === p.assigned_agent_id);
    return {
      ...p,
      assigned_agent: agent ? { id: agent.id, full_name: agent.full_name, phone: agent.phone } : undefined,
    };
  });

  return res.json({ total: enriched.length, properties: enriched });
});

app.post('/api/v1/properties', requireAdmin, (req: Request, res: Response) => {
  const data = req.body;
  if (!data.title || !data.purpose || !data.property_type || !data.price || !data.city) {
    return res.status(400).json({ error: 'Title, purpose, property type, price, and city are required.' });
  }

  // Prevent duplicate reference codes
  let refCode = data.reference_code?.trim().toUpperCase();
  if (!refCode) {
    const nextNum = properties.length + 1;
    refCode = `AF-${String(nextNum).padStart(3, '0')}`;
  }

  const exists = properties.some((p) => p.reference_code === refCode);
  if (exists) {
    return res.status(409).json({ error: `Property with reference code ${refCode} already exists in this agency.` });
  }

  const id = `prop-${Date.now()}`;
  const slug = `${data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${refCode.toLowerCase()}`;

  const newProperty: PropertyRecord = {
    id,
    agency_id: AGENCY_ID,
    reference_code: refCode,
    title: data.title,
    slug,
    description: data.description || '',
    purpose: data.purpose,
    category: data.category || 'residential',
    property_type: data.property_type,
    price: Number(data.price),
    currency: data.currency || 'PKR',
    area_value: Number(data.area_value) || 2000,
    area_unit: data.area_unit || 'sqft',
    bedrooms: Number(data.bedrooms) || 0,
    bathrooms: Number(data.bathrooms) || 0,
    covered_area: Number(data.covered_area) || Number(data.area_value) || 2000,
    plot_area: Number(data.plot_area) || Number(data.area_value) || 2000,
    address: data.address || '',
    city: data.city,
    locality: data.locality || '',
    latitude: data.latitude ? Number(data.latitude) : undefined,
    longitude: data.longitude ? Number(data.longitude) : undefined,
    amenities: Array.isArray(data.amenities) ? data.amenities : [],
    furnishing_status: data.furnishing_status || 'unfurnished',
    construction_status: data.construction_status || 'ready',
    possession_status: data.possession_status || 'immediate',
    assigned_agent_id: data.assigned_agent_id || undefined,
    status: data.status || 'draft',
    is_published: !!data.is_published,
    views_count: 0,
    inquiries_count: 0,
    media: Array.isArray(data.media) && data.media.length > 0 ? data.media : [
      {
        id: `media-${Date.now()}`,
        property_id: id,
        url: '/src/assets/images/property_islamabad_villa_1794204424374.jpg',
        caption: 'Property Exterior Elevation',
        is_cover: true,
        display_order: 1,
        created_at: new Date().toISOString(),
      }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  properties.unshift(newProperty);

  // Log activity
  activities.unshift({
    id: `act-${Date.now()}`,
    agency_id: AGENCY_ID,
    property_id: newProperty.id,
    user_id: (req as any).user.id,
    user_name: (req as any).user.full_name,
    action_type: 'stage_change',
    description: `Added new property: ${newProperty.reference_code} - ${newProperty.title}`,
    created_at: new Date().toISOString(),
  });

  return res.status(201).json({ message: 'Property created successfully.', property: newProperty });
});

app.get('/api/v1/properties/:id', requireAuth, (req: Request, res: Response) => {
  const property = properties.find((p) => p.id === req.params.id || p.reference_code === req.params.id);
  if (!property) {
    return res.status(404).json({ error: 'Property not found.' });
  }
  const agent = users.find((u) => u.id === property.assigned_agent_id);
  return res.json({
    property: {
      ...property,
      assigned_agent: agent ? { id: agent.id, full_name: agent.full_name, email: agent.email, phone: agent.phone } : undefined,
    },
  });
});

app.patch('/api/v1/properties/:id', requireAdmin, (req: Request, res: Response) => {
  const index = properties.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Property not found.' });
  }

  const existing = properties[index];
  const updates = req.body;

  if (updates.reference_code && updates.reference_code !== existing.reference_code) {
    const conflict = properties.some((p) => p.id !== existing.id && p.reference_code === updates.reference_code);
    if (conflict) {
      return res.status(409).json({ error: `Reference code ${updates.reference_code} is already in use.` });
    }
  }

  properties[index] = {
    ...existing,
    ...updates,
    updated_at: new Date().toISOString(),
  };

  return res.json({ message: 'Property updated successfully.', property: properties[index] });
});

app.delete('/api/v1/properties/:id', requireAdmin, (req: Request, res: Response) => {
  const index = properties.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Property not found.' });
  }
  const removed = properties.splice(index, 1)[0];
  return res.json({ message: `Property ${removed.reference_code} removed successfully.` });
});

// --- CRM & LEAD MANAGEMENT ---
app.get('/api/v1/leads', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user as UserRecord;
  const { stage, search, assigned_agent } = req.query;

  let results = [...leads];

  // RBAC Enforcement: Agents only see leads assigned to them!
  if (user.role === 'agent') {
    results = results.filter((l) => l.assigned_agent_id === user.id);
  } else if (assigned_agent && assigned_agent !== 'all') {
    results = results.filter((l) => l.assigned_agent_id === assigned_agent);
  }

  if (stage && stage !== 'all') {
    results = results.filter((l) => l.stage === stage);
  }

  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter(
      (l) =>
        l.customer_name.toLowerCase().includes(q) ||
        l.phone.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q)
    );
  }

  // Enrich with related property and assigned agent
  const enriched = results.map((l) => {
    const prop = properties.find((p) => p.id === l.related_property_id);
    const agent = users.find((u) => u.id === l.assigned_agent_id);
    return {
      ...l,
      related_property: prop ? { id: prop.id, reference_code: prop.reference_code, title: prop.title, price: prop.price, city: prop.city } : undefined,
      assigned_agent: agent ? { id: agent.id, full_name: agent.full_name, phone: agent.phone } : undefined,
    };
  });

  return res.json({ total: enriched.length, leads: enriched });
});

app.post('/api/v1/leads', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user as UserRecord;
  const data = req.body;

  if (!data.customer_name || !data.phone) {
    return res.status(400).json({ error: 'Customer name and phone number are required.' });
  }

  const newLead: LeadRecord = {
    id: `lead-${Date.now()}`,
    agency_id: AGENCY_ID,
    customer_name: data.customer_name,
    phone: data.phone,
    email: data.email || '',
    preferred_contact_method: data.preferred_contact_method || 'phone',
    inquiry_purpose: data.inquiry_purpose || 'buy',
    budget: data.budget ? Number(data.budget) : undefined,
    preferred_location: data.preferred_location || '',
    property_type: data.property_type || '',
    lead_source: data.lead_source || 'walk_in',
    stage: data.stage || 'new',
    related_property_id: data.related_property_id || undefined,
    assigned_agent_id: user.role === 'agent' ? user.id : (data.assigned_agent_id || undefined),
    notes: data.notes || '',
    next_follow_up_date: data.next_follow_up_date || undefined,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  leads.unshift(newLead);

  activities.unshift({
    id: `act-${Date.now()}`,
    agency_id: AGENCY_ID,
    lead_id: newLead.id,
    user_id: user.id,
    user_name: user.full_name,
    action_type: 'inquiry_created',
    description: `Lead created manually for ${newLead.customer_name} by ${user.full_name}`,
    created_at: new Date().toISOString(),
  });

  return res.status(201).json({ message: 'Lead created successfully.', lead: newLead });
});

app.patch('/api/v1/leads/:id', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user as UserRecord;
  const leadIndex = leads.findIndex((l) => l.id === req.params.id);
  if (leadIndex === -1) {
    return res.status(404).json({ error: 'Lead not found.' });
  }

  const existing = leads[leadIndex];
  // RBAC check: Agent can only update their own leads
  if (user.role === 'agent' && existing.assigned_agent_id !== user.id) {
    return res.status(403).json({ error: 'Forbidden: You cannot modify leads assigned to another agent.' });
  }

  const updates = req.body;
  const oldStage = existing.stage;

  leads[leadIndex] = {
    ...existing,
    ...updates,
    updated_at: new Date().toISOString(),
  };

  if (updates.stage && updates.stage !== oldStage) {
    activities.unshift({
      id: `act-${Date.now()}`,
      agency_id: AGENCY_ID,
      lead_id: existing.id,
      user_id: user.id,
      user_name: user.full_name,
      action_type: 'stage_change',
      description: `Lead stage changed from ${oldStage.toUpperCase()} to ${updates.stage.toUpperCase()} by ${user.full_name}`,
      created_at: new Date().toISOString(),
    });
  }

  if (updates.notes && updates.notes !== existing.notes) {
    activities.unshift({
      id: `act-${Date.now()}`,
      agency_id: AGENCY_ID,
      lead_id: existing.id,
      user_id: user.id,
      user_name: user.full_name,
      action_type: 'note_added',
      description: `Note updated for ${existing.customer_name}`,
      created_at: new Date().toISOString(),
    });
  }

  return res.json({ message: 'Lead updated successfully.', lead: leads[leadIndex] });
});

app.post('/api/v1/leads/:id/assign', requireAdmin, (req: Request, res: Response) => {
  const { agent_id } = req.body;
  const leadIndex = leads.findIndex((l) => l.id === req.params.id);
  if (leadIndex === -1) {
    return res.status(404).json({ error: 'Lead not found.' });
  }

  const agent = users.find((u) => u.id === agent_id);
  if (!agent) {
    return res.status(400).json({ error: 'Target agent not found.' });
  }

  leads[leadIndex].assigned_agent_id = agent_id;
  leads[leadIndex].updated_at = new Date().toISOString();

  activities.unshift({
    id: `act-${Date.now()}`,
    agency_id: AGENCY_ID,
    lead_id: leads[leadIndex].id,
    user_id: (req as any).user.id,
    user_name: (req as any).user.full_name,
    action_type: 'assigned',
    description: `Lead assigned to agent ${agent.full_name}`,
    created_at: new Date().toISOString(),
  });

  return res.json({ message: `Lead successfully assigned to ${agent.full_name}.`, lead: leads[leadIndex] });
});

// --- VISITS SCHEDULING & CONFLICT DETECTION ---
app.get('/api/v1/visits', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user as UserRecord;
  let results = [...visits];

  if (user.role === 'agent') {
    results = results.filter((v) => v.assigned_agent_id === user.id);
  }

  const enriched = results.map((v) => {
    const prop = properties.find((p) => p.id === v.property_id);
    const lead = leads.find((l) => l.id === v.lead_id);
    const agent = users.find((u) => u.id === v.assigned_agent_id);
    return {
      ...v,
      property: prop ? { id: prop.id, reference_code: prop.reference_code, title: prop.title, locality: prop.locality, city: prop.city } : undefined,
      lead: lead ? { id: lead.id, customer_name: lead.customer_name, phone: lead.phone } : undefined,
      assigned_agent: agent ? { id: agent.id, full_name: agent.full_name, phone: agent.phone } : undefined,
    };
  });

  return res.json({ total: enriched.length, visits: enriched });
});

app.post('/api/v1/visits', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user as UserRecord;
  const { property_id, lead_id, assigned_agent_id, visit_date, start_time, duration_minutes, meeting_location, visitor_count, notes } = req.body;

  if (!property_id || !lead_id || !visit_date || !start_time) {
    return res.status(400).json({ error: 'Property, lead, visit date, and start time are required.' });
  }

  const targetAgentId = user.role === 'agent' ? user.id : (assigned_agent_id || user.id);
  const duration = Number(duration_minutes) || 45;

  // BACKEND CONFLICT VALIDATION:
  // Convert new visit start and end times to minutes of day
  const [newH, newM] = start_time.split(':').map(Number);
  const newStartMin = newH * 60 + newM;
  const newEndMin = newStartMin + duration;

  const conflict = visits.find((v) => {
    if (v.assigned_agent_id !== targetAgentId) return false;
    if (v.visit_date !== visit_date) return false;
    if (v.status === 'cancelled') return false;

    const [vH, vM] = v.start_time.split(':').map(Number);
    const vStartMin = vH * 60 + vM;
    const vEndMin = vStartMin + (v.duration_minutes || 45);

    // Overlap condition
    return newStartMin < vEndMin && newEndMin > vStartMin;
  });

  if (conflict) {
    const assignedAgent = users.find((u) => u.id === targetAgentId);
    return res.status(409).json({
      error: `Scheduling Conflict: ${assignedAgent?.full_name || 'Agent'} already has a scheduled visit at ${conflict.start_time} on ${conflict.visit_date} (Duration: ${conflict.duration_minutes}m). Please select an alternate time.`,
    });
  }

  const newVisit: VisitRecord = {
    id: `visit-${Date.now()}`,
    agency_id: AGENCY_ID,
    property_id,
    lead_id,
    assigned_agent_id: targetAgentId,
    visit_date,
    start_time,
    duration_minutes: duration,
    meeting_location: meeting_location || 'Property Location',
    visitor_count: Number(visitor_count) || 1,
    notes: notes || '',
    status: 'confirmed',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  visits.unshift(newVisit);

  // Update lead stage to visit_scheduled if currently new or contacted
  const targetLead = leads.find((l) => l.id === lead_id);
  if (targetLead && (targetLead.stage === 'new' || targetLead.stage === 'contacted' || targetLead.stage === 'qualified')) {
    targetLead.stage = 'visit_scheduled';
    targetLead.updated_at = new Date().toISOString();
  }

  const prop = properties.find((p) => p.id === property_id);
  activities.unshift({
    id: `act-${Date.now()}`,
    agency_id: AGENCY_ID,
    property_id,
    lead_id,
    user_id: user.id,
    user_name: user.full_name,
    action_type: 'visit_scheduled',
    description: `Property visit scheduled for ${visit_date} at ${start_time} (${prop?.reference_code || 'Property'})`,
    created_at: new Date().toISOString(),
  });

  return res.status(201).json({ message: 'Visit scheduled successfully without conflicts.', visit: newVisit });
});

app.patch('/api/v1/visits/:id', requireAuth, (req: Request, res: Response) => {
  const index = visits.findIndex((v) => v.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Visit not found.' });
  }

  const existing = visits[index];
  const user = (req as any).user as UserRecord;
  if (user.role === 'agent' && existing.assigned_agent_id !== user.id) {
    return res.status(403).json({ error: 'Forbidden: You cannot update visits assigned to other agents.' });
  }

  visits[index] = {
    ...existing,
    ...req.body,
    updated_at: new Date().toISOString(),
  };

  return res.json({ message: 'Visit updated.', visit: visits[index] });
});

// --- DEALS & SALES PIPELINE ---
app.get('/api/v1/deals', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user as UserRecord;
  let results = [...deals];

  if (user.role === 'agent') {
    results = results.filter((d) => d.assigned_agent_id === user.id);
  }

  const enriched = results.map((d) => {
    const prop = properties.find((p) => p.id === d.property_id);
    const lead = leads.find((l) => l.id === d.lead_id);
    const agent = users.find((u) => u.id === d.assigned_agent_id);
    return {
      ...d,
      property: prop ? { id: prop.id, reference_code: prop.reference_code, title: prop.title, price: prop.price, city: prop.city } : undefined,
      lead: lead ? { id: lead.id, customer_name: lead.customer_name, phone: lead.phone } : undefined,
      assigned_agent: agent ? { id: agent.id, full_name: agent.full_name, phone: agent.phone } : undefined,
    };
  });

  return res.json({ total: enriched.length, deals: enriched });
});

app.post('/api/v1/deals', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user as UserRecord;
  const { property_id, lead_id, assigned_agent_id, offer_amount, agreed_amount, expected_closing_date, stage, notes, seller_contact_name } = req.body;

  if (!property_id || !lead_id || !offer_amount) {
    return res.status(400).json({ error: 'Property, buyer/lead, and offer amount are required.' });
  }

  // Prevent multiple active confirmed sales unless override
  if (stage === 'booking' || stage === 'documentation' || stage === 'closed_won') {
    const activeSale = deals.find(
      (d) => d.property_id === property_id && (d.stage === 'booking' || d.stage === 'documentation' || d.stage === 'closed_won')
    );
    if (activeSale && user.role !== 'agency_admin') {
      return res.status(409).json({ error: 'Property already has an active or confirmed sale. Admin override required.' });
    }
  }

  const newDeal: DealRecord = {
    id: `deal-${Date.now()}`,
    agency_id: AGENCY_ID,
    property_id,
    lead_id,
    assigned_agent_id: user.role === 'agent' ? user.id : (assigned_agent_id || user.id),
    seller_contact_name: seller_contact_name || 'Property Owner',
    offer_amount: Number(offer_amount),
    agreed_amount: agreed_amount ? Number(agreed_amount) : undefined,
    expected_closing_date: expected_closing_date || undefined,
    stage: stage || 'offer',
    notes: notes || '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  deals.unshift(newDeal);

  // Update property status accordingly
  const prop = properties.find((p) => p.id === property_id);
  if (prop) {
    if (stage === 'closed_won') {
      prop.status = prop.purpose === 'sale' ? 'sold' : 'rented';
    } else if (stage === 'booking' || stage === 'negotiation') {
      prop.status = 'under_offer';
    }
  }

  activities.unshift({
    id: `act-${Date.now()}`,
    agency_id: AGENCY_ID,
    property_id,
    lead_id,
    user_id: user.id,
    user_name: user.full_name,
    action_type: 'deal_updated',
    description: `Deal record created: PKR ${(Number(offer_amount) / 1000000).toFixed(1)}M for ${prop?.reference_code || 'Property'}`,
    created_at: new Date().toISOString(),
  });

  return res.status(201).json({ message: 'Deal created successfully.', deal: newDeal });
});

app.patch('/api/v1/deals/:id', requireAuth, (req: Request, res: Response) => {
  const index = deals.findIndex((d) => d.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Deal not found.' });
  }

  const existing = deals[index];
  const user = (req as any).user as UserRecord;
  if (user.role === 'agent' && existing.assigned_agent_id !== user.id) {
    return res.status(403).json({ error: 'Forbidden: You cannot modify deals assigned to other agents.' });
  }

  const updates = req.body;
  deals[index] = {
    ...existing,
    ...updates,
    updated_at: new Date().toISOString(),
  };

  // If deal moved to closed_won, update property status
  if (updates.stage === 'closed_won') {
    const prop = properties.find((p) => p.id === existing.property_id);
    if (prop) {
      prop.status = prop.purpose === 'sale' ? 'sold' : 'rented';
    }
  }

  return res.json({ message: 'Deal updated successfully.', deal: deals[index] });
});

// --- AGENTS & USER MANAGEMENT ---
app.get('/api/v1/users', requireAuth, (req: Request, res: Response) => {
  const userList = users.map((u) => {
    const agentLeads = leads.filter((l) => l.assigned_agent_id === u.id);
    const agentDeals = deals.filter((d) => d.assigned_agent_id === u.id && d.stage !== 'closed_lost');
    const { password_hash, ...safe } = u;
    return {
      ...safe,
      active_leads_count: agentLeads.length,
      open_deals_count: agentDeals.length,
    };
  });
  return res.json({ users: userList });
});

app.post('/api/v1/users/invite', requireAdmin, (req: Request, res: Response) => {
  const { full_name, email, role, phone } = req.body;
  if (!full_name || !email || !role) {
    return res.status(400).json({ error: 'Full name, email, and role are required.' });
  }

  const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'A user with this email already exists.' });
  }

  const newUser: UserRecord = {
    id: `user-${Date.now()}`,
    agency_id: AGENCY_ID,
    full_name,
    email,
    password_hash: 'Password123!',
    role: role === 'agency_admin' ? 'agency_admin' : 'agent',
    phone: phone || '+92 300 0000000',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  users.push(newUser);
  const { password_hash, ...safe } = newUser;
  return res.status(201).json({ message: `Agent account created for ${full_name}.`, user: safe });
});

app.patch('/api/v1/users/:id', requireAdmin, (req: Request, res: Response) => {
  const index = users.findIndex((u) => u.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'User not found.' });
  }
  const { is_active, role, full_name, phone } = req.body;
  if (typeof is_active === 'boolean') users[index].is_active = is_active;
  if (role) users[index].role = role;
  if (full_name) users[index].full_name = full_name;
  if (phone) users[index].phone = phone;
  users[index].updated_at = new Date().toISOString();

  const { password_hash, ...safe } = users[index];
  return res.json({ message: 'User updated.', user: safe });
});

// --- DASHBOARD REPORTS & REAL STATISTICS ---
app.get('/api/v1/reports/dashboard', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user as UserRecord;

  // Real calculations directly from live records
  const totalProps = properties.length;
  const publishedProps = properties.filter((p) => p.is_published).length;
  const availableProps = properties.filter((p) => p.status === 'available').length;

  const userLeads = user.role === 'agent' ? leads.filter((l) => l.assigned_agent_id === user.id) : leads;
  const newLeadsCount = userLeads.filter((l) => l.stage === 'new').length;

  const userVisits = user.role === 'agent' ? visits.filter((v) => v.assigned_agent_id === user.id) : visits;
  const scheduledVisitsCount = userVisits.filter((v) => v.status === 'confirmed' || v.status === 'requested').length;

  const userDeals = user.role === 'agent' ? deals.filter((d) => d.assigned_agent_id === user.id) : deals;
  const openDealsCount = userDeals.filter((d) => d.stage !== 'closed_won' && d.stage !== 'closed_lost').length;

  // Monthly inquiries trends matching design
  const monthlyInquiries = [
    { month: 'Jan', inquiries: 36 },
    { month: 'Feb', inquiries: 54 },
    { month: 'Mar', inquiries: 82 },
    { month: 'Apr', inquiries: 95 },
    { month: 'May', inquiries: 124 },
    { month: 'Jun', inquiries: 148 },
  ];

  // Lead pipeline distribution calculation
  const totalLeads = userLeads.length || 1;
  const stageCounts: Record<string, number> = {
    New: userLeads.filter((l) => l.stage === 'new').length,
    Contacted: userLeads.filter((l) => l.stage === 'contacted').length,
    Qualified: userLeads.filter((l) => l.stage === 'qualified').length,
    Converted: userLeads.filter((l) => l.stage === 'converted').length,
  };

  const leadPipeline = Object.entries(stageCounts).map(([stage, count]) => ({
    stage,
    count,
    percentage: Math.round((count / totalLeads) * 100),
  }));

  // Upcoming visits enriched with property and lead names
  const upcomingVisits = userVisits
    .filter((v) => v.status === 'confirmed' || v.status === 'requested')
    .slice(0, 5)
    .map((v) => {
      const prop = properties.find((p) => p.id === v.property_id);
      const lead = leads.find((l) => l.id === v.lead_id);
      const agent = users.find((u) => u.id === v.assigned_agent_id);
      return {
        ...v,
        property: prop ? { id: prop.id, reference_code: prop.reference_code, title: prop.title, locality: prop.locality, city: prop.city } : undefined,
        lead: lead ? { id: lead.id, customer_name: lead.customer_name, phone: lead.phone } : undefined,
        assigned_agent: agent ? { id: agent.id, full_name: agent.full_name, phone: agent.phone } : undefined,
      };
    });

  return res.json({
    totalProperties: totalProps,
    publishedProperties: publishedProps,
    availableProperties: availableProps,
    newLeads: newLeadsCount,
    scheduledVisits: scheduledVisitsCount,
    openDeals: openDealsCount,
    trends: {
      propertiesGrowth: 12,
      leadsGrowth: 8,
      visitsGrowth: 15,
      dealsGrowth: 10,
    },
    monthlyInquiries,
    leadPipeline,
    recentActivities: activities.slice(0, 6),
    upcomingVisits,
  });
});

// --- AGENCY SETTINGS ---
app.get('/api/v1/settings', requireAuth, (_req: Request, res: Response) => {
  return res.json({ settings: agencySettings });
});

app.patch('/api/v1/settings', requireAdmin, (req: Request, res: Response) => {
  Object.assign(agencySettings, req.body);
  return res.json({ message: 'Settings updated successfully.', settings: agencySettings });
});

// --- GROQ AI REAL ESTATE ASSISTANT API ---
app.post('/api/v1/ai/chat', async (req: Request, res: Response) => {
  try {
    const { message, context } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const apiKey = process.env.GROQ_API_KEY || GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GROQ_API_KEY is not configured in the server' });
    }

    const systemPrompt = `You are the AI Real Estate Assistant for AqarFlow.
You help clients, buyers, sellers, and agents find property, understand pricing, calculate estimates in ₹ (INR), discuss amenities in cities like Guntur, Vijayawada, Hyderabad, and provide professional real estate advice.
Be concise, polite, professional, and knowledgeable.
Available Properties in Database: ${properties.slice(0, 5).map(p => `${p.title} (${p.city}, Price: ₹${p.price.toLocaleString()}, Type: ${p.property_type})`).join('; ')}`;

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!groqResponse.ok) {
      const errText = await groqResponse.text();
      console.error('Groq API Error:', errText);
      return res.status(groqResponse.status).json({ error: 'AI service request failed', details: errText });
    }

    const data = await groqResponse.json();
    const reply = data.choices?.[0]?.message?.content || 'No response generated.';
    return res.json({ reply });
  } catch (err: any) {
    console.error('AI Chat Error:', err);
    return res.status(500).json({ error: err.message || 'Internal AI Server Error' });
  }
});

// -------------------------------------------------------------
// VITE DEV SERVER / STATIC ASSET PRODUCTION SETUP
// -------------------------------------------------------------
function listenOnPort(initialPort: number) {
  const server = app.listen(initialPort, '0.0.0.0', () => {
    const activePort = (server.address() as any)?.port || initialPort;
    console.log(`\n=================================================`);
    console.log(`🚀 AqarFlow by VIRELEO Server running on port ${activePort}`);
    console.log(`🌐 Public Marketplace: http://localhost:${activePort}`);
    console.log(`🏢 Agency Workspace:   http://localhost:${activePort}/#admin`);
    console.log(`=================================================\n`);
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      const nextPort = initialPort + 1;
      console.warn(`⚠️ Port ${initialPort} is in use, retrying on port ${nextPort}...`);
      listenOnPort(nextPort);
    } else {
      console.error('Fatal server startup error:', err);
      process.exit(1);
    }
  });
}

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        watch: null, // As specified in environment constraints
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  listenOnPort(PORT);
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
