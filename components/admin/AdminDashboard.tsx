
import React from 'react';
import { Order, Chef } from '../../types';
import { AdminStatsCard } from '../UIHelpers';

interface AdminDashboardProps {
    orders: Order[];
    chefs: Chef[];
    mealsCount: number;
    offersCount: number;
    visitorsCount: number;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ orders, chefs, mealsCount, offersCount, visitorsCount }) => {
    // Basic Calculations
    const totalRevenue = orders.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);
    const activeOrders = orders.filter(o => o.status === 'pending' || o.status === 'cooking' || o.status === 'out_for_delivery').length;
    const completedOrders = orders.filter(o => o.status === 'delivered').length;
    
    // New Calculations for requested stats
    const totalOrdersCount = orders.length;
    const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;
    const inactiveChefs = chefs.filter(c => !c.isOpen).length;
    
    // Percentages for Charts
    const pendingCount = orders.filter(o => o.status === 'pending').length;
    const cookingCount = orders.filter(o => o.status === 'cooking').length;
    const deliveryCount = orders.filter(o => o.status === 'out_for_delivery').length;
    
    const totalOrders = orders.length || 1; // Avoid division by zero
    const pendingPct = Math.round((pendingCount / totalOrders) * 100);
    const cookingPct = Math.round((cookingCount / totalOrders) * 100);
    const deliveryPct = Math.round((deliveryCount / totalOrders) * 100);
    const completedPct = Math.round((completedOrders / totalOrders) * 100);

    // Simulate Top Chef (Just taking the first one or finding max orders if logic existed)
    const topChef = chefs.length > 0 ? chefs[0] : { name: 'N/A', img: '', orders: '0', rating: 0 };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">نظرة عامة 📊</h2>
                    <p className="text-gray-500 text-sm mt-1">ملخص أداء المنصة اليوم</p>
                </div>
                <div className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-xl font-bold border border-gray-200">
                    {new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>
            
            {/* Main Stats Grid - Enhanced with requested metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Financials */}
                <AdminStatsCard 
                    title="إجمالي المبيعات" 
                    value={`${totalRevenue.toLocaleString()} ج.م`} 
                    icon="fa-solid fa-money-bill-wave" 
                    color="bg-gradient-to-br from-[#8B2525]/20 to-red-50 text-[#8B2525]" 
                />
                <AdminStatsCard 
                    title="متوسط الأوردر" 
                    value={`${avgOrderValue} ج.م`} 
                    icon="fa-solid fa-scale-balanced" 
                    color="bg-gradient-to-br from-indigo-100 to-indigo-50 text-indigo-600" 
                />
                
                {/* Orders */}
                <AdminStatsCard 
                    title="جميع الأوردرات" 
                    value={String(totalOrdersCount)} 
                    icon="fa-solid fa-receipt" 
                    color="bg-gradient-to-br from-purple-100 to-purple-50 text-purple-600" 
                />
                <AdminStatsCard 
                    title="الطلبات المكتملة" 
                    value={String(completedOrders)} 
                    icon="fa-solid fa-circle-check" 
                    color="bg-gradient-to-br from-green-100 to-green-50 text-green-600" 
                />

                {/* Operations */}
                <AdminStatsCard 
                    title="كم شيف معنا" 
                    value={String(chefs.length)} 
                    icon="fa-solid fa-user-chef" 
                    color="bg-gradient-to-br from-pink-100 to-pink-50 text-pink-600" 
                />
                <AdminStatsCard 
                    title="شيفات غير مفعلة" 
                    value={String(inactiveChefs)} 
                    icon="fa-solid fa-store-slash" 
                    color="bg-gradient-to-br from-gray-200 to-gray-100 text-gray-500" 
                />
                
                {/* Inventory */}
                <AdminStatsCard 
                    title="توتال الوجبات" 
                    value={String(mealsCount)} 
                    icon="fa-solid fa-utensils" 
                    color="bg-gradient-to-br from-orange-100 to-orange-50 text-orange-600" 
                />
                <AdminStatsCard 
                    title="توتال العروض" 
                    value={String(offersCount)} 
                    icon="fa-solid fa-tags" 
                    color="bg-gradient-to-br from-yellow-100 to-yellow-50 text-yellow-600" 
                />
                
                {/* Visits */}
                <AdminStatsCard 
                    title="زيارات الموقع" 
                    value={visitorsCount.toLocaleString()} 
                    icon="fa-solid fa-eye" 
                    color="bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600" 
                />
                 <AdminStatsCard 
                    title="الطلبات النشطة" 
                    value={String(activeOrders)} 
                    icon="fa-solid fa-fire-burner" 
                    color="bg-gradient-to-br from-red-100 to-orange-100 text-red-500" 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Overview Chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">تحليل المبيعات الأسبوعي</h3>
                            <p className="text-xs text-gray-400">مقارنة بالأسبوع الماضي</p>
                        </div>
                        <span className="text-green-500 bg-green-50 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                            <i className="fa-solid fa-arrow-trend-up"></i> +12%
                        </span>
                    </div>
                    {/* Simulated Bar Chart */}
                    <div className="flex items-end justify-between h-56 gap-4 px-2">
                        {[40, 65, 30, 85, 50, 70, 90].map((h, i) => (
                            <div key={i} className="flex flex-col items-center gap-3 w-full group cursor-pointer">
                                <div className="w-full bg-gray-100 rounded-t-xl relative h-full flex items-end overflow-hidden">
                                     <div 
                                        className="w-full bg-[#8B2525] opacity-80 group-hover:opacity-100 transition-all rounded-t-xl duration-500 relative" 
                                        style={{ height: `${h}%` }}
                                     >
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity mb-2">
                                            {h * 10} ج.م
                                        </div>
                                     </div>
                                </div>
                                <span className="text-xs text-gray-400 font-bold group-hover:text-[#8B2525] transition-colors">
                                    {['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'][i]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Orders Status Chart & Top Chef */}
                <div className="space-y-6">
                    {/* Order Status Distribution */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">توزيع حالات الطلبات</h3>
                        
                        <div className="flex h-4 w-full rounded-full overflow-hidden bg-gray-100 mb-4">
                            <div style={{ width: `${completedPct}%` }} className="bg-green-500 h-full" title="مكتمل"></div>
                            <div style={{ width: `${deliveryPct}%` }} className="bg-blue-500 h-full" title="توصيل"></div>
                            <div style={{ width: `${cookingPct}%` }} className="bg-orange-500 h-full" title="تحضير"></div>
                            <div style={{ width: `${pendingPct}%` }} className="bg-yellow-400 h-full" title="انتظار"></div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                                <span className="text-gray-600">مكتمل ({completedPct}%)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                                <span className="text-gray-600">توصيل ({deliveryPct}%)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                                <span className="text-gray-600">تحضير ({cookingPct}%)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                                <span className="text-gray-600">انتظار ({pendingPct}%)</span>
                            </div>
                        </div>
                    </div>

                    {/* Top Chef Mini Card */}
                    <div className="bg-gradient-to-br from-[#8B2525] to-[#5e1818] rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10"></div>
                        <div className="relative z-10 flex items-center gap-4">
                            <img src={topChef.img || ""} alt="Top Chef" className="w-16 h-16 rounded-full border-2 border-white/50 object-cover" />
                            <div>
                                <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1">شيف الشهر 🏆</p>
                                <h3 className="font-bold text-lg">{topChef.name}</h3>
                                <div className="flex items-center gap-1 text-yellow-400 text-sm mt-1">
                                    <i className="fa-solid fa-star"></i> {topChef.rating || 5.0}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Recent Orders Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">أحدث الطلبات</h3>
                    <button className="text-[#8B2525] text-sm font-bold hover:bg-red-50 px-3 py-1 rounded-lg transition-colors">عرض الكل</button>
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
                                            order.status === 'out_for_delivery' ? 'bg-blue-100 text-blue-700' :
                                            order.status === 'cooking' ? 'bg-orange-100 text-orange-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {order.status === 'delivered' ? 'تم التوصيل' : 
                                             order.status === 'out_for_delivery' ? 'مع الطيار' :
                                             order.status === 'cooking' ? 'جاري التحضير' : 'قيد الانتظار'}
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
