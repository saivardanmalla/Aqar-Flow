import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PublicPages } from './components/PublicPages';
import { Footer } from './components/Footer';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { InquiryModal } from './components/InquiryModal';
import { AuthModal } from './components/AuthModal';
import { AIChatAssistant } from './components/AIChatAssistant';

import { WorkspaceLayout } from './components/workspace/WorkspaceLayout';
import { DashboardView } from './components/workspace/DashboardView';
import { PropertiesView } from './components/workspace/PropertiesView';
import { PropertiesDirectory } from './components/workspace/PropertiesDirectory';
import { DealPipeline } from './components/workspace/DealPipeline';
import { CalendarBookingView } from './components/workspace/CalendarBookingView';
import { LeadsView } from './components/workspace/LeadsView';
import { VisitsView } from './components/workspace/VisitsView';
import { DealsView } from './components/workspace/DealsView';
import { AgentsView } from './components/workspace/AgentsView';
import { SettingsView } from './components/workspace/SettingsView';
import { TenantsView } from './components/workspace/TenantsView';
import { PaymentsView } from './components/workspace/PaymentsView';
import { MaintenanceView } from './components/workspace/MaintenanceView';
import { ReportsView } from './components/workspace/ReportsView';

import { Property } from './types';

function AppContent() {
  const { isAuthenticated } = useAuth();

  // Mode: 'marketplace' or 'workspace'
  const [appMode, setAppMode] = useState<'marketplace' | 'workspace'>('marketplace');

  // Marketplace states
  const [marketplaceTab, setMarketplaceTab] = useState<string>('home');
  const [heroSearchParams, setHeroSearchParams] = useState<any>(undefined);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [inquiryProperty, setInquiryProperty] = useState<Property | null>(null);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Check URL hash: e.g. #login opens login modal directly
  React.useEffect(() => {
    if (window.location.hash === '#login') {
      setIsAuthModalOpen(true);
    } else if (window.location.hash === '#workspace' || window.location.hash === '#admin') {
      if (isAuthenticated) {
        setAppMode('workspace');
      } else {
        setIsAuthModalOpen(true);
      }
    }
  }, [isAuthenticated]);

  // Workspace states
  const [workspaceView, setWorkspaceView] = useState<string>('dashboard');

  const handleHeroSearch = (filters: any) => {
    setHeroSearchParams(filters);
    setMarketplaceTab('properties');
  };

  const handleSelectProperty = (property: Property) => {
    setSelectedProperty(property);
    setIsDetailModalOpen(true);
  };

  const handleInquireProperty = (property: Property) => {
    setInquiryProperty(property);
    setIsInquiryModalOpen(true);
  };

  const handleOpenWorkspace = () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
    } else {
      setAppMode('workspace');
    }
  };

  // If in Agency Workspace
  if (appMode === 'workspace' && isAuthenticated) {
    return (
      <WorkspaceLayout
        currentView={workspaceView}
        onSelectView={setWorkspaceView}
        onExitToMarketplace={() => setAppMode('marketplace')}
      >
        {workspaceView === 'dashboard' && (
          <DashboardView onNavigateToView={setWorkspaceView} />
        )}
        {workspaceView === 'properties' && (
          <div className="space-y-8">
            <PropertiesDirectory onSelectProperty={handleSelectProperty} />
            <div className="pt-6 border-t border-slate-200">
              <h3 className="text-base font-bold text-slate-800 mb-4">Operations & CRUD Management</h3>
              <PropertiesView />
            </div>
          </div>
        )}
        {workspaceView === 'tenants' && <TenantsView />}
        {workspaceView === 'payments' && <PaymentsView />}
        {workspaceView === 'maintenance' && <MaintenanceView />}
        {workspaceView === 'leads' && (
          <div className="space-y-8">
            <DealPipeline onAddDeal={() => setWorkspaceView('leads')} />
            <div className="pt-6 border-t border-slate-200">
              <h3 className="text-base font-bold text-slate-800 mb-4">CRM Leads Table</h3>
              <LeadsView />
            </div>
          </div>
        )}
        {workspaceView === 'visits' && (
          <div className="space-y-8">
            <CalendarBookingView />
            <div className="pt-6 border-t border-slate-200">
              <VisitsView />
            </div>
          </div>
        )}
        {workspaceView === 'deals' && <DealPipeline />}
        {workspaceView === 'agents' && <AgentsView />}
        {workspaceView === 'reports' && <ReportsView />}
        {workspaceView === 'settings' && <SettingsView />}
      </WorkspaceLayout>
    );
  }

  // Public Marketplace Experience
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        currentTab={marketplaceTab}
        onSelectTab={setMarketplaceTab}
        onOpenLogin={() => setIsAuthModalOpen(true)}
        onOpenWorkspace={handleOpenWorkspace}
      />

      {/* Hero Section on Home tab */}
      {marketplaceTab === 'home' && (
        <HeroSection onSearch={handleHeroSearch} />
      )}

      {/* Main Public Content */}
      <main className="flex-1">
        <PublicPages
          currentTab={marketplaceTab}
          onSelectProperty={handleSelectProperty}
          onInquireProperty={handleInquireProperty}
          onNavigateToWorkspace={handleOpenWorkspace}
          searchParams={heroSearchParams}
        />
      </main>

      {/* Footer */}
      <Footer onNavigateToWorkspace={handleOpenWorkspace} />

      {/* Property Details Modal */}
      <PropertyDetailModal
        property={selectedProperty}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onInquire={handleInquireProperty}
      />

      {/* Inquiry Modal -> Directly creates CRM lead */}
      <InquiryModal
        property={inquiryProperty}
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => setAppMode('workspace')}
      />

      {/* Groq AI Real Estate Chat Assistant */}
      <AIChatAssistant />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
