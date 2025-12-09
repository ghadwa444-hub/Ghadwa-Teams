
import React, { useState } from 'react';
import { PromoCode } from '../../types';
import { AdminFormModal } from '../Modals';

interface AdminPromoCodesProps {
    promoCodes: PromoCode[];
    onAdd: (promo: PromoCode) => void;
    onDelete: (id: number) => void;
}

export const AdminPromoCodes: React.FC<AdminPromoCodesProps> = ({ promoCodes, onAdd, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<any>({ code: '', value: '', type: 'percentage' });

    // Sort promo codes by ID (which is timestamp based) descending
    const sortedPromoCodes = [...promoCodes].sort((a, b) => b.id - a.id);

    const openAdd = () => {
        setFormData({ code: '', value: '', type: 'percentage' });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({ 
            id: Date.now(), 
            code: formData.code.toUpperCase(), 
            value: Number(formData.value), 
            type: formData.type,
            createdAt: new Date().toLocaleDateString('ar-EG') // Capture current date
        });
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
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
                                <th className="p-4 text-gray-700 font-bold">قيمة الخصم</th>
                                <th className="p-4 text-gray-700 font-bold">النوع</th>
                                <th className="p-4 text-gray-700 font-bold">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-gray-800">
                            {sortedPromoCodes.map(promo => (
                                <tr key={promo.id} className="hover:bg-gray-50">
                                    <td className="p-4 text-sm text-gray-500">{promo.createdAt || '-'}</td>
                                    <td className="p-4 font-bold text-[#8B2525] font-mono text-lg">{promo.code}</td>
                                    <td className="p-4 font-bold">
                                        {promo.value} {promo.type === 'percentage' ? '%' : 'ج.م'}
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">
                                        {promo.type === 'percentage' ? 'نسبة مئوية' : 'مبلغ ثابت'}
                                    </td>
                                    <td className="p-4">
                                        <button 
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

            <AdminFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="إضافة كوبون جديد" onSubmit={handleSubmit}>
                <input type="text" placeholder="الكود (مثال: SAVE20)" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-900 uppercase font-mono" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} required />
                <div className="flex gap-4">
                    <input type="number" placeholder="قيمة الخصم" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-900" value={formData.value} onChange={e => setFormData({...formData, value: e.target.value})} required />
                    <select className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-900" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                        <option value="percentage">نسبة مئوية (%)</option>
                        <option value="fixed">مبلغ ثابت (ج.م)</option>
                    </select>
                </div>
            </AdminFormModal>
        </div>
    );
};
