import React, { useState } from 'react';
import { Property } from '../types';
import { api } from '../lib/api';
import { X, CheckCircle, Send, Phone, Mail, MessageSquare } from 'lucide-react';

interface InquiryModalProps {
  property?: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({
  property,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferredMethod, setPreferredMethod] = useState<'phone' | 'whatsapp' | 'email'>('whatsapp');
  const [purpose, setPurpose] = useState<'buy' | 'rent' | 'invest'>(
    property ? (property.purpose === 'sale' ? 'buy' : 'rent') : 'buy'
  );
  const [budget, setBudget] = useState<string>(property ? String(property.price) : '');
  const [notes, setNotes] = useState(
    property ? `I would like to schedule a visit and get more details about ${property.reference_code} (${property.title}).` : ''
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone) {
      setError('Please provide your name and phone number.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await api.submitPublicInquiry({
        customer_name: customerName,
        phone,
        email,
        preferred_contact_method: preferredMethod,
        inquiry_purpose: purpose,
        budget: budget ? Number(budget) : undefined,
        property_id: property?.id,
        notes,
      });

      setSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
              Direct Agency Inquiry
            </span>
            <h3 className="text-base font-bold text-slate-900">
              {property ? `Inquire about ${property.reference_code}` : 'Schedule a Consultation'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Inquiry Received!</h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              Your inquiry has been directly recorded into our agency CRM. One of our dedicated property advisors will contact you via {preferredMethod.toUpperCase()} shortly.
            </p>
            <div className="pt-4">
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="px-6 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 text-xs text-red-700 bg-red-50 rounded-xl border border-red-200">
                {error}
              </div>
            )}

            {property && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900">{property.title}</div>
                  <div className="text-slate-500 font-mono text-[11px]">{property.reference_code} · {property.city}</div>
                </div>
                <div className="font-bold text-emerald-600 text-sm">
                  PKR {property.price.toLocaleString()}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tariq Mehmood"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+92 300 1234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Email (Optional)</label>
                <input
                  type="email"
                  placeholder="tariq@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Preferred Contact Channel</label>
                <div className="flex gap-1.5 pt-0.5">
                  {[
                    { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
                    { id: 'phone', label: 'Call', icon: Phone },
                    { id: 'email', label: 'Email', icon: Mail },
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setPreferredMethod(item.id as any)}
                      className={`flex-1 py-1.5 px-2 text-[11px] font-medium rounded-lg border transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                        preferredMethod === item.id
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-semibold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Message or Specific Requirements</label>
              <textarea
                rows={3}
                placeholder="Specify preferred visit timings, financing requirements, or any questions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-emerald-500 resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Submitting...' : 'Send Inquiry'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
