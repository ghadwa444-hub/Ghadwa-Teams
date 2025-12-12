
import React from 'react';
import { ContactSettings } from '../types';

interface FooterProps {
    contactSettings?: ContactSettings;
}

export const Footer: React.FC<FooterProps> = ({ contactSettings }) => {
    // Default fallback if not yet loaded
    const settings = contactSettings || {
        phone: "01000000000",
        whatsapp: "201000000000",
        email: "hello@ghadwa.com",
        address: "المعادي، القاهرة، مصر",
        facebookUrl: "#",
        instagramUrl: "#",
    };

    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-white pt-12 sm:pt-16 md:pt-20 lg:pt-24 pb-8 sm:pb-10 md:pb-12 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-12 sm:mb-14 md:mb-16 lg:mb-20">
                    {/* Brand Section */}
                    <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                        <div className="flex items-center gap-3 mb-6 sm:mb-8">
                            <div className="w-10 sm:w-12 h-10 sm:h-12 bg-[#8B2525] rounded-full flex items-center justify-center font-bold text-lg sm:text-2xl">
                                غ
                            </div>
                            <span className="font-bold text-2xl sm:text-3xl">غدوة</span>
                        </div>
                        <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-6 sm:mb-8">
                            أول منصة مصرية بتجمع ستات البيوت الشاطرة في مكان واحد. 
                            هدفنا نوصلك أكل بيتي نضيف وطعمه زي أكل ماما.
                        </p>
                        <div className="flex gap-3 sm:gap-4">
                            <a
                                href={settings.facebookUrl}
                                target="_blank"
                                rel="noreferrer"
                                aria-label="تابعنا على فيسبوك"
                                className="w-9 sm:w-10 h-9 sm:h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#8B2525] hover:text-white transition text-sm sm:text-base"
                            >
                                <i className="fa-brands fa-facebook-f"></i>
                            </a>
                            <a
                                href={settings.instagramUrl}
                                target="_blank"
                                rel="noreferrer"
                                aria-label="تابعنا على إنستجرام"
                                className="w-9 sm:w-10 h-9 sm:h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#8B2525] hover:text-white transition text-sm sm:text-base"
                            >
                                <i className="fa-brands fa-instagram"></i>
                            </a>
                            {settings.whatsapp && (
                                <a
                                    href={`https://wa.me/${settings.whatsapp}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="تواصل معنا على واتس"
                                    className="w-9 sm:w-10 h-9 sm:h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-green-600 hover:text-white transition text-sm sm:text-base"
                                >
                                    <i className="fa-brands fa-whatsapp"></i>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="col-span-1">
                        <h4 className="font-bold text-base sm:text-lg mb-5 sm:mb-6">روابط سريعة</h4>
                        <ul className="space-y-2.5 sm:space-y-3 text-gray-400 text-xs sm:text-sm">
                            <li>
                                <a href="#" className="hover:text-white hover:translate-x-1 transition inline-block">
                                    عن غدوة
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white hover:translate-x-1 transition inline-block">
                                    الشيفات
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white hover:translate-x-1 transition inline-block">
                                    المنيو
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white hover:translate-x-1 transition inline-block">
                                    العروض
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white hover:translate-x-1 transition inline-block">
                                    انضمي كشيف
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Help & Support */}
                    <div className="col-span-1">
                        <h4 className="font-bold text-base sm:text-lg mb-5 sm:mb-6">المساعدة</h4>
                        <ul className="space-y-2.5 sm:space-y-3 text-gray-400 text-xs sm:text-sm">
                            <li>
                                <a href="#" className="hover:text-white hover:translate-x-1 transition inline-block">
                                    الأسئلة الشائعة
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white hover:translate-x-1 transition inline-block">
                                    شروط الاستخدام
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white hover:translate-x-1 transition inline-block">
                                    سياسة الخصوصية
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white hover:translate-x-1 transition inline-block">
                                    تواصل معنا
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                        <h4 className="font-bold text-base sm:text-lg mb-5 sm:mb-6">تواصل معنا</h4>
                        <ul className="space-y-3 sm:space-y-4 text-gray-400 text-xs sm:text-sm">
                            <li className="flex items-start gap-3">
                                <i className="fa-solid fa-location-dot flex-shrink-0 mt-0.5 sm:mt-1 text-[#8B2525]"></i>
                                <span>{settings.address}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <i className="fa-solid fa-phone flex-shrink-0 text-[#8B2525]"></i>
                                <a href={`tel:${settings.phone}`} className="hover:text-white transition">
                                    {settings.phone}
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <i className="fa-solid fa-envelope flex-shrink-0 text-[#8B2525]"></i>
                                <a href={`mailto:${settings.email}`} className="hover:text-white transition">
                                    {settings.email}
                                </a>
                            </li>
                            {settings.whatsapp && (
                                <li className="flex items-center gap-3">
                                    <i className="fa-brands fa-whatsapp flex-shrink-0 text-green-500"></i>
                                    <a
                                        href={`https://wa.me/${settings.whatsapp}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="hover:text-white transition"
                                    >
                                        واتس آب
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Attribution Section */}
                <div className="py-8 sm:py-10 md:py-12 border-t border-gray-800 space-y-6 sm:space-y-8">
                    {/* Credits */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                        <div>
                            <h5 className="text-gray-300 font-semibold text-xs sm:text-sm mb-3 sm:mb-4">
                                🏗️ تطوير البرنامج
                            </h5>
                            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                                تم تطوير تطبيق غدوة بحب واهتمام باستخدام أحدث التقنيات.
                                <span className="text-gray-400 block mt-2">
                                    فريق التطوير: <span className="text-[#8B2525]">Ghadwa Development Team</span>
                                </span>
                            </p>
                        </div>
                        <div>
                            <h5 className="text-gray-300 font-semibold text-xs sm:text-sm mb-3 sm:mb-4">
                                🎨 التصميم و الفنون
                            </h5>
                            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                                تصميم واجهات المستخدم والعلامة التجارية من قبل فريق متخصص.
                                <span className="text-gray-400 block mt-2">
                                    الأيقونات: <span className="text-[#8B2525]">Font Awesome 6.4.0</span>
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Technologies Used */}
                    <div>
                        <h5 className="text-gray-300 font-semibold text-xs sm:text-sm mb-3 sm:mb-4">
                            ⚙️ التقنيات المستخدمة
                        </h5>
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                            {[
                                { name: 'React', icon: '⚛️' },
                                { name: 'TypeScript', icon: '📘' },
                                { name: 'Vite', icon: '⚡' },
                                { name: 'Tailwind CSS', icon: '🎨' },
                                { name: 'Supabase', icon: '🗄️' },
                                { name: 'Vercel', icon: '▲' },
                            ].map((tech) => (
                                <div
                                    key={tech.name}
                                    className="bg-gray-800 text-gray-300 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm flex items-center gap-1.5 hover:bg-gray-700 transition"
                                >
                                    <span>{tech.icon}</span>
                                    {tech.name}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Third-party Acknowledegments */}
                    <div>
                        <h5 className="text-gray-300 font-semibold text-xs sm:text-sm mb-3 sm:mb-4">
                            🙏 شكر وتقدير
                        </h5>
                        <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                            نشكر جميع الأدوات والمكتبات مفتوحة المصدر التي ساعدتنا في بناء هذا التطبيق.
                            شكر خاص لفريق مصر وجميع المساهمين في المشروع.
                        </p>
                    </div>
                </div>

                {/* Copyright & Legal */}
                <div className="pt-6 sm:pt-8 border-t border-gray-800">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
                        <div className="text-center sm:text-right text-gray-500 text-xs sm:text-sm">
                            <p>© {currentYear} Ghadwa. جميع الحقوق محفوظة.</p>
                            <p className="text-gray-600 text-xs mt-1 sm:mt-2">
                                Ghadwa &reg; هي علامة تجارية مسجلة في جمهورية مصر العربية
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center sm:justify-end gap-4 text-xs sm:text-sm">
                            <a href="#" className="text-gray-500 hover:text-white transition">
                                سياسة الخصوصية
                            </a>
                            <span className="text-gray-600">•</span>
                            <a href="#" className="text-gray-500 hover:text-white transition">
                                شروط الاستخدام
                            </a>
                            <span className="text-gray-600">•</span>
                            <a href="#" className="text-gray-500 hover:text-white transition">
                                الملفات الشخصية
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
