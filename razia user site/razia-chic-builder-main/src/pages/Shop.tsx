import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import ProductCard from '@/components/ProductCard';
import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';

const Shop: React.FC = () => {
  const { t, language } = useLanguage();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 3000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  // Fetch products from API
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: productService.getProducts,
  });

  const categories = React.useMemo(() => [...new Set(products.map((p: any) => p.category))], [products]);
  const sizes = React.useMemo(() => [...new Set(products.flatMap((p: any) => p.sizes))], [products]);

  const filteredProducts = React.useMemo(() => {
    return products.filter((product: any) => {
      const inPriceRange = product.price >= priceRange[0] && product.price <= priceRange[1];
      const inCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
      const inSize = selectedSizes.length === 0 || (product.sizes && product.sizes.some((s: string) => selectedSizes.includes(s)));
      return inPriceRange && inCategory && inSize;
    });
  }, [products, priceRange, selectedCategories, selectedSizes]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const clearFilters = () => {
    setPriceRange([0, 3000]);
    setSelectedCategories([]);
    setSelectedSizes([]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
     return (
      <div className="min-h-screen bg-background pt-24 pb-20 flex justify-center items-center">
        <p className="text-red-500">Failed to load products. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Shop Luxury Abayas & Dresses | Razia Chic</title>
        <meta name="description" content="Browse our exclusive collection of luxury abayas, dresses, and modest fashion. Find your perfect style at Razia Chic." />
      </Helmet>
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
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t('shop')}
            </h1>
            <p className="font-body text-muted-foreground">
              {filteredProducts.length} products
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Mobile Filter Button */}
            <div className="lg:hidden">
              <Button
                variant="outline"
                onClick={() => setIsFilterOpen(true)}
                className="w-full"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                {t('filter')}
              </Button>
            </div>

            {/* Desktop Sidebar Filters */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-28 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-lg font-bold">{t('filter')}</h3>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {t('clearFilters')}
                  </button>
                </div>

                {/* Price Range */}
                <div>
                  <h4 className="font-heading font-semibold mb-4">{t('priceRange')}</h4>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={3000}
                    step={50}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>SAR {priceRange[0]}</span>
                    <span>SAR {priceRange[1]}</span>
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <h4 className="font-heading font-semibold mb-4">{t('categories')}</h4>
                  <div className="space-y-3">
                    {categories.map((category: any) => (
                      <label key={category} className="flex items-center gap-3 cursor-pointer">
                        <Checkbox
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={() => toggleCategory(category)}
                        />
                        <span className="font-body text-sm">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div>
                  <h4 className="font-heading font-semibold mb-4">{t('size')}</h4>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size: any) => (
                      <button
                        key={size}
                        onClick={() => toggleSize(size)}
                        className={`px-3 py-1.5 text-sm font-medium border rounded transition-colors ${
                          selectedSizes.includes(size)
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'border-border hover:border-primary'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredProducts.map((product: any, index: number) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-20">
                  <p className="font-body text-muted-foreground">No products found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Filter Drawer */}
      {isFilterOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-foreground/50 lg:hidden"
          onClick={() => setIsFilterOpen(false)}
        >
          <motion.div
            initial={{ x: language === 'ar' ? '100%' : '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: language === 'ar' ? '100%' : '-100%' }}
            onClick={e => e.stopPropagation()}
            className={`absolute top-0 ${language === 'ar' ? 'right-0' : 'left-0'} h-full w-80 bg-background p-6 overflow-y-auto`}
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-heading text-lg font-bold">{t('filter')}</h3>
              <button onClick={() => setIsFilterOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Same filter content as desktop */}
            <div className="space-y-8">
              <div>
                <h4 className="font-heading font-semibold mb-4">{t('priceRange')}</h4>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={3000}
                  step={50}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>SAR {priceRange[0]}</span>
                  <span>SAR {priceRange[1]}</span>
                </div>
              </div>

              <div>
                <h4 className="font-heading font-semibold mb-4">{t('categories')}</h4>
                <div className="space-y-3">
                  {categories.map((category: any) => (
                    <label key={category} className="flex items-center gap-3 cursor-pointer">
                      <Checkbox
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => toggleCategory(category)}
                      />
                      <span className="font-body text-sm">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-heading font-semibold mb-4">{t('size')}</h4>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size: any) => (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`px-3 py-1.5 text-sm font-medium border rounded transition-colors ${
                        selectedSizes.includes(size)
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'border-border hover:border-primary'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <Button onClick={() => setIsFilterOpen(false)} className="w-full bg-primary text-primary-foreground">
                  {t('applyFilters')}
                </Button>
                <Button onClick={clearFilters} variant="outline" className="w-full">
                  {t('clearFilters')}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      <Footer />
    </div>
  );
};

export default Shop;
