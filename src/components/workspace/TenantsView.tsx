import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  Building, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileText,
  DollarSign,
  ChevronRight,
  Filter
} from 'lucide-react';

interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  property: string;
  unit: string;
  leaseStart: string;
  leaseEnd: string;
  monthlyRent: number;
  status: 'active' | 'pending_renewal' | 'notice_given';
  paymentStatus: 'paid' | 'pending' | 'overdue';
}

const INITIAL_TENANTS: Tenant[] = [
  {
    id: 't-1',
    name: 'Ahmed Tariq',
    email: 'ahmed.tariq@gmail.com',
    phone: '+92 300 1234567',
    property: 'Gulberg Heights Luxury Suite',
    unit: 'Unit 402',
    leaseStart: '2025-06-01',
    leaseEnd: '2026-05-31',
    monthlyRent: 145000,
    status: 'active',
    paymentStatus: 'paid'
  },
  {
    id: 't-2',
    name: 'Zainab Mustafa',
    email: 'zainab.m@gmail.com',
    phone: '+92 321 9876543',
    property: 'DHA Phase 6 Executive Villa',
    unit: 'Villa 12-B',
    leaseStart: '2025-01-15',
    leaseEnd: '2026-01-14',
    monthlyRent: 280000,
    status: 'pending_renewal',
    paymentStatus: 'paid'
  },
  {
    id: 't-3',
    name: 'Hamza Farooq',
    email: 'hamza.f@gmail.com',
    phone: '+92 333 4567890',
    property: 'Bahria Town Signature Office',
    unit: 'Floor 3',
    leaseStart: '2025-09-01',
    leaseEnd: '2026-08-31',
    monthlyRent: 195000,
    status: 'active',
    paymentStatus: 'pending'
  },
  {
    id: 't-4',
    name: 'Fatima Noor',
    email: 'fatima.noor@outlook.com',
    phone: '+92 312 6543210',
    property: 'F-7 Diplomatic Enclave Residence',
    unit: 'Apt 201',
    leaseStart: '2024-11-01',
    leaseEnd: '2025-10-31',
    monthlyRent: 220000,
    status: 'active',
    paymentStatus: 'overdue'
  },
  {
    id: 't-5',
    name: 'Usman Ali',
    email: 'usman.ali@gmail.com',
    phone: '+92 345 1122334',
    property: 'Clifton Beachside Penthouse',
    unit: 'PH-1',
    leaseStart: '2025-03-01',
    leaseEnd: '2026-02-28',
    monthlyRent: 350000,
    status: 'active',
    paymentStatus: 'paid'
  }
];

