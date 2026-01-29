import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { Loader2 } from 'lucide-react';

interface OrderItem {
    id: string;
    name: string;
    image: string;
    qty: number;
    price: number;
    status: string;
}

interface Order {
    id: string;
    items: OrderItem[] | string;
}

interface RefundModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order | null;
    onSubmit: (data: any) => Promise<void>;
}

const RefundModal: React.FC<RefundModalProps> = ({ isOpen, onClose, order, onSubmit }) => {
    const { t, language } = useLanguage();
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [quantities, setQuantities] = useState<Record<string, number>>({});
    const [reason, setReason] = useState('');
    const [pickupTime, setPickupTime] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initial parsing of items
    const items = order ? (Array.isArray(order.items) ? order.items : JSON.parse(order.items as string)) : [];

    const toggleItem = (itemId: string) => {
        const newSet = new Set(selectedItems);
        if (newSet.has(itemId)) {
            newSet.delete(itemId);
            const newQty = { ...quantities };
            delete newQty[itemId];
            setQuantities(newQty);
        } else {
            newSet.add(itemId);
            setQuantities({ ...quantities, [itemId]: 1 }); // Default qty 1
        }
        setSelectedItems(newSet);
    };

    const updateQty = (itemId: string, qty: number, max: number) => {
        if (qty < 1) qty = 1;
        if (qty > max) qty = max;
        setQuantities({ ...quantities, [itemId]: qty });
    };

    const handleSubmit = async () => {
        if (selectedItems.size === 0) return;
        setIsSubmitting(true);
        try {
             const payload = {
                items: Array.from(selectedItems).map(id => ({
                    itemId: id,
                    quantity: quantities[id] || 1
                })),
                reason,
                pickupTime,
                phone,
                address
            };
            await onSubmit(payload);
            // Reset form
            setSelectedItems(new Set());
            setReason('');
            setPickupTime('');
            setPhone('');
            setAddress('');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!order) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{language === 'ar' ? 'طلب استرجاع' : 'Request Partial Refund'}</DialogTitle>
                    <DialogDescription>
                        {language === 'ar' ? 'اختر المنتجات التي تريد إرجاعها وأدخل التفاصيل.' : 'Select the items you want to return and provide pickup details.'}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-6">
                    {/* Item Selection */}
                    <div className="space-y-3">
                        <Label>{language === 'ar' ? 'المنتجات' : 'Select Items'}</Label>
                        <div className="border rounded-md p-2 space-y-2 max-h-[200px] overflow-y-auto">
                            {items.filter((i: any) => (!i.status || i.status === 'active' || i.status === 'delivered') && (!i.refund_status || i.refund_status === 'idle')).map((item: any) => (
                                <div key={item.id} className="flex items-center space-x-3 p-2 hover:bg-muted/50 rounded">
                                    <Checkbox 
                                        id={item.id} 
                                        checked={selectedItems.has(item.id)}
                                        onCheckedChange={() => toggleItem(item.id)}
                                    />
                                    <img src={item.image} className="w-10 h-10 object-cover rounded" alt={item.name} />
                                    <div className="flex-1">
                                        <div className="text-sm font-medium">{item.name}</div>
                                        <div className="text-xs text-muted-foreground">${item.price}</div>
                                    </div>
                                    {selectedItems.has(item.id) && (
                                        <Input 
                                            type="number" 
                                            className="w-16 h-8" 
                                            value={quantities[item.id] || 1}
                                            onChange={(e) => updateQty(item.id, parseInt(e.target.value), item.qty)}
                                            max={item.qty}
                                            min={1}
                                        />
                                    )}
                                </div>
                            ))}
                            {items.filter((i: any) => (!i.status || i.status === 'active' || i.status === 'delivered') && (!i.refund_status || i.refund_status === 'idle')).length === 0 && (
                                <div className="text-center py-4 text-sm text-muted-foreground">
                                    No eligible items for refund.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Reason */}
                    <div className="space-y-2">
                        <Label>{language === 'ar' ? 'سبب الاسترجاع' : 'Refund Reason'}</Label>
                        <Textarea 
                            placeholder="Wrong size, damaged, etc..." 
                            value={reason} 
                            onChange={(e) => setReason(e.target.value)} 
                        />
                    </div>

                    {/* Logistics */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>{language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</Label>
                            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+966..." />
                        </div>
                        <div className="space-y-2">
                            <Label>{language === 'ar' ? 'وقت الاستلام' : 'Pickup Time'}</Label>
                            <Input type="datetime-local" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} />
                        </div>
                    </div>

                    <div className="space-y-2">
                         <Label>{language === 'ar' ? 'عنوان الاستلام' : 'Pickup Address'}</Label>
                         <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Full address..." />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                        {language === 'ar' ? 'إلغاء' : 'Cancel'}
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting || selectedItems.size === 0 || !reason || !address || !phone}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {language === 'ar' ? 'تأكيد الطلب' : 'Submit Request'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default RefundModal;
