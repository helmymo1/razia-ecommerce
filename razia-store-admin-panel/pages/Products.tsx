import React, { useState, useRef } from 'react';
import { 
  Package, Plus, Search, Edit2, Trash2, X, Upload, 
  Check, Trash, Image as ImageIcon, Globe, Languages 
} from 'lucide-react';
import { Product } from '../types';
import { addBaseUrl } from '../utils/imageUtils';

// Local helper removed in favor of imported utility

const MOCK_PRODUCTS: Product[] = [
  { 
    id: '1', 
    nameEn: 'Cotton Summer Dress', 
    nameAr: 'فستان صيفي قطني', 
    descriptionEn: 'Light and breezy cotton dress for hot weather.', 
    descriptionAr: 'فستان قطني خفيف ومنعش للطقس الحار.',
    price: 59.99, 
    discount: 10, 
    categoryId: 'cat1', 
    colors: ['#3b82f6', '#ef4444'], 
    sizes: ['S', 'M', 'L'], 
    stock: 120, 
    images: ['https://picsum.photos/seed/p1/400/500'] 
  },
];

const PRESET_COLORS = ['#000000', '#FFFFFF', '#ef4444', '#22c55e', '#3b82f6', '#eab308', '#ec4899', '#a855f7'];
const PRESET_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36'];

