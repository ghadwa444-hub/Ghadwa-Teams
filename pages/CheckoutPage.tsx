
import React, { useState } from 'react';
import { CartItem, CheckoutForm, PromoCode } from '../types';

interface CheckoutPageProps {
    cart: CartItem[];
    onBack: () => void;
    onPlaceOrder: (data: CheckoutForm) => void;
    promoCodes: PromoCode[];
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ cart, onBack, onPlaceOrder, promoCodes }) => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Promo Code State
    const [promoInput, setPromoInput] = useState('');
    const [discount, setDiscount] = useState(0);
    const [promoError, setPromoError] = useState('');
    const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);

    // Total only includes food + promo, delivery is separate
    const total = subtotal - discount;

    const [formData, setFormData] = useState<CheckoutForm>({
        name: '',
        phone: '',
        address: '',
        notes: ''
    });
    
    const [paymentMethod, setPaymentMethod] = useState('cash');

    const handleApplyPromo = () => {
        setPromoError('');
        const code = promoCodes.find(p => p.code === promoInput.toUpperCase());
        
        if (!code) {
            setPromoError('الكود ده مش موجود أو منتهي الصلاحية');
            setDiscount(0);
            setAppliedPromo(null);
            return;
        }

        // Check minimum order amount
        if (code.min_order_amount && subtotal < code.min_order_amount) {
            setPromoError(`الحد الأدنى للطلب ${code.min_order_amount} ج.م`);
            setDiscount(0);
            setAppliedPromo(null);
            return;
        }

        // Calculate discount based on discount_type and discount_value
        let calculatedDiscount = 0;
        if (code.discount_type === 'percentage') {
            calculatedDiscount = (subtotal * code.discount_value) / 100;
        } else if (code.discount_type === 'fixed') {
            calculatedDiscount = code.discount_value;
        }

        // Cap discount at subtotal
        if (calculatedDiscount > subtotal) {
            calculatedDiscount = subtotal;
        }

        setDiscount(calculatedDiscount);
        setAppliedPromo(code);
    };

    const handleRemovePromo = () => {
        setPromoInput('');
        setDiscount(0);
        setAppliedPromo(null);
        setPromoError('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onPlaceOrder({
            ...formData,
            promoCode: appliedPromo?.code,
            discountApplied: discount
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 animate-fade-in">
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                 <button onClick={onBack} className="mb-6 flex items-center gap-2 text-gray-500 hover:text-[#8B2525] font-bold transition">
                     <i className="fa-solid fa-arrow-right"></i> رجوع للسلة
                 </button>
                 
                 <div className="flex flex-col lg:flex-row gap-8">
                     {/* Right Side: Form */}
                     <div className="lg:w-2/3">
                         <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                             <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                 <i className="fa-solid fa-location-dot text-[#8B2525]"></i>
                                 بيانات التوصيل
                             </h2>
                             <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     <div>
                                         <label className="block text-sm font-bold text-gray-700 mb-1">الاسم بالكامل</label>
                                         <input 
                                            type="text" 
                                            required
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#8B2525] transition"
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            placeholder="أحمد محمد"
                                         />
                                     </div>
                                     <div>
                                         <label className="block text-sm font-bold text-gray-700 mb-1">رقم الهاتف</label>
                                         <input 
                                            type="tel" 
                                            required
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#8B2525] transition"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                            placeholder="01xxxxxxxxx"
                                         />
                                     </div>
                                 </div>
                                 <div>
                                     <label className="block text-sm font-bold text-gray-700 mb-1">العنوان بالتفصيل</label>
                                     <input 
                                        type="text" 
                                        required
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#8B2525] transition"
                                        value={formData.address}
                                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                                        placeholder="اسم الشارع، رقم العمارة، رقم الشقة"
                                     />
                                 </div>
                                 <div>
                                     <label className="block text-sm font-bold text-gray-700 mb-1">ملاحظات إضافية (اختياري)</label>
                                     <textarea 
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#8B2525] transition h-24 resize-none"
                                        value={formData.notes}
                                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                        placeholder="مثلاً: بوابة رقم 3، رن الجرس مرتين..."
                                     ></textarea>
                                 </div>
                             </form>
                         </div>

                         <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                             <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                 <i className="fa-solid fa-wallet text-[#8B2525]"></i>
                                 طريقة الدفع
                             </h2>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <button 
                                    type="button"
                                    onClick={() => setPaymentMethod('cash')}
                                    className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${paymentMethod === 'cash' ? 'border-[#8B2525] bg-red-50 text-[#8B2525]' : 'border-gray-100 hover:border-gray-200'}`}
                                 >
                                     <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center">
                                         {paymentMethod === 'cash' && <div className="w-3 h-3 rounded-full bg-current"></div>}
                                     </div>
                                     <span className="font-bold">الدفع عند الاستلام</span>
                                     <i className="fa-solid fa-money-bill-wave mr-auto"></i>
                                 </button>
                                 <button 
                                    type="button"
                                    disabled
                                    className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed"
                                 >
                                     <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
                                     <span className="font-bold text-gray-500">بطاقة ائتمان (قريباً)</span>
                                     <i className="fa-regular fa-credit-card mr-auto text-gray-400"></i>
                                 </button>
                             </div>
                         </div>
                     </div>

                     {/* Left Side: Summary */}
                     <div className="lg:w-1/3">
                         <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                             <h2 className="text-xl font-bold text-gray-900 mb-6">ملخص الطلب</h2>
                             <div className="space-y-4 mb-6 max-h-60 overflow-y-auto custom-scrollbar">
                                 {cart.map(item => (
                                     <div key={item.id} className="flex gap-3">
                                         <img src={item.img} alt={item.name} className="w-14 h-14 rounded-lg object-cover bg-gray-100" />
                                         <div className="flex-1">
                                             <div className="flex justify-between mb-1">
                                                 <span className="text-sm font-bold text-gray-900 line-clamp-1">{item.name}</span>
                                                 <span className="text-sm font-bold text-gray-900">{item.price * item.quantity}</span>
                                             </div>
                                             <div className="text-xs text-gray-500 flex justify-between">
                                                 <span>الكمية: {item.quantity}</span>
                                                 <span>{item.price} ج.م / قطعة</span>
                                             </div>
                                         </div>
                                     </div>
                                 ))}
                             </div>

                             {/* Promo Code Input */}
                             <div className="mb-6 pt-4 border-t border-gray-100">
                                 <label className="block text-sm font-bold text-gray-700 mb-2">كوبون الخصم</label>
                                 <div className="flex gap-2">
                                     <input 
                                        type="text"
                                        className={`flex-1 bg-gray-50 border rounded-xl px-3 py-2 text-sm focus:outline-none transition uppercase ${promoError ? 'border-red-500' : 'border-gray-200 focus:border-[#8B2525]'}`}
                                        placeholder="CODE"
                                        value={promoInput}
                                        onChange={(e) => setPromoInput(e.target.value)}
                                        disabled={!!appliedPromo}
                                     />
                                     {appliedPromo ? (
                                         <button 
                                            type="button" 
                                            onClick={handleRemovePromo}
                                            className="bg-red-100 text-red-600 px-3 py-2 rounded-xl font-bold text-sm hover:bg-red-200 transition"
                                         >
                                             حذف
                                         </button>
                                     ) : (
                                        <button 
                                            type="button" 
                                            onClick={handleApplyPromo}
                                            className="bg-gray-900 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-black transition"
                                        >
                                            تطبيق
                                        </button>
                                     )}
                                 </div>
                                 {promoError && <p className="text-red-500 text-xs mt-1">{promoError}</p>}
                                 {appliedPromo && <p className="text-green-600 text-xs mt-1 font-bold">تم تطبيق كود {appliedPromo.code} بنجاح!</p>}
                             </div>
                             
                             <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                                 <div className="flex justify-between text-gray-600">
                                     <span>المجموع الفرعي</span>
                                     <span>{subtotal} ج.م</span>
                                 </div>
                                 <div className="flex justify-between text-gray-600">
                                     <span>مصاريف التوصيل</span>
                                     <span className="text-xs font-bold text-gray-500">يحدد من خدمة العملاء</span>
                                 </div>
                                 {discount > 0 && (
                                     <div className="flex justify-between text-green-600 font-bold">
                                         <span>الخصم ({appliedPromo?.code})</span>
                                         <span>- {discount} ج.م</span>
                                     </div>
                                 )}
                                 <div className="flex justify-between text-gray-900 font-bold text-lg pt-2 border-t border-dashed border-gray-200 mt-2">
                                     <span>الإجمالي (بدون توصيل)</span>
                                     <span className="text-[#8B2525]">{total} ج.م</span>
                                 </div>
                             </div>

                             <button 
                                type="submit" 
                                form="checkout-form"
                                className="w-full bg-[#8B2525] text-white py-4 rounded-xl font-bold hover:bg-[#6b1c1c] transition-colors shadow-lg shadow-red-900/20 mt-6"
                             >
                                 تأكيد الطلب ({total} ج.م)
                             </button>
                         </div>
                     </div>
                 </div>
             </div>
        </div>
    );
};
