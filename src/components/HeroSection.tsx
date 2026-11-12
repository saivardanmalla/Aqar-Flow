import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  IndianRupee, 
  Search, 
  Play, 
  ArrowRight, 
  Star
} from 'lucide-react';
import heroBg from '../assets/images/property_islamabad_villa_1794204424374.jpg';

interface HeroProps {
  onSearch: (filters: {
    purpose?: string;
    property_type?: string;
    city?: string;
    search?: string;
  }) => void;
}

export const HeroSection: React.FC<HeroProps> = ({ onSearch }) => {
  const [location, setLocation] = useState<string>('all');
  const [propertyType, setPropertyType] = useState<string>('all');
  const [budget, setBudget] = useState<string>('all');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      city: location !== 'all' ? location : undefined,
      property_type: propertyType !== 'all' ? propertyType : undefined,
      search: budget !== 'all' ? budget : undefined,
    });
  };

  return (
    <section className="relative overflow-hidden bg-slate-50 min-h-[560px] lg:min-h-[600px] flex items-center pt-8 pb-16">
      {/* Background Architectural Villa Image spanning right half */}
      <div className="absolute top-0 right-0 w-full lg:w-[62%] h-full z-0 overflow-hidden pointer-events-none">
        <img
          src={heroBg}
          alt="Modern Luxury Architectural Villa"
          className="w-full h-full object-cover object-center lg:object-left"
        />
        {/* Smooth, soft light gradient blending the villa into the left text section */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-50/70 to-transparent lg:via-slate-50/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Left Text Content */}
        <div className="max-w-xl">
          {/* Badge: Smart Real Estate. Smarter Living. */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/70 text-blue-700 text-xs font-semibold mb-6 shadow-2xs border border-blue-200/50">
            <Star className="w-3.5 h-3.5 fill-blue-600 text-blue-600" />
            <span>Smart Real Estate. Smarter Living.</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
            Find Your <br />
            <span className="text-blue-600">Dream Property</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-lg">
            Buy, Rent or Invest in the best properties across India with AqarFlow — your trusted real estate partner.
          </p>

          {/* CTA Buttons: Explore Properties & Watch Video */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={() => {
                const target = document.getElementById('featured-section');
                if (target) target.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl transition-all shadow-md shadow-blue-500/20 cursor-pointer"
            >
              <span>Explore Properties</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              className="flex items-center gap-2.5 px-5 py-3.5 text-xs sm:text-sm font-bold text-slate-800 bg-white hover:bg-slate-50 rounded-xl border border-slate-200/90 shadow-2xs transition-all cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <Play className="w-3 h-3 fill-current ml-0.5" />
              </div>
              <span>Watch Video</span>
            </button>
          </div>
        </div>

        {/* Floating Horizontal Pill Search Bar (Location, Property Type, Budget, Search Properties) */}
        <div className="mt-14 w-full max-w-4xl bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-full p-2.5 sm:p-3 border border-slate-200/80 shadow-xl shadow-slate-200/60">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
            
            {/* Segment 1: Location */}
            <div className="flex items-center gap-3 px-4 py-2 border-b sm:border-b-0 sm:border-r border-slate-100">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="text-[10px] uppercase font-bold text-slate-400">Location</div>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full text-xs font-bold text-slate-800 bg-transparent focus:outline-hidden cursor-pointer"
                >
                  <option value="all">Any Location</option>
                  <option value="Guntur">Guntur, AP</option>
                  <option value="Vijayawada">Vijayawada, AP</option>
                  <option value="Tenali">Tenali, AP</option>
                  <option value="Hyderabad">Hyderabad</option>
                </select>
              </div>
            </div>

            {/* Segment 2: Property Type */}
            <div className="flex items-center gap-3 px-4 py-2 border-b sm:border-b-0 sm:border-r border-slate-100">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="text-[10px] uppercase font-bold text-slate-400">Property Type</div>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full text-xs font-bold text-slate-800 bg-transparent focus:outline-hidden cursor-pointer"
                >
                  <option value="all">Any Type</option>
                  <option value="house">Bungalow / Villa</option>
                  <option value="apartment">Apartment</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
            </div>

            {/* Segment 3: Budget */}
            <div className="flex items-center gap-3 px-4 py-2">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <IndianRupee className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="text-[10px] uppercase font-bold text-slate-400">Budget</div>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full text-xs font-bold text-slate-800 bg-transparent focus:outline-hidden cursor-pointer"
                >
                  <option value="all">Any Budget</option>
                  <option value="under_50l">Under ₹50 Lakhs</option>
                  <option value="50l_1cr">₹50L - ₹1 Crore</option>
                  <option value="above_1cr">₹1 Crore+</option>
                </select>
              </div>
            </div>

            {/* Segment 4: Search Action Button */}
            <button
              type="submit"
              className="w-full h-11 sm:h-12 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold rounded-xl sm:rounded-full transition-all shadow-md shadow-blue-500/25 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Search Properties</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
