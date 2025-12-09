
import { Chef, MenuItem, Order, Box, PromoCode, ContactSettings, Review } from '../types';
import { INITIAL_CHEFS, INITIAL_ORDERS, INITIAL_MENU_ITEMS, INITIAL_OFFERS, INITIAL_BOXES, INITIAL_BEST_SELLERS, INITIAL_PROMO_CODES, INITIAL_CONTACT_SETTINGS } from '../constants';

// Storage Keys
const KEYS = {
    CHEFS: 'ghadwa_chefs',
    ORDERS: 'ghadwa_orders',
    MENU: 'ghadwa_menu',
    OFFERS: 'ghadwa_offers',
    BOXES: 'ghadwa_boxes',
    BEST_SELLERS: 'ghadwa_best_sellers',
    PROMOS: 'ghadwa_promos',
    SETTINGS: 'ghadwa_settings'
};

// Helper: Simulate Network Delay (Optional, for realism)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper: Get Data from Storage or Fallback to Initial Data
function getDB<T>(key: string, fallback: T): T {
    const stored = localStorage.getItem(key);
    if (!stored) {
        // Initialize storage with default data if empty
        localStorage.setItem(key, JSON.stringify(fallback));
        return fallback;
    }
    return JSON.parse(stored);
}

// Helper: Save Data to Storage
function saveDB<T>(key: string, data: T): void {
    localStorage.setItem(key, JSON.stringify(data));
}

