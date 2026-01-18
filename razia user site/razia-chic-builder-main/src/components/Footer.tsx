import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Instagram, Twitter, Facebook } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import WaveDivider from '@/components/graphics/WaveDivider';

// Payment logos
import madaLogo from '@/assets/payments/mada.png';
import tabbyLogo from '@/assets/payments/tabby.png';
import tamaraLogo from '@/assets/payments/tamara.png';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  const footerLinks = [
    { label: t('shop'), path: '/shop' },
    { label: t('about'), path: '/about' },
    { label: t('contact'), path: '/contact' },
    { label: t('categories'), path: '/categories' },
  ];

  return (
    <footer className="bg-primary text-primary-foreground relative">
      {/* Decorative wave at top */}
      <div className="absolute -top-16 md:-top-24 left-0 right-0">
        <WaveDivider variant="primary" />
      </div>
      
      {/* Decorative arcs in background */}
      <div className="absolute top-20 right-10 w-32 h-32 opacity-10 hidden md:block">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M80,20 A60,60 0 0,1 80,80" fill="none" stroke="hsl(var(--gold))" strokeWidth="2" />
          <path d="M70,30 A40,40 0 0,1 70,70" fill="none" stroke="hsl(var(--sand))" strokeWidth="1.5" />
        </svg>
      </div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h3 className="font-heading text-2xl md:text-3xl font-bold mb-4">
            {t('newsletter')}
          </h3>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <Input
              type="email"
              placeholder={t('emailPlaceholder')}
              className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
            />
            <Button className="bg-gold text-gold-foreground hover:bg-gold/90 font-medium px-8">
              {t('subscribe')}
            </Button>
          </div>
        </motion.div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h2 className="font-heading text-3xl font-bold mb-4">Razia</h2>
            <p className="font-body text-primary-foreground/80 text-sm leading-relaxed">
              {t('brandDescription')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="font-body text-sm text-primary-foreground/80 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Payment */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">{t('followUs')}</h4>
            <div className="flex gap-4 mb-8">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('instagram') || "Instagram"}
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-gold hover:text-gold-foreground transition-all"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('twitter') || "Twitter"}
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-gold hover:text-gold-foreground transition-all"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('facebook') || "Facebook"}
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-gold hover:text-gold-foreground transition-all"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>

            <h4 className="font-heading text-lg font-semibold mb-4">{t('paymentMethods')}</h4>
            <div className="flex flex-wrap items-center gap-3">
              {/* Visa */}
              <div className="bg-white rounded px-2 py-1 h-8 flex items-center">
                <svg viewBox="0 0 48 16" className="h-4 w-auto">
                  <path fill="#1434CB" d="M19.5 1.5l-3 13h-2.5l3-13h2.5zm12.5 8.4l1.3-3.6.8 3.6h-2.1zm2.8 4.6h2.3l-2-13h-2.1c-.5 0-.9.3-1.1.7l-3.8 12.3h2.7l.5-1.5h3.3l.2 1.5zm-6.8-4.2c0-3.4-4.7-3.6-4.7-5.1 0-.5.5-.9 1.4-.9.8 0 1.8.2 2.5.6l.4-2.1c-.6-.3-1.7-.5-2.8-.5-3 0-5.1 1.6-5.1 3.8 0 1.7 1.5 2.6 2.6 3.1 1.1.6 1.5.9 1.5 1.5 0 .8-.9 1.1-1.7 1.1-1.4 0-2.2-.3-3.4-.7l-.5 2.1c.8.4 2.3.7 3.8.7 3.2 0 5.3-1.6 5.3-4zm-15.5-8.8l-4.5 13h-2.7l-2.2-10.4c-.1-.5-.3-.7-.7-.9-.7-.4-1.8-.7-2.9-.9l.1-.8h4.3c.5 0 1 .4 1.1.9l1.1 5.7 2.7-6.6h2.7z"/>
                </svg>
              </div>
              
              {/* Mastercard */}
              <div className="bg-white rounded px-2 py-1 h-8 flex items-center">
                <svg viewBox="0 0 48 30" className="h-5 w-auto">
                  <circle cx="17" cy="15" r="12" fill="#EB001B"/>
                  <circle cx="31" cy="15" r="12" fill="#F79E1B"/>
                  <path d="M24 5.5c3.5 2.5 5.8 6.6 5.8 11.3s-2.3 8.8-5.8 11.3c-3.5-2.5-5.8-6.6-5.8-11.3s2.3-8.8 5.8-11.3z" fill="#FF5F00"/>
                </svg>
              </div>
              
              {/* Mada */}
              <div className="bg-white rounded px-2 py-1 h-8 flex items-center">
                <img src={madaLogo} alt="Mada" className="h-5 w-auto object-contain" />
              </div>
              
              {/* Tabby */}
              <div className="bg-white rounded px-2 py-1 h-8 flex items-center">
                <img src={tabbyLogo} alt="Tabby" className="h-5 w-auto object-contain" />
              </div>
              
              {/* Tamara */}
              <div className="bg-white rounded px-2 py-1 h-8 flex items-center">
                <img src={tamaraLogo} alt="Tamara" className="h-5 w-auto object-contain" />
              </div>
              
              {/* Apple Pay */}
              <div className="bg-white rounded px-2 py-1 h-8 flex items-center">
                <svg viewBox="0 0 50 21" className="h-5 w-auto">
                  <path fill="#000" d="M9.6 5.4c-.6.7-1.5 1.3-2.4 1.2-.1-.9.3-1.9.9-2.5.6-.7 1.6-1.2 2.4-1.2.1.9-.3 1.9-.9 2.5zm.9 1.3c-1.3-.1-2.5.8-3.1.8-.6 0-1.6-.7-2.7-.7-1.4 0-2.7.8-3.4 2-.7 1.2-.6 3.5.6 5.5.6.9 1.3 2 2.3 2 .9 0 1.3-.6 2.6-.6s1.5.6 2.5.6c1 0 1.6-.9 2.2-1.8.5-.6.7-1.2.8-1.3-.1 0-1.6-.6-1.6-2.4 0-1.5 1.2-2.2 1.3-2.3-.8-1.2-2-1.3-2.5-1.3zm9.7-2.4v11.9h1.9v-4.1h2.6c2.4 0 4.1-1.6 4.1-4 0-2.3-1.6-3.9-4-3.9h-4.6zm1.9 1.6h2.2c1.6 0 2.5.9 2.5 2.3 0 1.5-.9 2.4-2.5 2.4h-2.2v-4.7zm9.1 10.4c1.2 0 2.3-.6 2.8-1.6h.1v1.5h1.8v-5.9c0-1.8-1.4-2.9-3.6-2.9-2 0-3.5 1.1-3.5 2.7h1.7c.2-.8.9-1.2 1.8-1.2 1.2 0 1.9.5 1.9 1.5v.7l-2.4.1c-2.3.1-3.5 1.1-3.5 2.6s1.3 2.5 2.9 2.5zm.5-1.4c-1 0-1.7-.5-1.7-1.3 0-.8.6-1.2 1.8-1.3l2.2-.1v.7c0 1.2-1 2-2.3 2zm6.4 4.3c1.9 0 2.7-.7 3.5-2.9l3.3-9.3h-2l-2.2 7h-.1l-2.2-7h-2l3.2 8.7-.2.5c-.3.9-.8 1.2-1.6 1.2h-.5v1.5l.8.3z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 pt-8 text-center">
          <p className="font-body text-sm text-primary-foreground/60">
            © 2025 Razia. {t('allRightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;