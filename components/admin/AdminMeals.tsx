
import React, { useState, useRef } from 'react';
import { MenuItem, Chef } from '../../types';
import { AdminFormModal } from '../Modals';
import { MENU_CATEGORIES } from '../../constants';
import { imageUploadService } from '../../services/imageUploadService';
import { validateProductForm } from '../../utils/validations';
import { supabase } from '../../services/supabase';

interface AdminMealsProps {
    meals: MenuItem[];
    chefs: Chef[];
    onAdd: (meal: MenuItem) => void;
    onEdit: (meal: MenuItem) => void;
    onDelete: (id: number) => void;
}

export const AdminMeals: React.FC<AdminMealsProps> = ({ meals, chefs, onAdd, onEdit, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentMeal, setCurrentMeal] = useState<MenuItem | null>(null);
    const [formData, setFormData] = useState<any>({ name: '', price: '', category: '', chef: '', img: '', time: '' });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const imageRef = useRef<HTMLInputElement>(null);

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };

    const clearForm = () => {
        setFormData({ name: '', price: '', category: '', chef: '', img: '', time: '' });
        setFormErrors({});
        setImagePreview('');
        if (imageRef.current) imageRef.current.value = '';
    };

    const openAdd = () => {
        setCurrentMeal(null);
        clearForm();
        setFormData({ name: '', price: '', category: 'مشويات', chef: '', img: '', time: '45 د' });
        setIsModalOpen(true);
    };

    const openEdit = (meal: MenuItem) => {
        setCurrentMeal(meal);
        setFormData(meal);
        setImagePreview(meal.img || '');
        setFormErrors({});
        setIsModalOpen(true);
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validation = validateProductForm({
            name: formData.name,
            price: formData.price,
            category: formData.category,
            description: formData.chef || 'N/A', // Use chef as description for now
        });

        if (!validation.valid) {
            setFormErrors(validation.errors);
            showNotification('error', 'Please fix the errors below');
            return;
        }

        setIsLoading(true);
        setFormErrors({});

        try {
            let imageUrl = formData.img;

            // Upload image if changed
            if (imageRef.current?.files?.[0]) {
                const uploadResult = await imageUploadService.uploadProductImage(
                    imageRef.current.files[0]
                );
                if (!uploadResult.success) {
                    throw new Error(uploadResult.error || 'Failed to upload product image');
                }
                imageUrl = uploadResult.url!;
            }

            const mealData = {
                ...formData,
                price: Number(formData.price),
                img: imageUrl,
            };

            if (currentMeal) {
                // Update existing meal in database
                const { error } = await supabase
                    .from('products')
                    .update(mealData)
                    .eq('id', currentMeal.id);

                if (error) throw error;
                onEdit({ ...currentMeal, ...mealData });
                showNotification('success', 'Meal updated successfully! ✅');
            } else {
                // Add new meal to database
                const newMeal = {
                    ...mealData,
                    id: Date.now(),
                    rating: 5.0,
                };

                const { error } = await supabase
                    .from('products')
                    .insert([newMeal]);

                if (error) throw error;
                onAdd(newMeal);
                showNotification('success', 'Meal added successfully! ✅');
            }

            setIsModalOpen(false);
            clearForm();
        } catch (error) {
            console.error('Error saving meal:', error);
            showNotification('error', `Error: ${error instanceof Error ? error.message : 'Failed to save meal'}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            setIsLoading(true);
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;
            onDelete(id);
            setDeleteConfirm(null);
            showNotification('success', 'Meal deleted successfully! 🗑️');
        } catch (error) {
            console.error('Error deleting meal:', error);
            showNotification('error', `Error: ${error instanceof Error ? error.message : 'Failed to delete meal'}`);
        } finally {
            setIsLoading(false);
        }
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
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Meal?</h3>
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
                <h2 className="text-3xl font-bold text-gray-900">إدارة الوجبات 🥘</h2>
                <button onClick={openAdd} className="bg-[#8B2525] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-[#6b1c1c] transition flex items-center gap-2">
                    <i className="fa-solid fa-plus"></i> إضافة وجبة
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-right">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 text-gray-700 font-bold">الصورة</th>
                            <th className="p-4 text-gray-700 font-bold">اسم الوجبة</th>
                            <th className="p-4 text-gray-700 font-bold">السعر</th>
                            <th className="p-4 text-gray-700 font-bold">القسم</th>
                            <th className="p-4 text-gray-700 font-bold">الشيف</th>
                            <th className="p-4 text-gray-700 font-bold">الوقت</th>
                            <th className="p-4 text-gray-700 font-bold">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-800">
                        {meals.map(meal => (
                            <tr key={meal.id} className="hover:bg-gray-50">
                                <td className="p-4">
                                    <img src={meal.img} alt={meal.name} className="w-12 h-12 rounded-lg object-cover" />
                                </td>
                                <td className="p-4 font-bold">{meal.name}</td>
                                <td className="p-4 text-[#8B2525] font-bold">{meal.price} ج.م</td>
                                <td className="p-4 text-sm text-gray-600">{meal.category}</td>
                                <td className="p-4 text-sm text-gray-600">{meal.chef}</td>
                                <td className="p-4 text-sm text-gray-600">{meal.time}</td>
                                <td className="p-4 flex gap-2">
                                    <button onClick={() => openEdit(meal)} title="Edit meal" className="text-blue-500 bg-blue-50 p-2 rounded-lg hover:bg-blue-100 transition"><i className="fa-solid fa-pen"></i></button>
                                    <button 
                                        type="button"
                                        onClick={(e) => { 
                                            e.stopPropagation(); 
                                            setDeleteConfirm(meal.id);
                                        }}
                                        title="Delete meal"
                                        className="text-red-500 bg-red-50 p-2 rounded-lg hover:bg-red-100 transition"
                                    >
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <AdminFormModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); clearForm(); }} title={currentMeal ? "تعديل وجبة" : "إضافة وجبة جديدة"} onSubmit={handleSubmit}>
                {/* Image Upload */}
                <div className="space-y-2">
                    <label htmlFor="meal-img" className="block text-sm font-bold text-gray-700">صورة الوجبة</label>
                    <div className="flex gap-4 items-center">
                        <input
                            id="meal-img"
                            ref={imageRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            disabled={isLoading}
                            title="Select meal image"
                            className="flex-1 p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-900 text-sm"
                        />
                        {(imagePreview || formData.img) && (
                            <img
                                src={imagePreview || formData.img}
                                alt="Meal preview"
                                className="w-12 h-12 rounded-lg object-cover border-2 border-gray-300"
                            />
                        )}
                    </div>
                    {formErrors.img && <p className="text-red-500 text-sm">{formErrors.img}</p>}
                </div>

                {/* Name */}
                <div className="space-y-1">
                    <input
                        type="text"
                        placeholder="اسم الوجبة"
                        className={`w-full p-3 bg-gray-50 rounded-xl border ${formErrors.name ? 'border-red-500' : 'border-gray-200'} text-gray-900`}
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        disabled={isLoading}
                        required
                    />
                    {formErrors.name && <p className="text-red-500 text-sm">{formErrors.name}</p>}
                </div>

                {/* Price */}
                <div className="space-y-1">
                    <input
                        type="number"
                        placeholder="السعر"
                        className={`w-full p-3 bg-gray-50 rounded-xl border ${formErrors.price ? 'border-red-500' : 'border-gray-200'} text-gray-900`}
                        value={formData.price}
                        onChange={e => setFormData({...formData, price: e.target.value})}
                        disabled={isLoading}
                        required
                    />
                    {formErrors.price && <p className="text-red-500 text-sm">{formErrors.price}</p>}
                </div>

                {/* Category & Chef */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <select
                            title="Select category"
                            className={`w-full p-3 bg-gray-50 rounded-xl border ${formErrors.category ? 'border-red-500' : 'border-gray-200'} text-gray-900`}
                            value={formData.category}
                            onChange={e => setFormData({...formData, category: e.target.value})}
                            disabled={isLoading}
                            required
                        >
                            <option value="" disabled>اختر القسم</option>
                            {MENU_CATEGORIES.slice(1).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                        {formErrors.category && <p className="text-red-500 text-xs">{formErrors.category}</p>}
                    </div>

                    <select
                        title="Select chef"
                        className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-900"
                        value={formData.chef}
                        onChange={e => setFormData({...formData, chef: e.target.value})}
                        disabled={isLoading}
                        required
                    >
                        <option value="" disabled>اختر الشيف</option>
                        {chefs.map(chef => (
                            <option key={chef.id} value={chef.name}>{chef.name}</option>
                        ))}
                    </select>
                </div>

                {/* Preparation Time */}
                <input
                    type="text"
                    placeholder="وقت التحضير (مثال: 45 د)"
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-900"
                    value={formData.time}
                    onChange={e => setFormData({...formData, time: e.target.value})}
                    disabled={isLoading}
                    required
                />

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
                    ) : currentMeal ? 'تحديث البيانات' : 'إضافة الوجبة'}
                </button>
            </AdminFormModal>
        </div>
    );
};
