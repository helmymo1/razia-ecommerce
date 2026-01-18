export const buildProductSchema = (product: any, language: 'en' | 'ar' = 'en') => {
  const isArabic = language === 'ar';
  
  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": isArabic ? product.nameAr : product.name,
    "image": product.images && product.images.length > 0 ? product.images : [product.image_url],
    "description": isArabic ? product.descriptionAr : product.description,
    "sku": product.id,
    "brand": {
      "@type": "Brand",
      "name": "Razia Store"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://raziastore.com/products/${product.id}`,
      "priceCurrency": "SAR",
      "price": product.price,
      "availability": "https://schema.org/InStock", // Defaulting to InStock
      "itemCondition": "https://schema.org/NewCondition"
    }
  };

  // Add stock check if property exists
  if (product.stock_quantity !== undefined) {
      schema.offers.availability = product.stock_quantity > 0 
          ? "https://schema.org/InStock" 
          : "https://schema.org/OutOfStock";
  }

  return schema;
};
