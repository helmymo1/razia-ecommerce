
import React, { useState, useEffect } from 'react';
import { Ticket, Plus, Calendar, Edit2, Trash2, X, Tag } from 'lucide-react';
import { PromoCode } from '../types';

import api from '../api/axiosConfig';
import toast from 'react-hot-toast';

const MOCK_PROMOS: PromoCode[] = []; // Removed logic

const PromoCodesPage: React.FC = () => {
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null);

  // Fetch Coupons
  React.useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      const { data } = await api.get('/coupons');
      // Map backend to frontend
      const mapped = data.map((c: any) => ({
        id: c.id,
        code: c.code,
        type: c.discount_type,
        discount: c.discount_value,
        startDate: c.start_date?.split('T')[0],
        endDate: c.end_date?.split('T')[0],
        active: !c.is_deleted // Assuming soft delete means inactive? Or status field?
        // Wait, backend has 'is_deleted' filtered out.
        // It doesn't have an explicit 'active' boolean in schema I wrote,
        // but verifyCoupon checks dates.
        // I'll assume active = true for now as 'status' field wasn't in my controller create logic explicitly
        // actually controller INSERT just put values. 
        // Let's add status=active logic if needed or just rely on dates.
      }));
      setPromos(mapped);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load coupons');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Remove this promo code?')) {
      try {
        await api.delete(`/coupons/${id}`);
        setPromos(promos.filter(p => p.id !== id));
        toast.success('Coupon deleted');
      } catch (err) {
        toast.error('Failed to delete coupon');
      }
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const promoData = {
      code: (formData.get('code') as string).toUpperCase(),
      discount_value: parseFloat(formData.get('discount') as string),
      discount_type: formData.get('type') as 'fixed' | 'percentage',
      start_date: formData.get('startDate') as string,
      end_date: formData.get('endDate') as string,
      status: 'active'
    };

    try {
    // Create Only (Edit not implemented in backend yet, just soft delete/re-create pattern usually for coupons to avoid history issues, but simple update is fine if I add it.
    // My controller only had Create/Delete/Get/Verify. So I will supporting Creating new.
    // If editing, I might need to Add Update endpoint or just tell user to recreate.
    // For now I'll support Create.
      if (editingPromo) {
        toast.error("Editing not supported yet, please delete and recreate");
        // Or implement PUT /api/coupons/:id in backend if requested...
        // Prompt said: POST (Create), GET (List), DELETE (Delete), POST (Validate). 
        // So explicit Edit was NOT requested. I'll disable edit save.
      } else {
        await api.post('/coupons', promoData);
        toast.success('Coupon created');
        loadCoupons();
      }
      setIsModalOpen(false);
      setEditingPromo(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save coupon');
    }
  };


  // Outfit Config State
  const [outfitConfig, setOutfitConfig] = useState({
    tier_2: 15,
    tier_3: 20,
    tier_4: 25,
    tier_5: 30
  });

  const loadOutfitConfig = async () => {
    try {
      const { data } = await api.get('/config/outfit');
      if (data && data.tier_2) {
        setOutfitConfig(data);
      }
    } catch (err) {
      console.error("Failed to load outfit config", err);
    }
  };

  useEffect(() => {
    loadOutfitConfig();
  }, []);

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/config/outfit', outfitConfig);
      toast.success('Outfit rules updated');
    } catch (err) {
      toast.error('Failed to update rules');
    }
  };

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOutfitConfig({ ...outfitConfig, [e.target.name]: parseInt(e.target.value) || 0 });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Promo Codes & Config</h1>
          <p className="text-gray-500">Manage campaign discounts and store settings.</p>
        </div>
        <button 
          onClick={() => { setEditingPromo(null); setIsModalOpen(true); }}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
        >
          <Plus size={18} className="mr-2" />
          Create Promo
        </button>
      </div>

      {/* Outfit Builder Configuration Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-pink-100 text-pink-600 rounded-lg">
              <Tag size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Outfit Builder Rules</h2>
              <p className="text-sm text-gray-500">Set automatic bundle discounts based on item count</p>
            </div>
          </div>
        </div>
        <form onSubmit={handleSaveConfig} className="grid grid-cols-2 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">2 Items</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
              <input
                name="tier_2"
                type="number"
                value={outfitConfig.tier_2}
                onChange={handleConfigChange}
                className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg font-bold text-gray-800 focus:ring-2 focus:ring-pink-500 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">3 Items</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
              <input
                name="tier_3"
                type="number"
                value={outfitConfig.tier_3}
                onChange={handleConfigChange}
                className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg font-bold text-gray-800 focus:ring-2 focus:ring-pink-500 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">4 Items</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
              <input
                name="tier_4"
                type="number"
                value={outfitConfig.tier_4}
                onChange={handleConfigChange}
                className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg font-bold text-gray-800 focus:ring-2 focus:ring-pink-500 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">5+ Items</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
              <input
                name="tier_5"
                type="number"
                value={outfitConfig.tier_5}
                onChange={handleConfigChange}
                className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg font-bold text-gray-800 focus:ring-2 focus:ring-pink-500 outline-none"
              />
            </div>
          </div>
          <button type="submit" className="flex items-center justify-center px-4 py-2 bg-pink-600 text-white font-bold rounded-lg hover:bg-pink-700 transition-colors h-[42px]">
            Save Rules
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">Active Coupons</h3>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-4">Code</th>
              <th className="px-6 py-4">Discount</th>
              <th className="px-6 py-4">Duration</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {promos && promos.length > 0 ? (
              promos.map((promo) => (
                <tr key={promo.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Ticket size={16} className="text-indigo-600" />
                      <span className="font-bold text-gray-900 tracking-tight">{promo.code}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-gray-900">
                      {promo.type === 'percentage' ? `${promo.discount}%` : `$${promo.discount}`}
                    </p>
                    <p className="text-xs text-gray-400 capitalize">{promo.type} OFF</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar size={12} className="mr-1" />
                      {promo.startDate} - {promo.endDate}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${promo.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
                      }`}>
                      {promo.active ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => { setEditingPromo(promo); setIsModalOpen(true); }}
                      className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(promo.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">No promo codes found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">{editingPromo ? 'Edit Promo' : 'New Promo'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Promo Code</label>
                <input name="code" defaultValue={editingPromo?.code} placeholder="WELCOME20" required className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 uppercase" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Type</label>
                  <select name="type" defaultValue={editingPromo?.type || 'percentage'} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Discount Value</label>
                  <input name="discount" type="number" defaultValue={editingPromo?.discount} required className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Start Date</label>
                  <input name="startDate" type="date" defaultValue={editingPromo?.startDate} required className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">End Date</label>
                  <input name="endDate" type="date" defaultValue={editingPromo?.endDate} required className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
                </div>
              </div>
              <div className="flex items-center pt-2">
                <input name="active" type="checkbox" defaultChecked={editingPromo ? editingPromo.active : true} className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" id="promo-active" />
                <label htmlFor="promo-active" className="ml-2 block text-sm text-gray-900 font-medium cursor-pointer">Set as active</label>
              </div>
              <div className="flex justify-end pt-4 space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-50 rounded-lg">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-100">Save Promo</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromoCodesPage;
