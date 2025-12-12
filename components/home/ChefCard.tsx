I wimport React from 'react';
import { Chef } from '../../types';

interface ChefCardProps {
  chef: Chef;
  onClick: () => void;
}

export const ChefCard: React.FC<ChefCardProps> = ({ chef, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group relative bg-white rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 transform hover:-translate-y-1"
    >
      {/* Cover Image - Responsive Heights */}
      <div className="h-40 sm:h-44 md:h-48 lg:h-56 xl:h-64 overflow-hidden relative">
        <img
          src={chef.cover}
          alt={chef.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

        {/* Status Badge */}
        <div
          className={`absolute top-3 sm:top-4 left-3 sm:left-4 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-bold backdrop-blur-md shadow-sm border flex items-center gap-1.5 ${
            chef.isOpen
              ? 'bg-green-500/90 text-white border-green-400'
              : 'bg-red-500/90 text-white border-red-400'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              chef.isOpen ? 'bg-white animate-pulse' : 'bg-white/50'
            }`}
          ></span>
          {chef.isOpen ? 'مفتوح الآن' : 'مغلق'}
        </div>

        {/* Delivery Time Badge */}
        <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 bg-white/95 backdrop-blur-sm px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-bold text-gray-800 flex items-center gap-1.5 shadow-md border border-gray-100">
          <i className="fa-solid fa-motorcycle text-[#8B2525]"></i>
          <span className="hidden sm:inline">{chef.deliveryTime}</span>
        </div>
      </div>

      {/* Content - Responsive Padding */}
      <div className="p-4 sm:p-5 md:p-6 pt-12 sm:pt-14 md:pt-16 relative">
        {/* Avatar - Responsive Size */}
        <div className="absolute -top-10 sm:-top-12 md:-top-14 right-4 sm:right-5 md:right-6">
          <div className="w-20 h-20 sm:w-22 sm:h-22 md:w-24 md:h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-white">
            <img
              src={chef.img}
              alt={chef.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Info */}
        <div className="mb-3 sm:mb-4">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1 group-hover:text-[#8B2525] transition-colors line-clamp-1">
            {chef.name}
          </h3>
          <p className="text-xs sm:text-sm font-medium text-[#8B2525] bg-red-50 px-2 py-1 rounded-lg w-fit mb-2">
            {chef.specialty}
          </p>
          <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 leading-relaxed hidden sm:block">
            {chef.bio}
          </p>
        </div>

        {/* Stats - Responsive Layout */}
        <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-50 gap-2">
          <div className="flex items-center gap-1 text-yellow-500 font-bold bg-yellow-50 px-2 py-1 rounded-lg text-xs sm:text-sm">
            <i className="fa-solid fa-star"></i>
            <span className="hidden sm:inline">{chef.rating}</span>
            <span className="sm:hidden text-xs">{chef.rating}</span>
          </div>
          <div className="text-xs sm:text-sm text-gray-400 font-medium flex items-center gap-1">
            <i className="fa-solid fa-bag-shopping text-xs sm:text-sm"></i>
            <span className="hidden sm:inline">{chef.orders} طلب</span>
          </div>
        </div>

        {/* Hover Action Button */}
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 md:p-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 bg-white/95 backdrop-blur-sm border-t border-gray-100 flex justify-center">
          <button className="w-full bg-[#8B2525] text-white font-bold py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg sm:rounded-xl hover:bg-[#6b1c1c] transition shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base">
            <span>عرض المنيو</span>
            <i className="fa-solid fa-arrow-left text-xs sm:text-sm"></i>
          </button>
        </div>
      </div>
    </div>
  );
};
