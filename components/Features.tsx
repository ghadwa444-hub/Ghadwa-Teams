import React from 'react';

export const Features = () => {
    return (
        <section className="py-16 bg-red-50 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-red-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-100 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>
             
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                     <div className="bg-white/60 backdrop-blur-sm p-8 rounded-3xl border border-white shadow-sm">
                         <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">
                             <i className="fa-solid fa-leaf"></i>
                         </div>
                         <h3 className="text-xl font-bold text-gray-900 mb-3">مكونات طازجة 100%</h3>
                         <p className="text-gray-600 leading-relaxed">خضار ولحوم بلدي بتيجي يوم بيوم، عشان نضمن لك طعم الأكل البيتي الأصلي.</p>
                     </div>
                     <div className="bg-white/60 backdrop-blur-sm p-8 rounded-3xl border border-white shadow-sm">
                         <div className="w-16 h-16 bg-red-100 text-[#8B2525] rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">
                             <i className="fa-solid fa-heart"></i>
                         </div>
                         <h3 className="text-xl font-bold text-gray-900 mb-3">نظافة وسلامة</h3>
                         <p className="text-gray-600 leading-relaxed">شيفاتنا ستات بيوت بيطبخوا في مطابخهم الخاصة بأعلى معايير النظافة، زي ما بيطبخوا لولادهم.</p>
                     </div>
                     <div className="bg-white/60 backdrop-blur-sm p-8 rounded-3xl border border-white shadow-sm">
                         <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">
                             <i className="fa-solid fa-truck-fast"></i>
                         </div>
                         <h3 className="text-xl font-bold text-gray-900 mb-3">توصيل سريع</h3>
                         <p className="text-gray-600 leading-relaxed">الأكل بيوصلك سخن وفي وقته، مغلف بطريقة تحفظ حرارته وطعمه لحد باب بيتك.</p>
                     </div>
                 </div>
             </div>
        </section>
    )
}