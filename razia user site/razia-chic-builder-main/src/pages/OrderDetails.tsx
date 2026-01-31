
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Package, MapPin, CreditCard, ChevronLeft, Calendar, 
  Truck, CheckCircle, Clock, XCircle, RefreshCw
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import api from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface OrderItem {
  id: string;
  price: number;
  product_name_en: string;
  product_name_ar?: string;
  quantity: number;
  image: string;
  size?: string;
  color?: string;
  status?: string;
  refund_status?: string;
}

interface OrderDetail {
  id: string;
  created_at: string;
  status: string;
  payment_status: string;
  payment_method: string;
  total: number;
  subtotal: number;
  shipping_cost: number;
  tax_amount: number;
  discount_amount: number;
  shipping_name?: string;
  shipping_address?: any; // JSON or object
  shipping_phone?: string;
  shipping_city?: string;
  orderItems: OrderItem[];
  refund_requests?: any;
}

const OrderDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { t, language } = useLanguage();
    const navigate = useNavigate();
    const { toast } = useToast();
    
    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) fetchOrderDetails();
    }, [id]);

    const fetchOrderDetails = async () => {
        try {
            const res = await api.get(`/orders/${id}`);
            // Parse shipping address if string
            const data = res.data;
            if (typeof data.shipping_address === 'string') {
                try {
                    data.shipping_address = JSON.parse(data.shipping_address);
                } catch (e) { /* ignore */ }
            }
            setOrder(data);
        } catch (error: any) {
            console.error('Failed to fetch order details', error);
            toast({ 
                title: "Error", 
                description: error.response?.data?.message || "Failed to load order details", 
                variant: "destructive" 
            });
            // If 404/403, maybe redirect or show error
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
          case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
          case 'shipped': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
          case 'processing': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
          case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
          case 'refunded': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
          default: return 'bg-muted text-muted-foreground';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'delivered': return <CheckCircle className="w-5 h-5" />;
            case 'shipped': return <Truck className="w-5 h-5" />;
            case 'processing': return <Clock className="w-5 h-5" />;
            case 'cancelled': return <XCircle className="w-5 h-5" />;
            case 'refunded': return <RefreshCw className="w-5 h-5" />;
            default: return <Package className="w-5 h-5" />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p>{language === 'ar' ? 'جاري التحميل...' : 'Loading Order Details...'}</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-background pt-24 pb-12">
                 <Navbar />
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold mb-4">{language === 'ar' ? 'الطلب غير موجود' : 'Order Not Found'}</h2>
                    <Button onClick={() => navigate('/profile')}>{language === 'ar' ? 'العودة لحسابي' : 'Back to Profile'}</Button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background relative">
            <Navbar />
            <CartDrawer />
            
            <main className="pt-24 pb-12 sm:pb-16">
                <div className="container mx-auto px-4 lg:px-8">
                    
                    {/* Header */}
                    <div className="mb-8">
                        <Button variant="ghost" className="mb-4 pl-0 hover:pl-2 transition-all" onClick={() => navigate('/profile')}>
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            {language === 'ar' ? 'العودة' : 'Back to My Orders'}
                        </Button>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold font-heading flex items-center gap-3">
                                    {language === 'ar' ? 'طلب #' : 'Order #'}{order.id.slice(0, 8)}
                                    <Badge className={`${getStatusColor(order.status)} text-base px-3 py-1 flex items-center gap-1.5`}>
                                        {getStatusIcon(order.status)}
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </Badge>
                                </h1>
                                <p className="text-muted-foreground mt-2 flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(order.created_at).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Column - Items */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader><CardTitle>{language === 'ar' ? 'المنتجات' : 'Items'}</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    {order.orderItems.map((item) => (
                                        <div key={item.id} className="flex gap-4 p-4 border rounded-lg bg-card hover:bg-muted/20 transition-colors">
                                             <img 
                                                src={item.image || '/placeholder.png'} 
                                                alt={item.product_name_en} 
                                                className="w-20 h-20 object-cover rounded-md bg-muted"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg">{language === 'ar' ? (item.product_name_ar || item.product_name_en) : item.product_name_en}</h3>
                                                <div className="text-sm text-muted-foreground mt-1 space-y-1">
                                                    {(item.size || item.color) && (
                                                        <div className="flex gap-3">
                                                            {item.size && <span>{language === 'ar' ? 'المقاس:' : 'Size:'} {item.size}</span>}
                                                            {item.color && (
                                                                <span className="flex items-center gap-1">
                                                                    {language === 'ar' ? 'اللون:' : 'Color:'} 
                                                                    <span className="w-3 h-3 rounded-full border" style={{ backgroundColor: item.color }}></span>
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                    <div>{language === 'ar' ? 'الكمية:' : 'Qty:'} {item.quantity}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                                                <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} / each</p>
                                                {item.status && item.status !== 'active' && (
                                                     <Badge variant="outline" className="mt-2 text-xs">{item.status}</Badge>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Payment Status Info */}
                            <Card>
                                <CardHeader><CardTitle>{language === 'ar' ? 'معلومات الدفع' : 'Payment Information'}</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <CreditCard className="w-5 h-5 text-primary" />
                                            <div>
                                                <p className="font-medium capitalize">{order.payment_method}</p>
                                                <p className="text-sm text-muted-foreground capitalize">{language === 'ar' ? 'الحالة:' : 'Status:'} {order.payment_status}</p>
                                            </div>
                                        </div>
                                         <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'}>
                                            {order.payment_status?.toUpperCase()}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column - Summary & Shipping */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader><CardTitle>{language === 'ar' ? 'ملخص الطلب' : 'Order Summary'}</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">{language === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
                                        <span>${Number(order.subtotal).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">{language === 'ar' ? 'الشحن' : 'Shipping'}</span>
                                        <span>{Number(order.shipping_cost) === 0 ? (language === 'ar' ? 'مجاني' : 'Free') : `$${Number(order.shipping_cost).toFixed(2)}`}</span>
                                    </div>
                                    {Number(order.discount_amount) > 0 && (
                                         <div className="flex justify-between text-green-600">
                                            <span>{language === 'ar' ? 'الخصم' : 'Discount'}</span>
                                            <span>-${Number(order.discount_amount).toFixed(2)}</span>
                                        </div>
                                    )}
                                    {Number(order.tax_amount) > 0 && (
                                         <div className="flex justify-between">
                                            <span>{language === 'ar' ? 'الضريبة' : 'Tax'}</span>
                                            <span>${Number(order.tax_amount).toFixed(2)}</span>
                                        </div>
                                    )}
                                    <Separator />
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>{language === 'ar' ? 'الإجمالي' : 'Total'}</span>
                                        <span>${Number(order.total).toFixed(2)}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader><CardTitle>{language === 'ar' ? 'عنوان الشحن' : 'Shipping Address'}</CardTitle></CardHeader>
                                <CardContent className="text-sm">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-primary mt-1" />
                                        <div className="space-y-1">
                                            <p className="font-semibold">{order.shipping_name}</p>
                                            {typeof order.shipping_address === 'object' ? (
                                                <>
                                                    <p>{order.shipping_address.address_line1}</p>
                                                    <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}</p>
                                                    <p>{order.shipping_address.country}</p>
                                                </>
                                            ) : (
                                                <p>{order.shipping_city}</p>
                                            )}
                                            <p className="text-muted-foreground pt-2">{order.shipping_phone}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default OrderDetails;
