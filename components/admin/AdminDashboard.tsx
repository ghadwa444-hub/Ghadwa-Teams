
import React from 'react';
import { Order, Chef } from '../../types';
import { AdminStatsCard } from '../UIHelpers';

interface AdminDashboardProps {
    orders: Order[];
    chefs: Chef[];
    mealsCount: number;
    visitorsCount: number;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ orders, chefs, mealsCount, visitorsCount }) => {
    const totalRevenue = orders.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);
    const activeOrders = orders.filter(o => o.status === 'pending' || o.status === 'cooking').length;
    const activeChefs = chefs.filter(c => c.isOpen).length;
    
    // Calculate additional stats
    const averageOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;
    
    // Calculate unique customers (simulated by unique names)
    const uniqueCustomers = new Set(orders.map(o => o.customer)).size;

    // Simulate Top Chef
    const topChef = chefs[0] || { name: 'N/A', img: '', orders: '0', rating: 0 };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-900">نظرة عامة 📊</h2>
                <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">
                    {new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-4 overflow-x-auto pb-2">
                <button className="flex items-center gap-2 bg-[#8B2525] text-white px-5 py-2.5 rounded-xl font-bold shadow-lg hover:bg-[#6b1c1c] transition text-sm">
                    <i className="fa-solid fa-plus"></i> إضافة وجبة
                </button>
                <button className="flex items-center gap-2 bg-white text-gray-700 px-5 py-2.5 rounded-xl font-bold border border-gray-200 hover:bg-gray-50 transition text-sm">
                    <i className="fa-solid fa-tags"></i> عرض جديد
                </button>
                <button className="flex items-center gap-2 bg-white text-gray-700 px-5 py-2.5 rounded-xl font-bold border border-gray-200 hover:bg-gray-50 transition text-sm">
                    <i className="fa-solid fa-bullhorn"></i> إعلان
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <AdminStatsCard title="إجمالي المبيعات" value={`${totalRevenue} ج.م`} icon="fa-solid fa-money-bill-wave" color="bg-gradient-to-br from-green-100 to-green-50 text-green-600" />
                <AdminStatsCard title="الطلبات النشطة" value={String(activeOrders)} icon="fa-solid fa-bell" color="bg-gradient-to-br from-orange-100 to-orange-50 text-orange-600" />
                <AdminStatsCard title="متوسط قيمة الطلب" value={`${averageOrderValue} ج.م`} icon="fa-solid fa-scale-balanced" color="bg-gradient-to-br from-purple-100 to-purple-50 text-purple-600" />
                <AdminStatsCard title="عدد العملاء" value={String(uniqueCustomers)} icon="fa-solid fa-users" color="bg-gradient-to-br from-teal-100 to-teal-50 text-teal-600" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <AdminStatsCard title="الشيفات المتاحين" value={String(activeChefs)} icon="fa-solid fa-user-check" color="bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600" />
                 <AdminStatsCard title="إجمالي الطلبات" value={String(orders.length)} icon="fa-solid fa-receipt" color="bg-gradient-to-br from-pink-100 to-pink-50 text-pink-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Overview */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900">أداء المبيعات</h3>
                        <select className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-1 outline-none">
                            <option>آخر 7 أيام</option>
                            <option>آخر شهر</option>
                        </select>
                    </div>
                    {/* Simulated Bar Chart */}
                    <div className="flex items-end justify-between h-48 gap-2 mt-4 px-2">
                        {[40, 65, 30, 85, 50, 70, 90].map((h, i) => (
                            <div key={i} className="flex flex-col items-center gap-2 w-full group">
                                <div className="w-full bg-[#8B2525] opacity-10 group-hover:opacity-20 transition-all rounded-t-lg relative" style={{ height: `${h}%` }}>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        {h * 10}
                                    </div>
                                    <div className="absolute bottom-0 w-full bg-[#8B2525] h-full opacity-80 rounded-t-lg"></div>
                                </div>
                                <span className="text-xs text-gray-400 font-bold">{['س', 'ح', 'ن', 'ث', 'ر', 'خ', 'ج'][i]}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Chef */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-[#8B2525] to-[#6b1c1c]"></div>
                    <div className="relative z-10 flex flex-col items-center mt-8">
                        <div className="w-20 h-20 rounded-full border-4 border-white shadow-md overflow-hidden bg-white mb-3">
                            <img src={topChef.img || "https://source.unsplash.com/random/person"} alt="Top Chef" className="w-full h-full object-cover" />
                        </div>
                        <h3 className="font-bold text-lg text-gray-900">{topChef.name}</h3>
                        <p className="text-sm text-gray-500 mb-4">أفضل شيف هذا الشهر 🏆</p>
                        
                        <div className="w-full space-y-3">
                            <div className="flex justify-between text-sm bg-gray-50 p-3 rounded-xl">
                                <span className="text-gray-600">عدد الطلبات</span>
                                <span className="font-bold text-gray-900">{topChef.orders || 0}</span>
                            </div>
                            <div className="flex justify-between text-sm bg-gray-50 p-3 rounded-xl">
                                <span className="text-gray-600">التقييم العام</span>
                                <span className="font-bold text-yellow-600 flex items-center gap-1">
                                    {topChef.rating || 5.0} <i className="fa-solid fa-star"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">أحدث الطلبات</h3>
                    <button className="text-[#8B2525] text-sm font-bold hover:underline">عرض الكل</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead>
                            <tr className="bg-gray-50 text-gray-700 text-sm">
                                <th className="p-4 rounded-r-xl">رقم الطلب</th>
                                <th className="p-4">العميل</th>
                                <th className="p-4">الطلبات</th>
                                <th className="p-4">الإجمالي</th>
                                <th className="p-4 rounded-l-xl">الحالة</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-gray-800">
                            {orders.slice(0, 5).map(order => (
                                <tr key={order.id} className="text-sm hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-bold text-gray-900">#{order.id}</td>
                                    <td className="p-4 font-bold text-gray-700">{order.customer}</td>
                                    <td className="p-4 text-gray-600 max-w-xs truncate">{order.items}</td>
                                    <td className="p-4 font-bold text-[#8B2525]">{order.total} ج.م</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                            order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                            order.status === 'cooking' ? 'bg-orange-100 text-orange-700' :
                                            'bg-gray-100 text-gray-600'
                                        }`}>
                                            {order.status === 'delivered' ? 'تم التوصيل' : order.status === 'cooking' ? 'جاري التحضير' : 'قيد الانتظار'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
