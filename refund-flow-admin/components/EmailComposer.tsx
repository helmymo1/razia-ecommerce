
import React, { useState, useEffect } from 'react';
import { RefundRequest, RefundStatus } from '../types';
import { generateRefundEmail } from '../services/geminiService';

interface EmailComposerProps {
  request: RefundRequest;
  newStatus: RefundStatus;
  onClose: () => void;
  onSend: (content: string) => void;
}

const EmailComposer: React.FC<EmailComposerProps> = ({ request, newStatus, onClose, onSend }) => {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDraft = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const draft = await generateRefundEmail(request, newStatus);
        setContent(draft);
      } catch (err) {
        setError("Could not generate AI draft. Please enter email content manually.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDraft();
  }, [request, newStatus]);

  const subject = newStatus === RefundStatus.APPROVED 
    ? `Update: Refund Approved for Order #${request.id.split('-')[1]}`
    : `Important: Information regarding your Refund Request #${request.id.split('-')[1]}`;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl animate-in slide-in-from-bottom-4 duration-300 flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${newStatus === RefundStatus.APPROVED ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
              <i className={`fas ${newStatus === RefundStatus.APPROVED ? 'fa-envelope-open-text' : 'fa-envelope'}`}></i>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Email Notification</h3>
              <p className="text-xs text-slate-500">Review and edit before sending to {request.customerEmail}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="p-6 space-y-4 flex-1 overflow-y-auto">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">To</label>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700">
              {request.customerName} &lt;{request.customerEmail}&gt;
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Subject</label>
            <input 
              readOnly 
              value={subject}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-800 focus:outline-none"
            />
          </div>

          <div className="space-y-1 flex-1 flex flex-col min-h-[300px]">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Message Content</label>
              {isLoading && (
                <span className="text-[10px] text-blue-600 font-bold flex items-center gap-2">
                  <i className="fas fa-circle-notch fa-spin"></i>
                  Generating AI Draft...
                </span>
              )}
            </div>
            
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isLoading}
              className={`w-full flex-1 p-4 border border-slate-200 rounded-xl text-sm leading-relaxed text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none transition-all ${isLoading ? 'opacity-50' : ''}`}
              placeholder="Start typing your email here..."
            />
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg text-xs text-rose-600 flex items-center gap-2">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end items-center gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => onSend(content)}
            disabled={isLoading || !content.trim()}
            className={`px-8 py-2.5 text-sm font-bold text-white rounded-xl shadow-lg transition-all flex items-center gap-2 ${
              isLoading || !content.trim() 
                ? 'bg-slate-300 cursor-not-allowed' 
                : newStatus === RefundStatus.APPROVED 
                  ? 'bg-emerald-600 hover:bg-emerald-700 hover:-translate-y-0.5' 
                  : 'bg-rose-500 hover:bg-rose-600 hover:-translate-y-0.5'
            }`}
          >
            <i className="fas fa-paper-plane text-xs"></i>
            {newStatus === RefundStatus.APPROVED ? 'Approve & Send Email' : 'Reject & Send Email'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailComposer;
