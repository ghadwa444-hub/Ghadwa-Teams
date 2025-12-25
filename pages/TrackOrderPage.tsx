
import React, { useState, useEffect } from 'react';
import { Order, MenuItem } from '../types';

interface TrackOrderPageProps {
    orders: Order[];
    initialOrderId?: number | null;
    onBack: () => void;
    onRateItem?: (item: MenuItem) => void;
}

export const TrackOrderPage: React.FC<TrackOrderPageProps> = ({ orders, initialOrderId, onBack, onRateItem }) => {
    const [searchId, setSearchId] = useState(initialOrderId ? String(initialOrderId) : '');
    const [searchPhone, setSearchPhone] = useState('');
    const [searchType, setSearchType] = useState<'id' | 'phone'>('id'); // 'id' or 'phone'
    const [foundOrder, setFoundOrder] = useState<Order | null>(null);
    const [foundOrders, setFoundOrders] = useState<Order[]>([]); // For phone search - multiple orders
    const [searched, setSearched] = useState(false);

    useEffect(() => {
        if (initialOrderId) {
            setSearchType('id');
            handleSearchById(String(initialOrderId));
        }
    }, [initialOrderId]);

    const handleSearchById = (id: string) => {
        if (!id) return;
        setSearched(true);
        setFoundOrders([]);
        const order = orders.find(o => String(o.id) === id.trim() || o.order_number === id.trim());
        setFoundOrder(order || null);
    };

    const handleSearchByPhone = (phone: string) => {
        if (!phone) return;
        setSearched(true);
        setFoundOrder(null);
        // Normalize phone number (remove spaces, dashes, etc.)
        const normalizedPhone = phone.trim().replace(/[\s\-\(\)]/g, '');
        
        // Search in both delivery_phone and customer_phone
        const matchingOrders = orders.filter(o => {
            const deliveryPhone = o.delivery_phone?.replace(/[\s\-\(\)]/g, '') || '';
            const customerPhone = o.customer_phone?.replace(/[\s\-\(\)]/g, '') || '';
            const legacyPhone = o.phone?.replace(/[\s\-\(\)]/g, '') || '';
            
            return deliveryPhone.includes(normalizedPhone) || 
                   customerPhone.includes(normalizedPhone) ||
                   legacyPhone.includes(normalizedPhone);
        });
        
        setFoundOrders(matchingOrders);
        
        // If only one order found, show it directly
        if (matchingOrders.length === 1) {
            setFoundOrder(matchingOrders[0]);
            setFoundOrders([]);
        }
    };

    const handleSearch = () => {
        if (searchType === 'id') {
            handleSearchById(searchId);
        } else {
            handleSearchByPhone(searchPhone);
        }
    };

    const clearSearch = () => {
        setFoundOrder(null);
        setFoundOrders([]);
        setSearched(false);
        setSearchId('');
        setSearchPhone('');
    };

    const getStatusStep = (status: string) => {
        switch (status) {
            case 'pending': return 1;
            case 'preparing': return 2;
            case 'out_for_delivery': return 3;
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
                            <p className="text-gray-500">ابحث برقم الطلب أو رقم الهاتف</p>
                        </div>

                        {/* Search Type Toggle */}
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-4 flex gap-2">
                            <button
                                onClick={() => {
                                    setSearchType('id');
                                    setSearchPhone('');
                                    setFoundOrder(null);
                                    setFoundOrders([]);
                                    setSearched(false);
                                }}
                                className={`flex-1 py-2 px-4 rounded-xl font-bold transition ${
                                    searchType === 'id'
                                        ? 'bg-[#8B2525] text-white'
                                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <i className="fa-solid fa-hashtag ml-2"></i>
                                رقم الطلب
                            </button>
                            <button
                                onClick={() => {
                                    setSearchType('phone');
                                    setSearchId('');
                                    setFoundOrder(null);
                                    setFoundOrders([]);
                                    setSearched(false);
                                }}
                                className={`flex-1 py-2 px-4 rounded-xl font-bold transition ${
                                    searchType === 'phone'
                                        ? 'bg-[#8B2525] text-white'
                                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <i className="fa-solid fa-phone ml-2"></i>
                                رقم الهاتف
                            </button>
                        </div>

                        {/* Search Box */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4">
                            {searchType === 'id' ? (
                                <input 
                                    type="text" 
                                    placeholder="رقم الطلب (مثال: 9543 أو GHD-123)"
                                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#8B2525] text-lg text-center md:text-right"
                                    value={searchId}
                                    onChange={(e) => setSearchId(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            ) : (
                                <input 
                                    type="tel" 
                                    placeholder="رقم الهاتف (مثال: 201234567890)"
                                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#8B2525] text-lg text-center md:text-right"
                                    value={searchPhone}
                                    onChange={(e) => setSearchPhone(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            )}
                            <button 
                                onClick={handleSearch}
                                className="bg-[#8B2525] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#6b1c1c] transition shadow-lg"
                            >
                                <i className="fa-solid fa-magnifying-glass ml-2"></i>
                                بحث
                            </button>
                        </div>

                        {searched && !foundOrder && foundOrders.length === 0 && (
                            <div className="text-center py-8 bg-red-50 rounded-2xl border border-red-100 mb-8 animate-fade-in">
                                <p className="text-red-600 font-bold">
                                    {searchType === 'id' 
                                        ? 'ملقناش طلب بالرقم ده، اتأكد من الرقم وحاول تاني.'
                                        : 'ملقناش طلبات برقم الهاتف ده، اتأكد من الرقم وحاول تاني.'}
                                </p>
                            </div>
                        )}

                        {/* Multiple Orders Found (Phone Search) */}
                        {foundOrders.length > 1 && (
                            <div className="mb-8 animate-fade-in">
                                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-4">
                                    <p className="text-blue-700 font-bold text-center">
                                        <i className="fa-solid fa-info-circle ml-2"></i>
                                        تم العثور على {foundOrders.length} طلب برقم الهاتف هذا
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    {foundOrders.map(order => (
                                        <div 
                                            key={order.id} 
                                            className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer group"
                                            onClick={() => {
                                                setFoundOrder(order);
                                                setFoundOrders([]);
                                            }}
                                        >
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-[#8B2525] font-bold text-sm group-hover:bg-[#8B2525] group-hover:text-white transition-colors">
                                                        {order.order_number ? `#${order.order_number.split('-').pop()}` : `#${order.id.slice(0, 8)}`}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 mb-1">{order.total_amount || order.total || 0} ج.م</p>
                                                        <p className="text-xs text-gray-500">{order.created_at ? new Date(order.created_at).toLocaleDateString('ar-EG') : '-'}</p>
                                                    </div>
                                                </div>
                                                <div className="text-left">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold block mb-1 w-fit ml-auto ${
                                                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                        order.status === 'out_for_delivery' ? 'bg-blue-100 text-blue-700' :
                                                        order.status === 'preparing' ? 'bg-orange-100 text-orange-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                        {order.status === 'delivered' ? 'مكتمل' : 
                                                         order.status === 'out_for_delivery' ? 'مع الطيار' :
                                                         order.status === 'preparing' ? 'جاري التحضير' : 'قيد الانتظار'}
                                                    </span>
                                                    <button className="text-[#8B2525] text-sm font-bold hover:underline">
                                                        عرض التفاصيل →
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
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
                                        <div key={order.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer group">
                                            <div className="flex justify-between items-center mb-3" onClick={() => setFoundOrder(order)}>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-[#8B2525] font-bold text-sm group-hover:bg-[#8B2525] group-hover:text-white transition-colors">
                                                        {order.order_number ? `#${order.order_number.split('-').pop()}` : `#${order.id.slice(0, 8)}`}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 mb-1 line-clamp-1">{order.total_amount || order.total || 0} ج.م</p>
                                                        <p className="text-xs text-gray-500">{order.created_at ? new Date(order.created_at).toLocaleDateString('ar-EG') : '-'}</p>
                                                    </div>
                                                </div>
                                                <div className="text-left">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold block mb-1 w-fit ml-auto ${
                                                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                        order.status === 'out_for_delivery' ? 'bg-blue-100 text-blue-700' :
                                                        order.status === 'preparing' ? 'bg-orange-100 text-orange-700' :
                                                        order.status === 'confirmed' ? 'bg-purple-100 text-purple-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                        {order.status === 'delivered' ? 'مكتمل' : 
                                                         order.status === 'out_for_delivery' ? 'مع الطيار' :
                                                         order.status === 'preparing' ? 'جاري التحضير' :
                                                         order.status === 'confirmed' ? 'مؤكد' :
                                                         'قيد الانتظار'}
                                                    </span>
                                                    <span className="font-bold text-[#8B2525] text-sm">{order.total_amount || order.total || 0} ج.م</span>
                                                </div>
                                            </div>
                                            
                                            {/* Order Details & Review Buttons */}
                                            {order.status === 'delivered' && order.itemsDetails && order.itemsDetails.length > 0 && onRateItem && (
                                                <div className="border-t border-gray-50 pt-3 mt-3">
                                                    <p className="text-xs font-bold text-gray-500 mb-2">قيم وجباتك:</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {order.itemsDetails.map((item, idx) => (
                                                            <button 
                                                                key={`${order.id}-${idx}`}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    onRateItem(item);
                                                                }}
                                                                className="text-xs bg-yellow-50 text-yellow-700 border border-yellow-200 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-yellow-100 transition"
                                                            >
                                                                <i className="fa-regular fa-star"></i> قيم {item.name}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
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
                                <p className="text-white/80 text-sm mb-1">
                                    {foundOrder.order_number ? `طلب رقم ${foundOrder.order_number}` : `طلب رقم #${foundOrder.id.slice(0, 8)}`}
                                </p>
                                <h2 className="text-2xl font-bold">
                                    {foundOrder.status === 'delivered' ? 'تم التوصيل بنجاح 🎉' : 
                                     foundOrder.status === 'out_for_delivery' ? 'طلبك مع الطيار وفي الطريق ليك 🛵' :
                                     foundOrder.status === 'preparing' ? 'الشيف بيجهز طلبك 👩‍🍳' : 
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

                                    {/* Step 3: Out For Delivery */}
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
                                            <span className="font-bold">{foundOrder.customer_name}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">العنوان:</span>
                                            <span className="font-bold">{foundOrder.delivery_address}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">رقم التليفون:</span>
                                            <span className="font-bold" dir="ltr">{foundOrder.delivery_phone}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">التاريخ:</span>
                                            <span className="font-bold">{new Date(foundOrder.created_at).toLocaleDateString('ar-EG')}</span>
                                        </div>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg border border-gray-100">
                                        <p className="text-sm text-gray-500 mb-2">الطلبات:</p>
                                        <div className="space-y-3">
                                            {foundOrder.itemsDetails && foundOrder.itemsDetails.map((item, idx) => (
                                                <div key={idx} className="flex justify-between items-center text-sm border-b border-gray-50 last:border-0 pb-2 last:pb-0">
                                                    <div>
                                                        <span className="font-bold text-gray-900">{item.name}</span>
                                                        <span className="text-gray-500 text-xs mr-2">x{item.quantity}</span>
                                                    </div>
                                                    {/* Rating button in details view as well */}
                                                    {foundOrder.status === 'delivered' && onRateItem && (
                                                        <button 
                                                            onClick={() => onRateItem(item)}
                                                            className="text-[10px] bg-yellow-50 text-yellow-700 px-2 py-1 rounded hover:bg-yellow-100 transition"
                                                        >
                                                            قيم الآن
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                            {!foundOrder.itemsDetails && <p className="font-bold text-gray-900 text-sm leading-relaxed">{foundOrder.items}</p>}
                                        </div>
                                        
                                        <div className="mt-3 pt-3 border-t border-dashed border-gray-200 flex justify-between items-center">
                                            <span className="font-bold text-gray-900">الإجمالي</span>
                                            <span className="text-[#8B2525] font-black text-lg">{foundOrder.total_amount || foundOrder.total} ج.م</span>
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
