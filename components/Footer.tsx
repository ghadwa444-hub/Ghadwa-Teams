
import React from 'react';
import { ContactSettings } from '../types';

interface FooterProps {
    contactSettings?: ContactSettings;
}

export const Footer: React.FC<FooterProps> = ({ contactSettings }) => {
    // Default fallback if not yet loaded
    const settings = contactSettings || {
        phone: "01000000000",
        email: "hello@ghadwa.com",
        address: "المعادي، القاهرة، مصر",
        facebookUrl: "#",
        instagramUrl: "#",
        tiktokUrl: "#"
    };

    return (
        <footer className="bg-gray-900 text-white pt-20 pb-10 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-[#8B2525] rounded-full flex items-center justify-center font-bold text-xl">غ</div>
                            <span className="font-bold text-2xl">غدوة</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            أول منصة مصرية بتجمع ستات البيوت الشاطرة في مكان واحد. 
                            هدفنا نوصلك أكل بيتي نضيف وطعمه زي أكل ماما.
                        </p>
                        <div className="flex gap-4">
                            <a href={settings.facebookUrl} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#8B2525] hover:text-white transition"><i className="fa-brands fa-facebook-f"></i></a>
                            <a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#8B2525] hover:text-white transition"><i className="fa-brands fa-instagram"></i></a>
                            <a href={settings.tiktokUrl} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#8B2525] hover:text-white transition"><i className="fa-brands fa-tiktok"></i></a>
                        </div>
                    </div>
                    
                    <div>
                        <h4 className="font-bold text-lg mb-6">روابط سريعة</h4>
                        <ul className="space-y-3 text-gray-400 text-sm">
                            <li><a href="#" className="hover:text-white transition">عن غدوة</a></li>
                            <li><a href="#" className="hover:text-white transition">الشيفات</a></li>
                            <li><a href="#" className="hover:text-white transition">المنيو</a></li>
                            <li><a href="#" className="hover:text-white transition">العروض</a></li>
                            <li><a href="#" className="hover:text-white transition">انضمي كشيف</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-6">المساعدة</h4>
                        <ul className="space-y-3 text-gray-400 text-sm">
                            <li><a href="#" className="hover:text-white transition">الأسئلة الشائعة</a></li>
                            <li><a href="#" className="hover:text-white transition">شروط الاستخدام</a></li>
                            <li><a href="#" className="hover:text-white transition">سياسة الخصوصية</a></li>
                            <li><a href="#" className="hover:text-white transition">تواصل معنا</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-6">تواصل معنا</h4>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li className="flex items-start gap-3">
                                <i className="fa-solid fa-location-dot mt-1 text-[#8B2525]"></i>
                                <span>{settings.address}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <i className="fa-solid fa-phone text-[#8B2525]"></i>
                                <span>{settings.phone}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <i className="fa-solid fa-envelope text-[#8B2525]"></i>
                                <span>{settings.email}</span>
                            </li>
                        </ul>
                    </div>
                </div>
                
                <div className="pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
                    <p>© 2024 Ghadwa. جميع الحقوق محفوظة.</p>
                </div>
            </div>
        </footer>
    );
};
