import React, { useState, useEffect } from 'react';
import { Deal, DealStage, Property, Lead, User } from '../../types';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { formatPKR } from '../../lib/utils';
import { 
  Handshake, 
  Plus, 
  Search, 
  CheckCircle, 
  X, 
  FileCheck, 
  ArrowRight, 
  DollarSign, 
  Calendar,
  AlertCircle
} from 'lucide-react';

const DEAL_STAGES: { id: DealStage; label: string }[] = [
  { id: 'inquiry', label: 'Inquiry' },
  { id: 'qualified', label: 'Qualified' },
  { id: 'visit', label: 'Visit' },
  { id: 'offer', label: 'Offer' },
  { id: 'negotiation', label: 'Negotiation' },
  { id: 'booking', label: 'Booking' },
  { id: 'documentation', label: 'Documentation' },
  { id: 'closed_won', label: 'Closed Won' },
  { id: 'closed_lost', label: 'Closed Lost' },
];

export const DealsView: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dealData, setDealData] = useState<Partial<Deal>>({
    property_id: '',
    lead_id: '',
    offer_amount: 32000000,
    agreed_amount: 32000000,
    seller_contact_name: '',
    stage: 'offer',
    expected_closing_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    notes: '',
  });
  const [formError, setFormError] = useState<string | null>(null);

  const fetchDeals = async () => {
    setLoading(true);
    try {
      const res = await api.getDeals();
      setDeals(res.deals);

      const propsRes = await api.getProperties();
      setProperties(propsRes.properties);

      const leadsRes = await api.getLeads();
      setLeads(leadsRes.leads);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, [user]);

  const handleOpenCreate = () => {
    setDealData({
      property_id: properties[0]?.id || '',
      lead_id: leads[0]?.id || '',
      offer_amount: properties[0]?.price || 30000000,
      agreed_amount: properties[0]?.price || 30000000,
      seller_contact_name: 'Property Owner',
      stage: 'offer',
      expected_closing_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      notes: '',
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleCreateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    try {
      await api.createDeal(dealData);
      setIsModalOpen(false);
      fetchDeals();
    } catch (err: any) {
      setFormError(err.message || 'Failed to create deal');
    }
  };

  const handleStageUpdate = async (dealId: string, newStage: DealStage) => {
    try {
      await api.updateDeal(dealId, { stage: newStage });
      fetchDeals();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Sales &amp; Deal Management</h1>
          <p className="text-xs text-slate-500">Track offer submissions, price negotiations, token bookings, and legal transfers.</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Deal Record</span>
        </button>
      </div>

      {/* Deals Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Listing / Property</th>
                <th className="py-3 px-4">Buyer (Lead)</th>
                <th className="py-3 px-4 text-right">Offer Amount</th>
                <th className="py-3 px-4 text-right">Agreed Amount</th>
                <th className="py-3 px-4">Deal Stage</th>
                <th className="py-3 px-4">Closing Target</th>
                <th className="py-3 px-4">Agent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">Loading deal records...</td>
                </tr>
              ) : deals.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">No active deals found.</td>
                </tr>
              ) : (
                deals.map((deal) => (
                  <tr key={deal.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-slate-900">{deal.property?.reference_code}</div>
                      <div className="font-medium text-slate-700 line-clamp-1">{deal.property?.title}</div>
                      <div className="text-[10px] text-slate-400">{deal.property?.city}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{deal.lead?.customer_name || 'Buyer'}</div>
                      <div className="text-[11px] text-slate-500">{deal.lead?.phone}</div>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-800 tabular-nums">
                      {formatPKR(deal.offer_amount)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-700 tabular-nums">
                      {deal.agreed_amount ? formatPKR(deal.agreed_amount) : 'Pending'}
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={deal.stage}
                        onChange={(e) => handleStageUpdate(deal.id, e.target.value as DealStage)}
                        className={`py-1 px-2 rounded-md text-xs font-bold capitalize border cursor-pointer ${
                          deal.stage === 'closed_won' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                          deal.stage === 'closed_lost' ? 'bg-red-100 text-red-800 border-red-300' :
                          deal.stage === 'booking' || deal.stage === 'negotiation' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                          'bg-slate-100 text-slate-700 border-slate-300'
                        }`}
                      >
                        {DEAL_STAGES.map((s) => (
                          <option key={s.id} value={s.id}>{s.label}</option>
                        ))}
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                      {deal.expected_closing_date || 'TBD'}
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {deal.assigned_agent?.full_name || 'Agent'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Deal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Initiate Deal Record</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDeal} className="space-y-3">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Property *</label>
                <select
                  required
                  value={dealData.property_id}
                  onChange={(e) => {
                    const pid = e.target.value;
                    const p = properties.find((item) => item.id === pid);
                    setDealData({
                      ...dealData,
                      property_id: pid,
                      offer_amount: p ? p.price : dealData.offer_amount,
                    });
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                >
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.reference_code} — {p.title} ({formatPKR(p.price)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Buyer (Client Lead) *</label>
                <select
                  required
                  value={dealData.lead_id}
                  onChange={(e) => setDealData({ ...dealData, lead_id: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                >
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.customer_name} ({l.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Offer Amount (PKR) *</label>
                  <input
                    type="number"
                    required
                    value={dealData.offer_amount}
                    onChange={(e) => setDealData({ ...dealData, offer_amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Agreed Amount (PKR)</label>
                  <input
                    type="number"
                    value={dealData.agreed_amount}
                    onChange={(e) => setDealData({ ...dealData, agreed_amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono tabular-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Stage</label>
                  <select
                    value={dealData.stage}
                    onChange={(e) => setDealData({ ...dealData, stage: e.target.value as DealStage })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                  >
                    {DEAL_STAGES.map((s) => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Closing Date</label>
                  <input
                    type="date"
                    value={dealData.expected_closing_date}
                    onChange={(e) => setDealData({ ...dealData, expected_closing_date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Deal Notes</label>
                <textarea
                  rows={2}
                  value={dealData.notes}
                  onChange={(e) => setDealData({ ...dealData, notes: e.target.value })}
                  placeholder="Terms, payment schedules, earnest money / token deposit details..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl resize-none"
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
                  className="px-5 py-2 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs cursor-pointer"
                >
                  Save Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
