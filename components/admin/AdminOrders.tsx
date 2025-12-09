
import React, { useState } from 'react';
import { Order } from '../../types';

interface AdminOrdersProps {
    orders: Order[];
    updateOrderStatus: (id: number, status: string) => void;
    onDeleteOrder: (id: number) => void;
    onViewOrder: (order: Order) => void;
}

interface OrderCardProps {
    order: Order;
    updateOrderStatus: (id: number, status: string) => void;
    onDeleteOrder: (id: number) => void;
    onViewOrder: (order: Order) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, updateOrderStatus, onDeleteOrder, onViewOrder }) => (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition mb-3 group animate-fade-in">
        <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded text-xs">#{order.id}</span>
                <span className="text-[10px] text-gray-400">{order.date}</span>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onViewOrder(order)} className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 text-xs" title="التفاصيل">
                    <i className="fa-solid fa-eye"></i>
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); onDeleteOrder(order.id); }} 
                    className="w-6 h-6 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 text-xs" 
                    title="حذف"
                >
                    <i className="fa-solid fa-trash"></i>
                </button>
            </div>
        </div>
        
        <h4 className="font-bold text-gray-800 mb-1 text-sm">{order.customer}</h4>
        <p className="text-xs text-gray-500 mb-3 line-clamp-2 leading-relaxed">{order.items}</p>
        
        <div className="flex justify-between items-center pt-3 border-t border-dashed border-gray-100 mt-2">
            <span className="font-black text-[#8B2525]">{order.total} ج.م</span>
            
            {order.status === 'pending' && (
                <button 
                    onClick={() => updateOrderStatus(order.id, 'cooking')} 
                    className="bg-orange-100 text-orange-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-orange-200 transition flex items-center gap-1"
                >
                    بدء التحضير <i className="fa-solid fa-fire-burner"></i>
                </button>
            )}
            {order.status === 'cooking' && (
                <button 
                    onClick={() => updateOrderStatus(order.id, 'out_for_delivery')} 
                    className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-200 transition flex items-center gap-1"
                >
                    تسليم للطيار <i className="fa-solid fa-motorcycle"></i>
                </button>
            )}
            {order.status === 'out_for_delivery' && (
                <button 
                    onClick={() => updateOrderStatus(order.id, 'delivered')} 
                    className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-200 transition flex items-center gap-1"
                >
                    تم التوصيل <i className="fa-solid fa-check"></i>
                </button>
            )}
            {order.status === 'delivered' && (
                <span className="text-green-600 text-xs font-bold flex items-center gap-1">
                    <i className="fa-solid fa-circle-check"></i> مكتمل
                </span>
            )}
        </div>
    </div>
);

