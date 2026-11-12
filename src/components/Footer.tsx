import React, { useState } from 'react';
import { AqarFlowLogo } from './AqarFlowLogo';
import { 
  Linkedin, 
  Github, 
  Youtube, 
  Send
} from 'lucide-react';

export const Footer: React.FC<{ onNavigateToWorkspace?: () => void }> = ({ onNavigateToWorkspace }) => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      alert(`Thank you for subscribing, ${email}!`);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#07132B] text-slate-300 border-t border-slate-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Main Footer Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
          
          {/* Left: Brand Logo & Tagline */}
          <div className="shrink-0">
            <AqarFlowLogo variant="dark" size="md" showTagline={true} />
          </div>

          {/* Center: Navigation Links */}
          <nav className="flex flex-wrap items-center gap-6 sm:gap-8 text-xs font-semibold text-slate-300">
            <span className="text-white hover:text-blue-400 cursor-pointer">Home</span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="hover:text-blue-400 cursor-pointer">Properties</span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="hover:text-blue-400 cursor-pointer">About</span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="hover:text-blue-400 cursor-pointer">Services</span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="hover:text-blue-400 cursor-pointer">Contact</span>
          </nav>

          {/* Social Icons: LinkedIn, GitHub, YouTube, X (Twitter) */}
          <div className="flex items-center gap-3 text-slate-400">
            <a href="#linkedin" className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="#github" className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 hover:text-white flex items-center justify-center transition-colors">
              <Github className="w-4 h-4" />
            </a>
            <a href="#youtube" className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-red-600 hover:text-white flex items-center justify-center transition-colors">
              <Youtube className="w-4 h-4" />
            </a>
            {/* Custom X Logo */}
            <a href="#twitter" className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 hover:text-white flex items-center justify-center transition-colors font-bold text-xs">
              𝕏
            </a>
          </div>

          {/* Right Newsletter Input & Subscribe Button */}
          <form onSubmit={handleSubscribe} className="flex items-center gap-2 max-w-sm w-full lg:w-auto">
            <div className="relative flex-1">
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-3.5 pr-4 py-2 bg-white text-xs text-slate-900 placeholder-slate-400 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-xs"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>

        </div>

        {/* Bottom Copyright & Legal Links */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
          <p>© 2026 AqarFlow. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="text-slate-700">|</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="text-slate-700">|</span>
            <span className="hover:text-slate-400 cursor-pointer">Help</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
