import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  Calendar, 
  TrendingUp, 
  ArrowUpRight, 
  Building, 
  DollarSign, 
  PieChart as PieIcon,
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'quarterly' | 'annual'>('monthly');

  const monthlyBreakdown = [
    { month: 'Jan', revenue: 4200000, expenses: 850000, net: 3350000 },
    { month: 'Feb', revenue: 4500000, expenses: 900000, net: 3600000 },
    { month: 'Mar', revenue: 4900000, expenses: 920000, net: 3980000 },
    { month: 'Apr', revenue: 5300000, expenses: 1100000, net: 4200000 },
    { month: 'May', revenue: 5800000, expenses: 950000, net: 4850000 },
    { month: 'Jun', revenue: 6400000, expenses: 1050000, net: 5350000 },
  ];

  const occupancyStats = [
    { type: 'Luxury Residential Villas', count: 18, occupied: 17, rate: 94.4 },
    { type: 'Commercial Office Floors', count: 12, occupied: 11, rate: 91.6 },
    { type: 'Premium Apartments', count: 32, occupied: 31, rate: 96.8 },
    { type: 'Retail & Penthouse Suites', count: 8, occupied: 8, rate: 100.0 }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-[#101B35] tracking-tight">Portfolio Financial Reports & Analytics</h1>
          <p className="text-xs text-slate-500 mt-1">
            Cashflow statements, asset appreciation metrics, occupancy distribution, and tax summaries.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white rounded-xl border border-slate-200 p-1">
            {(['monthly', 'quarterly', 'annual'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-colors cursor-pointer ${
                  selectedPeriod === period
                    ? 'bg-[#101B35] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {period}
              </button>
            ))}
          </div>

          <button className="flex items-center gap-1.5 px-4 py-2 bg-[#10B981] hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer">
            <Download className="w-3.5 h-3.5" />
            <span>Generate Executive PDF</span>
          </button>
        </div>
      </div>

      {/* Top Level Financial Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Gross Rental Inflows</div>
          <div className="text-2xl font-black text-[#101B35] mt-1">PKR 31,100,000</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% YoY Growth</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Operational Overheads</div>
          <div className="text-2xl font-black text-slate-800 mt-1">PKR 5,770,000</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Maintenance, insurance, management fees (18.5%)
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Net Operating Income (NOI)</div>
          <div className="text-2xl font-black text-[#10B981] mt-1">PKR 25,330,000</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            81.5% Profit Margin
          </div>
        </div>
      </div>

      {/* Revenue Breakdown Chart Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#101B35]">Monthly Revenue vs Operational Expenses (PKR)</h2>
          <span className="text-xs text-slate-400 font-mono">H1 2025 Audit</span>
        </div>

        {/* Visual Bar representation */}
        <div className="space-y-4 pt-2">
          {monthlyBreakdown.map((item) => {
            const maxVal = 7000000;
            const revPercent = (item.revenue / maxVal) * 100;
            const expPercent = (item.expenses / maxVal) * 100;
            return (
              <div key={item.month} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-800 w-12">{item.month}</span>
                  <div className="flex items-center gap-4 text-[11px]">
                    <span className="text-[#10B981]">Rev: PKR {(item.revenue / 1000000).toFixed(2)}M</span>
                    <span className="text-slate-400">Exp: PKR {(item.expenses / 1000000).toFixed(2)}M</span>
                    <span className="font-bold text-[#101B35]">NOI: PKR {(item.net / 1000000).toFixed(2)}M</span>
                  </div>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
                  <div 
                    style={{ width: `${revPercent}%` }} 
                    className="bg-[#10B981] rounded-l-full transition-all duration-500"
                    title={`Revenue: PKR ${item.revenue}`}
                  />
                  <div 
                    style={{ width: `${expPercent}%` }} 
                    className="bg-amber-400 transition-all duration-500"
                    title={`Expenses: PKR ${item.expenses}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Occupancy and Asset Class Performance */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <h2 className="text-sm font-bold text-[#101B35]">Occupancy Breakdown by Asset Class</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {occupancyStats.map((stat, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="text-xs font-bold text-slate-800 truncate">{stat.type}</div>
              <div className="text-xl font-black text-[#101B35] mt-2">{stat.rate}%</div>
              <div className="text-[11px] text-slate-500 mt-1">
                {stat.occupied} of {stat.count} units leased
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div 
                  style={{ width: `${stat.rate}%` }} 
                  className="bg-[#10B981] h-full rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

