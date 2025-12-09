
import React from 'react';
import { MenuItem, CartItem } from '../../types';
import { AddToCartButton } from '../UIHelpers';
import { INITIAL_CHEFS } from '../../constants';

interface WeeklyOffersProps {
    offers: MenuItem[];
    cart: CartItem[];
    updateQuantity: (id: number, qty: number, item?: MenuItem) => void;
}

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
        <section id="weekly-offers" className="py-20 bg-[#f9fafb] relative overflow-hidden">
            <div className="absolute inset-0 pattern-dots opacity-10 text-gray-300 pointer-events-none"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <span className="text-[#8B2525] font-bold tracking-wider uppercase text-sm bg-red-100 px-4 py-1.5 rounded-full">حصرياً</span>
                    <h2 className="text-4xl font-bold text-gray-900 mt-4 mb-3">عروض الأسبوع النارية 🔥</h2>
                    <p className="text-gray-500">أقوى التوفير على أحلى الأكلات البيتي</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {offers.map(offer => {
                         const chefObj = INITIAL_CHEFS.find(c => c.name === offer.chef);
                         const isOpen = chefObj ? chefObj.isOpen : true;

                         return (
                        <div key={offer.id} className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100 relative">
                            <div className="relative h-64 overflow-hidden">
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
                                        <img src={offer.chefImg || "https://source.unsplash.com/random/person"} alt={offer.chef} className="w-8 h-8 rounded-full border-2 border-white" />
                                        <p className="text-xs font-bold opacity-90">{offer.chef}</p>
                                    </div>
                                    <h3 className="font-bold text-xl">{offer.name}</h3>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex flex-col">
                                        <span className="text-gray-400 text-sm line-through decoration-red-400 decoration-2">{offer.oldPrice} ج.م</span>
                                        <span className="text-[#8B2525] font-black text-3xl">{offer.price} <span className="text-sm font-bold text-gray-500">ج.م</span></span>
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-[#8B2525] text-xl">
                                        <i className="fa-solid fa-tags"></i>
                                    </div>
                                </div>
                                <AddToCartButton item={offer} cart={cart} updateQuantity={updateQuantity} className="h-12 w-full text-lg shadow-md" disabled={!isOpen} />
                            </div>
                        </div>
                    )})}
                </div>
            </div>
        </section>
    );
};
