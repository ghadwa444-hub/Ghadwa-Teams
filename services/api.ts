
import { Chef, MenuItem, Order, Box, PromoCode, ContactSettings, Review } from '../types';
import { INITIAL_CHEFS, INITIAL_ORDERS, INITIAL_MENU_ITEMS, INITIAL_OFFERS, INITIAL_BOXES, INITIAL_BEST_SELLERS, INITIAL_PROMO_CODES, INITIAL_CONTACT_SETTINGS } from '../constants';
import { logger } from '../utils/logger';

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
    try {
        const stored = localStorage.getItem(key);
        if (!stored) {
            // Initialize storage with default data if empty
            logger.debug('API_STORAGE', `📝 Initializing ${key} with default data`);
            localStorage.setItem(key, JSON.stringify(fallback));
            return fallback;
        }
        logger.debug('API_STORAGE', `✅ Retrieved ${key} from localStorage`);
        return JSON.parse(stored);
    } catch (error) {
        logger.error('API_STORAGE', `❌ Error reading ${key} from localStorage`, error);
        return fallback;
    }
}

// Helper: Save Data to Storage
function saveDB<T>(key: string, data: T): void {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        logger.debug('API_STORAGE', `💾 Saved ${key} to localStorage`);
    } catch (error) {
        logger.error('API_STORAGE', `❌ Error writing ${key} to localStorage`, error);
    }
}

export const api = {
    // --- Fetch Data (READ) ---
    getChefs: async () => {
        logger.debug('API_CHEFS', '🔄 Fetching chefs from API...');
        await delay(500);
        const data = getDB<Chef[]>(KEYS.CHEFS, INITIAL_CHEFS);
        logger.info('API_CHEFS', `✅ Fetched ${data.length} chefs`, { count: data.length });
        return data;
    },
    getOrders: async () => {
        logger.debug('API_ORDERS', '🔄 Fetching orders from API...');
        await delay(500);
        const data = getDB<Order[]>(KEYS.ORDERS, INITIAL_ORDERS);
        logger.info('API_ORDERS', `✅ Fetched ${data.length} orders`, { count: data.length });
        return data;
    },
    getMenuItems: async () => {
        logger.debug('API_MENU', '🔄 Fetching menu items from API...');
        await delay(500);
        const data = getDB<MenuItem[]>(KEYS.MENU, INITIAL_MENU_ITEMS);
        logger.info('API_MENU', `✅ Fetched ${data.length} menu items`, { count: data.length });
        return data;
    },
    getOffers: async () => {
        logger.debug('API_OFFERS', '🔄 Fetching offers from API...');
        await delay(500);
        const data = getDB<MenuItem[]>(KEYS.OFFERS, INITIAL_OFFERS);
        logger.info('API_OFFERS', `✅ Fetched ${data.length} offers`, { count: data.length });
        return data;
    },
    getBoxes: async () => {
        logger.debug('API_BOXES', '🔄 Fetching boxes from API...');
        await delay(500);
        const data = getDB<Box[]>(KEYS.BOXES, INITIAL_BOXES);
        logger.info('API_BOXES', `✅ Fetched ${data.length} boxes`, { count: data.length });
        return data;
    },
    getBestSellers: async () => {
        logger.debug('API_BESTSELLERS', '🔄 Fetching best sellers from API...');
        await delay(500);
        const data = getDB<MenuItem[]>(KEYS.BEST_SELLERS, INITIAL_BEST_SELLERS);
        logger.info('API_BESTSELLERS', `✅ Fetched ${data.length} best sellers`, { count: data.length });
        return data;
    },
    getPromoCodes: async () => {
        logger.debug('API_PROMOS', '🔄 Fetching promo codes from API...');
        await delay(500);
        const data = getDB<PromoCode[]>(KEYS.PROMOS, INITIAL_PROMO_CODES);
        logger.info('API_PROMOS', `✅ Fetched ${data.length} promo codes`, { count: data.length });
        return data;
    },
    getContactSettings: async () => {
        logger.debug('API_SETTINGS', '🔄 Fetching contact settings from API...');
        await delay(500);
        const data = getDB<ContactSettings>(KEYS.SETTINGS, INITIAL_CONTACT_SETTINGS);
        logger.info('API_SETTINGS', '✅ Fetched contact settings');
        return data;
    },
    
    // --- Orders (CREATE, UPDATE, DELETE) ---
    submitOrder: async (order: Order): Promise<boolean> => {
        logger.info('API_ORDERS', '📤 Submitting new order to API', { orderId: order.id, customer: order.customer });
        await delay(800);
        const orders = getDB<Order[]>(KEYS.ORDERS, INITIAL_ORDERS);
        // Add new order to top
        const newOrders = [order, ...orders]; 
        saveDB(KEYS.ORDERS, newOrders);
        logger.info('API_ORDERS', '✅ Order saved successfully', { orderId: order.id });
        return true;
    },
    updateOrderStatus: async (id: number, status: string): Promise<boolean> => {
        logger.info('API_ORDERS', `📊 Updating order status`, { orderId: id, newStatus: status });
        await delay(300);
        const orders = getDB<Order[]>(KEYS.ORDERS, INITIAL_ORDERS);
        const updatedOrders = orders.map(o => o.id === id ? { ...o, status } : o);
        saveDB(KEYS.ORDERS, updatedOrders);
        logger.info('API_ORDERS', '✅ Order status updated successfully', { orderId: id, status });
        return true;
    },
    deleteOrder: async (id: number): Promise<boolean> => {
        logger.warn('API_ORDERS', '🗑️ Deleting order', { orderId: id });
        await delay(300);
        const orders = getDB<Order[]>(KEYS.ORDERS, INITIAL_ORDERS);
        const filteredOrders = orders.filter(o => o.id !== id);
        saveDB(KEYS.ORDERS, filteredOrders);
        logger.info('API_ORDERS', '✅ Order deleted successfully', { orderId: id });
        return true;
    },

    // --- Chefs ---
    addChef: async (chef: Chef) => {
        logger.info('API_CHEFS', '➕ Adding new chef', { chefName: chef.name, specialty: chef.specialty });
        await delay(300);
        const data = getDB<Chef[]>(KEYS.CHEFS, INITIAL_CHEFS);
        saveDB(KEYS.CHEFS, [...data, chef]);
        logger.info('API_CHEFS', '✅ Chef added successfully', { chefName: chef.name });
        return true;
    },
    updateChef: async (chef: Chef) => {
        logger.info('API_CHEFS', '✏️ Updating chef', { chefId: chef.id, chefName: chef.name });
        await delay(300);
        const data = getDB<Chef[]>(KEYS.CHEFS, INITIAL_CHEFS);
        saveDB(KEYS.CHEFS, data.map(c => c.id === chef.id ? chef : c));
        logger.info('API_CHEFS', '✅ Chef updated successfully', { chefName: chef.name });
        return true;
    },
    deleteChef: async (id: number) => {
        logger.warn('API_CHEFS', '🗑️ Deleting chef', { chefId: id });
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
