import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import CategoryCard from '@/components/CategoryCard';
import { useLanguage } from '@/contexts/LanguageContext';
import categoryDresses from '@/assets/category-dresses.jpg';
import categoryAbayas from '@/assets/category-abayas.jpg';
import categoryTops from '@/assets/category-tops.jpg';
import categorySkirts from '@/assets/category-skirts.jpg';
import categoryAccessories from '@/assets/category-accessories.jpg';
import categoryNew from '@/assets/category-new.jpg';

const categoriesData = [
  { id: 'dresses', name: 'Dresses', nameAr: 'فساتين', image: categoryDresses },
  { id: 'abayas', name: 'Abayas', nameAr: 'عباءات', image: categoryAbayas },
  { id: 'tops', name: 'Tops', nameAr: 'قمصان', image: categoryTops },
  { id: 'skirts', name: 'Skirts', nameAr: 'تنانير', image: categorySkirts },
  { id: 'accessories', name: 'Accessories', nameAr: 'إكسسوارات', image: categoryAccessories },
  { id: 'new-in', name: 'New In', nameAr: 'جديدنا', image: categoryNew },
];

const Categories: React.FC = () => {
  const { t } = useLanguage();

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoriesData.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                index={index}
                size="large"
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Categories;
