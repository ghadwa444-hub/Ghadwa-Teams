
import React, { useState, useEffect } from 'react';
import { ContactSettings } from '../types';

interface NavbarProps {
    onNavigate: (page: string) => void;
    currentPage: string;
    cartCount: number;
    favoritesCount: number;
    onOpenCart: () => void;
    onOpenAuth: () => void;
    onOpenMenu: () => void;
    isLoggedIn: boolean;
    onLogout: () => void;
    isAdmin: boolean;
    contactSettings?: ContactSettings;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage, cartCount, favoritesCount, onOpenCart, onOpenAuth, onOpenMenu, isLoggedIn, onLogout, isAdmin, contactSettings }) => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const whatsappNumber = contactSettings?.whatsapp || "201109318581";

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSectionClick = (e: React.MouseEvent, sectionId: string) => {
        e.preventDefault();
        if (currentPage !== 'home') {
            onNavigate('home');
            setTimeout(() => {
                const el = document.getElementById(sectionId);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            const el = document.getElementById(sectionId);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-white border border-gray-100 flex items-center justify-center">
                        <img src="/favicon/android-chrome-512x512.png" alt="شعار غدوة" className="w-full h-full object-contain" />
                    </div>
                    <span className={`text-2xl font-bold ${scrolled ? 'text-gray-900' : 'text-gray-900'} font-cairo`}>غدوة</span>
                </div>
                <div className="hidden md:flex items-center gap-8">
                    <button onClick={() => onNavigate('home')} className={`font-bold hover:text-[#8B2525] transition ${currentPage === 'home' ? 'text-[#8B2525]' : 'text-gray-600'}`}>الرئيسية</button>
                    <a href="#chefs" onClick={(e) => handleSectionClick(e, 'chefs')} className="font-bold text-gray-600 hover:text-[#8B2525] transition">الشيفات</a>
                    <a href="#weekly-offers" onClick={(e) => handleSectionClick(e, 'weekly-offers')} className="font-bold text-gray-600 hover:text-[#8B2525] transition">العروض</a>
                    <button onClick={onOpenMenu} className="font-bold text-gray-600 hover:text-[#8B2525] transition">المنيو</button>
                    <button onClick={() => onNavigate('track-order')} className={`font-bold hover:text-[#8B2525] transition ${currentPage === 'track-order' ? 'text-[#8B2525]' : 'text-gray-600'}`}>تتبع طلبك</button>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={() => onNavigate('favorites')} className="relative w-12 h-12 bg-white border border-gray-200 shadow-md rounded-full flex items-center justify-center hover:bg-[#8B2525] hover:text-white hover:border-[#8B2525] transition-all duration-300 group">
                        <i className="fa-regular fa-heart text-xl text-gray-700 group-hover:text-white transition-colors"></i>
                        {favoritesCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#8B2525] group-hover:bg-white group-hover:text-[#8B2525] text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white transition">
                                {favoritesCount}
                            </span>
                        )}
                    </button>

                    <button onClick={onOpenCart} className="relative w-12 h-12 bg-white border border-gray-200 shadow-md rounded-full flex items-center justify-center hover:bg-[#8B2525] hover:text-white hover:border-[#8B2525] transition-all duration-300 group">
                        <i className="fa-solid fa-basket-shopping text-xl text-gray-700 group-hover:text-white transition-colors"></i>
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#8B2525] group-hover:bg-white group-hover:text-[#8B2525] text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white transition">
                                {cartCount}
                            </span>
                        )}
                    </button>

                    {isLoggedIn ? (
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-[#8B2525] font-bold border border-gray-200">
                                <i className="fa-solid fa-user"></i>
                            </div>
                            {isAdmin && (
                                <button onClick={() => onNavigate('admin-dashboard')} className="text-xs bg-gray-900 text-white px-3 py-1 rounded-full hover:bg-black transition">
                                    لوحة التحكم
                                </button>
                            )}
                            <button onClick={onLogout} className="text-xs text-gray-500 underline hover:text-red-500">خروج</button>
                        </div>
                    ) : (
                        <a
                            href={`https://wa.me/${whatsappNumber}`}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-green-500 text-white px-5 py-2.5 rounded-full font-bold hover:bg-green-600 transition shadow-lg shadow-green-500/20 text-sm hidden md:flex items-center gap-2"
                        >
                            <i className="fa-brands fa-whatsapp text-lg"></i>
                            تواصل معنا
                        </a>
                    )}

                    <button className="md:hidden text-gray-900 text-2xl" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
                    </button>
                </div>
            </div>
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-lg py-4 px-4 flex flex-col gap-4 animate-fade-in">
                    <button onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }} className="text-right font-bold text-gray-700 py-2 border-b border-gray-50">الرئيسية</button>
                    <button onClick={(e) => { handleSectionClick(e, 'chefs'); setMobileMenuOpen(false); }} className="text-right font-bold text-gray-700 py-2 border-b border-gray-50">الشيفات</button>
                    <button onClick={(e) => { handleSectionClick(e, 'weekly-offers'); setMobileMenuOpen(false); }} className="text-right font-bold text-gray-700 py-2 border-b border-gray-50">العروض</button>
                    <button onClick={() => { onOpenMenu(); setMobileMenuOpen(false); }} className="text-right font-bold text-gray-700 py-2 border-b border-gray-50">المنيو</button>
                    <button onClick={() => { onNavigate('track-order'); setMobileMenuOpen(false); }} className="text-right font-bold text-gray-700 py-2 border-b border-gray-50">تتبع طلبك</button>
                    <button onClick={() => { onNavigate('favorites'); setMobileMenuOpen(false); }} className="text-right font-bold text-gray-700 py-2 border-b border-gray-50">المفضلة</button>
                    {!isLoggedIn && (
                        <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer" className="text-right font-bold text-green-500 py-2 border-b border-gray-50 flex items-center gap-2">
                            <i className="fa-brands fa-whatsapp"></i> تواصل معنا
                        </a>
                    )}
                    {isLoggedIn && isAdmin && <button onClick={() => { onNavigate('admin-dashboard'); setMobileMenuOpen(false); }} className="text-right font-bold text-gray-900 py-2 border-b border-gray-50">لوحة التحكم</button>}
                    {isLoggedIn && <button onClick={() => { onLogout(); setMobileMenuOpen(false); }} className="text-right font-bold text-red-500 py-2 border-b border-gray-50">تسجيل خروج</button>}
                </div>
            )}
        </nav>
    );
};
