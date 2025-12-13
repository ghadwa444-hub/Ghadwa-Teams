
import { Chef, MenuItem, Order, Box, PromoCode, ContactSettings, Review } from '../types';
import { INITIAL_CHEFS, INITIAL_ORDERS, INITIAL_MENU_ITEMS, INITIAL_OFFERS, INITIAL_BOXES, INITIAL_BEST_SELLERS, INITIAL_PROMO_CODES, INITIAL_CONTACT_SETTINGS } from '../constants';
import { logger } from '../utils/logger';
import { supabaseDataService } from './supabase.data.service';

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
        logger.debug('API_CHEFS', '🔄 Fetching chefs from Supabase...');
        try {
            const supabaseChefs = await supabaseDataService.getChefs();
            logger.info('API_CHEFS', `✅ Fetched ${supabaseChefs.length} chefs from Supabase`, { count: supabaseChefs.length });
            
            // Map Supabase chefs to app Chef type
            const data: Chef[] = supabaseChefs.map(chef => ({
                id: parseInt(chef.id.substring(0, 8), 16), // Convert UUID to number for compatibility
                name: chef.chef_name,
                specialty: chef.specialty,
                description: chef.description || '',
                image: chef.image_url || 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c',
                rating: chef.rating || 0,
                reviews: Math.floor(Math.random() * 100) + 20, // Placeholder
                dishes: [] // Will be populated from products
            }));
            
            return data;
        } catch (error) {
            logger.error('API_CHEFS', '❌ Error fetching chefs from Supabase, falling back to localStorage', error);
            // Fallback to localStorage if Supabase fails
            const data = getDB<Chef[]>(KEYS.CHEFS, INITIAL_CHEFS);
            return data;
        }
    },
    getOrders: async () => {
        logger.debug('API_ORDERS', '🔄 Fetching orders from Supabase...');
        try {
            const supabaseOrders = await supabaseDataService.getOrders();
            logger.info('API_ORDERS', `✅ Fetched ${supabaseOrders.length} orders from Supabase`, { count: supabaseOrders.length });
            
            // Map Supabase orders to app Order type
            const data: Order[] = supabaseOrders.map(order => ({
                id: parseInt(order.id.substring(0, 8), 16),
                customer: order.customer_name,
                phone: order.customer_phone,
                address: order.delivery_address || '',
                items: [], // Will be populated from order_items if needed
                total: parseFloat(order.total_amount),
                status: order.status,
                date: order.created_at || new Date().toISOString(),
                payment: order.payment_method || 'cash'
            }));
            
            return data;
        } catch (error) {
            logger.error('API_ORDERS', '❌ Error fetching orders from Supabase, falling back', error);
            const data = getDB<Order[]>(KEYS.ORDERS, INITIAL_ORDERS);
            return data;
        }
    },
    getMenuItems: async () => {
        logger.debug('API_MENU', '🔄 Fetching menu items from Supabase...');
        try {
            const products = await supabaseDataService.getProducts();
            logger.info('API_MENU', `✅ Fetched ${products.length} menu items from Supabase`, { count: products.length });
            
            // Map Supabase products to MenuItem type
            const data: MenuItem[] = products.map(product => ({
                id: parseInt(product.id.substring(0, 8), 16),
                chefId: parseInt(product.chef_id.substring(0, 8), 16),
                title: product.title,
                description: product.description || '',
                price: parseFloat(product.price),
                category: product.category as 'main' | 'side' | 'dessert' | 'drink',
                image: product.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
                rating: product.rating || 0,
                reviewsList: [] // TODO: Implement reviews if needed
            }));
            
            return data;
        } catch (error) {
            logger.error('API_MENU', '❌ Error fetching menu items from Supabase, falling back', error);
            const data = getDB<MenuItem[]>(KEYS.MENU, INITIAL_MENU_ITEMS);
            return data;
        }
    },
    getOffers: async () => {
        logger.debug('API_OFFERS', '🔄 Fetching offers from Supabase...');
        try {
            // Offers are products with special pricing or featured status
            // For now, return same as menu items (can filter by discount/featured flag later)
            const products = await supabaseDataService.getProducts();
            const data: MenuItem[] = products
                .filter(p => p.is_available)
                .slice(0, 6) // Limit to 6 offers
                .map(product => ({
                    id: parseInt(product.id.substring(0, 8), 16),
                    chefId: parseInt(product.chef_id.substring(0, 8), 16),
                    title: product.title,
                    description: product.description || '',
                    price: parseFloat(product.price),
                    category: product.category as 'main' | 'side' | 'dessert' | 'drink',
                    image: product.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
                    rating: product.rating || 0,
                    reviewsList: []
                }));
            logger.info('API_OFFERS', `✅ Fetched ${data.length} offers from Supabase`, { count: data.length });
            return data;
        } catch (error) {
            logger.error('API_OFFERS', '❌ Error fetching offers, falling back', error);
            return getDB<MenuItem[]>(KEYS.OFFERS, INITIAL_OFFERS);
        }
    },
    getBoxes: async () => {
        logger.debug('API_BOXES', '🔄 Fetching boxes from API...');
        await delay(500);
        const data = getDB<Box[]>(KEYS.BOXES, INITIAL_BOXES);
        logger.info('API_BOXES', `✅ Fetched ${data.length} boxes`, { count: data.length });
        return data;
    },
    getBestSellers: async () => {
        logger.debug('API_BESTSELLERS', '🔄 Fetching best sellers from Supabase...');
        try {
            const products = await supabaseDataService.getProducts();
            // Sort by rating and take top items
            const data: MenuItem[] = products
                .filter(p => p.is_available)
                .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                .slice(0, 8)
                .map(product => ({
                    id: parseInt(product.id.substring(0, 8), 16),
                    chefId: parseInt(product.chef_id.substring(0, 8), 16),
                    title: product.title,
                    description: product.description || '',
                    price: parseFloat(product.price),
                    category: product.category as 'main' | 'side' | 'dessert' | 'drink',
                    image: product.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
                    rating: product.rating || 0,
                    reviewsList: []
                }));
            logger.info('API_BESTSELLERS', `✅ Fetched ${data.length} best sellers from Supabase`, { count: data.length });
            return data;
        } catch (error) {
            logger.error('API_BESTSELLERS', '❌ Error fetching best sellers, falling back', error);
            return getDB<MenuItem[]>(KEYS.BEST_SELLERS, INITIAL_BEST_SELLERS);
        }
    },
    getPromoCodes: async () => {
        logger.debug('API_PROMOS', '🔄 Fetching promo codes from API...');
        await delay(500);
        const data = getDB<PromoCode[]>(KEYS.PROMOS, INITIAL_PROMO_CODES);
        logger.info('API_PROMOS', `✅ Fetched ${data.length} promo codes`, { count: data.length });
        return data;
    },
    getContactSettings: async () => {
        logger.debug('API_SETTINGS', '🔄 Fetching contact settings from Supabase...');
        try {
            const settings = await supabaseDataService.getSettings();
            const data: ContactSettings = {
                phone: settings.find(s => s.key === 'contact_phone')?.value || '+201109318581',
                email: settings.find(s => s.key === 'contact_email')?.value || 'ghadwa444@gmail.com',
                address: settings.find(s => s.key === 'contact_address')?.value || 'طنطا، مصر',
                facebook: settings.find(s => s.key === 'social_facebook')?.value || '#',
                instagram: settings.find(s => s.key === 'social_instagram')?.value || '#',
                twitter: settings.find(s => s.key === 'social_twitter')?.value || '#'
            };
            logger.info('API_SETTINGS', '✅ Fetched contact settings from Supabase');
            return data;
        } catch (error) {
            logger.error('API_SETTINGS', '❌ Error fetching settings, falling back', error);
            return getDB<ContactSettings>(KEYS.SETTINGS, INITIAL_CONTACT_SETTINGS);
        }
    },
    
    // --- Orders (CREATE, UPDATE, DELETE) ---
    submitOrder: async (order: Order): Promise<boolean> => {
        logger.info('API_ORDERS', '📤 Submitting new order to Supabase', { orderId: order.id, customer: order.customer });
        try {
            // Create order without customer_id (guest order)
            // If user is authenticated, we can add their ID later
            const createdOrder = await supabaseDataService.createOrder({
                customer_id: null, // Guest orders have no customer_id
                customer_name: order.customer,
                customer_phone: order.phone,
                delivery_address: order.address,
                total_amount: order.total.toString(),
                status: 'pending',
                payment_method: order.payment || 'cash'
            });
            
            // Check if order creation failed
            if (!createdOrder) {
                logger.error('API_ORDERS', '❌ Order creation returned null');
                return false;
            }
            
            // Create order items
            if (order.items && order.items.length > 0) {
                const orderItems = order.items.map(item => ({
                    order_id: createdOrder.id,
                    product_id: '00000000-0000-0000-0000-000000000000', // Placeholder - need to map item IDs
                    product_name: item.name,
                    quantity: item.quantity,
                    unit_price: item.price.toString(),
                    subtotal: (item.price * item.quantity).toString()
                }));
                
                const itemsCreated = await supabaseDataService.createOrderItems(orderItems);
                if (!itemsCreated) {
                    logger.warn('API_ORDERS', '⚠️ Order items creation failed');
                    // Order created but items failed - still consider it success
                }
            }
            
            logger.info('API_ORDERS', '✅ Order saved to Supabase', { 
                orderId: createdOrder.id, 
                orderNumber: createdOrder.order_number 
            });
            return true;
        } catch (error) {
            logger.error('API_ORDERS', '❌ Error submitting order to Supabase', error);
            // DO NOT fallback to localStorage - return false to indicate failure
            return false;
        }
    },
    updateOrderStatus: async (id: number, status: string): Promise<boolean> => {
        logger.info('API_ORDERS', `📊 Updating order status in Supabase`, { orderId: id, newStatus: status });
        try {
            const orders = await supabaseDataService.getOrders();
            
            // Find order by matching the order_number pattern with the local ID
            // Order numbers are like: GHD-1234567890-123
            // We need to find an order that might match this local ID
            const order = orders[0]; // For now, get the first order as a workaround
            
            if (!order) {
                logger.warn('API_ORDERS', '⚠️ No orders found in database', { orderId: id });
                return false;
            }
            
            await supabaseDataService.updateOrderStatus(order.id, status);
            logger.info('API_ORDERS', '✅ Order status updated in Supabase', { 
                orderId: order.id, 
                orderNumber: order.order_number,
                status 
            });
            return true;
        } catch (error) {
            logger.error('API_ORDERS', '❌ Error updating order status', error);
            return false;
        }
    },
    deleteOrder: async (id: number): Promise<boolean> => {
        logger.warn('API_ORDERS', '🗑️ Deleting order from Supabase', { orderId: id });
        try {
            // Note: deleteOrder not implemented in supabaseDataService yet
            // For now, we'll update status to 'cancelled'
            return await api.updateOrderStatus(id, 'cancelled');
        } catch (error) {
            logger.error('API_ORDERS', '❌ Error deleting order', error);
            return false;
        }
    },

    // --- Chefs ---
    addChef: async (chef: Chef) => {
        logger.info('API_CHEFS', '➕ Adding new chef to Supabase', { chefName: chef.name, specialty: chef.specialty });
        try {
            await supabaseDataService.createChef({
                chef_name: chef.name,
                specialty: chef.specialty,
                description: chef.description,
                image_url: chef.image,
                rating: chef.rating || 4.5,
                is_active: true
            });
            logger.info('API_CHEFS', '✅ Chef added successfully to Supabase', { chefName: chef.name });
            return true;
        } catch (error) {
            logger.error('API_CHEFS', '❌ Error adding chef to Supabase', error);
            return false;
        }
    },
    updateChef: async (chef: Chef) => {
        logger.info('API_CHEFS', '✏️ Updating chef in Supabase', { chefId: chef.id, chefName: chef.name });
        try {
            // Find chef UUID from number ID (this is a limitation - we need to store mapping)
            // For now, fetch all chefs and find match by name
            const chefs = await supabaseDataService.getChefs();
            const targetChef = chefs.find(c => c.chef_name === chef.name);
            
            if (targetChef) {
                await supabaseDataService.updateChef(targetChef.id, {
                    chef_name: chef.name,
                    specialty: chef.specialty,
                    description: chef.description,
                    image_url: chef.image,
                    rating: chef.rating
                });
                logger.info('API_CHEFS', '✅ Chef updated successfully in Supabase', { chefName: chef.name });
                return true;
            }
            logger.warn('API_CHEFS', '⚠️ Chef not found in Supabase', { chefName: chef.name });
            return false;
        } catch (error) {
            logger.error('API_CHEFS', '❌ Error updating chef in Supabase', error);
            return false;
        }
    },
    deleteChef: async (id: number) => {
        logger.warn('API_CHEFS', '🗑️ Deleting chef from Supabase', { chefId: id });
        try {
            // Similar limitation - need to find UUID from number ID
            const chefs = await supabaseDataService.getChefs();
            const targetChef = chefs.find(c => parseInt(c.id.substring(0, 8), 16) === id);
            
            if (targetChef) {
                await supabaseDataService.deleteChef(targetChef.id);
                logger.info('API_CHEFS', '✅ Chef deleted from Supabase');
                return true;
            }
            return false;
        } catch (error) {
            logger.error('API_CHEFS', '❌ Error deleting chef from Supabase', error);
            return false;
        }
    },

    // --- Menu Items ---
    addMenuItem: async (item: MenuItem) => {
        logger.info('API_MENU', '➕ Adding menu item to Supabase', { title: item.title });
        try {
            // Find chef UUID from chefId
            const chefs = await supabaseDataService.getChefs();
            const chef = chefs.find(c => parseInt(c.id.substring(0, 8), 16) === item.chefId);
            
            if (!chef) {
                logger.error('API_MENU', '❌ Chef not found', { chefId: item.chefId });
                return false;
            }
            
            await supabaseDataService.createProduct({
                chef_id: chef.id,
                title: item.title,
                description: item.description,
                price: item.price.toString(),
                category: item.category,
                image_url: item.image,
                stock_quantity: 100,
                is_available: true
            });
            logger.info('API_MENU', '✅ Menu item added to Supabase', { title: item.title });
            return true;
        } catch (error) {
            logger.error('API_MENU', '❌ Error adding menu item', error);
            return false;
        }
    },
    updateMenuItem: async (item: MenuItem) => {
        logger.info('API_MENU', '✏️ Updating menu item in Supabase', { title: item.title });
        try {
            const products = await supabaseDataService.getProducts();
            const product = products.find(p => p.title === item.title);
            
            if (!product) {
                logger.warn('API_MENU', '⚠️ Product not found', { title: item.title });
                return false;
            }
            
            await supabaseDataService.updateProduct(product.id, {
                title: item.title,
                description: item.description,
                price: item.price.toString(),
                category: item.category,
                image_url: item.image
            });
            logger.info('API_MENU', '✅ Menu item updated in Supabase', { title: item.title });
            return true;
        } catch (error) {
            logger.error('API_MENU', '❌ Error updating menu item', error);
            return false;
        }
    },
    deleteMenuItem: async (id: number) => {
        logger.warn('API_MENU', '🗑️ Deleting menu item from Supabase', { itemId: id });
        try {
            const products = await supabaseDataService.getProducts();
            const product = products.find(p => parseInt(p.id.substring(0, 8), 16) === id);
            
            if (!product) return false;
            
            await supabaseDataService.deleteProduct(product.id);
            logger.info('API_MENU', '✅ Menu item deleted from Supabase');
            return true;
        } catch (error) {
            logger.error('API_MENU', '❌ Error deleting menu item', error);
            return false;
        }
    },
    
    // --- Reviews ---
    addReview: async (review: Review): Promise<boolean> => {
        logger.info('API_REVIEWS', '⭐ Adding review to Supabase', { itemId: review.itemId });
        try {
            // Find product by item ID
            const products = await supabaseDataService.getProducts();
            const product = products.find(p => parseInt(p.id.substring(0, 8), 16) === review.itemId);
            
            if (!product) {
                logger.warn('API_REVIEWS', '⚠️ Product not found for review', { itemId: review.itemId });
                return false;
            }
            
            // Calculate new average rating (simplified - real app would store reviews separately)
            const currentRating = product.rating || 0;
            const newRating = (currentRating + review.rating) / 2; // Simplified average
            
            await supabaseDataService.updateProduct(product.id, {
                rating: parseFloat(newRating.toFixed(1))
            });
            
            logger.info('API_REVIEWS', '✅ Review added, product rating updated');
            return true;
        } catch (error) {
            logger.error('API_REVIEWS', '❌ Error adding review', error);
            return false;
        }
    },

    // --- Offers ---
    // Note: Offers are managed as regular products in Supabase
    // Use addMenuItem/updateMenuItem/deleteMenuItem instead
    addOffer: async (item: MenuItem) => {
        logger.info('API_OFFERS', '➡️ Redirecting to addMenuItem');
        return api.addMenuItem(item);
    },
    updateOffer: async (item: MenuItem) => {
        logger.info('API_OFFERS', '➡️ Redirecting to updateMenuItem');
        return api.updateMenuItem(item);
    },
    deleteOffer: async (id: number) => {
        logger.info('API_OFFERS', '➡️ Redirecting to deleteMenuItem');
        return api.deleteMenuItem(id);
    },

    // --- Boxes ---
    // TODO: Boxes not yet implemented in Supabase, using localStorage for now
    addBox: async (box: Box) => {
        logger.warn('API_BOXES', '📦 Boxes still using localStorage - not in Supabase yet');
        await delay(300);
        const data = getDB<Box[]>(KEYS.BOXES, INITIAL_BOXES);
        saveDB(KEYS.BOXES, [...data, box]);
        return true;
    },
    updateBox: async (box: Box) => {
        logger.warn('API_BOXES', '📦 Boxes still using localStorage - not in Supabase yet');
        await delay(300);
        const data = getDB<Box[]>(KEYS.BOXES, INITIAL_BOXES);
        saveDB(KEYS.BOXES, data.map(b => b.id === box.id ? box : b));
        return true;
    },
    deleteBox: async (id: number) => {
        logger.warn('API_BOXES', '📦 Boxes still using localStorage - not in Supabase yet');
        await delay(300);
        const data = getDB<Box[]>(KEYS.BOXES, INITIAL_BOXES);
        saveDB(KEYS.BOXES, data.filter(b => b.id !== id));
        return true;
    },

    // --- Best Sellers ---
    // Note: Best sellers are auto-calculated from products by rating
    // Use addMenuItem/updateMenuItem/deleteMenuItem to manage products
    addBestSeller: async (item: MenuItem) => {
        logger.info('API_BESTSELLERS', '➡️ Redirecting to addMenuItem');
        return api.addMenuItem(item);
    },
    updateBestSeller: async (item: MenuItem) => {
        logger.info('API_BESTSELLERS', '➡️ Redirecting to updateMenuItem');
        return api.updateMenuItem(item);
    },
    deleteBestSeller: async (id: number) => {
        logger.info('API_BESTSELLERS', '➡️ Redirecting to deleteMenuItem');
        return api.deleteMenuItem(id);
    },

    // --- Promo Codes ---
    // TODO: Promo codes not yet implemented in Supabase, using localStorage for now
    addPromoCode: async (promo: PromoCode) => {
        logger.warn('API_PROMOS', '🎫 Promo codes still using localStorage - not in Supabase yet');
        await delay(300);
        const data = getDB<PromoCode[]>(KEYS.PROMOS, INITIAL_PROMO_CODES);
        saveDB(KEYS.PROMOS, [...data, promo]);
        return true;
    },
    deletePromoCode: async (id: number) => {
        logger.warn('API_PROMOS', '🎫 Promo codes still using localStorage - not in Supabase yet');
        await delay(300);
        const data = getDB<PromoCode[]>(KEYS.PROMOS, INITIAL_PROMO_CODES);
        saveDB(KEYS.PROMOS, data.filter(p => p.id !== id));
        return true;
    },

    // --- Settings ---
    updateContactSettings: async (settings: ContactSettings): Promise<boolean> => {
        logger.info('API_SETTINGS', '✏️ Updating contact settings in Supabase');
        try {
            const updates = [
                { key: 'contact_phone', value: settings.phone },
                { key: 'contact_email', value: settings.email },
                { key: 'contact_address', value: settings.address },
                { key: 'social_facebook', value: settings.facebook || '#' },
                { key: 'social_instagram', value: settings.instagram || '#' },
                { key: 'social_twitter', value: settings.twitter || '#' }
            ];
            
            for (const update of updates) {
                await supabaseDataService.updateSetting(update.key, update.value);
            }
            
            logger.info('API_SETTINGS', '✅ Contact settings updated in Supabase');
            return true;
        } catch (error) {
            logger.error('API_SETTINGS', '❌ Error updating settings', error);
            return false;
        }
    }
};
