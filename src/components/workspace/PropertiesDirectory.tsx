import React, { useState } from 'react';
import { Property } from '../../types';
import { 
  Building2, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  Search, 
  Filter, 
  ChevronDown, 
  SlidersHorizontal,
  ArrowRight,
  Heart,
  Star,
  Check,
  X
} from 'lucide-react';

interface PropertiesDirectoryProps {
  onSelectProperty?: (property: Property) => void;
}

export const PropertiesDirectory: React.FC<PropertiesDirectoryProps> = ({ onSelectProperty }) => {
  const [priceRange, setPriceRange] = useState<string>('all');
  const [propertyType, setPropertyType] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [bedrooms, setBedrooms] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Sample properties matching Image 2 ("Homegi" layout format)
  const directoryProperties = [
    {
      id: 'prop-1',
      title: 'Golden Ridge Modern Residences',
      location: 'Ajax, Ontario, Canada',
      city: 'Ajax',
      price: '$275k',
      priceNum: 275000,
      property_type: 'apartment',
      beds: 2,
      baths: 2,
      area: '1,250 sqft',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80',
      badge: 'Featured',
    },
    {
      id: 'prop-2',
      title: 'Riverstone Estate Villas',
      location: 'Oakville, Ontario, Canada',
      city: 'Oakville',
      price: '$450k',
      priceNum: 450000,
      property_type: 'house',
      beds: 4,
      baths: 3,
      area: '2,800 sqft',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&auto=format&fit=crop&q=80',
      badge: 'Popular',
    },
    {
      id: 'prop-3',
      title: 'Ocean Breeze High-Rise Suite',
      location: 'Milton, Ontario, Canada',
      city: 'Milton',
      price: '$320k',
      priceNum: 320000,
      property_type: 'apartment',
      beds: 3,
      baths: 2,
      area: '1,650 sqft',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80',
      badge: 'New',
    },
    {
      id: 'prop-4',
      title: 'Lakeside Retreat Penthouse',
      location: 'Vaughan, Ontario, Canada',
      city: 'Vaughan',
      price: '$580k',
      priceNum: 580000,
      property_type: 'apartment',
      beds: 4,
      baths: 4,
      area: '3,100 sqft',
      rating: 5.0,
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&auto=format&fit=crop&q=80',
      badge: 'Luxury',
    },
    {
      id: 'prop-5',
      title: 'Crystal Shores Executive Villa',
      location: 'Markham, Ontario, Canada',
      city: 'Markham',
      price: '$750k',
      priceNum: 750000,
      property_type: 'house',
      beds: 5,
      baths: 5,
      area: '4,200 sqft',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
      badge: 'Verified',
    },
    {
      id: 'prop-6',
      title: 'Sunset Hollow Designer Home',
      location: 'Oakville, Ontario, Canada',
      city: 'Oakville',
      price: '$610k',
      priceNum: 610000,
      property_type: 'house',
      beds: 3,
      baths: 3,
      area: '2,400 sqft',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&auto=format&fit=crop&q=80',
      badge: 'Hot Deal',
    },
  ];

  const filtered = directoryProperties.filter((p) => {
    if (propertyType !== 'all' && p.property_type !== propertyType) return false;
    if (selectedCity !== 'all' && p.city !== selectedCity) return false;
    if (bedrooms > 0 && p.beds < bedrooms) return false;
    if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase()) && !p.location.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Top Header bar matching Image 2: "115 properties found that match your buying preferences" */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Properties Directory
          </h2>
          <p className="text-xs text-slate-500">
            {filtered.length} properties found that match your preferences
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, street, area..."
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-blue-500 w-56"
            />
          </div>
          <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-2xs transition-colors cursor-pointer">
            Sort by: Price (Low to High)
          </button>
        </div>
      </div>

      {/* Main Layout: Left Custom Filter Sidebar + Right Property Grid matching Image 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT: CustomFilter Sidebar matching Image 2 */}
        <aside className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-900">
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <span>Custom Filter</span>
            </div>
            <button 
              onClick={() => { setPropertyType('all'); setSelectedCity('all'); setBedrooms(0); }}
              className="text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer"
            >
              Clear All
            </button>
          </div>

          {/* Section 1: Property Price */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-800">Property Price</div>
            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                <span>$100k - $250k</span>
              </label>
              <label className="flex items-center gap-2 text-slate-900 font-semibold cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-blue-600 focus:ring-blue-500" />
                <span>Around $250k - $750k</span>
              </label>
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                <span>$750k - $1M+</span>
              </label>
            </div>
          </div>

          {/* Section 2: Property Type */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-800">Property Type</div>
            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                <input 
                  type="radio" 
                  name="type" 
                  checked={propertyType === 'all'} 
                  onChange={() => setPropertyType('all')} 
                  className="text-blue-600 focus:ring-blue-500" 
                />
                <span>All Types</span>
              </label>
              <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                <input 
                  type="radio" 
                  name="type" 
                  checked={propertyType === 'house'} 
                  onChange={() => setPropertyType('house')} 
                  className="text-blue-600 focus:ring-blue-500" 
                />
                <span>Single Family House</span>
              </label>
              <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                <input 
                  type="radio" 
                  name="type" 
                  checked={propertyType === 'apartment'} 
                  onChange={() => setPropertyType('apartment')} 
                  className="text-blue-600 focus:ring-blue-500" 
                />
                <span>Luxury Apartment</span>
              </label>
              <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                <input 
                  type="radio" 
                  name="type" 
                  checked={propertyType === 'commercial'} 
                  onChange={() => setPropertyType('commercial')} 
                  className="text-blue-600 focus:ring-blue-500" 
                />
                <span>Condominium / Suite</span>
              </label>
            </div>
          </div>

          {/* Section 3: Property Location */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-800">Property Location</div>
            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={selectedCity === 'Oakville'} 
                  onChange={(e) => setSelectedCity(e.target.checked ? 'Oakville' : 'all')} 
                  className="rounded text-blue-600 focus:ring-blue-500" 
                />
                <span>Oakville, ON, Canada</span>
              </label>
              <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={selectedCity === 'Ajax'} 
                  onChange={(e) => setSelectedCity(e.target.checked ? 'Ajax' : 'all')} 
                  className="rounded text-blue-600 focus:ring-blue-500" 
                />
                <span>Ajax, ON, Canada</span>
              </label>
              <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={selectedCity === 'Milton'} 
                  onChange={(e) => setSelectedCity(e.target.checked ? 'Milton' : 'all')} 
                  className="rounded text-blue-600 focus:ring-blue-500" 
                />
                <span>Milton, ON, Canada</span>
              </label>
            </div>
          </div>

          {/* Section 4: Property Rooms */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-800">Bedrooms</div>
            <div className="flex gap-2">
              {[0, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setBedrooms(num)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                    bedrooms === num 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {num === 0 ? 'Any' : `${num}+`}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* RIGHT: Grid of Properties matching Image 2 */}
        <main className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((prop) => (
            <div
              key={prop.id}
              onClick={() => {
                if (onSelectProperty) {
                  onSelectProperty({
                    id: prop.id,
                    title: prop.title,
                    price: prop.priceNum,
                    currency: 'USD',
                    purpose: 'sale',
                    property_type: prop.property_type as any,
                    category: 'residential',
                    bedrooms: prop.beds,
                    bathrooms: prop.baths,
                    area_value: 2000,
                    area_unit: 'sqft',
                    city: prop.city,
                    address: prop.location,
                    reference_code: 'AF-101',
                    slug: 'af-101',
                    description: 'Modern luxury property with premium finishes.',
                    status: 'available',
                    is_published: true,
                    views_count: 50,
                    inquiries_count: 5,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                  });
                }
              }}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all cursor-pointer overflow-hidden flex flex-col group"
            >
              {/* Photo & Rating Badge matching Image 2 */}
              <div className="relative aspect-16/10 bg-slate-900 overflow-hidden">
                <img
                  src={prop.image}
                  alt={prop.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Rating badge top-right */}
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-white/95 backdrop-blur-xs text-[11px] font-bold text-slate-800 flex items-center gap-1 shadow-xs">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{prop.rating}</span>
                </div>

                {/* Price tag bottom-left overlay */}
                <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-xs text-white text-xs font-extrabold shadow-xs">
                  {prop.price}
                </div>
              </div>

              {/* Information */}
              <div className="p-4 flex flex-col justify-between flex-1 space-y-3">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                    {prop.title}
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{prop.location}</span>
                  </div>
                </div>

                {/* Specs row matching Image 2 */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <div className="flex items-center gap-1">
                    <Bed className="w-3.5 h-3.5 text-slate-400" />
                    <span>{prop.beds} Beds</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="w-3.5 h-3.5 text-slate-400" />
                    <span>{prop.baths} Baths</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{prop.area}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </main>

      </div>
    </div>
  );
};

