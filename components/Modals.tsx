
import React, { useState } from 'react';
import { MENU_CATEGORIES } from '../constants';

// --- Auth Modal ---
interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: (type: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (email === 'admin@ghadwa.com' && password === 'admin123') {
            onLogin('admin');
            onClose();
        } else {
            // Simulate user login
            if (email && password.length > 3) {
                onLogin('user');
                onClose();
            } else {
                setError('بيانات الدخول غير صحيحة');
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden relative z-10 shadow-2xl animate-fade-in">
                <button onClick={onClose} className="absolute top-4 left-4 z-20 w-8 h-8 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center hover:bg-gray-200 transition">
                    <i className="fa-solid fa-xmark"></i>
                </button>

                <div className="p-8">
                    <div className="text-center mb-8">
                        <div className="w-12 h-12 bg-[#8B2525] rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3">غ</div>
                        <h2 className="text-2xl font-bold text-gray-900">تسجيل الدخول</h2>
                        <p className="text-sm text-gray-500 mt-1">لوحة تحكم المشرفين</p>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700">البريد الإلكتروني</label>
                            <input
                                type="text"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#8B2525] focus:ring-0 outline-none transition-all"
                                placeholder="admin@ghadwa.com"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700">كلمة المرور</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#8B2525] focus:ring-0 outline-none transition-all"
                                placeholder="********"
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm font-bold text-center bg-red-50 p-2 rounded-lg">{error}</p>}

                        <button type="submit" className="w-full bg-[#8B2525] text-white py-3.5 rounded-xl font-bold hover:bg-[#6b1c1c] transition-colors shadow-lg shadow-red-900/10 mt-6">
                            تسجيل الدخول
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

// --- Menu Modal ---
interface MenuModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const MenuModal: React.FC<MenuModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const handleDownload = (type: string) => {
        if (type === 'الفطار') {
            const imageUrl = "https://image2url.com/images/1765149343717-4cf47d9b-cdaa-4ac1-a284-8a0baceb63a7.png"; // Placeholder link from original code
            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = 'منيو-غدوة-فطار.jpg';
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            alert(`جاري تحميل منيو ${type}... 📥`);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white w-full max-w-sm rounded-2xl overflow-hidden relative z-10 p-6 text-center animate-fade-in shadow-2xl">
                <button onClick={onClose} className="absolute top-4 left-4 z-20 w-8 h-8 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center hover:bg-gray-200 transition">
                    <i className="fa-solid fa-xmark"></i>
                </button>

                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#8B2525] text-2xl">
                    <i className="fa-solid fa-image"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">تحميل المنيو</h3>
                <p className="text-gray-500 text-sm mb-6">اختار المنيو اللي حابب تشوفه وتحمله</p>

                <div className="space-y-3">
                    <button onClick={() => handleDownload('الفطار')} className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-[#8B2525] hover:bg-red-50 transition group">
                        <div className="flex items-center gap-3">
                            <span className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center text-xl">🥐</span>
                            <span className="font-bold text-gray-900">منيو الفطار</span>
                        </div>
                        <i className="fa-solid fa-download text-gray-400 group-hover:text-[#8B2525]"></i>
                    </button>
                    <button onClick={() => handleDownload('الغداء')} className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-[#8B2525] hover:bg-red-50 transition group">
                        <div className="flex items-center gap-3">
                            <span className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-xl">🍗</span>
                            <span className="font-bold text-gray-900">منيو الغداء</span>
                        </div>
                        <i className="fa-solid fa-download text-gray-400 group-hover:text-[#8B2525]"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Chef Conflict Modal ---
interface ChefConflictModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    currentChef: string | null;
    newChef?: string;
}

export const ChefConflictModal: React.FC<ChefConflictModalProps> = ({ isOpen, onClose, onConfirm, currentChef, newChef }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full relative z-10 shadow-xl animate-fade-in text-center border border-gray-100">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                    ⚠️
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">تغيير الشيف؟</h3>
                <p className="text-gray-500 mb-6 text-sm leading-relaxed">
                    سلتك فيها أكل من <strong className="text-gray-900">{currentChef}</strong>. عشان تطلب من <strong className="text-gray-900">{newChef}</strong> لازم نفضي السلة الأول.
                </p>
                <div className="flex gap-3">
                    <button onClick={onConfirm} className="flex-1 bg-[#8B2525] text-white py-3 rounded-xl font-bold hover:bg-[#6b1c1c] transition shadow-lg shadow-red-900/20">
                        ابدأ سلة جديدة
                    </button>
                    <button onClick={onClose} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition">
                        خلي سلتك زي ما هي
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Clear Cart Modal ---
interface ClearCartModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const ClearCartModal: React.FC<ClearCartModalProps> = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full relative z-10 shadow-xl animate-fade-in text-center border border-gray-100">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl text-red-600">
                    <i className="fa-solid fa-trash-can"></i>
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">إفراغ السلة؟</h3>
                <p className="text-gray-500 mb-6 text-sm">
                    هل أنت متأكد أنك تريد حذف جميع المنتجات من السلة؟ لا يمكن التراجع عن هذا الإجراء.
                </p>
                <div className="flex gap-3">
                    <button onClick={onConfirm} className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition shadow-lg shadow-red-900/20">
                        نعم، إفراغ السلة
                    </button>
                    <button onClick={onClose} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition">
                        إلغاء
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Order Success Modal ---
interface OrderSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderId: number | null;
    onTrack: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ isOpen, onClose, orderId, onTrack }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="bg-white w-full max-w-sm rounded-[2rem] p-8 relative z-10 shadow-2xl animate-fade-in-up text-center transform transition-all border border-white/20">
                <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center text-5xl mx-auto mb-6 shadow-sm relative">
                    <i className="fa-solid fa-check relative z-10"></i>
                    <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20"></div>
                </div>

                <h3 className="font-black text-2xl text-gray-900 mb-3">تم الطلب بنجاح! 🥳</h3>

                <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                    شكراً لثقتك في غدوة ❤️<br />
                    طلبك رقم <span className="font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded mx-1">#{orderId}</span> وصل للشيف.<br />
                    تقدر تتابع حالة الطلب دلوقتي.
                </p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={onTrack}
                        className="w-full bg-[#8B2525] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-[#6b1c1c] transition-all active:scale-95"
                    >
                        تتبع الطلب 🛵
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all"
                    >
                        متابعة التسوق
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Admin Form Modal ---
interface AdminFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    onSubmit: (e: React.FormEvent) => void;
    children: React.ReactNode;
}

export const AdminFormModal: React.FC<AdminFormModalProps> = ({ isOpen, onClose, title, onSubmit, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden relative z-10 shadow-2xl animate-fade-in">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-xl text-gray-900">{title}</h3>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-white text-gray-500 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition">
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <form onSubmit={onSubmit} className="p-6 space-y-4">
                    {children}
                    <div className="pt-4 flex gap-3">
                        <button type="submit" className="flex-1 bg-[#8B2525] text-white py-3 rounded-xl font-bold hover:bg-[#6b1c1c] transition">
                            حفظ البيانات
                        </button>
                        <button type="button" onClick={onClose} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition">
                            إلغاء
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
