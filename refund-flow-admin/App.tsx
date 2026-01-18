
import React, { useState, useEffect, useMemo } from 'react';
import { RefundRequest, RefundStatus, DashboardStats } from './types';
import RefundTable from './components/RefundTable';
import RefundDetailModal from './components/RefundDetailModal';
import EmailComposer from './components/EmailComposer';
import { generateRefundEmail } from './services/geminiService';

// Mock Initial Data
const INITIAL_REQUESTS: RefundRequest[] = [
  {
    id: "REF-1001",
    customerName: "Alex Thompson",
    customerEmail: "alex.t@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Maple Ave, Springfield, IL",
    reason: "The product arrived damaged with visible scratches on the screen.",
    pickupTime: "2024-05-20 14:00",
    requestedAt: "2024-05-18 09:15",
    status: RefundStatus.PENDING,
    product: {
      id: "PROD-99",
      name: "UltraVision 4K Monitor",
      price: 349.99,
      category: "Electronics",
      imageUrl: "https://picsum.photos/seed/monitor/100/100"
    }
  },
  {
    id: "REF-1002",
    customerName: "Sarah Miller",
    customerEmail: "sarah.m@test.com",
    phone: "+1 (555) 987-6543",
    address: "456 Oak Lane, Riverside, CA",
    reason: "Changed my mind, found a better deal elsewhere.",
    pickupTime: "2024-05-21 10:00",
    requestedAt: "2024-05-18 11:30",
    status: RefundStatus.PENDING,
    product: {
      id: "PROD-45",
      name: "ErgoComfort Office Chair",
      price: 189.50,
      category: "Furniture",
      imageUrl: "https://picsum.photos/seed/chair/100/100"
    }
  },
  {
    id: "REF-1003",
    customerName: "David Chen",
    customerEmail: "dchen@webmail.com",
    phone: "+1 (555) 444-2222",
    address: "789 Pine St, Seattle, WA",
    reason: "Item is too small even though I ordered XL.",
    pickupTime: "2024-05-22 16:00",
    requestedAt: "2024-05-19 08:00",
    status: RefundStatus.PENDING,
    product: {
      id: "PROD-12",
      name: "Summit Peak Hoodie",
      price: 65.00,
      category: "Apparel",
      imageUrl: "https://picsum.photos/seed/hoodie/100/100"
    }
  }
];

const App: React.FC = () => {
  const [requests, setRequests] = useState<RefundRequest[]>(INITIAL_REQUESTS);
  const [selectedRequest, setSelectedRequest] = useState<RefundRequest | null>(null);
  const [emailComposerOpen, setEmailComposerOpen] = useState(false);
  const [composerData, setComposerData] = useState<{ request: RefundRequest; newStatus: RefundStatus } | null>(null);

  const stats: DashboardStats = useMemo(() => {
    return {
      total: requests.length,
      pending: requests.filter(r => r.status === RefundStatus.PENDING).length,
      approved: requests.filter(r => r.status === RefundStatus.APPROVED).length,
      cancelled: requests.filter(r => r.status === RefundStatus.CANCELLED).length,
    };
  }, [requests]);

  const handleActionClick = (request: RefundRequest, status: RefundStatus) => {
    setComposerData({ request, newStatus: status });
    setEmailComposerOpen(true);
  };

  const handleFinalizeRequest = (requestId: string, newStatus: RefundStatus, emailContent: string) => {
    setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: newStatus } : r));
    setEmailComposerOpen(false);
    setComposerData(null);
    setSelectedRequest(null);
    // In a real app, you'd send the emailContent to your backend here
    console.log(`Email sent for ${requestId}:`, emailContent);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <i className="fas fa-undo-alt text-white"></i>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Refund<span className="text-blue-600">Flow</span> Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:text-slate-700 transition-colors">
              <i className="far fa-bell text-lg"></i>
            </button>
            <div className="h-8 w-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-600">
              <i className="fas fa-user text-sm"></i>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Requests" value={stats.total} icon="fa-list" color="text-blue-600" bg="bg-blue-50" />
          <StatCard title="Pending" value={stats.pending} icon="fa-clock" color="text-amber-600" bg="bg-amber-50" />
          <StatCard title="Approved" value={stats.approved} icon="fa-check-circle" color="text-emerald-600" bg="bg-emerald-50" />
          <StatCard title="Cancelled" value={stats.cancelled} icon="fa-times-circle" color="text-rose-600" bg="bg-rose-50" />
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Refund Requests</h2>
              <p className="text-sm text-slate-500">Manage customer returns and initiate pickup schedules.</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                <i className="fas fa-filter mr-2"></i> Filter
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                <i className="fas fa-download mr-2"></i> Export
              </button>
            </div>
          </div>
          
          <RefundTable 
            requests={requests} 
            onViewDetails={setSelectedRequest}
            onAction={handleActionClick}
          />
        </div>
      </main>

      {/* Modals */}
      {selectedRequest && !emailComposerOpen && (
        <RefundDetailModal 
          request={selectedRequest} 
          onClose={() => setSelectedRequest(null)}
          onApprove={() => handleActionClick(selectedRequest, RefundStatus.APPROVED)}
          onCancel={() => handleActionClick(selectedRequest, RefundStatus.CANCELLED)}
        />
      )}

      {emailComposerOpen && composerData && (
        <EmailComposer
          request={composerData.request}
          newStatus={composerData.newStatus}
          onClose={() => setEmailComposerOpen(false)}
          onSend={(content) => handleFinalizeRequest(composerData.request.id, composerData.newStatus, content)}
        />
      )}
    </div>
  );
};

// Helper Components
const StatCard: React.FC<{ title: string; value: number; icon: string; color: string; bg: string }> = ({ title, value, icon, color, bg }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
      <div className={`${bg} ${color} h-12 w-12 rounded-lg flex items-center justify-center`}>
        <i className={`fas ${icon} text-lg`}></i>
      </div>
    </div>
  </div>
);

export default App;
