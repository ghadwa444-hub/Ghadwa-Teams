
import React from 'react';
import { Chef } from '../../types';

interface ChefsSectionProps {
    onNavigate: (page: string) => void;
    onChefClick: (chef: Chef) => void;
    chefs: Chef[];
}

export const ChefsSection: React.FC<ChefsSectionProps> = ({ onNavigate, onChefClick, chefs }) => {
    return (
    <section className="py-24 bg-white" id="chefs">
        <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
                <span className="text-[#8B2525] font-bold tracking-wider uppercase text-sm bg-red-50 px-3 py-1 rounded-full">شيفات غدوة</span>
                <h2 className="text-4xl font-bold text-gray-900 mt-4 mb-3">أبطال المطبخ 👩‍🍳</h2>
                <p className="text-gray-500 max-w-2xl mx-auto">تعرف على أمهر الشيفات اللي بيطبخولك بحب، واختار الشيف اللي يعجبك.</p>
            </div>

            {chefs.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl text-gray-400">
                        <i className="fa-solid fa-user-chef"></i>
                    </div>
                    <p className="text-xl font-bold text-gray-600">لسه مفيش شيفات انضموا لينا</p>
                    <p className="text-gray-400 mt-2">جاري إضافة أمهر الشيفات قريباً...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {chefs.slice(0, 3).map(chef => (
                        <div key={chef.id} onClick={() => onChefClick(chef)} className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100">
                            {/* Cover Image */}
                            <div className="h-40 overflow-hidden relative">
                                <img src={chef.cover} alt={chef.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                
                                {/* Status Badge */}
                                <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md shadow-sm border flex items-center gap-1.5 ${
                                    chef.isOpen 
                                    ? 'bg-green-500/90 text-white border-green-400' 
                                    : 'bg-red-500/90 text-white border-red-400'
                                }`}>
                                    <span className={`w-2 h-2 rounded-full ${chef.isOpen ? 'bg-white animate-pulse' : 'bg-white/50'}`}></span>
                                    {chef.isOpen ? 'مفتوح الآن' : 'مغلق'}
                                </div>

                                {/* Prominent Delivery Time Badge */}
                                <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-gray-800 flex items-center gap-1.5 shadow-md border border-gray-100">
                                    <i className="fa-solid fa-motorcycle text-[#8B2525]"></i>
                                    {chef.deliveryTime}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 pt-12 relative">
                                {/* Avatar */}
                                <div className="absolute -top-12 right-6">
                                    <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-white">
                                        <img src={chef.img} alt={chef.name} className="w-full h-full object-cover" />
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="mb-4">
                                    <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-[#8B2525] transition-colors">{chef.name}</h3>
                                    <p className="text-sm font-medium text-[#8B2525] bg-red-50 px-2 py-1 rounded-lg w-fit mb-2">{chef.specialty}</p>
                                    <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{chef.bio}</p>
                                </div>

                                {/* Stats */}
                                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                    <div className="flex items-center gap-1 text-yellow-500 font-bold bg-yellow-50 px-2 py-1 rounded-lg text-sm">
                                        <i className="fa-solid fa-star"></i> {chef.rating}
                                    </div>
                                    <div className="text-xs text-gray-400 font-medium flex items-center gap-1">
                                        <i className="fa-solid fa-bag-shopping"></i> {chef.orders} طلب
                                    </div>
                                </div>
                                
                                {/* Hover Action */}
                                <div className="absolute inset-x-0 bottom-0 p-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 bg-white/95 backdrop-blur-sm border-t border-gray-100 flex justify-center">
                                    <button className="w-full bg-[#8B2525] text-white font-bold py-2.5 rounded-xl hover:bg-[#6b1c1c] transition shadow-lg flex items-center justify-center gap-2">
                                        <span>عرض المنيو</span>
                                        <i className="fa-solid fa-arrow-left"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="text-center mt-12">
                <button onClick={() => onNavigate('all-chefs')} className="inline-flex items-center gap-2 font-bold text-[#8B2525] border-b-2 border-[#8B2525] pb-1 hover:text-[#6b1c1c] hover:border-[#6b1c1c] transition">
                    عرض كل الشيفات
                </button>
            </div>
        </div>
    </section>
    );
};
