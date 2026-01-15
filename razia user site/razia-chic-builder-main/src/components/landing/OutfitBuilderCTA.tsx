import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import WaveDivider from '@/components/graphics/WaveDivider';

const OutfitBuilderCTA: React.FC = () => {
  const { t, direction } = useLanguage();

  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-teal via-primary to-navy relative overflow-hidden">
      {/* Top wave divider */}
      <div className="absolute top-0 left-0 right-0 rotate-180">
        <WaveDivider variant="teal" />
      </div>
      
      {/* Decorative arcs */}
      <motion.div
        className="absolute -top-20 -right-20 w-80 h-80 opacity-20"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <path d="M100,20 A80,80 0 0,1 180,100" fill="none" stroke="hsl(var(--gold))" strokeWidth="2" />
          <path d="M100,40 A60,60 0 0,1 160,100" fill="none" stroke="hsl(var(--coral))" strokeWidth="2" />
          <path d="M100,60 A40,40 0 0,1 140,100" fill="none" stroke="hsl(var(--sand))" strokeWidth="2" />
        </svg>
      </motion.div>
      
      <motion.div
        className="absolute -bottom-20 -left-20 w-60 h-60 opacity-15"
        initial={{ rotate: 0 }}
        animate={{ rotate: -360 }}
        transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <path d="M20,100 A80,80 0 0,1 100,180" fill="none" stroke="hsl(var(--gold))" strokeWidth="2" />
          <path d="M40,100 A60,60 0 0,1 100,160" fill="none" stroke="hsl(var(--sand))" strokeWidth="2" />
        </svg>
      </motion.div>
      
      {/* Decorative circles */}
      <div className="absolute top-1/4 left-10 w-32 h-32 bg-gold/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-10 w-48 h-48 bg-coral/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gold text-gold-foreground rounded-full mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-bold">Exclusive Feature</span>
          </motion.div>

          <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold text-background leading-tight mb-6">
            {t('outfitBuilderTitle')}
          </h2>
          <p className="font-body text-lg text-background/80 mb-8 max-w-xl mx-auto">
            {t('outfitBuilderDesc')}
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {[15, 20, 25].map((discount, i) => (
              <motion.div
                key={discount}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="px-6 py-3 bg-background/10 backdrop-blur-sm rounded-lg border border-background/20"
              >
                <span className="font-heading text-2xl font-bold text-gold">{discount}%</span>
                <span className="font-body text-sm text-background/80 block">{i + 3} items</span>
              </motion.div>
            ))}
          </div>

          <Button
            asChild
            size="lg"
            className="bg-gold text-gold-foreground hover:bg-gold/90 font-heading font-semibold px-10 py-6 text-lg"
          >
            <Link to="/outfit-builder">
              Start Building
              <ArrowRight className={`w-5 h-5 ${direction === 'rtl' ? 'mr-2 rotate-180' : 'ml-2'}`} />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default OutfitBuilderCTA;
