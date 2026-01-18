
import React from 'react';
import { RefundRequest, RefundStatus } from '../types';

interface RefundTableProps {
  requests: RefundRequest[];
  onViewDetails: (request: RefundRequest) => void;
  onAction: (request: RefundRequest, status: RefundStatus) => void;
}

const RefundTable: React.FC<RefundTableProps> = ({ requests, onViewDetails, onAction }) => {
  const getStatusBadge = (status: RefundStatus) => {
    const base = "px-2.5 py-1 rounded-full text-xs font-semibold";
    switch (status) {
      case RefundStatus.PENDING:
        return `${base} bg-amber-100 text-amber-700`;
      case RefundStatus.APPROVED:
        return `${base} bg-emerald-100 text-emerald-700`;
      case RefundStatus.CANCELLED:
        return `${base} bg-rose-100 text-rose-700`;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Product</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Requested</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {requests.map((req) => (
            <tr key={req.id} className="hover:bg-slate-50 transition-colors group">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <img src={req.product.imageUrl} alt={req.product.name} className="h-10 w-10 rounded-md object-cover border border-slate-200" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{req.product.name}</p>
                    <p className="text-xs text-slate-500">ID: {req.product.id}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-slate-900">{req.customerName}</div>
                <div className="text-xs text-slate-500">{req.customerEmail}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-slate-900">{new Date(req.requestedAt).toLocaleDateString()}</div>
                <div className="text-xs text-slate-500">{new Date(req.requestedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </td>
              <td className="px-6 py-4">
                <span className={getStatusBadge(req.status)}>{req.status}</span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <button 
                    onClick={() => onViewDetails(req)}
                    className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                    title="View Details"
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  {req.status === RefundStatus.PENDING && (
                    <>
                      <button 
                        onClick={() => onAction(req, RefundStatus.APPROVED)}
                        className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"
                        title="Approve"
                      >
                        <i className="fas fa-check"></i>
                      </button>
                      <button 
                        onClick={() => onAction(req, RefundStatus.CANCELLED)}
                        className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Cancel"
                      >
                        <i className="fas fa-times"></i>
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
  );
};

export default RefundTable;
