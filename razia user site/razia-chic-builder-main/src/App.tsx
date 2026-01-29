import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ProductPage from "./pages/ProductPage";
import Categories from "./pages/Categories";
import OutfitBuilder from "./pages/OutfitBuilder";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";
import CityCategoryPage from "./pages/CityCategoryPage";

const queryClient = new QueryClient();

import { useEffect } from "react";
import { toast } from "sonner";
import io from 'socket.io-client';

import { useAnalytics } from "@/hooks/useAnalytics";

const App = () => {
  useAnalytics(); // Auto-track page views
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      localStorage.setItem('active_referral', ref);
      setTimeout(() => toast.success('Referral Discount Applied!'), 500);
    }

    // Connect to Backend Socket
    const socketUrl = import.meta.env.VITE_API_URL ?? window.location.origin;
    const socket = io(socketUrl || window.location.origin);

    socket.on("connect", () => {
      console.log("✅ Socket Connected to Backend");
    });

    socket.on("order_update", (data: any) => {
      console.log("📩 Received Socket Event:", data);
      toast.info(data.message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <LanguageProvider>
            <CartProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <ScrollToTop />
                  <ErrorBoundary>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/shop" element={<Shop />} />
                      <Route path="/shop/:category/in/:city" element={<CityCategoryPage />} />
                      <Route path="/product/:id" element={<ProductPage />} />
                      <Route path="/categories" element={<Categories />} />
                      <Route path="/category/:id" element={<Shop />} />
                      <Route path="/outfit-builder" element={<OutfitBuilder />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </ErrorBoundary>
                </BrowserRouter>
              </TooltipProvider>
            </CartProvider>
          </LanguageProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
