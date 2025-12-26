
import React, { useState, useEffect } from 'react';
import { Order } from '../../types';
import { supabase } from '../../services/supabase';

interface AdminOrderDetailsProps {
    order: Order | null;
    onBack: () => void;
    updateOrderStatus: (id: string, status: string) => void;
}

export const AdminOrderDetails: React.FC<AdminOrderDetailsProps> = ({ order, onBack, updateOrderStatus }) => {
    const [orderWithItems, setOrderWithItems] = useState<Order | null>(order);

    // Fetch order_items when order changes
    useEffect(() => {
        const fetchOrderItems = async () => {
            if (!order) {
                setOrderWithItems(null);
                return;
            }

            // Check if order already has items
            const existingItems = (order as any).order_items || order.items || order.itemsDetails || [];
            
            if (Array.isArray(existingItems) && existingItems.length > 0) {
                console.log('✅ Order already has items:', existingItems);
                setOrderWithItems({
                    ...order,
                    items: existingItems,
                    itemsDetails: existingItems,
                    order_items: existingItems
                } as any);
                return;
            }

            // Fetch items from database with product join to get images
            console.log(`📦 Fetching items for order ${order.id} (type: ${typeof order.id})...`);
            console.log('📋 Full order object:', JSON.stringify(order, null, 2));
            
            try {
                // First, try to fetch with product join to get images
                const orderIdString = String(order.id);
                console.log(`🔍 Querying order_items with order_id: ${orderIdString}`);
                
                const { data: itemsData, error } = await supabase
                    .from('order_items')
                    .select(`
                        *,
                        products (
                            id,
                            image_url,
                            name
                        )
                    `)
                    .eq('order_id', orderIdString);

                if (error) {
                    console.error('❌ Error fetching order items with join:', error);
                    // Fallback: fetch without join
                    const { data: itemsDataFallback, error: fallbackError } = await supabase
                        .from('order_items')
                        .select('*')
                        .eq('order_id', String(order.id));

                    if (fallbackError) {
                        console.error('❌ Error fetching order items (fallback):', fallbackError);
                        setOrderWithItems(order);
                        return;
                    }

                    console.log('✅ Fetched order items (fallback):', itemsDataFallback);
                    
                    // Enrich fallback items too
                    const enrichedFallback = (itemsDataFallback || []).map((item: any) => ({
                        ...item,
                        product_name: item.product_name || item.name || 'منتج',
                        image_url: item.image_url || item.img || null,
                        unit_price: item.unit_price || item.product_price || item.price || 0,
                        total_price: item.total_price || item.subtotal || (item.unit_price || item.product_price || 0) * (item.quantity || 1),
                        quantity: item.quantity || 1
                    }));
                    
                    console.log('📊 Fallback items count:', enrichedFallback.length);
                    
                    setOrderWithItems({
                        ...order,
                        items: enrichedFallback,
                        itemsDetails: enrichedFallback,
                        order_items: enrichedFallback
                    } as any);
                    return;
                }

                // Enrich items with product images if available
                const enrichedItems = (itemsData || []).map((item: any) => {
                    const product = item.products;
                    const enriched = {
                        ...item,
                        // Use product_name from order_item, fallback to product name
                        product_name: item.product_name || product?.name || item.name || 'منتج',
                        // Use image_url from order_item, fallback to product image
                        image_url: item.image_url || product?.image_url || item.img || null,
                        // Ensure price fields are available
                        unit_price: item.unit_price || item.product_price || item.price || 0,
                        total_price: item.total_price || item.subtotal || (item.unit_price || item.product_price || 0) * (item.quantity || 1),
                        quantity: item.quantity || 1
                    };
                    console.log('📦 Enriched item:', enriched);
                    return enriched;
                });

                console.log('✅ Fetched order items with products:', enrichedItems);
                console.log('📊 Total items:', enrichedItems.length);
                
                if (enrichedItems.length === 0) {
                    console.warn('⚠️ No order items found for order:', order.id);
                }
                
                setOrderWithItems({
                    ...order,
                    items: enrichedItems,
                    itemsDetails: enrichedItems,
                    order_items: enrichedItems
                } as any);
            } catch (error) {
                console.error('❌ Exception fetching order items:', error);
                setOrderWithItems(order);
            }
        };

        fetchOrderItems();
    }, [order]);

    if (!orderWithItems) return null;
    
    // Get items from orderWithItems
    const orderItems = (orderWithItems as any).order_items || orderWithItems.items || orderWithItems.itemsDetails || [];

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
                                <h2 className="text-2xl font-bold text-gray-900 mb-1">طلب #{orderWithItems.order_number || orderWithItems.id}</h2>
                                <p className="text-gray-500 text-sm"><i className="fa-regular fa-calendar ml-1"></i> {orderWithItems.date || new Date(orderWithItems.created_at || '').toLocaleDateString('ar-EG')}</p>
                            </div>
                            <div className="text-left">
                                <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold ${
                                    orderWithItems.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                    orderWithItems.status === 'out_for_delivery' ? 'bg-blue-100 text-blue-700' :
                                    orderWithItems.status === 'preparing' ? 'bg-orange-100 text-orange-700' :
                                    orderWithItems.status === 'confirmed' ? 'bg-purple-100 text-purple-700' :
                                    'bg-yellow-100 text-yellow-700'
                                }`}>
                                    {orderWithItems.status === 'delivered' ? 'تم التوصيل' : 
                                     orderWithItems.status === 'out_for_delivery' ? 'مع الطيار' :
                                     orderWithItems.status === 'preparing' ? 'جاري التحضير' :
                                     orderWithItems.status === 'confirmed' ? 'مؤكد' :
                                     'قيد الانتظار'}
                                </span>
                            </div>
                        </div>

                        <h3 className="font-bold text-lg text-gray-900 mb-4">تفاصيل المنتجات</h3>
                        <div className="space-y-4">
                            {Array.isArray(orderItems) && orderItems.length > 0 ? (
                                orderItems.map((item: any, idx: number) => {
                                    console.log(`🔍 Rendering item ${idx}:`, {
                                        item,
                                        product_name: item.product_name,
                                        name: item.name,
                                        image_url: item.image_url,
                                        unit_price: item.unit_price,
                                        product_price: item.product_price,
                                        price: item.price,
                                        quantity: item.quantity
                                    });
                                    
                                    const itemName = item.product_name || item.name || 'منتج غير معروف';
                                    const itemPrice = item.unit_price || item.product_price || item.price || 0;
                                    const itemQuantity = item.quantity || 1;
                                    const itemTotal = item.total_price || item.subtotal || (itemPrice * itemQuantity);
                                    
                                    // Get image from multiple sources
                                    const itemImage = item.image_url || 
                                                     (item.products && item.products.image_url) || 
                                                     item.img || 
                                                     '/placeholder.jpg';
                                    
                                    console.log(`📸 Item ${idx} final values:`, {
                                        name: itemName,
                                        price: itemPrice,
                                        quantity: itemQuantity,
                                        total: itemTotal,
                                        image: itemImage
                                    });

                                    return (
                                        <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition">
                                            {/* Product Image */}
                                            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                                                <img 
                                                    src={itemImage} 
                                                    alt={itemName}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = '/placeholder.jpg';
                                                    }}
                                                />
                                            </div>
                                            
                                            {/* Product Details */}
                                            <div className="flex-1">
                                                <h4 className="font-bold text-gray-900 mb-1">{itemName}</h4>
                                                <p className="text-sm text-gray-500">{item.chef || item.notes || ''}</p>
                                            </div>
                                            
                                            {/* Price & Quantity */}
                                            <div className="text-center">
                                                <p className="text-sm text-gray-500 mb-1">السعر</p>
                                                <p className="font-bold text-gray-900">{itemPrice} ج.م</p>
                                            </div>
                                            
                                            <div className="text-center">
                                                <p className="text-sm text-gray-500 mb-1">الكمية</p>
                                                <p className="font-bold text-gray-900">x{itemQuantity}</p>
                                            </div>
                                            
                                            {/* Total */}
                                            <div className="text-center min-w-[100px]">
                                                <p className="text-sm text-gray-500 mb-1">الإجمالي</p>
                                                <p className="font-bold text-[#8B2525] text-lg">{itemTotal} ج.م</p>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : orderWithItems.items && typeof orderWithItems.items === 'string' ? (
                                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-center">
                                    <p className="text-gray-700">{orderWithItems.items}</p>
                                    <p className="text-sm text-gray-500 mt-2">(تفاصيل غير متاحة للطلبات القديمة)</p>
                                </div>
                            ) : (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-center">
                                    <p className="text-red-700 font-bold">لا توجد تفاصيل متاحة لهذا الطلب</p>
                                </div>
                            )}
                        </div>
                        
                        <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col items-end gap-2">
                            <div className="flex justify-between w-full md:w-64 text-sm text-gray-600">
                                <span>المجموع الفرعي:</span>
                                <span>{(orderWithItems.total_amount || orderWithItems.total || 0) - 25} ج.م</span>
                            </div>
                            <div className="flex justify-between w-full md:w-64 text-sm text-gray-600">
                                <span>التوصيل:</span>
                                <span>25 ج.م</span>
                            </div>
                            <div className="flex justify-between w-full md:w-64 font-bold text-lg text-gray-900 border-t border-gray-200 pt-2 mt-1">
                                <span>الإجمالي الكلي:</span>
                                <span className="text-[#8B2525]">{orderWithItems.total_amount || orderWithItems.total || 0} ج.م</span>
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
                                    <p className="font-bold text-gray-900">{orderWithItems.customer_name || orderWithItems.customer || 'غير محدد'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-500 shrink-0">
                                    <i className="fa-solid fa-phone"></i>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold mb-1">رقم الهاتف</p>
                                    <p className="font-bold text-gray-900">{orderWithItems.customer_phone || orderWithItems.phone || 'غير متوفر'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-500 shrink-0">
                                    <i className="fa-solid fa-location-dot"></i>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold mb-1">العنوان</p>
                                    <p className="text-sm text-gray-700 leading-relaxed">{orderWithItems.delivery_address || orderWithItems.address || 'غير متوفر'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-bold text-lg text-gray-900 mb-4 border-b border-gray-100 pb-2">تحديث الحالة</h3>
                        <div className="space-y-2">
                            <button onClick={() => updateOrderStatus(orderWithItems.id, 'pending')} className={`w-full py-2 px-4 rounded-lg font-bold text-sm transition text-right flex justify-between ${orderWithItems.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' : 'hover:bg-gray-50 text-gray-600'}`}>
                                قيد الانتظار
                                {orderWithItems.status === 'pending' && <i className="fa-solid fa-check"></i>}
                            </button>
                            <button onClick={() => updateOrderStatus(orderWithItems.id, 'preparing')} className={`w-full py-2 px-4 rounded-lg font-bold text-sm transition text-right flex justify-between ${orderWithItems.status === 'preparing' ? 'bg-orange-50 text-orange-700 border border-orange-200' : 'hover:bg-gray-50 text-gray-600'}`}>
                                جاري التحضير
                                {orderWithItems.status === 'preparing' && <i className="fa-solid fa-check"></i>}
                            </button>
                            <button onClick={() => updateOrderStatus(orderWithItems.id, 'out_for_delivery')} className={`w-full py-2 px-4 rounded-lg font-bold text-sm transition text-right flex justify-between ${orderWithItems.status === 'out_for_delivery' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'hover:bg-gray-50 text-gray-600'}`}>
                                تم الاستلام من الدليفري
                                {orderWithItems.status === 'out_for_delivery' && <i className="fa-solid fa-check"></i>}
                            </button>
                            <button onClick={() => updateOrderStatus(orderWithItems.id, 'delivered')} className={`w-full py-2 px-4 rounded-lg font-bold text-sm transition text-right flex justify-between ${orderWithItems.status === 'delivered' ? 'bg-green-50 text-green-700 border border-green-200' : 'hover:bg-gray-50 text-gray-600'}`}>
                                تم التوصيل
                                {orderWithItems.status === 'delivered' && <i className="fa-solid fa-check"></i>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
