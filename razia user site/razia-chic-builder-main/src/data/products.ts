// Product images imports
import silkGown1 from '@/assets/products/silk-gown-1.jpg';
import silkGown2 from '@/assets/products/silk-gown-2.jpg';
import abaya1 from '@/assets/products/abaya-1.jpg';
import abaya2 from '@/assets/products/abaya-2.jpg';
import cashmereTop1 from '@/assets/products/cashmere-top-1.jpg';
import cashmereTop2 from '@/assets/products/cashmere-top-2.jpg';
import pleatedSkirt1 from '@/assets/products/pleated-skirt-1.jpg';
import pleatedSkirt2 from '@/assets/products/pleated-skirt-2.jpg';
import pearlClutch1 from '@/assets/products/pearl-clutch-1.jpg';
import pearlClutch2 from '@/assets/products/pearl-clutch-2.jpg';
import velvetDress1 from '@/assets/products/velvet-dress-1.jpg';
import velvetDress2 from '@/assets/products/velvet-dress-2.jpg';
import modernAbaya1 from '@/assets/products/modern-abaya-1.jpg';
import modernAbaya2 from '@/assets/products/modern-abaya-2.jpg';
import silkScarf1 from '@/assets/products/silk-scarf-1.jpg';
import silkScarf2 from '@/assets/products/silk-scarf-2.jpg';

