
import React from 'react';
import { Order } from '../../types';

interface AdminOrderDetailsProps {
    order: Order | null;
    onBack: () => void;
    updateOrderStatus: (id: string, status: string) => void;
}

export const AdminOrderDetails: React.FC<AdminOrderDetailsProps> = ({ order, onBack, updateOrderStatus }) => {
    if (!order) return null;

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
                <button onClick={onBack} className="text-gray-500 hover:text-[#8B2525] font-bold flex items-center gap-2 transition">
                    <i className="fa-solid fa-arrow-right"></i> رجوع للقائمة
                </button>
                <div className="flex gap-3">
                    <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-bold hover:bg-gray-200 transition flex items-center gap-2">
                        <i className="fa-solid fa-print"></i> طباعة الفاتورة
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order Info Column */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-1">طلب #{order.id}</h2>
                                <p className="text-gray-500 text-sm"><i className="fa-regular fa-calendar ml-1"></i> {order.date}</p>
                            </div>
                            <div className="text-left">
                                <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold ${
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
                            </div>
                        </div>

                        <h3 className="font-bold text-lg text-gray-900 mb-4">تفاصيل المنتجات</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-right">
                                <thead className="bg-gray-50 text-gray-600 text-sm">
                                    <tr>
                                        <th className="p-3 rounded-r-lg">المنتج</th>
                                        <th className="p-3">الشيف</th>
                                        <th className="p-3">السعر</th>
                                        <th className="p-3">الكمية</th>
                                        <th className="p-3 rounded-l-lg">الإجمالي</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-800 divide-y divide-gray-50">
                                    {order.itemsDetails && order.itemsDetails.length > 0 ? (
                                        order.itemsDetails.map((item, idx) => (
                                            <tr key={idx}>
                                                <td className="p-3 font-bold">{item.name}</td>
                                                <td className="p-3 text-sm text-gray-500">{item.chef || '-'}</td>
                                                <td className="p-3 text-sm">{item.price} ج.م</td>
                                                <td className="p-3 text-sm font-bold">{item.quantity}</td>
                                                <td className="p-3 font-bold text-[#8B2525]">{item.price * item.quantity} ج.م</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="p-4 text-center text-gray-500">
                                                {order.items} (تفاصيل غير متاحة للطلبات القديمة)
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        
                        <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col items-end gap-2">
                            <div className="flex justify-between w-full md:w-64 text-sm text-gray-600">
                                <span>المجموع الفرعي:</span>
                                <span>{order.total - 25} ج.م</span>
                            </div>
                            <div className="flex justify-between w-full md:w-64 text-sm text-gray-600">
                                <span>التوصيل:</span>
                                <span>25 ج.م</span>
                            </div>
                            <div className="flex justify-between w-full md:w-64 font-bold text-lg text-gray-900 border-t border-gray-200 pt-2 mt-1">
                                <span>الإجمالي الكلي:</span>
                                <span className="text-[#8B2525]">{order.total} ج.م</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Customer Info Column */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-bold text-lg text-gray-900 mb-4 border-b border-gray-100 pb-2">بيانات العميل</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-500 shrink-0">
                                    <i className="fa-solid fa-user"></i>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold mb-1">الاسم</p>
                                    <p className="font-bold text-gray-900">{order.customer}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-500 shrink-0">
                                    <i className="fa-solid fa-phone"></i>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold mb-1">رقم الهاتف</p>
                                    <p className="font-bold text-gray-900">{order.phone || 'غير متوفر'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-500 shrink-0">
                                    <i className="fa-solid fa-location-dot"></i>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold mb-1">العنوان</p>
                                    <p className="text-sm text-gray-700 leading-relaxed">{order.address || 'غير متوفر'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-bold text-lg text-gray-900 mb-4 border-b border-gray-100 pb-2">تحديث الحالة</h3>
                        <div className="space-y-2">
                            <button onClick={() => updateOrderStatus(order.id, 'pending')} className={`w-full py-2 px-4 rounded-lg font-bold text-sm transition text-right flex justify-between ${order.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' : 'hover:bg-gray-50 text-gray-600'}`}>
                                قيد الانتظار
                                {order.status === 'pending' && <i className="fa-solid fa-check"></i>}
                            </button>
                            <button onClick={() => updateOrderStatus(order.id, 'preparing')} className={`w-full py-2 px-4 rounded-lg font-bold text-sm transition text-right flex justify-between ${order.status === 'preparing' ? 'bg-orange-50 text-orange-700 border border-orange-200' : 'hover:bg-gray-50 text-gray-600'}`}>
                                جاري التحضير
                                {order.status === 'preparing' && <i className="fa-solid fa-check"></i>}
                            </button>
                            <button onClick={() => updateOrderStatus(order.id, 'out_for_delivery')} className={`w-full py-2 px-4 rounded-lg font-bold text-sm transition text-right flex justify-between ${order.status === 'out_for_delivery' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'hover:bg-gray-50 text-gray-600'}`}>
                                تم الاستلام من الدليفري
                                {order.status === 'out_for_delivery' && <i className="fa-solid fa-check"></i>}
                            </button>
                            <button onClick={() => updateOrderStatus(order.id, 'delivered')} className={`w-full py-2 px-4 rounded-lg font-bold text-sm transition text-right flex justify-between ${order.status === 'delivered' ? 'bg-green-50 text-green-700 border border-green-200' : 'hover:bg-gray-50 text-gray-600'}`}>
                                تم التوصيل
                                {order.status === 'delivered' && <i className="fa-solid fa-check"></i>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
