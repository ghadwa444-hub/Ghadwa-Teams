
import React, { useState } from 'react';
import { MenuItem, Chef } from '../../types';
import { AdminFormModal } from '../Modals';
import { supabase } from '../../services/supabase';

interface AdminOffersProps {
    offers: MenuItem[];
    chefs: Chef[];
    onAdd: (offer: MenuItem) => void;
    onEdit: (offer: MenuItem) => void;
    onDelete: (id: string) => void;
}

export const AdminOffers: React.FC<AdminOffersProps> = ({ offers, chefs, onAdd, onEdit, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentOffer, setCurrentOffer] = useState<MenuItem | null>(null);
    const [formData, setFormData] = useState<any>({ name: '', price: '', category: '', chef_id: '', image_url: '', description: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };

    const openAdd = () => {
        setCurrentOffer(null);
        setFormData({ name: '', price: '', category: '', chef_id: '', image_url: '', description: '' });
        setIsModalOpen(true);
    };

    const openEdit = (offer: MenuItem) => {
        setCurrentOffer(offer);
        setFormData({
            name: offer.name,
            price: offer.price,
            category: offer.category,
            chef_id: offer.chef_id,
            image_url: offer.image_url || '',
            description: offer.description || ''
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const offerData = {
                name: formData.name,
                title: formData.name, // Required field - sync with name
                price: Number(formData.price),
                category: formData.category,
                chef_id: formData.chef_id || null,
                image_url: formData.image_url || null,
                description: formData.description || null,
                is_available: true,
                is_offer: true,
                is_featured: false
            };

            if (currentOffer) {
                const { data, error } = await supabase
                    .from('products')
                    .update(offerData)
                    .eq('id', currentOffer.id)
                    .select()
                    .single();

                if (error) throw error;
                if (data) {
                    const updatedOffer: MenuItem = { ...data };
                    onEdit(updatedOffer);
                }
                showNotification('success', 'تم تحديث العرض بنجاح! ✅');
            } else {
                const { data, error } = await supabase
                    .from('products')
                    .insert([offerData])
                    .select()
                    .single();

                if (error) throw error;
                if (data) {
                    const newOffer: MenuItem = { ...data };
                    onAdd(newOffer);
                }
                showNotification('success', 'تم إضافة العرض بنجاح! ✅');
            }

            setIsModalOpen(false);
            setFormData({ name: '', price: '', category: '', chef_id: '', image_url: '', description: '' });
        } catch (error) {
            console.error('Error saving offer:', error);
            showNotification('error', `خطأ: ${error instanceof Error ? error.message : 'فشل حفظ العرض'}`);
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
                <h2 className="text-3xl font-bold text-gray-900">إدارة العروض 🔥</h2>
                <button onClick={openAdd} className="bg-[#8B2525] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-[#6b1c1c] transition flex items-center gap-2">
                    <i className="fa-solid fa-plus"></i> إضافة عرض
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-right">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 text-gray-700 font-bold">الصورة</th>
                            <th className="p-4 text-gray-700 font-bold">العرض</th>
                            <th className="p-4 text-gray-700 font-bold">السعر</th>
                            <th className="p-4 text-gray-700 font-bold">التصنيف</th>
                            <th className="p-4 text-gray-700 font-bold">الشيف</th>
                            <th className="p-4 text-gray-700 font-bold">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-800">
                        {offers.map(offer => {
                            const chef = chefs.find(c => c.id === offer.chef_id);
                            return (
                            <tr key={offer.id} className="hover:bg-gray-50">
                                <td className="p-4">
                                    <img src={offer.image_url || '/placeholder.jpg'} alt={offer.name} className="w-16 h-12 rounded-lg object-cover" />
                                </td>
                                <td className="p-4 font-bold">
                                    {offer.name}
                                    <span className="block text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded w-fit mt-1">عرض 🔥</span>
                                </td>
                                <td className="p-4">
                                    <span className="text-green-600 font-bold">{offer.price} ج.م</span>
                                </td>
                                <td className="p-4 text-sm text-gray-600">
                                    {offer.category}
                                </td>
                                <td className="p-4 text-sm text-gray-600">{chef?.chef_name || '-'}</td>
                                <td className="p-4 flex gap-2">
                                    <button onClick={() => openEdit(offer)} className="text-blue-500 bg-blue-50 p-2 rounded-lg hover:bg-blue-100 transition"><i className="fa-solid fa-pen"></i></button>
                                    <button 
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); onDelete(offer.id); }} 
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

            <AdminFormModal isOpen={isModalOpen} onClose={() => !isLoading && setIsModalOpen(false)} title={currentOffer ? "تعديل عرض" : "إضافة عرض جديد"} onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="اسم العرض" 
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
                        placeholder="التصنيف (مثلاً: مشويات)" 
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
                    placeholder="وصف العرض (اختياري)" 
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-900 h-20" 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    disabled={isLoading}
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
                    {isLoading ? 'جاري الحفظ...' : (currentOffer ? 'تحديث العرض' : 'إضافة العرض')}
                </button>
            </AdminFormModal>
        </div>
    );
};
