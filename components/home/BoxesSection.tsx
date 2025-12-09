
import React from 'react';
import { Box, CartItem, MenuItem } from '../../types';
import { AddToCartButton } from '../UIHelpers';
import { INITIAL_CHEFS } from '../../constants';

interface BoxesSectionProps {
    boxes: Box[];
    cart: CartItem[];
    updateQuantity: (id: number, qty: number, item?: MenuItem) => void;
}

export const BoxesSection: React.FC<BoxesSectionProps> = ({ boxes, cart, updateQuantity }) => {
    return (
        <section className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="text-[#8B2525] font-bold tracking-wider uppercase text-sm bg-red-100 px-3 py-1 rounded-full">الأكثر توفيراً</span>
                    <h2 className="text-4xl font-bold text-gray-900 mt-4 mb-3">بوكسات العيلة 📦</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">لمة العيلة محتاجة أكلة حلوة، جمعنالك أحلى الأكلات في بوكسات تكفي الكل.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {boxes.map(box => {
                        const chefObj = INITIAL_CHEFS.find(c => c.name === box.chef);
                        const isOpen = chefObj ? chefObj.isOpen : true;

                        // Cast Box to MenuItem for AddToCartButton
                        const boxAsMenuItem = box as unknown as MenuItem;

                        return (
                        <div key={box.id} className="flex flex-col bg-white rounded-[2rem] shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group overflow-hidden h-full">
                            {/* Top Image Section */}
                            <div className="h-64 overflow-hidden relative">
                                <img src={box.img} alt={box.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                
                                <div className="absolute top-4 right-4">
                                    <span className="bg-white/95 backdrop-blur-md text-gray-900 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm border border-gray-100">
                                        {box.badge || "عرض مميز"}
                                    </span>
                                </div>
                            </div>

                            {/* Content Body */}
                            <div className="p-6 flex-grow flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold text-gray-900">{box.name}</h3>
                                    </div>
                                    
                                    <div className="flex items-center gap-4 text-gray-500 text-sm mb-4 border-b border-gray-50 pb-4">
                                        <span className="flex items-center gap-1"><i className="fa-solid fa-users text-[#8B2525]"></i> يكفي {box.serves}</span>
                                        <span className="flex items-center gap-1"><i className="fa-solid fa-utensils text-[#8B2525]"></i> مطبخ {box.chef}</span>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {box.items && box.items.slice(0, 3).map((item, idx) => (
                                            <span key={idx} className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full">
                                                {item}
                                            </span>
                                        ))}
                                        {box.items && box.items.length > 3 && (
                                            <span className="bg-gray-100 text-gray-500 text-xs px-2.5 py-1 rounded-full">
                                                +{box.items.length - 3}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-dashed border-gray-100">
                                    <div className="flex flex-col">
                                        <span className="text-gray-400 text-xs font-bold">السعر</span>
                                        <span className="text-[#8B2525] font-black text-3xl">{box.price} <span className="text-sm font-bold text-gray-500">ج.م</span></span>
                                    </div>
                                    <div className="w-1/2">
                                        <AddToCartButton 
                                            item={boxAsMenuItem} 
                                            cart={cart} 
                                            updateQuantity={updateQuantity} 
                                            className="h-12 w-full shadow-lg" 
                                            disabled={!isOpen} 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )})}
                </div>
            </div>
        </section>
    )
};
