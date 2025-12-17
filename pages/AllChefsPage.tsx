
import React, { useState, useMemo } from 'react';
import { Chef } from '../types';
import { ChefCard } from '../components/home/ChefCard';

interface AllChefsPageProps {
    chefs: Chef[];
    onBack: () => void;
    onChefClick: (chef: Chef) => void;
}

export const AllChefsPage: React.FC<AllChefsPageProps> = ({ chefs, onBack, onChefClick }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterOpen, setFilterOpen] = useState<boolean | null>(null);

    // Filter chefs based on search and status
    const filteredChefs = useMemo(() => {
        return chefs.filter(chef => {
            const matchesSearch =
                chef.chef_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (chef.specialty?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (chef.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());

            const matchesStatus =
                filterOpen === null ||
                chef.is_active === filterOpen;

            return matchesSearch && matchesStatus;
        });
    }, [chefs, searchTerm, filterOpen]);

    return (
        <div className="min-h-screen bg-gray-50 pt-20 sm:pt-24 pb-16 sm:pb-20 animate-fade-in">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="mb-8 sm:mb-10 lg:mb-12">
                    <button
                        onClick={onBack}
                        className="mb-4 sm:mb-6 flex items-center gap-2 text-gray-500 hover:text-[#8B2525] font-bold transition text-sm sm:text-base"
                    >
                        <i className="fa-solid fa-arrow-right"></i> رجوع للرئيسية
                    </button>

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 sm:gap-6 border-b border-gray-200 pb-6 sm:pb-8">
                        <div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2 sm:mb-3">
                                كل الشيفات 👩‍🍳
                            </h1>
                            <p className="text-sm sm:text-base text-gray-500">
                                اختار الشيف اللي يعجبك واستمتع بأحلى أكل بيتي
                            </p>
                        </div>
                        <div className="text-xs sm:text-sm font-bold bg-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl shadow-sm border border-gray-100 text-gray-600 whitespace-nowrap">
                            {filteredChefs.length} شيف
                        </div>
                    </div>
                </div>

                {/* Search & Filter Section */}
                <div className="mb-8 sm:mb-10 lg:mb-12 flex flex-col sm:flex-row gap-3 sm:gap-4">
                    {/* Search Input */}
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="ابحث عن شيف أو تخصص..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 sm:px-5 py-2.5 sm:py-3 bg-white border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-[#8B2525] focus:ring-2 focus:ring-[#8B2525]/10 transition text-sm sm:text-base"
                        />
                        <i className="fa-solid fa-magnifying-glass absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-gray-400 text-sm sm:text-base"></i>
                    </div>

                    {/* Status Filter */}
                    <div className="flex gap-2 sm:gap-3">
                        <button
                            onClick={() => setFilterOpen(null)}
                            className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-bold transition text-xs sm:text-sm whitespace-nowrap ${
                                filterOpen === null
                                    ? 'bg-[#8B2525] text-white shadow-lg'
                                    : 'bg-white border border-gray-200 text-gray-600 hover:border-[#8B2525]'
                            }`}
                        >
                            الكل
                        </button>
                        <button
                            onClick={() => setFilterOpen(true)}
                            className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-bold transition text-xs sm:text-sm whitespace-nowrap flex items-center gap-1.5 ${
                                filterOpen === true
                                    ? 'bg-green-500 text-white shadow-lg'
                                    : 'bg-white border border-gray-200 text-gray-600 hover:border-green-500'
                            }`}
                        >
                            <i className="fa-solid fa-check-circle text-xs sm:text-sm"></i>
                            <span className="hidden sm:inline">مفتوح</span>
                        </button>
                        <button
                            onClick={() => setFilterOpen(false)}
                            className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-bold transition text-xs sm:text-sm whitespace-nowrap flex items-center gap-1.5 ${
                                filterOpen === false
                                    ? 'bg-red-500 text-white shadow-lg'
                                    : 'bg-white border border-gray-200 text-gray-600 hover:border-red-500'
                            }`}
                        >
                            <i className="fa-solid fa-circle-xmark text-xs sm:text-sm"></i>
                            <span className="hidden sm:inline">مغلق</span>
                        </button>
                    </div>
                </div>

                {/* Chefs Grid */}
                {filteredChefs.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
                        {filteredChefs.map((chef) => (
                            <ChefCard
                                key={chef.id}
                                chef={chef}
                                onClick={() => onChefClick(chef)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 sm:py-16 lg:py-20 border-2 border-dashed border-gray-200 rounded-2xl sm:rounded-3xl bg-gray-50">
                        <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl sm:text-4xl text-gray-400">
                            <i className="fa-solid fa-user-chef"></i>
                        </div>
                        <p className="text-lg sm:text-xl font-bold text-gray-600 mb-2">
                            لم نجد شيفات تطابق بحثك
                        </p>
                        <p className="text-sm sm:text-base text-gray-400">
                            حاول البحث عن شيف أو تخصص آخر
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
