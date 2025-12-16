import React from 'react';

interface HeroProps {
  onNavigate: (page: string) => void;
  onOpenMenu: () => void;
  onOpenAuth: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate, onOpenMenu, onOpenAuth }) => {
  const scrollToMenu = () => {
    const menuSection = document.getElementById('menu');
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-[90vh] bg-[#fff5f5] flex items-center overflow-hidden pt-20">
      <div className="absolute top-20 left-[-10%] w-[500px] h-[500px] bg-[#ffe4e4] rounded-full blur-3xl opacity-50 mix-blend-multiply filter animate-blob"></div>
      <div className="absolute top-20 right-[-10%] w-[500px] h-[500px] bg-[#ffd1d1] rounded-full blur-3xl opacity-50 mix-blend-multiply filter animate-blob animation-delay-2000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-right space-y-8 animate-fade-in-up">
            <span
              onClick={onOpenAuth}
              className="inline-block px-4 py-2 rounded-full bg-red-100 text-[#8B2525] font-bold text-sm tracking-wider mb-2 cursor-pointer hover:bg-red-200 transition select-none"
              title="Admin Login"
            >
              أكل بيتي 100%
            </span>
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
              أكل بيت… <br />
              <span className="text-[#8B2525] relative">
                معمول بحب
                <svg className="absolute w-full h-3 -bottom-1 right-0 text-red-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>
              <br /> ويتسلم لحد بابك
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
              أحلى أكل بيتي من إيد ستات بيوت شاطرين، بيوصلك سخن لحد باب بيتك. جرب طعم الدفء واللمة مع غدوة.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button onClick={scrollToMenu} className="bg-[#8B2525] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#6b1c1c] transition shadow-xl shadow-red-900/20 flex items-center justify-center gap-2">
                اطلب دلوقتي
                <i className="fa-solid fa-arrow-down"></i>
              </button>
              <button onClick={onOpenMenu} className="bg-white text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-50 transition shadow-lg border border-gray-100 flex items-center justify-center gap-2">
                <i className="fa-solid fa-file-pdf text-[#8B2525]"></i>
                تحميل المنيو
              </button>
            </div>
          </div>

          <div className="relative lg:h-[600px] flex items-center justify-center animate-float">
            <div className="relative w-full max-w-lg aspect-square">
              <div className="absolute inset-0 bg-[#8B2525] rounded-full opacity-5 blur-3xl transform rotate-12"></div>
              <img
                src=""
                alt="Delicious Food"
                className="w-full h-full object-cover rounded-full shadow-2xl border-8 border-white relative z-10"
              />

              <div className="absolute -left-8 top-20 bg-white p-4 rounded-2xl shadow-xl z-20 flex items-center gap-3 animate-bounce-slow">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">🥬</div>
                <div>
                  <p className="font-bold text-gray-900">مكونات طازجة</p>
                  <p className="text-xs text-gray-500">خضار بلدي يوم بيوم</p>
                </div>
              </div>

              <div className="absolute -right-4 bottom-20 bg-white p-4 rounded-2xl shadow-xl z-20 flex items-center gap-3 animate-bounce-slow animation-delay-1000">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-2xl">🔥</div>
                <div>
                  <p className="font-bold text-gray-900">توصيل سخن</p>
                  <p className="text-xs text-gray-500">في أقل من 60 دقيقة</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};