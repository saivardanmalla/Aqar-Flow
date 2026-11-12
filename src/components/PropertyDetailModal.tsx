import React, { useState } from 'react';
import { Property } from '../types';
import { 
  X, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  Check, 
  Calendar, 
  Phone, 
  Mail, 
  Share2, 
  Heart,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building,
  User,
  ExternalLink
} from 'lucide-react';

interface PropertyDetailModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onInquire: (property: Property) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  isOpen,
  onClose,
  onInquire,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [inquirySent, setInquirySent] = useState(false);
  const [message, setMessage] = useState("Hi Carolina, I would like to know more about this listing.");

  if (!isOpen || !property) return null;

  // Grid of 5 photos matching Image 4 ("Zenvia" layout format)
  const galleryImages = [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&auto=format&fit=crop&q=80',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
        
        {/* Top Navbar matching Image 4 ("Zenvia" dark blue bar format) */}
        <div className="px-6 py-3.5 bg-blue-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-black text-sm uppercase tracking-wider">
              AQARFLOW
            </span>
            <span className="text-xs text-blue-200">· Premium Listing Portal</span>
          </div>

          <div className="flex items-center gap-3">
            <button className="text-xs font-semibold text-white/90 hover:text-white flex items-center gap-1 cursor-pointer">
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
            <button 
              onClick={onClose}
              className="p-1 rounded-full bg-white/20 hover:bg-white/30 text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-8 max-h-[85vh] overflow-y-auto">
          
          {/* Section 1: 5-Photo Mosaic Gallery matching Image 4 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 rounded-2xl overflow-hidden aspect-16/9 sm:aspect-21/9 max-h-[420px]">
            {/* Main large photo (left half) */}
            <div className="md:col-span-2 h-full relative overflow-hidden group">
              <img
                src={galleryImages[0]}
                alt={property.title}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
              />
              <span className="absolute bottom-3 left-3 px-3 py-1 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-bold rounded-lg">
                Cover Photo
              </span>
            </div>

            {/* 4 Smaller grid photos on the right */}
            <div className="md:col-span-2 grid grid-cols-2 gap-2.5 h-full">
              {galleryImages.slice(1, 5).map((img, idx) => (
                <div key={idx} className="relative h-full overflow-hidden group cursor-pointer">
                  <img
                    src={img}
                    alt={`Detail ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {idx === 3 && (
                    <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center text-white text-xs font-bold">
                      +15 Photos
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Header Price & Specifications matching Image 4 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 8 Columns: Details & Description */}
            <div className="lg:col-span-8 space-y-6">
              <div>
                <div className="text-3xl font-black text-slate-900 tracking-tight font-mono">
                  $859,000
                </div>
                <h1 className="text-xl font-bold text-slate-800 mt-1">
                  {property.title}
                </h1>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>{property.address || '4430 Dogwood Ct, Harrisburg, PA 17110'}</span>
                </div>
              </div>

              {/* Spec Badges Row matching Image 4: 4 Beds | 4 Baths | 3,824 Sqft */}
              <div className="flex items-center gap-6 py-4 border-y border-slate-200 text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-2">
                  <Bed className="w-4 h-4 text-slate-400" />
                  <span>{property.bedrooms || 4} Beds</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="w-4 h-4 text-slate-400" />
                  <span>{property.bathrooms || 4} Baths</span>
                </div>
                <div className="flex items-center gap-2">
                  <Maximize2 className="w-4 h-4 text-slate-400" />
                  <span>{property.area_value || '3,824'} sqft</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-slate-400" />
                  <span>Single Family Residence</span>
                </div>
              </div>

              {/* What's Special */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  What's Special
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {property.description || 
                    "This gorgeous custom design home is nestled in the prestigious Fairway Estates neighborhood. Boasting custom finishes throughout, gleaming hardwood floors, double-height stone fireplace, gourmet chef's kitchen with quartzite countertops and imported appliances."}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                  {['Private Heated Pool', 'Smart Home Automation', 'Golf Course View', 'Hardwood Flooring', 'Wine Cellar', '3-Car Garage'].map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 4 Columns: Contact Agent Card matching Image 4 */}
            <div className="lg:col-span-4 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Listing Agent
              </div>

              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80"
                  alt="Carolina Vassalo Coimbra"
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Carolina Vassalo Coimbra
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    +1 (555) 304-9821
                  </div>
                  <div className="text-[10px] text-blue-600 font-semibold">
                    Premier Real Estate Advisory
                  </div>
                </div>
              </div>

              {inquirySent ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium text-center">
                  Inquiry sent! Carolina will get in touch shortly.
                </div>
              ) : (
                <div className="space-y-3 pt-2">
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-blue-600"
                  />

                  <button
                    onClick={() => {
                      setInquirySent(true);
                      if (onInquire) onInquire(property);
                    }}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    Send Message
                  </button>

                  <button
                    onClick={() => {
                      if (onInquire) onInquire(property);
                    }}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    Schedule a Visit Tour
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
