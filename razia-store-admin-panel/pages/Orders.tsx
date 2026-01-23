
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Truck, CheckCircle, XCircle, Eye, Search, Filter, X, MapPin, CreditCard, Clock, Trash2, Phone, Package, Info, ChevronRight, RefreshCw, AlertCircle } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { orderService } from '../api/axiosConfig';
import toast from 'react-hot-toast';

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
        trackingNumber: o.tracking_number
      }));

      setOrders(mappedOrders);
    } catch (err: any) {
      console.error("Failed to fetch orders:", err);
      setError("Failed to load orders. Please try again.");
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

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (error) return (
    <div className="flex flex-col h-[50vh] items-center justify-center text-center space-y-4">
      <AlertCircle size={48} className="text-rose-500" />
      <h3 className="text-xl font-bold text-gray-800">Connection Error</h3>
      <p className="text-gray-500">{error}</p>
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
                      <p className="text-sm font-black text-gray-900">#{order.id}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">{order.createdAt}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-gray-800">User: {order.userId}</p>
                      <p className="text-xs text-gray-500 font-medium">{order.userPhone || 'No Phone'}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-black text-gray-900">${order.total?.toFixed(2)}</p>
                      <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">{order.paymentMethod}</p>
                    </td>
                    <td className="px-6 py-5">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                        className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl outline-none border-none cursor-pointer shadow-sm transition-all hover:scale-105 ${
                          order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                            order.status === 'shipped' ? 'bg-indigo-100 text-indigo-700' :
                              order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                                order.status === 'cancelled' ? 'bg-rose-100 text-rose-700' :
                                  'bg-gray-100 text-gray-600'
                          }`}
                      >
                        <option value="pending">PENDING</option>
                        <option value="processing">PROCESSING</option>
                        <option value="shipped">SHIPPED</option>
                        <option value="delivered">DELIVERED</option>
                        <option value="cancelled">CANCELLED</option>
                      </select>
                    </td>
                    <td className="px-6 py-5 text-right space-x-1">
                      <button onClick={() => setSelectedOrder(order)} className="p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"><Eye size={18} /></button>
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
            <div className="p-8 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Order #{selectedOrder.id}</h2>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Shipping Logistics</h3>
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="mt-1 text-indigo-500"><MapPin size={18} /></div>
                      <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Destination Address</p>
                        <p className="text-sm font-bold text-gray-800 leading-relaxed max-w-[200px] break-words">{selectedOrder.shippingAddress}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="mt-1 text-indigo-500"><Phone size={18} /></div>
                      <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Contact Phone</p>
                        <p className="text-sm font-black text-gray-800">{selectedOrder.userPhone || 'Not available'}</p>
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
                        <p className="text-sm font-black text-gray-800">{selectedOrder.paymentMethod}</p>
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
                        <th className="px-6 py-4">Product Unit</th>
                        <th className="px-6 py-4">Attributes</th>
                        <th className="px-6 py-4 text-center">Qty</th>
                        <th className="px-6 py-4 text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {selectedOrder.items.map((item: any, idx) => (
                        <tr key={idx} className="text-sm">
                          <td className="px-6 py-5">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                                <Package size={20} />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-bold text-gray-900">{item.product_name || item.nameEn || 'Product Name'}</span>
                                <span className="text-[10px] text-gray-400">ID #{item.productId || 'N/A'}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex flex-col space-y-1">
                              {item.color && <span className="text-[10px] font-black uppercase text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full w-fit">Color: {item.color}</span>}
                              {item.size && <span className="text-[10px] font-black uppercase text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full w-fit">Size: {item.size}</span>}
                            </div>
                          </td>
                          <td className="px-6 py-5 text-center font-black">{item.quantity}</td>
                          <td className="px-6 py-5 text-right font-black text-gray-900">
                            ${(parseFloat(item.price || item.unit_price || 0) * parseInt(item.quantity)).toFixed(2)}
                          </td>
                        </tr>
                      ))}
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
