
import React, { useState } from 'react';
import { MenuItem, Chef } from '../../types';
import { AdminFormModal } from '../Modals';

interface AdminOffersProps {
    offers: MenuItem[];
    chefs: Chef[];
    onAdd: (offer: MenuItem) => void;
    onEdit: (offer: MenuItem) => void;
    onDelete: (id: number) => void;
}

export const AdminOffers: React.FC<AdminOffersProps> = ({ offers, chefs, onAdd, onEdit, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentOffer, setCurrentOffer] = useState<MenuItem | null>(null);
    const [formData, setFormData] = useState<any>({ name: '', price: '', oldPrice: '', discount: '', chef: '', img: '' });

    const openAdd = () => {
        setCurrentOffer(null);
        setFormData({ name: '', price: '', oldPrice: '', discount: '20%', chef: 'ماما فاطمة', img: 'https://source.unsplash.com/random/food' });
        setIsModalOpen(true);
    };

    const openEdit = (offer: MenuItem) => {
        setCurrentOffer(offer);
        setFormData(offer);
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentOffer) {
            onEdit({ ...currentOffer, ...formData, price: Number(formData.price), oldPrice: Number(formData.oldPrice) });
        } else {
            onAdd({ ...formData, price: Number(formData.price), oldPrice: Number(formData.oldPrice), id: Date.now(), chefImg: "https://source.unsplash.com/random/person" });
        }
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
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
                            <th className="p-4 text-gray-700 font-bold">السعر الحالي</th>
                            <th className="p-4 text-gray-700 font-bold">السعر القديم</th>
                            <th className="p-4 text-gray-700 font-bold">الخصم</th>
                            <th className="p-4 text-gray-700 font-bold">الشيف</th>
                            <th className="p-4 text-gray-700 font-bold">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-800">
                        {offers.map(offer => (
                            <tr key={offer.id} className="hover:bg-gray-50">
                                <td className="p-4">
                                    <img src={offer.img} alt={offer.name} className="w-16 h-12 rounded-lg object-cover" />
                                </td>
                                <td className="p-4 font-bold">{offer.name}</td>
                                <td className="p-4 text-green-600 font-bold">{offer.price} ج.م</td>
                                <td className="p-4 text-red-400 line-through">{offer.oldPrice} ج.م</td>
                                <td className="p-4"><span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-bold">{offer.discount}</span></td>
                                <td className="p-4 text-sm text-gray-600">{offer.chef}</td>
                                <td className="p-4 flex gap-2">
                                    <button onClick={() => openEdit(offer)} className="text-blue-500 bg-blue-50 p-2 rounded-lg hover:bg-blue-100 transition"><i className="fa-solid fa-pen"></i></button>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); onDelete(offer.id); }} 
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

            <AdminFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentOffer ? "تعديل عرض" : "إضافة عرض جديد"} onSubmit={handleSubmit}>
                <input type="text" placeholder="اسم العرض" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-900" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                <div className="flex gap-4">
                    <input type="number" placeholder="السعر الجديد" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-900" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                    <input type="number" placeholder="السعر القديم" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-900" value={formData.oldPrice} onChange={e => setFormData({...formData, oldPrice: e.target.value})} required />
                </div>
                <input type="text" placeholder="نسبة الخصم (25%)" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-900" value={formData.discount} onChange={e => setFormData({...formData, discount: e.target.value})} required />
                
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

                <input type="text" placeholder="رابط الصورة" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-900" value={formData.img} onChange={e => setFormData({...formData, img: e.target.value})} />
            </AdminFormModal>
        </div>
    );
};
