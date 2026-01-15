import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import HeroSection from '@/components/landing/HeroSection';
import CategoriesSection from '@/components/landing/CategoriesSection';
import LatestArrivalsSection from '@/components/landing/LatestArrivalsSection';
import PhilosophySection from '@/components/landing/PhilosophySection';
import OutfitBuilderCTA from '@/components/landing/OutfitBuilderCTA';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen">
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
