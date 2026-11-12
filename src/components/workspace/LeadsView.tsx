import React, { useState, useEffect } from 'react';
import { Lead, LeadStage, User, Property } from '../../types';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { formatPKR } from '../../lib/utils';
import { 
  Users, 
  Search, 
  Plus, 
  Kanban, 
  Table as TableIcon, 
  Phone, 
  Mail, 
  MessageSquare, 
  Calendar, 
  UserPlus, 
  FileText, 
  ChevronRight, 
  X,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';

const STAGES: { id: LeadStage; label: string; color: string }[] = [
  { id: 'new', label: 'New Inquiries', color: 'bg-blue-500' },
  { id: 'contacted', label: 'Contacted', color: 'bg-amber-500' },
  { id: 'qualified', label: 'Qualified', color: 'bg-indigo-500' },
  { id: 'visit_scheduled', label: 'Visit Scheduled', color: 'bg-purple-500' },
  { id: 'negotiation', label: 'Negotiation', color: 'bg-orange-500' },
  { id: 'converted', label: 'Converted', color: 'bg-emerald-500' },
  { id: 'lost', label: 'Lost', color: 'bg-slate-400' },
];

export const LeadsView: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [agents, setAgents] = useState<User[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [search, setSearch] = useState('');
  const [selectedAgentFilter, setSelectedAgentFilter] = useState('all');

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [noteText, setNoteText] = useState('');
  const [assignAgentId, setAssignAgentId] = useState('');

  const [newLeadData, setNewLeadData] = useState<Partial<Lead>>({
    customer_name: '',
    phone: '',
    email: '',
    preferred_contact_method: 'phone',
    inquiry_purpose: 'buy',
    budget: 45000000,
    preferred_location: 'Islamabad',
    lead_source: 'walk_in',
    stage: 'new',
    notes: '',
  });

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await api.getLeads({
        search: search.trim() || undefined,
        assigned_agent: selectedAgentFilter !== 'all' ? selectedAgentFilter : undefined,
      });
      setLeads(res.leads);

      if (isAdmin) {
        const usersRes = await api.getUsers();
        setAgents(usersRes.users);
      }
      const propsRes = await api.getProperties();
      setProperties(propsRes.properties);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [selectedAgentFilter, user]);

  const handleStageChange = async (leadId: string, newStage: LeadStage) => {
    try {
      await api.updateLead(leadId, { stage: newStage });
      fetchLeads();
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead({ ...selectedLead, stage: newStage });
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAssignAgent = async () => {
    if (!selectedLead || !assignAgentId) return;
    try {
      await api.assignLead(selectedLead.id, assignAgentId);
      const assigned = agents.find((a) => a.id === assignAgentId);
      setSelectedLead({ ...selectedLead, assigned_agent_id: assignAgentId, assigned_agent: assigned });
      fetchLeads();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !noteText.trim()) return;
    const combinedNotes = selectedLead.notes
      ? `${selectedLead.notes}\n[${new Date().toLocaleDateString()}] ${noteText.trim()}`
      : `[${new Date().toLocaleDateString()}] ${noteText.trim()}`;

    try {
      await api.updateLead(selectedLead.id, { notes: combinedNotes });
      setSelectedLead({ ...selectedLead, notes: combinedNotes });
      setNoteText('');
      fetchLeads();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createLead(newLeadData);
      setIsCreateOpen(false);
      fetchLeads();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Lead Management CRM</h1>
          <p className="text-xs text-slate-500">
            {isAdmin ? 'Complete agency lead pipeline and agent routing.' : 'Your assigned leads and client follow-ups.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-2xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                viewMode === 'kanban' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Pipeline</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                viewMode === 'table' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search lead name, phone, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchLeads()}
            className="w-full py-1 text-xs focus:outline-hidden"
          />
        </div>

        {isAdmin && (
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Agent:</span>
            <select
              value={selectedAgentFilter}
              onChange={(e) => setSelectedAgentFilter(e.target.value)}
              className="py-1 px-2 border border-slate-200 rounded-lg bg-white text-slate-700"
            >
              <option value="all">All Agents</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>{a.full_name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' && (
        <div className="flex gap-4 overflow-x-auto pb-6 items-start">
          {STAGES.map((col) => {
            const colLeads = leads.filter((l) => l.stage === col.id);
            return (
              <div
                key={col.id}
                className="w-72 shrink-0 bg-slate-100/70 rounded-2xl p-3 border border-slate-200/80 flex flex-col max-h-[75vh]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                    <h3 className="text-xs font-bold text-slate-800">{col.label}</h3>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md shadow-2xs">
                    {colLeads.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="space-y-2.5 overflow-y-auto flex-1 pr-1">
                  {colLeads.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className="p-3.5 bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                          {lead.customer_name}
                        </h4>
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded capitalize">
                          {lead.inquiry_purpose}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-500 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{lead.phone}</span>
                        </div>
                        {lead.budget && (
                          <div className="font-mono font-semibold text-slate-700">
                            Budget: {formatPKR(lead.budget)}
                          </div>
                        )}
                        {lead.related_property && (
                          <div className="text-[10px] text-blue-600 truncate font-mono">
                            Ref: {lead.related_property.reference_code}
                          </div>
                        )}
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                        <span className="text-slate-400 truncate max-w-[120px]">
                          {lead.assigned_agent ? lead.assigned_agent.full_name : 'Unassigned'}
                        </span>
                        <span className="text-emerald-600 font-medium">Details &rarr;</span>
                      </div>
                    </div>
                  ))}
                  {colLeads.length === 0 && (
                    <div className="py-6 text-center text-[11px] text-slate-400">
                      No leads in this stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Purpose &amp; Budget</th>
                  <th className="py-3 px-4">Related Listing</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4">Assigned Agent</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{l.customer_name}</td>
                    <td className="py-3 px-4 text-slate-600">
                      <div>{l.phone}</div>
                      <div className="text-[10px] text-slate-400">{l.email || 'No email provided'}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="capitalize font-medium text-slate-800">{l.inquiry_purpose}</span>
                      {l.budget && (
                        <div className="text-[10px] font-mono text-emerald-600 font-bold">{formatPKR(l.budget)}</div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {l.related_property ? (
                        <span className="font-mono text-blue-600">{l.related_property.reference_code}</span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">General Inquiry</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={l.stage}
                        onChange={(e) => handleStageChange(l.id, e.target.value as LeadStage)}
                        className="py-1 px-2 border border-slate-200 rounded-md bg-white text-xs font-semibold capitalize"
                      >
                        {STAGES.map((s) => (
                          <option key={s.id} value={s.id}>{s.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {l.assigned_agent?.full_name || <span className="text-slate-400 italic">Unassigned</span>}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedLead(l)}
                        className="text-xs font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                      >
                        View &rarr;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Lead Detail & Timeline Drawer Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col p-6 space-y-6 overflow-y-auto animate-in slide-in-from-right duration-200 text-xs">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                  Lead Profile
                </span>
                <h3 className="text-base font-bold text-slate-900">{selectedLead.customer_name}</h3>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions & Stage Transition */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Lead Pipeline Stage</label>
              <div className="grid grid-cols-2 gap-1.5">
                {STAGES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleStageChange(selectedLead.id, s.id)}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                      selectedLead.stage === s.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>{s.label}</span>
                    {selectedLead.stage === s.id && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Assign Agent Section (Admin Only) */}
            {isAdmin && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Assigned Agent</span>
                  <span className="text-slate-500 font-medium">
                    {selectedLead.assigned_agent?.full_name || 'None'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <select
                    value={assignAgentId}
                    onChange={(e) => setAssignAgentId(e.target.value)}
                    className="flex-1 px-2 py-1.5 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="">Select Agent to Reassign...</option>
                    {agents.map((a) => (
                      <option key={a.id} value={a.id}>{a.full_name}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleAssignAgent}
                    disabled={!assignAgentId}
                    className="px-3 py-1.5 bg-slate-900 text-white font-semibold rounded-lg disabled:opacity-40 cursor-pointer"
                  >
                    Assign
                  </button>
                </div>
              </div>
            )}

            {/* Contact Details */}
            <div className="space-y-2">
              <div className="font-semibold text-slate-800">Contact &amp; Inquiry Specs</div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-slate-600">
                <div>Phone: <strong className="text-slate-900">{selectedLead.phone}</strong></div>
                <div>Email: <strong className="text-slate-900">{selectedLead.email || 'N/A'}</strong></div>
                <div>Channel: <strong className="text-slate-900 capitalize">{selectedLead.preferred_contact_method}</strong></div>
                <div>Source: <strong className="text-slate-900 capitalize">{selectedLead.lead_source.replace('_', ' ')}</strong></div>
                {selectedLead.budget && (
                  <div>Budget: <strong className="text-emerald-700 font-mono font-bold">{formatPKR(selectedLead.budget)}</strong></div>
                )}
                {selectedLead.related_property && (
                  <div>Listing: <strong className="text-blue-600 font-mono">{selectedLead.related_property.reference_code} - {selectedLead.related_property.title}</strong></div>
                )}
              </div>
            </div>

            {/* Notes & Follow-Up Log */}
            <div className="space-y-3 flex-1">
              <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Notes &amp; Activity Log</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 max-h-40 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                {selectedLead.notes || 'No notes added yet.'}
              </div>

              <form onSubmit={handleAddNote} className="space-y-2 pt-2">
                <textarea
                  rows={2}
                  placeholder="Add a new consultation or call note..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl resize-none focus:outline-hidden focus:border-emerald-500"
                />
                <button
                  type="submit"
                  disabled={!noteText.trim()}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl disabled:opacity-40 cursor-pointer"
                >
                  Save Note to CRM
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Lead Manually Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Create New Lead</h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={newLeadData.customer_name}
                    onChange={(e) => setNewLeadData({ ...newLeadData, customer_name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={newLeadData.phone}
                    onChange={(e) => setNewLeadData({ ...newLeadData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Purpose</label>
                  <select
                    value={newLeadData.inquiry_purpose}
                    onChange={(e) => setNewLeadData({ ...newLeadData, inquiry_purpose: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="buy">Buy</option>
                    <option value="rent">Rent</option>
                    <option value="invest">Invest</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Budget (PKR)</label>
                  <input
                    type="number"
                    value={newLeadData.budget}
                    onChange={(e) => setNewLeadData({ ...newLeadData, budget: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Initial Notes</label>
                <textarea
                  rows={2}
                  value={newLeadData.notes}
                  onChange={(e) => setNewLeadData({ ...newLeadData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl cursor-pointer"
                >
                  Create Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
