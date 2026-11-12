import React, { useState, useEffect } from 'react';
import { AgencySettings } from '../../types';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Building2, Save, CheckCircle2, Shield, Globe, Clock, DollarSign } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [settings, setSettings] = useState<AgencySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await api.getSettings();
        setSettings(res.settings);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      await api.updateSettings(settings);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading || !settings) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading settings...</div>;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Agency Settings</h1>
        <p className="text-xs text-slate-500">Configure your real estate organization profile, regional defaults, and brand rules.</p>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Agency settings successfully saved and synced across all modules.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Agency Identity */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 font-bold text-slate-900 text-sm">
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span>Organization Profile</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Agency Name</label>
              <input
                type="text"
                disabled={!isAdmin}
                value={settings.name}
                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl disabled:bg-slate-50"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tagline</label>
              <input
                type="text"
                disabled={!isAdmin}
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl disabled:bg-slate-50"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Official Email</label>
              <input
                type="email"
                disabled={!isAdmin}
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl disabled:bg-slate-50"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Official Phone</label>
              <input
                type="text"
                disabled={!isAdmin}
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl disabled:bg-slate-50"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Head Office Address</label>
              <input
                type="text"
                disabled={!isAdmin}
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl disabled:bg-slate-50"
              />
            </div>
          </div>
        </div>

        {/* Regional & Financial Defaults */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 font-bold text-slate-900 text-sm">
            <Globe className="w-4 h-4 text-emerald-600" />
            <span>Regional &amp; Currency Defaults</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Default Market Currency</label>
              <input
                type="text"
                disabled
                value={settings.default_currency}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 font-mono font-bold text-slate-800"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Pakistani Rupee (PKR) configured for Pakistan operations.</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Time Zone</label>
              <input
                type="text"
                disabled
                value={settings.timezone}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 font-mono text-slate-800"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">All visit bookings synchronized to Asia/Karachi (PKT).</span>
            </div>
          </div>
        </div>

        {/* User Account Info */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 font-bold text-slate-900 text-sm">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Active Operator Profile</span>
          </div>

          <div className="space-y-1 text-slate-600">
            <div>Name: <strong className="text-slate-900">{user?.full_name}</strong></div>
            <div>Email: <strong className="text-slate-900">{user?.email}</strong></div>
            <div>Role: <strong className="text-emerald-700 font-semibold capitalize">{user?.role.replace('_', ' ')}</strong></div>
            <div>Tenant ID: <strong className="font-mono text-slate-500">{user?.agency_id}</strong></div>
          </div>
        </div>

        {isAdmin && (
          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
