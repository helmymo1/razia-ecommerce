import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const About: React.FC = () => {
  const { t, direction } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />

      <main className="pt-24 pb-20">
        {/* Hero Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center"
            >
              <span className="inline-block px-4 py-2 bg-gold text-gold-foreground text-sm font-bold rounded-full mb-6">
                {t('ourStory')}
              </span>
              <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6">
                {t('brandPhilosophy')}
              </h1>
              <p className="font-body text-lg text-primary-foreground/80 leading-relaxed">
                {t('brandDescription')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className={`grid md:grid-cols-2 gap-12 items-center ${direction === 'rtl' ? 'md:flex-row-reverse' : ''}`}>
              <motion.div
                initial={{ opacity: 0, x: direction === 'rtl' ? 30 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={direction === 'rtl' ? 'md:order-2' : ''}
              >
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
                  {t('foundedOnPassion')}
                </h2>
                <p className="font-body text-muted-foreground leading-relaxed mb-4">
                  {t('aboutParagraph1')}
                </p>
                <p className="font-body text-muted-foreground leading-relaxed mb-4">
                  {t('aboutParagraph2')}
                </p>
                <p className="font-body text-muted-foreground leading-relaxed">
                  {t('aboutParagraph3')}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: direction === 'rtl' ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`grid grid-cols-2 gap-4 ${direction === 'rtl' ? 'md:order-1' : ''}`}
              >
                <div className="space-y-4">
                  <div className="aspect-[3/4] bg-teal rounded-xl flex items-center justify-center">
                    <div className="text-center text-teal-foreground">
                      <span className="font-heading text-5xl font-bold block">10+</span>
                      <span className="font-body text-sm">{t('years')}</span>
                    </div>
                  </div>
                  <div className="aspect-square bg-sand rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <span className="font-heading text-4xl font-bold block text-foreground">500+</span>
                      <span className="font-body text-sm text-muted-foreground">{t('products')}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="aspect-square bg-gold rounded-xl flex items-center justify-center">
                    <div className="text-center text-gold-foreground">
                      <span className="font-heading text-4xl font-bold block">50K+</span>
                      <span className="font-body text-sm">{t('happyCustomers')}</span>
                    </div>
                  </div>
                  <div className="aspect-[3/4] bg-coral rounded-xl flex items-center justify-center">
                    <div className="text-center text-coral-foreground">
                      <span className="font-heading text-5xl font-bold block">♥</span>
                      <span className="font-body text-sm">{t('madeWithLove')}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-sand-light/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t('ourValues')}
              </h2>
              <div className="w-20 h-1 bg-gold mx-auto" />
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  titleKey: 'quality',
                  descKey: 'qualityDesc',
                  color: 'bg-teal',
                },
                {
                  titleKey: 'elegance',
                  descKey: 'eleganceDesc',
                  color: 'bg-gold',
                },
                {
                  titleKey: 'sustainability',
                  descKey: 'sustainabilityDesc',
                  color: 'bg-coral',
                },
              ].map((value, index) => (
                <motion.div
                  key={value.titleKey}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-8"
                >
                  <div className={`w-16 h-16 ${value.color} rounded-full mx-auto mb-6`} />
                  <h3 className="font-heading text-xl font-bold text-foreground mb-3">
                    {t(value.titleKey)}
                  </h3>
                  <p className="font-body text-muted-foreground">
                    {t(value.descKey)}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
                {t('readyToExplore')}
              </h2>
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground font-heading font-semibold px-8"
              >
                <Link to="/shop">
                  {t('shopNow')}
                  <ArrowRight className={`w-5 h-5 ${direction === 'rtl' ? 'mr-2 rotate-180' : 'ml-2'}`} />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
