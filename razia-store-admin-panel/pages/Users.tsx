import React, { useState } from 'react';
import { Users, UserPlus, Search, Edit2, Trash2, ShieldCheck, Mail, X, MapPin, Phone, Eye, Calendar } from 'lucide-react';
import { User } from '../types';

const MOCK_USERS: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', phone: '+1 555-0101', address: '123 Main St, New York, NY 10001', role: 'user', createdAt: '2023-10-01' },
  { id: '2', name: 'Jane Smith', email: 'jane@admin.com', phone: '+1 555-0102', address: '456 Admin Way, Seattle, WA 98101', role: 'admin', createdAt: '2023-09-15' },
  { id: '3', name: 'Robert Brown', email: 'robert@example.com', phone: '+1 555-0103', address: '789 Oak Rd, Chicago, IL 60601', role: 'user', createdAt: '2023-10-20' },
];

import { userService } from '../api/axiosConfig';

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  React.useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await userService.getAll();
      // Map backend data to frontend format
      const mappedUsers = data.map((u: any) => ({
        id: u.id,
        name: u.name || u.first_name || u.email?.split('@')[0] || 'Unknown',
        email: u.email,
        phone: u.phone || '',
        address: u.address || '',
        role: u.role === 'admin' ? 'admin' : 'user',
        createdAt: u.created_at ? new Date(u.created_at).toLocaleDateString() : ''
      }));
      setUsers(mappedUsers);
    } catch (error) {
      console.error("Failed to load users", error);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.phone?.includes(searchTerm)
  );

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this user account?')) {
      try {
        await userService.delete(id);
        setUsers(prev => prev.filter(u => u.id !== id));
      } catch (error) {
        alert('Failed to delete user');
      }
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const userData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      role: formData.get('role') as 'admin' | 'user',
    };

    try {
        if (editingUser) {
          await userService.update(editingUser.id, userData);
        } else {
          await userService.create(userData);
        }
        await loadUsers();
        setIsModalOpen(false);
        setEditingUser(null);
    } catch (err) {
        alert('Failed to save user');
        console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">User Management</h1>
          <p className="text-gray-500">View and manage customer accounts and administrative staff.</p>
        </div>
        <button 
          onClick={() => { setEditingUser(null); setIsModalOpen(true); }}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          <UserPlus size={18} className="mr-2" />
          Add User
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-sm">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name, email, or phone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-widest">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-bold rounded-full ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {user.role === 'admin' && <ShieldCheck size={12} className="mr-1" />}
                      {user.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600 font-medium">{user.phone || 'N/A'}</p>
                  </td>
                  <td className="px-6 py-4 text-right space-x-1">
                    <button 
                      onClick={() => setViewingUser(user)}
                      className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      onClick={() => { setEditingUser(user); setIsModalOpen(true); }}
                      className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(user.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">{editingUser ? 'Edit User' : 'Add User'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                <input name="name" defaultValue={editingUser?.name} required className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                <input name="email" type="email" defaultValue={editingUser?.email} required className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Phone</label>
                <input name="phone" defaultValue={editingUser?.phone} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" placeholder="+1 123-456-7890" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Full Address</label>
                <textarea name="address" defaultValue={editingUser?.address} rows={2} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" placeholder="123 Fashion Ave, NY 10001" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Role</label>
                <select name="role" defaultValue={editingUser?.role || 'user'} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end pt-4 space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-500 font-bold hover:bg-gray-50 rounded-lg">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-100">Save Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewingUser && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-8 relative animate-in fade-in slide-in-from-bottom-4 duration-300">
            <button onClick={() => setViewingUser(null)} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full">
              <X size={20} className="text-gray-400" />
            </button>
            <div className="flex flex-col items-center mb-8">
              <div className="w-24 h-24 rounded-full bg-indigo-600 text-white flex items-center justify-center text-4xl font-bold mb-4 shadow-xl">
                {viewingUser.name.charAt(0)}
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900">{viewingUser.name}</h2>
              <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest mt-2">{viewingUser.role}</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl">
                <Mail className="text-indigo-500" size={20} />
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</p>
                  <p className="text-sm font-bold text-gray-800">{viewingUser.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl">
                <Phone className="text-indigo-500" size={20} />
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone Number</p>
                  <p className="text-sm font-bold text-gray-800">{viewingUser.phone || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-2xl">
                <MapPin className="text-indigo-500 mt-1" size={20} />
                <div className="flex-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Primary Address</p>
                  <p className="text-sm font-bold text-gray-800 leading-relaxed">{viewingUser.address || 'No registered address'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
