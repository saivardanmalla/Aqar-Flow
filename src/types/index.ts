export type UserRole = 'agency_admin' | 'agent';

export interface User {
  id: string;
  agency_id: string;
  full_name: string;
  email: string;
  role: UserRole;
  phone: string;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type PropertyPurpose = 'sale' | 'rent' | 'lease';
export type PropertyCategory = 'residential' | 'commercial' | 'plot' | 'industrial';
export type PropertyType = 
  | 'house' 
  | 'apartment' 
  | 'villa' 
  | 'penthouse' 
  | 'office' 
  | 'shop' 
  | 'plot_residential' 
  | 'plot_commercial';

export type PropertyStatus = 
  | 'draft' 
  | 'available' 
  | 'reserved' 
  | 'under_offer' 
  | 'sold' 
  | 'rented' 
  | 'leased' 
  | 'inactive';

export interface PropertyMedia {
  id: string;
  property_id: string;
  url: string;
  caption?: string;
  is_cover: boolean;
  display_order: number;
  created_at: string;
}

export interface Property {
  id: string;
  agency_id: string;
  reference_code: string;
  title: string;
  slug: string;
  description: string;
  purpose: PropertyPurpose;
  category: PropertyCategory;
  property_type: PropertyType;
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
  assigned_agent?: User;
  status: PropertyStatus;
  is_published: boolean;
  views_count: number;
  inquiries_count: number;
  media: PropertyMedia[];
  created_at: string;
  updated_at: string;
}

export type LeadStage = 
  | 'new' 
  | 'contacted' 
  | 'qualified' 
  | 'visit_scheduled' 
  | 'negotiation' 
  | 'converted' 
  | 'lost';

export interface Lead {
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
  stage: LeadStage;
  related_property_id?: string;
  related_property?: Property;
  assigned_agent_id?: string;
  assigned_agent?: User;
  notes?: string;
  next_follow_up_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Activity {
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

export type VisitStatus = 'requested' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';

export interface Visit {
  id: string;
  agency_id: string;
  property_id: string;
  property?: Property;
  lead_id: string;
  lead?: Lead;
  assigned_agent_id: string;
  assigned_agent?: User;
  visit_date: string; // YYYY-MM-DD
  start_time: string; // HH:MM (24h)
  duration_minutes: number;
  meeting_location: string;
  visitor_count: number;
  notes?: string;
  status: VisitStatus;
  outcome_notes?: string;
  created_at: string;
  updated_at: string;
}

export type DealStage = 
  | 'inquiry' 
  | 'qualified' 
  | 'visit' 
  | 'offer' 
  | 'negotiation' 
  | 'booking' 
  | 'documentation' 
  | 'closed_won' 
  | 'closed_lost';

export interface Deal {
  id: string;
  agency_id: string;
  property_id: string;
  property?: Property;
  lead_id: string;
  lead?: Lead;
  assigned_agent_id: string;
  assigned_agent?: User;
  seller_contact_name?: string;
  offer_amount: number;
  agreed_amount?: number;
  expected_closing_date?: string;
  stage: DealStage;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  totalProperties: number;
  publishedProperties: number;
  availableProperties: number;
  newLeads: number;
  scheduledVisits: number;
  openDeals: number;
  trends: {
    propertiesGrowth: number;
    leadsGrowth: number;
    visitsGrowth: number;
    dealsGrowth: number;
  };
  monthlyInquiries: { month: string; inquiries: number }[];
  leadPipeline: { stage: string; count: number; percentage: number }[];
  recentActivities: Activity[];
  upcomingVisits: Visit[];
}

export interface AgencySettings {
  id: string;
  name: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  default_currency: string;
  timezone: string;
  website: string;
}