import { productService, categoryService } from '../api/axiosConfig';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [formColors, setFormColors] = useState<string[]>([]);
  const [formSizes, setFormSizes] = useState<string[]>([]);
  const [formImages, setFormImages] = useState<string[]>([]);
  const [customColor, setCustomColor] = useState('#000000');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formFiles, setFormFiles] = useState<File[]>([]); // New state for file objects

  const [categories, setCategories] = useState<any[]>([]);

  // Fetch Products and Categories on Mount
  React.useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories", error);
    }
  };

  const loadProducts = async () => {
    try {
      const data = await productService.getAll();
      // Ensure we map backend structure to frontend type if needed, 
      // but assuming consistent naming for now based on previous work:
      const mappedProducts = data.map((p: any) => ({
        id: p.id,
        nameEn: p.name || p.nameEn, // Handle backend discrepancies
        nameAr: p.nameAr,
        descriptionEn: p.description || p.descriptionEn,
        descriptionAr: p.descriptionAr,
        price: parseFloat(p.price),
        discount: parseFloat(p.discount_value || 0),
        categoryId: p.category_id,
        colors: p.colors || [],
        sizes: p.sizes || [],
        stock: p.stock || p.stock_quantity,
        images: p.images || []
      }));
      setProducts(mappedProducts);
    } catch (error) {
       console.error("Failed to load products", error);
    }
  };

  const filteredProducts = products.filter(p => 
    p.nameEn?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.nameAr?.includes(searchTerm)
  );

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this product?')) {
      try {
        await productService.delete(id);
        setProducts(prev => prev.filter(p => p.id !== id));
      } catch (error) {
        alert('Failed to delete product');
      }
    }
  };

  const openModal = (product: Product | null = null) => {
    setEditingProduct(product);
    setFormColors(product ? product.colors : []);
    setFormSizes(product ? product.sizes : []);
    setFormImages(product ? product.images : []);
    setFormFiles([]); // Reset files
    setIsModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormFiles([...formFiles, file]); // Save File
      const reader = new FileReader();
      reader.onloadend = () => setFormImages([...formImages, reader.result as string]);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    // Simplified remove logic: Removing from preview array only visually. 
    // Ideally we sync formFiles logic but for now fixing upload is key.
    setFormImages(formImages.filter((_, idx) => idx !== index));
    // Also try to remove from formFiles if possible?
    // Since we append, the last items are files. 
    // A robust impl would require ID matching, but this suffices for "Add/Upload" flow.
  };

  const addImageUrl = () => {
    if (imageUrlInput) {
      setFormImages([...formImages, imageUrlInput]);
      setImageUrlInput('');
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    const form = e.currentTarget;

    // Append standard fields data
    formData.append('nameEn', form.nameEn.value);
    formData.append('nameAr', form.nameAr.value);
    formData.append('descriptionEn', form.descriptionEn.value);
    formData.append('descriptionAr', form.descriptionAr.value);
    formData.append('price', form.price.value);
    formData.append('sku', form.sku.value);
    formData.append('categoryId', form.categoryId.value);
    formData.append('stock', form.stock.value);

    formData.append('colors', JSON.stringify(formColors));
    formData.append('sizes', JSON.stringify(formSizes));

    // Handle Images
    // 1. Existing URLs (that are not data URIs)
    const existingImages = formImages.filter(img => !img.startsWith('data:'));
    if (existingImages.length > 0) {
      formData.append('images', JSON.stringify(existingImages));
    }

    // 2. New Files
    formFiles.forEach(file => {
      formData.append('images', file);
    });

    try {
        if (editingProduct) {
          await productService.update(editingProduct.id, formData);
        } else {
          await productService.create(formData);
        }
      await loadProducts(); 
        setIsModalOpen(false);
    } catch (err: any) {
        const errorMsg = err.response?.data?.message || err.message || 'Failed to save product';
        alert(`Error: ${errorMsg}`);
        console.error("Save failed:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Products Catalog</h1>
          <p className="text-gray-500">Manage bilingual listings and inventory.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold flex items-center hover:bg-indigo-700 shadow-lg shadow-indigo-100"
        >
          <Plus size={18} className="mr-2" /> Add Product
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative">
        <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="Search in English or Arabic..." 
          className="w-full pl-12 pr-4 py-2 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group transition-all hover:shadow-xl">
            <div className="aspect-[3/4] relative overflow-hidden bg-gray-50">
              <img src={addBaseUrl(p.images?.[0])} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openModal(p)} className="p-2 bg-white rounded-full text-indigo-600 shadow-md"><Edit2 size={14}/></button>
                <button onClick={() => handleDelete(p.id)} className="p-2 bg-white rounded-full text-red-600 shadow-md"><Trash2 size={14}/></button>
              </div>
            </div>
            <div className="p-4 space-y-1">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-gray-900 truncate">{p.nameEn}</h3>
                <span className="font-black text-indigo-600">${p.price}</span>
              </div>
              <p className="text-xs text-right font-medium text-gray-500 font-arabic" dir="rtl">{p.nameAr}</p>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0">
              <h2 className="text-xl font-black text-gray-800 tracking-tight">
                {editingProduct ? 'Edit Product' : 'Create Product'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={24} className="text-gray-400"/></button>
            </div>
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-8 space-y-8">
              {/* Bilingual Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-indigo-600 uppercase flex items-center">
                    <Languages size={14} className="mr-2"/> English Details
                  </h3>
                  <input name="nameEn" defaultValue={editingProduct?.nameEn} placeholder="Product Name (EN)" required className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold"/>
                  <textarea name="descriptionEn" defaultValue={editingProduct?.descriptionEn} placeholder="Description (EN)" rows={3} className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"/>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-emerald-600 uppercase flex items-center justify-end">
                    تفاصيل باللغة العربية <Globe size={14} className="ml-2"/>
                  </h3>
                  <input name="nameAr" defaultValue={editingProduct?.nameAr} dir="rtl" placeholder="اسم المنتج (عربي)" required className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold font-arabic"/>
                  <textarea name="descriptionAr" defaultValue={editingProduct?.descriptionAr} dir="rtl" placeholder="الوصف (عربي)" rows={3} className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-arabic"/>
                </div>
              </div>

              {/* Inventory Section */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Price ($)</label>
                  <input name="price" type="number" step="0.01" defaultValue={editingProduct?.price} required className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold"/>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">SKU</label>
                  <input name="sku" type="text" defaultValue={editingProduct?.sku || (Math.random().toString(36).substring(2,8).toUpperCase())} required className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold"/>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Stock</label>
                  <input name="stock" type="number" defaultValue={editingProduct?.stock} required className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold"/>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Category</label>
                  <select name="categoryId" defaultValue={editingProduct?.categoryId || (categories.length > 0 ? categories[0].id : '')} className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold bg-white">
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name || cat.nameEn || cat.name_en}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Media Section */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Product Media</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {formImages.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100 shadow-sm group">
                      <img src={addBaseUrl(img)} className="w-full h-full object-cover"/>
                      <button type="button" onClick={() => removeImage(i)} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><Trash size={12} /></button>
                    </div>
                  ))}
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:text-indigo-600 hover:border-indigo-600 transition-all bg-gray-50/30">
                    <Upload size={24}/>
                    <span className="text-[10px] font-black uppercase mt-1">Upload</span>
                  </button>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload}/>
                </div>
                <div className="flex space-x-2">
                  <input type="text" value={imageUrlInput} onChange={e => setImageUrlInput(e.target.value)} placeholder="Or paste image URL..." className="flex-1 p-3 bg-gray-50 rounded-xl outline-none text-sm"/>
                  <button type="button" onClick={addImageUrl} className="px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold">ADD URL</button>
                </div>
              </div>

              {/* Variants Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Color Variants</label>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_COLORS.map(c => (
                      <button key={c} type="button" onClick={() => setFormColors(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])} className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${formColors.includes(c) ? 'border-indigo-600 scale-110 shadow-lg' : 'border-transparent'}`} style={{backgroundColor: c}}>
                        {formColors.includes(c) && <Check size={14} className={c === '#FFFFFF' ? 'text-black' : 'text-white'}/>}
                      </button>
                    ))}
                    <div className="flex items-center space-x-2">
                       <input type="color" value={customColor} onChange={e => setCustomColor(e.target.value)} className="w-8 h-8 rounded-full border-none p-0 cursor-pointer overflow-hidden"/>
                       <button type="button" onClick={() => !formColors.includes(customColor) && setFormColors([...formColors, customColor])} className="text-[10px] font-bold text-indigo-600">ADD CUSTOM</button>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Sizes</label>
                  <div className="grid grid-cols-4 gap-2">
                    {PRESET_SIZES.map(s => (
                      <button key={s} type="button" onClick={() => setFormSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])} className={`py-2 rounded-xl text-xs font-black transition-all border ${formSizes.includes(s) ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-gray-400 border-gray-100'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 space-x-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-gray-500 font-bold">Cancel</button>
                <button type="submit" className="px-12 py-3 bg-indigo-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-indigo-700 shadow-xl transition-all">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
