import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import HeroSection from '@/components/landing/HeroSection';
import CategoriesSection from '@/components/landing/CategoriesSection';
import LatestArrivalsSection from '@/components/landing/LatestArrivalsSection';
import PhilosophySection from '@/components/landing/PhilosophySection';
import OutfitBuilderCTA from '@/components/landing/OutfitBuilderCTA';
import SEO from '@/components/SEO';
import { useLanguage } from '@/contexts/LanguageContext';

const Index: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen">
      <SEO
        title="Luxury Women's Fashion"
        description="Discover timeless elegance with Razia - Premium women's fashion curated for the modern woman. Shop luxury dresses, abayas, and designer collections."
        path="/"
        lang={language === 'ar' ? 'ar' : 'en'}
      />
      <Navbar />
      <CartDrawer />
      <main>
        <HeroSection />
        <CategoriesSection />
        <LatestArrivalsSection />
        <PhilosophySection />
        <OutfitBuilderCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
