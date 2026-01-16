import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { categoryService } from '@/services/api';
import { Link } from 'react-router-dom';
import WaveDivider from '@/components/graphics/WaveDivider';
import DecorativeArcs from '@/components/graphics/DecorativeArcs';

// Fallback placeholder image
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/400x500?text=Category';

const CategoriesSection: React.FC = () => {
  const { t, language } = useLanguage();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAll,
  });

  if (isLoading) {
    return (
      <section className="py-20 md:py-32 bg-background">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">Loading categories...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-20 md:py-32 bg-background overflow-hidden">
      {/* Decorative arcs */}
      <DecorativeArcs position="right" size="lg" className="opacity-30 hidden md:block" />
      <DecorativeArcs position="left" size="md" className="opacity-20 rotate-180 hidden md:block" />
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-4">
            {t('shopByCategory')}
          </h2>
          <div className="w-20 h-1 bg-gold mx-auto" />
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category: any, index: number) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={`/shop?category=${category.id}`}
                className="group relative block aspect-[3/4] rounded-2xl overflow-hidden"
              >
                {/* Background Image */}
                <img
                  src={category.image || PLACEHOLDER_IMAGE}
                  alt={language === 'ar' ? (category.name_ar || category.name) : category.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Category Name */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                  <h3 className="font-heading text-xl md:text-2xl font-bold text-white">
                    {language === 'ar' ? (category.name_ar || category.name) : category.name}
                  </h3>
                </div>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-gold/50 rounded-2xl transition-colors duration-300" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Wave divider at bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <WaveDivider variant="sand" />
      </div>
    </section>
  );
};

export default CategoriesSection;
