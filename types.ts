
export interface Review {
    id: number;
    itemId: number;
    rating: number;
    comment: string;
    date: string;
    customerName: string;
}

export interface Chef {
    id: number;
    name: string;
    specialty: string;
    rating: number;
    reviews: number;
    orders: string;
    img: string;
    bio: string;
    cover: string;
    isOpen: boolean;
    workingHours: string;
    deliveryTime: string;
    badges: string[];
}

export interface MenuItem {
    id: number;
    name: string;
    price: number;
    category?: string;
    categoryId?: string;
    chef?: string;
    img: string;
    rating?: number;
    time?: string;
    desc?: string;
    oldPrice?: number;
    discount?: string;
    chefImg?: string;
    orderCount?: number;
    reviewsList?: Review[]; // New field for storing reviews
    expiryDate?: string; // New field for offer expiration
}

export interface CartItem extends MenuItem {
    quantity: number;
}

export interface Order {
    id: number;
    customer: string;
    phone: string;
    address: string;
    date: string;
    total: number;
    status: string; // 'pending' | 'cooking' | 'out_for_delivery' | 'delivered'
    items: string;
    itemsDetails: CartItem[];
}

export interface Box {
    id: number;
    name: string;
    category?: string;
    categoryId?: string;
    price: number;
    chef: string;
    serves: string;
    items: string[];
    img: string;
    color?: string;
    accent?: string;
    badge?: string;
}

export interface PromoCode {
    id: number;
    code: string;
    value: number; // Discount amount or percentage
    type: 'percentage' | 'fixed'; // Type of discount
    createdAt?: string;
}

export interface CheckoutForm {
    name: string;
    phone: string;
    address: string;
    notes: string;
    promoCode?: string;
    discountApplied?: number;
}

export interface ContactSettings {
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
    facebookUrl: string;
    instagramUrl: string;
    tiktokUrl: string;
}