export const AdminOrders: React.FC<AdminOrdersProps> = ({ orders, updateOrderStatus, onDeleteOrder, onViewOrder }) => {
    const [viewMode, setViewMode] = useState('board');

    return (
        <div className="space-y-6 animate-fade-in-up h-[calc(100vh-140px)] flex flex-col">
            <div className="flex justify-between items-center shrink-0">
                <h2 className="text-3xl font-bold text-gray-900">متابعة الطلبات 🕵️‍♂️</h2>
                <div className="flex bg-gray-200 p-1 rounded-xl">
                    <button 
                        onClick={() => setViewMode('table')} 
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 ${viewMode === 'table' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <i className="fa-solid fa-list"></i> قائمة
                    </button>
                    <button 
                        onClick={() => setViewMode('board')} 
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 ${viewMode === 'board' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <i className="fa-solid fa-border-all"></i> لوحة
                    </button>
                </div>
            </div>

            {viewMode === 'table' ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden overflow-y-auto custom-scrollbar flex-1">
                    <table className="w-full text-right relative">
                        <thead className="bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
                            <tr>
                                <th className="p-5 text-gray-700 font-bold">#</th>
                                <th className="p-5 text-gray-700 font-bold">العميل</th>
                                <th className="p-5 text-gray-700 font-bold">التفاصيل</th>
                                <th className="p-5 text-gray-700 font-bold">الإجمالي</th>
                                <th className="p-5 text-gray-700 font-bold">الحالة</th>
                                <th className="p-5 text-gray-700 font-bold">إجراء</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-gray-800">
                            {orders.map(order => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-5 font-bold">#{order.id}</td>
                                    <td className="p-5">
                                        <div className="font-bold text-gray-900">{order.customer}</div>
                                        <div className="text-xs text-gray-500">{order.date}</div>
                                    </td>
                                    <td className="p-5 text-gray-600 max-w-xs truncate">{order.items}</td>
                                    <td className="p-5 font-bold text-[#8B2525]">{order.total} ج.م</td>
                                    <td className="p-5">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
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
                                    <td className="p-5 flex gap-2">
                                        <button onClick={() => onViewOrder(order)} className="bg-blue-50 text-blue-600 p-2 rounded-lg hover:bg-blue-100 transition" title="عرض التفاصيل">
                                            <i className="fa-solid fa-eye"></i>
                                        </button>
                                        <select 
                                            value={order.status}
                                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                            className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-sm focus:border-[#8B2525] focus:ring-0 outline-none text-gray-900 cursor-pointer"
                                        >
                                            <option value="pending">قيد الانتظار</option>
                                            <option value="cooking">جاري التحضير</option>
                                            <option value="out_for_delivery">تم الاستلام من الدليفري</option>
                                            <option value="delivered">تم التوصيل</option>
                                        </select>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); onDeleteOrder(order.id); }} 
                                            className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 transition" 
                                            title="حذف"
                                        >
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1 min-h-0">
                    {/* Pending Column */}
                    <div className="flex flex-col bg-gray-50 rounded-2xl border border-gray-200 h-full overflow-hidden">
                        <div className="p-4 border-b border-gray-200 bg-yellow-50 flex justify-between items-center">
                            <h3 className="font-bold text-yellow-800 flex items-center gap-2 text-sm">
                                <i className="fa-regular fa-clock"></i> الانتظار
                            </h3>
                            <span className="bg-white px-2 py-1 rounded-lg text-xs font-bold text-yellow-800 shadow-sm border border-yellow-100">
                                {orders.filter(o => o.status === 'pending').length}
                            </span>
                        </div>
                        <div className="p-4 overflow-y-auto flex-1 custom-scrollbar space-y-3">
                            {orders.filter(o => o.status === 'pending').map(order => (
                                <OrderCard 
                                    key={order.id} 
                                    order={order} 
                                    updateOrderStatus={updateOrderStatus} 
                                    onDeleteOrder={onDeleteOrder} 
                                    onViewOrder={onViewOrder} 
                                />
                            ))}
                        </div>
                    </div>

                    {/* Cooking Column */}
                    <div className="flex flex-col bg-gray-50 rounded-2xl border border-gray-200 h-full overflow-hidden">
                        <div className="p-4 border-b border-gray-200 bg-orange-50 flex justify-between items-center">
                            <h3 className="font-bold text-orange-800 flex items-center gap-2 text-sm">
                                <i className="fa-solid fa-fire-burner"></i> التحضير
                            </h3>
                            <span className="bg-white px-2 py-1 rounded-lg text-xs font-bold text-orange-800 shadow-sm border border-orange-100">
                                {orders.filter(o => o.status === 'cooking').length}
                            </span>
                        </div>
                        <div className="p-4 overflow-y-auto flex-1 custom-scrollbar space-y-3">
                            {orders.filter(o => o.status === 'cooking').map(order => (
                                <OrderCard 
                                    key={order.id} 
                                    order={order} 
                                    updateOrderStatus={updateOrderStatus} 
                                    onDeleteOrder={onDeleteOrder} 
                                    onViewOrder={onViewOrder} 
                                />
                            ))}
                        </div>
                    </div>

                    {/* Out for Delivery Column */}
                    <div className="flex flex-col bg-gray-50 rounded-2xl border border-gray-200 h-full overflow-hidden">
                        <div className="p-4 border-b border-gray-200 bg-blue-50 flex justify-between items-center">
                            <h3 className="font-bold text-blue-800 flex items-center gap-2 text-sm">
                                <i className="fa-solid fa-motorcycle"></i> الطريق
                            </h3>
                            <span className="bg-white px-2 py-1 rounded-lg text-xs font-bold text-blue-800 shadow-sm border border-blue-100">
                                {orders.filter(o => o.status === 'out_for_delivery').length}
                            </span>
                        </div>
                        <div className="p-4 overflow-y-auto flex-1 custom-scrollbar space-y-3">
                            {orders.filter(o => o.status === 'out_for_delivery').map(order => (
                                <OrderCard 
                                    key={order.id} 
                                    order={order} 
                                    updateOrderStatus={updateOrderStatus} 
                                    onDeleteOrder={onDeleteOrder} 
                                    onViewOrder={onViewOrder} 
                                />
                            ))}
                        </div>
                    </div>

                    {/* Delivered Column */}
                    <div className="flex flex-col bg-gray-50 rounded-2xl border border-gray-200 h-full overflow-hidden">
                        <div className="p-4 border-b border-gray-200 bg-green-50 flex justify-between items-center">
                            <h3 className="font-bold text-green-800 flex items-center gap-2 text-sm">
                                <i className="fa-solid fa-check-double"></i> تم
                            </h3>
                            <span className="bg-white px-2 py-1 rounded-lg text-xs font-bold text-green-800 shadow-sm border border-green-100">
                                {orders.filter(o => o.status === 'delivered').length}
                            </span>
                        </div>
                        <div className="p-4 overflow-y-auto flex-1 custom-scrollbar space-y-3">
                            {orders.filter(o => o.status === 'delivered').map(order => (
                                <OrderCard 
                                    key={order.id} 
                                    order={order} 
                                    updateOrderStatus={updateOrderStatus} 
                                    onDeleteOrder={onDeleteOrder} 
                                    onViewOrder={onViewOrder} 
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
