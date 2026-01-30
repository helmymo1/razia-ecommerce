
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  Package, 
  Tag, 
  RefreshCcw, 
  Ticket, 
  Star, 
  Settings, 
  BarChart3, 
  Truck, 
  UserCircle,
  Menu,
  X,
  Bell,
  Search
} from 'lucide-react';

// Pages
import Dashboard from './pages/Dashboard';
import UsersPage from './pages/Users';
import OrdersPage from './pages/Orders';
import ProductsPage from './pages/Products';
import CategoriesPage from './pages/Categories';
import RefundsPage from './pages/Refunds';
import PromoCodesPage from './pages/PromoCodes';
import ReviewsPage from './pages/Reviews';
import SettingsPage from './pages/Settings';
import MarketingPage from './pages/Marketing';
import DeliveryPage from './pages/Delivery';
import AdminProfilePage from './pages/AdminProfile';
import LoginPage from './pages/Login';

// Fix: Use React.FC to include standard React props like 'key' in the component's type definition
const SidebarItem: React.FC<{ to: string, icon: any, label: string, active: boolean }> = ({ to, icon: Icon, label, active }) => (
  <Link 
    to={to} 
    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
      active 
        ? 'bg-indigo-600 text-white shadow-lg' 
        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </Link>
);

const Sidebar = ({ isOpen, toggle }: { isOpen: boolean, toggle: () => void }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/users', icon: Users, label: 'Users' },
    { to: '/orders', icon: ShoppingBag, label: 'Orders' },
    { to: '/products', icon: Package, label: 'Products' },
    { to: '/categories', icon: Tag, label: 'Categories' },
    { to: '/refunds', icon: RefreshCcw, label: 'Refunds & Cancels' },
    { to: '/promocodes', icon: Ticket, label: 'Promo Codes' },
    { to: '/reviews', icon: Star, label: 'Reviews' },
    { to: '/marketing', icon: BarChart3, label: 'Marketing' },
    { to: '/delivery', icon: Truck, label: 'Delivery' },
    { to: '/settings', icon: Settings, label: 'Settings' },
    { to: '/admin', icon: UserCircle, label: 'Admin Profile' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggle}
        />
      )}
      
      <aside className={`fixed inset-y-0 left-0 bg-gray-900 w-64 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out z-50 overflow-y-auto`}>
        <div className="p-6">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.png" alt="Razia Store" className="h-10 w-auto object-contain" />
          </Link>
        </div>
        
        <nav className="mt-4 px-4 space-y-2">
          {menuItems.map((item) => (
            <SidebarItem 
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              active={currentPath === item.to || (item.to === '/' && currentPath === '')}
            />
          ))}
        </nav>
      </aside>
    </>
  );
};

const Header = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  return (
    <header className="bg-white border-b border-gray-200 h-16 fixed top-0 right-0 left-0 lg:left-64 z-30 flex items-center justify-between px-4 lg:px-8">
      <div className="flex items-center lg:hidden">
        <button onClick={toggleSidebar} className="p-2 text-gray-600 hover:bg-gray-100 rounded">
          <Menu size={24} />
        </button>
      </div>

      <div className="hidden md:flex flex-1 max-w-md ml-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search dashboard..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="h-8 w-px bg-gray-200 mx-2"></div>
        <div className="flex items-center space-x-3">
          <img 
            src="https://picsum.photos/seed/admin/40/40" 
            alt="Admin" 
            className="w-8 h-8 rounded-full border border-gray-200"
          />
          <div className="hidden sm:block text-left">
            <p className="text-sm font-semibold text-gray-700">Sarah Jenkins</p>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Manager</p>
          </div>
        </div>
      </div>
    </header>
  );
};

const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggle={toggleSidebar} />
      <Header toggleSidebar={toggleSidebar} />
      <main className="pt-20 lg:ml-64 p-4 lg:p-8 transition-all duration-300">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/refunds" element={<RefundsPage />} />
          <Route path="/promocodes" element={<PromoCodesPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/marketing" element={<MarketingPage />} />
          <Route path="/delivery" element={<DeliveryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/admin" element={<AdminProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router basename="/admin">
      <AppLayout />
    </Router>
  );
};

export default App;
