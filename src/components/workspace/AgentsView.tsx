import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { 
  UserPlus, 
  Users, 
  Mail, 
  Phone, 
  ShieldCheck, 
  UserCheck, 
  Check, 
  X, 
  ToggleLeft, 
  ToggleRight 
} from 'lucide-react';

export const AgentsView: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [agentList, setAgentList] = useState<(User & { active_leads_count?: number; open_deals_count?: number })[]>([]);
  const [loading, setLoading] = useState(true);

  // Invite modal
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'agency_admin' | 'agent'>('agent');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.getUsers();
      setAgentList(res.users);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleActive = async (targetUser: User) => {
    try {
      await api.updateUser(targetUser.id, { is_active: !targetUser.is_active });
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await api.inviteUser({
        full_name: fullName,
        email,
        phone,
        role,
      });
      setIsInviteOpen(false);
      setFullName('');
      setEmail('');
      setPhone('');
      fetchUsers();
    } catch (err: any) {
      setError(err.message || 'Failed to create user account');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-slate-200">
        <h3 className="text-base font-bold text-slate-800">Restricted Access</h3>
        <p className="text-xs text-slate-500 mt-1">
          Only Agency Administrators can access the agent directory and team roster.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Agent Directory &amp; Roster</h1>
          <p className="text-xs text-slate-500">Manage real estate consultants, team assignments, and workload capacities.</p>
        </div>

        <button
          onClick={() => setIsInviteOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Consultant</span>
        </button>
      </div>

      {/* Agents Roster Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agentList.map((agent) => (
          <div
            key={agent.id}
            className={`bg-white rounded-2xl border p-5 shadow-2xs space-y-4 flex flex-col justify-between transition-all ${
              agent.is_active ? 'border-slate-200' : 'border-slate-200 opacity-60 bg-slate-50/50'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-900 text-white font-bold text-sm flex items-center justify-center ring-2 ring-emerald-500/20">
                    {agent.full_name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{agent.full_name}</h3>
                    <div className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded inline-block mt-0.5 capitalize">
                      {agent.role.replace('_', ' ')}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleActive(agent)}
                  className={`p-1 rounded-md cursor-pointer ${
                    agent.is_active ? 'text-emerald-600 hover:bg-emerald-50' : 'text-slate-400 hover:bg-slate-100'
                  }`}
                  title={agent.is_active ? 'Deactivate Account' : 'Activate Account'}
                >
                  {agent.is_active ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                </button>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{agent.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{agent.phone}</span>
                </div>
              </div>
            </div>

            {/* Workload Stats */}
            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2 bg-slate-50 rounded-xl">
                <div className="text-[10px] text-slate-500">Active Leads</div>
                <div className="text-sm font-bold font-mono text-slate-800">{agent.active_leads_count ?? 0}</div>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl">
                <div className="text-[10px] text-slate-500">Open Deals</div>
                <div className="text-sm font-bold font-mono text-emerald-600">{agent.open_deals_count ?? 0}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Invite Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Add Team Member</h3>
              <button onClick={() => setIsInviteOpen(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-3">
              {error && (
                <div className="p-3 text-red-700 bg-red-50 rounded-xl border border-red-200">
                  {error}
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zeeshan Ali"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Work Email *</label>
                <input
                  type="email"
                  required
                  placeholder="zeeshan@aqarflow.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+92 300 1234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Access Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                >
                  <option value="agent">Agent (Assigned Leads Only)</option>
                  <option value="agency_admin">Agency Admin (Full Authority)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
