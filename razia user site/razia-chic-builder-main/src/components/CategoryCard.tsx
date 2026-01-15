import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    nameAr: string;
    image: string;
  };
  index?: number;
  size?: 'normal' | 'large';
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, index = 0, size = 'normal' }) => {
  const { language } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        to={`/category/${category.id}`}
        className="group block relative overflow-hidden rounded-lg"
      >
        <div className={`relative ${size === 'large' ? 'aspect-[4/5]' : 'aspect-square'}`}>
          <img
            src={category.image}
            alt={language === 'ar' ? category.nameAr : category.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-end p-6">
            <motion.h3
              className="font-heading text-xl md:text-2xl font-bold text-background text-center"
              whileHover={{ y: -5 }}
            >
              {language === 'ar' ? category.nameAr : category.name}
            </motion.h3>
            <div className="mt-2 h-0.5 w-0 bg-gold group-hover:w-16 transition-all duration-500" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;
