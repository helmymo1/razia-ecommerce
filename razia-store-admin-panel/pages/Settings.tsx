
import React from 'react';
import { Save, Globe, Shield, CreditCard, Bell } from 'lucide-react';

const SettingsPage: React.FC = () => {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Store Settings</h1>
        <p className="text-gray-500">Global configurations for your e-commerce platform.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold flex items-center"><Globe size={20} className="mr-2 text-indigo-600" /> General Information</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Store Name</label>
            <input type="text" defaultValue="Razia Store" className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Support Email</label>
            <input type="email" defaultValue="support@raziastore.com" className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Currency</label>
            <select className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500">
              <option>USD ($)</option>
              <option>EUR (€)</option>
              <option>GBP (£)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">VAT (%)</label>
            <input type="number" defaultValue="15" className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold flex items-center"><CreditCard size={20} className="mr-2 text-indigo-600" /> Shipping & Delivery</h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Free Shipping</p>
              <p className="text-sm text-gray-500">Enable free shipping for orders over a specific amount.</p>
            </div>
            <div className="relative inline-block w-12 h-6 rounded-full bg-indigo-600">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Minimum Order for Free Shipping ($)</label>
            <input type="number" defaultValue="100" className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100">
          <Save size={18} className="mr-2" />
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
