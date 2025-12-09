
import React, { useState, useEffect } from 'react';
import { ContactSettings } from '../../types';

interface AdminContactSettingsProps {
    settings: ContactSettings;
    onUpdate: (settings: ContactSettings) => void;
}

export const AdminContactSettings: React.FC<AdminContactSettingsProps> = ({ settings, onUpdate }) => {
    const [formData, setFormData] = useState<ContactSettings>(settings);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        setFormData(settings);
    }, [settings]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdate(formData);
        setSuccessMessage('تم تحديث الإعدادات بنجاح ✅');
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-900">إعدادات التواصل ⚙️</h2>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700">رقم الهاتف</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#8B2525] focus:ring-0 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700">رقم الواتساب (بدون +)</label>
                            <input
                                type="text"
                                name="whatsapp"
                                value={formData.whatsapp}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#8B2525] focus:ring-0 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700">البريد الإلكتروني</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#8B2525] focus:ring-0 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700">العنوان</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#8B2525] focus:ring-0 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6">
                        <h3 className="font-bold text-lg text-gray-900 mb-4">روابط السوشيال ميديا</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700">Facebook URL</label>
                                <input
                                    type="text"
                                    name="facebookUrl"
                                    value={formData.facebookUrl}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#8B2525] focus:ring-0 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                {/* Changed label to LinkedIn */}
                                <label className="block text-sm font-bold text-gray-700">LinkedIn URL</label>
                                <input
                                    type="text"
                                    name="instagramUrl"
                                    value={formData.instagramUrl}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#8B2525] focus:ring-0 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700">TikTok URL</label>
                                <input
                                    type="text"
                                    name="tiktokUrl"
                                    value={formData.tiktokUrl}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#8B2525] focus:ring-0 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button type="submit" className="bg-[#8B2525] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#6b1c1c] transition shadow-lg shadow-red-900/10">
                            حفظ التغييرات
                        </button>
                        {successMessage && <span className="mr-4 text-green-600 font-bold animate-fade-in">{successMessage}</span>}
                    </div>
                </form>
            </div>
        </div>
    );
};
