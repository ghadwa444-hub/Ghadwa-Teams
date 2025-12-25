
import React, { useState } from 'react';
import { MenuItem, Chef } from '../../types';
import { AdminFormModal } from '../Modals';
import { supabase } from '../../services/supabase';

interface AdminBestSellersProps {
    bestSellers: MenuItem[];
    chefs: Chef[];
    onAdd: (item: MenuItem) => void;
    onEdit: (item: MenuItem) => void;
    onDelete: (id: string) => void;
}

export const AdminBestSellers: React.FC<AdminBestSellersProps> = ({ bestSellers, chefs, onAdd, onEdit, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState<MenuItem | null>(null);
    const [formData, setFormData] = useState<any>({ name: '', price: '', category: '', chef_id: '', description: '', image_url: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };

    const openAdd = () => {
        setCurrentItem(null);
        setFormData({ name: '', price: '', category: '', chef_id: '', description: '', image_url: '' });
        setIsModalOpen(true);
    };

    const openEdit = (item: MenuItem) => {
        setCurrentItem(item);
        setFormData({
            name: item.name,
            price: item.price,
            category: item.category,
            chef_id: item.chef_id,
            description: item.description || '',
            image_url: item.image_url || ''
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const itemData = {
                name: formData.name,
                title: formData.name, // Required field - sync with name
                price: Number(formData.price),
                category: formData.category,
                chef_id: formData.chef_id || null,
                description: formData.description || null,
                image_url: formData.image_url || null,
                is_available: true,
                is_active: true, // Required field for database
                is_featured: true,
                is_offer: false,
                preparation_time: 30 // Default prep time
            };

            if (currentItem) {
                const { data, error } = await supabase
                    .from('products')
                    .update(itemData)
                    .eq('id', currentItem.id)
                    .select()
                    .single();

                if (error) throw error;
                if (data) {
                    const updatedItem: MenuItem = { ...data };
                    onEdit(updatedItem);
                }
                showNotification('success', 'تم تحديث الوجبة بنجاح! ✅');
            } else {
                const { data, error } = await supabase
                    .from('products')
                    .insert([itemData])
                    .select()
                    .single();

                if (error) throw error;
                if (data) {
                    const newItem: MenuItem = { ...data };
                    onAdd(newItem);
                }
                showNotification('success', 'تم إضافة الوجبة بنجاح! ✅');
            }

            setIsModalOpen(false);
            setFormData({ name: '', price: '', category: '', chef_id: '', description: '', image_url: '' });
        } catch (error) {
            console.error('Error saving best seller:', error);
            showNotification('error', `خطأ: ${error instanceof Error ? error.message : 'فشل حفظ الوجبة'}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            {notification && (
                <div className={`fixed top-4 right-4 px-6 py-3 rounded-xl font-bold text-white shadow-lg z-50 animate-bounce ${
                    notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                }`}>
                    {notification.message}
                </div>
            )}
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-900">الأكثر مبيعاً 🌟</h2>
                <button onClick={openAdd} className="bg-[#8B2525] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-[#6b1c1c] transition flex items-center gap-2">
                    <i className="fa-solid fa-plus"></i> إضافة وجبة
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-right">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 text-gray-700 font-bold">الصورة</th>
                            <th className="p-4 text-gray-700 font-bold">اسم الوجبة</th>
                            <th className="p-4 text-gray-700 font-bold">السعر</th>
                            <th className="p-4 text-gray-700 font-bold">الشيف</th>
                            <th className="p-4 text-gray-700 font-bold">الوصف</th>
                            <th className="p-4 text-gray-700 font-bold">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-800">
                        {bestSellers.map(item => {
                            const chef = chefs.find(c => c.id === item.chef_id);
                            return (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="p-4">
                                    <img src={item.image_url || '/placeholder.jpg'} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                                </td>
                                <td className="p-4 font-bold">{item.name}</td>
                                <td className="p-4 text-[#8B2525] font-bold">{item.price} ج.م</td>
                                <td className="p-4 text-sm text-gray-600">{chef?.chef_name || '-'}</td>
                                <td className="p-4 text-sm text-gray-500 max-w-xs truncate">{item.description || '-'}</td>
                                <td className="p-4 flex gap-2">
                                    <button onClick={() => openEdit(item)} className="text-blue-500 bg-blue-50 p-2 rounded-lg hover:bg-blue-100 transition"><i className="fa-solid fa-pen"></i></button>
                                    <button 
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); onDelete(item.id); }} 
                                        className="text-red-500 bg-red-50 p-2 rounded-lg hover:bg-red-100 transition"
                                    >
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        );
                        })}
                    </tbody>
                </table>
            </div>

            <AdminFormModal isOpen={isModalOpen} onClose={() => !isLoading && setIsModalOpen(false)} title={currentItem ? "تعديل وجبة" : "إضافة وجبة مميزة"} onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="اسم الوجبة" 
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-900" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    disabled={isLoading}
                    required 
                />
                <div className="grid grid-cols-2 gap-4">
                    <input 
                        type="number" 
                        placeholder="السعر" 
                        className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-900" 
                        value={formData.price} 
                        onChange={e => setFormData({...formData, price: e.target.value})} 
                        disabled={isLoading}
                        required 
                    />
                    <input 
                        type="text" 
                        placeholder="التصنيف (محاشي، طواجن...)" 
                        className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-900" 
                        value={formData.category} 
                        onChange={e => setFormData({...formData, category: e.target.value})} 
                        disabled={isLoading}
                        required 
                    />
                </div>
                
                <select 
                    title="Select chef"
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-900" 
                    value={formData.chef_id || ''} 
                    onChange={e => setFormData({...formData, chef_id: e.target.value})}
                    disabled={isLoading}
                >
                    <option value="">اختر الشيف (اختياري)</option>
                    {chefs.map(chef => (
                        <option key={chef.id} value={chef.id}>{chef.chef_name}</option>
                    ))}
                </select>

                <textarea 
                    placeholder="وصف الوجبة" 
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-900 h-24" 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    disabled={isLoading}
                    required
                />
                
                <input 
                    type="text" 
                    placeholder="رابط الصورة" 
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-900" 
                    value={formData.image_url} 
                    onChange={e => setFormData({...formData, image_url: e.target.value})}
                    disabled={isLoading}
                />

                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-[#8B2525] text-white py-3 rounded-xl font-bold hover:bg-[#6b1c1c] transition disabled:opacity-50"
                >
                    {isLoading ? 'جاري الحفظ...' : (currentItem ? 'تحديث الوجبة' : 'إضافة الوجبة')}
                </button>
            </AdminFormModal>
        </div>
    );
};
