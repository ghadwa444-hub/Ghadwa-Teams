
import React, { useState, useRef } from 'react';
import { Chef, Order } from '../../types';
import { AdminFormModal } from '../Modals';
import { imageUploadService } from '../../services/imageUploadService';
import { validateChefForm, validateChefName, validateChefSpecialty, validateChefBio, validateWorkingHours, validateDeliveryTime } from '../../utils/validations';
import { supabase } from '../../services/supabase';

interface AdminChefsProps {
    chefs: Chef[];
    orders: Order[];
    toggleChefStatus: (id: number) => void;
    onAdd: (chef: Chef) => void;
    onEdit: (chef: Chef) => void;
    onDelete: (id: number) => void;
}

export const AdminChefs: React.FC<AdminChefsProps> = ({ chefs, orders, toggleChefStatus, onAdd, onEdit, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentChef, setCurrentChef] = useState<Chef | null>(null);
    const [formData, setFormData] = useState<any>({ name: '', specialty: '', bio: '', img: '', cover: '', workingHours: '', deliveryTime: '' });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
    const [profileImagePreview, setProfileImagePreview] = useState<string>('');
    const [coverImagePreview, setCoverImagePreview] = useState<string>('');
    const profileImageRef = useRef<HTMLInputElement>(null);
    const coverImageRef = useRef<HTMLInputElement>(null);

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };

    const clearForm = () => {
        setFormData({ name: '', specialty: '', bio: '', img: '', cover: '', workingHours: '', deliveryTime: '' });
        setFormErrors({});
        setProfileImagePreview('');
        setCoverImagePreview('');
        if (profileImageRef.current) profileImageRef.current.value = '';
        if (coverImageRef.current) coverImageRef.current.value = '';
    };

    const openAdd = () => {
        setCurrentChef(null);
        clearForm();
        setFormData({ ...formData, workingHours: '10:00 - 22:00', deliveryTime: '30 mins' });
        setIsModalOpen(true);
    };

    const openEdit = (chef: Chef) => {
        setCurrentChef(chef);
        setFormData(chef);
        setProfileImagePreview(chef.img || '');
        setCoverImagePreview(chef.cover || '');
        setFormErrors({});
        setIsModalOpen(true);
    };

    const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Show preview immediately
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfileImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleCoverImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Show preview immediately
        const reader = new FileReader();
        reader.onloadend = () => {
            setCoverImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate form
        const validation = validateChefForm({
            name: formData.name,
            specialty: formData.specialty,
            bio: formData.bio,
            workingHours: formData.workingHours,
            deliveryTime: formData.deliveryTime,
        });

        if (!validation.valid) {
            setFormErrors(validation.errors);
            showNotification('error', 'Please fix the errors below');
            return;
        }

        setIsLoading(true);
        setFormErrors({});

        try {
            let profileImageUrl = formData.img;
            let coverImageUrl = formData.cover;

            // Upload profile image if changed
            if (profileImageRef.current?.files?.[0]) {
                const uploadResult = await imageUploadService.uploadChefImage(
                    profileImageRef.current.files[0],
                    'profile'
                );
                if (!uploadResult.success) {
                    throw new Error(uploadResult.error || 'Failed to upload profile image');
                }
                profileImageUrl = uploadResult.url!;
            }

            // Upload cover image if changed
            if (coverImageRef.current?.files?.[0]) {
                const uploadResult = await imageUploadService.uploadChefImage(
                    coverImageRef.current.files[0],
                    'cover'
                );
                if (!uploadResult.success) {
                    throw new Error(uploadResult.error || 'Failed to upload cover image');
                }
                coverImageUrl = uploadResult.url!;
            }

            const chefData = {
                ...formData,
                img: profileImageUrl,
                cover: coverImageUrl,
            };

            if (currentChef) {
                // Update existing chef in database
                const { error } = await supabase
                    .from('chefs')
                    .update(chefData)
                    .eq('id', currentChef.id);

                if (error) throw error;
                onEdit({ ...currentChef, ...chefData });
                showNotification('success', 'Chef updated successfully! ✅');
            } else {
                // Add new chef to database
                const newChef = {
                    ...chefData,
                    id: Date.now(),
                    rating: 5.0,
                    reviews: 0,
                    orders: '0',
                    isOpen: true,
                    badges: [],
                };

                const { error } = await supabase
                    .from('chefs')
                    .insert([newChef]);

                if (error) throw error;
                onAdd(newChef);
                showNotification('success', 'Chef added successfully! ✅');
            }

            setIsModalOpen(false);
            clearForm();
        } catch (error) {
            console.error('Error saving chef:', error);
            showNotification('error', `Error: ${error instanceof Error ? error.message : 'Failed to save chef'}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            setIsLoading(true);
            const { error } = await supabase
                .from('chefs')
                .delete()
                .eq('id', id);

            if (error) throw error;
            onDelete(id);
            setDeleteConfirm(null);
            showNotification('success', 'Chef deleted successfully! 🗑️');
        } catch (error) {
            console.error('Error deleting chef:', error);
            showNotification('error', `Error: ${error instanceof Error ? error.message : 'Failed to delete chef'}`);
        } finally {
            setIsLoading(false);
        }
    };

    const getChefStats = (chefName: string) => {
        let orderCount = 0;
        let totalRevenue = 0;

        orders.forEach(order => {
            if (order.itemsDetails && Array.isArray(order.itemsDetails)) {
                const chefItems = order.itemsDetails.filter(item => item.chef === chefName);
                if (chefItems.length > 0) {
                    orderCount++;
                    const revenue = chefItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                    totalRevenue += revenue;
                }
            }
        });

        return { orderCount, totalRevenue };
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Notification Toast */}
            {notification && (
                <div className={`fixed top-4 right-4 px-6 py-3 rounded-xl font-bold text-white shadow-lg z-50 animate-bounce ${
                    notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                }`}>
                    {notification.message}
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            {deleteConfirm !== null && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-sm shadow-xl">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Chef?</h3>
                        <p className="text-gray-600 mb-6">This action cannot be undone. Are you sure?</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 bg-gray-200 text-gray-900 py-2 rounded-lg font-bold hover:bg-gray-300 transition"
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm)}
                                className="flex-1 bg-red-500 text-white py-2 rounded-lg font-bold hover:bg-red-600 transition disabled:opacity-50"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-900">إدارة الشيفات 👩‍🍳</h2>
                <button onClick={openAdd} className="bg-[#8B2525] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-[#6b1c1c] transition flex items-center gap-2">
                    <i className="fa-solid fa-plus"></i> إضافة شيف
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {chefs.map(chef => {
                    const stats = getChefStats(chef.name);
                    
                    return (
                        <div key={chef.id} className={`bg-white rounded-[2rem] border transition-all duration-300 ${chef.isOpen ? 'border-green-200 shadow-lg shadow-green-100/50' : 'border-gray-200 opacity-90' } overflow-hidden relative group hover:shadow-xl`}>
                             {/* Cover Image Area */}
                             <div className="h-32 w-full relative bg-gray-100">
                                <img src={chef.cover} alt={`${chef.name} cover`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                                
                                {/* Status Pill */}
                                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold backdrop-blur-md shadow-sm border flex items-center gap-1.5 ${
                                    chef.isOpen 
                                    ? 'bg-green-500/90 text-white border-green-400' 
                                    : 'bg-red-500/90 text-white border-red-400'
                                }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${chef.isOpen ? 'bg-white animate-pulse' : 'bg-white/50'}`}></span>
                                    {chef.isOpen ? 'مفتوح' : 'مغلق'}
                                </div>

                                {/* Delivery Time Badge */}
                                <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-bold text-gray-800 flex items-center gap-1 shadow-sm">
                                    <i className="fa-solid fa-motorcycle text-[#8B2525]"></i>
                                    {chef.deliveryTime}
                                </div>

                                {/* Action Buttons - Always Visible on Mobile, Hover on Desktop */}
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <button 
                                        type="button"
                                        onClick={() => openEdit(chef)} 
                                        className="w-8 h-8 rounded-full bg-white/90 backdrop-blur text-blue-600 flex items-center justify-center hover:bg-blue-500 hover:text-white shadow-sm transition-all"
                                        title="تعديل"
                                    >
                                        <i className="fa-solid fa-pen text-xs"></i>
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={(e) => { 
                                            e.stopPropagation(); 
                                            setDeleteConfirm(chef.id);
                                        }} 
                                        className="w-8 h-8 rounded-full bg-white/90 backdrop-blur text-red-600 flex items-center justify-center hover:bg-red-500 hover:text-white shadow-sm transition-all"
                                        title="حذف"
                                    >
                                        <i className="fa-solid fa-trash text-xs"></i>
                                    </button>
                                </div>
                             </div>
                            
                            <div className="p-6 pt-0 relative">
                                {/* Profile Image */}
                                <div className="flex justify-center -mt-10 mb-3">
                                     <div className="w-20 h-20 rounded-full p-1 bg-white shadow-lg">
                                        <img src={chef.img} alt={chef.name} className="w-full h-full object-cover rounded-full" />
                                     </div>
                                </div>
                                
                                <div className="text-center mb-4">
                                    <h3 className="font-bold text-xl text-gray-900">{chef.name}</h3>
                                    <p className="text-sm text-[#8B2525] font-medium bg-red-50 px-3 py-0.5 rounded-full inline-block mt-1">{chef.specialty}</p>
                                </div>
                                
                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100 text-center">
                                        <p className="text-[10px] text-gray-500 font-bold mb-1">الطلبات</p>
                                        <p className="font-black text-gray-900 text-lg">{stats.orderCount}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100 text-center">
                                        <p className="text-[10px] text-gray-500 font-bold mb-1">الأرباح</p>
                                        <p className="font-black text-[#8B2525] text-lg">{stats.totalRevenue}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100 mb-4">
                                    <div className="flex items-center gap-1"><i className="fa-regular fa-clock text-gray-400"></i> {chef.workingHours}</div>
                                </div>

                                <button 
                                    onClick={() => toggleChefStatus(chef.id)}
                                    className={`w-full py-2.5 rounded-xl font-bold text-sm text-white transition-all shadow-md ${chef.isOpen ? 'bg-red-500 hover:bg-red-600 shadow-red-200' : 'bg-green-500 hover:bg-green-600 shadow-green-200'}`}
                                >
                                     {chef.isOpen ? 'إغلاق المطبخ 🔒' : 'فتح المطبخ 🔓'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <AdminFormModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); clearForm(); }} title={currentChef ? "تعديل بيانات شيف" : "إضافة شيف جديد"} onSubmit={handleSubmit}>
                {/* Profile Image Upload */}
                <div className="space-y-2">
                    <label htmlFor="profile-img" className="block text-sm font-bold text-gray-700">صورة الملف الشخصي</label>
                    <div className="flex gap-4 items-center">
                        <input
                            id="profile-img"
                            ref={profileImageRef}
                            type="file"
                            accept="image/*"
                            onChange={handleProfileImageChange}
                            disabled={isLoading}
                            title="Select profile image"
                            className="flex-1 p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-900 text-sm"
                        />
                        {(profileImagePreview || formData.img) && (
                            <img
                                src={profileImagePreview || formData.img}
                                alt="Profile preview"
                                className="w-12 h-12 rounded-full object-cover border-2 border-gray-300"
                            />
                        )}
                    </div>
                    {formErrors.img && <p className="text-red-500 text-sm">{formErrors.img}</p>}
                </div>

                {/* Cover Image Upload */}
                <div className="space-y-2">
                    <label htmlFor="cover-img" className="block text-sm font-bold text-gray-700">صورة الغلاف</label>
                    <div className="flex gap-4">
                        <input
                            id="cover-img"
                            ref={coverImageRef}
                            type="file"
                            accept="image/*"
                            onChange={handleCoverImageChange}
                            disabled={isLoading}
                            title="Select cover image"
                            className="flex-1 p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-900 text-sm"
                        />
                        {(coverImagePreview || formData.cover) && (
                            <img
                                src={coverImagePreview || formData.cover}
                                alt="Cover preview"
                                className="w-20 h-12 rounded-lg object-cover border-2 border-gray-300"
                            />
                        )}
                    </div>
                    {formErrors.cover && <p className="text-red-500 text-sm">{formErrors.cover}</p>}
                </div>

                {/* Name */}
                <div className="space-y-1">
                    <input
                        type="text"
                        placeholder="اسم الشيف"
                        className={`w-full p-3 bg-gray-50 rounded-xl border ${formErrors.name ? 'border-red-500' : 'border-gray-200'} text-gray-900`}
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        disabled={isLoading}
                        required
                    />
                    {formErrors.name && <p className="text-red-500 text-sm">{formErrors.name}</p>}
                </div>

                {/* Specialty */}
                <div className="space-y-1">
                    <input
                        type="text"
                        placeholder="التخصص (مثلاً: محاشي)"
                        className={`w-full p-3 bg-gray-50 rounded-xl border ${formErrors.specialty ? 'border-red-500' : 'border-gray-200'} text-gray-900`}
                        value={formData.specialty}
                        onChange={e => setFormData({...formData, specialty: e.target.value})}
                        disabled={isLoading}
                        required
                    />
                    {formErrors.specialty && <p className="text-red-500 text-sm">{formErrors.specialty}</p>}
                </div>

                {/* Working Hours & Delivery Time */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <input
                            type="text"
                            placeholder="مواعيد العمل (مثلاً: 10:00 - 22:00)"
                            className={`w-full p-3 bg-gray-50 rounded-xl border ${formErrors.workingHours ? 'border-red-500' : 'border-gray-200'} text-gray-900 text-sm`}
                            value={formData.workingHours}
                            onChange={e => setFormData({...formData, workingHours: e.target.value})}
                            disabled={isLoading}
                            required
                        />
                        {formErrors.workingHours && <p className="text-red-500 text-xs">{formErrors.workingHours}</p>}
                    </div>
                    <div className="space-y-1">
                        <input
                            type="text"
                            placeholder="وقت التوصيل (مثلاً: 30 mins)"
                            className={`w-full p-3 bg-gray-50 rounded-xl border ${formErrors.deliveryTime ? 'border-red-500' : 'border-gray-200'} text-gray-900 text-sm`}
                            value={formData.deliveryTime}
                            onChange={e => setFormData({...formData, deliveryTime: e.target.value})}
                            disabled={isLoading}
                            required
                        />
                        {formErrors.deliveryTime && <p className="text-red-500 text-xs">{formErrors.deliveryTime}</p>}
                    </div>
                </div>

                {/* Bio */}
                <div className="space-y-1">
                    <textarea
                        placeholder="نبذة عن الشيف"
                        className={`w-full p-3 bg-gray-50 rounded-xl border ${formErrors.bio ? 'border-red-500' : 'border-gray-200'} text-gray-900 h-24 resize-none`}
                        value={formData.bio}
                        onChange={e => setFormData({...formData, bio: e.target.value})}
                        disabled={isLoading}
                        required
                    />
                    {formErrors.bio && <p className="text-red-500 text-sm">{formErrors.bio}</p>}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#8B2525] text-white py-3 rounded-xl font-bold hover:bg-[#6b1c1c] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <i className="fa-solid fa-spinner animate-spin"></i>
                            جاري الحفظ...
                        </span>
                    ) : currentChef ? 'تحديث البيانات' : 'إضافة الشيف'}
                </button>
            </AdminFormModal>
        </div>
    );
};
