import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AqarFlowLogo } from '../AqarFlowLogo';
import { 
  LayoutDashboard, 
  Building, 
  Users, 
  Calendar, 
  Handshake, 
  UserCheck, 
  BarChart3, 
  Settings, 
  LogOut, 
  Bell, 
  ChevronDown, 
  Globe, 
  Shield, 
  Menu, 
  X,
  CreditCard,
  Wrench,
  Search
} from 'lucide-react';

interface WorkspaceLayoutProps {
  currentView: string;
  onSelectView: (view: string) => void;
  onExitToMarketplace: () => void;
  children: React.ReactNode;
}

export const WorkspaceLayout: React.FC<WorkspaceLayoutProps> = ({
  currentView,
  onSelectView,
  onExitToMarketplace,
  children,
}) => {
  const { user, logout, isAdmin, switchDemoRole } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'properties', label: 'Properties', icon: Building },
    { id: 'tenants', label: 'Tenants', icon: Users },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'leads', label: 'Leads (CRM)', icon: Users },
    { id: 'visits', label: 'Visits', icon: Calendar },
    { id: 'deals', label: 'Deals', icon: Handshake },
    ...(isAdmin ? [{ id: 'agents', label: 'Agents', icon: UserCheck }] : []),
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      {/* Sidebar for Desktop matching image_c021d3a8.png */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-950 text-slate-300 border-r border-slate-900 shrink-0 select-none">
        {/* Brand Header */}
        <div className="h-18 px-6 flex items-center border-b border-slate-900">
          <AqarFlowLogo variant="dark" size="md" />
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-900 space-y-2">
          <button
            onClick={onExitToMarketplace}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-emerald-400 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
          >
            <Globe className="w-4 h-4 text-emerald-500" />
            <span>Public Marketplace</span>
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-18 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-2xs">
          {/* Mobile hamburger + Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              aria-label="Toggle Navigation"
            >
              {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                AqarFlow Operations
              </div>
              <h2 className="text-base font-bold text-slate-900 capitalize leading-tight">
                {currentView.replace('-', ' ')}
              </h2>
            </div>
          </div>

          {/* Top Center Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
              <input
                type="text"
                placeholder="Search properties, tenants, payments, leads..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:border-[#10B981] transition-colors"
              />
            </div>
          </div>

          {/* Right Header: Role switcher, Notifications, User Badge & Profile Dropdown */}
          <div className="flex items-center gap-3">
            {/* Quick Role Switcher for seamless testing */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 text-xs text-slate-700 font-medium cursor-pointer"
                title="Switch role for RBAC testing"
              >
                <Shield className={`w-3.5 h-3.5 ${isAdmin ? 'text-emerald-600' : 'text-blue-600'}`} />
                <span className="hidden sm:inline capitalize">{user?.role.replace('_', ' ')}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs">
                  <div className="px-3 py-1 font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                    Switch Role (RBAC)
                  </div>
                  <button
                    onClick={() => {
                      switchDemoRole('agency_admin');
                      setRoleMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <div className="font-semibold text-slate-800">Sarah Ahmed</div>
                      <div className="text-[10px] text-slate-500">Agency Admin (Full Access)</div>
                    </div>
                    {isAdmin && <span className="text-[10px] text-emerald-600 font-bold">Active</span>}
                  </button>
                  <button
                    onClick={() => {
                      switchDemoRole('agent');
                      setRoleMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <div className="font-semibold text-slate-800">Bilal Khan</div>
                      <div className="text-[10px] text-slate-500">Agent (Assigned Leads Only)</div>
                    </div>
                    {!isAdmin && <span className="text-[10px] text-blue-600 font-bold">Active</span>}
                  </button>
                </div>
              )}
            </div>

            {/* Notification bell */}
            <div className="relative p-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100 cursor-pointer">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#10B981] rounded-full ring-2 ring-white" />
            </div>

            {/* User Profile Dropdown Button */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 pl-2 border-l border-slate-200 hover:opacity-90 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-[#101B35] text-white font-bold text-xs flex items-center justify-center ring-2 ring-emerald-500/30">
                  {user?.full_name ? user.full_name.split(' ').map((n) => n[0]).join('').substring(0, 2) : 'SA'}
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-bold text-slate-900 leading-tight">
                    {user?.full_name || 'Sarah Ahmed'}
                  </div>
                  <div className="text-[10px] text-slate-500 capitalize">
                    {user?.role.replace('_', ' ') || 'Agency Admin'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 text-xs">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <div className="font-bold text-[#101B35]">{user?.full_name || 'Sarah Ahmed'}</div>
                    <div className="text-[11px] text-slate-500 truncate">{user?.email || 'admin@aqarflow.com'}</div>
                  </div>
                  <button
                    onClick={() => {
                      onSelectView('settings');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    <span>Account Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      onExitToMarketplace();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                    <span>Public Marketplace</span>
                  </button>
                  <div className="border-t border-slate-100 my-1" />
                  <button
                    onClick={() => {
                      logout();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 cursor-pointer font-bold"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Mobile Sidebar overlay */}
        {mobileSidebarOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs flex">
            <div className="w-64 bg-slate-950 text-slate-300 flex flex-col h-full p-4 space-y-4">
              <div className="flex items-center justify-between">
                <AqarFlowLogo variant="dark" size="sm" />
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectView(item.id);
                        setMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium cursor-pointer ${
                        isActive ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-900'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-slate-900 space-y-2">
                <button
                  onClick={() => {
                    onExitToMarketplace();
                    setMobileSidebarOpen(false);
                  }}
                  className="w-full text-left text-xs text-emerald-400 py-1.5"
                >
                  Exit to Public Website &rarr;
                </button>
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileSidebarOpen(false)} />
          </div>
        )}

        {/* Main Viewport Content */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};
