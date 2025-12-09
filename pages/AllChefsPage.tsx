import React from 'react';
import { Chef } from '../types';

interface AllChefsPageProps {
    chefs: Chef[];
    onBack: () => void;
    onChefClick: (chef: Chef) => void;
}

export const AllChefsPage: React.FC<AllChefsPageProps> = ({ chefs, onBack, onChefClick }) => {
    const getStatusInfo = (chef: Chef) => {
        if (!chef.isOpen) return { text: 'مغلق', class: 'bg-red-100 text-red-700', icon: 'fa-lock' };
        if (chef.id === 2) return { text: 'يغلق قريباً', class: 'bg-orange-100 text-orange-700', icon: 'fa-clock' };
        return { text: 'مفتوح', class: 'bg-green-100 text-green-700', icon: 'fa-check' };
    };

    return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4">
                <button onClick={onBack} className="mb-8 flex items-center gap-2 text-gray-500 hover:text-[#8B2525] font-bold transition">
                    <i className="fa-solid fa-arrow-right"></i> رجوع للرئيسية
                </button>
                <h1 className="text-4xl font-bold text-gray-900 mb-8">كل الشيفات ({chefs.length})</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {chefs.map(chef => {
                        const status = getStatusInfo(chef);
                        return (
                        <div key={chef.id} onClick={() => onChefClick(chef)} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all cursor-pointer group">
                            <div className="flex items-center gap-4 mb-4">
                                <img src={chef.img} alt={chef.name} className="w-16 h-16 rounded-full object-cover border border-gray-100" />
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#8B2525] transition">{chef.name}</h3>
                                    <p className="text-sm text-gray-500">{chef.specialty}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-1 text-yellow-500 font-bold"><i className="fa-solid fa-star"></i> {chef.rating}</div>
                                <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${status.class}`}>
                                    <i className={`fa-solid ${status.icon} text-[10px]`}></i> {status.text}
                                </div>
                            </div>
                        </div>
                    )})}
                </div>
        </div>
    </div>
    );
};