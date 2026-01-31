import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Minus, Plus, Heart, Share2, ShoppingBag, Check } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import ProductCard from '@/components/ProductCard';
import ImageStack from '@/components/ui/image-stack';
import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import Meta from '@/components/Meta';
import { addBaseUrl } from '@/utils/imageUtils';
import { shareProduct } from '@/utils/shareHelper';
import api from '@/services/api';
import { toast } from '@/hooks/use-toast';
import { useAnalytics } from '@/hooks/useAnalytics';

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const { addItem } = useCart();
  const { track } = useAnalytics();
  
  // Fetch single product
  const { data: product, isLoading: isLoadingProduct, error: productError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProduct(id!),
    enabled: !!id,
  });

  // Fetch all products for related items (Cache first approach)
  const { data: allProducts = [] } = useQuery({
    queryKey: ['products'],
    queryFn: productService.getProducts,
  });
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false); // Local state for immediate feedback
  // Ideally sync with user wishlist from API on load

  // Map to simple variables for Safety Guards
  const loading = isLoadingProduct;
  const error = productError;

  // [SAFETY GUARD START]
  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-24 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !product) {
    return <div className="text-center p-10 text-red-500 mt-20">Product Not Found</div>;
  }
  // [SAFETY GUARD END]

  // Filter related products (client side for now)
  const relatedProducts = allProducts
    .filter((p: any) => p.category === product?.category && p.id !== product?.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    // Strict Validation Logic
    const hasColors = product?.colors && product.colors.length > 0;
    const hasSizes = product?.sizes && product.sizes.length > 0;

    if (hasColors && !selectedColor) {
      toast({ title: t('selectColor') || "Please select a color", variant: "destructive" });
      return;
    }
    if (hasSizes && !selectedSize) {
      toast({ title: t('selectSize') || "Please select a size", variant: "destructive" });
      return;
    }
    
    addItem({
      id: product?.id,
      name: product?.name,
      nameAr: product?.nameAr,
      price: product?.price,
      image: product?.images[0],
      size: selectedSize || 'Standard',
      color: selectedColor || 'Standard',
    });
    
    track('add_to_cart', { id: product?.id, name: product?.name, price: product?.price });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
    toast({ title: t('addedToCart') || 'Added to Cart' });
  };

  const handleWishlist = async () => {
    try {
      setIsWishlisted(!isWishlisted); // Optimistic UI
      await api.put('/users/wishlist', { productId: product?.id });
      toast({ title: isWishlisted ? 'Removed from Wishlist' : 'Added to Wishlist' });
    } catch (error) {
      setIsWishlisted(!isWishlisted); // Revert
      toast({ title: "Failed to update wishlist", variant: "destructive" });
    }
  };

  const handleShare = () => {
    if (!product) return;
    shareProduct({
      name: language === 'ar' ? product.nameAr : product.name,
      description: language === 'ar' ? product.descriptionAr : product.description
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />
      {product && <Meta
        title={language === 'ar' ? product?.nameAr : product?.name}
        description={language === 'ar' ? product?.descriptionAr : product?.description}
        keywords={product?.tags?.join(', ') || 'fashion, clothes'}
      />}

      <main className="pt-20 md:pt-24 pb-12 md:pb-20">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 xl:gap-16">
            {/* Image Gallery - Stacked Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-3 md:space-y-4 lg:sticky lg:top-24"
            >
              {/* Main Stacked Image View */}
              <div className="aspect-[4/5] sm:aspect-square lg:aspect-[4/5] overflow-visible relative mx-auto w-full max-w-[280px] sm:max-w-xs lg:max-w-sm">
                <ImageStack
                  images={(product?.images || []).map((img: string) => addBaseUrl(img))}
                  alt={language === 'ar' ? product?.nameAr : product?.name}
                  randomRotation={true}
                  sensitivity={120}
                  sendToBackOnClick={true}
                  pauseOnHover={true}
                  mobileClickOnly={true}
                  onImageChange={(index) => setSelectedImage(index)}
                />
              </div>

              {/* Thumbnail Grid - Hidden on mobile */}
              <div className="hidden sm:grid grid-cols-6 gap-2 max-w-md lg:max-w-none mx-auto">
                {(product?.images || []).slice(0, 6).map((image: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-md md:rounded-lg overflow-hidden border-2 transition-all hover:opacity-90 ${
                      selectedImage === index ? 'border-primary ring-1 ring-primary/30' : 'border-transparent'
                    }`}
                  >
                    <img src={addBaseUrl(image)} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Interaction Hint */}
              <p className="text-xs sm:text-sm text-muted-foreground text-center hidden sm:block">
                Drag or click to shuffle through images
              </p>
            </motion.div>

            {/* Product Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="py-2 md:py-4 lg:py-6"
            >
              {/* Badges */}
              <div className="flex gap-2 mb-3 md:mb-4">
                {product?.isNew && (
                  <span className="px-2.5 py-1 sm:px-3 bg-teal text-teal-foreground text-[10px] sm:text-xs font-bold rounded-full">
                    NEW
                  </span>
                )}
                {product?.originalPrice && (
                  <span className="px-2.5 py-1 sm:px-3 bg-coral text-coral-foreground text-[10px] sm:text-xs font-bold rounded-full">
                    SALE
                  </span>
                )}
              </div>

              {/* Title & Price */}
              <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 sm:mb-4">
                {language === 'ar' ? product?.nameAr : product?.name}
              </h1>

              <div className="flex items-baseline flex-wrap gap-2 sm:gap-4 mb-4 sm:mb-6">
                <span className="font-heading text-2xl sm:text-3xl font-bold text-primary">
                  SAR {product?.price.toLocaleString()}
                </span>
                {product?.originalPrice && (
                  <span className="font-body text-base sm:text-lg text-muted-foreground line-through">
                    SAR {product?.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="font-body text-sm sm:text-base text-muted-foreground leading-relaxed mb-5 sm:mb-8">
                {language === 'ar' ? product?.descriptionAr : product?.description}
              </p>

              {/* Color & Size Selection - Compact on mobile */}
              <div className="flex flex-wrap gap-4 sm:gap-0 sm:flex-col mb-4 sm:mb-6">
                {/* Color Selection */}
                {product?.colors && product.colors.length > 0 && (
                <div className="flex-1 min-w-[120px] sm:mb-6">
                  <h3 className="font-heading text-xs sm:text-base font-semibold mb-1.5 sm:mb-3">
                    {t('color')}: <span className="text-muted-foreground font-normal text-xs sm:text-base">{selectedColor}</span>
                  </h3>
                  <div className="flex flex-wrap gap-1.5 sm:gap-3">
                      {product?.colors?.map((color: any, index: number) => {
                        // Handle both formats: simple hex string OR object with {hex, name, nameAr}
                        const colorHex = typeof color === 'string' ? color : color.hex;
                        const colorName = typeof color === 'string'
                          ? color  // Use hex as display name for simple format
                          : (language === 'ar' ? color.nameAr : color.name);

                        return (
                          <button
                            key={colorHex || index}
                            onClick={() => setSelectedColor(colorHex)}
                            className={`w-6 h-6 sm:w-10 sm:h-10 rounded-full border-2 transition-all shadow-sm ${
                              selectedColor === colorHex
                                ? 'border-primary scale-110 ring-2 ring-primary/20'
                                : 'border-border/50 hover:border-primary/50'
                              }`}
                            style={{ backgroundColor: colorHex }}
                            title={colorName}
                          />
                        );
                      })}
                  </div>
                </div>
                )}

                {/* Size Selection */}
                {product?.sizes && product.sizes.length > 0 && (
                <div className="flex-1 min-w-[120px]">
                  <h3 className="font-heading text-xs sm:text-base font-semibold mb-1.5 sm:mb-3">{t('size')}</h3>
                  <div className="flex flex-wrap gap-1 sm:gap-3">
                      {product?.sizes?.map((size: any) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-2 py-1 sm:px-5 sm:py-2.5 text-[10px] sm:text-sm font-medium border rounded-md sm:rounded-lg transition-all ${
                          selectedSize === size
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'border-border hover:border-primary hover:bg-muted/50'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                )}
              </div>

              {/* Quantity - Compact inline on mobile */}
              <div className="flex items-center gap-1.5 sm:gap-3 mb-4 sm:mb-8">
                <span className="font-heading text-xs sm:text-base font-semibold">{t('quantity')}:</span>
                <div className="flex items-center border border-border rounded-full">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-6 h-6 sm:w-9 sm:h-9 flex items-center justify-center hover:bg-muted transition-colors rounded-l-full"
                  >
                    <Minus className="w-2.5 h-2.5 sm:w-4 sm:h-4" />
                  </button>
                  <span className="font-body text-xs sm:text-base font-medium w-5 sm:w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-6 h-6 sm:w-9 sm:h-9 flex items-center justify-center hover:bg-muted transition-colors rounded-r-full"
                  >
                    <Plus className="w-2.5 h-2.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>

              {/* Actions - Compact row on mobile */}
              <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-8">
                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  className={`flex-1 font-heading font-semibold h-10 sm:h-14 text-xs sm:text-base ${
                    isAdded ? 'bg-teal text-teal-foreground' : 'bg-primary text-primary-foreground'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                      Added!
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-3.5 h-3.5 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                      {t('addToCart')}
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleWishlist}
                  className={`w-10 h-10 sm:w-14 sm:h-14 border-coral hover:bg-coral hover:text-coral-foreground shrink-0 ${isWishlisted ? 'bg-coral text-white' : 'text-coral'}`}
                >
                  <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </Button>
                <Button
                  variant="outline"
                  onClick={handleShare}
                  size="icon"
                  className="w-10 h-10 sm:w-14 sm:h-14 shrink-0"
                >
                  <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-12 sm:mt-16 md:mt-20">
              <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4 sm:mb-6 md:mb-8">
                You May Also Like
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {relatedProducts.map((product, index) => (
                  <ProductCard key={product?.id} product={product} index={index} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductPage;
