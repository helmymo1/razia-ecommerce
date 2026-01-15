import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Truck, 
  CreditCard, 
  CheckCircle, 
  ChevronRight, 
  ChevronLeft,
  MapPin,
  Phone,
  Mail,
  User,
  Lock,
  Gift,
  Percent,
  X,
  AlertCircle
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { z } from 'zod';

// Payment method logos
import madaLogo from '@/assets/payments/mada.png';
import tamaraLogo from '@/assets/payments/tamara.png';
import tabbyLogo from '@/assets/payments/tabby.png';
import { orderService } from '@/services/api';

// Validation schemas
const shippingSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(50),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number').max(15),
  address: z.string().min(5, 'Please enter your full address').max(200),
  city: z.string().min(2, 'Please enter your city').max(50),
  state: z.string().min(2, 'Please enter your state/region').max(50),
  zipCode: z.string().min(4, 'Please enter a valid postal code').max(10),
  country: z.string().min(2, 'Please select your country').max(50),
});

const paymentSchema = z.object({
  cardNumber: z.string().regex(/^\d{16}$/, 'Card number must be 16 digits'),
  cardName: z.string().min(2, 'Please enter the name on card').max(100),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Invalid expiry date (MM/YY)'),
  cvv: z.string().regex(/^\d{3,4}$/, 'CVV must be 3-4 digits'),
});

type ShippingData = z.infer<typeof shippingSchema>;
type PaymentData = z.infer<typeof paymentSchema>;

interface Address {
  id: string; // UUID from backend
  title: string;
  address_line1: string;
  city: string;
  state?: string;
  zip?: string;
  country?: string;
  phone: string;
  is_default?: number;
}

