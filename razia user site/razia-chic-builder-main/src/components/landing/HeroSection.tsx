import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import FloatingShapes from '@/components/graphics/FloatingShapes';
import heroImage from '@/assets/hero-image.jpg';

const HeroSection: React.FC = () => {
  const { t, direction } = useLanguage();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden">
      {/* Decorative graphic elements */}
      <FloatingShapes className="z-10" />
      {/* Background with parallax */}
      <motion.div style={{ y }} className="absolute inset-0">
        <img
          src={heroImage}
          alt="Luxury Fashion"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/60 via-foreground/30 to-transparent" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative h-full container mx-auto px-4 flex items-center"
      >
        <div className={`max-w-xl ${direction === 'rtl' ? 'mr-0 ml-auto text-right' : ''}`}>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-2 bg-gold text-gold-foreground text-sm font-bold rounded-full mb-6"
          >
            New Collection 2025
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold text-background leading-none mb-6"
          >
            {t('heroTitle')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="font-body text-lg md:text-xl text-background/80 mb-8 leading-relaxed"
          >
            {t('heroSubtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap gap-4"
          >
            <Button
              asChild
              size="lg"
              className="bg-gold text-gold-foreground hover:bg-gold/90 font-heading font-semibold px-8 py-6 text-base"
            >
              <Link to="/shop">
                {t('shopNow')}
                <ArrowRight className={`w-5 h-5 ${direction === 'rtl' ? 'mr-2 rotate-180' : 'ml-2'}`} />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-background text-background hover:bg-background/10 font-heading font-semibold px-8 py-6 text-base"
            >
              <Link to="/categories">
                {t('exploreCollection')}
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-background/50 rounded-full flex justify-center pt-2">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1 h-2 bg-background rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
