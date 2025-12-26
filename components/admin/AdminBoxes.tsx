
import React, { useState } from 'react';
import { Box, Chef } from '../../types';
import { AdminFormModal } from '../Modals';
import { supabase } from '../../services/supabase';

interface AdminBoxesProps {
    boxes: Box[];
    chefs: Chef[];
    onAdd: (box: Box) => void;
    onEdit: (box: Box) => void;
    onDelete: (id: string | number) => void;
}

export const AdminBoxes: React.FC<AdminBoxesProps> = ({ boxes, chefs, onAdd, onEdit, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentBox, setCurrentBox] = useState<Box | null>(null);
    const [formData, setFormData] = useState<any>({ name: '', price: '', serves: '', chef_id: '', itemsString: '', image_url: '' });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };

    const validateForm = () => {
        const errors: Record<string, string> = {};
        if (!formData.name?.trim()) errors.name = 'اسم البوكس مطلوب';
        if (!formData.price || Number(formData.price) <= 0) errors.price = 'السعر يجب أن يكون أكبر من 0';
        if (!formData.serves?.trim()) errors.serves = 'عدد الأفراد مطلوب';
        if (!formData.chef_id?.trim()) errors.chef_id = 'اختيار الشيف مطلوب';
        if (!formData.itemsString?.trim()) errors.items = 'المكونات مطلوبة';
        if (!formData.image_url?.trim()) errors.image_url = 'رابط الصورة مطلوب';
        return { valid: Object.keys(errors).length === 0, errors };
    };

    const openAdd = () => {
        setCurrentBox(null);
        setFormData({ name: '', price: '', serves: '', chef_id: '', itemsString: '', image_url: '' });
        setFormErrors({});
        setIsModalOpen(true);
    };

    const openEdit = (box: Box) => {
        setCurrentBox(box);
        
        // Find chef by chef_id first, then by name (for legacy boxes)
        const chef = box.chef_id 
            ? chefs.find(c => c.id === box.chef_id)
            : chefs.find(c => c.chef_name === box.chef);
        
        setFormData({ 
            name: box.name,
            price: box.price,
            serves: box.serves || '',
            chef_id: box.chef_id || chef?.id || '',
            itemsString: box.items?.join(', ') || '',
            image_url: box.image_url || box.img || ''
        });
        setFormErrors({});
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const validation = validateForm();
        if (!validation.valid) {
            setFormErrors(validation.errors);
            showNotification('error', 'الرجاء تصحيح الأخطاء أدناه');
            return;
        }

        setIsLoading(true);
        setFormErrors({});

        try {
            const items = formData.itemsString.split(',').map((item: string) => item.trim());
            
            // Get chef name from chef_id
            const selectedChef = chefs.find(c => c.id === formData.chef_id);
            const chefName = selectedChef?.chef_name || '';
            
            const boxData: any = {
                name: formData.name,
                price: Number(formData.price),
                serves: formData.serves,
                chef: chefName, // Use 'chef' (TEXT) for legacy compatibility
                chef_id: formData.chef_id || null, // Also save chef_id (UUID)
                items: items,
                image_url: formData.image_url || null,
                img: formData.image_url || null, // Also set legacy 'img' field
                items_count: items.length
            };
            
            // Generate ID for new boxes (BIGINT, not UUID)
            if (!currentBox) {
                // Get max ID and add 1, or use timestamp if no boxes exist
                const { data: maxBoxes } = await supabase
                    .from('boxes')
                    .select('id')
                    .order('id', { ascending: false })
                    .limit(1);
                
                if (maxBoxes && maxBoxes.length > 0 && maxBoxes[0]?.id) {
                    boxData.id = Number(maxBoxes[0].id) + 1;
                } else {
                    // Use timestamp as fallback if no boxes exist
                    boxData.id = Math.floor(Date.now() / 1000);
                }
            }

            if (currentBox) {
                // Update existing box in database
                const { error: updateError } = await supabase
                    .from('boxes')
                    .update(boxData)
                    .eq('id', currentBox.id);

                if (updateError) throw updateError;

                // Fetch updated box
                const { data, error: selectError } = await supabase
                    .from('boxes')
                    .select('*')
                    .eq('id', currentBox.id)
                    .maybeSingle();

                if (selectError) throw selectError;
                if (!data) throw new Error('Failed to fetch updated box');

                const updatedBox: Box = { ...data };
                onEdit(updatedBox);
                showNotification('success', 'تم تحديث البوكس بنجاح! ✅');
            } else {
                // Add new box to database
                const { data, error } = await supabase
                    .from('boxes')
                    .insert([boxData])
                    .select()
                    .single();

                if (error) throw error;
                if (!data) throw new Error('Failed to create box - no data returned');

                const newBox: Box = { ...data };
                onAdd(newBox);
                showNotification('success', 'تم إضافة البوكس بنجاح! ✅');
            }

            setIsModalOpen(false);
            setFormData({ name: '', price: '', serves: '', chef_id: '', itemsString: '', image_url: '' });
        } catch (error) {
            console.error('Error saving box:', error);
            showNotification('error', `خطأ: ${error instanceof Error ? error.message : 'فشل حفظ البوكس'}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string | number) => {
        try {
            setIsLoading(true);
            const { error } = await supabase
                .from('boxes')
                .delete()
                .eq('id', Number(id)); // Convert to number (BIGINT)

            if (error) throw error;
            onDelete(id);
            setDeleteConfirm(null);
            showNotification('success', 'تم حذف البوكس بنجاح! 🗑️');
        } catch (error) {
            console.error('Error deleting box:', error);
            showNotification('error', `خطأ: ${error instanceof Error ? error.message : 'فشل حذف البوكس'}`);
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
                        <h3 className="text-xl font-bold text-gray-900 mb-2">حذف البوكس؟</h3>
                        <p className="text-gray-600 mb-6">هذا الإجراء لا يمكن التراجع عنه. هل أنت متأكد؟</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 bg-gray-200 text-gray-900 py-2 rounded-lg font-bold hover:bg-gray-300 transition"
                                disabled={isLoading}
                            >
                                إلغاء
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm)}
                                className="flex-1 bg-red-500 text-white py-2 rounded-lg font-bold hover:bg-red-600 transition disabled:opacity-50"
                                disabled={isLoading}
                            >
                                {isLoading ? 'جاري الحذف...' : 'حذف'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-900">إدارة البوكسات 📦</h2>
                <button onClick={openAdd} disabled={isLoading} className="bg-[#8B2525] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-[#6b1c1c] transition flex items-center gap-2 disabled:opacity-50">
                    <i className="fa-solid fa-plus"></i> إضافة بوكس
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {boxes.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        <p>لا توجد بوكسات بعد. ابدأ بإضافة بوكس جديد! 📦</p>
                    </div>
                ) : (
                    boxes.map(box => (
                        <div key={box.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden relative group">
                            <div className="absolute top-4 left-4 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => openEdit(box)} disabled={isLoading} className="w-8 h-8 rounded-full bg-white shadow text-blue-600 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"><i className="fa-solid fa-pen"></i></button>
                                <button 
                                    type="button"
                                    onClick={() => setDeleteConfirm(box.id)}
                                    disabled={isLoading}
                                    className="w-8 h-8 rounded-full bg-white shadow text-red-600 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                                >
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </div>
                            <div className="h-40 relative">
                                <img src={box.image_url || '/placeholder.jpg'} alt={box.name} className="w-full h-full object-cover" />
                                <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-gray-900">{box.price} ج.م</div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-gray-900 mb-1">{box.name}</h3>
                                <p className="text-xs text-gray-500 mb-2">يكفي {box.serves}</p>
                                <div className="flex flex-wrap gap-1">
                                    {box.items.slice(0, 3).map((item, i) => (
                                        <span key={i} className="text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-600">{item}</span>
                                    ))}
                                    {box.items.length > 3 && <span className="text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-600">+{box.items.length - 3}</span>}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <AdminFormModal isOpen={isModalOpen} onClose={() => !isLoading && setIsModalOpen(false)} title={currentBox ? "تعديل بوكس" : "إضافة بوكس جديد"} onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="اسم البوكس" 
                    className={`w-full p-3 bg-gray-50 rounded-xl border ${formErrors.name ? 'border-red-500' : 'border-gray-200'} text-gray-900`}
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    disabled={isLoading}
                    required 
                />
                {formErrors.name && <p className="text-sm text-red-500">{formErrors.name}</p>}

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <input 
                            type="number" 
                            placeholder="السعر" 
                            className={`w-full p-3 bg-gray-50 rounded-xl border ${formErrors.price ? 'border-red-500' : 'border-gray-200'} text-gray-900`}
                            value={formData.price} 
                            onChange={e => setFormData({...formData, price: e.target.value})}
                            disabled={isLoading}
                            required 
                        />
                        {formErrors.price && <p className="text-sm text-red-500">{formErrors.price}</p>}
                    </div>
                    <div>
                        <input 
                            type="text" 
                            placeholder="يكفي كام فرد (مثلاً: 4 أفراد)" 
                            className={`w-full p-3 bg-gray-50 rounded-xl border ${formErrors.serves ? 'border-red-500' : 'border-gray-200'} text-gray-900`}
                            value={formData.serves} 
                            onChange={e => setFormData({...formData, serves: e.target.value})}
                            disabled={isLoading}
                            required 
                        />
                        {formErrors.serves && <p className="text-sm text-red-500">{formErrors.serves}</p>}
                    </div>
                </div>
                
                <div>
                    <select 
                        className={`w-full p-3 bg-gray-50 rounded-xl border ${formErrors.chef_id ? 'border-red-500' : 'border-gray-200'} text-gray-900`}
                        value={formData.chef_id || ''} 
                        onChange={e => {
                            console.log('Chef selected:', e.target.value);
                            setFormData({...formData, chef_id: e.target.value});
                            // Clear error when chef is selected
                            if (formErrors.chef_id) {
                                setFormErrors({...formErrors, chef_id: ''});
                            }
                        }}
                        disabled={isLoading}
                        required
                    >
                        <option value="">اختر الشيف</option>
                        {chefs.length === 0 ? (
                            <option disabled>لا يوجد شيفات متاحة</option>
                        ) : (
                            chefs.map(chef => (
                                <option key={chef.id} value={chef.id}>{chef.chef_name}</option>
                            ))
                        )}
                    </select>
                    {formErrors.chef_id && <p className="text-sm text-red-500 mt-1">{formErrors.chef_id}</p>}
                    {chefs.length === 0 && (
                        <p className="text-xs text-amber-600 mt-1">⚠️ يجب إضافة شيفات أولاً من قائمة الشيفات</p>
                    )}
                </div>

                <div>
                    <textarea 
                        placeholder="مكونات البوكس (افصل بينهم بفاصلة ,)" 
                        className={`w-full p-3 bg-gray-50 rounded-xl border ${formErrors.items ? 'border-red-500' : 'border-gray-200'} text-gray-900 h-24`}
                        value={formData.itemsString} 
                        onChange={e => setFormData({...formData, itemsString: e.target.value})}
                        disabled={isLoading}
                        required
                    />
                    {formErrors.items && <p className="text-sm text-red-500">{formErrors.items}</p>}
                </div>

                <div>
                    <input 
                        type="text" 
                        placeholder="رابط الصورة" 
                        className={`w-full p-3 bg-gray-50 rounded-xl border ${formErrors.image_url ? 'border-red-500' : 'border-gray-200'} text-gray-900`}
                        value={formData.image_url} 
                        onChange={e => setFormData({...formData, image_url: e.target.value})}
                        disabled={isLoading}
                    />
                    {formErrors.image_url && <p className="text-sm text-red-500">{formErrors.image_url}</p>}
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-[#8B2525] text-white py-3 rounded-xl font-bold hover:bg-[#6b1c1c] transition disabled:opacity-50"
                >
                    {isLoading ? 'جاري الحفظ...' : (currentBox ? 'تحديث البوكس' : 'إضافة البوكس')}
                </button>
            </AdminFormModal>
        </div>
    );
}