const steps = [
  { id: 1, name: 'Cart', icon: ShoppingBag },
  { id: 2, name: 'Shipping', icon: Truck },
  { id: 3, name: 'Payment', icon: CreditCard },
  { id: 4, name: 'Confirmation', icon: CheckCircle },
];

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, subtotal, removeItem, updateQuantity, clearCart } = useCart();
  const { language } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  
  // Protect Route & Pre-fill
  React.useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Please login to checkout');
      navigate('/auth?redirect=/checkout');
    }
  }, [user, authLoading, navigate]);

  React.useEffect(() => {
    if (user) {
      setShippingData(prev => ({
        ...prev,
        firstName: user.first_name || prev.firstName,
        lastName: user.last_name || prev.lastName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        address: user.address || prev.address,
        city: user.city || prev.city,
        zipCode: user.zip || prev.zipCode,
        country: user.country || prev.country
      }));
    }
  }, [user]);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [shippingData, setShippingData] = useState<ShippingData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Saudi Arabia',
  });
  
  const [paymentData, setPaymentData] = useState<PaymentData>({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });
  
  const [saveAddress, setSaveAddress] = useState(false);
  const [saveCard, setSaveCard] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<string>('');

  // Address Book State
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newAddressTitle, setNewAddressTitle] = useState('');

  // Fetch Addresses
  React.useEffect(() => {
    if (user) {
      axios.get('http://localhost:5000/api/addresses', {
        headers: { Authorization: `Bearer ${localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')!).token : ''}` }
      })
      .then(res => {
        setSavedAddresses(res.data);
        if (res.data.length > 0) {
          // Auto-select default or first
          const defaultAddr = res.data.find((a: Address) => a.is_default) || res.data[0];
          setSelectedAddressId(defaultAddr.id);
          // Pre-fill shipping data for visual consistency if needed, though we rely on selectedAddressId
          updateShippingDataFromAddress(defaultAddr);
        } else {
          setIsAddingNew(true);
        }
      })
      .catch(err => console.error('Failed to fetch addresses', err));
    }
  }, [user]);

  const updateShippingDataFromAddress = (addr: Address) => {
    setShippingData(prev => ({
      ...prev,
      address: addr.address_line1,
      city: addr.city,
      state: addr.state || '',
      zipCode: addr.zip || '',
      country: addr.country || 'Saudi Arabia',
      phone: addr.phone
    }));
  };

  const handleAddressSelect = (id: string) => {
    setSelectedAddressId(id);
    const addr = savedAddresses.find(a => a.id === id);
    if (addr) updateShippingDataFromAddress(addr);
    setIsAddingNew(false);
  };

  const handleSaveNewAddress = async () => {
    if (!validateShipping()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')!).token : '';
      const payload = {
        name: newAddressTitle || 'Home', // Default title
        address_line1: shippingData.address,
        city: shippingData.city,
        state: shippingData.state,
        zip: shippingData.zipCode,
        country: shippingData.country,
        phone: shippingData.phone,
        is_default: savedAddresses.length === 0 // Make default if it's the first one
      };

      const res = await axios.post('http://localhost:5000/api/addresses', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const newAddr = res.data;
      setSavedAddresses([newAddr, ...savedAddresses]);
      setSelectedAddressId(newAddr.id);
      setIsAddingNew(false);
      toast.success('Address saved and selected');
    } catch (error) {
      toast.error('Failed to save address');
      console.error(error);
    }
  };

  // Fixed shipping cost
  const shippingCost = 25;
  const promoDiscount = appliedPromo ? (subtotal * appliedPromo.discount) / 100 : 0;
  const tax = (subtotal - promoDiscount) * 0.15; // 15% VAT
  const total = subtotal - promoDiscount + shippingCost + tax;

  const applyPromoCode = () => {
    if (!promoCode.trim()) {
      toast.error('Please enter a promo code');
      return;
    }

    // Simulate promo code validation
    const validCodes: Record<string, number> = {
      'WELCOME10': 10,
      'RAZIA15': 15,
      'VIP20': 20,
    };

    const code = promoCode.toUpperCase();
    if (validCodes[code]) {
      setAppliedPromo({ code, discount: validCodes[code] });
      toast.success(`Promo code applied! ${validCodes[code]}% discount`);
    } else if (code.startsWith('RAZIA')) {
      // Referral codes from outfit builder
      setAppliedPromo({ code, discount: 10 });
      toast.success('Referral code applied! 10% discount');
    } else {
      toast.error('Invalid promo code');
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoCode('');
    toast.success('Promo code removed');
  };

  const validateShipping = (): boolean => {
    try {
      shippingSchema.parse(shippingData);
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          if (error.path[0]) {
            newErrors[error.path[0] as string] = error.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const validatePayment = (): boolean => {
    try {
      paymentSchema.parse(paymentData);
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          if (error.path[0]) {
            newErrors[error.path[0] as string] = error.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (items.length === 0) {
        toast.error('Your cart is empty');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (isAddingNew) {
         // If adding new, try to save first
         handleSaveNewAddress().then(() => {
             // If successful (checked by implication of state change, but simple here:
             // We can just verify if isAddingNew became false. 
             // Actually handleSaveNewAddress is async. Ideally we wait.
             // For now, let's just checking validity.
             if (validateShipping()) {
                 // We will trigger the save inside the button or here.
                 // Let's assume the "Save Address" button is used for saving, 
                 // and "Next" is only enabled if an address is selected.
                 // BUT standard UX: "Next" on form = Save & Next.
                 // So we need to await the save.
             }
         });
         // The logic above is tricky with the current synchronous handleNextStep.
         // Let's modify handleSaveNewAddress to return success boolean or handle transition.
         // Simplification: Enforce using the "Save & Use" button in the form UI, 
         // and "Next" button in the main flow is for when an address IS selected.
         if (!selectedAddressId) {
             toast.error('Please save your address first');
             return;
         }
         setCurrentStep(3);
      } else {
        if (selectedAddressId) {
            setCurrentStep(3);
        } else {
            toast.error('Please select an address');
        }
      }
    } else if (currentStep === 3) {
      if (!paymentMethod) {
        toast.error(language === 'ar' ? 'يرجى اختيار طريقة الدفع' : 'Please select a payment method');
        return;
      }
      
      const selectedMethod = paymentMethods.find(m => m.id === paymentMethod);
      
      // Only validate card details for card-based payment methods
      if (selectedMethod?.requiresCard) {
        if (validatePayment()) {
          processPayment();
        } else {
          toast.error(language === 'ar' ? 'يرجى ملء جميع تفاصيل الدفع بشكل صحيح' : 'Please fill in all payment details correctly');
        }
      } else {
        // For non-card methods (Apple Pay, Tabby, Tamara), proceed directly
        processPayment();
      }
    }
  };

  const processPayment = async () => {
    try {
      toast.loading('Processing payment...');
      
      // Extract product ID from cart item ID (format: "id-timestamp-random")
      const orderItems = items.map(item => ({
        product_id: parseInt(item.id.toString().split('-')[0]),
        quantity: item.quantity
      }));

      const response = await orderService.createOrder({
        order_items: orderItems,
        shipping_info: {
          firstName: shippingData.firstName,
          lastName: shippingData.lastName,
          email: shippingData.email,
          phone: shippingData.phone,
          // Use selected address details if available
          address: selectedAddressId ? savedAddresses.find(a => a.id === selectedAddressId)?.address_line1 || shippingData.address : shippingData.address,
          city: selectedAddressId ? savedAddresses.find(a => a.id === selectedAddressId)?.city || shippingData.city : shippingData.city,
          zipCode: selectedAddressId ? savedAddresses.find(a => a.id === selectedAddressId)?.zip || shippingData.zipCode : shippingData.zipCode,
          country: selectedAddressId ? savedAddresses.find(a => a.id === selectedAddressId)?.country || shippingData.country : shippingData.country,
          state: selectedAddressId ? savedAddresses.find(a => a.id === selectedAddressId)?.state || shippingData.state : shippingData.state
        },
        save_to_profile: false // Handled by Address Book logic now
      });

      // 1. Get Token (from localStorage as AuthContext might lag or be complex object)
      const token = localStorage.getItem('userInfo') 
        ? JSON.parse(localStorage.getItem('userInfo')!).token 
        : null;

      if (!token) {
          toast.error("Authentication Error: Please login again.");
          return;
      }

      // 2. Initiate Payment (Paymob)
      // Note: orderItems passed here are for Paymob display/metadata. 
      // The actual order is already created in DB.
      const paymentResponse = await axios.post(
          'http://localhost:5000/api/payment/initiate',
          { 
              items: items.map(item => ({...item, price: item.price})), // Ensure correct structure
              shipping_info: shippingData,
              order_id: response.id // Pass the backend Order ID to link them
          },
          {
              headers: {
                  Authorization: `Bearer ${token}` // <--- THE FIX
              }
          }
      );

      toast.dismiss();
      
      if (paymentResponse.data.iframe_url) {
        window.location.href = paymentResponse.data.iframe_url;
      } else {
        // Fallback if no iframe (e.g. error caught)
        setOrderNumber(response.id);
        clearCart();
        setCurrentStep(4);
        toast.success('Order placed!');
      }

    } catch (error: any) {
      toast.dismiss();
      toast.error(error.response?.data?.message || error.message || 'Failed to place order');
      console.error('Order creation/payment failed:', error);
    }
  };

  const formatCardNumber = (value: string) => {
    return value.replace(/\D/g, '').slice(0, 16);
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              currentStep === step.id
                ? 'bg-primary text-primary-foreground'
                : currentStep > step.id
                ? 'bg-teal text-teal-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            <step.icon className="w-4 h-4" />
            <span className="hidden sm:inline font-medium text-sm">{step.name}</span>
          </div>
          {index < steps.length - 1 && (
            <ChevronRight className="w-5 h-5 text-muted-foreground mx-2" />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderCartStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <h2 className="font-heading text-2xl font-bold">Review Your Cart</h2>
      
      {items.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">Your cart is empty</p>
          <Button onClick={() => navigate('/shop')}>Continue Shopping</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 p-4 bg-card rounded-xl border border-border">
              <div className="w-20 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={item.image}
                  alt={language === 'ar' ? item.nameAr : item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-heading font-semibold">
                  {language === 'ar' ? item.nameAr : item.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {item.size && `Size: ${item.size}`} {item.color && `• Color: ${item.color}`}
                </p>
                <p className="font-heading font-bold text-primary mt-1">
                  SAR {item.price.toLocaleString()}
                </p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-muted-foreground hover:text-coral transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2 bg-muted rounded-lg">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-muted-foreground/10 rounded-lg"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-muted-foreground/10 rounded-lg"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Promo Code */}
          <div className="p-4 bg-card rounded-xl border border-border">
            <div className="flex items-center gap-2 mb-3">
              <Gift className="w-5 h-5 text-gold" />
              <span className="font-medium">Promo Code</span>
            </div>
            {appliedPromo ? (
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <Percent className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-green-700 dark:text-green-400">
                    {appliedPromo.code} - {appliedPromo.discount}% off
                  </span>
                </div>
                <button onClick={removePromoCode} className="text-red-500 hover:text-red-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={applyPromoCode} variant="outline">
                  Apply
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );

  const renderShippingStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <h2 className="font-heading text-2xl font-bold">Shipping Information</h2>

      {/* Contact Information */}
      <div className="p-6 bg-card rounded-xl border border-border space-y-4">
        <h3 className="font-heading font-semibold flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Contact Information
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={shippingData.firstName}
              onChange={(e) => setShippingData({ ...shippingData, firstName: e.target.value })}
              className={errors.firstName ? 'border-red-500' : ''}
            />
            {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
          </div>
          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={shippingData.lastName}
              onChange={(e) => setShippingData({ ...shippingData, lastName: e.target.value })}
              className={errors.lastName ? 'border-red-500' : ''}
            />
            {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={shippingData.email}
                onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>
          <div>
            <Label htmlFor="phone">Phone *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                value={shippingData.phone}
                onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
          </div>
        </div>
      </div>

      {/* Address Selection Grid */}
      {!isAddingNew && savedAddresses.length > 0 ? (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {savedAddresses.map((addr) => (
              <div 
                key={addr.id}
                onClick={() => handleAddressSelect(addr.id)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedAddressId === addr.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="font-bold flex items-center gap-2">
                       <MapPin className="w-4 h-4 text-primary" />
                       {addr.title}
                       {addr.is_default ? <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Default</span> : null}
                    </p>
                    <p className="text-sm">{addr.address_line1}</p>
                    <p className="text-sm text-muted-foreground">{addr.city}, {addr.zip}</p>
                    <p className="text-sm text-muted-foreground">{addr.phone}</p>
                  </div>
                  {selectedAddressId === addr.id && <CheckCircle className="w-5 h-5 text-primary" />}
                </div>
              </div>
            ))}
          </div>
          
          <Button 
            variant="outline" 
            className="w-full py-6 border-dashed"
            onClick={() => {
              setIsAddingNew(true); 
              setSelectedAddressId(null);
              // Clear shipping data address fields but keep contact
              setShippingData(prev => ({...prev, address: '', city: '', state: '', zipCode: ''}));
            }}
          >
            + Use a different address
          </Button>
        </div>
      ) : (
        /* Add New Address Form */
        <div className="p-6 bg-card rounded-xl border border-border space-y-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-semibold flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                {savedAddresses.length > 0 ? 'Add New Address' : 'Shipping Address'}
                </h3>
                {savedAddresses.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={() => setIsAddingNew(false)}>Cancel</Button>
                )}
            </div>

            {/* Contact Info (Always needed for order, maybe pre-filled) */}
            <div className="mb-4">
                 <Label>Address Title (e.g., Home, Office)</Label>
                 <Input 
                    placeholder="Home"
                    value={newAddressTitle} 
                    onChange={e => setNewAddressTitle(e.target.value)} 
                 />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                 <div>
                    <Label>First Name</Label>
                    <Input value={shippingData.firstName} onChange={e => setShippingData({...shippingData, firstName: e.target.value})} />
                 </div>
                 <div>
                    <Label>Last Name</Label>
                    <Input value={shippingData.lastName} onChange={e => setShippingData({...shippingData, lastName: e.target.value})} />
                 </div>
            </div>

            <div>
            <Label htmlFor="address">Street Address *</Label>
            <Input
                id="address"
                value={shippingData.address}
                onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                className={errors.address ? 'border-red-500' : ''}
                placeholder="Street name, building number..."
            />
            {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
            <div>
                <Label htmlFor="city">City *</Label>
                <Input
                id="city"
                value={shippingData.city}
                onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                className={errors.city ? 'border-red-500' : ''}
                />
            </div>
            <div>
                <Label htmlFor="state">State/Region *</Label>
                <Input
                id="state"
                value={shippingData.state}
                onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })}
                />
            </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
            <div>
                <Label htmlFor="zipCode">Postal Code *</Label>
                <Input
                id="zipCode"
                value={shippingData.zipCode}
                onChange={(e) => setShippingData({ ...shippingData, zipCode: e.target.value })}
                />
            </div>
            <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                id="phone"
                value={shippingData.phone}
                onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                />
            </div>
            </div>

            <Button onClick={handleSaveNewAddress} className="w-full mt-4">
                Save & Use This Address
            </Button>
        </div>
      )}

    </motion.div>
  );

  const paymentMethods = [
    { id: 'mada', name: 'Mada', nameAr: 'مدى', logo: madaLogo, requiresCard: true },
    { id: 'visa', name: 'Visa / Mastercard', nameAr: 'فيزا / ماستركارد', logo: null, requiresCard: true },
    { id: 'apple_pay', name: 'Apple Pay', nameAr: 'أبل باي', logo: null, requiresCard: false },
    { id: 'tabby', name: 'Tabby', nameAr: 'تابي', logo: tabbyLogo, requiresCard: false, description: 'Pay in 4 interest-free payments' },
    { id: 'tamara', name: 'Tamara', nameAr: 'تمارا', logo: tamaraLogo, requiresCard: false, description: 'Split in 3 payments, no interest' },
  ];

  const selectedPaymentMethod = paymentMethods.find(m => m.id === paymentMethod);

  const renderPaymentStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <h2 className="font-heading text-2xl font-bold">Payment Details</h2>

      {/* Security Note */}
      <div className="flex items-start gap-3 p-4 bg-teal/10 border border-teal/30 rounded-xl">
        <Lock className="w-5 h-5 text-teal mt-0.5" />
        <div>
          <p className="font-medium text-foreground">Secure Payment</p>
          <p className="text-sm text-muted-foreground">
            Your payment information is encrypted and secure. We never store your full card details.
          </p>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="p-6 bg-card rounded-xl border border-border space-y-4">
        <h3 className="font-heading font-semibold flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-primary" />
          {language === 'ar' ? 'اختر طريقة الدفع' : 'Choose Payment Method'}
        </h3>
        
        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                paymentMethod === method.id 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => setPaymentMethod(method.id)}
            >
              <div className="flex items-center gap-4">
                <RadioGroupItem value={method.id} id={method.id} />
                {method.logo ? (
                  <img 
                    src={method.logo} 
                    alt={method.name} 
                    className="h-8 w-auto object-contain"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    {method.id === 'visa' && (
                      <div className="flex gap-1">
                        <div className="px-2 py-1 bg-[#1A1F71] text-white rounded text-xs font-bold">VISA</div>
                        <div className="px-2 py-1 bg-gradient-to-r from-[#EB001B] to-[#F79E1B] text-white rounded text-xs font-bold">MC</div>
                      </div>
                    )}
                    {method.id === 'apple_pay' && (
                      <div className="px-3 py-1 bg-black text-white rounded text-xs font-medium flex items-center gap-1">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.0425 12.6963C17.0292 10.9321 17.8108 9.61083 19.3975 8.62333C18.5133 7.38083 17.1558 6.69583 15.3517 6.55667C13.6458 6.42167 11.78 7.54083 11.0808 7.54083C10.3392 7.54083 8.69583 6.60583 7.36833 6.60583C4.63 6.65083 1.71667 8.66833 1.71667 12.9338C1.71667 14.1805 1.9375 15.468 2.37917 16.7963C2.9625 18.5421 5.12917 22.8763 7.3875 22.8013C8.62583 22.7688 9.50417 21.9555 11.1 21.9555C12.6517 21.9555 13.4658 22.8013 14.85 22.8013C17.1367 22.768 19.0933 18.8455 19.6475 17.0955C16.9225 15.8113 17.0425 12.7788 17.0425 12.6963ZM14.6083 5.03917C15.8833 3.52417 15.765 2.14083 15.7283 1.66667C14.6025 1.7325 13.2958 2.42583 12.5483 3.29667C11.7242 4.23083 11.2333 5.3825 11.3358 6.54C12.5617 6.63167 13.6817 6.01583 14.6083 5.03917Z"/>
                        </svg>
                        Pay
                      </div>
                    )}
                  </div>
                )}
                <div>
                  <Label htmlFor={method.id} className="cursor-pointer font-medium">
                    {language === 'ar' ? method.nameAr : method.name}
                  </Label>
                  {method.description && (
                    <p className="text-xs text-muted-foreground">{method.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </RadioGroup>

        {!paymentMethod && (
          <p className="text-sm text-amber-600 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {language === 'ar' ? 'يرجى اختيار طريقة الدفع' : 'Please select a payment method'}
          </p>
        )}
      </div>

      {/* Card Details - Only show for card-based payment methods */}
      {selectedPaymentMethod?.requiresCard && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="p-6 bg-card rounded-xl border border-border space-y-4"
        >
          <h3 className="font-heading font-semibold flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            {language === 'ar' ? 'معلومات البطاقة' : 'Card Information'}
          </h3>
          
          <div>
            <Label htmlFor="cardNumber">{language === 'ar' ? 'رقم البطاقة *' : 'Card Number *'}</Label>
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={paymentData.cardNumber.replace(/(\d{4})/g, '$1 ').trim()}
              onChange={(e) => setPaymentData({ 
                ...paymentData, 
                cardNumber: formatCardNumber(e.target.value) 
              })}
              className={errors.cardNumber ? 'border-red-500' : ''}
              maxLength={19}
            />
            {errors.cardNumber && <p className="text-xs text-red-500 mt-1">{errors.cardNumber}</p>}
          </div>

          <div>
            <Label htmlFor="cardName">{language === 'ar' ? 'الاسم على البطاقة *' : 'Name on Card *'}</Label>
            <Input
              id="cardName"
              placeholder="JOHN DOE"
              value={paymentData.cardName}
              onChange={(e) => setPaymentData({ ...paymentData, cardName: e.target.value.toUpperCase() })}
              className={errors.cardName ? 'border-red-500' : ''}
            />
            {errors.cardName && <p className="text-xs text-red-500 mt-1">{errors.cardName}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiryDate">{language === 'ar' ? 'تاريخ الانتهاء *' : 'Expiry Date *'}</Label>
              <Input
                id="expiryDate"
                placeholder="MM/YY"
                value={paymentData.expiryDate}
                onChange={(e) => setPaymentData({ 
                  ...paymentData, 
                  expiryDate: formatExpiryDate(e.target.value) 
                })}
                className={errors.expiryDate ? 'border-red-500' : ''}
                maxLength={5}
              />
              {errors.expiryDate && <p className="text-xs text-red-500 mt-1">{errors.expiryDate}</p>}
            </div>
            <div>
              <Label htmlFor="cvv">CVV *</Label>
              <Input
                id="cvv"
                placeholder="123"
                value={paymentData.cvv}
                onChange={(e) => setPaymentData({ 
                  ...paymentData, 
                  cvv: e.target.value.replace(/\D/g, '').slice(0, 4) 
                })}
                className={errors.cvv ? 'border-red-500' : ''}
                maxLength={4}
                type="password"
              />
              {errors.cvv && <p className="text-xs text-red-500 mt-1">{errors.cvv}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="saveCard"
              checked={saveCard}
              onCheckedChange={(checked) => setSaveCard(checked as boolean)}
            />
            <Label htmlFor="saveCard" className="text-sm cursor-pointer">
              {language === 'ar' ? 'حفظ هذه البطاقة للمشتريات المستقبلية' : 'Save this card for future purchases'}
            </Label>
          </div>
        </motion.div>
      )}

      {/* BNPL Info for Tabby/Tamara */}
      {(paymentMethod === 'tabby' || paymentMethod === 'tamara') && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-4 bg-accent/10 border border-accent/30 rounded-xl"
        >
          <p className="text-sm text-muted-foreground">
            {paymentMethod === 'tabby' 
              ? (language === 'ar' 
                  ? 'ستتم إعادة توجيهك إلى تابي لإكمال الدفع على 4 أقساط بدون فوائد.' 
                  : 'You will be redirected to Tabby to complete payment in 4 interest-free installments.')
              : (language === 'ar'
                  ? 'ستتم إعادة توجيهك إلى تمارا لتقسيم المبلغ على 3 دفعات بدون فوائد.'
                  : 'You will be redirected to Tamara to split into 3 payments with no interest.')}
          </p>
        </motion.div>
      )}

      {/* Apple Pay Info */}
      {paymentMethod === 'apple_pay' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-4 bg-accent/10 border border-accent/30 rounded-xl"
        >
          <p className="text-sm text-muted-foreground">
            {language === 'ar' 
              ? 'ستتم مطالبتك بتأكيد الدفع عبر Apple Pay عند النقر على "إتمام الطلب".'
              : 'You will be prompted to confirm payment via Apple Pay when you click "Place Order".'}
          </p>
        </motion.div>
      )}
    </motion.div>
  );

  const renderConfirmationStep = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6"
    >
      <div className="w-20 h-20 bg-teal rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-10 h-10 text-teal-foreground" />
      </div>
      
      <div>
        <h2 className="font-heading text-3xl font-bold text-foreground mb-2">
          Order Confirmed!
        </h2>
        <p className="text-muted-foreground">
          Thank you for your purchase. Your order has been placed successfully.
        </p>
      </div>

      <div className="p-6 bg-card rounded-xl border border-border inline-block">
        <p className="text-sm text-muted-foreground mb-1">Order Number</p>
        <p className="font-heading text-2xl font-bold text-primary">{orderNumber}</p>
      </div>

      <div className="p-6 bg-muted rounded-xl max-w-md mx-auto text-left space-y-3">
        <h3 className="font-heading font-semibold">What's next?</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-teal mt-0.5" />
            <span>You'll receive a confirmation email shortly</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-teal mt-0.5" />
            <span>We'll notify you when your order ships</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-teal mt-0.5" />
            <span>Track your order in your profile</span>
          </li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button onClick={() => navigate('/profile')} variant="outline">
          View Order History
        </Button>
        <Button onClick={() => navigate('/shop')} className="bg-primary text-primary-foreground">
          Continue Shopping
        </Button>
      </div>
    </motion.div>
  );

  const renderOrderSummary = () => (
    <div className="p-6 bg-card rounded-xl border border-border sticky top-28 space-y-4">
      <h3 className="font-heading text-lg font-bold">Order Summary</h3>
      
      {/* Items preview */}
      <div className="space-y-3 max-h-60 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <div className="w-12 h-14 bg-muted rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{item.name}</p>
              <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
            </div>
            <p className="text-sm font-medium">SAR {(item.price * item.quantity).toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="border-t border-border pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>SAR {subtotal.toLocaleString()}</span>
        </div>
        {appliedPromo && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount ({appliedPromo.discount}%)</span>
            <span>-SAR {promoDiscount.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span>SAR {shippingCost.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">VAT (15%)</span>
          <span>SAR {tax.toFixed(2)}</span>
        </div>
      </div>

      <div className="border-t border-border pt-4 flex justify-between items-center">
        <span className="font-heading text-lg font-bold">Total</span>
        <span className="font-heading text-2xl font-bold text-primary">
          SAR {total.toFixed(2)}
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
              Checkout
            </h1>
            <p className="text-muted-foreground">
              Complete your purchase securely
            </p>
          </motion.div>

          {/* Step Indicator */}
          {renderStepIndicator()}

          {/* Main Content */}
          {currentStep === 4 ? (
            renderConfirmationStep()
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <AnimatePresence mode="wait">
                  {currentStep === 1 && renderCartStep()}
                  {currentStep === 2 && renderShippingStep()}
                  {currentStep === 3 && renderPaymentStep()}
                </AnimatePresence>

                {/* Navigation Buttons */}
                {currentStep < 4 && (
                  <div className="flex justify-between mt-8">
                    {currentStep > 1 ? (
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep(currentStep - 1)}
                        className="gap-2"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => navigate('/shop')}
                        className="gap-2"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Continue Shopping
                      </Button>
                    )}
                    <Button
                      onClick={handleNextStep}
                      disabled={items.length === 0}
                      className="gap-2 bg-primary text-primary-foreground"
                    >
                      {currentStep === 3 ? 'Place Order' : 'Continue'}
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:block">
                {renderOrderSummary()}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
