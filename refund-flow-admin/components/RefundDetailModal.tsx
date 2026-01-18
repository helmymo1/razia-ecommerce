
import React from 'react';
import { RefundRequest, RefundStatus } from '../types';

interface RefundDetailModalProps {
  request: RefundRequest;
  onClose: () => void;
  onApprove: () => void;
  onCancel: () => void;
}

const RefundDetailModal: React.FC<RefundDetailModalProps> = ({ request, onClose, onApprove, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Request Details</h3>
            <p className="text-sm text-slate-500">{request.id}</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-white transition-all">
            <i className="fas fa-times text-lg"></i>
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Customer & Shipping Section */}
            <div className="space-y-6">
              <section>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Customer Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                      <i className="fas fa-user text-xs"></i>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{request.customerName}</p>
                      <p className="text-xs text-slate-500">{request.customerEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center">
                      <i className="fas fa-phone text-xs"></i>
                    </div>
                    <p className="text-sm text-slate-700">{request.phone}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <i className="fas fa-map-marker-alt text-xs"></i>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">{request.address}</p>
                  </div>
                </div>
              </section>

              <section>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Pickup Window</h4>
                <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 flex items-center gap-4">
                  <div className="text-indigo-600 text-xl">
                    <i className="far fa-calendar-alt"></i>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-indigo-800">Scheduled for Pickup</p>
                    <p className="text-sm font-bold text-indigo-900">{request.pickupTime}</p>
                  </div>
                </div>
              </section>
            </div>

            {/* Product & Reason Section */}
            <div className="space-y-6">
              <section>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Product Details</h4>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <div className="flex gap-4">
                    <img src={request.product.imageUrl} alt={request.product.name} className="h-16 w-16 rounded-lg object-cover border border-slate-200" />
                    <div>
                      <p className="text-sm font-bold text-slate-900 mb-1">{request.product.name}</p>
                      <p className="text-xs text-slate-500 mb-2">Category: {request.product.category}</p>
                      <p className="text-lg font-bold text-blue-600">${request.product.price.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Reason for Refund</h4>
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                  <p className="text-sm italic text-amber-900 leading-relaxed">"{request.reason}"</p>
                </div>
              </section>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Request Status:</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
              request.status === RefundStatus.PENDING ? 'bg-amber-100 text-amber-600' :
              request.status === RefundStatus.APPROVED ? 'bg-emerald-100 text-emerald-600' :
              'bg-rose-100 text-rose-600'
            }`}>
              {request.status}
            </span>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Close
            </button>
            {request.status === RefundStatus.PENDING && (
              <>
                <button 
                  onClick={onCancel}
                  className="px-5 py-2 text-sm font-medium text-white bg-rose-500 rounded-lg hover:bg-rose-600 transition-colors shadow-sm"
                >
                  Reject Request
                </button>
                <button 
                  onClick={onApprove}
                  className="px-5 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  Approve Refund
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundDetailModal;
