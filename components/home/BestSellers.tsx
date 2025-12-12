import React from 'react'
import { MenuItem, CartItem, Chef } from '../../types'
import { AddToCartButton } from '../UIHelpers'
import { SectionTitle } from './SectionTitle'

interface BestSellersProps {
    cart: CartItem[];
    updateQuantity: (id: number, qty: number, item?: MenuItem) => void;
    chefs: Chef[];
    bestSellers: MenuItem[];
}

export const BestSellers: React.FC<BestSellersProps> = ({ cart, updateQuantity, chefs, bestSellers }) => {
    return (
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white relative">
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pattern-dots pointer-events-none"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <SectionTitle
                  label="الأعلى تقييماً"
                  title="الأكثر طلباً 🌟"
                  description="الأكلات اللي الناس حبتها وطلبتها مرة واتنين.. جرب الطعم الأصلي."
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {bestSellers.map(item => {
                         const chefObj = chefs.find(c => c.name === item.chef);
                         const isOpen = chefObj ? chefObj.isOpen : true;
                         
                         const cartItem = cart.find(c => c.id === item.id);
                         const currentPrice = cartItem ? (cartItem.quantity * item.price) : item.price;

                         return (
                            <div key={item.id} className="flex flex-col bg-white rounded-[2rem] shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group overflow-hidden h-full transform hover:-translate-y-1">
                                <div className="h-64 overflow-hidden relative">
                                    <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80"></div>
                                    <div className="absolute top-4 right-4">
                                        <span className="bg-white/95 backdrop-blur-md text-gray-900 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                                            {item.category}
                                        </span>
                                    </div>
                                     <div className="absolute bottom-4 right-4 flex flex-col items-start gap-1">
                                        <h3 className="font-bold text-2xl text-white drop-shadow-md">{item.name}</h3>
                                        <div className="flex items-center gap-2 text-white/90 text-sm">
                                            <i className="fa-solid fa-utensils text-[#ffca28]"></i> 
                                            مطبخ {item.chef}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 flex-grow flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center gap-1 text-yellow-400 text-sm mb-3">
                                            <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
                                            <span className="text-gray-400 text-xs mr-1">(5.0)</span>
                                        </div>
                                        <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2">
                                            {item.desc}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between pt-4 border-t border-dashed border-gray-100 mt-2">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-400 font-bold mb-1">السعر</span>
                                            <span className="text-[#8B2525] font-black text-3xl">{currentPrice} <span className="text-sm text-gray-500 font-bold">ج.م</span></span>
                                        </div>
                                        <div className="w-1/2">
                                            <AddToCartButton item={item} cart={cart} updateQuantity={updateQuantity} className="h-14 w-full shadow-lg" disabled={!isOpen} isLarge={true} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                         )
                    })}
                </div>
            </div>
        </section>
    )
};