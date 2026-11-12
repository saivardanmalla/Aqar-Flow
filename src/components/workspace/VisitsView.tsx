import React, { useState, useEffect } from 'react';
import { Visit, VisitStatus, Property, Lead, User } from '../../types';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User as UserIcon, 
  Plus, 
  AlertTriangle, 
  CheckCircle, 
  X, 
  Building, 
  Check, 
  XCircle,
  FileText
} from 'lucide-react';

export const VisitsView: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [agents, setAgents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Scheduling Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const [selectedLeadId, setSelectedLeadId] = useState('');
  const [assignedAgentId, setAssignedAgentId] = useState('');
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('11:00');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [meetingLocation, setMeetingLocation] = useState('');
  const [visitorCount, setVisitorCount] = useState(2);
  const [notes, setNotes] = useState('');
  
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Outcome modal
  const [activeVisitForOutcome, setActiveVisitForOutcome] = useState<Visit | null>(null);
  const [outcomeNotes, setOutcomeNotes] = useState('');

  const fetchVisitsData = async () => {
    setLoading(true);
    try {
      const res = await api.getVisits();
      setVisits(res.visits);

      const propsRes = await api.getProperties();
      setProperties(propsRes.properties);

      const leadsRes = await api.getLeads();
      setLeads(leadsRes.leads);

      if (isAdmin) {
        const usersRes = await api.getUsers();
        setAgents(usersRes.users);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitsData();
  }, [user]);

  // Client-side instant conflict warning preview before submitting
  useEffect(() => {
    if (!visitDate || !startTime) {
      setConflictWarning(null);
      return;
    }
    const targetAgentId = user?.role === 'agent' ? user.id : (assignedAgentId || user?.id);
    const [newH, newM] = startTime.split(':').map(Number);
    const newStart = newH * 60 + newM;
    const newEnd = newStart + durationMinutes;

    const existingConflict = visits.find((v) => {
      if (v.assigned_agent_id !== targetAgentId) return false;
      if (v.visit_date !== visitDate) return false;
      if (v.status === 'cancelled') return false;

      const [vH, vM] = v.start_time.split(':').map(Number);
      const vStart = vH * 60 + vM;
      const vEnd = vStart + (v.duration_minutes || 45);

      return newStart < vEnd && newEnd > vStart;
    });

    if (existingConflict) {
      setConflictWarning(
        `Agent already has a confirmed visit on ${visitDate} at ${existingConflict.start_time} (${existingConflict.duration_minutes}m). Backend will reject this overlapping slot.`
      );
    } else {
      setConflictWarning(null);
    }
  }, [visitDate, startTime, durationMinutes, assignedAgentId, visits, user]);

  const handleOpenSchedule = () => {
    setSelectedPropertyId(properties[0]?.id || '');
    setSelectedLeadId(leads[0]?.id || '');
    setAssignedAgentId(user?.id || '');
    setMeetingLocation(properties[0]?.locality ? `${properties[0].locality}, ${properties[0].city}` : 'Property Site Reception');
    setConflictWarning(null);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    try {
      await api.scheduleVisit({
        property_id: selectedPropertyId,
        lead_id: selectedLeadId,
        assigned_agent_id: assignedAgentId || user?.id,
        visit_date: visitDate,
        start_time: startTime,
        duration_minutes: durationMinutes,
        meeting_location: meetingLocation,
        visitor_count: visitorCount,
        notes,
      });

      setIsModalOpen(false);
      fetchVisitsData();
    } catch (err: any) {
      setFormError(err.message || 'Failed to schedule visit');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (visitId: string, newStatus: VisitStatus) => {
    try {
      await api.updateVisit(visitId, { status: newStatus });
      fetchVisitsData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSaveOutcome = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeVisitForOutcome) return;

    try {
      await api.updateVisit(activeVisitForOutcome.id, {
        status: 'completed',
        outcome_notes: outcomeNotes,
      });
      setActiveVisitForOutcome(null);
      setOutcomeNotes('');
      fetchVisitsData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Property Visit Scheduling</h1>
          <p className="text-xs text-slate-500">Coordinate client on-site property viewings and avoid overlapping agent bookings.</p>
        </div>

        <button
          onClick={handleOpenSchedule}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Visit</span>
        </button>
      </div>

      {/* Visits List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Date &amp; Time</th>
                <th className="py-3 px-4">Property &amp; Location</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Assigned Agent</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">Loading scheduled visits...</td>
                </tr>
              ) : visits.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">No visits scheduled.</td>
                </tr>
              ) : (
                visits.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{v.visit_date}</div>
                      <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-emerald-600" />
                        <span>{v.start_time} ({v.duration_minutes}m)</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800 line-clamp-1">
                        {v.property ? `${v.property.reference_code} - ${v.property.title}` : 'Property'}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{v.meeting_location}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{v.lead?.customer_name || 'Client'}</div>
                      <div className="text-[11px] text-slate-500">{v.lead?.phone}</div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700">
                      {v.assigned_agent?.full_name || 'Consultant'}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        v.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                        v.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        v.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {v.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {v.status === 'confirmed' && (
                          <button
                            onClick={() => {
                              setActiveVisitForOutcome(v);
                              setOutcomeNotes(v.outcome_notes || '');
                            }}
                            className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-[11px] font-semibold cursor-pointer"
                          >
                            Complete
                          </button>
                        )}
                        {v.status !== 'cancelled' && v.status !== 'completed' && (
                          <button
                            onClick={() => handleStatusUpdate(v.id, 'cancelled')}
                            className="px-2 py-1 text-slate-400 hover:text-red-600 rounded text-[11px] cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule Visit Modal with Conflict Checking */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
                  Calendar Coordination
                </span>
                <h3 className="text-sm font-bold text-slate-900">Schedule Property Viewing</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-3.5">
              {conflictWarning && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block">Scheduling Conflict Detected</strong>
                    <span>{conflictWarning}</span>
                  </div>
                </div>
              )}

              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700">
                  {formError}
                </div>
              )}

              {/* Property Selection */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Property *</label>
                <select
                  required
                  value={selectedPropertyId}
                  onChange={(e) => {
                    setSelectedPropertyId(e.target.value);
                    const p = properties.find((item) => item.id === e.target.value);
                    if (p) setMeetingLocation(`${p.locality || p.address}, ${p.city}`);
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                >
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.reference_code} — {p.title} ({p.city})
                    </option>
                  ))}
                </select>
              </div>

              {/* Lead Selection */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Customer / Lead *</label>
                <select
                  required
                  value={selectedLeadId}
                  onChange={(e) => setSelectedLeadId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                >
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.customer_name} ({l.phone})
                    </option>
                  ))}
                </select>
              </div>

              {/* Agent (if Admin) */}
              {isAdmin && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assign Agent *</label>
                  <select
                    value={assignedAgentId}
                    onChange={(e) => setAssignedAgentId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                  >
                    {agents.map((a) => (
                      <option key={a.id} value={a.id}>{a.full_name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Date & Time */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Time *</label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duration (Min)</label>
                  <select
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value={30}>30 mins</option>
                    <option value={45}>45 mins</option>
                    <option value={60}>60 mins</option>
                    <option value={90}>90 mins</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Meeting Location</label>
                <input
                  type="text"
                  value={meetingLocation}
                  onChange={(e) => setMeetingLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Internal Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl resize-none"
                  placeholder="Visitor interests, gate security access details, etc."
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Validating...' : 'Confirm Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Outcome Modal */}
      {activeVisitForOutcome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Record Visit Outcome</h3>
              <button onClick={() => setActiveVisitForOutcome(null)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOutcome} className="space-y-3">
              <p className="text-slate-600">
                Marking visit for <strong>{activeVisitForOutcome.property?.reference_code}</strong> with{' '}
                <strong>{activeVisitForOutcome.lead?.customer_name}</strong> as completed.
              </p>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Outcome &amp; Client Feedback</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Client loved the terrace layout, considering making an offer within 3 days..."
                  value={outcomeNotes}
                  onChange={(e) => setOutcomeNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl resize-none focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveVisitForOutcome(null)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs cursor-pointer"
                >
                  Save &amp; Complete Visit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
