import React, { useState } from 'react';
import { Property } from '../types';
import { 
  Building2, 
  ArrowRight, 
  Heart,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  ShieldCheck,
  Headphones,
  TrendingUp,
  Award
} from 'lucide-react';

interface PublicPagesProps {
  currentTab: string;
  onSelectProperty: (property: Property) => void;
  onInquireProperty: (property: Property) => void;
  onNavigateToWorkspace: () => void;
  searchParams?: {
    purpose?: string;
    property_type?: string;
    city?: string;
    search?: string;
  };
}

export const PublicPages: React.FC<PublicPagesProps> = ({
  currentTab,
  onSelectProperty,
  onInquireProperty,
  onNavigateToWorkspace,
  searchParams,
}) => {
  const [favorites, setFavorites] = useState<Record<string, boolean>>({
    'p1': true,
    'p3': true,
  });

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // 4 Specific Properties exactly matching the uploaded screenshot
  const propertiesList = [
    {
      id: 'p1',
      title: 'Modern Luxury Villa with Pool',
      price: '₹1,25,00,000',
      priceNum: 12500000,
      tag: 'For Sale',
      purpose: 'sale',
      tagBg: 'bg-emerald-600',
      location: 'Guntur, Andhra Pradesh',
      city: 'Guntur',
      beds: '4 BHK',
      baths: '3 Baths',
      area: '2,800 sqft',
      image: '/src/assets/images/property_bahria_commercial_1794204424374.jpg',
      property_type: 'villa',
      description: 'Exclusive 4 BHK ultra-luxury villa featuring private swimming pool, Italian marble flooring, and smart home automation in prime Guntur.',
    },
    {
      id: 'p2',
      title: 'Contemporary High-rise Apartment',
      price: '₹45,000 / month',
      priceNum: 45000,
      tag: 'For Rent',
      purpose: 'rent',
      tagBg: 'bg-blue-600',
      location: 'Vijayawada, Andhra Pradesh',
      city: 'Vijayawada',
      beds: '2 BHK',
      baths: '2 Baths',
      area: '1,600 sqft',
      image: '/src/assets/images/property_lahore_apartment_1794204426205.jpg',
      property_type: 'apartment',
      description: 'High-floor 2 BHK apartment with breathtaking panoramic city views, club house access, gym, and 24/7 power backup in Vijayawada.',
    },
    {
      id: 'p3',
      title: 'Executive Designer Bungalow',
      price: '₹85,00,000',
      priceNum: 8500000,
      tag: 'For Sale',
      purpose: 'sale',
      tagBg: 'bg-emerald-600',
      location: 'Tenali, Andhra Pradesh',
      city: 'Tenali',
      beds: '3 BHK',
      baths: '3 Baths',
      area: '2,200 sqft',
      image: '/src/assets/images/property_karachi_bungalow_1794204425910.jpg',
      property_type: 'house',
      description: 'Spacious 3 BHK independent bungalow surrounded by landscaped gardens, solar power setup, and premium security in Tenali.',
    },
    {
      id: 'p4',
      title: 'Luxury Family Residence',
      price: '₹75,000 / month',
      priceNum: 75000,
      tag: 'For Rent',
      purpose: 'rent',
      tagBg: 'bg-blue-600',
      location: 'Guntur, Andhra Pradesh',
      city: 'Guntur',
      beds: '2 BHK',
      baths: '1 Bath',
      area: '1,200 sqft',
      image: '/src/assets/images/property_islamabad_villa_1794204424374.jpg',
      property_type: 'house',
      description: 'Charming fully furnished 2 BHK residential duplex home close to premier schools, shopping complexes, and transit hubs.',
    },
  ];

  return (
    <div className="space-y-20 py-10">
      {/* SECTION 1: Featured Properties Carousel / Row */}
      <section id="featured-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-start gap-8">
          
          {/* Left Title Card */}
          <div className="w-full lg:w-64 shrink-0 flex flex-col justify-between py-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-0.5 bg-blue-600 inline-block" />
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  FEATURED PROPERTIES
                </span>
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-3 leading-tight">
                Discover Our <br />
                Best Properties
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-3 leading-relaxed">
                Premium properties, verified listings and trusted deals.
              </p>
            </div>

            <button
              onClick={onNavigateToWorkspace}
              className="mt-6 self-start flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:text-blue-600 hover:border-blue-600 transition-colors cursor-pointer shadow-2xs"
            >
              <span>View All Properties</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right Properties Cards Container with Carousel Arrow */}
          <div className="flex-1 relative w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {propertiesList.map((prop) => (
                <div
                  key={prop.id}
                  onClick={() => {
                    const fullProp: Property = {
                      id: prop.id,
                      agency_id: 'agency-vireleo-001',
                      reference_code: `AF-${prop.id.toUpperCase()}`,
                      title: prop.title,
                      slug: prop.id,
                      description: prop.description,
                      purpose: prop.purpose as any,
                      category: 'residential',
                      property_type: prop.property_type as any,
                      price: prop.priceNum,
                      currency: 'INR',
                      area_value: parseInt(prop.area.replace(/[^0-9]/g, '')) || 2000,
                      area_unit: 'sqft',
                      bedrooms: parseInt(prop.beds) || 3,
                      bathrooms: parseInt(prop.baths) || 2,
                      address: prop.location,
                      city: prop.city,
                      locality: prop.city,
                      amenities: ['Power Backup', 'Covered Parking', 'Club House', 'Swimming Pool', '24/7 Security'],
                      furnishing_status: 'fully_furnished',
                      construction_status: 'ready',
                      possession_status: 'immediate',
                      status: 'available',
                      is_published: true,
                      views_count: 320,
                      inquiries_count: 14,
                      media: [{
                        id: `media-${prop.id}`,
                        property_id: prop.id,
                        url: prop.image,
                        is_cover: true,
                        display_order: 1,
                        created_at: new Date().toISOString(),
                      }],
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString(),
                    };
                    onSelectProperty(fullProp);
                  }}
                  className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col cursor-pointer"
                >
                  {/* Property Image & Badges */}
                  <div className="relative aspect-16/11 bg-slate-900 overflow-hidden">
                    <img
                      src={prop.image}
                      alt={prop.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Status Badge */}
                    <div className="absolute top-2.5 left-2.5">
                      <span className={`px-2.5 py-1 text-[11px] font-bold text-white rounded-lg shadow-xs ${prop.tagBg}`}>
                        {prop.tag}
                      </span>
                    </div>

                    {/* Heart Button */}
                    <button
                      onClick={(e) => toggleFavorite(prop.id, e)}
                      className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/80 hover:bg-white text-slate-700 flex items-center justify-center transition-all shadow-xs"
                    >
                      <Heart className={`w-3.5 h-3.5 ${favorites[prop.id] ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>
                  </div>

                  {/* Card Content */}
                  <div className="p-3.5 flex flex-col justify-between flex-1">
                    <div>
                      <div className="text-base font-extrabold text-slate-900">
                        {prop.price}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
                        <MapPin className="w-3 h-3 text-blue-600 shrink-0" />
                        <span className="truncate">{prop.location}</span>
                      </div>
                    </div>

                    {/* Specs Row */}
                    <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-medium">
                      <div className="flex items-center gap-1">
                        <Bed className="w-3.5 h-3.5 text-slate-400" />
                        <span>{prop.beds}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="w-3.5 h-3.5 text-slate-400" />
                        <span>{prop.baths}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{prop.area}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel Right Arrow Button */}
            <button
              onClick={onNavigateToWorkspace}
              className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-slate-200 shadow-md text-slate-700 hover:text-blue-600 hover:border-blue-600 items-center justify-center transition-all cursor-pointer z-10"
              aria-label="Next properties"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* SECTION 2: WHY CHOOSE AQARFLOW BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Column 1: Why Choose Header */}
            <div className="lg:col-span-3">
              <div className="flex items-center gap-2">
                <span className="w-5 h-0.5 bg-blue-600 inline-block" />
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                  WHY CHOOSE AQARFLOW
                </span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-2 leading-snug">
                Your Trusted <br />
                Real Estate Partner
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-2 leading-relaxed">
                Built for buyers, sellers and agencies with powerful tools and smart features.
              </p>
              <button
                onClick={onNavigateToWorkspace}
                className="mt-4 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Column 2: 4 Value Columns */}
            <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-y lg:border-y-0 lg:border-x border-slate-100 py-6 lg:py-0 lg:px-6">
              
              {/* Feature 1 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">Verified Listings</h4>
                <p className="text-[11px] text-slate-500 mt-1">100% genuine properties</p>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">Secure &amp; Reliable</h4>
                <p className="text-[11px] text-slate-500 mt-1">Your data, our priority</p>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">Advanced Analytics</h4>
                <p className="text-[11px] text-slate-500 mt-1">Track &amp; grow your business</p>
              </div>

              {/* Feature 4 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                  <Headphones className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">Dedicated Support</h4>
                <p className="text-[11px] text-slate-500 mt-1">Always here to help</p>
              </div>

            </div>

            {/* Column 3: Modern Skyscrapers Graphic with Blue Diagonal Stripes */}
            <div className="lg:col-span-3 flex justify-end">
              <div className="relative w-full h-32 rounded-2xl overflow-hidden bg-gradient-to-r from-blue-500/10 to-blue-600/30 flex items-center justify-center border border-blue-100">
                <div className="flex items-end gap-1.5 opacity-80">
                  <div className="w-5 h-16 bg-blue-600 rounded-t-sm" />
                  <div className="w-6 h-24 bg-blue-700 rounded-t-sm" />
                  <div className="w-7 h-20 bg-blue-500 rounded-t-sm" />
                  <div className="w-6 h-28 bg-blue-800 rounded-t-sm" />
                  <div className="w-5 h-14 bg-blue-400 rounded-t-sm" />
                </div>
                {/* Diagonal Accent Strip */}
                <div className="absolute top-0 right-0 w-16 h-full bg-blue-600/20 -skew-x-12" />
                <div className="absolute top-0 right-6 w-8 h-full bg-blue-600/40 -skew-x-12" />
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
