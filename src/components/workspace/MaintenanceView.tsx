import React, { useState } from 'react';
import { 
  Wrench, 
  Search, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Building,
  User,
  Calendar,
  Filter
} from 'lucide-react';

interface MaintenanceTicket {
  id: string;
  ticketNumber: string;
  title: string;
  category: 'Plumbing' | 'Electrical' | 'HVAC' | 'Structural' | 'Carpentry';
  property: string;
  unit: string;
  tenantName: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  reportedDate: string;
  assignedContractor?: string;
  estimatedCost?: number;
}

const INITIAL_TICKETS: MaintenanceTicket[] = [
  {
    id: 'm-1',
    ticketNumber: 'MNT-8901',
    title: 'Central AC Cooling Sensor Malfunction',
    category: 'HVAC',
    property: 'Gulberg Heights Luxury Suite',
    unit: 'Unit 402',
    tenantName: 'Ahmed Tariq',
    priority: 'urgent',
    status: 'in_progress',
    reportedDate: '2025-06-03',
    assignedContractor: 'Alpha Cool Air Systems',
    estimatedCost: 28000
  },
  {
    id: 'm-2',
    ticketNumber: 'MNT-8902',
    title: 'Master Bathroom Drain Leakage',
    category: 'Plumbing',
    property: 'DHA Phase 6 Executive Villa',
    unit: 'Villa 12-B',
    tenantName: 'Zainab Mustafa',
    priority: 'high',
    status: 'open',
    reportedDate: '2025-06-04',
    assignedContractor: 'Premier Plumbers Co.',
    estimatedCost: 15000
  },
  {
    id: 'm-3',
    ticketNumber: 'MNT-8903',
    title: 'Main Circuit Breaker Tripping',
    category: 'Electrical',
    property: 'Bahria Town Signature Office',
    unit: 'Floor 3',
    tenantName: 'Hamza Farooq',
    priority: 'high',
    status: 'completed',
    reportedDate: '2025-05-28',
    assignedContractor: 'PowerVolt Electrics',
    estimatedCost: 35000
  },
  {
    id: 'm-4',
    ticketNumber: 'MNT-8904',
    title: 'Kitchen Cabinet Hinge Alignment',
    category: 'Carpentry',
    property: 'F-7 Diplomatic Enclave Residence',
    unit: 'Apt 201',
    tenantName: 'Fatima Noor',
    priority: 'low',
    status: 'open',
    reportedDate: '2025-06-05',
    estimatedCost: 8000
  }
];

export const MaintenanceView: React.FC = () => {
  const [tickets, setTickets] = useState<MaintenanceTicket[]>(INITIAL_TICKETS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newTicket, setNewTicket] = useState({
    title: '',
    category: 'HVAC' as const,
    property: 'Gulberg Heights Luxury Suite',
    unit: 'Unit 402',
    tenantName: 'Ahmed Tariq',
    priority: 'medium' as const,
    estimatedCost: 10000
  });

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch = 
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.property.toLowerCase().includes(search.toLowerCase()) ||
      t.ticketNumber.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicket.title) return;

    const created: MaintenanceTicket = {
      id: `m-${Date.now()}`,
      ticketNumber: `MNT-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newTicket.title,
      category: newTicket.category,
      property: newTicket.property,
      unit: newTicket.unit,
      tenantName: newTicket.tenantName,
      priority: newTicket.priority,
      status: 'open',
      reportedDate: new Date().toISOString().split('T')[0],
      estimatedCost: Number(newTicket.estimatedCost)
    };

    setTickets([created, ...tickets]);
    setIsModalOpen(false);
  };

  const handleToggleStatus = (id: string) => {
    setTickets(tickets.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'open' ? 'in_progress' : t.status === 'in_progress' ? 'completed' : 'open';
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-[#101B35] tracking-tight">Maintenance & Work Orders</h1>
          <p className="text-xs text-slate-500 mt-1">
            Dispatch technicians, track equipment servicing, and monitor resolution SLA times.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#10B981] hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Work Order</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Tickets</div>
          <div className="text-2xl font-black text-[#101B35] mt-1">{tickets.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">Active portfolio repairs</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Urgent / High Priority</div>
          <div className="text-2xl font-black text-red-600 mt-1">
            {tickets.filter(t => t.priority === 'urgent' || t.priority === 'high').length}
          </div>
          <div className="text-[11px] text-red-500 font-semibold mt-1">Immediate response required</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">In Progress</div>
          <div className="text-2xl font-black text-blue-600 mt-1">
            {tickets.filter(t => t.status === 'in_progress').length}
          </div>
          <div className="text-[11px] text-blue-500 font-semibold mt-1">Technicians dispatched</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Avg Resolution Time</div>
          <div className="text-2xl font-black text-[#10B981] mt-1">18 hrs</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">94% within SLA</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search work order number, title, property..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:border-[#10B981]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['all', 'open', 'in_progress', 'completed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#101B35] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Ticket Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTickets.map((ticket) => (
          <div 
            key={ticket.id} 
            className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between gap-4"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold text-slate-400">
                  {ticket.ticketNumber}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  ticket.priority === 'urgent'
                    ? 'bg-red-100 text-red-800 border border-red-200'
                    : ticket.priority === 'high'
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {ticket.priority} Priority
                </span>
              </div>

              <h3 className="text-sm font-bold text-[#101B35] mt-2">
                {ticket.title}
              </h3>

              <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>{ticket.property} ({ticket.unit})</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Tenant: {ticket.tenantName}</span>
                </div>
                {ticket.assignedContractor && (
                  <div className="flex items-center gap-2">
                    <Wrench className="w-3.5 h-3.5 text-blue-500" />
                    <span>Contractor: <strong className="text-slate-800">{ticket.assignedContractor}</strong></span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${
                ticket.status === 'completed'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : ticket.status === 'in_progress'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                {ticket.status === 'completed' && <CheckCircle2 className="w-3 h-3" />}
                {ticket.status === 'in_progress' && <Clock className="w-3 h-3" />}
                {ticket.status === 'open' && <AlertTriangle className="w-3 h-3" />}
                <span>{ticket.status.replace('_', ' ')}</span>
              </span>

              <button
                onClick={() => handleToggleStatus(ticket.id)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                Advance Status →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h2 className="text-xl font-black text-[#101B35] tracking-tight">Create Maintenance Work Order</h2>
            <p className="text-xs text-slate-500 mt-1">Specify issue details and technician priority SLA.</p>

            <form onSubmit={handleCreateTicket} className="space-y-4 mt-5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Issue Description / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Water heater pilot light replacement"
                  value={newTicket.title}
                  onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#10B981]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newTicket.category}
                    onChange={(e: any) => setNewTicket({ ...newTicket, category: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#10B981]"
                  >
                    <option value="HVAC">HVAC</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Carpentry">Carpentry</option>
                    <option value="Structural">Structural</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={newTicket.priority}
                    onChange={(e: any) => setNewTicket({ ...newTicket, priority: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#10B981]"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#10B981] hover:bg-emerald-600 text-white font-bold rounded-xl cursor-pointer shadow-xs"
                >
                  Dispatch Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

