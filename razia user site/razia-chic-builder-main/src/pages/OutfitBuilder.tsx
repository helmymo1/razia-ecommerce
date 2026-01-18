import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Sparkles, ShoppingBag, Share2, Copy, Check, Gift, Users, Link2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { productService } from '@/services/api';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export interface Product {
  id: number;
  name: string;
  nameAr: string;
  price: number;
  description: string;
  descriptionAr: string;
  category: string;
  categoryAr: string;
  images: string[];
  sizes: string[];
  colors: { name: string; nameAr: string; hex: string }[];
  isNew?: boolean;
  isFeatured?: boolean;
  inStock?: boolean;
}

interface OutfitBox {
  id: number;
  products: Product[];
}

interface ReferralData {
  code: string;
  shareLink: string;
  discount: number;
  referrerDiscount: number;
}

const OutfitBuilder: React.FC = () => {
  const { t, language, direction } = useLanguage();
  const { addItem } = useCart();
  const { user } = useAuth();
  const [outfitBoxes, setOutfitBoxes] = useState<OutfitBox[]>([
    { id: 1, products: [] },
    { id: 2, products: [] },
    { id: 3, products: [] },
    { id: 4, products: [] },
  ]);
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [copied, setCopied] = useState(false);
  const [appliedPromoCode, setAppliedPromoCode] = useState<string>('');
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoDialogOpen, setPromoDialogOpen] = useState(false);
  const [dragOverBox, setDragOverBox] = useState<number | null>(null);

  // Fetch Products based on selected category
  const { data: products = [] } = useQuery({
    queryKey: ['products', selectedCategory],
    queryFn: () => productService.list(selectedCategory !== 'all' && selectedCategory ? { category_id: selectedCategory } : {}),
  });

  const categories = ['all', ...new Set(products.map((p: Product) => p.category))];

  const filteredProducts = products; // API handles filtering now

  // Count all products across all boxes
  const allSelectedProducts = outfitBoxes.flatMap(box => box.products);
  const itemCount = allSelectedProducts.length;

  // Calculate discount based on items
  const getDiscount = (count: number): number => {
    if (count >= 6) return 30;
    if (count >= 5) return 25;
    if (count >= 4) return 20;
    if (count >= 3) return 15;
    return 0;
  };

  const bundleDiscount = getDiscount(itemCount);
  const totalDiscount = Math.min(bundleDiscount + promoDiscount, 50); // Max 50% discount
  const originalTotal = allSelectedProducts.reduce((sum, product) => sum + product.price, 0);
  const discountedTotal = originalTotal * (1 - totalDiscount / 100);
  const savings = originalTotal - discountedTotal;

  // Check for referral code in URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode && !appliedPromoCode) {
      // Apply referral discount automatically
      setAppliedPromoCode(refCode);
      setPromoDiscount(10);
      localStorage.setItem('active_referral', refCode);
      toast.success(t('referralApplied'));
    }
  }, []);

  const addProductToBox = (product: Product, boxId?: number) => {
    const targetBox = boxId ?? selectedBox;
    if (targetBox !== null) {
      setOutfitBoxes(boxes =>
        boxes.map(box =>
          box.id === targetBox 
            ? { ...box, products: [...box.products, product] } 
            : box
        )
      );
      toast.success(`${t('added')} ${language === 'ar' ? product.nameAr : product.name} ${t('to')} ${t('box')} ${targetBox}`);
    }
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, product: Product) => {
    e.dataTransfer.setData('product', JSON.stringify(product));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e: React.DragEvent, boxId: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setDragOverBox(boxId);
  };

  const handleDragLeave = () => {
    setDragOverBox(null);
  };

  const handleDrop = (e: React.DragEvent, boxId: number) => {
    e.preventDefault();
    setDragOverBox(null);
    const productData = e.dataTransfer.getData('product');
    if (productData) {
      const product: Product = JSON.parse(productData);
      addProductToBox(product, boxId);
    }
  };

  const removeProductFromBox = (boxId: number, productIndex: number) => {
    setOutfitBoxes(boxes =>
      boxes.map(box =>
        box.id === boxId 
          ? { ...box, products: box.products.filter((_, idx) => idx !== productIndex) }
          : box
      )
    );
  };

  const clearBox = (boxId: number) => {
    setOutfitBoxes(boxes =>
      boxes.map(box =>
        box.id === boxId ? { ...box, products: [] } : box
      )
    );
    toast.success(`${t('box')} ${boxId} ${t('cleared')}`);
  };

  const addAllToCart = () => {
    if (itemCount === 0) {
      toast.error(t('addItemsFirst'));
      return;
    }

    allSelectedProducts.forEach(product => {
      addItem({
        id: product.id + '-' + Date.now() + '-' + Math.random(),
        name: product.name,
        nameAr: product.nameAr,
        price: product.price * (1 - totalDiscount / 100),
        image: product.images[0],
        size: product.sizes[0],
        color: product.colors[0]?.name,
      });
    });
    toast.success(`${t('added')} ${itemCount} ${t('itemsAddedToCart')} ${totalDiscount}% ${t('discount')}!`);
  };

  const generateShareLink = () => {
    // Determine the referral code
    const code = user?.personal_referral_code;

    if (!code) {
      toast.error(language === 'ar' ? 'يرجى تسجيل الدخول للمشاركة وكسب المكافآت' : 'Please login to share and earn rewards');
      // Optional: Redirect to login or open auth modal?
      // navigate('/auth'); 
      return;
    }

    const shareLink = `${window.location.origin}/outfit-builder?ref=${code}`;
    
    setReferralData({
      code,
      shareLink,
      discount: 10, // Friend gets 10% off
      referrerDiscount: 15, // You get 15% off when friend buys
    });
    setShareDialogOpen(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success(t('copiedToClipboard'));
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToSocial = (platform: 'whatsapp' | 'twitter' | 'facebook') => {
    if (!referralData) return;
    
    const message = language === 'ar' 
      ? `اكتشفي هذه الإطلالة الرائعة التي أنشأتها على رازيا! استخدمي رابطي للحصول على خصم ${referralData.discount}%: ${referralData.shareLink}`
      : `Check out this amazing outfit I created on Razia! Use my link to get ${referralData.discount}% off: ${referralData.shareLink}`;
    
    const urls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(message)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralData.shareLink)}&quote=${encodeURIComponent(message)}`,
    };

    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  const applyPromoCode = () => {
    if (!promoCodeInput.trim()) {
      toast.error(t('enterPromoFirst'));
      return;
    }

    // Check if it's a valid referral code format
    if (promoCodeInput.toUpperCase().startsWith('RAZIA')) {
      setAppliedPromoCode(promoCodeInput.toUpperCase());
      setPromoDiscount(10);
      setPromoDialogOpen(false);
      setPromoCodeInput('');
      toast.success(t('promoApplied'));
    } else {
      toast.error(t('invalidPromo'));
    }
  };

  const removePromoCode = () => {
    setAppliedPromoCode('');
    setPromoDiscount(0);
    toast.success(t('promoRemoved'));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold text-gold-foreground rounded-full mb-4">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-bold">{t('exclusiveFeature')}</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t('outfitBuilderTitle')}
            </h1>
            <p className="font-body text-muted-foreground max-w-xl mx-auto mb-6">
              {t('outfitBuilderDesc')}
            </p>
            
            {/* Action Buttons - Hidden on mobile */}
            <div className="hidden md:flex flex-wrap justify-center gap-3">
              <Button
                onClick={generateShareLink}
                variant="outline"
                className="gap-2"
              >
                <Share2 className="w-4 h-4" />
                {t('shareAndEarn')}
              </Button>
              <Button
                onClick={() => setPromoDialogOpen(true)}
                variant="outline"
                className="gap-2"
              >
                <Gift className="w-4 h-4" />
                {appliedPromoCode ? `${t('code')}: ${appliedPromoCode}` : t('applyPromoCode')}
              </Button>
            </div>
          </motion.div>

          {/* Bundle Discount Bar */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-primary rounded-xl text-primary-foreground"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h3 className="font-heading text-lg font-bold">{t('bundleDiscount')}</h3>
              <div className="flex flex-wrap gap-3">
                {[
                  { items: 3, discount: 15 },
                  { items: 4, discount: 20 },
                  { items: 5, discount: 25 },
                  { items: 6, discount: 30 },
                ].map(tier => (
                  <div
                    key={tier.items}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      itemCount >= tier.items
                        ? 'bg-gold text-gold-foreground scale-105'
                        : 'bg-primary-foreground/10'
                    }`}
                  >
                    <span className="font-heading font-bold">{tier.discount}%</span>
                    <span className="text-sm ml-1">({tier.items}+ {t('items')})</span>
                  </div>
                ))}
              </div>
              {promoDiscount > 0 && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gold/20 rounded-lg">
                  <Gift className="w-4 h-4" />
                  <span className="text-sm">{t('promoCodeBonus')}: +{promoDiscount}%</span>
                  <button
                    onClick={removePromoCode}
                    className="text-xs underline hover:no-underline ml-2"
                  >
                    {t('remove')}
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Outfit Boxes */}
            <div>
              <div className="grid grid-cols-2 gap-4">
                {outfitBoxes.map((box, index) => (
                  <motion.div
                    key={box.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    onDragOver={(e) => handleDragOver(e, box.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, box.id)}
                    className={`relative aspect-square rounded-xl border-2 transition-all overflow-hidden ${
                      dragOverBox === box.id
                        ? 'border-gold bg-gold/20 border-solid scale-105'
                        : box.products.length > 0
                        ? 'border-primary bg-background'
                        : selectedBox === box.id
                        ? 'border-gold bg-gold/10 border-dashed'
                        : 'border-dashed border-border bg-muted/30 hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedBox(box.id)}
                  >
                    {box.products.length > 0 ? (
                      <>
                        {/* Multi-item display */}
                        <div className={`w-full h-full grid ${
                          box.products.length === 1 ? 'grid-cols-1' :
                          box.products.length === 2 ? 'grid-cols-2' :
                          box.products.length <= 4 ? 'grid-cols-2 grid-rows-2' :
                          'grid-cols-3 grid-rows-2'
                        }`}>
                          {box.products.slice(0, 6).map((product, pIdx) => (
                            <div key={pIdx} className="relative group">
                              <img
                                src={product.images[0]}
                                alt={language === 'ar' ? product.nameAr : product.name}
                                className="w-full h-full object-cover"
                              />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeProductFromBox(box.id, pIdx);
                                }}
                                className="absolute top-1 right-1 w-5 h-5 bg-background rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-coral hover:text-coral-foreground"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                        
                        {/* Box info overlay */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/80 to-transparent p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-heading font-semibold text-sm text-background">
                                {t('box')} {box.id}
                              </h4>
                              <p className="font-body text-xs text-background/80">
                                {box.products.length} {box.products.length !== 1 ? t('items') : t('item')} • SAR {box.products.reduce((sum, p) => sum + p.price, 0).toLocaleString()}
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                clearBox(box.id);
                              }}
                              className="w-8 h-8 bg-background rounded-full flex items-center justify-center shadow-lg hover:bg-coral hover:text-coral-foreground transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Selected indicator */}
                        {selectedBox === box.id && (
                          <div className="absolute top-2 left-2 px-2 py-1 bg-gold text-gold-foreground text-xs font-bold rounded-full">
                            {t('selected')}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <Plus className={`w-8 h-8 mb-2 ${selectedBox === box.id ? 'text-gold' : 'text-muted-foreground'}`} />
                        <span className="font-body text-sm text-muted-foreground">
                          {selectedBox === box.id ? `${t('selectItem')} →` : `${t('box')} ${box.id}`}
                        </span>
                        {selectedBox === box.id && (
                          <span className="font-body text-xs text-gold mt-1">
                            {t('clickProductsToAdd')}
                          </span>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>


              {/* Referral Info - Hidden on mobile (shown in mobile action buttons) */}
              <div className="hidden md:block mt-4 p-4 bg-teal/10 border border-teal rounded-xl">
                <div className={`flex items-start gap-3 ${direction === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                  <Users className="w-5 h-5 text-teal mt-0.5" />
                  <div>
                    <h4 className="font-heading font-semibold text-foreground">{t('shareEarnProgram')}</h4>
                    <p className="font-body text-sm text-muted-foreground">
                      {t('shareEarnDesc')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Sidebar */}
            <div className="lg:sticky lg:top-28 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* Summary Card */}
              {itemCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 bg-teal rounded-xl text-teal-foreground"
                >
                  <h3 className="font-heading text-lg font-bold mb-4">{t('yourOutfit')}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span>{t('items')} ({itemCount})</span>
                      <span>SAR {originalTotal.toLocaleString()}</span>
                    </div>
                    {bundleDiscount > 0 && (
                      <div className="flex justify-between text-gold">
                        <span>{t('bundleDiscount')} ({bundleDiscount}%)</span>
                        <span>-SAR {(originalTotal * bundleDiscount / 100).toLocaleString()}</span>
                      </div>
                    )}
                    {promoDiscount > 0 && (
                      <div className="flex justify-between text-gold">
                        <span>{t('promoCodeBonus')} ({promoDiscount}%)</span>
                        <span>-SAR {(originalTotal * promoDiscount / 100).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                  <div className="border-t border-teal-foreground/20 pt-4 flex justify-between items-center">
                    <span className="font-heading text-xl font-bold">{t('total')}</span>
                    <div className="text-right">
                      {totalDiscount > 0 && (
                        <span className="text-sm line-through opacity-60 block">
                          SAR {originalTotal.toLocaleString()}
                        </span>
                      )}
                      <span className="font-heading text-2xl font-bold">
                        SAR {Math.round(discountedTotal).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  {savings > 0 && (
                    <div className="mt-2 text-center text-gold text-sm font-semibold">
                      {t('youSave')} SAR {Math.round(savings).toLocaleString()}!
                    </div>
                  )}
                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={addAllToCart}
                      className="flex-1 bg-gold text-gold-foreground hover:bg-gold/90 font-heading font-semibold"
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      {t('addToCart')}
                    </Button>
                    <Button
                      onClick={generateShareLink}
                      variant="outline"
                      className="border-teal-foreground/30 text-teal-foreground hover:bg-teal-foreground/10"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                      selectedCategory === category
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted-foreground/20'
                    }`}
                  >
                    {category === 'all' ? t('all') : (language === 'ar' && category === 'dresses' ? 'فساتين' : 
                      language === 'ar' && category === 'abayas' ? 'عباءات' :
                      language === 'ar' && category === 'tops' ? 'قمصان' :
                      language === 'ar' && category === 'skirts' ? 'تنانير' :
                      language === 'ar' && category === 'accessories' ? 'إكسسوارات' : category)}
                  </button>
                ))}
              </div>

              {/* Selection hint */}
              {selectedBox === null && (
                <div className="p-3 bg-gold/10 border border-gold/30 rounded-lg text-center">
                  <p className="text-sm text-foreground">
                    👆 {t('clickBoxFirst')}
                  </p>
                </div>
              )}

              {/* Product List */}
              <div className="space-y-4">
                {filteredProducts.map(product => (
                  <motion.div
                    key={product.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, product)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => addProductToBox(product)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all cursor-grab active:cursor-grabbing ${
                      'border-primary hover:bg-primary/5'
                    }`}
                  >
                    <div className="w-24 h-28 bg-sand-light rounded-lg overflow-hidden flex-shrink-0 pointer-events-none">
                      <img
                        src={product.images[0]}
                        alt={language === 'ar' ? product.nameAr : product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 text-left pointer-events-none">
                      <h4 className="font-heading font-semibold text-base">
                        {language === 'ar' ? product.nameAr : product.name}
                      </h4>
                      <p className="font-body text-sm text-muted-foreground">
                        {language === 'ar' ? product.categoryAr : product.category}
                      </p>
                      <p className="font-heading font-bold text-primary text-lg mt-1">
                        SAR {product.price.toLocaleString()}
                      </p>
                    </div>
                    <Plus className="w-5 h-5 text-muted-foreground pointer-events-none" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Action Buttons - Outside product slider */}
        <div className="flex md:hidden flex-col gap-3 px-4 pb-6">
          {/* Share & Earn Program Info */}
          <div className="p-4 bg-teal/10 border border-teal rounded-xl">
            <div className={`flex items-start gap-3 ${direction === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
              <Users className="w-5 h-5 text-teal mt-0.5" />
              <div>
                <h4 className="font-heading font-semibold text-foreground">{t('shareEarnProgram')}</h4>
                <p className="font-body text-sm text-muted-foreground">
                  {t('shareEarnDesc')}
                </p>
              </div>
            </div>
          </div>
          
          <Button
            onClick={generateShareLink}
            variant="outline"
            className="gap-2 w-full"
          >
            <Share2 className="w-4 h-4" />
            {t('shareAndEarn')}
          </Button>
          <Button
            onClick={() => setPromoDialogOpen(true)}
            variant="outline"
            className="gap-2 w-full"
          >
            <Gift className="w-4 h-4" />
            {appliedPromoCode ? `${t('code')}: ${appliedPromoCode}` : t('applyPromoCode')}
          </Button>
        </div>
      </main>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="max-w-[90vw] sm:max-w-md p-4 sm:p-6 [&>button]:w-8 [&>button]:h-8 [&>button]:opacity-100 [&>button>svg]:w-6 [&>button>svg]:h-6">
          <DialogHeader>
            <DialogTitle className={`flex items-center gap-2 text-base sm:text-lg ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              {t('shareYourOutfit')}
            </DialogTitle>
            <DialogDescription className={`text-xs sm:text-sm ${direction === 'rtl' ? 'text-right' : ''}`}>
              {t('shareDescription')}
            </DialogDescription>
          </DialogHeader>
          
          {referralData && (
            <div className="space-y-3 sm:space-y-4">
              {/* Share Link */}
              <div>
                <label className={`text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2 block ${direction === 'rtl' ? 'text-right' : ''}`}>
                  {t('yourUniqueLink')}
                </label>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={referralData.shareLink}
                    className="font-mono text-xs sm:text-sm h-9 sm:h-10"
                  />
                  <Button
                    onClick={() => copyToClipboard(referralData.shareLink)}
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 sm:h-10 sm:w-10"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Referral Code */}
              <div className="p-3 sm:p-4 bg-gold/10 border border-gold/30 rounded-lg">
                <div className={`flex items-center justify-between ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <div className={direction === 'rtl' ? 'text-right' : ''}>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{t('yourReferralCode')}</p>
                    <p className="font-heading font-bold text-base sm:text-lg text-foreground">{referralData.code}</p>
                  </div>
                  <Button
                    onClick={() => copyToClipboard(referralData.code)}
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 sm:px-3"
                  >
                    <Copy className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <span className="text-xs sm:text-sm">{t('copy')}</span>
                  </Button>
                </div>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div className="p-2 sm:p-3 bg-teal/10 rounded-lg text-center">
                  <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-teal mx-auto mb-1" />
                  <p className="text-[10px] sm:text-xs text-muted-foreground">{t('friendGets')}</p>
                  <p className="font-heading font-bold text-sm sm:text-base text-teal">{referralData.discount}% {t('off')}</p>
                </div>
                <div className="p-2 sm:p-3 bg-gold/10 rounded-lg text-center">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-gold mx-auto mb-1" />
                  <p className="text-[10px] sm:text-xs text-muted-foreground">{t('youEarn')}</p>
                  <p className="font-heading font-bold text-sm sm:text-base text-gold">{referralData.referrerDiscount}% {t('code')}</p>
                </div>
              </div>

              {/* Social Share Buttons */}
              <div>
                <p className={`text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2 ${direction === 'rtl' ? 'text-right' : ''}`}>{t('shareVia')}</p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => shareToSocial('whatsapp')}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs sm:text-sm h-9 sm:h-10"
                  >
                    WhatsApp
                  </Button>
                  <Button
                    onClick={() => shareToSocial('twitter')}
                    className="flex-1 bg-blue-400 hover:bg-blue-500 text-white text-xs sm:text-sm h-9 sm:h-10"
                  >
                    Twitter
                  </Button>
                  <Button
                    onClick={() => shareToSocial('facebook')}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm h-9 sm:h-10"
                  >
                    Facebook
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Promo Code Dialog */}
      <Dialog open={promoDialogOpen} onOpenChange={setPromoDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className={`flex items-center gap-2 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <Gift className="w-5 h-5 text-gold" />
              {t('applyPromoCode')}
            </DialogTitle>
            <DialogDescription className={direction === 'rtl' ? 'text-right' : ''}>
              {t('promoCodeDescription')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {appliedPromoCode ? (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className={`flex items-center justify-between ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center gap-2 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <Check className="w-5 h-5 text-green-500" />
                    <div className={direction === 'rtl' ? 'text-right' : ''}>
                      <p className="font-medium text-green-700 dark:text-green-400">{t('codeApplied')}</p>
                      <p className="text-sm text-green-600 dark:text-green-500">{appliedPromoCode}</p>
                    </div>
                  </div>
                  <Button
                    onClick={removePromoCode}
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600"
                  >
                    {t('remove')}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder={t('enterPromoCode')}
                  value={promoCodeInput}
                  onChange={(e) => setPromoCodeInput(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={applyPromoCode}>
                  {t('apply')}
                </Button>
              </div>
            )}

            <p className={`text-xs text-muted-foreground text-center ${direction === 'rtl' ? 'text-right' : ''}`}>
              {t('getPromoCodeHint')}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default OutfitBuilder;
