
import React, { useState } from 'react';
import { Chef, Order } from '../../types';
import { AdminFormModal } from '../Modals';

interface AdminChefsProps {
    chefs: Chef[];
    orders: Order[];
    toggleChefStatus: (id: number) => void;
    onAdd: (chef: Chef) => void;
    onEdit: (chef: Chef) => void;
    onDelete: (id: number) => void;
}

export const AdminChefs: React.FC<AdminChefsProps> = ({ chefs, orders, toggleChefStatus, onAdd, onEdit, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentChef, setCurrentChef] = useState<Chef | null>(null);
    const [formData, setFormData] = useState<any>({ name: '', specialty: '', bio: '', img: '', cover: '', workingHours: '', deliveryTime: '' });

    const openAdd = () => {
        setCurrentChef(null);
        setFormData({ name: '', specialty: '', bio: '', img: 'https://source.unsplash.com/random/person', cover: 'https://source.unsplash.com/random/cooking', workingHours: '10 ص - 10 م', deliveryTime: '60 دقيقة' });
        setIsModalOpen(true);
    };

    const openEdit = (chef: Chef) => {
        setCurrentChef(chef);
        setFormData(chef);
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentChef) {
            onEdit({ ...currentChef, ...formData });
        } else {
            onAdd({ ...formData, id: Date.now(), rating: 5.0, reviews: 0, orders: '0', isOpen: true, badges: [] });
        }
        setIsModalOpen(false);
    };

    const getChefStats = (chefName: string) => {
        let orderCount = 0;
        let totalRevenue = 0;

        orders.forEach(order => {
            if (order.itemsDetails && Array.isArray(order.itemsDetails)) {
                const chefItems = order.itemsDetails.filter(item => item.chef === chefName);
                if (chefItems.length > 0) {
                    orderCount++;
                    const revenue = chefItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                    totalRevenue += revenue;
                }
            }
        });

        return { orderCount, totalRevenue };
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-900">إدارة الشيفات 👩‍🍳</h2>
                <button onClick={openAdd} className="bg-[#8B2525] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-[#6b1c1c] transition flex items-center gap-2">
                    <i className="fa-solid fa-plus"></i> إضافة شيف
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {chefs.map(chef => {
                    const stats = getChefStats(chef.name);
                    
                    return (
                        <div key={chef.id} className={`bg-white rounded-[2rem] border transition-all duration-300 ${chef.isOpen ? 'border-green-200 shadow-lg shadow-green-100/50' : 'border-gray-200 opacity-90' } overflow-hidden relative group hover:shadow-xl`}>
                             {/* Cover Image Area */}
                             <div className="h-32 w-full relative bg-gray-100">
                                <img src={chef.cover} alt={`${chef.name} cover`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                                
                                {/* Status Pill */}
                                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold backdrop-blur-md shadow-sm border flex items-center gap-1.5 ${
                                    chef.isOpen 
                                    ? 'bg-green-500/90 text-white border-green-400' 
                                    : 'bg-red-500/90 text-white border-red-400'
                                }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${chef.isOpen ? 'bg-white animate-pulse' : 'bg-white/50'}`}></span>
                                    {chef.isOpen ? 'مفتوح' : 'مغلق'}
                                </div>

                                {/* Delivery Time Badge */}
                                <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-bold text-gray-800 flex items-center gap-1 shadow-sm">
                                    <i className="fa-solid fa-motorcycle text-[#8B2525]"></i>
                                    {chef.deliveryTime}
                                </div>

                                {/* Action Buttons - Always Visible on Mobile, Hover on Desktop */}
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <button 
                                        type="button"
                                        onClick={() => openEdit(chef)} 
                                        className="w-8 h-8 rounded-full bg-white/90 backdrop-blur text-blue-600 flex items-center justify-center hover:bg-blue-500 hover:text-white shadow-sm transition-all"
                                        title="تعديل"
                                    >
                                        <i className="fa-solid fa-pen text-xs"></i>
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={(e) => { 
                                            e.stopPropagation(); 
                                            onDelete(chef.id); 
                                        }} 
                                        className="w-8 h-8 rounded-full bg-white/90 backdrop-blur text-red-600 flex items-center justify-center hover:bg-red-500 hover:text-white shadow-sm transition-all"
                                        title="حذف"
                                    >
                                        <i className="fa-solid fa-trash text-xs"></i>
                                    </button>
                                </div>
                             </div>
                            
                            <div className="p-6 pt-0 relative">
                                {/* Profile Image */}
                                <div className="flex justify-center -mt-10 mb-3">
                                     <div className="w-20 h-20 rounded-full p-1 bg-white shadow-lg">
                                        <img src={chef.img} alt={chef.name} className="w-full h-full object-cover rounded-full" />
                                     </div>
                                </div>
                                
                                <div className="text-center mb-4">
                                    <h3 className="font-bold text-xl text-gray-900">{chef.name}</h3>
                                    <p className="text-sm text-[#8B2525] font-medium bg-red-50 px-3 py-0.5 rounded-full inline-block mt-1">{chef.specialty}</p>
                                </div>
                                
                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100 text-center">
                                        <p className="text-[10px] text-gray-500 font-bold mb-1">الطلبات</p>
                                        <p className="font-black text-gray-900 text-lg">{stats.orderCount}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100 text-center">
                                        <p className="text-[10px] text-gray-500 font-bold mb-1">الأرباح</p>
                                        <p className="font-black text-[#8B2525] text-lg">{stats.totalRevenue}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100 mb-4">
                                    <div className="flex items-center gap-1"><i className="fa-regular fa-clock text-gray-400"></i> {chef.workingHours}</div>
                                </div>

                                <button 
                                    onClick={() => toggleChefStatus(chef.id)}
                                    className={`w-full py-2.5 rounded-xl font-bold text-sm text-white transition-all shadow-md ${chef.isOpen ? 'bg-red-500 hover:bg-red-600 shadow-red-200' : 'bg-green-500 hover:bg-green-600 shadow-green-200'}`}
                                >
                                     {chef.isOpen ? 'إغلاق المطبخ 🔒' : 'فتح المطبخ 🔓'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <AdminFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentChef ? "تعديل بيانات شيف" : "إضافة شيف جديد"} onSubmit={handleSubmit}>
                <input type="text" placeholder="اسم الشيف" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-900" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                <input type="text" placeholder="التخصص (مثلاً: محاشي)" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-900" value={formData.specialty} onChange={e => setFormData({...formData, specialty: e.target.value})} required />
                <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="مواعيد العمل" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-900" value={formData.workingHours} onChange={e => setFormData({...formData, workingHours: e.target.value})} required />
                    <input type="text" placeholder="وقت التوصيل" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-900" value={formData.deliveryTime} onChange={e => setFormData({...formData, deliveryTime: e.target.value})} required />
                </div>
                <textarea placeholder="نبذة عن الشيف" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-900 h-24" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})}></textarea>
                <input type="text" placeholder="رابط الصورة الشخصية" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-900" value={formData.img} onChange={e => setFormData({...formData, img: e.target.value})} />
                <input type="text" placeholder="رابط صورة الغلاف" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-900" value={formData.cover} onChange={e => setFormData({...formData, cover: e.target.value})} />
            </AdminFormModal>
        </div>
    );
};
