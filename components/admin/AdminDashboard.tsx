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

    return (
        <div className="space-y-8 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-gray-900">نظرة عامة 📊</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <AdminStatsCard title="إجمالي المبيعات" value={`${totalRevenue} ج.م`} icon="fa-solid fa-money-bill-wave" color="bg-green-100 text-green-600" />
                <AdminStatsCard title="الطلبات النشطة" value={String(activeOrders)} icon="fa-solid fa-bell" color="bg-orange-100 text-orange-600" />
                <AdminStatsCard title="الشيفات المتاحين" value={String(activeChefs)} icon="fa-solid fa-user-check" color="bg-blue-100 text-blue-600" />
                <AdminStatsCard title="عدد الوجبات" value={String(mealsCount)} icon="fa-solid fa-utensils" color="bg-purple-100 text-purple-600" />
                <AdminStatsCard title="عدد الزوار" value={String(visitorsCount)} icon="fa-solid fa-eye" color="bg-indigo-100 text-indigo-600" />
                <AdminStatsCard title="إجمالي الطلبات" value={String(orders.length)} icon="fa-solid fa-receipt" color="bg-pink-100 text-pink-600" />
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">أحدث الطلبات</h3>
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
                                <tr key={order.id} className="text-sm">
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