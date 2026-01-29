import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/data/products';
import { addBaseUrl } from '@/utils/imageUtils';
import api from '@/services/api';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const { t, language } = useLanguage();
  const { addItem } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation();
    try {
      setIsWishlisted(!isWishlisted);
      await api.put('/users/wishlist', { productId: product.id });
      toast({ title: isWishlisted ? 'Removed from Wishlist' : 'Added to Wishlist' });
    } catch (error) {
      setIsWishlisted(!isWishlisted);
      toast({ title: "Failed to update wishlist", variant: "destructive" });
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      name: product.name,
      nameAr: product.nameAr,
      price: product.price,
      image: product.images[0],
      size: product.sizes[0],
      color: product.colors[0]?.name,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={`/product/${product.id}`} className="group block">
        <div className="relative overflow-hidden rounded-lg bg-sand-light aspect-[3/4]">
          {/* Image with hover effect */}
          <img
            src={addBaseUrl(product.images?.[0])}
            alt={language === 'ar' ? product.nameAr : product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          
          {/* Hover overlay with second image */}
          {product.images?.[1] && (
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <img
                src={addBaseUrl(product.images?.[1])}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <span className="px-3 py-1 bg-teal text-teal-foreground text-xs font-bold rounded-full">
                NEW
              </span>
            )}
            {product.originalPrice && (
              <span className="px-3 py-1 bg-coral text-coral-foreground text-xs font-bold rounded-full">
                SALE
              </span>
            )}
          </div>

          {/* Quick actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
            <button
              onClick={handleWishlist}
              className={`w-9 h-9 bg-background rounded-full flex items-center justify-center shadow-lg hover:bg-coral hover:text-coral-foreground transition-colors ${isWishlisted ? 'text-coral' : ''}`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Add to cart button */}
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleAddToCart}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-body font-medium text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              {t('addToCart')}
            </button>
          </div>
        </div>

        {/* Product info */}
        <div className="mt-4 space-y-2">
          <h3 className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors">
            {language === 'ar' ? product.nameAr : product.name}
          </h3>
          <p className="font-body text-sm text-muted-foreground">
            {language === 'ar' ? product.categoryAr : product.category}
          </p>
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-lg text-primary">
              SAR {product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="font-body text-sm text-muted-foreground line-through">
                SAR {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          {/* Color swatches */}
          <div className="flex gap-1 pt-1">
            {(product.colors || []).slice(0, 4).map((color) => (
              <span
                key={color.hex}
                className="w-4 h-4 rounded-full border border-border"
                style={{ backgroundColor: color.hex }}
                title={language === 'ar' ? color.nameAr : color.name}
              />
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
