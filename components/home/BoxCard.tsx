import React from 'react'
import { Box, CartItem, MenuItem } from '../../types'
import { AddToCartButton } from '../UIHelpers'

interface BoxCardProps {
  box: Box
  cart: CartItem[]
  updateQuantity: (id: number, qty: number, item?: MenuItem) => void
  isOpen: boolean
}

export const BoxCard: React.FC<BoxCardProps> = ({
  box,
  cart,
  updateQuantity,
  isOpen
}) => {
  return (
    <div className="flex flex-col h-full bg-white rounded-lg sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group overflow-hidden">
      
      {/* IMAGE SECTION - Responsive Height: 160px (mobile) → 256px (desktop) */}
      <div className="h-40 sm:h-48 md:h-56 lg:h-64 overflow-hidden relative">
        <img
          src={box.image_url || 'https://via.placeholder.com/400x300?text=Box'}
          alt={box.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* BADGE - Responsive Position & Size */}
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
          <span className="bg-white/90 backdrop-blur-sm text-gray-900 text-xs sm:text-sm font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg shadow-sm border border-gray-100">
            عرض مميز
          </span>
        </div>
      </div>

      {/* CONTENT SECTION - Responsive Padding: 16px (mobile) → 24px (desktop) */}
      <div className="p-4 sm:p-5 lg:p-6 flex-grow flex flex-col justify-between">
        
        {/* INFO */}
        <div>
          {/* TITLE - Responsive Text: 18px → 20px */}
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 truncate">
            {box.name}
          </h3>

          {/* DETAILS ROW - Responsive Text & Gap */}
          <div className="flex items-center gap-3 sm:gap-4 text-gray-500 text-xs sm:text-sm mb-3 sm:mb-4 border-b border-gray-50 pb-3 sm:pb-4">
            <span className="flex items-center gap-1 whitespace-nowrap">
              <i className="fa-solid fa-utensils text-red-700"></i>
              صندوق مميز
            </span>
          </div>

          {/* ITEMS TAGS - Responsive Flex Wrap */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full whitespace-nowrap">
              صندوق طعام متكامل
            </span>
          </div>
        </div>

        {/* FOOTER - Price & Button */}
        <div className="pt-3 sm:pt-4 border-t border-dashed border-gray-100 flex flex-col gap-3 sm:gap-4">
          
          {/* PRICE - Responsive Text: 24px → 36px */}
          <div className="flex flex-col">
            <span className="text-gray-400 text-xs font-bold">السعر</span>
            <span className="text-red-700 font-black text-2xl sm:text-3xl lg:text-4xl">
              {box.price}
              <span className="text-sm sm:text-base font-bold text-gray-500">
                {' '}ج.م
              </span>
            </span>
          </div>

          {/* BUTTON - Full Width, Min 44px Height (mobile touch target) */}
          <AddToCartButton
            item={box as unknown as MenuItem}
            cart={cart}
            updateQuantity={updateQuantity}
            className="w-full h-11 sm:h-12 lg:h-13 shadow-lg text-sm sm:text-base font-semibold transition-all duration-200"
            disabled={!box.is_active}
          />
        </div>
      </div>
    </div>
  )
}
