
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Package, MapPin, CreditCard, Heart, Settings, LogOut, 
  ChevronRight, Edit2, Plus, Truck, CheckCircle, Clock, Trash2
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import ProfileDecor from '@/components/graphics/ProfileDecor';
import CardArcDecor from '@/components/graphics/CardArcDecor';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { useToast } from '@/hooks/use-toast';

// Interfaces
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
  created_at: string;
  status: string;
  total: number;
  items: OrderItem[] | string;
}

interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  country: string;
  has_password?: boolean;
}

interface WishlistItem {
  id: string; // Wishlist ID
  product_id: string;
  name_en: string; // Product Name
  price: string;
  image_url: string;
}

interface Address {
    id: string;
    name: string; // Label
    address_line1: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone: string;
    is_default: boolean;
}

const Profile: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  
  // Loading States
  const [loading, setLoading] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);

  // Editing States
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  // Forms
  const [profileForm, setProfileForm] = useState({
    first_name: '', last_name: '', phone: '', email: '' 
  });

  const [addressForm, setAddressForm] = useState({
    name: '', address_line1: '', city: '', state: '', zip: '', country: '', phone: '', is_default: false
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '', newPassword: '', confirmPassword: ''
  });

  const { user, loading: authLoading } = useAuth();

  // Initial Data Fetch (User Profile)
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/auth');
        return;
      }
      fetchUserProfile();
    }
  }, [user, authLoading, navigate]);

  // Tab Data Fetch
  useEffect(() => {
    if (activeTab === 'orders') fetchOrders();
    if (activeTab === 'wishlist') fetchWishlist();
    if (activeTab === 'addresses') fetchAddresses();
  }, [activeTab]);

  const fetchUserProfile = async () => {
    try {
      const res = await api.get('/auth/me'); // Or /api/users/profile if separate
      setUserData(res.data);
      setProfileForm({
        first_name: res.data.first_name || '',
        last_name: res.data.last_name || '',
        phone: res.data.phone || '',
        email: res.data.email || ''
      });
    } catch (error) {
      console.error('Failed to fetch profile', error);
      toast({ title: "Session Expired", description: "Please login again", variant: "destructive" });
      localStorage.removeItem('token');
      navigate('/auth');
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders/mine');
      const parsedOrders = res.data.map((o: any) => ({
          ...o,
          items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items,
          total: parseFloat(o.total)
      }));
      setOrders(parsedOrders);
    } catch (error: any) {
      console.error('Failed to fetch orders', error);
      console.log("❌ [Frontend] FETCH ORDERS ERROR:", error.message || error);
      toast({
        title: "Error fetching orders",
        description: error.response?.data?.message || "Failed to load orders. Please check console.",
        variant: "destructive"
      });
      // Do NOT logout here. Let the user see the error.
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users/wishlist');
      setWishlist(res.data);
    } catch (error) {
      console.error('Failed to fetch wishlist', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    setLoading(true);
    try {
        const res = await api.get('/users/addresses');
        setAddresses(res.data);
    } catch (error) {
        console.error('Failed to fetch addresses', error);
    } finally {
        setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setSavingProfile(true);
    try {
      const res = await api.put('/users/profile', profileForm);
      setUserData(res.data);
      setIsEditingProfile(false);
      toast({ title: "Success", description: "Profile updated successfully" });
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Failed to update profile", variant: "destructive" });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
        await api.post('/users/wishlist', { product_id: productId }); // Toggle removes it
        fetchWishlist(); // Refresh
        toast({ title: "Removed", description: "Item removed from wishlist" });
    } catch (error) {
        toast({ title: "Error", description: "Failed to remove item", variant: "destructive" });
    }
  };

  const resetAddressForm = () => {
      setAddressForm({ name: '', address_line1: '', city: '', state: '', zip: '', country: '', phone: '', is_default: false });
      setEditingAddressId(null);
      setIsAddingAddress(false);
  }

  const handleSaveAddress = async () => {
      setSavingAddress(true);
      try {
          if (editingAddressId) {
              await api.put(`/users/addresses/${editingAddressId}`, addressForm);
              toast({ title: "Success", description: "Address updated" });
          } else {
              await api.post('/users/addresses', addressForm);
              toast({ title: "Success", description: "Address added" });
          }
          fetchAddresses();
          resetAddressForm();
      } catch (error: any) {
          toast({ title: "Error", description: error.response?.data?.message || "Failed to save address", variant: "destructive" });
      } finally {
          setSavingAddress(false);
      }
  }

  const handleEditAddress = (addr: Address) => {
      setAddressForm({
          name: addr.name || '',
          address_line1: addr.address_line1 || '',
          city: addr.city || '',
          state: addr.state || '',
          zip: addr.zip || '',
          country: addr.country || '',
          phone: addr.phone || '',
          is_default: addr.is_default
      });
      setEditingAddressId(addr.id);
      setIsAddingAddress(true);
  }

  const handleDeleteAddress = async (id: string) => {
      if (!confirm('Are you sure you want to delete this address?')) return;
      try {
          await api.delete(`/users/addresses/${id}`);
          toast({ title: "Deleted", description: "Address deleted" });
          fetchAddresses();
      } catch (error) {
           toast({ title: "Error", description: "Failed to delete address", variant: "destructive" });
      }
  }

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
        return;
    }
    setSavingPassword(true);
    try {
        await api.put('/users/password', {
            current_password: passwordForm.currentPassword,
            new_password: passwordForm.newPassword
        });
        toast({ title: "Success", description: "Password updated successfully" });
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
        toast({ title: "Error", description: error.response?.data?.message || "Failed to update password", variant: "destructive" });
    } finally {
        setSavingPassword(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm(language === 'ar' ? 'هل أنت متأكد من إلغاء هذا الطلب؟' : 'Are you sure you want to cancel this order?')) return;
    try {
      await api.post(`/orders/${orderId}/cancel`);
      toast({ title: "Cancelled", description: "Order cancelled successfully" });
      fetchOrders();
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Failed to cancel order", variant: "destructive" });
    }
  };

  const handleCancelItem = async (orderId: string, itemId: string) => {
    if (!confirm(language === 'ar' ? 'هل أنت متأكد من إلغاء هذا المنتج؟' : 'Are you sure you want to cancel this item?')) return;
    try {
      await api.put(`/orders/${orderId}/item/${itemId}/status`, {
        status: 'cancelled',
        reason: 'User requested via profile'
      });
      toast({ title: "Cancelled", description: "Item cancelled successfully" });
      fetchOrders(); // Refresh to show new status
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Failed to cancel item", variant: "destructive" });
    }
  };

  const handleRequestRefund = async (orderId: string) => {
    // Typically opens a modal or navigates to a refund form. For now, we'll just trigger the endpoint or show a prompt.
    // Assuming a simple request for now as per previous context.
    const reason = prompt(language === 'ar' ? 'يرجى إدخال سبب الاسترجاع:' : 'Please enter reason for refund:');
    if (!reason) return;

    try {
      await api.post(`/orders/${orderId}/refund`, { reason });
      toast({ title: "Requested", description: "Refund request submitted" });
      fetchOrders();
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Failed to request refund", variant: "destructive" });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'shipped': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'processing': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const sidebarItems = [
    { id: 'overview', label: language === 'ar' ? 'نظرة عامة' : 'Overview', icon: User },
    { id: 'orders', label: language === 'ar' ? 'طلباتي' : 'My Orders', icon: Package },
    { id: 'addresses', label: language === 'ar' ? 'العناوين' : 'Addresses', icon: MapPin },
    { id: 'wishlist', label: language === 'ar' ? 'قائمة الأمنيات' : 'Wishlist', icon: Heart },
    { id: 'settings', label: language === 'ar' ? 'الإعدادات' : 'Settings', icon: Settings },
  ];

  if (!userData) return <div className="min-h-screen pt-24 flex justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-background relative">
      <ProfileDecor />
      <Navbar />
      <CartDrawer />
      
      <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 relative z-10">
        <div className="container mx-auto px-3 sm:px-4 lg:px-8">
          
          {/* Header Mobile */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-4 sm:mb-8 lg:hidden">
            <h1 className="font-heading text-2xl font-bold">{language === 'ar' ? 'حسابي' : 'My Account'}</h1>
          </motion.div>

          {/* Mobile Tabs */}
          <div className="lg:hidden mb-4 -mx-3 px-3 overflow-x-auto scrollbar-hide">
             <div className="flex gap-2 pb-2 min-w-max">
               {sidebarItems.map((item) => (
                 <button
                   key={item.id}
                   onClick={() => setActiveTab(item.id)}
                   className={cn('flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-colors whitespace-nowrap', activeTab === item.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}
                 >
                   <item.icon className="w-3.5 h-3.5" /> {item.label}
                 </button>
               ))}
             </div>
           </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Desktop */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="hidden lg:block lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                     <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                      {userData.first_name?.[0]?.toUpperCase()}{userData.last_name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold">{userData.first_name} {userData.last_name}</h3>
                      <p className="text-sm text-muted-foreground">{userData.email}</p>
                    </div>
                  </div>
                  <nav className="space-y-1">
                    {sidebarItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={cn('w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors', activeTab === item.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted')}
                      >
                        <item.icon className="w-5 h-5" /> {item.label}
                      </button>
                    ))}
                    <Separator className="my-4" />
                    <button onClick={() => { localStorage.removeItem('token'); navigate('/login'); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-coral hover:bg-coral/10">
                      <LogOut className="w-5 h-5" /> {language === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}
                    </button>
                  </nav>
                </CardContent>
              </Card>
            </motion.div>

            {/* Main Content */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-3">
              
              {/* OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Card className="bg-primary/5 border-primary/20">
                        <CardContent className="p-6 flex items-center gap-4">
                            <Package className="w-8 h-8 text-primary" />
                            <div>
                                <h3 className="text-2xl font-bold">{orders.length}</h3>
                                <p className="text-muted-foreground">{language === 'ar' ? 'الطلبات' : 'Total Orders'}</p>
                            </div>
                        </CardContent>
                      </Card>
                      {/* Can add more stats here */}
                   </div>

                   <Card>
                      <CardHeader className="flex flex-row justify-between items-center">
                          <CardTitle>{language === 'ar' ? 'المعلومات الشخصية' : 'Personal Information'}</CardTitle>
                          <Button variant="outline" size="sm" onClick={() => setIsEditingProfile(!isEditingProfile)}>
                            <Edit2 className="w-4 h-4 mr-2" />
                            {isEditingProfile ? (language === 'ar' ? 'إلغاء' : 'Cancel') : (language === 'ar' ? 'تعديل' : 'Edit')}
                          </Button>
                      </CardHeader>
                      <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                              <div>
                                  <Label>{language === 'ar' ? 'الاسم الأول' : 'First Name'}</Label>
                                  {isEditingProfile ? (
                                      <Input value={profileForm.first_name} onChange={e => setProfileForm({...profileForm, first_name: e.target.value})} />
                                  ) : (
                                      <div className="font-medium p-2">{userData.first_name}</div>
                                  )}
                              </div>
                              <div>
                                  <Label>{language === 'ar' ? 'الاسم الأخير' : 'Last Name'}</Label>
                                   {isEditingProfile ? (
                                      <Input value={profileForm.last_name} onChange={e => setProfileForm({...profileForm, last_name: e.target.value})} />
                                  ) : (
                                      <div className="font-medium p-2">{userData.last_name}</div>
                                  )}
                              </div>
                              <div>
                                  <Label>{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</Label>
                                  <div className="font-medium p-2 text-muted-foreground">{userData.email}</div>
                              </div>
                              <div>
                                  <Label>{language === 'ar' ? 'رقم الهاتف' : 'Phone'}</Label>
                                  {isEditingProfile ? (
                                      <Input value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})} />
                                  ) : (
                                      <div className="font-medium p-2">{userData.phone || 'N/A'}</div>
                                  )}
                              </div>
                          </div>
                          {isEditingProfile && (
                              <div className="flex justify-end pt-4">
                                  <Button onClick={handleUpdateProfile} disabled={savingProfile}>
                                      {savingProfile ? 'Saving...' : (language === 'ar' ? 'حفظ' : 'Save Changes')}
                                  </Button>
                              </div>
                          )}
                      </CardContent>
                   </Card>
                </div>
              )}

              {/* ORDERS */}
              {activeTab === 'orders' && (
                <Card>
                  <CardHeader><CardTitle>{language === 'ar' ? 'تاريخ الطلبات' : 'Order History'}</CardTitle></CardHeader>
                  <CardContent>
                    {loading ? <div>Loading...</div> : orders.length === 0 ? <div className="text-center py-8">No orders found</div> : (
                        <div className="space-y-4">
                            {orders.map(order => (
                                <div key={order.id} className="border rounded-lg p-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <div>
                                            <p className="font-bold">Order #{order.id.slice(0,8)}</p>
                                            <p className="text-sm text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                                            <p className="font-bold mt-1">${order.total.toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        {(Array.isArray(order.items) ? order.items : []).map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-4 text-sm">
                                                <img src={item.image} className="w-10 h-10 rounded object-cover bg-muted" alt={item.name} />
                                            <div className="flex-1">
                                              <div>{item.name} <span className="text-muted-foreground">x{item.qty}</span></div>
                                              {(item.status || 'active') === 'cancelled' && <Badge variant="destructive" className="mt-1 text-xs">Cancelled</Badge>}
                                              {(item.status || 'active') === 'returned' && <Badge variant="secondary" className="mt-1 text-xs">Returned</Badge>}
                                            </div>
                                            <div className="text-right">
                                              <div>${Number(item.price).toFixed(2)}</div>
                                              {['pending', 'processing'].includes(order.status) && (item.status || 'active') !== 'cancelled' && (item.status || 'active') !== 'returned' && (
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  className="h-6 text-red-500 hover:text-red-600 hover:bg-red-50 px-2 mt-1 text-xs"
                                                  onClick={() => handleCancelItem(order.id, item.id)}
                                                >
                                                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                                                </Button>
                                              )}
                                            </div>
                                            </div>
                                        ))}
                                    </div>

                                {/* Order Actions */}
                                <div className="flex gap-3 justify-end mt-4 pt-4 border-t">
                                  {['pending', 'processing'].includes(order.status) && (
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => handleCancelOrder(order.id)}
                                    >
                                      {language === 'ar' ? 'إلغاء الطلب' : 'Cancel Order'}
                                    </Button>
                                  )}
                                  {order.status === 'delivered' && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleRequestRefund(order.id)}
                                    >
                                      {language === 'ar' ? 'طلب استرجاع' : 'Request Refund'}
                                    </Button>
                                  )}
                                  <Button variant="outline" size="sm" asChild>
                                    <Link to={`/orders/${order.id}`}>
                                      {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                                    </Link>
                                  </Button>
                                </div>
                                </div>
                            ))}
                        </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* ADDRESSES */}
              {activeTab === 'addresses' && (
                <Card>
                    <CardHeader className="flex flex-row justify-between items-center">
                        <CardTitle>{language === 'ar' ? 'عناوين الشحن' : 'Shipping Addresses'}</CardTitle>
                        {!isAddingAddress && (
                            <Button size="sm" onClick={() => setIsAddingAddress(true)}>
                                <Plus className="w-4 h-4 mr-2" />
                                {language === 'ar' ? 'إضافة عنوان' : 'Add New Address'}
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent>
                        {isAddingAddress ? (
                             <div className="space-y-4 border p-4 rounded-lg bg-muted/20">
                                <h3 className="font-semibold">{editingAddressId ? (language === 'ar' ? 'تعديل العنوان' : 'Edit Address') : (language === 'ar' ? 'عنوان جديد' : 'New Address')}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label>Label (e.g. Home, Work)</Label>
                                        <Input value={addressForm.name} onChange={e => setAddressForm({...addressForm, name: e.target.value})} placeholder="Home" />
                                    </div>
                                    <div>
                                        <Label>{language === 'ar' ? 'العنوان' : 'Address Line'}</Label>
                                        <Input value={addressForm.address_line1} onChange={e => setAddressForm({...addressForm, address_line1: e.target.value})} placeholder="123 Street" />
                                    </div>
                                    <div>
                                        <Label>{language === 'ar' ? 'المدينة' : 'City'}</Label>
                                        <Input value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} />
                                    </div>
                                    <div>
                                        <Label>{language === 'ar' ? 'الولاية / المنطقة' : 'State / Province'}</Label>
                                        <Input value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})} />
                                    </div>
                                    <div>
                                        <Label>{language === 'ar' ? 'الرمز البريدي' : 'Zip Code'}</Label>
                                        <Input value={addressForm.zip} onChange={e => setAddressForm({...addressForm, zip: e.target.value})} />
                                    </div>
                                    <div>
                                        <Label>{language === 'ar' ? 'الدولة' : 'Country'}</Label>
                                        <Input value={addressForm.country} onChange={e => setAddressForm({...addressForm, country: e.target.value})} />
                                    </div>
                                    <div>
                                        <Label>{language === 'ar' ? 'رقم الهاتف' : 'Phone'}</Label>
                                        <Input value={addressForm.phone} onChange={e => setAddressForm({...addressForm, phone: e.target.value})} />
                                    </div>
                                     <div className="flex items-center space-x-2 pt-8">
                                        <input 
                                            type="checkbox" 
                                            id="isDefault"
                                            checked={addressForm.is_default}
                                            onChange={e => setAddressForm({...addressForm, is_default: e.target.checked})}
                                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                        <Label htmlFor="isDefault" className="mb-0 cursor-pointer">Set as default address</Label>
                                    </div>
                                </div>
                                <div className="flex gap-2 justify-end mt-4">
                                    <Button variant="outline" onClick={resetAddressForm}>Cancel</Button>
                                    <Button onClick={handleSaveAddress} disabled={savingAddress}>
                                        {savingAddress ? 'Saving...' : 'Save Address'}
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {loading && addresses.length === 0 ? <div>Loading...</div> : addresses.length === 0 ? <div className="text-center py-8 text-muted-foreground">No addresses saved. Add one!</div> : (
                                    <div className="grid gap-4">
                                        {addresses.map(addr => (
                                            <div key={addr.id} className={cn("border rounded-lg p-4 relative", addr.is_default && "border-primary bg-primary/5")}>
                                                {addr.is_default && <Badge className="absolute top-2 right-2">Default</Badge>}
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-bold flex items-center gap-2">
                                                            <MapPin className="w-4 h-4" /> {addr.name}
                                                        </h4>
                                                        <p className="text-sm mt-1">{addr.address_line1}</p>
                                                        <p className="text-sm">{addr.city}, {addr.state} {addr.zip}</p>
                                                        <p className="text-sm">{addr.country}</p>
                                                        <p className="text-sm text-muted-foreground mt-1">{addr.phone}</p>
                                                    </div>
                                                    <div className="flex gap-2 mt-8 md:mt-0">
                                                        <Button variant="ghost" size="sm" onClick={() => handleEditAddress(addr)}>
                                                            <Edit2 className="w-4 h-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDeleteAddress(addr.id)}>
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
              )}

              {/* WISHLIST */}
              {activeTab === 'wishlist' && (
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {loading ? <div>Loading...</div> : wishlist.length === 0 ? <div className="col-span-full text-center py-10">Your wishlist is empty</div> : (
                        wishlist.map(item => (
                            <Card key={item.id} className="group relative">
                                <div className="aspect-square bg-muted relative overflow-hidden">
                                    <img src={item.image_url} alt={item.name_en} className="w-full h-full object-cover" />
                                    <button 
                                        onClick={() => handleRemoveFromWishlist(item.product_id)}
                                        className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white text-coral transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <CardContent className="p-3">
                                    <h3 className="font-medium truncate">{item.name_en}</h3>
                                    <p className="font-bold text-primary">${Number(item.price).toFixed(2)}</p>
                                    <Button className="w-full mt-2" size="sm" variant="outline">
                                        {language === 'ar' ? 'أضف للسلة' : 'Add to Cart'}
                                    </Button>
                                </CardContent>
                            </Card>
                        ))
                    )}
                 </div>
              )}

              {/* SETTINGS */}
              {activeTab === 'settings' && (
                <Card>
                    <CardHeader><CardTitle>{language === 'ar' ? 'تغيير كلمة المرور' : 'Change Password'}</CardTitle></CardHeader>
                    <CardContent>
                        {!userData.has_password ? (
                            <div className="p-6 bg-gray-50 dark:bg-muted/50 rounded-lg border border-gray-200 dark:border-muted text-center">
                                <div className="text-4xl mb-2">🔒</div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-foreground">Social Account Linked</h3>
                                <p className="text-gray-500 dark:text-muted-foreground mt-1">
                                    You are logged in via Google/Apple. You manage your security through their platform.
                                </p>
                            </div>
                        ) : (
                            <div className="max-w-md space-y-4">
                                <div>
                                    <Label>{language === 'ar' ? 'كلمة المرور الحالية' : 'Current Password'}</Label>
                                    <Input type="password" value={passwordForm.currentPassword} onChange={e => setPasswordForm({...passwordForm, currentPassword: e.target.value})} />
                                </div>
                                <div>
                                    <Label>{language === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}</Label>
                                    <Input type="password" value={passwordForm.newPassword} onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})} />
                                </div>
                                <div>
                                    <Label>{language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}</Label>
                                    <Input type="password" value={passwordForm.confirmPassword} onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})} />
                                </div>
                                <Button onClick={handleChangePassword} disabled={savingPassword}>
                                    {savingPassword ? 'Updating...' : 'Update Password'}
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
              )}

            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
