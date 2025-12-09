
import React from 'react';

interface AdminSidebarProps {
    activePage: string;
    onNavigate: (page: string) => void;
    onLogout: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ activePage, onNavigate, onLogout }) => (
    <div className="hidden md:flex w-64 bg-gray-900 text-white min-h-screen fixed right-0 top-0 z-50 flex-col shadow-2xl">
        <div className="p-8 border-b border-gray-800 flex items-center gap-3">
             <div className="w-10 h-10 bg-[#8B2525] rounded-full flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-red-900/50">غ</div>
             <div>
                <span className="font-bold text-xl block">لوحة التحكم</span>
                <span className="text-xs text-gray-400">Ghadwa Admin</span>
             </div>
        </div>
        <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto">
            <button onClick={() => onNavigate('admin-dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${activePage === 'admin-dashboard' ? 'bg-[#8B2525] text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                <i className="fa-solid fa-chart-pie w-5"></i> الرئيسية
            </button>
            <button onClick={() => onNavigate('admin-orders')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${activePage.startsWith('admin-order') ? 'bg-[#8B2525] text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                <i className="fa-solid fa-list-check w-5"></i> الطلبات
            </button>
            <button onClick={() => onNavigate('admin-meals')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${activePage === 'admin-meals' ? 'bg-[#8B2525] text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                <i className="fa-solid fa-utensils w-5"></i> الوجبات
            </button>
            <button onClick={() => onNavigate('admin-chefs')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${activePage === 'admin-chefs' ? 'bg-[#8B2525] text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                <i className="fa-solid fa-users w-5"></i> الشيفات
            </button>
            <button onClick={() => onNavigate('admin-offers')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${activePage === 'admin-offers' ? 'bg-[#8B2525] text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                <i className="fa-solid fa-tags w-5"></i> العروض
            </button>
            <button onClick={() => onNavigate('admin-boxes')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${activePage === 'admin-boxes' ? 'bg-[#8B2525] text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                <i className="fa-solid fa-box-open w-5"></i> البوكسات
            </button>
            <button onClick={() => onNavigate('admin-promos')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${activePage === 'admin-promos' ? 'bg-[#8B2525] text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                <i className="fa-solid fa-ticket w-5"></i> الكوبونات
            </button>
            <button onClick={() => onNavigate('admin-bestsellers')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${activePage === 'admin-bestsellers' ? 'bg-[#8B2525] text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                <i className="fa-solid fa-star w-5"></i> الأكثر مبيعاً
            </button>
            <button onClick={() => onNavigate('admin-settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${activePage === 'admin-settings' ? 'bg-[#8B2525] text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                <i className="fa-solid fa-gear w-5"></i> الإعدادات
            </button>
        </nav>
        <div className="p-4 border-t border-gray-800">
             <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-900/20 transition-colors font-bold">
                <i className="fa-solid fa-right-from-bracket"></i> تسجيل خروج
            </button>
        </div>
    </div>
);
