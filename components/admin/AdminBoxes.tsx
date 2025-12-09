
import React, { useState } from 'react';
import { Box } from '../../types';
import { AdminFormModal } from '../Modals';

interface AdminBoxesProps {
    boxes: Box[];
    onAdd: (box: Box) => void;
    onEdit: (box: Box) => void;
    onDelete: (id: number) => void;
}

export const AdminBoxes: React.FC<AdminBoxesProps> = ({ boxes, onAdd, onEdit, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentBox, setCurrentBox] = useState<Box | null>(null);
    const [formData, setFormData] = useState<any>({ name: '', price: '', serves: '', chef: '', itemsString: '', img: '' });

    const openAdd = () => {
        setCurrentBox(null);
        setFormData({ name: '', price: '', serves: '', chef: '', itemsString: '', img: 'https://source.unsplash.com/random/food' });
        setIsModalOpen(true);
    };

    const openEdit = (box: Box) => {
        setCurrentBox(box);
        setFormData({ ...box, itemsString: box.items.join(', ') });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const items = formData.itemsString.split(',').map((item: string) => item.trim());
        const boxData = { ...formData, price: Number(formData.price), items, color: "from-orange-500 to-red-600", accent: "bg-orange-50 text-orange-700", badge: "عرض جديد" };
        
        if (currentBox) {
            onEdit({ ...currentBox, ...boxData });
        } else {
            onAdd({ ...boxData, id: Date.now(), category: 'غداء' });
        }
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-900">إدارة البوكسات 📦</h2>
                <button onClick={openAdd} className="bg-[#8B2525] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-[#6b1c1c] transition flex items-center gap-2">
                    <i className="fa-solid fa-plus"></i> إضافة بوكس
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {boxes.map(box => (
                    <div key={box.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden relative group">
                         <div className="absolute top-4 left-4 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEdit(box)} className="w-8 h-8 rounded-full bg-white shadow text-blue-600 flex items-center justify-center hover:bg-gray-50"><i className="fa-solid fa-pen"></i></button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); onDelete(box.id); }} 
                                className="w-8 h-8 rounded-full bg-white shadow text-red-600 flex items-center justify-center hover:bg-gray-50"
                            >
                                <i className="fa-solid fa-trash"></i>
                            </button>
                         </div>
                        <div className="h-40 relative">
                            <img src={box.img} alt={box.name} className="w-full h-full object-cover" />
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
                ))}
            </div>

            <AdminFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentBox ? "تعديل بوكس" : "إضافة بوكس جديد"} onSubmit={handleSubmit}>
                <input type="text" placeholder="اسم البوكس" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-900" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                <div className="grid grid-cols-2 gap-4">
                    <input type="number" placeholder="السعر" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-900" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                    <input type="text" placeholder="يكفي كام فرد (مثلاً: 4 أفراد)" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-900" value={formData.serves} onChange={e => setFormData({...formData, serves: e.target.value})} required />
                </div>
                <input type="text" placeholder="اسم الشيف" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-900" value={formData.chef} onChange={e => setFormData({...formData, chef: e.target.value})} required />
                <textarea placeholder="مكونات البوكس (افصل بينهم بفاصلة ,)" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-900 h-24" value={formData.itemsString} onChange={e => setFormData({...formData, itemsString: e.target.value})} required></textarea>
                <input type="text" placeholder="رابط الصورة" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-900" value={formData.img} onChange={e => setFormData({...formData, img: e.target.value})} />
            </AdminFormModal>
        </div>
    );
}