export const TenantsView: React.FC = () => {
  const [tenants, setTenants] = useState<Tenant[]>(INITIAL_TENANTS);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newTenant, setNewTenant] = useState({
    name: '',
    email: '',
    phone: '',
    property: 'Gulberg Heights Luxury Suite',
    unit: '',
    monthlyRent: 120000,
    leaseStart: new Date().toISOString().split('T')[0],
    leaseEnd: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
  });

  const filteredTenants = tenants.filter((t) => {
    const matchesSearch = 
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase()) ||
      t.property.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTenant.name || !newTenant.email) return;

    const created: Tenant = {
      id: `t-${Date.now()}`,
      name: newTenant.name,
      email: newTenant.email,
      phone: newTenant.phone,
      property: newTenant.property,
      unit: newTenant.unit || 'Unit 101',
      leaseStart: newTenant.leaseStart,
      leaseEnd: newTenant.leaseEnd,
      monthlyRent: Number(newTenant.monthlyRent),
      status: 'active',
      paymentStatus: 'paid'
    };

    setTenants([created, ...tenants]);
    setIsAddModalOpen(false);
    setNewTenant({
      name: '',
      email: '',
      phone: '',
      property: 'Gulberg Heights Luxury Suite',
      unit: '',
      monthlyRent: 120000,
      leaseStart: new Date().toISOString().split('T')[0],
      leaseEnd: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-[#101B35] tracking-tight">Tenants Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track active lease agreements, recurring rent schedules, and tenant profiles.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#10B981] hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Tenant</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Tenants</div>
          <div className="text-2xl font-black text-[#101B35] mt-1">
            {tenants.filter(t => t.status === 'active').length}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>98% Occupancy rate</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Monthly Recurring Rent</div>
          <div className="text-2xl font-black text-[#101B35] mt-1">
            PKR {(tenants.reduce((sum, t) => sum + t.monthlyRent, 0) / 1000).toLocaleString()}k
          </div>
          <div className="text-[11px] text-blue-600 font-semibold mt-1">
            Collected by 5th of month
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending Payments</div>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {tenants.filter(t => t.paymentStatus === 'pending').length}
          </div>
          <div className="text-[11px] text-amber-600 font-semibold mt-1">
            Due in next 48 hours
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Overdue Notices</div>
          <div className="text-2xl font-black text-red-600 mt-1">
            {tenants.filter(t => t.paymentStatus === 'overdue').length}
          </div>
          <div className="text-[11px] text-red-500 font-semibold mt-1">
            Automated SMS reminder dispatched
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by tenant name, email, or property..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:border-[#10B981]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['all', 'active', 'pending_renewal'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-colors cursor-pointer ${
                filterStatus === st
                  ? 'bg-[#101B35] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Tenants Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Tenant Name</th>
                <th className="py-3.5 px-4">Property & Unit</th>
                <th className="py-3.5 px-4">Lease Duration</th>
                <th className="py-3.5 px-4">Monthly Rent</th>
                <th className="py-3.5 px-4">Payment Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTenants.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#101B35]">{tenant.name}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{tenant.email}</span>
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{tenant.phone}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{tenant.property}</div>
                    <div className="text-[11px] text-slate-500">{tenant.unit}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-700">{tenant.leaseStart} to {tenant.leaseEnd}</div>
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 capitalize">
                      {tenant.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#101B35]">
                    PKR {tenant.monthlyRent.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      tenant.paymentStatus === 'paid'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : tenant.paymentStatus === 'pending'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {tenant.paymentStatus === 'paid' && <CheckCircle2 className="w-3 h-3" />}
                      {tenant.paymentStatus === 'pending' && <Clock className="w-3 h-3" />}
                      {tenant.paymentStatus === 'overdue' && <AlertCircle className="w-3 h-3" />}
                      <span className="capitalize">{tenant.paymentStatus}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors">
                      View Lease
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Tenant Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h2 className="text-xl font-black text-[#101B35] tracking-tight">Onboard New Tenant</h2>
            <p className="text-xs text-slate-500 mt-1">Register tenant credentials and generate digital lease contract.</p>

            <form onSubmit={handleAddTenant} className="space-y-4 mt-5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tariq Mahmood"
                  value={newTenant.name}
                  onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#10B981]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="tariq@gmail.com"
                    value={newTenant.email}
                    onChange={(e) => setNewTenant({ ...newTenant, email: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#10B981]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+92 300 0000000"
                    value={newTenant.phone}
                    onChange={(e) => setNewTenant({ ...newTenant, phone: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#10B981]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assigned Property</label>
                  <input
                    type="text"
                    required
                    value={newTenant.property}
                    onChange={(e) => setNewTenant({ ...newTenant, property: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#10B981]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Unit / Apt #</label>
                  <input
                    type="text"
                    placeholder="Suite 502"
                    value={newTenant.unit}
                    onChange={(e) => setNewTenant({ ...newTenant, unit: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#10B981]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Monthly Rent (PKR)</label>
                <input
                  type="number"
                  required
                  value={newTenant.monthlyRent}
                  onChange={(e) => setNewTenant({ ...newTenant, monthlyRent: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#10B981]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#10B981] hover:bg-emerald-600 text-white font-bold rounded-xl cursor-pointer shadow-xs"
                >
                  Confirm & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

