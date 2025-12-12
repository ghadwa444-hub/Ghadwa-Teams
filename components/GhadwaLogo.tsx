import React from 'react';

interface GhadwaLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  showText?: boolean;
  textPosition?: 'below' | 'right';
  animated?: boolean;
}

export const GhadwaLogo: React.FC<GhadwaLogoProps> = ({
  size = 'md',
  showText = false,
  textPosition = 'below',
  animated = false,
}) => {
  const sizeClasses = {
    xs: 'w-8 h-8 text-lg',
    sm: 'w-10 h-10 text-xl',
    md: 'w-12 h-12 text-2xl',
    lg: 'w-16 h-16 text-4xl',
    xl: 'w-20 h-20 text-4xl',
    '2xl': 'w-24 h-24 text-5xl',
    '3xl': 'w-32 h-32 text-6xl',
  };

  const animationClass = animated ? 'animate-bounce' : '';

  const logo = (
    <div
      className={`${sizeClasses[size]} bg-gradient-to-br from-[#8B2525] to-[#6b1c1c] rounded-full flex items-center justify-center text-white font-bold shadow-lg ${animationClass}`}
    >
      غ
    </div>
  );

  if (!showText) {
    return logo;
  }

  if (textPosition === 'below') {
    return (
      <div className="flex flex-col items-center gap-2">
        {logo}
        <div className="text-center">
          <h3 className="font-bold text-gray-900">غدوة</h3>
          <p className="text-sm text-gray-600">أكل بيتي</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {logo}
      <div>
        <h3 className="font-bold text-gray-900">غدوة</h3>
        <p className="text-sm text-gray-600">أكل بيتي يوصلك لحد بابك</p>
      </div>
    </div>
  );
};
