
import React from 'react';
import { User, Shield, Key, LogOut, Camera } from 'lucide-react';
import { authService } from '../api/axiosConfig';

const AdminProfilePage: React.FC = () => {
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Admin Profile</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-32 bg-indigo-600 relative">
          <button className="absolute bottom-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white text-xs font-bold flex items-center transition-colors">
            <Camera size={14} className="mr-2" /> Edit Cover
          </button>
        </div>
        <div className="px-6 pb-6">
          <div className="flex justify-between items-end -mt-12 mb-6">
            <div className="relative">
              <img src="https://picsum.photos/seed/admin/120/120" className="w-24 h-24 rounded-2xl border-4 border-white shadow-xl object-cover" alt="Profile" />
              <button className="absolute -bottom-2 -right-2 p-2 bg-indigo-600 text-white rounded-lg shadow-lg">
                <Camera size={16} />
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">First Name</label>
                <input type="text" defaultValue="Sarah" className="w-full p-2 border border-gray-200 rounded-lg outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Last Name</label>
                <input type="text" defaultValue="Jenkins" className="w-full p-2 border border-gray-200 rounded-lg outline-none" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Role</label>
              <div className="flex items-center text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg w-fit">
                <Shield size={16} className="mr-2" /> System Administrator
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
              <button onClick={() => authService.logout()} className="text-red-600 flex items-center font-bold text-sm hover:underline">
                <LogOut size={18} className="mr-2" /> Log Out
              </button>
              <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-indigo-100">
                Update Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;
