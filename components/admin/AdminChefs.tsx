
import React, { useState } from 'react';
import { Chef, Order } from '../../types';
import { AdminFormModal } from '../Modals';

interface AdminChefsProps {
    chefs: Chef[];
    orders: Order[]; // Added orders to props to calculate stats
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
            // Check itemsDetails to see if this order contains items from this chef
            if (order.itemsDetails && Array.isArray(order.itemsDetails)) {
                const chefItems = order.itemsDetails.filter(item => item.chef === chefName);
                if (chefItems.length > 0) {
                    orderCount++; // Increment order count if chef has items in this order
                    // Calculate revenue from this chef's items in this order
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
                        <div key={chef.id} className={`bg-white rounded-2xl p-6 border transition-all ${chef.isOpen ? 'border-green-200 shadow-green-100' : 'border-gray-200 opacity-75' } shadow-sm relative group`}>
                             <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <button onClick={() => openEdit(chef)} className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-200"><i className="fa-solid fa-pen"></i></button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); onDelete(chef.id); }} 
                                    className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200"
                                >
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                             </div>
                            <div className="flex items-center gap-4 mb-4">
                                <img src={chef.img} alt={chef.name} className="w-16 h-16 rounded-full object-cover" />
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">{chef.name}</h3>
                                    <p className="text-sm text-gray-500">{chef.specialty}</p>
                                </div>
                            </div>
                            
                            {/* Performance Stats */}
                            <div className="grid grid-cols-2 gap-3 mb-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <div className="text-center">
                                    <p className="text-xs text-gray-500 mb-1">عدد الطلبات</p>
                                    <p className="font-bold text-gray-900">{stats.orderCount}</p>
                                </div>
                                <div className="text-center border-r border-gray-200">
                                    <p className="text-xs text-gray-500 mb-1">إجمالي الأرباح</p>
                                    <p className="font-bold text-[#8B2525]">{stats.totalRevenue} ج.م</p>
                                </div>
                            </div>

                            <div className="text-sm text-gray-500 mb-4 space-y-1">
                                <div className="flex items-center gap-2"><i className="fa-regular fa-clock"></i> {chef.workingHours}</div>
                                <div className="flex items-center gap-2"><i className="fa-solid fa-truck-fast"></i> توصيل خلال {chef.deliveryTime}</div>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                 <div className="flex items-center gap-2">
                                    <span className={`w-3 h-3 rounded-full ${chef.isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                                    <span className="text-sm font-bold text-gray-600">{chef.isOpen ? 'المطبخ مفتوح' : 'المطبخ مغلق'}</span>
                                 </div>
                                 <button 
                                    onClick={() => toggleChefStatus(chef.id)}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold text-white transition-colors ${chef.isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                                 >
                                     {chef.isOpen ? 'إغلاق المطبخ' : 'فتح المطبخ'}
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
