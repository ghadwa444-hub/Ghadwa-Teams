
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
    // Basic Calculations - Use total_amount from database
    const totalRevenue = orders.reduce((acc, curr) => acc + (Number(curr.total_amount) || Number(curr.total) || 0), 0);
    const activeOrders = orders.filter(o => o.status === 'pending' || o.status === 'preparing' || o.status === 'out_for_delivery').length;
    const completedOrders = orders.filter(o => o.status === 'delivered').length;
    
    // New Calculations for requested stats
    const totalOrdersCount = orders.length;
    const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;
    const inactiveChefs = chefs.filter(c => !c.isOpen).length;
    
    // Percentages for Charts
    const pendingCount = orders.filter(o => o.status === 'pending').length;
    const preparingCount = orders.filter(o => o.status === 'preparing').length;
    const deliveryCount = orders.filter(o => o.status === 'out_for_delivery').length;
    
    const totalOrders = orders.length || 1; // Avoid division by zero
    const pendingPct = Math.round((pendingCount / totalOrders) * 100);
    const preparingPct = Math.round((preparingCount / totalOrders) * 100);
    const deliveryPct = Math.round((deliveryCount / totalOrders) * 100);
    const completedPct = Math.round((completedOrders / totalOrders) * 100);

    // Calculate weekly sales (current week: Saturday to Friday)
    const getWeeklySales = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset to start of day
        
        // Find the start of the current week (Saturday)
        // JavaScript getDay(): 0=Sunday, 1=Monday, ..., 6=Saturday
        const currentDay = today.getDay(); // 0-6
        // Calculate days to subtract to get to Saturday (start of week)
        // If today is Sunday (0), subtract 1 to get Saturday
        // If today is Monday (1), subtract 2 to get Saturday
        // If today is Saturday (6), subtract 0 (already Saturday)
        const daysToSaturday = currentDay === 0 ? 1 : (currentDay === 6 ? 0 : currentDay + 1);
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - daysToSaturday);
        weekStart.setHours(0, 0, 0, 0);
        
        // Week end is 6 days after week start (Friday)
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);
        
        const weekDays = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
        const salesByDay: number[] = [0, 0, 0, 0, 0, 0, 0];
        
        // Get orders from current week (Saturday to Friday)
        const currentWeekOrders = orders.filter(order => {
            if (!order.created_at) return false;
            try {
                const orderDate = new Date(order.created_at);
                if (isNaN(orderDate.getTime())) return false; // Invalid date
                return orderDate >= weekStart && orderDate <= weekEnd;
            } catch (e) {
                return false;
            }
        });
        
        console.log('📊 Weekly Sales Debug:', {
            totalOrders: orders.length,
            ordersWithDate: orders.filter(o => o.created_at).length,
            currentWeekOrdersCount: currentWeekOrders.length,
            weekStart: weekStart.toISOString(),
            weekEnd: weekEnd.toISOString(),
            today: today.toISOString(),
            sampleOrders: currentWeekOrders.slice(0, 5).map(o => ({
                id: o.id,
                created_at: o.created_at,
                total_amount: o.total_amount,
                date: new Date(o.created_at).toLocaleDateString('ar-EG'),
                dayOfWeek: new Date(o.created_at).getDay()
            }))
        });
        
        // Group by day of week
        // JavaScript getDay(): 0=Sunday, 1=Monday, ..., 6=Saturday
        // We want: 0=Saturday, 1=Sunday, ..., 6=Friday
        currentWeekOrders.forEach(order => {
            if (!order.created_at) return;
            try {
                const orderDate = new Date(order.created_at);
                if (isNaN(orderDate.getTime())) return; // Invalid date
                const jsDay = orderDate.getDay(); // 0=Sunday, 6=Saturday
                // Convert: Sunday(0) -> 1, Monday(1) -> 2, ..., Saturday(6) -> 0
                const dayOfWeek = (jsDay + 1) % 7;
                const revenue = Number(order.total_amount) || Number(order.total) || 0;
                if (revenue > 0) {
                    salesByDay[dayOfWeek] += revenue;
                    console.log(`📊 Order ${order.id}: jsDay=${jsDay}, dayOfWeek=${dayOfWeek}, revenue=${revenue}, dayName=${weekDays[dayOfWeek]}`);
                }
            } catch (e) {
                console.error('Error processing order:', e, order);
            }
        });
        
        console.log('📊 Sales by Day Array:', salesByDay);
        console.log('📊 Sales by Day with Names:', salesByDay.map((val, idx) => `${weekDays[idx]}: ${val} ج.م`));
        console.log('📊 Max Revenue:', Math.max(...salesByDay, 1));
        
        // Calculate max for percentage calculation
        const maxRevenue = Math.max(...salesByDay, 1); // Avoid division by zero
        
        return { salesByDay, maxRevenue, weekDays };
    };
    
    const { salesByDay, maxRevenue, weekDays } = getWeeklySales();
    
    // Calculate percentage change (compare this week to last week)
    const thisWeekTotal = salesByDay.reduce((sum, val) => sum + val, 0);
    const lastWeekOrders = orders.filter(order => {
        if (!order.created_at) return false;
        const orderDate = new Date(order.created_at);
        const daysDiff = Math.floor((new Date().getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
        return daysDiff >= 7 && daysDiff < 14;
    });
    const lastWeekTotal = lastWeekOrders.reduce((sum, order) => sum + (Number(order.total_amount) || Number(order.total) || 0), 0);
    const percentageChange = lastWeekTotal > 0 ? Math.round(((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100) : 0;

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
                        <span className={`${percentageChange >= 0 ? 'text-green-500 bg-green-50' : 'text-red-500 bg-red-50'} px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1`}>
                            <i className={`fa-solid fa-arrow-trend-${percentageChange >= 0 ? 'up' : 'down'}`}></i> {percentageChange >= 0 ? '+' : ''}{percentageChange}%
                        </span>
                    </div>
                    {/* Real Bar Chart from Orders */}
                    <div className="flex items-end justify-between h-56 gap-4 px-2">
                        {salesByDay.map((revenue, i) => {
                            // Calculate height percentage (minimum 5% if there's revenue, otherwise 0)
                            const height = revenue > 0 
                                ? Math.max((revenue / maxRevenue) * 100, 5) 
                                : 0;
                            
                            console.log(`📊 Chart Bar ${i} (${weekDays[i]}): revenue=${revenue}, height=${height}%, maxRevenue=${maxRevenue}`);
                            
                            return (
                                <div key={i} className="flex flex-col items-center gap-3 w-full group cursor-pointer">
                                    <div className="w-full bg-gray-100 rounded-t-xl relative h-full flex items-end overflow-hidden min-h-[40px]">
                                         {revenue > 0 ? (
                                             <div 
                                                className="w-full bg-[#8B2525] opacity-80 group-hover:opacity-100 transition-all rounded-t-xl duration-500 relative" 
                                                style={{ height: `${height}%`, minHeight: '20px' }}
                                             >
                                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity mb-2 whitespace-nowrap z-10">
                                                    {revenue.toLocaleString()} ج.م
                                                </div>
                                             </div>
                                         ) : (
                                             <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-gray-400 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                 0 ج.م
                                             </div>
                                         )}
                                    </div>
                                    <span className="text-xs text-gray-400 font-bold group-hover:text-[#8B2525] transition-colors">
                                        {weekDays[i]}
                                    </span>
                                </div>
                            );
                        })}
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
                            <div style={{ width: `${preparingPct}%` }} className="bg-orange-500 h-full" title="تحضير"></div>
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
                                <span className="text-gray-600">تحضير ({preparingPct}%)</span>
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
                            <img src={topChef.img || topChef.image_url || '/placeholder.jpg'} alt="Top Chef" className="w-16 h-16 rounded-full border-2 border-white/50 object-cover" />
                            <div>
                                <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1">شيف الشهر 🏆</p>
                                <h3 className="font-bold text-lg">{topChef.chef_name || topChef.name}</h3>
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
                            {orders.slice(0, 5).map(order => {
                                // Format order number
                                const orderNumber = order.order_number 
                                    ? `#${order.order_number.split('-').pop() || order.order_number}` 
                                    : `#${String(order.id).slice(0, 8)}`;
                                
                                // Get customer name
                                const customerName = order.customer_name || order.customer || 'غير محدد';
                                
                                // Get order items as string
                                let itemsText = '';
                                if (order.itemsDetails && order.itemsDetails.length > 0) {
                                    itemsText = order.itemsDetails.map((item: any) => 
                                        `${item.name || item.product_name || 'منتج'} x${item.quantity || 1}`
                                    ).join(', ');
                                } else if (order.items) {
                                    itemsText = typeof order.items === 'string' ? order.items : JSON.stringify(order.items);
                                } else if (order.items && Array.isArray(order.items)) {
                                    itemsText = order.items.map((item: any) => 
                                        `${item.name || item.product_name || 'منتج'} x${item.quantity || 1}`
                                    ).join(', ');
                                } else {
                                    itemsText = 'لا توجد تفاصيل';
                                }
                                
                                // Get total
                                const total = order.total_amount || order.total || 0;
                                
                                return (
                                    <tr key={order.id} className="text-sm hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-bold text-gray-900">{orderNumber}</td>
                                        <td className="p-4 font-bold text-gray-700">{customerName}</td>
                                        <td className="p-4 text-gray-600 max-w-xs truncate" title={itemsText}>{itemsText}</td>
                                        <td className="p-4 font-bold text-[#8B2525]">{total} ج.م</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                order.status === 'out_for_delivery' ? 'bg-blue-100 text-blue-700' :
                                                order.status === 'preparing' ? 'bg-orange-100 text-orange-700' :
                                                order.status === 'confirmed' ? 'bg-purple-100 text-purple-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {order.status === 'delivered' ? 'تم التوصيل' : 
                                                 order.status === 'out_for_delivery' ? 'مع الطيار' :
                                                 order.status === 'preparing' ? 'جاري التحضير' :
                                                 order.status === 'confirmed' ? 'مؤكد' :
                                                 'قيد الانتظار'}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
