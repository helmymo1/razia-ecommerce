import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { useLanguage } from '@/contexts/LanguageContext';
import { categoryService } from '@/services/api';

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/400x500?text=Category';

const Categories: React.FC = () => {
  const { t, language } = useLanguage();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAll,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t('categories')}
            </h1>
            <div className="w-20 h-1 bg-gold mx-auto" />
          </motion.div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading categories...</p>
            </div>
          ) : categories.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <p className="text-red-500 font-bold">Unable to load categories.</p>
                <p className="text-sm text-gray-500">Please check if the backend server is running on port 5000.</p>
            </div>
          ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categories.map((category: any, index: number) => (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={`/shop?category=${category.id}`}
                        className="group relative block aspect-[4/5] rounded-2xl overflow-hidden shadow-lg"
                      >
                        {/* Background Image */}
                        <img
                          src={category.image || PLACEHOLDER_IMAGE}
                          alt={language === 'ar' ? (category.name_ar || category.name) : category.name}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                        {/* Category Name */}
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h3 className="font-heading text-2xl md:text-3xl font-bold text-white">
                            {language === 'ar' ? (category.name_ar || category.name) : category.name}
                          </h3>
                          <p className="text-white/80 mt-2 text-sm">
                            {t('shopNow')} →
                          </p>
                        </div>

                        {/* Hover Effect Border */}
                        <div className="absolute inset-0 border-4 border-transparent group-hover:border-gold/50 rounded-2xl transition-colors duration-300" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Categories;
