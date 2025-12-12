import React from 'react'

interface SectionTitleProps {
  label?: string
  title: string
  description?: string
  showBadge?: boolean
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  label,
  title,
  description,
  showBadge = true
}) => {
  return (
    <div className="text-center mb-8 sm:mb-12 lg:mb-16">
      {/* BADGE - Responsive sizing */}
      {showBadge && label && (
        <span className="inline-block text-red-700 font-bold tracking-wider uppercase text-xs sm:text-sm bg-red-100 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4">
          {label}
        </span>
      )}

      {/* TITLE - Responsive scaling: 24px → 48px */}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mt-3 sm:mt-4 mb-2 sm:mb-3">
        {title}
      </h2>

      {/* DESCRIPTION - Responsive text size */}
      {description && (
        <p className="text-gray-500 text-sm sm:text-base max-w-2xl mx-auto px-2 sm:px-0 mt-2 sm:mt-3">
          {description}
        </p>
      )}
    </div>
  )
}
