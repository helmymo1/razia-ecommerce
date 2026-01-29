import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Truck, MapPin, CheckCircle, AlertTriangle, Package, Printer, ExternalLink, RefreshCw, Send, Edit } from 'lucide-react';

// Define Interface for Shipment Order
interface ShipmentOrder {
  id: string;
  order_number: string;
  shipping_name: string;
  delivery_id: string | null;
  delivery_status: string;
  delivery_error: string | null;
  tracking_number: string | null;
  shipping_city: string;
  shipping_phone: string;
  shipping_address: string | any; // Could be JSON string or object
  created_at: string;
  is_paid: number;
}

const DeliveryPage: React.FC = () => {
  const [shipments, setShipments] = useState<ShipmentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  // Tracking Modal State
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [trackingData, setTrackingData] = useState<any>(null);

  // Edit & Retry Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<ShipmentOrder | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    phone: '',
    city: '',
    address: ''
  });
  const [dispatching, setDispatching] = useState(false);

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/orders/shipments');
      if (Array.isArray(data)) {
        setShipments(data);
      } else {
        console.error("Invalid shipment data received:", data);
        setShipments([]);
      }
      setLoading(false);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to load shipments');
      setShipments([]);
      setLoading(false);
    }
  };

  const handleTrack = async (orderId: string) => {
    try {
      setTrackingData(null);
      setTrackingModalOpen(true);

      const { data } = await axios.get(`/api/orders/${orderId}/track`);
      setTrackingData(data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to track order');
    }
  };

  const handlePrintLabel = async (orderId: string) => {
    try {
      const win = window.open('', '_blank');
      const { data } = await axios.get(`/api/orders/${orderId}/label`);

      if (win) {
        win.location.href = data.url;
      } else {
        window.location.href = data.url;
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to get label');
    }
  };

  const handleSync = async (orderId: string) => {
    try {
      toast.info("Syncing with OTO...");
      await axios.post(`/api/orders/${orderId}/sync`);
      toast.success("Shipment status updated");
      fetchShipments(); // Refresh table
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Sync failed');
    }
  };

  // --- Dispatch & Edit Logic ---

  const openEditModal = (order: ShipmentOrder) => {
    let addressStr = '';
    try {
      // Parse if string, or access if object
      const parsed = typeof order.shipping_address === 'string' ? JSON.parse(order.shipping_address) : order.shipping_address;
      addressStr = parsed.address || '';
    } catch (e) { addressStr = 'Invalid Address Format'; }

    setSelectedOrder(order);
    setEditFormData({
      name: order.shipping_name,
      phone: order.shipping_phone,
      city: order.shipping_city,
      address: addressStr
    });
    setEditModalOpen(true);
  };

  const handleDispatch = async (orderId: string, data?: any) => {
    try {
      if (!data) toast.info("Dispatching to OTO...");
      setDispatching(true);

      await axios.post(`/api/orders/${orderId}/dispatch`, { shippingData: data }); // Pass data if editing

      toast.success("🚀 Dispatched to OTO successfully!");
      setEditModalOpen(false);
      fetchShipments();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Dispatch failed. Check details.');
      fetchShipments(); // Refresh to show error state
    } finally {
      setDispatching(false);
    }
  };

  const onEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOrder) {
      handleDispatch(selectedOrder.id, editFormData);
    }
  };

  const refreshDashboard = () => {
    fetchShipments();
    toast.info("Dashboard refreshed");
  };

  // KPI Calculations
  const safeShipments = Array.isArray(shipments) ? shipments : [];
  const readyToShip = safeShipments.filter(s => s.is_paid && !s.delivery_id).length;
  const inTransit = safeShipments.filter(s => ['out_for_delivery', 'picked_up', 'created', 'processing'].includes(s.delivery_status)).length;
  const delivered = safeShipments.filter(s => s.delivery_status === 'delivered').length;
  const exceptions = safeShipments.filter(s => ['cancelled', 'returned', 'failed'].includes(s.delivery_status)).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">🚚 Logistics Dashboard</h1>
          <p className="text-gray-500">Real-time OTO shipment monitoring & management.</p>
        </div>
        <button
          onClick={refreshDashboard}
          className="flex items-center space-x-2 text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg text-sm font-bold border border-indigo-100 hover:bg-indigo-100 transition"
        >
          <RefreshCw size={16} />
          <span>Refresh</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard title="Ready to Ship" count={readyToShip} color="bg-yellow-50 text-yellow-600" icon={<Package size={24} />} />
        <KPICard title="In Transit" count={inTransit} color="bg-blue-50 text-blue-600" icon={<Truck size={24} />} />
        <KPICard title="Delivered" count={delivered} color="bg-green-50 text-green-600" icon={<CheckCircle size={24} />} />
        <KPICard title="Exceptions" count={exceptions} color="bg-red-50 text-red-600" icon={<AlertTriangle size={24} />} />
      </div>

      {/* Shipments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold">Recent Shipments</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Order Ref</th>
                <th className="p-4 font-semibold text-gray-600">Customer</th>
                <th className="p-4 font-semibold text-gray-600">OTO Tracking ID</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600">Destination</th>
                <th className="p-4 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">Loading shipment data...</td></tr>
              ) : shipments.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-400">No active shipments found.</td></tr>
              ) : shipments.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">
                    {order.order_number || order.id.substring(0, 8)}
                    {order.delivery_error ? (
                      <div className="text-xs text-red-500 mt-1 flex items-center gap-1" title={order.delivery_error}>
                        <AlertTriangle size={10} /> Delivery Failed
                      </div>
                    ) : null}
                  </td>
                  <td className="p-4 font-medium text-gray-700">
                    {order.shipping_name}
                    <div className="text-xs text-gray-400">{order.shipping_phone}</div>
                  </td>
                  <td className="p-4 text-sm font-mono text-gray-500">
                    {order.delivery_id ? (
                      <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-1 text-gray-700 font-bold">
                          <Truck size={14} className="text-indigo-500" />
                          {order.delivery_id}
                        </span>
                        {order.tracking_number && (
                          <a
                            href={`https://tryoto.com/track/${order.tracking_number}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-500 hover:underline flex items-center gap-1"
                          >
                            {order.tracking_number} <ExternalLink size={10} />
                          </a>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs italic">Not Assigned</span>
                    )}
                  </td>
                  <td className="p-4">
                    <StatusBadge status={order.delivery_status || (order.is_paid ? 'ready_to_ship' : 'pending')} error={order.delivery_error} />
                  </td>
                  <td className="p-4 text-gray-600 flex items-center">
                    <MapPin size={14} className="mr-1 text-gray-400" />
                    {order.shipping_city}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {/* Dispatch Actions */}
                      {!order.delivery_id && (
                        <button
                          onClick={() => handleDispatch(order.id)}
                          title="Send to OTO"
                          className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition"
                        >
                          <Send size={16} />
                        </button>
                      )}

                      {(order.delivery_status === 'failed' || !order.delivery_id) && (
                        <button
                          onClick={() => openEditModal(order)}
                          title="Edit & Retry"
                          className="p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition"
                        >
                          <Edit size={16} />
                        </button>
                      )}

                      {/* Tracking Actions */}
                      {order.delivery_id && (
                        <>
                          <button
                            onClick={() => handleTrack(order.id)}
                            title="Track Shipment"
                            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                          >
                            <ExternalLink size={16} />
                          </button>
                          <button
                            onClick={() => handlePrintLabel(order.id)}
                            title="Print Label"
                            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
                          >
                            <Printer size={16} />
                          </button>
                          <button
                            onClick={() => handleSync(order.id)}
                            title="Sync Status"
                            className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition"
                          >
                            <RefreshCw size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tracking Modal */}
      {trackingModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-fade-in relative">
            <button
              onClick={() => setTrackingModalOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Truck className="text-blue-600" /> Shipment Timeline
            </h3>

            {!trackingData ? (
              <div className="text-center py-12 flex flex-col items-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500">Fetching live updates from OTO...</p>
              </div>
            ) : (
              /* Existing Tracking UI */
              <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                {trackingData.events?.length > 0 ? trackingData.events.map((event: any, i: number) => (
                  <div key={i} className="flex gap-4 relative">
                    {i !== trackingData.events.length - 1 && (
                      <div className="absolute left-[11px] top-8 bottom-[-24px] w-0.5 bg-gray-200"></div>
                    )}
                    <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center z-10 ${i === 0 ? 'bg-blue-600 text-white shadow-blue-200 shadow-lg' : 'bg-gray-200'}`}>
                      {i === 0 ? <CheckCircle size={14} /> : <div className="w-2 h-2 bg-gray-400 rounded-full"></div>}
                    </div>
                    <div>
                      <p className={`font-medium ${i === 0 ? 'text-blue-900' : 'text-gray-600'}`}>
                        {event.status || event.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(event.timestamp).toLocaleString(undefined, {
                          dateStyle: 'medium', timeStyle: 'short'
                        })}
                      </p>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <Package className="mx-auto text-gray-300 mb-2" size={32} />
                    <p className="text-gray-500">No tracking events available yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit & Retry Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-fade-in relative">
            <button
              onClick={() => setEditModalOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Edit className="text-amber-600" /> Edit & Dispatch
            </h3>
            <p className="text-sm text-gray-500 mb-6">Correct shipping details for order <b>{selectedOrder?.order_number}</b>.</p>

            <form onSubmit={onEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                <input
                  type="text"
                  className="w-full mt-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number (966...)</label>
                <input
                  type="text"
                  className="w-full mt-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    className="w-full mt-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                    value={editFormData.city}
                    onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address/District</label>
                  <input
                    type="text"
                    className="w-full mt-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                    value={editFormData.address}
                    onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={dispatching}
                className="w-full mt-4 bg-amber-600 text-white font-bold py-3 rounded-xl hover:bg-amber-700 transition disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {dispatching ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={18} /> Resend to OTO
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

// Sub-components
const KPICard = ({ title, count, color, icon }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-2">{title}</p>
      <h3 className="text-3xl font-bold text-gray-800">{count}</h3>
    </div>
    <div className={`p-4 rounded-xl ${color}`}>
      {icon}
    </div>
  </div>
);

const StatusBadge = ({ status, error }: { status: string, error?: string | null }) => {
  let styles = "bg-gray-100 text-gray-600";
  if (['delivered'].includes(status)) styles = "bg-green-100 text-green-700 border border-green-200";
  if (['out_for_delivery', 'picked_up', 'in_transit'].includes(status)) styles = "bg-blue-100 text-blue-700 border border-blue-200";
  if (['cancelled', 'returned', 'failed'].includes(status)) styles = "bg-red-100 text-red-700 border border-red-200";
  if (['created', 'processing'].includes(status)) styles = "bg-amber-100 text-amber-700 border border-amber-200";
  if (status === 'ready_to_ship') styles = "bg-yellow-100 text-yellow-700 border border-yellow-200";

  return (
    <div className="flex flex-col items-start gap-1">
      <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${styles}`}>
        {status?.replace(/_/g, ' ') || 'Unknown'}
      </span>
      {error && status === 'failed' && (
        <span className="text-[10px] text-red-600 max-w-[120px] leading-tight">{error.substring(0, 50)}...</span>
      )}
    </div>
  );
};

export default DeliveryPage;
