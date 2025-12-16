
import React from 'react'
import { Box, CartItem, MenuItem } from '../../types'
import { BoxCard } from './BoxCard'
import { SectionTitle } from './SectionTitle'

interface BoxesSectionProps {
  boxes: Box[]
  cart: CartItem[]
  updateQuantity: (id: number, qty: number, item?: MenuItem) => void
}

export const BoxesSection: React.FC<BoxesSectionProps> = ({
  boxes,
  cart,
  updateQuantity
}) => {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionTitle
          label="الأكثر توفيراً"
          title="بوكسات العيلة 📦"
          description="لمة العيلة محتاجة أكلة حلوة، جمعنالك أحلى الأكلات في بوكسات تكفي الكل."
        />

        {/* RESPONSIVE GRID: 1 col (mobile) → 2 cols (tablet) → 3 cols (lg) → 4 cols (xl) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {boxes.map(box => {
            const isOpen = box.chef ? true : true; // Chef data from props

            return (
              <BoxCard
                key={box.id}
                box={box}
                cart={cart}
                updateQuantity={updateQuantity}
                isOpen={isOpen}
              />
            )
          })}
        </div>

        {/* EMPTY STATE */}
        {boxes.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">لا توجد بوكسات متاحة حالياً</p>
          </div>
        )}
      </div>
    </section>
  )
}
