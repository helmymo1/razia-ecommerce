import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

interface RefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  orderId: string;
}

const RefundModal: React.FC<RefundModalProps> = ({ isOpen, onClose, onSubmit, orderId }) => {
  const [reason, setReason] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit({ orderId, reason, pickupTime, phone });
    setLoading(false);
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md z-50 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-bold">Request Refund</Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Refund</label>
              <textarea
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full border rounded-md p-2 h-24"
                placeholder="Why do you want to return this item?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Pickup Time</label>
              <input
                type="datetime-local"
                required
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="w-full border rounded-md p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border rounded-md p-2"
                placeholder="+1234567890"
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={onClose}
                className="mr-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default RefundModal;
