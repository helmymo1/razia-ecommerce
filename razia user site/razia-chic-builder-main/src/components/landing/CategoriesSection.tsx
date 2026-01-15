import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import CategoryCard from '@/components/CategoryCard';
import WaveDivider from '@/components/graphics/WaveDivider';
import DecorativeArcs from '@/components/graphics/DecorativeArcs';
import categoryDresses from '@/assets/category-dresses.jpg';
import categoryAbayas from '@/assets/category-abayas.jpg';
import categoryTops from '@/assets/category-tops.jpg';
import categorySkirts from '@/assets/category-skirts.jpg';
import categoryAccessories from '@/assets/category-accessories.jpg';
import categoryNew from '@/assets/category-new.jpg';

const categories = [
  { id: 'dresses', name: 'Dresses', nameAr: 'فساتين', image: categoryDresses },
  { id: 'abayas', name: 'Abayas', nameAr: 'عباءات', image: categoryAbayas },
  { id: 'tops', name: 'Tops', nameAr: 'قمصان', image: categoryTops },
  { id: 'skirts', name: 'Skirts', nameAr: 'تنانير', image: categorySkirts },
  { id: 'accessories', name: 'Accessories', nameAr: 'إكسسوارات', image: categoryAccessories },
  { id: 'new-in', name: 'New In', nameAr: 'جديدنا', image: categoryNew },
];

const CategoriesSection: React.FC = () => {
  const { t } = useLanguage();

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

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.id}
              category={category}
              index={index}
              size={index === 0 || index === 5 ? 'large' : 'normal'}
            />
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
