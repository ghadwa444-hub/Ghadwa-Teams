
import React from 'react';
import { Chef } from '../types';

interface AllChefsPageProps {
    chefs: Chef[];
    onBack: () => void;
    onChefClick: (chef: Chef) => void;
}

export const AllChefsPage: React.FC<AllChefsPageProps> = ({ chefs, onBack, onChefClick }) => {
    return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4 border-b border-gray-200 pb-6">
                    <div>
                        <button onClick={onBack} className="mb-4 flex items-center gap-2 text-gray-500 hover:text-[#8B2525] font-bold transition text-sm">
                            <i className="fa-solid fa-arrow-right"></i> رجوع للرئيسية
                        </button>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">كل الشيفات 👩‍🍳</h1>
                        <p className="text-gray-500">اختار الشيف اللي يعجبك واستمتع بأحلى أكل بيتي</p>
                    </div>
                    <div className="text-sm font-bold bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 text-gray-600">
                        {chefs.length} شيف متاح
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {chefs.map(chef => (
                        <div key={chef.id} onClick={() => onChefClick(chef)} className="group relative bg-white rounded-[2rem] shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 transform hover:-translate-y-1">
                            {/* Cover Image */}
                            <div className="h-48 overflow-hidden relative">
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
        </div>
    </div>
    );
};
