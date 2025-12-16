
import React, { useState, useEffect } from 'react'
import { MenuItem, CartItem } from '../../types'
import { AddToCartButton } from '../UIHelpers'
import { SectionTitle } from './SectionTitle'

interface WeeklyOffersProps {
    offers: MenuItem[];
    cart: CartItem[];
    updateQuantity: (id: number, qty: number, item?: MenuItem) => void;
}

const CountdownTimer = ({ targetDate }: { targetDate?: string }) => {
    const [timeLeft, setTimeLeft] = useState<{h: number, m: number, s: number} | null>(null);

    useEffect(() => {
        if (!targetDate) return;

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = new Date(targetDate).getTime() - now;

            if (distance < 0) {
                clearInterval(interval);
                setTimeLeft(null);
            } else {
                setTimeLeft({
                    h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    s: Math.floor((distance % (1000 * 60)) / 1000)
                });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    if (!timeLeft) return (
        <div className="w-full bg-gray-100 text-gray-400 py-2 rounded-xl text-center font-bold text-sm mb-4">
            انتهى العرض
        </div>
    );

    return (
        <div className="flex items-center justify-center gap-3 bg-red-50 border-2 border-red-100 text-[#8B2525] px-4 py-3 rounded-2xl mb-4 w-full">
            <i className="fa-solid fa-stopwatch text-2xl animate-pulse"></i>
            <div className="flex flex-col items-center">
                <div className="flex gap-1 text-2xl font-black font-mono direction-ltr leading-none">
                    <span>{String(timeLeft.h).padStart(2, '0')}</span>
                    <span className="animate-pulse">:</span>
                    <span>{String(timeLeft.m).padStart(2, '0')}</span>
                    <span className="animate-pulse">:</span>
                    <span>{String(timeLeft.s).padStart(2, '0')}</span>
                </div>
                <span className="text-[10px] font-bold text-red-400 mt-1">ساعات : دقائق : ثواني</span>
            </div>
        </div>
    );
};

export const WeeklyOffers: React.FC<WeeklyOffersProps> = ({ offers, cart, updateQuantity }) => {
    
    const handleShare = (e: React.MouseEvent, offer: MenuItem) => {
        e.stopPropagation();
        const shareData = {
            title: 'غدوة - أكل بيتي',
            text: `الحق عرض ${offer.name} من شيف ${offer.chef} بسعر ${offer.price} ج.م! 😋`,
            url: window.location.origin
        };

        if (navigator.share) {
            navigator.share(shareData).catch((err) => console.log('Error sharing:', err));
        } else {
            navigator.clipboard.writeText(`${shareData.text} \n ${shareData.url}`).then(() => {
                alert('تم نسخ رابط العرض للمشاركة!');
            });
        }
    };

    return (
        <section id="weekly-offers" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-[#f9fafb] relative overflow-hidden">
            <div className="absolute inset-0 pattern-dots opacity-10 text-gray-300 pointer-events-none"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <SectionTitle
                  label="حصرياً"
                  title="عروض الأسبوع النارية 🔥"
                  description="أقوى التوفير على أحلى الأكلات البيتي"
                />
                {offers.length === 0 ? (
                    <div className="text-center py-12 sm:py-16 border-2 border-dashed border-red-200 rounded-2xl bg-red-50">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl text-red-400">
                            <i className="fa-solid fa-fire"></i>
                        </div>
                        <p className="text-lg font-bold text-red-600 mb-2">لا توجد عروض متاحة الآن</p>
                        <p className="text-sm text-red-400">سيتم إضافة عروض حصرية قريباً</p>
                    </div>
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {offers.map(offer => {
                         const isOpen = offer.chef ? true : true; // Chef data now comes from props

                         return (
                        <div key={offer.id} className="flex flex-col bg-white rounded-[2rem] shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group overflow-hidden h-full transform hover:-translate-y-1">
                            <div className="h-64 overflow-hidden relative">
                                <img src={offer.img} alt={offer.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                
                                <div className="absolute top-4 right-4 bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-lg animate-bounce-slow">
                                    خصم {offer.discount}
                                </div>
                                
                                {/* Share Button */}
                                <div className="absolute top-4 left-4 z-20">
                                    <button 
                                        onClick={(e) => handleShare(e, offer)}
                                        className="bg-white/90 backdrop-blur-md text-gray-700 w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#8B2525] hover:text-white transition-all shadow-md transform hover:scale-110"
                                        title="مشاركة العرض"
                                    >
                                        <i className="fa-solid fa-share-nodes"></i>
                                    </button>
                                </div>

                                <div className="absolute bottom-4 right-4 text-white">
                                    <div className="flex items-center gap-2 mb-1">
                                        <img src={offer.chefImg || ""} alt={offer.chef} className="w-8 h-8 rounded-full border-2 border-white" />
                                        <p className="text-xs font-bold opacity-90">{offer.chef}</p>
                                    </div>
                                    <h3 className="font-bold text-xl">{offer.name}</h3>
                                </div>
                            </div>
                            
                            <div className="p-6 flex-grow flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex flex-col">
                                            <span className="text-gray-400 text-sm line-through decoration-red-400 decoration-2">{offer.oldPrice} ج.م</span>
                                            <span className="text-[#8B2525] font-black text-4xl">{offer.price} <span className="text-sm font-bold text-gray-500">ج.م</span></span>
                                        </div>
                                        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center text-[#8B2525] text-2xl shadow-sm">
                                            <i className="fa-solid fa-tags"></i>
                                        </div>
                                    </div>

                                    {/* Timer Moved Here */}
                                    {offer.expiryDate && (
                                        <CountdownTimer targetDate={offer.expiryDate} />
                                    )}
                                </div>

                                <AddToCartButton item={offer} cart={cart} updateQuantity={updateQuantity} className="h-14 w-full text-lg shadow-md font-black" disabled={!isOpen} />
                            </div>
                        </div>
                    )})}
                </div>
                )}
            </div>
        </section>
    );
};
