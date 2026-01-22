
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { RefreshCcw, CheckCircle, XCircle, Mail, Clock, MapPin, Phone, Eye, ArrowRight, User as UserIcon } from 'lucide-react';
import { RefundRequest } from '../types';

const MOCK_REFUNDS: RefundRequest[] = [
  {
    id: 'REF-101',
    orderId: 'ORD-5501',
    userId: 'USR-882',
    userPhone: '+1 555-9000',
    reason: 'Size was too small and fabric quality was not as expected.',
    pickupTime: '2023-11-15 10:00 AM',
    address: '123 Fashion Ave, Suite 4B, New York, NY 10001',
    status: 'pending'
  },
];

const RefundsPage: React.FC = () => {
  const [requests, setRequests] = useState<RefundRequest[]>(MOCK_REFUNDS);
  const [selectedRequest, setSelectedRequest] = useState<RefundRequest | null>(null);
  const [emailBody, setEmailBody] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const generateEmail = async (status: 'accepted' | 'rejected') => {
    if (!selectedRequest) return;
    setIsGenerating(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Generate a professional and helpful email for an e-commerce refund request. 
      Customer ID: ${selectedRequest.userId}
      Order ID: ${selectedRequest.orderId}
      Status: ${status}
      Reason given for refund: ${selectedRequest.reason}
      Pickup Schedule: ${selectedRequest.pickupTime}
      Address for Pickup: ${selectedRequest.address}
      Tone: Empathetic, professional, clear.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });
      setEmailBody(response.text || '');
    } catch (error) {
      setEmailBody(`Notification regarding your refund request ${selectedRequest.id} which has been ${status}. Please contact support for more details.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const updateStatus = (status: 'accepted' | 'rejected') => {
    if (!selectedRequest) return;
    setRequests(requests.map(r => r.id === selectedRequest.id ? { ...r, status } : r));
    setModalOpen(false);
    if (status === 'accepted') {
      alert(`Logistics Dispatch: Pickup scheduled for order ${selectedRequest.orderId} at ${selectedRequest.address}. Delivery partner notified.`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Returns & Refunds</h1>
          <p className="text-gray-500">Handle post-purchase service requests and logistics.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-6 py-5">Request Ref</th>
                <th className="px-6 py-5">Reasoning</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-5">
                    <p className="text-sm font-black text-gray-900">{req.id}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">Order: {req.orderId}</p>
                  </td>
                  <td className="px-6 py-5 max-w-xs truncate text-sm text-gray-600 font-medium">{req.reason}</td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${
                      req.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                      req.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' : 
                      'bg-rose-100 text-rose-700'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button 
                      onClick={() => { setSelectedRequest(req); setModalOpen(true); }} 
                      className="p-2.5 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-white rounded-[2rem] w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl p-8 animate-in fade-in zoom-in slide-in-from-bottom-8 duration-500">
            <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-100">
              <div>
                <h2 className="text-2xl font-black text-gray-900">Process Return Request</h2>
                <p className="text-xs font-black text-indigo-600 uppercase tracking-widest mt-1">Request ID: {selectedRequest.id}</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all">
                <XCircle size={24} className="text-gray-400" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="bg-gray-50 p-6 rounded-3xl space-y-4 border border-gray-100">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center">
                  <UserIcon size={14} className="mr-2" /> Customer Profile
                </h4>
                <div>
                  <p className="text-lg font-black text-gray-900">{selectedRequest.userId}</p>
                  <p className="text-sm flex items-center text-gray-600 mt-2 font-bold"><Phone size={14} className="mr-2 text-indigo-500" /> {selectedRequest.userPhone || 'N/A'}</p>
                </div>
                <div className="pt-4 border-t border-gray-200/50">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pickup Location</p>
                  <p className="text-sm flex items-start text-gray-800 font-bold leading-relaxed">
                    <MapPin size={16} className="mr-2 mt-0.5 text-rose-500 flex-shrink-0" /> 
                    {selectedRequest.address}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-3xl space-y-4 border border-gray-100">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center">
                  <RefreshCcw size={14} className="mr-2" /> Request Data
                </h4>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Customer Reason</p>
                  <p className="text-sm text-gray-800 font-bold leading-relaxed italic">"{selectedRequest.reason}"</p>
                </div>
                <div className="pt-4 border-t border-gray-200/50">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Preferred Pickup Time</p>
                  <p className="text-sm text-gray-900 flex items-center font-black">
                    <Clock size={16} className="mr-2 text-amber-500" /> 
                    {selectedRequest.pickupTime}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-10">
               <div className="flex justify-between items-center px-1">
                 <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center">
                    <Mail size={16} className="mr-2" /> Communication Preview
                 </h3>
                 <div className="flex space-x-2">
                   <button 
                    onClick={() => generateEmail('accepted')} 
                    disabled={isGenerating}
                    className="text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full hover:bg-emerald-100 transition-all disabled:opacity-50"
                  >
                    Draft Approval
                   </button>
                   <button 
                    onClick={() => generateEmail('rejected')} 
                    disabled={isGenerating}
                    className="text-[10px] font-black uppercase tracking-widest bg-rose-50 text-rose-600 px-4 py-1.5 rounded-full hover:bg-rose-100 transition-all disabled:opacity-50"
                  >
                    Draft Rejection
                   </button>
                 </div>
               </div>
               <div className="relative">
                 {isGenerating && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center rounded-2xl z-10">
                      <RefreshCcw className="animate-spin text-indigo-600" />
                    </div>
                 )}
                 <textarea 
                  value={emailBody} 
                  onChange={e => setEmailBody(e.target.value)} 
                  className="w-full h-40 p-5 bg-gray-50 border-none rounded-[1.5rem] text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
                  placeholder="The generated notification email will appear here for your review..." 
                />
               </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-4 border-t border-gray-100 pt-8">
              <button 
                onClick={() => updateStatus('rejected')} 
                className="px-8 py-3 text-rose-600 font-black uppercase tracking-widest text-xs border-2 border-rose-100 rounded-2xl hover:bg-rose-50 transition-all"
              >
                Deny & Send Email
              </button>
              <button 
                onClick={() => updateStatus('accepted')} 
                className="px-10 py-3 bg-indigo-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all flex items-center justify-center"
              >
                Authorize & Dispatch Pickup <ArrowRight size={16} className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RefundsPage;
