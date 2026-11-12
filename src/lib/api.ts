import { 
  User, 
  Property, 
  Lead, 
  Visit, 
  Deal, 
  DashboardStats, 
  AgencySettings,
  PropertyPurpose,
  PropertyType
} from '../types';
import { API_BASE_URL } from "../config";

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    sessionStorage.setItem('aqarflow_token', token);
  } else {
    sessionStorage.removeItem('aqarflow_token');
  }
}

export function getAuthToken(): string | null {
  if (!authToken) {
    authToken = sessionStorage.getItem('aqarflow_token');
  }
  return authToken;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data?.error || data?.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data as T;
}

export const api = {
  // Auth
  async login(email: string, password: string, serverType: 'user' | 'admin' = 'user'): Promise<{ token: string; user: User; message: string }> {
    const endpoint = serverType === 'admin' ? '/api/v1/auth/admin/login' : '/api/v1/auth/login';
    const res = await request<{ token?: string; access_token?: string; user: User; message: string }>(endpoint, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const token = res.token || res.access_token || '';
    setAuthToken(token);
    return { token, user: res.user, message: res.message || 'Login successful' };
  },

  async register(data: { full_name: string; agency_name: string; email: string; phone: string; password: string }): Promise<{ token: string; user: User }> {
    const res = await request<{ token?: string; access_token?: string; user: User }>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    const token = res.token || res.access_token || '';
    setAuthToken(token);
    return { token, user: res.user };
  },

  async googleAuth(email?: string): Promise<{ token: string; user: User }> {
    const res = await request<{ token?: string; access_token?: string; user: User }>('/api/v1/auth/google', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    const token = res.token || res.access_token || '';
    setAuthToken(token);
    return { token, user: res.user };
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    return request<{ message: string }>('/api/v1/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async logout(): Promise<void> {
    try {
      await request('/api/v1/auth/logout', { method: 'POST' });
    } finally {
      setAuthToken(null);
    }
  },

  async getCurrentUser(): Promise<{ user: User }> {
    return request<{ user: User }>('/api/v1/auth/me');
  },

  // Public Marketplace
  async getPublicProperties(params: {
    purpose?: string;
    property_type?: string;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    search?: string;
    sort?: string;
  } = {}): Promise<{ total: number; properties: Property[] }> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        searchParams.set(key, String(val));
      }
    });
    return request<{ total: number; properties: Property[] }>(`/api/v1/public/properties?${searchParams.toString()}`);
  },

  async getPublicProperty(slug: string): Promise<{ property: Property }> {
    return request<{ property: Property }>(`/api/v1/public/properties/${slug}`);
  },

  async submitPublicInquiry(payload: {
    customer_name: string;
    phone: string;
    email?: string;
    preferred_contact_method?: 'phone' | 'whatsapp' | 'email';
    inquiry_purpose?: 'buy' | 'rent' | 'invest';
    budget?: number;
    property_id?: string;
    notes?: string;
  }): Promise<{ message: string; lead: Lead }> {
    return request<{ message: string; lead: Lead }>('/api/v1/public/inquiries', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Workspace Properties
  async getProperties(params: {
    purpose?: string;
    status?: string;
    city?: string;
    search?: string;
    assigned_agent?: string;
  } = {}): Promise<{ total: number; properties: Property[] }> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        searchParams.set(key, String(val));
      }
    });
    return request<{ total: number; properties: Property[] }>(`/api/v1/properties?${searchParams.toString()}`);
  },

  async createProperty(property: Partial<Property>): Promise<{ message: string; property: Property }> {
    return request<{ message: string; property: Property }>('/api/v1/properties', {
      method: 'POST',
      body: JSON.stringify(property),
    });
  },

  async updateProperty(id: string, updates: Partial<Property>): Promise<{ message: string; property: Property }> {
    return request<{ message: string; property: Property }>(`/api/v1/properties/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  async deleteProperty(id: string): Promise<{ message: string }> {
    return request<{ message: string }>(`/api/v1/properties/${id}`, {
      method: 'DELETE',
    });
  },

  // CRM Leads
  async getLeads(params: { stage?: string; search?: string; assigned_agent?: string } = {}): Promise<{ total: number; leads: Lead[] }> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        searchParams.set(key, String(val));
      }
    });
    return request<{ total: number; leads: Lead[] }>(`/api/v1/leads?${searchParams.toString()}`);
  },

  async createLead(lead: Partial<Lead>): Promise<{ message: string; lead: Lead }> {
    return request<{ message: string; lead: Lead }>('/api/v1/leads', {
      method: 'POST',
      body: JSON.stringify(lead),
    });
  },

  async updateLead(id: string, updates: Partial<Lead>): Promise<{ message: string; lead: Lead }> {
    return request<{ message: string; lead: Lead }>(`/api/v1/leads/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  async assignLead(id: string, agent_id: string): Promise<{ message: string; lead: Lead }> {
    return request<{ message: string; lead: Lead }>(`/api/v1/leads/${id}/assign`, {
      method: 'POST',
      body: JSON.stringify({ agent_id }),
    });
  },

  // Visits
  async getVisits(): Promise<{ total: number; visits: Visit[] }> {
    return request<{ total: number; visits: Visit[] }>('/api/v1/visits');
  },

  async scheduleVisit(visit: Partial<Visit>): Promise<{ message: string; visit: Visit }> {
    return request<{ message: string; visit: Visit }>('/api/v1/visits', {
      method: 'POST',
      body: JSON.stringify(visit),
    });
  },

  async updateVisit(id: string, updates: Partial<Visit>): Promise<{ message: string; visit: Visit }> {
    return request<{ message: string; visit: Visit }>(`/api/v1/visits/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  // Deals
  async getDeals(): Promise<{ total: number; deals: Deal[] }> {
    return request<{ total: number; deals: Deal[] }>('/api/v1/deals');
  },

  async createDeal(deal: Partial<Deal>): Promise<{ message: string; deal: Deal }> {
    return request<{ message: string; deal: Deal }>('/api/v1/deals', {
      method: 'POST',
      body: JSON.stringify(deal),
    });
  },

  async updateDeal(id: string, updates: Partial<Deal>): Promise<{ message: string; deal: Deal }> {
    return request<{ message: string; deal: Deal }>(`/api/v1/deals/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  // Users & Agents
  async getUsers(): Promise<{ users: (User & { active_leads_count?: number; open_deals_count?: number })[] }> {
    return request<{ users: (User & { active_leads_count?: number; open_deals_count?: number })[] }>('/api/v1/users');
  },

  async inviteUser(user: { full_name: string; email: string; role: string; phone?: string }): Promise<{ message: string; user: User }> {
    return request<{ message: string; user: User }>('/api/v1/users/invite', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  },

  async updateUser(id: string, updates: Partial<User>): Promise<{ message: string; user: User }> {
    return request<{ message: string; user: User }>(`/api/v1/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  // Dashboard Stats
  async getDashboardStats(): Promise<DashboardStats> {
    return request<DashboardStats>('/api/v1/reports/dashboard');
  },

  // Settings
  async getSettings(): Promise<{ settings: AgencySettings }> {
    return request<{ settings: AgencySettings }>('/api/v1/settings');
  },

  async updateSettings(settings: Partial<AgencySettings>): Promise<{ message: string; settings: AgencySettings }> {
    return request<{ message: string; settings: AgencySettings }>('/api/v1/settings', {
      method: 'PATCH',
      body: JSON.stringify(settings),
    });
  },
};
