
import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  MapPin,
  Phone,
  Clock,
  CreditCard,
  ChevronDown,
  Search,
  Filter,
  Eye,
  MoreVertical,
  CheckCircle,
  XCircle,
  Truck,
  Box,
  AlertTriangle,
  RefreshCw,
  Send,
  ExternalLink,
  Package,
  Info,
  Trash2,
  Calendar,
  DollarSign,
  Download,
  Hash,
  X,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import api from '../api/axiosConfig';
import { orderService } from '../api/axiosConfig';
import toast from 'react-hot-toast';
import axios from 'axios';

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderService.getAll();

      // Transform backend data to frontend model if necessary
      // Assuming backend returns roughly matching structure, but verifying mappings is good
      const mappedOrders: Order[] = data.map((o: any) => ({
        id: o.id.toString(), // Ensure ID is string
        items: o.items || o.order_items || [],
        total: parseFloat(o.total || o.total_amount || 0),
        status: o.status,
        userId: o.user_id ? o.user_id.toString() : 'Guest',
        userPhone: o.shipping_phone || o.user_phone || 'N/A',
        shippingAddress: typeof o.shipping_address === 'string' ? o.shipping_address : JSON.stringify(o.shipping_address),
        paymentMethod: o.payment_method || 'Unknown',
        createdAt: new Date(o.created_at).toLocaleString(),
        trackingNumber: o.tracking_number,
        refundRequests: typeof o.refund_requests === 'string' ? JSON.parse(o.refund_requests) : (o.refund_requests || []),
        orderNumber: o.order_number || o.id,
        userName: o.user_name_en || o.user_name || 'Guest',
        userEmail: o.user_email || 'N/A',
        deliveryId: o.delivery_id,
        deliveryStatus: o.delivery_status,
        deliveryError: o.delivery_error
      }));

      setOrders(mappedOrders);
    } catch (err: any) {
      console.error("Failed to fetch orders:", err);
      setError(err.response?.data?.message || err.message || "Failed to load orders. Please try again.");
      toast.error("Could not fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (o.userPhone && o.userPhone.includes(searchTerm))
  );

  const updateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await orderService.updateStatus(orderId, newStatus);

      setOrders(orders.map(o => o.id === orderId ? {
        ...o,
        status: newStatus,
          // Simulate tracking generation if needed, or wait for backend response
          trackingNumber: newStatus === OrderStatus.SHIPPED && !o.trackingNumber ? 'PENDING-GEN' : o.trackingNumber
        } : o));

      toast.success(`Order ${orderId} updated to ${newStatus}`);

      // Refresh to get any backend-generated fields (like official tracking number)
      if (newStatus === OrderStatus.SHIPPED) {
        fetchOrders();
      }

    } catch (err) {
      toast.error("Failed to update status");
      console.error(err);
    }
  };

  const handleManageRequest = async (orderId: string, itemId: string, action: 'approve' | 'reject', type: 'refund' | 'cancel', requestId?: string) => {
    if (!confirm(`Are you sure you want to ${action} this ${type} request?`)) return;
    try {
      await orderService.manageRequest(orderId, { itemId, action, type, requestId });
      toast.success(`Request ${action}d successfully`);
      fetchOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to process request");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this order record? This action is permanent.')) {
      try {
        await orderService.delete(id);
        setOrders(prev => prev.filter(o => o.id !== id));
        if (selectedOrder?.id === id) setSelectedOrder(null);
        toast.success("Order deleted successfully");
      } catch (err) {
        toast.error("Failed to delete order");
      }
    }
  };

  const handleViewOrder = async (orderId: string) => {
    try {
      const tempOrder = orders.find(o => o.id === orderId);
      if (tempOrder) setSelectedOrder(tempOrder);

      const detailedOrder = await orderService.getById(orderId);

      const mappedDetail: Order = {
        id: detailedOrder.id.toString(),
        items: detailedOrder.orderItems || [],
        total: parseFloat(detailedOrder.total || 0),
        status: detailedOrder.status,
        userId: detailedOrder.user_id ? detailedOrder.user_id.toString() : 'Guest',
        userPhone: detailedOrder.shipping_phone || 'N/A',
        shippingAddress: typeof detailedOrder.shipping_address === 'string' ? detailedOrder.shipping_address : JSON.stringify(detailedOrder.shipping_address),
        paymentMethod: detailedOrder.payment_method,
        createdAt: new Date(detailedOrder.created_at).toLocaleString(),
        trackingNumber: detailedOrder.tracking_number,
        refundRequests: detailedOrder.refund_requests || [],
        orderNumber: detailedOrder.order_number,
        userName: detailedOrder.user_name,
        userEmail: detailedOrder.user_email,
        userPhoneAccount: detailedOrder.user_phone_account
      };

      setSelectedOrder(mappedDetail);
    } catch (err) {
      toast.error("Failed to load full order details");
      console.error(err);
    }
  };

  const handleDispatch = async (orderId: string) => {
    try {
      if (!confirm("Dispatch to OTO Delivery?")) return;
      const loader = toast.loading("Dispatching to OTO...");

      const { data } = await axios.post(`http://localhost:5000/api/orders/${orderId}/dispatch`);

      toast.dismiss(loader);
      if (data.success) {
        toast.success("🚀 Dispatched Successfully!");
        fetchOrders();
        // Update selected order if open
        if (selectedOrder?.id === orderId) {
          setSelectedOrder({ ...selectedOrder, deliveryId: data.deliveryId, deliveryStatus: 'created', deliveryError: undefined });
        }
      } else {
        toast.error("Dispatch Failed: " + (data.message || data.error));
        fetchOrders(); // Refresh to see error state
      }
    } catch (err: any) {
      toast.dismiss();
      toast.error(err.response?.data?.message || "Dispatch Error");
    }
  };

  const handleRefreshStatus = async (orderId: string) => {
    try {
      const loader = toast.loading("Syncing status...");
      const { data } = await axios.post(`http://localhost:5000/api/orders/${orderId}/sync`);
      toast.dismiss(loader);
      toast.success("Status Updated: " + data.status);
      fetchOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, deliveryStatus: data.status });
      }
    } catch (err) {
      toast.dismiss();
      toast.error("Sync Failed");
    }
  };

  // Helper logic for status priorities
  const getOrderBadge = (order: Order) => {
    // 1. Cancelled Priority
    if (order.status === 'cancelled') {
      return <span className="text-[10px] font-black uppercase text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">CANCELLED</span>;
    }

    // 2. Refund Priority (If any item is refunded/returned)
    // Safely check items array
    const items = Array.isArray(order.items) ? order.items : [];
    const hasRefund = items.some((i: any) => i.status === 'returned' || i.refund_status === 'approved' || i.item_status === 'refunded');
    if (hasRefund) {
      return <span className="text-[10px] font-black uppercase text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">REFUND PROCESSED</span>;
    }

    // 3. Delivered
    if (order.status === 'delivered') {
      return <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">DELIVERED</span>;
    }

    return null;
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (error) return (
    <div className="flex flex-col h-[50vh] items-center justify-center text-center space-y-4">
      <AlertCircle size={48} className="text-rose-500" />
      <h3 className="text-xl font-bold text-gray-800">Connection Error</h3>
      <p className="text-gray-500">{error || "Failed to load orders. Please checks console."}</p>
      <button onClick={fetchOrders} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
        Retry
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Order Management</h1>
          <p className="text-gray-500">Track shipments, process fulfillment, and manage cancellations.</p>
        </div>
        <button onClick={fetchOrders} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
          <RefreshCw size={20} className="text-gray-600" />
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/30">
          <div className="relative max-w-sm">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search ID, User, or Phone..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                <th className="px-6 py-5">Order Reference</th>
                <th className="px-6 py-5">Customer Profile</th>
                <th className="px-6 py-5">Transaction</th>
                <th className="px-6 py-5">Logistics Status</th>
                <th className="px-6 py-5">Tracking</th>
                <th className="px-6 py-5">Fulfillment</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    No orders found matching your search.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-5">
                      <p className="text-sm font-black text-gray-900">{order.orderNumber || '#' + order.id}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">{order.createdAt}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-gray-800">{order.userName || order.userId}</p>
                      <p className="text-xs text-gray-500 font-medium">{order.userPhone || 'No Phone'}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-black text-gray-900">${order.total?.toFixed(2)}</p>
                      <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">{order.paymentMethod}</p>
                    </td>
                    <td className="px-6 py-5">
                      {/* Logistics Status Column */}
                      {order.deliveryId ? (
                        <div className="flex flex-col items-start gap-1">
                          <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wide border ${order.deliveryStatus === 'delivered' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                            order.deliveryStatus === 'failed' ? 'bg-rose-100 text-rose-700 border-rose-200' :
                              'bg-blue-50 text-blue-600 border-blue-100'
                            }`}>
                            {order.deliveryStatus || 'Linked'}
                          </span>
                          {order.deliveryError && (
                            <span className="text-[9px] text-rose-500 font-bold max-w-[100px] leading-tight flex items-center gap-1">
                              <AlertTriangle size={10} /> Error
                            </span>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => handleDispatch(order.id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-[10px] font-bold uppercase tracking-wider shadow-sm transition-all hover:shadow-indigo-200"
                        >
                          <Send size={10} /> Dispatch
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      {/* Tracking Matrix */}
                      {order.trackingNumber ? (
                        <a
                          href={`https://tryoto.com/track/${order.trackingNumber}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-xs font-mono font-bold"
                        >
                          {order.trackingNumber} <ExternalLink size={10} />
                        </a>
                      ) : (
                        <span className="text-gray-300 text-[10px] uppercase font-bold">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                        className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl outline-none border-none cursor-pointer shadow-sm transition-all hover:scale-105 ${
                          order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          order.status === 'confirmed' ? 'bg-cyan-100 text-cyan-700' :
                            order.status === 'shipped' ? 'bg-indigo-100 text-indigo-700' :
                              order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                                order.status === 'cancelled' ? 'bg-rose-100 text-rose-700' :
                                  'bg-gray-100 text-gray-600'
                          }`}
                      >
                        <option value="pending">PENDING</option>
                        <option value="confirmed">CONFIRMED</option>
                        <option value="processing">PROCESSING</option>
                        <option value="shipped">SHIPPED</option>
                        <option value="delivered">DELIVERED</option>
                        <option value="cancelled">CANCELLED</option>
                        <option value="refunded">REFUNDED</option>
                      </select>
                    </td>
                    <td className="px-6 py-5 text-right flex items-center justify-end space-x-2">
                      <button onClick={() => handleViewOrder(order.id)} className="p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"><Eye size={18} /></button>
                      <button onClick={() => handleDelete(order.id)} className="p-2.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-white rounded-[2rem] w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in slide-in-from-bottom-8 duration-500 flex flex-col">

            {/* ALERT BANNER */}
            {selectedOrder.status === 'cancelled' && (
              <div className="bg-rose-500 text-white text-center py-2 text-xs font-black uppercase tracking-widest w-full">
                ⚠️ This Order is Cancelled
              </div>
            )}

            <div className="p-8 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Order {selectedOrder.orderNumber || '#' + selectedOrder.id}</h2>
                <p className="text-xs font-black text-indigo-600 uppercase tracking-widest mt-1">Full Logistics Data</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all shadow-sm">
                <X size={20} className="text-gray-900" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              <div className="bg-gray-50 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className={`p-4 rounded-2xl ${selectedOrder.status === 'shipped' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-300'} shadow-lg`}>
                    <Truck size={28} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Live Status</p>
                    <h3 className="text-xl font-black text-gray-900">{selectedOrder.status}</h3>
                  </div>
                </div>
                {selectedOrder.trackingNumber && (
                  <div className="px-6 py-3 bg-white rounded-2xl border border-gray-100 shadow-sm text-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Waybill ID</p>
                    <p className="text-sm font-black text-indigo-600">{selectedOrder.trackingNumber}</p>
                  </div>
                )}
              </div>

              {/* 🚚 DELIVERY & TRACKING SECTION (NEW) */}
              <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                    <Truck className="text-indigo-600" size={18} /> Delivery & Tracking
                  </h3>
                  {selectedOrder.deliveryId && (
                    <button onClick={() => handleRefreshStatus(selectedOrder.id)} className="text-[10px] font-bold text-gray-500 hover:text-indigo-600 flex items-center gap-1">
                      <RefreshCw size={12} /> Sync Status
                    </button>
                  )}
                </div>

                {selectedOrder.deliveryError && (
                  <div className="mb-4 bg-rose-50 border border-rose-100 rounded-xl p-3 flex items-start gap-3">
                    <AlertTriangle className="text-rose-600 mt-0.5" size={16} />
                    <div>
                      <p className="text-xs font-bold text-rose-700">Delivery Error</p>
                      <p className="text-xs text-rose-600 mt-1">{selectedOrder.deliveryError}</p>
                      <button onClick={() => handleDispatch(selectedOrder.id)} className="mt-2 text-[10px] bg-rose-600 text-white px-3 py-1 rounded-md font-bold uppercase hover:bg-rose-700">
                        Retry Dispatch
                      </button>
                    </div>
                  </div>
                )}

                {!selectedOrder.deliveryId ? (
                  <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-sm text-gray-500 font-medium mb-3">Order has not been dispatched to OTO Logistics yet.</p>
                    <button
                      onClick={() => handleDispatch(selectedOrder.id)}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:scale-105 transition-all flex items-center gap-2"
                    >
                      <Send size={16} /> Send to OTO
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">OTO ID</p>
                      <p className="text-sm font-mono font-bold text-gray-800 mt-1">{selectedOrder.deliveryId}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Status</p>
                      <p className={`text-sm font-bold mt-1 capitalize ${selectedOrder.deliveryStatus === 'delivered' ? 'text-emerald-600' : 'text-blue-600'
                        }`}>{selectedOrder.deliveryStatus?.replace(/_/g, ' ') || 'Processing'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</p>
                      {selectedOrder.trackingNumber ? (
                        <a href={`https://tryoto.com/track/${selectedOrder.trackingNumber}`} target="_blank" className="mt-1 flex items-center gap-1 text-sm font-bold text-indigo-600 hover:underline">
                          Track Package <ExternalLink size={12} />
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400 mt-1 block">No Link</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Shipping & Account</h3>
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="mt-1 text-indigo-500"><MapPin size={18} /></div>
                      <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Destination Address</p>
                        <p className="text-sm font-bold text-gray-800 leading-relaxed max-w-[200px] break-words">
                          {(() => {
                            try {
                              const addr = typeof selectedOrder.shippingAddress === 'string'
                                ? JSON.parse(selectedOrder.shippingAddress)
                                : selectedOrder.shippingAddress;
                              return (
                                <>
                                  {addr.firstName} {addr.lastName}<br />
                                  {addr.address}<br />
                                  {addr.city}{addr.zip ? `, ${addr.zip}` : ''}<br />
                                  {addr.country || 'Saudi Arabia'}
                                </>
                              );
                            } catch {
                              return selectedOrder.shippingAddress;
                            }
                          })()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="mt-1 text-indigo-500"><Phone size={18} /></div>
                      <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Contact Phone</p>
                        <p className="text-sm font-black text-gray-800">{selectedOrder.shipping_phone || selectedOrder.userPhone || 'Not available'}</p>
                      </div>
                    </div>
                    {/* New User Account Details */}
                    <div className="pt-4 border-t border-gray-50 mt-4 space-y-3">
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Registered User Profile</h4>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-500 font-bold">User Name:</span>
                          <span className="text-gray-900 font-medium text-right">{selectedOrder.userName || 'Guest'}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-500 font-bold">User ID:</span>
                          <span className="text-gray-900 font-mono text-[10px] text-right">{selectedOrder.userId}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-500 font-bold">Email:</span>
                          <span className="text-gray-900 font-medium text-right break-all">{selectedOrder.userEmail || 'N/A'}</span>
                        </div>
                        {selectedOrder.userPhoneAccount && (
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-500 font-bold">Account Phone:</span>
                            <span className="text-gray-900 font-medium text-right">{selectedOrder.userPhoneAccount}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Billing Summary</h3>
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="mt-1 text-emerald-500"><CreditCard size={18} /></div>
                      <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Payment Method</p>
                        <p className="text-sm font-black text-gray-800 uppercase">{selectedOrder.payment_method || selectedOrder.paymentMethod || 'Unknown'}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="mt-1 text-indigo-500"><Clock size={18} /></div>
                      <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Transaction Timestamp</p>
                        <p className="text-sm font-bold text-gray-800">{selectedOrder.createdAt}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Shopping Bag</h3>
                <div className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-[0.1em]">
                      <tr>
                        <th className="px-6 py-4">Product Details</th>
                        <th className="px-6 py-4">Attributes</th>
                        <th className="px-6 py-4 text-center">Qty</th>
                        <th className="px-6 py-4 text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {selectedOrder.items.map((item: any, idx) => {
                        const isCancelled = item.status === 'cancelled' || item.item_status === 'cancelled';
                        const isRefunded = item.status === 'returned' || item.item_status === 'refunded' || item.refund_status === 'approved';

                        return (
                          <tr key={idx} className={`text-sm ${isCancelled ? 'bg-rose-50/50' : isRefunded ? 'bg-gray-100/70 opacity-60' : ''}`}>
                            <td className="px-6 py-5">
                              <div className="flex items-start space-x-4">
                                <div className="w-16 h-16 bg-gray-50 rounded-xl flex-shrink-0 flex items-center justify-center text-gray-400 relative overflow-hidden border border-gray-100">
                                  {isCancelled && <div className="absolute inset-0 bg-rose-500/20 flex items-center justify-center z-10"><XCircle size={24} className="text-rose-600" /></div>}
                                  {/* Use image if available, assume full URL or prepend if needed */}
                                  {item.image ? (
                                    // @ts-ignore
                                    <img
                                      src={item.image.startsWith('http') ? item.image : `${import.meta.env.VITE_API_URL}/uploads/${item.image}`}
                                      alt=""
                                      className="w-full h-full object-cover"
                                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64?text=No+Img' }}
                                    />
                                  ) : (
                                    <Package size={24} strokeWidth={1.5} />
                                  )}
                                </div>
                                <div className="flex flex-col">
                                  <span className={`font-bold text-gray-900 text-base ${isCancelled ? 'line-through text-rose-800' : ''}`}>
                                    {item.product_name || item.nameEn || item.product_name_en || 'Product Name'}
                                  </span>
                                  {item.product_name_ar && <span className="text-xs font-medium text-gray-500 text-right font-arabic mb-1" dir="rtl">{item.product_name_ar}</span>}

                                  <div className="flex flex-wrap items-center gap-2 mt-1">
                                    <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
                                      <Hash size={10} className="text-gray-400" />
                                      <span className="text-xs font-mono font-bold text-gray-600">{item.sku || 'N/A'}</span>
                                    </div>
                                    {item.category_name && <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight border border-gray-200 px-1.5 py-0.5 rounded">{item.category_name}</span>}
                                  </div>

                                  <div className="mt-2 flex items-center gap-2">
                                    <span className="text-[10px] text-gray-400 font-medium">Item ID: #{item.product_id || item.productId || 'N/A'}</span>
                                  </div>

                                  {isCancelled && <span className="text-[10px] font-black text-rose-600 uppercase mt-2 bg-rose-50 px-2 py-0.5 rounded-full w-fit">⚠️ Cancelled</span>}
                                  {isRefunded && <span className="text-[10px] font-black text-gray-500 uppercase mt-2 bg-gray-200 px-2 py-0.5 rounded-full w-fit">↩️ Returned</span>}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex flex-col space-y-2">
                                {item.color && (
                                  <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full border border-gray-200 shadow-sm" style={{ backgroundColor: item.color }}></span>
                                    <div className="flex flex-col">
                                      <span className="text-[10px] uppercase font-bold text-gray-400">Color</span>
                                      <span className="text-xs font-bold text-gray-700">{item.color}</span>
                                    </div>
                                  </div>
                                )}
                                {item.size && (
                                  <div className="flex flex-col">
                                    <span className="text-[10px] uppercase font-bold text-gray-400">Size</span>
                                    <span className="text-xs font-bold text-gray-700 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded w-fit min-w-[30px] text-center">{item.size}</span>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-5 text-center">
                              <div className="inline-flex items-center justify-center bg-gray-50 rounded-lg px-3 py-1 border border-gray-100">
                                <span className="text-sm font-black text-gray-900">{item.quantity}</span>
                              </div>
                            </td>
                            <td className="px-6 py-5 text-right font-black text-gray-900">
                              ${(parseFloat(item.price || item.unit_price || 0) * parseInt(item.quantity)).toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-gray-900 text-white">
                      <tr>
                        <td colSpan={3} className="px-6 py-6 text-sm font-black uppercase tracking-[0.2em] text-gray-400">Total Purchase Value</td>
                        <td className="px-6 py-6 text-right text-2xl font-black">${selectedOrder.total?.toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            {/* Refund Requests Section */}
            {selectedOrder.refundRequests && selectedOrder.refundRequests.length > 0 && (
              <div className="p-8 border-t border-gray-100 bg-amber-50/30">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] flex items-center">
                    <AlertCircle size={16} className="mr-2" />
                    Refund & Return Requests
                  </h3>
                </div>

                <div className="space-y-4">
                  {selectedOrder.refundRequests.map((req: any, index: number) => {
                    const item = selectedOrder.items.find((i: any) => i.product === req.itemId || i._id === req.itemId || i.productId === req.itemId);
                    return (
                      <div key={index} className="bg-white p-6 rounded-2xl border border-amber-100 shadow-sm flex flex-col md:flex-row gap-6">
                        {/* Item Details */}
                        {item ? (
                          <div className="flex items-start gap-4 min-w-[200px]">
                            <div className="w-16 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                              {/* Use addBaseUrl if available or simple src */}
                              <img src={item.image || 'https://via.placeholder.com/100'} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">{item.name || item.nameEn}</p>
                              <p className="text-xs text-gray-500">{item.size} / {item.color}</p>
                              <p className="text-sm font-black text-indigo-600">${item.price}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="text-rose-500 font-bold text-xs p-4 border border-rose-100 rounded-lg">Item details not found (ID: {req.itemId})</div>
                        )}

                        {/* Request Info */}
                        <div className="flex-1 space-y-2">
                          <div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Reason</span>
                            <p className="text-sm text-gray-800 font-medium">{req.reason}</p>
                          </div>
                          {req.pickup_info && (
                            <div>
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pickup Info</span>
                              <p className="text-sm text-gray-600">{req.pickup_info}</p>
                            </div>
                          )}
                          <div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</span>
                            <span className={`ml-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${req.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                              req.status === 'rejected' ? 'bg-rose-100 text-rose-700' :
                                'bg-amber-100 text-amber-700'
                              }`}>
                              {req.status || 'Pending'}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        {(!req.status || req.status === 'pending') && (
                          <div className="flex flex-row md:flex-col gap-2 justify-center">
                            <button
                              onClick={() => handleManageRequest(selectedOrder.id, req.itemId, 'approve', 'refund', req._id)}
                              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-100"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleManageRequest(selectedOrder.id, req.itemId, 'reject', 'refund', req._id)}
                              className="px-4 py-2 bg-white border border-rose-200 text-rose-600 rounded-xl text-xs font-bold hover:bg-rose-50"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}



            <div className="p-8 border-t border-gray-100 bg-gray-50 flex justify-between items-center">

               <button 
                  onClick={() => handleDelete(selectedOrder.id)}
                  className="px-6 py-3 text-rose-600 font-black uppercase tracking-widest text-[10px] hover:bg-rose-50 rounded-2xl transition-all"
                >
                  Void Records
                </button>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="px-10 py-3 bg-gray-900 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-black transition-all shadow-xl shadow-gray-200"
                >
                  Confirm & Close
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
