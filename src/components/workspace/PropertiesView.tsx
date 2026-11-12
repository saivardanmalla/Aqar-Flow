import React, { useState, useEffect } from 'react';
import { Property, PropertyPurpose, PropertyStatus, PropertyType } from '../../types';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { formatPKR } from '../../lib/utils';
import { 
  Plus, 
  Search, 
  Building, 
  Eye, 
  EyeOff, 
  Edit3, 
  Trash2, 
  MapPin, 
  Check, 
  X, 
  AlertCircle,
  Sparkles,
  Filter
} from 'lucide-react';

export const PropertiesView: React.FC = () => {
  const { isAdmin } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [purposeFilter, setPurposeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProp, setEditingProp] = useState<Property | null>(null);
  const [formData, setFormData] = useState<Partial<Property>>({
    title: '',
    reference_code: '',
    purpose: 'sale',
    category: 'residential',
    property_type: 'house',
    price: 35000000,
    currency: 'PKR',
    area_value: 2250,
    area_unit: 'sqft',
    bedrooms: 4,
    bathrooms: 4,
    address: '',
    city: 'Islamabad',
    locality: '',
    status: 'available',
    is_published: true,
    furnishing_status: 'semi_furnished',
    possession_status: 'immediate',
    description: '',
    amenities: ['Gated Community', 'Solar Backup', 'CCTV Security'],
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await api.getProperties({
        purpose: purposeFilter !== 'all' ? purposeFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: search.trim() || undefined,
      });
      setProperties(res.properties);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [purposeFilter, statusFilter]);

  const handleOpenCreate = () => {
    const nextNum = properties.length + 1;
    setEditingProp(null);
    setFormData({
      title: '',
      reference_code: `AF-${String(nextNum).padStart(3, '0')}`,
      purpose: 'sale',
      category: 'residential',
      property_type: 'house',
      price: 35000000,
      currency: 'PKR',
      area_value: 2250,
      area_unit: 'sqft',
      bedrooms: 4,
      bathrooms: 4,
      address: '',
      city: 'Islamabad',
      locality: 'Sector F-7',
      status: 'available',
      is_published: true,
      furnishing_status: 'semi_furnished',
      possession_status: 'immediate',
      description: 'Brand new luxury residential property featuring modern architecture, high-grade finishes, and strategic location.',
      amenities: ['Gated Security', 'Solar Backup', 'Terrace Garden'],
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prop: Property) => {
    setEditingProp(prop);
    setFormData({ ...prop });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleTogglePublish = async (prop: Property) => {
    try {
      await api.updateProperty(prop.id, { is_published: !prop.is_published });
      fetchProperties();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (prop: Property) => {
    if (!confirm(`Are you sure you want to delete ${prop.reference_code} - ${prop.title}?`)) return;
    try {
      await api.deleteProperty(prop.id);
      fetchProperties();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError(null);

    try {
      if (editingProp) {
        await api.updateProperty(editingProp.id, formData);
      } else {
        await api.createProperty(formData);
      }
      setIsModalOpen(false);
      fetchProperties();
    } catch (err: any) {
      setFormError(err.message || 'Operation failed');
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Property Management</h1>
          <p className="text-xs text-slate-500">Manage real estate inventory, media, pricing, and marketplace publication.</p>
        </div>

        {isAdmin && (
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Property</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          {/* Keyword Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search reference, title, locality..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchProperties()}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          {/* Purpose Filter */}
          <select
            value={purposeFilter}
            onChange={(e) => setPurposeFilter(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-700"
          >
            <option value="all">All Purposes</option>
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-700"
          >
            <option value="all">All Statuses</option>
            <option value="available">Available</option>
            <option value="under_offer">Under Offer</option>
            <option value="sold">Sold</option>
            <option value="rented">Rented</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <button
          onClick={fetchProperties}
          className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 cursor-pointer"
        >
          Apply Filters
        </button>
      </div>

      {/* Properties Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Ref &amp; Property</th>
                <th className="py-3 px-4">Purpose &amp; Type</th>
                <th className="py-3 px-4 text-right">Price (PKR)</th>
                <th className="py-3 px-4">Area &amp; Specs</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Marketplace</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">Loading inventory...</td>
                </tr>
              ) : properties.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">No properties found.</td>
                </tr>
              ) : (
                properties.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.media?.[0]?.url || '/src/assets/images/property_islamabad_villa_1794204424374.jpg'}
                          alt={p.title}
                          className="w-10 h-10 rounded-lg object-cover shrink-0"
                        />
                        <div>
                          <div className="font-mono font-bold text-slate-900 text-[11px]">{p.reference_code}</div>
                          <div className="font-semibold text-slate-800 line-clamp-1 max-w-[220px]">{p.title}</div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1">
                            <MapPin className="w-2.5 h-2.5 text-emerald-600" />
                            <span>{p.locality}, {p.city}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="capitalize font-medium text-slate-800">{p.purpose}</div>
                      <div className="text-[10px] text-slate-400 capitalize">{p.property_type.replace('_', ' ')}</div>
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                      {formatPKR(p.price)}
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-600 tabular-nums">
                      <div>{p.area_value.toLocaleString()} {p.area_unit}</div>
                      <div className="text-[10px] text-slate-400">{p.bedrooms} Beds · {p.bathrooms} Baths</div>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        p.status === 'available' ? 'bg-emerald-100 text-emerald-800' :
                        p.status === 'under_offer' ? 'bg-amber-100 text-amber-800' :
                        p.status === 'sold' ? 'bg-blue-100 text-blue-800' :
                        p.status === 'rented' ? 'bg-indigo-100 text-indigo-800' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {p.status.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleTogglePublish(p)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                          p.is_published
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200'
                        }`}
                        title={p.is_published ? 'Click to Unpublish' : 'Click to Publish'}
                      >
                        {p.is_published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        <span>{p.is_published ? 'Published' : 'Hidden'}</span>
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md cursor-pointer"
                          title="Edit Property"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => handleDelete(p)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md cursor-pointer"
                            title="Delete Property"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* Add / Edit Property Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">
                {editingProp ? `Edit Property: ${editingProp.reference_code}` : 'Add New Property to Inventory'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              {formError && (
                <div className="p-3 text-red-700 bg-red-50 rounded-xl border border-red-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Property Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden focus:border-emerald-500"
                    placeholder="e.g. Luxury 1 Kanal Contemporary Designer Villa"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Reference Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.reference_code}
                    onChange={(e) => setFormData({ ...formData, reference_code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden focus:border-emerald-500 font-mono font-bold"
                    placeholder="AF-009"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Purpose *</label>
                  <select
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value as PropertyPurpose })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                    <option value="lease">Commercial Lease</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Property Type *</label>
                  <select
                    value={formData.property_type}
                    onChange={(e) => setFormData({ ...formData, property_type: e.target.value as PropertyType })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                    <option value="villa">Luxury Villa</option>
                    <option value="penthouse">Penthouse</option>
                    <option value="office">Commercial Office</option>
                    <option value="shop">Retail Shop</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Price (PKR) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono tabular-nums"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as PropertyStatus })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="available">Available</option>
                    <option value="under_offer">Under Offer</option>
                    <option value="sold">Sold</option>
                    <option value="rented">Rented</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Area Value *</label>
                  <input
                    type="number"
                    required
                    value={formData.area_value}
                    onChange={(e) => setFormData({ ...formData, area_value: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Area Unit</label>
                  <select
                    value={formData.area_unit}
                    onChange={(e) => setFormData({ ...formData, area_unit: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="sqft">Sqft</option>
                    <option value="marla">Marla</option>
                    <option value="kanal">Kanal</option>
                    <option value="sqyd">Sq Yard</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bedrooms</label>
                  <input
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bathrooms</label>
                  <input
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City *</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="Islamabad">Islamabad</option>
                    <option value="Lahore">Lahore</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Locality / Sector</label>
                  <input
                    type="text"
                    value={formData.locality}
                    onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                    placeholder="e.g. DHA Phase 6"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Possession</label>
                  <select
                    value={formData.possession_status}
                    onChange={(e) => setFormData({ ...formData, possession_status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="immediate">Immediate</option>
                    <option value="available">Available</option>
                    <option value="within_3_months">Within 3 Months</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="publish_check"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <label htmlFor="publish_check" className="font-semibold text-slate-800">
                  Publish to public marketplace immediately
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-5 py-2 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {formSubmitting ? 'Saving...' : editingProp ? 'Update Property' : 'Create Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
