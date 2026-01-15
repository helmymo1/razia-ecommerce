import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Instagram, Twitter, Facebook } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const Contact: React.FC = () => {
  const { t, direction } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t('contact')}
            </h1>
            <p className="font-body text-muted-foreground max-w-xl mx-auto">
              {t('contactSubtitle')}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: direction === 'rtl' ? 30 : -30 }}
              animate={{ opacity: 1, x: 0 }}
              className={`bg-card rounded-2xl p-8 shadow-lg ${direction === 'rtl' ? 'lg:order-2' : ''}`}
            >
              <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
                {t('sendUsMessage')}
              </h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-sm font-medium text-foreground block mb-2">
                      {t('firstName')}
                    </label>
                    <Input placeholder={t('yourFirstName')} className="bg-background" />
                  </div>
                  <div>
                    <label className="font-body text-sm font-medium text-foreground block mb-2">
                      {t('lastName')}
                    </label>
                    <Input placeholder={t('yourLastName')} className="bg-background" />
                  </div>
                </div>
                <div>
                  <label className="font-body text-sm font-medium text-foreground block mb-2">
                    {t('email')}
                  </label>
                  <Input type="email" placeholder="your@email.com" className="bg-background" />
                </div>
                <div>
                  <label className="font-body text-sm font-medium text-foreground block mb-2">
                    {t('subject')}
                  </label>
                  <Input placeholder={t('howCanWeHelp')} className="bg-background" />
                </div>
                <div>
                  <label className="font-body text-sm font-medium text-foreground block mb-2">
                    {t('message')}
                  </label>
                  <Textarea
                    placeholder={t('tellUsMore')}
                    className="bg-background min-h-[150px]"
                  />
                </div>
                <Button className="w-full bg-primary text-primary-foreground font-heading font-semibold">
                  <Send className={`w-4 h-4 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                  {t('sendMessage')}
                </Button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: direction === 'rtl' ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              className={`space-y-8 ${direction === 'rtl' ? 'lg:order-1' : ''}`}
            >
              {/* Info Cards */}
              <div className="space-y-4">
                <div className={`flex items-start gap-4 p-6 bg-teal/10 rounded-xl ${direction === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                  <div className="w-12 h-12 bg-teal rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-teal-foreground" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-foreground mb-1">{t('emailUs')}</h3>
                    <p className="font-body text-muted-foreground">support@razia.com</p>
                    <p className="font-body text-muted-foreground">orders@razia.com</p>
                  </div>
                </div>

                <div className={`flex items-start gap-4 p-6 bg-gold/10 rounded-xl ${direction === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                  <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-gold-foreground" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-foreground mb-1">{t('callUs')}</h3>
                    <p className="font-body text-muted-foreground">+966 12 345 6789</p>
                    <p className="font-body text-sm text-muted-foreground">{t('workingHours')}</p>
                  </div>
                </div>

                <div className={`flex items-start gap-4 p-6 bg-coral/10 rounded-xl ${direction === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                  <div className="w-12 h-12 bg-coral rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-coral-foreground" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-foreground mb-1">{t('visitUs')}</h3>
                    <p className="font-body text-muted-foreground">King Fahd Road</p>
                    <p className="font-body text-muted-foreground">Riyadh, Saudi Arabia</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="p-6 bg-primary rounded-xl text-primary-foreground">
                <h3 className="font-heading font-bold mb-4">{t('followUs')}</h3>
                <div className="flex gap-4">
                  <a
                    href="#"
                    className="w-12 h-12 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-gold hover:text-gold-foreground transition-all"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="w-12 h-12 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-gold hover:text-gold-foreground transition-all"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="w-12 h-12 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-gold hover:text-gold-foreground transition-all"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="h-64 bg-muted rounded-xl flex items-center justify-center">
                <span className="font-body text-muted-foreground">{t('mapIntegration')}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
