import React from 'react';
import { Property } from '../types';
import { formatPKR } from '../lib/utils';
import { MapPin, Bed, Bath, Maximize2, ArrowUpRight } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onSelect: (property: Property) => void;
  onInquire: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSelect,
  onInquire,
}) => {
  const coverImage = property.media?.find((m) => m.is_cover)?.url || property.media?.[0]?.url || '/src/assets/images/property_islamabad_villa_1794204424374.jpg';

  const isRent = property.purpose === 'rent';
  const priceDisplay = isRent ? `${formatPKR(property.price)} / month` : formatPKR(property.price);

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col">
      {/* Property Image Container */}
      <div className="relative aspect-16/10 overflow-hidden bg-slate-900 cursor-pointer" onClick={() => onSelect(property)}>
        <img
          src={coverImage}
          alt={property.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Purpose Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-3 py-1 text-xs font-bold rounded-lg shadow-sm ${
              isRent ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
            }`}
          >
            {isRent ? 'For Rent' : 'For Sale'}
          </span>
        </div>

        {/* Reference Code Badge */}
        <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-mono px-2 py-0.5 rounded-md">
          {property.reference_code}
        </div>
      </div>

      {/* Property Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Price & Location */}
          <div className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight font-sans">
            {priceDisplay}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">{property.locality ? `${property.locality}, ` : ''}{property.city}, Pakistan</span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelect(property)}
            className="mt-2.5 text-sm font-semibold text-slate-800 line-clamp-1 hover:text-emerald-600 cursor-pointer transition-colors"
            title={property.title}
          >
            {property.title}
          </h3>

          {/* Specs: Bedrooms, Bathrooms, Area value */}
          <div className="mt-3.5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
            {property.bedrooms > 0 && (
              <div className="flex items-center gap-1.5">
                <Bed className="w-4 h-4 text-slate-400" />
                <span>{property.bedrooms} Beds</span>
              </div>
            )}
            {property.bathrooms > 0 && (
              <div className="flex items-center gap-1.5">
                <Bath className="w-4 h-4 text-slate-400" />
                <span>{property.bathrooms} Baths</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Maximize2 className="w-4 h-4 text-slate-400" />
              <span>{property.area_value.toLocaleString()} {property.area_unit}</span>
            </div>
          </div>
        </div>

        {/* Card Action Buttons */}
        <div className="mt-4 pt-3 flex items-center gap-2">
          <button
            onClick={() => onSelect(property)}
            className="flex-1 py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer text-center"
          >
            Details
          </button>
          <button
            onClick={() => onInquire(property)}
            className="flex-1 flex items-center justify-center gap-1 py-2 px-3 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-xs cursor-pointer text-center"
          >
            <span>Inquire</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
