import React from 'react';
import { Helmet } from 'react-helmet-async';
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
      <Helmet>
        <title>Razia Chic | Luxury Modest Fashion & Abayas</title>
        <meta name="description" content="Discover premium modest fashion, luxury abayas, and elegant dresses at Razia Chic. Shop our latest collection with fast delivery across Saudi Arabia." />
        <meta name="keywords" content="abaya, modest fashion, dresses, saudi arabia fashion, razia chic" />
      </Helmet>
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
