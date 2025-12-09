
import React, { useState, useEffect } from 'react';
import { Order } from '../types';

interface TrackOrderPageProps {
    orders: Order[];
    initialOrderId?: number | null;
    onBack: () => void;
}

export const TrackOrderPage: React.FC<TrackOrderPageProps> = ({ orders, initialOrderId, onBack }) => {
    const [searchId, setSearchId] = useState(initialOrderId ? String(initialOrderId) : '');
    const [foundOrder, setFoundOrder] = useState<Order | null>(null);
    const [searched, setSearched] = useState(false);

    useEffect(() => {
        if (initialOrderId) {
            handleSearch(String(initialOrderId));
        }
    }, [initialOrderId]);

    const handleSearch = (id: string) => {
        if (!id) return;
        setSearched(true);
        const order = orders.find(o => String(o.id) === id.trim());
        setFoundOrder(order || null);
    };

    const clearSearch = () => {
        setFoundOrder(null);
        setSearched(false);
        setSearchId('');
    };

    const getStatusStep = (status: string) => {
        switch (status) {
            case 'pending': return 1;
            case 'cooking': return 2;
            case 'out_for_delivery': return 3; // New Stage
            case 'delivered': return 4;
            default: return 0;
        }
    };

    const currentStep = foundOrder ? getStatusStep(foundOrder.status) : 0;

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 animate-fade-in">
            <div className="max-w-3xl mx-auto px-4">
                <button onClick={onBack} className="mb-8 flex items-center gap-2 text-gray-500 hover:text-[#8B2525] font-bold transition">
                    <i className="fa-solid fa-arrow-right"></i> رجوع للرئيسية
                </button>

                {!foundOrder ? (
                    /* Search and History View */
                    <>
                        <div className="text-center mb-10">
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">تتبع طلبك 🛵</h1>
                            <p className="text-gray-500">دخل رقم طلبك عشان تعرف وصل فين</p>
                        </div>

                        {/* Search Box */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4">
                            <input 
                                type="text" 
                                placeholder="رقم الطلب (مثال: 9543)"
                                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#8B2525] text-lg text-center md:text-right"
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchId)}
                            />
                            <button 
                                onClick={() => handleSearch(searchId)}
                                className="bg-[#8B2525] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#6b1c1c] transition shadow-lg"
                            >
                                بحث
                            </button>
                        </div>

                        {searched && !foundOrder && (
                            <div className="text-center py-8 bg-red-50 rounded-2xl border border-red-100 mb-8 animate-fade-in">
                                <p className="text-red-600 font-bold">ملقناش طلب بالرقم ده، اتأكد من الرقم وحاول تاني.</p>
                            </div>
                        )}

                        {/* Past Orders List */}
                        <div className="mt-8 border-t border-gray-100 pt-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <i className="fa-solid fa-clock-rotate-left text-[#8B2525]"></i>
                                طلباتك السابقة
                            </h3>
                            
                            {orders.length === 0 ? (
                                <div className="text-center py-12 text-gray-400">
                                    <i className="fa-solid fa-clipboard-list text-4xl mb-3 opacity-20"></i>
                                    <p>لسه معملتش أي طلبات، اطلب دلوقتي واستمتع بأحلى أكل بيتي!</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {orders.map(order => (
                                        <div 
                                            key={order.id} 
                                            onClick={() => setFoundOrder(order)} 
                                            className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer group flex justify-between items-center"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-[#8B2525] font-bold text-lg group-hover:bg-[#8B2525] group-hover:text-white transition-colors">
                                                    #{order.id}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 mb-1 line-clamp-1">{order.items}</p>
                                                    <p className="text-xs text-gray-500">{order.date}</p>
                                                </div>
                                            </div>
                                            <div className="text-left">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold block mb-1 w-fit ml-auto ${
                                                    order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                    order.status === 'out_for_delivery' ? 'bg-blue-100 text-blue-700' :
                                                    order.status === 'cooking' ? 'bg-orange-100 text-orange-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                    {order.status === 'delivered' ? 'مكتمل' : 
                                                     order.status === 'out_for_delivery' ? 'مع الطيار' :
                                                     order.status === 'cooking' ? 'جاري التحضير' : 'قيد الانتظار'}
                                                </span>
                                                <span className="font-bold text-[#8B2525] text-sm">{order.total} ج.م</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    /* Found Order Timeline View */
                    <div className="animate-fade-in-up">
                        <button 
                            onClick={clearSearch} 
                            className="mb-6 text-sm font-bold text-gray-500 hover:text-gray-900 flex items-center gap-1"
                        >
                            <i className="fa-solid fa-arrow-right"></i> بحث عن طلب آخر
                        </button>

                        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                            {/* Status Header */}
                            <div className={`text-white p-6 text-center ${
                                foundOrder.status === 'delivered' ? 'bg-green-600' : 
                                foundOrder.status === 'out_for_delivery' ? 'bg-blue-600' :
                                'bg-[#8B2525]'
                            }`}>
                                <p className="text-white/80 text-sm mb-1">طلب رقم #{foundOrder.id}</p>
                                <h2 className="text-2xl font-bold">
                                    {foundOrder.status === 'delivered' ? 'تم التوصيل بنجاح 🎉' : 
                                     foundOrder.status === 'out_for_delivery' ? 'طلبك مع الطيار وفي الطريق ليك 🛵' :
                                     foundOrder.status === 'cooking' ? 'الشيف بيجهز طلبك 👩‍🍳' : 
                                     'طلبك وصل وقيد المراجعة 🕒'}
                                </h2>
                            </div>

                            {/* Timeline */}
                            <div className="p-8">
                                <div className="relative flex justify-between items-center mb-12 px-2">
                                    {/* Connecting Line */}
                                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-10 -translate-y-1/2"></div>
                                    <div 
                                        className="absolute top-1/2 right-0 h-1 bg-green-500 -z-10 -translate-y-1/2 transition-all duration-1000"
                                        style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                                    ></div>

                                    {/* Step 1: Pending */}
                                    <div className="flex flex-col items-center gap-2 relative">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold transition-all duration-500 ${currentStep >= 1 ? 'bg-green-500 scale-110 shadow-lg shadow-green-200' : 'bg-gray-300'}`}>
                                            <i className="fa-solid fa-check"></i>
                                        </div>
                                        <span className={`text-[10px] sm:text-xs font-bold absolute -bottom-6 w-20 text-center ${currentStep >= 1 ? 'text-green-600' : 'text-gray-400'}`}>تم الطلب</span>
                                    </div>

                                    {/* Step 2: Cooking */}
                                    <div className="flex flex-col items-center gap-2 relative">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold transition-all duration-500 ${currentStep >= 2 ? 'bg-green-500 scale-110 shadow-lg shadow-green-200' : currentStep === 1 ? 'bg-orange-500 animate-pulse' : 'bg-gray-300'}`}>
                                            <i className="fa-solid fa-fire-burner"></i>
                                        </div>
                                        <span className={`text-[10px] sm:text-xs font-bold absolute -bottom-6 w-24 text-center ${currentStep >= 2 ? 'text-green-600' : currentStep === 1 ? 'text-orange-500' : 'text-gray-400'}`}>جاري التحضير</span>
                                    </div>

                                    {/* Step 3: Out For Delivery (New) */}
                                    <div className="flex flex-col items-center gap-2 relative">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold transition-all duration-500 ${currentStep >= 3 ? 'bg-green-500 scale-110 shadow-lg shadow-green-200' : currentStep === 2 ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'}`}>
                                            <i className="fa-solid fa-motorcycle"></i>
                                        </div>
                                        <span className={`text-[10px] sm:text-xs font-bold absolute -bottom-6 w-24 text-center ${currentStep >= 3 ? 'text-green-600' : currentStep === 2 ? 'text-blue-500' : 'text-gray-400'}`}>مع الطيار</span>
                                    </div>

                                    {/* Step 4: Delivered */}
                                    <div className="flex flex-col items-center gap-2 relative">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold transition-all duration-500 ${currentStep >= 4 ? 'bg-green-500 scale-110 shadow-lg shadow-green-200' : 'bg-gray-300'}`}>
                                            <i className="fa-solid fa-house-chimney"></i>
                                        </div>
                                        <span className={`text-[10px] sm:text-xs font-bold absolute -bottom-6 w-20 text-center ${currentStep >= 4 ? 'text-green-600' : 'text-gray-400'}`}>تم التوصيل</span>
                                    </div>
                                </div>

                                {/* Order Details */}
                                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 mt-8">
                                    <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">تفاصيل الفاتورة</h3>
                                    <div className="space-y-2 mb-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">العميل:</span>
                                            <span className="font-bold">{foundOrder.customer}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">العنوان:</span>
                                            <span className="font-bold">{foundOrder.address}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">التاريخ:</span>
                                            <span className="font-bold">{foundOrder.date}</span>
                                        </div>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg border border-gray-100">
                                        <p className="text-sm text-gray-500 mb-2">الطلبات:</p>
                                        <p className="font-bold text-gray-900 text-sm leading-relaxed">{foundOrder.items}</p>
                                        <div className="mt-3 pt-3 border-t border-dashed border-gray-200 flex justify-between items-center">
                                            <span className="font-bold text-gray-900">الإجمالي</span>
                                            <span className="text-[#8B2525] font-black text-lg">{foundOrder.total} ج.م</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
