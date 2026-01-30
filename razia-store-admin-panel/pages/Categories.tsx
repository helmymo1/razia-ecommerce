
import React, { useState, useRef } from 'react';
import { Tag, Plus, Edit2, Trash2, X, Upload, Languages, Globe } from 'lucide-react';
import { Category } from '../types';
import toast from 'react-hot-toast';

const MOCK_CATS: Category[] = [
  { 
    id: 'cat1', 
    nameEn: 'Summer Dresses', 
    nameAr: 'فساتين صيفية', 
    descriptionEn: 'Light airy pieces.', 
    descriptionAr: 'قطع صيفية خفيفة.',
    image: 'https://picsum.photos/seed/cat1/400/300' 
  },
];

import { categoryService } from '../api/axiosConfig';
import { addBaseUrl } from '../utils/imageUtils';

// Upload logic moved to service

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      // Map backend fields to frontend interface
      const mapped = data.map((c: any) => ({
        ...c,
        nameEn: c.name || c.nameEn || '',
        descriptionEn: c.description || c.descriptionEn || ''
      }));
      setCategories(mapped);
    } catch (error) {
      console.error("Failed to load categories", error);
      toast.error("Failed to load categories");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this category?')) {
      try {
        await categoryService.delete(id);
        setCategories(prev => prev.filter(c => c.id !== id));
      } catch (error) {
        alert('Failed to delete category');
      }
    }
  };

  const openModal = (cat: Category | null = null) => {
    setEditingCategory(cat);
    setPreviewImage(cat ? cat.image : null);
    setIsModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget); // This captures nameEn, nameAr, descriptionEn, imageUrl

    // Manually reconstruct to match backend/controller expectation
    // Controller expects: name, name_ar, description, image (file or text)
    // We will create a NEW FormData to be precise
    const submissionData = new FormData();
    submissionData.append('name', formData.get('nameEn') as string);
    submissionData.append('name_ar', formData.get('nameAr') as string);
    submissionData.append('description', formData.get('descriptionEn') as string);

    const nameEn = formData.get('nameEn') as string;
    const slug = nameEn.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Date.now().toString().slice(-4);
    submissionData.append('slug', slug);

    // Image
    const file = fileInputRef.current?.files?.[0];
    if (file) {
      submissionData.append('image', file);
    } else if (formData.get('imageUrl')) {
      submissionData.append('image', formData.get('imageUrl') as string);
    } else if (editingCategory?.image) {
      submissionData.append('image', editingCategory.image);
    }

    console.log('Submitting Category Data:', {
      nameEn,
      slug,
      nameAr: formData.get('nameAr'),
      desc: formData.get('descriptionEn')
    });

    try {
        if (editingCategory) {
          await categoryService.update(editingCategory.id, submissionData);
          toast.success("Category updated");
        } else {
          await categoryService.create(submissionData);
          toast.success("Category created");
        }
        await loadCategories();
        setIsModalOpen(false);
        setEditingCategory(null);
      setPreviewImage(null);
    } catch (err: any) {
      console.error("Save Error:", err);
      toast.error(err.response?.data?.message || 'Failed to save category');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Store Categories</h1>
          <p className="text-gray-500">Organize your shop with bilingual metadata.</p>
        </div>
        <button onClick={() => openModal()} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 shadow-lg">
          <Plus size={18} className="mr-2" /> New Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group transition-all hover:shadow-xl">
            <div className="h-48 relative overflow-hidden bg-gray-50">
              <img src={addBaseUrl(cat.image)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all">
                <button onClick={() => openModal(cat)} className="p-2 bg-white rounded-full text-indigo-600 shadow-lg"><Edit2 size={16}/></button>
                <button onClick={() => handleDelete(cat.id)} className="p-2 bg-white rounded-full text-red-600 shadow-lg"><Trash2 size={16}/></button>
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-bold text-xl text-gray-900">{cat.nameEn}</h3>
              <p className="text-sm text-right font-medium text-gray-400 font-arabic mt-1" dir="rtl">{cat.nameAr}</p>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-300 overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-2xl font-black text-gray-800 tracking-tight">Manage Category</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={24} className="text-gray-400"/></button>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-1">Name (English)</label>
                  <input name="nameEn" defaultValue={editingCategory?.nameEn} required className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold"/>
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mr-1 text-right">الاسم (بالعربي)</label>
                  <input name="nameAr" defaultValue={editingCategory?.nameAr} dir="rtl" required className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold font-arabic"/>
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                  <textarea name="descriptionEn" defaultValue={editingCategory?.descriptionEn} rows={2} className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
                </div>
              </div>
              
              <div className="space-y-3">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Hero Image</label>
                 {previewImage && (
                   <div className="h-32 rounded-2xl overflow-hidden border border-gray-100 mb-3 relative">
                    <img src={addBaseUrl(previewImage)} className="w-full h-full object-cover" />
                     <button type="button" onClick={() => setPreviewImage(null)} className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full"><X size={12}/></button>
                   </div>
                 )}
                 <div className="flex space-x-2">
                   <input name="imageUrl" defaultValue={editingCategory?.image} placeholder="Paste Image URL..." className="flex-1 p-3 bg-gray-50 rounded-xl outline-none text-sm"/>
                   <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors"><Upload size={18}/></button>
                 </div>
                 <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload}/>
              </div>

              <div className="flex justify-end pt-4 space-x-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-gray-400 font-bold">Cancel</button>
                <button type="submit" className="px-10 py-3 bg-indigo-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100">Save Category</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
