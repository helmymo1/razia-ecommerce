import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ar';
type Direction = 'ltr' | 'rtl';

interface Translations {
  [key: string]: {
    en: string;
    ar: string;
  };
}

const translations: Translations = {
  // Navigation
  home: { en: 'Home', ar: 'الرئيسية' },
  shop: { en: 'Shop', ar: 'تسوق' },
  categories: { en: 'Categories', ar: 'الفئات' },
  outfitBuilder: { en: 'Outfit Builder', ar: 'منسق الأزياء' },
  about: { en: 'About', ar: 'من نحن' },
  contact: { en: 'Contact', ar: 'اتصل بنا' },
  search: { en: 'Search...', ar: 'بحث...' },
  cart: { en: 'Cart', ar: 'السلة' },
  profile: { en: 'Profile', ar: 'حسابي' },

  // Hero
  heroTitle: { en: 'Timeless Elegance', ar: 'أناقة خالدة' },
  heroSubtitle: { en: 'Discover our curated collection of luxury fashion', ar: 'اكتشفي مجموعتنا المنسقة من الأزياء الفاخرة' },
  shopNow: { en: 'Shop Now', ar: 'تسوقي الآن' },
  exploreCollection: { en: 'Explore Collection', ar: 'استكشفي المجموعة' },

  // Categories
  shopByCategory: { en: 'Shop by Category', ar: 'تسوقي حسب الفئة' },
  dresses: { en: 'Dresses', ar: 'فساتين' },
  abayas: { en: 'Abayas', ar: 'عباءات' },
  tops: { en: 'Tops', ar: 'قمصان' },
  skirts: { en: 'Skirts', ar: 'تنانير' },
  accessories: { en: 'Accessories', ar: 'إكسسوارات' },
  newIn: { en: 'New In', ar: 'جديدنا' },

  // Products
  latestArrivals: { en: 'Latest Arrivals', ar: 'أحدث الوصولات' },
  viewAll: { en: 'View All', ar: 'عرض الكل' },
  addToCart: { en: 'Add to Cart', ar: 'أضيفي للسلة' },
  buyNow: { en: 'Buy Now', ar: 'اشتري الآن' },
  size: { en: 'Size', ar: 'المقاس' },
  color: { en: 'Color', ar: 'اللون' },
  quantity: { en: 'Quantity', ar: 'الكمية' },

  // Brand Philosophy
  brandPhilosophy: { en: 'Our Philosophy', ar: 'فلسفتنا' },
  brandDescription: { 
    en: 'At Razia, we believe fashion is an art form. Each piece is carefully selected to embody elegance, quality, and timeless style.', 
    ar: 'في رازيا، نؤمن أن الموضة فن. كل قطعة تم اختيارها بعناية لتجسد الأناقة والجودة والأسلوب الخالد.'
  },
  readMore: { en: 'Read More', ar: 'اقرأي المزيد' },

  // About Page
  ourStory: { en: 'Our Story', ar: 'قصتنا' },
  foundedOnPassion: { en: 'Founded on Passion', ar: 'تأسست على الشغف' },
  aboutParagraph1: { 
    en: 'Razia was born from a vision to bring exceptional luxury fashion to the modern woman. Founded in 2015, we\'ve grown from a small boutique to a renowned destination for those who appreciate the finer things in life.', 
    ar: 'ولدت رازيا من رؤية لتقديم أزياء فاخرة استثنائية للمرأة العصرية. تأسست في عام 2015، وتطورنا من متجر صغير إلى وجهة مرموقة لمن يقدرون أفضل الأشياء في الحياة.'
  },
  aboutParagraph2: { 
    en: 'Our name "Razia" means "content and satisfied" in Arabic, reflecting our commitment to ensuring every customer leaves with a smile and a piece they\'ll treasure for years.', 
    ar: 'اسمنا "رازيا" يعني "الراضية والقانعة" بالعربية، مما يعكس التزامنا بضمان مغادرة كل عميلة بابتسامة وقطعة ستعتز بها لسنوات.'
  },
  aboutParagraph3: { 
    en: 'We believe fashion should empower, inspire, and celebrate individuality. That\'s why we curate collections that blend timeless elegance with contemporary trends, ensuring there\'s something perfect for every occasion.', 
    ar: 'نؤمن أن الموضة يجب أن تمكّن وتلهم وتحتفي بالتفرد. لهذا ننتقي مجموعات تمزج الأناقة الخالدة مع التوجهات المعاصرة، لضمان وجود شيء مثالي لكل مناسبة.'
  },
  years: { en: 'Years', ar: 'سنوات' },
  products: { en: 'Products', ar: 'منتجات' },
  happyCustomers: { en: 'Happy Customers', ar: 'عملاء سعداء' },
  madeWithLove: { en: 'Made with Love', ar: 'صُنع بحب' },
  ourValues: { en: 'Our Values', ar: 'قيمنا' },
  quality: { en: 'Quality', ar: 'الجودة' },
  qualityDesc: { en: 'We source only the finest materials and work with skilled artisans who share our passion for excellence.', ar: 'نحصل على أجود المواد فقط ونعمل مع حرفيين مهرة يشاركوننا شغفنا بالتميز.' },
  elegance: { en: 'Elegance', ar: 'الأناقة' },
  eleganceDesc: { en: 'Every piece is designed to make you feel confident, beautiful, and empowered.', ar: 'كل قطعة مصممة لتجعلك تشعرين بالثقة والجمال والقوة.' },
  sustainability: { en: 'Sustainability', ar: 'الاستدامة' },
  sustainabilityDesc: { en: 'We are committed to ethical practices and reducing our environmental footprint.', ar: 'نحن ملتزمون بالممارسات الأخلاقية وتقليل بصمتنا البيئية.' },
  readyToExplore: { en: 'Ready to Explore?', ar: 'مستعدة للاستكشاف؟' },

  // Outfit Builder
  outfitBuilderTitle: { en: 'Create Your Perfect Outfit', ar: 'ابتكري إطلالتك المثالية' },
  outfitBuilderDesc: { en: 'Mix and match pieces to create your unique look', ar: 'امزجي القطع لابتكار إطلالتك الفريدة' },
  bundleDiscount: { en: 'Bundle Discount', ar: 'خصم المجموعة' },
  totalSavings: { en: 'Total Savings', ar: 'إجمالي التوفير' },
  exclusiveFeature: { en: 'Exclusive Feature', ar: 'ميزة حصرية' },
  shareAndEarn: { en: 'Share & Earn', ar: 'شاركي واربحي' },
  applyPromoCode: { en: 'Apply Promo Code', ar: 'تطبيق كود الخصم' },
  code: { en: 'Code', ar: 'الكود' },
  box: { en: 'Box', ar: 'صندوق' },
  selected: { en: 'Selected', ar: 'محدد' },
  selectItem: { en: 'Select item', ar: 'اختاري قطعة' },
  clickProductsToAdd: { en: 'Click products to add', ar: 'انقري على المنتجات للإضافة' },
  items: { en: 'items', ar: 'قطع' },
  item: { en: 'item', ar: 'قطعة' },
  yourOutfit: { en: 'Your Outfit', ar: 'إطلالتك' },
  total: { en: 'Total', ar: 'الإجمالي' },
  youSave: { en: 'You save', ar: 'وفرتِ' },
  all: { en: 'All', ar: 'الكل' },
  clickBoxFirst: { en: 'Click on a box first, then select products to add', ar: 'انقري على صندوق أولاً، ثم اختاري المنتجات للإضافة' },
  shareYourOutfit: { en: 'Share Your Outfit & Earn', ar: 'شاركي إطلالتك واربحي' },
  shareDescription: { en: 'Share this link with friends. When they purchase, they get 10% off and you earn a 15% promo code!', ar: 'شاركي هذا الرابط مع صديقاتك. عند الشراء، يحصلن على خصم 10% وتحصلين على كود خصم 15%!' },
  yourUniqueLink: { en: 'Your unique share link', ar: 'رابط المشاركة الخاص بك' },
  yourReferralCode: { en: 'Your referral code', ar: 'كود الإحالة الخاص بك' },
  copy: { en: 'Copy', ar: 'نسخ' },
  friendGets: { en: 'Friend gets', ar: 'صديقتك تحصل على' },
  youEarn: { en: 'You earn', ar: 'تحصلين على' },
  off: { en: 'OFF', ar: 'خصم' },
  shareVia: { en: 'Share via', ar: 'شاركي عبر' },
  promoCodeBonus: { en: 'Promo code bonus', ar: 'مكافأة كود الخصم' },
  remove: { en: 'Remove', ar: 'إزالة' },
  shareEarnProgram: { en: 'Share & Earn Program', ar: 'برنامج المشاركة والربح' },
  shareEarnDesc: { en: 'Share your outfit with friends! They get 10% off and you earn 15% promo code when they make a purchase.', ar: 'شاركي إطلالتك مع صديقاتك! يحصلن على خصم 10% وتحصلين على كود خصم 15% عند الشراء.' },
  enterPromoCode: { en: 'Enter promo code', ar: 'أدخلي كود الخصم' },
  apply: { en: 'Apply', ar: 'تطبيق' },
  codeApplied: { en: 'Code Applied!', ar: 'تم تطبيق الكود!' },
  getPromoCodeHint: { en: 'Get a promo code by having a friend share their outfit with you!', ar: 'احصلي على كود خصم عندما تشاركك صديقتك إطلالتها!' },
  promoCodeDescription: { en: 'Enter a promo code or referral code to get an additional discount.', ar: 'أدخلي كود خصم أو كود إحالة للحصول على خصم إضافي.' },
  added: { en: 'Added', ar: 'تمت الإضافة' },
  to: { en: 'to', ar: 'إلى' },
  cleared: { en: 'cleared', ar: 'تم المسح' },
  referralApplied: { en: 'Referral discount applied! You get 10% off your purchase.', ar: 'تم تطبيق خصم الإحالة! تحصلين على خصم 10% على مشترياتك.' },
  addItemsFirst: { en: 'Please add some items to your outfit first!', ar: 'الرجاء إضافة بعض القطع لإطلالتك أولاً!' },
  itemsAddedToCart: { en: 'items to cart with', ar: 'قطع للسلة مع خصم' },
  discount: { en: 'discount', ar: 'خصم' },
  copiedToClipboard: { en: 'Copied to clipboard!', ar: 'تم النسخ!' },
  promoApplied: { en: 'Promo code applied! You get 10% off!', ar: 'تم تطبيق كود الخصم! تحصلين على خصم 10%!' },
  invalidPromo: { en: 'Invalid promo code', ar: 'كود خصم غير صالح' },
  enterPromoFirst: { en: 'Please enter a promo code', ar: 'الرجاء إدخال كود الخصم' },
  promoRemoved: { en: 'Promo code removed', ar: 'تم إزالة كود الخصم' },

  // Footer
  newsletter: { en: 'Subscribe to our newsletter', ar: 'اشتركي في النشرة البريدية' },
  emailPlaceholder: { en: 'Enter your email', ar: 'أدخلي بريدك الإلكتروني' },
  subscribe: { en: 'Subscribe', ar: 'اشتراك' },
  followUs: { en: 'Follow Us', ar: 'تابعينا' },
  paymentMethods: { en: 'Payment Methods', ar: 'طرق الدفع' },
  allRightsReserved: { en: 'All rights reserved', ar: 'جميع الحقوق محفوظة' },

  // Filters
  filter: { en: 'Filter', ar: 'تصفية' },
  priceRange: { en: 'Price Range', ar: 'نطاق السعر' },
  applyFilters: { en: 'Apply Filters', ar: 'تطبيق الفلاتر' },
  clearFilters: { en: 'Clear Filters', ar: 'مسح الفلاتر' },

  // Cart
  yourCart: { en: 'Your Cart', ar: 'سلتك' },
  subtotal: { en: 'Subtotal', ar: 'المجموع الفرعي' },
  checkout: { en: 'Checkout', ar: 'الدفع' },
  continueShopping: { en: 'Continue Shopping', ar: 'متابعة التسوق' },
  emptyCart: { en: 'Your cart is empty', ar: 'سلتك فارغة' },

  // Contact Page
  contactSubtitle: { en: "We'd love to hear from you. Send us a message and we'll respond as soon as possible.", ar: 'يسعدنا سماع رأيك. أرسلي لنا رسالة وسنرد في أقرب وقت ممكن.' },
  sendUsMessage: { en: 'Send us a message', ar: 'أرسلي لنا رسالة' },
  firstName: { en: 'First Name', ar: 'الاسم الأول' },
  lastName: { en: 'Last Name', ar: 'اسم العائلة' },
  yourFirstName: { en: 'Your first name', ar: 'اسمك الأول' },
  yourLastName: { en: 'Your last name', ar: 'اسم عائلتك' },
  email: { en: 'Email', ar: 'البريد الإلكتروني' },
  subject: { en: 'Subject', ar: 'الموضوع' },
  howCanWeHelp: { en: 'How can we help?', ar: 'كيف يمكننا مساعدتك؟' },
  message: { en: 'Message', ar: 'الرسالة' },
  tellUsMore: { en: 'Tell us more...', ar: 'أخبرينا المزيد...' },
  sendMessage: { en: 'Send Message', ar: 'إرسال الرسالة' },
  emailUs: { en: 'Email Us', ar: 'راسلينا' },
  callUs: { en: 'Call Us', ar: 'اتصلي بنا' },
  visitUs: { en: 'Visit Us', ar: 'زورينا' },
  workingHours: { en: 'Sun-Thu, 9AM-6PM', ar: 'الأحد-الخميس، 9 صباحاً-6 مساءً' },
  mapIntegration: { en: 'Map Integration', ar: 'خريطة الموقع' },
};

interface LanguageContextType {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const direction: Direction = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
  }, [language, direction]);

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) return key;
    return translation[language];
  };

  return (
    <LanguageContext.Provider value={{ language, direction, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
