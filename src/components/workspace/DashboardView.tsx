import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { DashboardStats } from '../../types';
import { 
  Building2, 
  Users, 
  Calendar, 
  Handshake, 
  ArrowUpRight, 
  MapPin, 
  Search,
  Download,
  Share2,
  Star,
  Filter,
  CheckCircle2,
  Briefcase,
  FileText,
  DollarSign,
  Maximize2,
  Layers,
  ChevronDown
} from 'lucide-react';

interface DashboardViewProps {
  onNavigateToView: (view: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigateToView }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await api.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [user]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-12">
      {/* Top Action Toolbar matching Image 1 */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-4 flex-wrap text-xs text-slate-600 font-medium">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search portfolio, assets, leases..."
              className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs w-64 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <button className="flex items-center gap-1 hover:text-slate-900 cursor-pointer">
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
            <button className="flex items-center gap-1 hover:text-slate-900 cursor-pointer">
              <Share2 className="w-3.5 h-3.5" />
              <span>Share View</span>
            </button>
            <button className="flex items-center gap-1 hover:text-slate-900 cursor-pointer">
              <Star className="w-3.5 h-3.5" />
              <span>Favorites</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 shadow-2xs cursor-pointer">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Filters</span>
          </button>
          <div className="text-xs text-slate-500">
            Portfolio: <strong className="text-slate-800">Global Prime (Default)</strong>
          </div>
        </div>
      </div>

      {/* Greeting Header matching Image 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Good Morning, {user?.full_name || 'David John'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Here's what is happening with your property operations and corporate portfolio today.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-xl text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>95% Occupancy Rate Target</span>
        </div>
      </div>

      {/* 4 Metric Cards matching Image 1: 875 Properties | 596,859 Total Area | $102,596,859 Annual Cost | 250 Headcount */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Number of properties */}
        <div 
          onClick={() => onNavigateToView('properties')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span>Number of Properties</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight font-mono">
            875
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-2">
            <ArrowUpRight className="w-3 h-3" />
            <span>+12.4% vs last quarter</span>
          </div>
        </div>

        {/* Card 2: Total Area (sqft) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all group">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span>Total Area (sqft)</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Maximize2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight font-mono">
            596,859
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 mt-2">
            <span>Across 4 geographic sectors</span>
          </div>
        </div>

        {/* Card 3: Annual Cost (Budget) */}
        <div className="bg-slate-950 text-white p-5 rounded-2xl border border-slate-900 shadow-md transition-all group">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
            <span>Annual Cost (Budget) (USD)</span>
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white tracking-tight font-mono">
            $102,596,859
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 mt-2">
            <span>On track with 2.8% savings</span>
          </div>
        </div>

        {/* Card 4: Headcount / Tenants */}
        <div 
          onClick={() => onNavigateToView('leads')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span>Headcount / Active Leases</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight font-mono">
            250
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-blue-600 mt-2">
            <span>98% corporate retention</span>
          </div>
        </div>
      </div>

      {/* Middle Grid: Services Bar + Property Type Breakdown + Map of Properties */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Services & Property Type Distribution */}
        <div className="lg:col-span-7 space-y-6">
          {/* Services Category Tabs matching Image 1 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
              <span>Managed Service Modules</span>
              <span className="text-[10px] text-slate-400 font-normal">Active Contracts</span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
              <div className="p-2.5 rounded-xl bg-slate-900 text-white text-center">
                <div className="text-[11px] font-bold">Leasing</div>
                <div className="text-[9px] text-slate-300 mt-0.5">24 Active</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-100 text-slate-800 text-center hover:bg-slate-200 transition-colors cursor-pointer">
                <div className="text-[11px] font-bold">Facilities</div>
                <div className="text-[9px] text-slate-500 mt-0.5">18 Active</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-100 text-slate-800 text-center hover:bg-slate-200 transition-colors cursor-pointer">
                <div className="text-[11px] font-bold">Workspace</div>
                <div className="text-[9px] text-slate-500 mt-0.5">9 Active</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-100 text-slate-800 text-center hover:bg-slate-200 transition-colors cursor-pointer">
                <div className="text-[11px] font-bold">Project Mgmt</div>
                <div className="text-[9px] text-slate-500 mt-0.5">12 Active</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-100 text-slate-800 text-center hover:bg-slate-200 transition-colors cursor-pointer">
                <div className="text-[11px] font-bold">Transactions</div>
                <div className="text-[9px] text-slate-500 mt-0.5">36 Active</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-100 text-slate-800 text-center hover:bg-slate-200 transition-colors cursor-pointer">
                <div className="text-[11px] font-bold">Analytics</div>
                <div className="text-[9px] text-slate-500 mt-0.5">Real-time</div>
              </div>
            </div>
          </div>

          {/* Horizontal Property Type Distribution matching Image 1 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Property Type Distribution</h3>
                <p className="text-[11px] text-slate-400">Breakdown by Gross Floor Area & Leased Units</p>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-900"></span> Commercial
                </span>
                <span className="flex items-center gap-1 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Residential
                </span>
                <span className="flex items-center gap-1 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Industrial
                </span>
              </div>
            </div>

            {/* Horizontal comparative bars */}
            <div className="space-y-3 pt-2 text-xs font-semibold">
              <div>
                <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                  <span>Corporate Office Towers</span>
                  <span className="font-mono text-slate-800">420,000 sqft (70%)</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-900 rounded-full" style={{ width: '70%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                  <span>Luxury Residential Villas & Apartments</span>
                  <span className="font-mono text-slate-800">125,000 sqft (21%)</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '21%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                  <span>Industrial & Logistics Centers</span>
                  <span className="font-mono text-slate-800">51,859 sqft (9%)</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '9%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Map of Properties matching Image 1 */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900">Map of Properties</h3>
              <span className="text-[11px] text-blue-600 font-semibold cursor-pointer hover:underline">
                View Full Map
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Interactive global locations across Pakistan, UAE, and North America
            </p>
          </div>

          {/* SVG World Map representation with animated pulsing location pins */}
          <div className="relative my-4 aspect-16/10 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center overflow-hidden p-4">
            <svg viewBox="0 0 800 450" className="w-full h-full opacity-30 fill-slate-500">
              {/* Simplified world map continents outline */}
              <path d="M150,120 Q180,90 240,110 Q280,140 260,200 Q210,240 180,210 Q140,170 150,120 Z" />
              <path d="M220,260 Q260,270 280,330 Q270,390 230,410 Q190,380 200,310 Z" />
              <path d="M430,90 Q480,80 520,110 Q500,160 450,170 Q410,130 430,90 Z" />
              <path d="M420,180 Q510,190 530,260 Q500,340 450,330 Q400,280 420,180 Z" />
              <path d="M530,90 Q620,80 700,130 Q680,220 600,200 Q540,160 530,90 Z" />
              <path d="M620,270 Q690,260 720,310 Q700,360 630,340 Z" />
            </svg>

            {/* Glowing location pins */}
            <div className="absolute top-[32%] left-[64%] flex items-center justify-center">
              <span className="absolute w-6 h-6 rounded-full bg-blue-500/30 animate-ping"></span>
              <span className="w-3 h-3 rounded-full bg-blue-600 border-2 border-white shadow-sm"></span>
              <span className="absolute -bottom-5 bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs whitespace-nowrap">
                Islamabad (AF-001)
              </span>
            </div>

            <div className="absolute top-[38%] left-[67%] flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border-2 border-white shadow-sm"></span>
            </div>

            <div className="absolute top-[30%] left-[28%] flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 border-2 border-white shadow-sm"></span>
            </div>

            <div className="absolute top-[35%] left-[55%] flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white shadow-sm"></span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">North Zone</div>
              <div className="text-sm font-bold text-slate-800">420 Units</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Central Zone</div>
              <div className="text-sm font-bold text-slate-800">315 Units</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">South Hub</div>
              <div className="text-sm font-bold text-slate-800">140 Units</div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom KPI & Priorities Row matching Image 1: Risk & Priorities | Current Activity | Work Orders | Lease Events */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Box 1: Risk & Priorities Activities */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
            <span>Risk & Priorities</span>
            <span className="text-[10px] text-red-500 font-bold">4 Action items</span>
          </div>
          
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600">Transactions</span>
              <span className="font-mono font-bold text-slate-900">452</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600">Active Projects</span>
              <span className="font-mono font-bold text-slate-900">452</span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-600">Work Orders Due</span>
              <span className="font-mono font-bold text-amber-600">452</span>
            </div>
          </div>
        </div>

        {/* Box 2: Current Activity - Last 12 Months */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Current Activity · 12 Mo
          </div>
          <div className="flex items-end justify-between h-20 pt-2 px-2">
            <div className="flex flex-col items-center gap-1">
              <div className="w-6 bg-slate-900 rounded-t" style={{ height: '58px' }} />
              <span className="text-[9px] text-slate-400">Trans</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-6 bg-amber-500 rounded-t" style={{ height: '70px' }} />
              <span className="text-[9px] text-slate-400">Cost</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-6 bg-blue-600 rounded-t" style={{ height: '45px' }} />
              <span className="text-[9px] text-slate-400">Leases</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-6 bg-emerald-500 rounded-t" style={{ height: '80px' }} />
              <span className="text-[9px] text-slate-400">Visits</span>
            </div>
          </div>
          <div className="text-[10px] text-slate-500 text-center font-mono">
            Total CapEx: $102,596,859
          </div>
        </div>

        {/* Box 3: Work Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
            <span>Work Orders</span>
            <span className="text-[10px] text-emerald-600 font-bold">95% on-time</span>
          </div>
          
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600">Open Work Orders</span>
              <span className="font-mono font-bold text-slate-900">452</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600">Created Work Orders</span>
              <span className="font-mono font-bold text-slate-900">452</span>
            </div>
            <div className="pt-1">
              <div className="w-full py-1.5 bg-slate-900 text-white rounded-lg text-center font-bold text-[11px]">
                Rate 95% Completed
              </div>
            </div>
          </div>
        </div>

        {/* Box 4: Lease Events */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Lease Events & Renewals
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600">Critical Events</span>
              <span className="font-mono font-bold text-red-600">452</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600">Other Events</span>
              <span className="font-mono font-bold text-slate-800">452</span>
            </div>
            <div className="flex items-end justify-between gap-1 pt-2 h-10">
              <div className="w-1/4 bg-slate-200 rounded-t h-4" />
              <div className="w-1/4 bg-slate-400 rounded-t h-7" />
              <div className="w-1/4 bg-blue-600 rounded-t h-9" />
              <div className="w-1/4 bg-slate-900 rounded-t h-10" />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
