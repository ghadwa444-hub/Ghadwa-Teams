
import React, { useState, useEffect } from 'react';
import { ContactSettings } from '../../types';
import { supabase } from '../../services/supabase';

interface AdminContactSettingsProps {
    settings: ContactSettings;
    onUpdate: (settings: ContactSettings) => void;
}

export const AdminContactSettings: React.FC<AdminContactSettingsProps> = ({ settings, onUpdate }) => {
    // Default values for contact settings
    const defaultSettings: ContactSettings = {
        phone: '201109318581',
        whatsapp: '201109318581',
        email: 'ghadwa444@gmail.com',
        address: 'طنطا، مصر',
        facebook: '',
        instagram: '',
        linkedin: '',
        working_hours: 'السبت - الخميس: 10 ص - 11 م\nالجمعة: مغلق'
    };

    // Merge settings with defaults (defaults only used if setting is empty)
    const mergedSettings: ContactSettings = {
        ...defaultSettings,
        ...settings,
        // Only override defaults if settings have actual values
        phone: settings?.phone || defaultSettings.phone,
        whatsapp: settings?.whatsapp || defaultSettings.whatsapp,
        email: settings?.email || defaultSettings.email,
        address: settings?.address || defaultSettings.address,
        working_hours: settings?.working_hours || defaultSettings.working_hours,
        facebook: settings?.facebook || defaultSettings.facebook,
        instagram: settings?.instagram || defaultSettings.instagram,
        linkedin: settings?.linkedin || defaultSettings.linkedin,
        id: settings?.id
    };

    const [formData, setFormData] = useState<ContactSettings>(mergedSettings);
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    // Load settings when component mounts or settings prop changes
    useEffect(() => {
        const merged = {
            ...defaultSettings,
            ...settings,
            phone: settings?.phone || defaultSettings.phone,
            whatsapp: settings?.whatsapp || defaultSettings.whatsapp,
            email: settings?.email || defaultSettings.email,
            address: settings?.address || defaultSettings.address,
            working_hours: settings?.working_hours || defaultSettings.working_hours,
            facebook: settings?.facebook || defaultSettings.facebook,
            instagram: settings?.instagram || defaultSettings.instagram,
            linkedin: settings?.linkedin || defaultSettings.linkedin,
            id: settings?.id
        };
        setFormData(merged);
    }, [settings]);
    
    // Also try to load settings directly from database when component mounts
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const { data, error } = await supabase
                    .from('contact_settings')
                    .select('*')
                    .limit(1)
                    .single();
                
                if (!error && data) {
                    const merged = {
                        ...defaultSettings,
                        ...data,
                        phone: data.phone || defaultSettings.phone,
                        whatsapp: data.whatsapp || defaultSettings.whatsapp,
                        email: data.email || defaultSettings.email,
                        address: data.address || defaultSettings.address,
                        working_hours: data.working_hours || defaultSettings.working_hours,
                        facebook: data.facebook || defaultSettings.facebook,
                        instagram: data.instagram || defaultSettings.instagram,
                        linkedin: data.linkedin || defaultSettings.linkedin
                    };
                    setFormData(merged as ContactSettings);
                    onUpdate(merged as ContactSettings);
                } else {
                    // If no settings found, use defaults
                    setFormData(defaultSettings);
                }
            } catch (err) {
                console.error('Failed to load settings:', err);
                // On error, use defaults
                setFormData(defaultSettings);
            }
        };
        
        // Only load if we don't have settings with id
        if (!settings?.id) {
            loadSettings();
        }
    }, []); // Run once on mount

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const settingsData = {
                phone: formData.phone || null,
                email: formData.email || null,
                address: formData.address || null,
                whatsapp: formData.whatsapp || null,
                instagram: formData.instagram || null,
                facebook: formData.facebook || null,
                linkedin: formData.linkedin || null,
                working_hours: formData.working_hours || null
            };

            if (formData.id) {
                // Update existing settings
                const { data, error } = await supabase
                    .from('contact_settings')
                    .update(settingsData)
                    .eq('id', formData.id)
                    .select()
                    .single();

                if (error) throw error;
                if (data) {
                    const updatedSettings: ContactSettings = { ...data };
                    onUpdate(updatedSettings);
                }
                showNotification('success', 'تم تحديث الإعدادات بنجاح! ✅');
            } else {
                // Insert new settings (shouldn't happen often, but handle it)
                const { data, error } = await supabase
                    .from('contact_settings')
                    .insert([settingsData])
                    .select()
                    .single();

                if (error) throw error;
                if (data) {
                    const newSettings: ContactSettings = { ...data };
                    setFormData(newSettings);
                    onUpdate(newSettings);
                }
                showNotification('success', 'تم حفظ الإعدادات بنجاح! ✅');
            }
        } catch (error) {
            console.error('Error saving contact settings:', error);
            showNotification('error', `خطأ: ${error instanceof Error ? error.message : 'فشل حفظ الإعدادات'}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            {notification && (
                <div className={`fixed top-4 right-4 px-6 py-3 rounded-xl font-bold text-white shadow-lg z-50 animate-bounce ${
                    notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                }`}>
                    {notification.message}
                </div>
            )}
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
                                value={formData.phone || ''}
                                onChange={handleChange}
                                disabled={isLoading}
                                placeholder="20xxxxxxxxxx"
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#8B2525] focus:ring-0 outline-none transition-all disabled:opacity-50"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700">رقم الواتساب</label>
                            <input
                                type="text"
                                name="whatsapp"
                                value={formData.whatsapp || ''}
                                onChange={handleChange}
                                disabled={isLoading}
                                placeholder="20xxxxxxxxxx"
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#8B2525] focus:ring-0 outline-none transition-all disabled:opacity-50"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700">البريد الإلكتروني</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email || ''}
                                onChange={handleChange}
                                disabled={isLoading}
                                placeholder="info@example.com"
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#8B2525] focus:ring-0 outline-none transition-all disabled:opacity-50"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700">العنوان</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address || ''}
                                onChange={handleChange}
                                disabled={isLoading}
                                placeholder="الحي - المدينة"
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#8B2525] focus:ring-0 outline-none transition-all disabled:opacity-50"
                            />
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6">
                        <h3 className="font-bold text-lg text-gray-900 mb-4">روابط وساعات العمل</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700">Facebook</label>
                                <input
                                    type="text"
                                    name="facebook"
                                    value={formData.facebook || ''}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    placeholder="رابط صفحة الفيسبوك"
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#8B2525] focus:ring-0 outline-none transition-all disabled:opacity-50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700">Instagram</label>
                                <input
                                    type="text"
                                    name="instagram"
                                    value={formData.instagram || ''}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    placeholder="رابط حسابنا على إنستجرام"
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#8B2525] focus:ring-0 outline-none transition-all disabled:opacity-50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700">LinkedIn</label>
                                <input
                                    type="text"
                                    name="linkedin"
                                    value={formData.linkedin || ''}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    placeholder="رابط صفحة LinkedIn"
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#8B2525] focus:ring-0 outline-none transition-all disabled:opacity-50"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700">ساعات العمل</label>
                            <textarea
                                name="working_hours"
                                value={formData.working_hours || ''}
                                onChange={handleChange}
                                disabled={isLoading}
                                placeholder="مثال: السبت - الخميس: 10 ص - 11 م&#10;الجمعة: مغلق"
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#8B2525] focus:ring-0 outline-none transition-all h-24 disabled:opacity-50"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="bg-[#8B2525] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#6b1c1c] transition shadow-lg shadow-red-900/10 disabled:opacity-50"
                        >
                            {isLoading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
