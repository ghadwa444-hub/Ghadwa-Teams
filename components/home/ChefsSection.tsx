
import React from 'react'
import { Chef } from '../../types'
import { SectionTitle } from './SectionTitle'
import { ChefCard } from './ChefCard'

interface ChefsSectionProps {
    onNavigate: (page: string) => void;
    onChefClick: (chef: Chef) => void;
    chefs: Chef[];
}

export const ChefsSection: React.FC<ChefsSectionProps> = ({ onNavigate, onChefClick, chefs }) => {
    return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white" id="chefs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle
              label="شيفات غدوة"
              title="أبطال المطبخ 👩‍🍳"
              description="تعرف على أمهر الشيفات اللي بيطبخولك بحب، واختار الشيف اللي يعجبك."
            />

            {chefs.length === 0 ? (
                <div className="text-center py-12 sm:py-16 lg:py-20 border-2 border-dashed border-gray-200 rounded-2xl sm:rounded-3xl bg-gray-50">
                    <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl sm:text-4xl text-gray-400">
                        <i className="fa-solid fa-user-chef"></i>
                    </div>
                    <p className="text-lg sm:text-xl font-bold text-gray-600 mb-2">لسه مفيش شيفات انضموا لينا</p>
                    <p className="text-sm sm:text-base text-gray-400">جاري إضافة أمهر الشيفات قريباً...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
                    {chefs.slice(0, 3).map(chef => (
                        <ChefCard
                            key={chef.id}
                            chef={chef}
                            onClick={() => onChefClick(chef)}
                        />
                    ))}
                </div>
            )}

            <div className="text-center mt-10 sm:mt-12 lg:mt-14">
                <button onClick={() => onNavigate('all-chefs')} className="inline-flex items-center gap-2 font-bold text-[#8B2525] border-b-2 border-[#8B2525] pb-1 hover:text-[#6b1c1c] hover:border-[#6b1c1c] transition text-sm sm:text-base">
                    عرض كل الشيفات
                </button>
            </div>
        </div>
    </section>
    );
};
