
import React, { useState, useRef } from 'react';
import { Chef, Order } from '../../types';
import { AdminFormModal } from '../Modals';
import { imageUploadService } from '../../services/imageUploadService';
import { api } from '../../services/api';
import { logger } from '../../utils/logger';

interface AdminChefsProps {
    chefs: Chef[];
    orders: Order[];
    toggleChefStatus: (id: string) => void;
    onAdd: (chef: Chef) => void;
    onEdit: (chef: Chef) => void;
    onDelete: (id: string) => void;
}

export const AdminChefs: React.FC<AdminChefsProps> = ({ chefs, orders, toggleChefStatus, onAdd, onEdit, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentChef, setCurrentChef] = useState<Chef | null>(null);
    const [formData, setFormData] = useState<any>({ name: '', specialty: '', bio: '', img: '' });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [profileImagePreview, setProfileImagePreview] = useState<string>('');
    const profileImageRef = useRef<HTMLInputElement>(null);

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };

    const clearForm = () => {
        setFormData({ name: '', specialty: '', bio: '', img: '' });
        setFormErrors({});
        setProfileImagePreview('');
        if (profileImageRef.current) profileImageRef.current.value = '';
    };

    const openAdd = () => {
        setCurrentChef(null);
        clearForm();
        setIsModalOpen(true);
    };

    const openEdit = (chef: Chef) => {
        setCurrentChef(chef);
        setFormData({
            name: chef.chef_name,
            specialty: chef.specialty || '',
            bio: chef.description || '',
            img: chef.image_url || '',
        });
        setProfileImagePreview(chef.image_url || '');
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate form - only validate required fields
        if (!formData.name || formData.name.trim().length < 2) {
            setFormErrors({ name: 'اسم الشيف مطلوب (حد أدنى حرفين)' });
            showNotification('error', 'Please fix the errors below');
            return;
        }

        setIsLoading(true);
        setFormErrors({});

        try {
            let profileImageUrl = formData.img || '';

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

            // Map form data to actual database schema
            const chefData = {
                chef_name: formData.name.trim(),
                specialty: formData.specialty?.trim() || null,
                description: formData.bio?.trim() || null,
                image_url: profileImageUrl || null,
                is_active: true,
                rating: 5.0,
            };

            if (currentChef) {
                // Update existing chef via API (sanitizes payload)
                const updatedChef: Chef = {
                    id: currentChef.id,
                    chef_name: chefData.chef_name,
                    specialty: chefData.specialty || '',
                    description: chefData.description || '',
                    image_url: chefData.image_url || '',
                    is_active: chefData.is_active,
                    rating: chefData.rating,
                };
                
                const success = await api.updateChef(updatedChef);
                if (!success) {
                    throw new Error('Failed to update chef');
                }
                
                onEdit(updatedChef);
                logger.info('ADMIN_CHEFS', '✏️ Chef updated successfully', { chefId: currentChef.id, chefName: chefData.chef_name });
                showNotification('success', 'Chef updated successfully! ✅');
            } else {
                // Add new chef via API (sanitizes payload)
                const newChef: Chef = {
                    id: '', // Will be generated by DB
                    chef_name: chefData.chef_name,
                    specialty: chefData.specialty || '',
                    description: chefData.description || '',
                    image_url: chefData.image_url || '',
                    is_active: chefData.is_active,
                    rating: chefData.rating,
                };
                
                const success = await api.addChef(newChef);
                if (!success) {
                    throw new Error('Failed to add chef');
                }
                
                // Note: API returns success but not the new chef object with ID
                // In production, you'd return the created chef from the API
                logger.info('ADMIN_CHEFS', '➕ Chef added successfully', { chefName: chefData.chef_name });
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

    const handleDelete = async (id: string) => {
        try {
            setIsLoading(true);
            const success = await api.deleteChef(id);
            if (!success) {
                throw new Error('Failed to delete chef');
            }
            onDelete(id);
            setDeleteConfirm(null);
            logger.info('ADMIN_CHEFS', '🗑️ Chef deleted successfully', { chefId: id });
            showNotification('success', 'Chef deleted successfully! 🗑️');
        } catch (error) {
            console.error('Error deleting chef:', error);
            showNotification('error', `Error: ${error instanceof Error ? error.message : 'Failed to delete chef'}`);
        } finally {
            setIsLoading(false);
        }
    };

    const getChefStats = (_chefName: string) => {
        // Stats will be calculated from orders table when properly linked
        // For now return placeholder values
        return { orderCount: 0, totalRevenue: 0 };
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
                    const stats = getChefStats(chef.chef_name);
                    
                    return (
                        <div key={chef.id} className={`bg-white rounded-[2rem] border transition-all duration-300 ${chef.is_active ? 'border-green-200 shadow-lg shadow-green-100/50' : 'border-gray-200 opacity-90' } overflow-hidden relative group hover:shadow-xl`}>
                             {/* Profile Image Area */}
                             <div className="h-32 w-full relative bg-gray-100">
                                <img src={chef.image_url || '/placeholder.jpg'} alt={`${chef.chef_name} profile`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                                
                                {/* Status Pill */}
                                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold backdrop-blur-md shadow-sm border flex items-center gap-1.5 ${
                                    chef.is_active 
                                    ? 'bg-green-500/90 text-white border-green-400' 
                                    : 'bg-red-500/90 text-white border-red-400'
                                }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${chef.is_active ? 'bg-white animate-pulse' : 'bg-white/50'}`}></span>
                                    {chef.is_active ? 'مفتوح' : 'مغلق'}
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
                                        <img src={chef.image_url || '/placeholder.jpg'} alt={chef.chef_name} className="w-full h-full object-cover rounded-full" />
                                     </div>
                                </div>
                                
                                <div className="text-center mb-4">
                                    <h3 className="font-bold text-xl text-gray-900">{chef.chef_name}</h3>
                                    <p className="text-sm text-[#8B2525] font-medium bg-red-50 px-3 py-0.5 rounded-full inline-block mt-1">{chef.specialty}</p>
                                </div>
                                
                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    {(() => {
                                        // Calculate chef stats from orders
                                        // Filter orders by chef_id - handle both string and null cases
                                        let matchCount = 0;
                                        const chefOrders = orders.filter(o => {
                                            // Check if order has chef_id and it matches chef.id
                                            if (!o.chef_id || !chef.id) {
                                                // Debug: log orders without chef_id
                                                if (!o.chef_id && orders.indexOf(o) < 3) {
                                                    console.log(`Order ${o.id} has no chef_id`);
                                                }
                                                return false;
                                            }
                                            // Normalize both IDs for comparison (remove whitespace, convert to lowercase)
                                            const orderChefId = String(o.chef_id).trim().toLowerCase();
                                            const chefId = String(chef.id).trim().toLowerCase();
                                            const matches = orderChefId === chefId;
                                            
                                            // Debug: log first few matches
                                            if (matches) {
                                                matchCount++;
                                                if (matchCount <= 3) {
                                                    console.log(`Order ${o.id} matches chef ${chef.chef_name}:`, {
                                                        orderChefId,
                                                        chefId,
                                                        orderTotal: o.total_amount || o.total
                                                    });
                                                }
                                            }
                                            
                                            return matches;
                                        });
                                        
                                        const chefRevenue = chefOrders.reduce((acc, o) => {
                                            const amount = Number(o.total_amount) || Number(o.total) || 0;
                                            return acc + amount;
                                        }, 0);
                                        
                                        const ordersCount = chefOrders.length;
                                        
                                        // Debug: log chef stats (always log for debugging)
                                        console.log(`🔍 Chef ${chef.chef_name} (${chef.id}):`, {
                                            totalOrders: orders.length,
                                            chefOrders: ordersCount,
                                            revenue: chefRevenue,
                                            ordersWithChefId: orders.filter(o => o.chef_id).length,
                                            allOrderChefIds: orders.filter(o => o.chef_id).map(o => o.chef_id).slice(0, 5),
                                            chefId: chef.id
                                        });
                                        
                                        return (
                                            <>
                                                <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100 text-center">
                                                    <p className="text-[10px] text-gray-500 font-bold mb-1">المبيعات</p>
                                                    <p className="font-black text-gray-900 text-lg">{chefRevenue > 0 ? chefRevenue.toLocaleString('ar-EG') : '0'} ج.م</p>
                                                </div>
                                                <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100 text-center">
                                                    <p className="text-[10px] text-gray-500 font-bold mb-1">عدد الأوردرات</p>
                                                    <p className="font-black text-[#8B2525] text-lg">{ordersCount}</p>
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>

                                <button 
                                    onClick={() => toggleChefStatus(chef.id)}
                                    className={`w-full py-2.5 rounded-xl font-bold text-sm text-white transition-all shadow-md ${chef.is_active ? 'bg-red-500 hover:bg-red-600 shadow-red-200' : 'bg-green-500 hover:bg-green-600 shadow-green-200'}`}
                                >
                                     {chef.is_active ? 'إغلاق المطبخ 🔒' : 'فتح المطبخ 🔓'}
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
                        value={formData.specialty || ''}
                        onChange={e => setFormData({...formData, specialty: e.target.value})}
                        disabled={isLoading}
                    />
                    {formErrors.specialty && <p className="text-red-500 text-sm">{formErrors.specialty}</p>}
                </div>

                {/* Bio */}
                <div className="space-y-1">
                    <textarea
                        placeholder="نبذة عن الشيف"
                        className={`w-full p-3 bg-gray-50 rounded-xl border ${formErrors.bio ? 'border-red-500' : 'border-gray-200'} text-gray-900 h-24 resize-none`}
                        value={formData.bio || ''}
                        onChange={e => setFormData({...formData, bio: e.target.value})}
                        disabled={isLoading}
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
