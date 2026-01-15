import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const PhilosophySection: React.FC = () => {
  const { t, direction } = useLanguage();

  return (
    <section className="py-20 md:py-32 bg-primary text-primary-foreground overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: direction === 'rtl' ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={direction === 'rtl' ? 'order-2' : ''}
          >
            <span className="inline-block px-4 py-2 bg-gold text-gold-foreground text-sm font-bold rounded-full mb-6">
              Our Story
            </span>
            <h2 className="font-heading text-3xl md:text-5xl font-bold leading-tight mb-6">
              {t('brandPhilosophy')}
            </h2>
            <p className="font-body text-lg text-primary-foreground/80 leading-relaxed mb-8">
              {t('brandDescription')}
            </p>
            <p className="font-body text-primary-foreground/60 leading-relaxed mb-8">
              Every piece in our collection tells a story of craftsmanship, quality, and timeless design. 
              We source the finest materials from around the world and work with skilled artisans 
              who share our passion for excellence.
            </p>
            <Button
              asChild
              className="bg-gold text-gold-foreground hover:bg-gold/90 font-heading font-semibold"
            >
              <Link to="/about">
                {t('readMore')}
                <ArrowRight className={`w-4 h-4 ${direction === 'rtl' ? 'mr-2 rotate-180' : 'ml-2'}`} />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: direction === 'rtl' ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={`relative ${direction === 'rtl' ? 'order-1' : ''}`}
          >
            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 border-2 border-gold/30 rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-60 h-60 border-2 border-teal/30 rounded-full" />
            
            <div className="relative grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-[3/4] bg-sand/20 rounded-lg overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-teal/20 to-gold/20 flex items-center justify-center">
                    <span className="font-heading text-6xl font-bold text-gold/40">R</span>
                  </div>
                </div>
                <div className="aspect-square bg-teal rounded-lg flex items-center justify-center">
                  <span className="font-heading text-3xl font-bold">2015</span>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="aspect-square bg-coral rounded-lg flex items-center justify-center">
                  <span className="font-heading text-4xl font-bold text-coral-foreground">10+</span>
                </div>
                <div className="aspect-[3/4] bg-gold/20 rounded-lg overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-gold/30 to-sand/30 flex items-center justify-center">
                    <span className="font-heading text-5xl font-bold text-primary/20">∞</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PhilosophySection;
