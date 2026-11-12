import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Filter,
  DollarSign,
  ChevronRight,
  SlidersHorizontal
} from 'lucide-react';

interface DealPipelineProps {
  onAddDeal?: () => void;
}

export const DealPipeline: React.FC<DealPipelineProps> = ({ onAddDeal }) => {
  // 4 Stages matching Image 3 ("BoldTrail" layout format): New Leads -> Contacted -> Under Contract -> Closed
  const stages = [
    {
      id: 'new_leads',
      name: 'New Leads',
      count: 24,
      deals: [
        {
          id: 'deal-01',
          propertyTitle: 'Rustickbay, Devane',
          price: '$295,999.00',
          clientName: 'Ali Raza',
          clientPhone: '+1 234 567 890',
          source: 'Website Lead',
          statusColor: 'bg-blue-500',
          image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&auto=format&fit=crop&q=80',
        },
      ],
    },
    {
      id: 'contacted',
      name: 'Contacted',
      count: 16,
      deals: [
        {
          id: 'deal-02',
          propertyTitle: 'Miral Rishra Villas',
          price: '$1,75,448.00',
          clientName: 'Fatima Noor',
          clientPhone: '+1 234 890 123',
          source: 'Call Follow-up',
          statusColor: 'bg-amber-500',
          image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&auto=format&fit=crop&q=80',
        },
      ],
    },
    {
      id: 'under_contract',
      name: 'Under Contract',
      count: 12,
      deals: [
        {
          id: 'deal-03',
          propertyTitle: 'Hernhouy, Narigoff Suites',
          price: '$107,449.00',
          clientName: 'Hassan Ali',
          clientPhone: '+1 456 789 012',
          source: 'Visit Completed',
          statusColor: 'bg-purple-500',
          image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&auto=format&fit=crop&q=80',
        },
      ],
    },
    {
      id: 'closed',
      name: 'Closed',
      count: 32,
      deals: [
        {
          id: 'deal-04',
          propertyTitle: 'Ukar Conhcey Estate',
          price: '$125,584.00',
          clientName: 'Daniyal Sheikh',
          clientPhone: '+1 789 012 345',
          source: 'Final Payment',
          statusColor: 'bg-emerald-500',
          image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&auto=format&fit=crop&q=80',
        },
      ],
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Top Header matching Image 3: "Pipeline" with horizontal step track */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Deals Pipeline
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Track multi-stage transaction workflows, offers, and verified closings
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Pipeline Settings</span>
            </button>
            <button 
              onClick={onAddDeal}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Deal</span>
            </button>
          </div>
        </div>

        {/* Horizontal Pipeline Steps Track matching Image 3 */}
        <div className="relative pt-4 pb-2 hidden md:block">
          <div className="absolute top-7 left-12 right-12 h-0.5 bg-amber-200 -z-0" />
          <div className="grid grid-cols-4 relative z-10 text-center">
            {stages.map((stg) => (
              <div key={stg.id} className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center border-4 border-white shadow-xs">
                  ✓
                </div>
                <div className="text-xs font-bold text-slate-800 mt-2">{stg.name}</div>
                <div className="text-[10px] text-slate-400 font-medium">{stg.count} Deals</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4 Pipeline Columns matching Image 3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stages.map((stage) => (
          <div key={stage.id} className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200 space-y-4">
            
            {/* Column Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                {stage.name}
              </div>
              <span className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 font-bold text-[11px] font-mono">
                {stage.count}
              </span>
            </div>

            {/* Deal Cards */}
            <div className="space-y-4">
              {stage.deals.map((deal) => (
                <div
                  key={deal.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-md transition-all overflow-hidden cursor-pointer group"
                >
                  {/* Photo Preview matching Image 3 */}
                  <div className="relative aspect-16/10 bg-slate-900 overflow-hidden">
                    <img
                      src={deal.image}
                      alt={deal.propertyTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-slate-950/80 text-white text-[10px] font-bold">
                      {stage.name}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-3.5 space-y-2">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {deal.propertyTitle}
                    </div>
                    
                    <div className="text-sm font-black text-emerald-600 font-mono">
                      {deal.price}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Client: {deal.clientName}</span>
                      <span className="font-semibold text-blue-600">Active</span>
                    </div>

                    <button className="w-full mt-2 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[11px] font-bold transition-colors">
                      View Deal Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

