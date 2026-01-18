import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ScrollToTop from "@/components/ScrollToTop";
import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './components/ErrorFallback';
import { useNetworkStatus } from './hooks/useNetworkStatus';

// Lazy load pages
const Index = React.lazy(() => import("./pages/Index"));
const Shop = React.lazy(() => import("./pages/Shop"));
const ProductPage = React.lazy(() => import("./pages/ProductPage"));
const Categories = React.lazy(() => import("./pages/Categories"));
const OutfitBuilder = React.lazy(() => import("./pages/OutfitBuilder"));
const About = React.lazy(() => import("./pages/About"));
const Contact = React.lazy(() => import("./pages/Contact"));
const Profile = React.lazy(() => import("./pages/Profile"));
const Auth = React.lazy(() => import("./pages/Auth"));
const Checkout = React.lazy(() => import("./pages/Checkout"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

const AppContent = () => {
  useNetworkStatus(); // Initialize network monitoring

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/category/:id" element={<Shop />} />
        <Route path="/outfit-builder" element={<OutfitBuilder />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <ErrorBoundary
                FallbackComponent={ErrorFallback}
                onReset={() => window.location.reload()}
              >
                <AppContent />
              </ErrorBoundary>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
