
import React, { useState } from 'react';
import { Ticket, Plus, Calendar, Edit2, Trash2, X, Tag } from 'lucide-react';
import { PromoCode } from '../types';

const MOCK_PROMOS: PromoCode[] = [
  { id: '1', code: 'WELCOME20', type: 'percentage', discount: 20, startDate: '2023-10-01', endDate: '2023-12-31', active: true },
  { id: '2', code: 'SUMMER50', type: 'fixed', discount: 50, startDate: '2023-06-01', endDate: '2023-08-31', active: false },
];

const PromoCodesPage: React.FC = () => {
  const [promos, setPromos] = useState<PromoCode[]>(MOCK_PROMOS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null);

  const handleDelete = (id: string) => {
    if (window.confirm('Remove this promo code?')) {
      setPromos(promos.filter(p => p.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const promoData = {
      code: (formData.get('code') as string).toUpperCase(),
      discount: parseFloat(formData.get('discount') as string),
      type: formData.get('type') as 'fixed' | 'percentage',
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      active: formData.get('active') === 'on',
    };

    if (editingPromo) {
      setPromos(promos.map(p => p.id === editingPromo.id ? { ...p, ...promoData } : p));
    } else {
      const newPromo: PromoCode = {
        id: Math.random().toString(36).substr(2, 5),
        ...promoData,
      };
      setPromos([...promos, newPromo]);
    }
    setIsModalOpen(false);
    setEditingPromo(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Promo Codes</h1>
          <p className="text-gray-500">Create and manage discounts for campaigns.</p>
        </div>
        <button 
          onClick={() => { setEditingPromo(null); setIsModalOpen(true); }}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
        >
          <Plus size={18} className="mr-2" />
          Create Promo
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
            {promos.map((promo) => (
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
                   <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                     promo.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
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
            ))}
            {promos.length === 0 && (
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
