import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ProductCard from '@/components/ProductCard';
import BrandPattern from '@/components/graphics/BrandPattern';
import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/api';

const LatestArrivalsSection: React.FC = () => {
  const { t, direction } = useLanguage();
  
  const { data: products = [] } = useQuery({
    queryKey: ['products', 'newest'],
    queryFn: () => productService.list({ sort: 'newest', limit: 8 }),
  });

  // Since API implements pagination, response might be different. 
  // productService.list (which maps to api.products.list) uses apiClient.get which returns res.data.
  // BUT we modified productService.getProducts to handle { data, pagination }.
  // Wait, I need to check `api.js` line 50. It calls `apiClient.get('/products', { params })`.
  // `LatestArrivalsSection` was using `productService.getProducts` which was just `api.get('/products')`.
  // I need to use `productService.list` or similar if it accepts params.
  // Checking api.js in memory:
  /*
      products: {
        list: (params) => apiClient.get('/products', { params }), // Returns promise of { data: { data: [], pagination: {} } }
        ...
      }
  */
  // So I should use `productService.getProducts` if I updated it to accept params?
  // Let's check `src/services/api.ts` again. It has `getProducts` with no args.
  // I need to update `src/services/api.ts` to accept params for `getProducts` OR import `api` direct.
  // `LatestArrivalsSection` uses `productService`.
  // Let's update `LatestArrivalsSection` to use `api.products.list` via a service wrapper or direct import if easier. 
  // Ah, the user site uses `src/services/api.ts`.
  
  // Let's modify `src/services/api.ts` to accept params in `getProducts`.

  const latestProducts = products; // The API now returns exactly what we want (8 items)


  if (latestProducts.length === 0) return null;

  return (
    <section className="relative py-20 md:py-32 bg-sand-light/30 overflow-hidden">
      {/* Subtle brand pattern background */}
      <BrandPattern opacity={0.05} />
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12"
        >
          <div>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-4">
              {t('latestArrivals')}
            </h2>
            <div className="w-20 h-1 bg-gold" />
          </div>
          <Link
            to="/shop"
            className="mt-6 md:mt-0 inline-flex items-center gap-2 font-body text-primary hover:text-teal transition-colors group"
          >
            {t('viewAll')}
            <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${direction === 'rtl' ? 'rotate-180' : ''}`} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {latestProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestArrivalsSection;
