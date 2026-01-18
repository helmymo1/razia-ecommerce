import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  path: string; // Required relative path
  ogImage?: string;
  lang: 'en' | 'ar';
  structuredData?: any;
}

const SITE_URL = 'https://raziastore.com';

const SEO: React.FC<SEOProps> = ({ title, description, path, ogImage, lang, structuredData }) => {
  const isArabic = lang === 'ar';
  const canonical = `${SITE_URL}${path.startsWith('/') ? path : '/' + path}`;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <html lang={lang} dir={isArabic ? 'rtl' : 'ltr'} />
      <title>{title} | Razia Store</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta property="og:url" content={canonical} />
      <meta property="og:locale" content={isArabic ? 'ar_SA' : 'en_US'} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
