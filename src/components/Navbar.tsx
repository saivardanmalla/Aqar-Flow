import React, { useState } from 'react';
import { AqarFlowLogo } from './AqarFlowLogo';
import { useAuth } from '../context/AuthContext';
import { Search, Heart, ChevronDown, Menu, X } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenLogin: () => void;
  onOpenWorkspace: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenLogin,
  onOpenWorkspace,
}) => {
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'properties', label: 'Properties', hasDropdown: true },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services', hasDropdown: true },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-6">
        {/* Left: Brand Logo */}
        <button
          onClick={() => {
            onSelectTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-left focus-visible:outline-hidden cursor-pointer shrink-0"
        >
          <AqarFlowLogo size="md" variant="light" />
        </button>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-700">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onSelectTab(link.id)}
              className={`flex items-center gap-1 transition-colors whitespace-nowrap cursor-pointer hover:text-blue-600 ${
                currentTab === link.id
                  ? 'text-blue-600 font-bold border-b-2 border-blue-600 pb-1'
                  : ''
              }`}
            >
              <span>{link.label}</span>
              {link.hasDropdown && <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
            </button>
          ))}
        </nav>

        {/* Right Actions: Search Icon, Favorites with red badge (2), Login / Workspace */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Circular Search Button */}
          <button
            onClick={() => onSelectTab('properties')}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            title="Search Properties"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Heart / Favorites Button with '2' badge */}
          <div className="relative">
            <button
              onClick={() => onSelectTab('properties')}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              title="Saved Properties"
            >
              <Heart className="w-4 h-4" />
            </button>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
              2
            </span>
          </div>

          {/* Login / Workspace Button */}
          {isAuthenticated ? (
            <button
              onClick={onOpenWorkspace}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors cursor-pointer whitespace-nowrap shadow-xs flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Workspace</span>
            </button>
          ) : (
            <button
              onClick={onOpenLogin}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl transition-all shadow-xs cursor-pointer whitespace-nowrap"
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile menu hamburger */}
        <div className="md:hidden flex items-center gap-2">
          {!isAuthenticated && (
            <button
              onClick={onOpenLogin}
              className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 rounded-lg"
            >
              Login
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-slate-900 cursor-pointer"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onSelectTab(link.id);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 text-sm rounded-md font-semibold ${
                currentTab === link.id
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-100 flex gap-2">
            <button
              onClick={() => {
                onOpenWorkspace();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 text-xs font-bold text-white bg-blue-600 rounded-xl text-center"
            >
              Launch Workspace
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
