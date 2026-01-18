import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, ShoppingBag, Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';
import Logo from './Logo';

const Navbar: React.FC = () => {
  const { t, language, setLanguage, direction } = useLanguage();
  const { totalItems, openCart } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: t('home') },
    { path: '/shop', label: t('shop') },
    { path: '/categories', label: t('categories') },
    { path: '/outfit-builder', label: t('outfitBuilder') },
    { path: '/about', label: t('about') },
    { path: '/contact', label: t('contact') },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          isScrolled
            ? 'bg-background/95 backdrop-blur-md shadow-md'
            : 'bg-transparent'
        )}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <Logo size="sm" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'relative font-body text-sm font-medium transition-colors duration-300',
                    location.pathname === link.path
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground',
                    'after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gold after:scale-x-0 after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-left'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1 p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={language === 'en' ? "Switch to Arabic" : "Switch to English"}
              >
                <Globe className="w-5 h-5" />
                <span className="text-xs font-medium uppercase">{language}</span>
              </button>

              {/* Profile */}
              <Link
                to="/profile"
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Profile"
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-coral text-coral-foreground text-xs font-bold rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-md flex items-start justify-center pt-32"
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="w-full max-w-2xl px-4"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={t('search')}
                  className="w-full py-4 px-14 text-xl bg-transparent border-b-2 border-border focus:border-primary outline-none font-body"
                  autoFocus
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/50 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Slide-in Menu */}
            <motion.div
              initial={{ x: direction === 'rtl' ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: direction === 'rtl' ? '-100%' : '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className={cn(
                "fixed top-0 bottom-0 z-[70] w-[80%] max-w-sm bg-background shadow-2xl lg:hidden",
                direction === 'rtl' ? 'left-0' : 'right-0'
              )}
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className={cn(
                  "flex items-center justify-between px-4 h-20 border-b border-border",
                  direction === 'rtl' && 'flex-row-reverse'
                )}>
                  <Logo size="sm" />
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 hover:bg-muted rounded-full transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                {/* Navigation Links */}
                <nav className="flex-1 py-6 px-4 overflow-y-auto">
                  <div className="space-y-1">
                    {navLinks.map((link, index) => (
                      <motion.div
                        key={link.path}
                        initial={{ opacity: 0, x: direction === 'rtl' ? -20 : 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          to={link.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={cn(
                            "flex items-center gap-3 py-3 px-4 rounded-lg font-heading text-lg font-medium transition-colors",
                            location.pathname === link.path
                              ? 'bg-primary/10 text-primary'
                              : 'text-foreground hover:bg-muted',
                            direction === 'rtl' && 'flex-row-reverse text-right'
                          )}
                        >
                          {link.label}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </nav>
                
                {/* Footer with Language Toggle */}
                <div className="p-4 border-t border-border">
                  <button
                    onClick={toggleLanguage}
                    className={cn(
                      "flex items-center gap-2 w-full py-3 px-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors",
                      direction === 'rtl' && 'flex-row-reverse'
                    )}
                  >
                    <Globe className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">
                      {language === 'en' ? 'العربية' : 'English'}
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
