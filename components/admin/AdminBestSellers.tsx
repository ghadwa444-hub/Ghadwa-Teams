
import React, { useState } from 'react';
import { MenuItem, Chef } from '../../types';
import { AdminFormModal } from '../Modals';

interface AdminBestSellersProps {
    bestSellers: MenuItem[];
    chefs: Chef[];
    onAdd: (item: MenuItem) => void;
    onEdit: (item: MenuItem) => void;
    onDelete: (id: number) => void;
}

export const AdminBestSellers: React.FC<AdminBestSellersProps> = ({ bestSellers, chefs, onAdd, onEdit, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState<MenuItem | null>(null);
    const [formData, setFormData] = useState<any>({ name: '', price: '', category: '', chef: '', desc: '', img: '' });

    const openAdd = () => {
        setCurrentItem(null);
        setFormData({ name: '', price: '', category: '', chef: '', desc: '', img: 'https://source.unsplash.com/random/food' });
        setIsModalOpen(true);
    };

    const openEdit = (item: MenuItem) => {
        setCurrentItem(item);
        setFormData(item);
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentItem) {
            onEdit({ ...currentItem, ...formData, price: Number(formData.price) });
        } else {
            onAdd({ ...formData, price: Number(formData.price), id: Date.now() });
        }
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
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
                        {bestSellers.map(item => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="p-4">
                                    <img src={item.img} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                                </td>
                                <td className="p-4 font-bold">{item.name}</td>
                                <td className="p-4 text-[#8B2525] font-bold">{item.price} ج.م</td>
                                <td className="p-4 text-sm text-gray-600">{item.chef}</td>
                                <td className="p-4 text-sm text-gray-500 max-w-xs truncate">{item.desc}</td>
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
                        ))}
                    </tbody>
                </table>
            </div>

            <AdminFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentItem ? "تعديل وجبة" : "إضافة وجبة مميزة"} onSubmit={handleSubmit}>
                <input type="text" placeholder="اسم الوجبة" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-900" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                <input type="number" placeholder="السعر" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-900" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                <input type="text" placeholder="التصنيف (محاشي، طواجن...)" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-900" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required />
                
                <select 
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-900" 
                    value={formData.chef} 
                    onChange={e => setFormData({...formData, chef: e.target.value})}
                    required
                >
                    <option value="" disabled>اختر الشيف</option>
                    {chefs.map(chef => (
                        <option key={chef.id} value={chef.name}>{chef.name}</option>
                    ))}
                </select>

                <textarea placeholder="وصف الوجبة" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-900 h-24" value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} required></textarea>
                <input type="text" placeholder="رابط الصورة" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-900" value={formData.img} onChange={e => setFormData({...formData, img: e.target.value})} />
            </AdminFormModal>
        </div>
    );
};