export const api = {
    // --- Fetch Data (READ) ---
    getChefs: async () => {
        await delay(500);
        return getDB<Chef[]>(KEYS.CHEFS, INITIAL_CHEFS);
    },
    getOrders: async () => {
        await delay(500);
        return getDB<Order[]>(KEYS.ORDERS, INITIAL_ORDERS);
    },
    getMenuItems: async () => {
        await delay(500);
        return getDB<MenuItem[]>(KEYS.MENU, INITIAL_MENU_ITEMS);
    },
    getOffers: async () => {
        await delay(500);
        return getDB<MenuItem[]>(KEYS.OFFERS, INITIAL_OFFERS);
    },
    getBoxes: async () => {
        await delay(500);
        return getDB<Box[]>(KEYS.BOXES, INITIAL_BOXES);
    },
    getBestSellers: async () => {
        await delay(500);
        return getDB<MenuItem[]>(KEYS.BEST_SELLERS, INITIAL_BEST_SELLERS);
    },
    getPromoCodes: async () => {
        await delay(500);
        return getDB<PromoCode[]>(KEYS.PROMOS, INITIAL_PROMO_CODES);
    },
    getContactSettings: async () => {
        await delay(500);
        return getDB<ContactSettings>(KEYS.SETTINGS, INITIAL_CONTACT_SETTINGS);
    },
    
    // --- Orders (CREATE, UPDATE, DELETE) ---
    submitOrder: async (order: Order): Promise<boolean> => {
        await delay(800);
        const orders = getDB<Order[]>(KEYS.ORDERS, INITIAL_ORDERS);
        // Add new order to top
        const newOrders = [order, ...orders]; 
        saveDB(KEYS.ORDERS, newOrders);
        console.log("Order Saved to DB:", order);
        return true;
    },
    updateOrderStatus: async (id: number, status: string): Promise<boolean> => {
        await delay(300);
        const orders = getDB<Order[]>(KEYS.ORDERS, INITIAL_ORDERS);
        const updatedOrders = orders.map(o => o.id === id ? { ...o, status } : o);
        saveDB(KEYS.ORDERS, updatedOrders);
        return true;
    },
    deleteOrder: async (id: number): Promise<boolean> => {
        await delay(300);
        const orders = getDB<Order[]>(KEYS.ORDERS, INITIAL_ORDERS);
        const filteredOrders = orders.filter(o => o.id !== id);
        saveDB(KEYS.ORDERS, filteredOrders);
        return true;
    },

    // --- Chefs ---
    addChef: async (chef: Chef) => {
        await delay(300);
        const data = getDB<Chef[]>(KEYS.CHEFS, INITIAL_CHEFS);
        saveDB(KEYS.CHEFS, [...data, chef]);
        return true;
    },
    updateChef: async (chef: Chef) => {
        await delay(300);
        const data = getDB<Chef[]>(KEYS.CHEFS, INITIAL_CHEFS);
        saveDB(KEYS.CHEFS, data.map(c => c.id === chef.id ? chef : c));
        return true;
    },
    deleteChef: async (id: number) => {
        await delay(300);
        const data = getDB<Chef[]>(KEYS.CHEFS, INITIAL_CHEFS);
        saveDB(KEYS.CHEFS, data.filter(c => c.id !== id));
        return true;
    },

    // --- Menu Items ---
    addMenuItem: async (item: MenuItem) => {
        await delay(300);
        const data = getDB<MenuItem[]>(KEYS.MENU, INITIAL_MENU_ITEMS);
        saveDB(KEYS.MENU, [...data, item]);
        return true;
    },
    updateMenuItem: async (item: MenuItem) => {
        await delay(300);
        const data = getDB<MenuItem[]>(KEYS.MENU, INITIAL_MENU_ITEMS);
        saveDB(KEYS.MENU, data.map(i => i.id === item.id ? item : i));
        return true;
    },
    deleteMenuItem: async (id: number) => {
        await delay(300);
        const data = getDB<MenuItem[]>(KEYS.MENU, INITIAL_MENU_ITEMS);
        saveDB(KEYS.MENU, data.filter(i => i.id !== id));
        return true;
    },
    
    // --- Reviews ---
    addReview: async (review: Review): Promise<boolean> => {
        await delay(300);
        const items = getDB<MenuItem[]>(KEYS.MENU, INITIAL_MENU_ITEMS);
        const updatedItems = items.map(item => {
            if (item.id === review.itemId) {
                const currentReviews = item.reviewsList || [];
                const newReviews = [...currentReviews, review];
                
                // Recalculate average rating
                const totalRating = newReviews.reduce((sum, r) => sum + r.rating, 0);
                const avgRating = parseFloat((totalRating / newReviews.length).toFixed(1));
                
                return { ...item, reviewsList: newReviews, rating: avgRating };
            }
            return item;
        });
        saveDB(KEYS.MENU, updatedItems);
        return true;
    },

    // --- Offers ---
    addOffer: async (item: MenuItem) => {
        await delay(300);
        const data = getDB<MenuItem[]>(KEYS.OFFERS, INITIAL_OFFERS);
        saveDB(KEYS.OFFERS, [...data, item]);
        return true;
    },
    updateOffer: async (item: MenuItem) => {
        await delay(300);
        const data = getDB<MenuItem[]>(KEYS.OFFERS, INITIAL_OFFERS);
        saveDB(KEYS.OFFERS, data.map(i => i.id === item.id ? item : i));
        return true;
    },
    deleteOffer: async (id: number) => {
        await delay(300);
        const data = getDB<MenuItem[]>(KEYS.OFFERS, INITIAL_OFFERS);
        saveDB(KEYS.OFFERS, data.filter(i => i.id !== id));
        return true;
    },

    // --- Boxes ---
    addBox: async (box: Box) => {
        await delay(300);
        const data = getDB<Box[]>(KEYS.BOXES, INITIAL_BOXES);
        saveDB(KEYS.BOXES, [...data, box]);
        return true;
    },
    updateBox: async (box: Box) => {
        await delay(300);
        const data = getDB<Box[]>(KEYS.BOXES, INITIAL_BOXES);
        saveDB(KEYS.BOXES, data.map(b => b.id === box.id ? box : b));
        return true;
    },
    deleteBox: async (id: number) => {
        await delay(300);
        const data = getDB<Box[]>(KEYS.BOXES, INITIAL_BOXES);
        saveDB(KEYS.BOXES, data.filter(b => b.id !== id));
        return true;
    },

    // --- Best Sellers ---
    addBestSeller: async (item: MenuItem) => {
        await delay(300);
        const data = getDB<MenuItem[]>(KEYS.BEST_SELLERS, INITIAL_BEST_SELLERS);
        saveDB(KEYS.BEST_SELLERS, [...data, item]);
        return true;
    },
    updateBestSeller: async (item: MenuItem) => {
        await delay(300);
        const data = getDB<MenuItem[]>(KEYS.BEST_SELLERS, INITIAL_BEST_SELLERS);
        saveDB(KEYS.BEST_SELLERS, data.map(i => i.id === item.id ? item : i));
        return true;
    },
    deleteBestSeller: async (id: number) => {
        await delay(300);
        const data = getDB<MenuItem[]>(KEYS.BEST_SELLERS, INITIAL_BEST_SELLERS);
        saveDB(KEYS.BEST_SELLERS, data.filter(i => i.id !== id));
        return true;
    },

    // --- Promo Codes ---
    addPromoCode: async (promo: PromoCode) => {
        await delay(300);
        const data = getDB<PromoCode[]>(KEYS.PROMOS, INITIAL_PROMO_CODES);
        saveDB(KEYS.PROMOS, [...data, promo]);
        return true;
    },
    deletePromoCode: async (id: number) => {
        await delay(300);
        const data = getDB<PromoCode[]>(KEYS.PROMOS, INITIAL_PROMO_CODES);
        saveDB(KEYS.PROMOS, data.filter(p => p.id !== id));
        return true;
    },

    // --- Settings ---
    updateContactSettings: async (settings: ContactSettings): Promise<boolean> => {
        await delay(300);
        saveDB(KEYS.SETTINGS, settings);
        console.log("Settings updated in DB:", settings);
        return true;
    }
};
