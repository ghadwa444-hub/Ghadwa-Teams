import React, { useState } from 'react'
import { MenuItem, CartItem } from '../../types'
import { AddToCartButton } from '../UIHelpers'
import { SectionTitle } from './SectionTitle'
import { MENU_CATEGORIES, INITIAL_CHEFS } from '../../constants'

interface FullMenuProps {
    menuItems: MenuItem[];
    cart: CartItem[];
    updateQuantity: (id: number, qty: number, item?: MenuItem) => void;
}

export const FullMenu: React.FC<FullMenuProps> = ({ menuItems, cart, updateQuantity }) => {
    const [activeCategory, setActiveCategory] = useState("الكل");

    const filteredItems = activeCategory === "الكل" 
        ? menuItems 
        : menuItems.filter(item => item.category === activeCategory);

    return (
        <section id="menu" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionTitle
                  title="المنيو الكامل 🥘"
                  description="اختار اللي نفسك فيه من كل الأصناف"
                  showBadge={false}
                />

                <div className="flex overflow-x-auto pb-2 hide-scrollbar gap-2 mb-8 sm:mb-10">
                    {MENU_CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-5 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all ${
                                activeCategory === cat 
                                ? 'bg-[#8B2525] text-white shadow-lg shadow-red-900/20' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {cat}
                        </button>
                        ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredItems.map(item => {
                         const chefObj = INITIAL_CHEFS.find(c => c.name === item.chef);
                         const isOpen = chefObj ? chefObj.isOpen : true;

                         return (
                            <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group overflow-hidden">
                                <div className="h-48 relative overflow-hidden">
                                    <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm">
                                        <i className="fa-solid fa-star text-yellow-400"></i>
                                        {item.rating || 5.0}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-gray-900 line-clamp-1">{item.name}</h3>
                                        <span className="text-[#8B2525] font-bold">{item.price} ج.م</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-4 flex items-center gap-1">
                                        <i className="fa-solid fa-clock"></i>
                                        {item.time || "45 د"}
                                        <span className="mx-1">•</span>
                                        <span className="text-gray-400">مطبخ {item.chef}</span>
                                    </p>
                                    <AddToCartButton item={item} cart={cart} updateQuantity={updateQuantity} className="w-full py-2.5" disabled={!isOpen} />
                                </div>
                            </div>
                         );
                    })}
                </div>
            </div>
        </section>
    );
};