
import React, { useState } from 'react';
import { PromoCode } from '../../types';
import { AdminFormModal } from '../Modals';
import { supabase } from '../../services/supabase';

interface AdminPromoCodesProps {
    promoCodes: PromoCode[];
    onAdd: (promo: PromoCode) => void;
    onDelete: (id: string) => void;
}

export const AdminPromoCodes: React.FC<AdminPromoCodesProps> = ({ promoCodes, onAdd, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<any>({ code: '', discount_percent: '', min_order_amount: '', max_uses: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };

    // Sort promo codes by created_at descending
    const sortedPromoCodes = [...promoCodes].sort((a, b) => 
        new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
    );

    const openAdd = () => {
        setFormData({ code: '', discount_percent: '', min_order_amount: '0', max_uses: '' });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const promoData = {
                code: formData.code.toUpperCase(),
                discount_percent: Number(formData.discount_percent),
                min_order_amount: Number(formData.min_order_amount) || 0,
                max_uses: formData.max_uses ? Number(formData.max_uses) : null,
                is_active: true
            };

            const { data, error } = await supabase
                .from('promo_codes')
                .insert([promoData])
                .select()
                .single();

            if (error) throw error;
            if (data) {
                const newPromo: PromoCode = { ...data };
                onAdd(newPromo);
            }
            
            showNotification('success', 'تم إضافة الكوبون بنجاح! ✅');
            setIsModalOpen(false);
            setFormData({ code: '', discount_percent: '', min_order_amount: '0', max_uses: '' });
        } catch (error) {
            console.error('Error saving promo code:', error);
            showNotification('error', `خطأ: ${error instanceof Error ? error.message : 'فشل حفظ الكوبون'}`);
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
                <h2 className="text-3xl font-bold text-gray-900">إدارة الكوبونات 🎫</h2>
                <button onClick={openAdd} className="bg-[#8B2525] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-[#6b1c1c] transition flex items-center gap-2">
                    <i className="fa-solid fa-plus"></i> إضافة كوبون
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {sortedPromoCodes.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        <i className="fa-solid fa-ticket text-4xl mb-3 opacity-20"></i>
                        <p>لا توجد كوبونات خصم حالياً</p>
                    </div>
                ) : (
                    <table className="w-full text-right">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-4 text-gray-700 font-bold">تاريخ الإنشاء</th>
                                <th className="p-4 text-gray-700 font-bold">الكود</th>
                                <th className="p-4 text-gray-700 font-bold">الخصم</th>
                                <th className="p-4 text-gray-700 font-bold">الحد الأدنى</th>
                                <th className="p-4 text-gray-700 font-bold">عدد الاستخدامات</th>
                                <th className="p-4 text-gray-700 font-bold">الحالة</th>
                                <th className="p-4 text-gray-700 font-bold">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-gray-800">
                            {sortedPromoCodes.map(promo => (
                                <tr key={promo.id} className="hover:bg-gray-50">
                                    <td className="p-4 text-sm text-gray-500">
                                        {promo.created_at ? new Date(promo.created_at).toLocaleDateString('ar-EG') : '-'}
                                    </td>
                                    <td className="p-4 font-bold text-[#8B2525] font-mono text-lg">{promo.code}</td>
                                    <td className="p-4 font-bold">
                                        {promo.discount_percent}%
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">
                                        {promo.min_order_amount} ج.م
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">
                                        {promo.max_uses || 'غير محدود'}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                                            promo.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                        }`}>
                                            {promo.is_active ? 'فعّال' : 'معطل'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <button 
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); onDelete(promo.id); }} 
                                            className="text-red-500 bg-red-50 p-2 rounded-lg hover:bg-red-100 transition"
                                        >
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <AdminFormModal isOpen={isModalOpen} onClose={() => !isLoading && setIsModalOpen(false)} title="إضافة كوبون جديد" onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="الكود (مثال: SAVE20)" 
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-900 uppercase font-mono" 
                    value={formData.code} 
                    onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} 
                    disabled={isLoading}
                    required 
                />
                <div className="grid grid-cols-2 gap-4">
                    <input 
                        type="number" 
                        placeholder="نسبة الخصم (%)" 
                        className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-900" 
                        value={formData.discount_percent} 
                        onChange={e => setFormData({...formData, discount_percent: e.target.value})} 
                        disabled={isLoading}
                        min="0"
                        max="100"
                        required 
                    />
                    <input 
                        type="number" 
                        placeholder="الحد الأدنى للطلب (ج.م)" 
                        className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-900" 
                        value={formData.min_order_amount} 
                        onChange={e => setFormData({...formData, min_order_amount: e.target.value})} 
                        disabled={isLoading}
                        min="0"
                        required 
                    />
                </div>
                <input 
                    type="number" 
                    placeholder="عدد الاستخدامات المسموحة (اختياري - اتركه فارغاً للاستخدام غير المحدود)" 
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-900" 
                    value={formData.max_uses} 
                    onChange={e => setFormData({...formData, max_uses: e.target.value})} 
                    disabled={isLoading}
                    min="1"
                />
                
                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-[#8B2525] text-white py-3 rounded-xl font-bold hover:bg-[#6b1c1c] transition disabled:opacity-50"
                >
                    {isLoading ? 'جاري الحفظ...' : 'إضافة الكوبون'}
                </button>
            </AdminFormModal>
        </div>
    );
};