export interface Product {
  id: string;
  name: string;
  nameAr: string;
  price: number;
  originalPrice?: number;
  description: string;
  descriptionAr: string;
  category: string;
  categoryAr: string;
  images: string[];
  sizes: string[];
  colors: { name: string; nameAr: string; hex: string }[];
  isNew?: boolean;
  isFeatured?: boolean;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Silk Evening Gown',
    nameAr: 'فستان سهرة حريري',
    price: 2450,
    description: 'Luxurious silk evening gown with delicate embroidery. Perfect for special occasions.',
    descriptionAr: 'فستان سهرة حريري فاخر مع تطريز رقيق. مثالي للمناسبات الخاصة.',
    category: 'Dresses',
    categoryAr: 'فساتين',
    images: [silkGown1, silkGown2, silkGown1, silkGown2, silkGown1, silkGown2],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Emerald', nameAr: 'زمردي', hex: '#00A998' },
      { name: 'Navy', nameAr: 'كحلي', hex: '#093942' },
    ],
    isNew: true,
    isFeatured: true,
  },
  {
    id: '2',
    name: 'Embroidered Abaya',
    nameAr: 'عباءة مطرزة',
    price: 1850,
    description: 'Elegant black abaya with gold thread embroidery along the sleeves and hem.',
    descriptionAr: 'عباءة سوداء أنيقة مع تطريز بخيوط ذهبية على الأكمام والحاشية.',
    category: 'Abayas',
    categoryAr: 'عباءات',
    images: [abaya1, abaya2, abaya1, abaya2, abaya1, abaya2],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Black', nameAr: 'أسود', hex: '#434244' },
    ],
    isNew: true,
  },
  {
    id: '3',
    name: 'Cashmere Wrap Top',
    nameAr: 'بلوزة كاشمير ملفوفة',
    price: 890,
    description: 'Soft cashmere wrap top with an adjustable waist tie.',
    descriptionAr: 'بلوزة كاشمير ناعمة ملفوفة مع رباط خصر قابل للتعديل.',
    category: 'Tops',
    categoryAr: 'قمصان',
    images: [cashmereTop1, cashmereTop2, cashmereTop1, cashmereTop2, cashmereTop1, cashmereTop2],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Sand', nameAr: 'رملي', hex: '#BEB7A6' },
      { name: 'Coral', nameAr: 'مرجاني', hex: '#E4084D' },
    ],
    isFeatured: true,
  },
  {
    id: '4',
    name: 'Pleated Midi Skirt',
    nameAr: 'تنورة ميدي مطوية',
    price: 680,
    description: 'Flowing pleated midi skirt in luxurious satin.',
    descriptionAr: 'تنورة ميدي مطوية انسيابية من الساتان الفاخر.',
    category: 'Skirts',
    categoryAr: 'تنانير',
    images: [pleatedSkirt1, pleatedSkirt2, pleatedSkirt1, pleatedSkirt2, pleatedSkirt1, pleatedSkirt2],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Gold', nameAr: 'ذهبي', hex: '#FFCF01' },
      { name: 'Teal', nameAr: 'تيل', hex: '#005A64' },
    ],
  },
  {
    id: '5',
    name: 'Pearl Clutch',
    nameAr: 'حقيبة لؤلؤية',
    price: 520,
    description: 'Handcrafted pearl-embellished clutch for evening occasions.',
    descriptionAr: 'حقيبة يد مصنوعة يدويًا مزينة باللؤلؤ للمناسبات المسائية.',
    category: 'Accessories',
    categoryAr: 'إكسسوارات',
    images: [pearlClutch1, pearlClutch2, pearlClutch1, pearlClutch2, pearlClutch1, pearlClutch2],
    sizes: ['One Size'],
    colors: [
      { name: 'White', nameAr: 'أبيض', hex: '#FEFEFD' },
      { name: 'Gold', nameAr: 'ذهبي', hex: '#FFCF01' },
    ],
    isNew: true,
  },
  {
    id: '6',
    name: 'Velvet Maxi Dress',
    nameAr: 'فستان ماكسي مخملي',
    price: 1980,
    description: 'Rich velvet maxi dress with long sleeves and a subtle sheen.',
    descriptionAr: 'فستان ماكسي مخملي غني بأكمام طويلة ولمعان خفيف.',
    category: 'Dresses',
    categoryAr: 'فساتين',
    images: [velvetDress1, velvetDress2, velvetDress1, velvetDress2, velvetDress1, velvetDress2],
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Teal', nameAr: 'تيل', hex: '#00A998' },
      { name: 'Coral', nameAr: 'مرجاني', hex: '#E4084D' },
    ],
    isFeatured: true,
  },
  {
    id: '7',
    name: 'Modern Open Abaya',
    nameAr: 'عباءة مفتوحة عصرية',
    price: 1650,
    description: 'Contemporary open-front abaya with geometric patterns.',
    descriptionAr: 'عباءة مفتوحة من الأمام بتصميم عصري ونقوش هندسية.',
    category: 'Abayas',
    categoryAr: 'عباءات',
    images: [modernAbaya1, modernAbaya2, modernAbaya1, modernAbaya2, modernAbaya1, modernAbaya2],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Navy', nameAr: 'كحلي', hex: '#093942' },
    ],
    isFeatured: true,
  },
  {
    id: '8',
    name: 'Silk Scarf',
    nameAr: 'وشاح حريري',
    price: 380,
    description: 'Pure silk scarf with hand-painted floral motifs.',
    descriptionAr: 'وشاح حريري نقي مع زخارف زهرية مرسومة يدويًا.',
    category: 'Accessories',
    categoryAr: 'إكسسوارات',
    images: [silkScarf1, silkScarf2, silkScarf1, silkScarf2, silkScarf1, silkScarf2],
    sizes: ['One Size'],
    colors: [
      { name: 'Multi', nameAr: 'متعدد', hex: '#BEB7A6' },
    ],
  },
];

export const categories = [
  { id: 'dresses', name: 'Dresses', nameAr: 'فساتين', image: velvetDress1 },
  { id: 'abayas', name: 'Abayas', nameAr: 'عباءات', image: abaya1 },
  { id: 'tops', name: 'Tops', nameAr: 'قمصان', image: cashmereTop1 },
  { id: 'skirts', name: 'Skirts', nameAr: 'تنانير', image: pleatedSkirt1 },
  { id: 'accessories', name: 'Accessories', nameAr: 'إكسسوارات', image: pearlClutch1 },
  { id: 'new-in', name: 'New In', nameAr: 'جديدنا', image: silkGown1 },
];
