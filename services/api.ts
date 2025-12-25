
import { Chef, Product, Order, Box, PromoCode, ContactSettings } from '../types';
import { logger } from '../utils/logger';
import { supabaseDataService } from './supabase.data.service';
import { freeNotificationService } from './notifications/freeNotificationService';

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
    getChefs: async (): Promise<Chef[]> => {
        logger.debug('API_CHEFS', '🔄 Fetching chefs from Supabase...');
        try {
            const chefs = await supabaseDataService.getChefs();
            logger.info('API_CHEFS', `✅ Fetched ${chefs.length} chefs from Supabase`, { count: chefs.length });
            return chefs as Chef[];
        } catch (error) {
            logger.error('API_CHEFS', '❌ Error fetching chefs from Supabase', error);
            return [];
        }
    },
    getOrders: async (): Promise<Order[]> => {
        logger.debug('API_ORDERS', '🔄 Fetching orders from Supabase...');
        try {
            const orders = await supabaseDataService.getOrders();
            logger.info('API_ORDERS', `✅ Fetched ${orders.length} orders from Supabase`, { count: orders.length });
            return orders as Order[];
        } catch (error) {
            logger.error('API_ORDERS', '❌ Error fetching orders from Supabase', error);
            return [];
        }
    },
    getMenuItems: async (): Promise<Product[]> => {
        logger.debug('API_MENU', '🔄 Fetching menu items from Supabase...');
        try {
            const products = await supabaseDataService.getProducts();
            logger.info('API_MENU', `✅ Fetched ${products.length} menu items from Supabase`, { count: products.length });
            return products as Product[];
        } catch (error) {
            logger.error('API_MENU', '❌ Error fetching menu items from Supabase', error);
            return [];
        }
    },
    getOffers: async (): Promise<Product[]> => {
        logger.debug('API_OFFERS', '🔄 Fetching offers from Supabase...');
        try {
            const products = await supabaseDataService.getProducts();
            // Filter products that are offers
            const offers = products.filter(p => p.is_offer === true);
            logger.info('API_OFFERS', `✅ Fetched ${offers.length} offers from Supabase`, { count: offers.length });
            return offers as Product[];
        } catch (error) {
            logger.error('API_OFFERS', '❌ Error fetching offers', error);
            return [];
        }
    },
    getBoxes: async (): Promise<Box[]> => {
        logger.debug('API_BOXES', '🔄 Fetching boxes from Supabase...');
        try {
            const data = await supabaseDataService.getBoxes();
            logger.info('API_BOXES', `✅ Fetched ${data.length} boxes from Supabase`, { count: data.length });
            return data as Box[];
        } catch (error) {
            logger.error('API_BOXES', '❌ Error fetching boxes', error);
            return [];
        }
    },
    getBestSellers: async (): Promise<Product[]> => {
        logger.debug('API_BESTSELLERS', '🔄 Fetching best sellers from Supabase...');
        try {
            const products = await supabaseDataService.getProducts();
            // Filter products that are featured
            const bestSellers = products.filter(p => p.is_featured === true);
            logger.info('API_BESTSELLERS', `✅ Fetched ${bestSellers.length} best sellers from Supabase`, { count: bestSellers.length });
            return bestSellers as Product[];
        } catch (error) {
            logger.error('API_BESTSELLERS', '❌ Error fetching best sellers', error);
            return [];
        }
    },
    getPromoCodes: async (): Promise<PromoCode[]> => {
        logger.debug('API_PROMOS', '🔄 Fetching promo codes from API...');
        await delay(500);
        const data = getDB<PromoCode[]>(KEYS.PROMOS, []);
        logger.info('API_PROMOS', `✅ Fetched ${data.length} promo codes`, { count: data.length });
        return data;
    },
    getContactSettings: async (): Promise<ContactSettings> => {
        logger.debug('API_SETTINGS', '🔄 Fetching contact settings from Supabase...');
        try {
            const settings = await supabaseDataService.getContactSettings();
            if (settings) {
                const data: ContactSettings = {
                    id: settings.id,
                    phone: settings.phone || '',
                    email: settings.email || '',
                    address: settings.address || '',
                    whatsapp: settings.whatsapp || '',
                    facebook: settings.facebook || '',
                    instagram: settings.instagram || '',
                    linkedin: settings.linkedin || '',
                    working_hours: settings.working_hours || '',
                    updated_at: settings.updated_at
                };
                logger.info('API_SETTINGS', '✅ Fetched contact settings from Supabase');
                return data;
            }
            // Fallback to empty settings
            return {
                phone: '',
                email: '',
                address: '',
                whatsapp: '',
                facebook: '',
                instagram: '',
                linkedin: '',
            };
        } catch (error) {
            logger.error('API_SETTINGS', '❌ Error fetching settings, falling back', error);
            return {
                phone: '',
                email: '',
                address: '',
                whatsapp: '',
                facebook: '',
                instagram: '',
                linkedin: '',
            };
        }
    },
    
    // --- Orders (CREATE, UPDATE, DELETE) ---
    submitOrder: async (order: any): Promise<boolean> => {
        logger.info('API_ORDERS', '📤 Submitting new order to Supabase', { orderId: order.id, customer: order.customer });
        try {
            // Calculate subtotal from items
            const subtotal = order.itemsDetails 
                ? order.itemsDetails.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)
                : order.total;
            
            const discountAmount = (subtotal - order.total) || 0;
            
            // Get chef_id from order items (use first item's chef_id, or most common if multiple chefs)
            const getChefIdFromOrder = () => {
                if (!order.itemsDetails || order.itemsDetails.length === 0) {
                    return order.chef_id || null;
                }
                
                // Count chef_ids in order items
                const chefIdCounts: Record<string, number> = {};
                order.itemsDetails.forEach((item: any) => {
                    if (item.chef_id) {
                        chefIdCounts[item.chef_id] = (chefIdCounts[item.chef_id] || 0) + (item.quantity || 1);
                    }
                });
                
                // Return most common chef_id, or first one if all have same count
                const sortedChefIds = Object.entries(chefIdCounts)
                    .sort((a, b) => b[1] - a[1]);
                
                return sortedChefIds.length > 0 ? sortedChefIds[0][0] : (order.itemsDetails[0]?.chef_id || order.chef_id || null);
            };

            // Create order without customer_id (guest order)
            // If user is authenticated, we can add their ID later
            const createdOrder = await supabaseDataService.createOrder({
                customer_id: null, // Guest orders have no customer_id
                chef_id: getChefIdFromOrder(), // Add chef_id from cart items
                customer_name: order.customer,
                customer_phone: order.phone,
                delivery_address: order.address,
                delivery_phone: order.phone, // Also set delivery_phone
                subtotal: subtotal,
                delivery_fee: 0,
                tax_amount: 0,
                discount_amount: discountAmount,
                total_amount: order.total,
                status: 'pending',
                payment_method: order.payment || 'cash'
                // order_number will be auto-generated by createOrder()
            });
            
            // Check if order creation failed
            if (!createdOrder) {
                logger.error('API_ORDERS', '❌ Order creation returned null');
                return false;
            }
            
            // Create order items (use itemsDetails which is the actual array, not items which is a string)
            if (order.itemsDetails && order.itemsDetails.length > 0) {
                const orderItems = order.itemsDetails.map((item: any) => ({
                    order_id: createdOrder.id,
                    product_id: item.id || null, // Use actual product ID from cart item
                    product_name: item.name,
                    quantity: item.quantity,
                    unit_price: item.price,
                    total_price: item.price * item.quantity  // total_price is the correct field name in order_items
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
            
            // Send notification (non-blocking - don't fail order if notification fails)
            freeNotificationService.sendOrderNotification(order).then(result => {
                if (result.success) {
                    logger.info('API_ORDERS', `📧 Notification sent via ${result.service}`);
                } else {
                    logger.debug('API_ORDERS', '⚠️ Notification not sent (service not configured)');
                }
            }).catch(error => {
                logger.warn('API_ORDERS', '⚠️ Notification sending failed', error);
            });
            
            return true;
        } catch (error) {
            logger.error('API_ORDERS', '❌ Error submitting order to Supabase', error);
            // DO NOT fallback to localStorage - return false to indicate failure
            return false;
        }
    },
    updateOrderStatus: async (id: string | number, status: string): Promise<boolean> => {
        logger.info('API_ORDERS', `📊 Updating order status in Supabase`, { orderId: id, newStatus: status });
        try {
            // Validate status against allowed values
            const allowedStatuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
            if (!allowedStatuses.includes(status)) {
                logger.error('API_ORDERS', `❌ Invalid status: ${status}. Must be one of: ${allowedStatuses.join(', ')}`);
                return false;
            }
            
            // Convert id to string (UUID)
            const orderId = String(id);
            
            // Update order status directly using the UUID
            const updatedOrder = await supabaseDataService.updateOrderStatus(orderId, status as any);
            
            if (!updatedOrder) {
                logger.warn('API_ORDERS', '⚠️ Order status update returned null', { orderId: id });
                return false;
            }
            
            logger.info('API_ORDERS', '✅ Order status updated in Supabase', { 
                orderId: updatedOrder.id, 
                orderNumber: updatedOrder.order_number,
                status 
            });
            return true;
        } catch (error) {
            logger.error('API_ORDERS', '❌ Error updating order status', error);
            return false;
        }
    },
    deleteOrder: async (id: string | number): Promise<boolean> => {
        logger.warn('API_ORDERS', '🗑️ Deleting order from Supabase', { orderId: id });
        try {
            // Convert id to string
            const orderId = String(id);
            // Note: deleteOrder not implemented in supabaseDataService yet
            // For now, we'll update status to 'cancelled'
            return await api.updateOrderStatus(orderId, 'cancelled');
        } catch (error) {
            logger.error('API_ORDERS', '❌ Error deleting order', error);
            return false;
        }
    },

    // --- Chefs ---
    addChef: async (chef: Chef): Promise<boolean> => {
        logger.info('API_CHEFS', '➕ Adding new chef to Supabase', { chefName: chef.chef_name, specialty: chef.specialty });
        try {
            await supabaseDataService.createChef({
                chef_name: chef.chef_name,
                specialty: chef.specialty || null,
                description: chef.description || null,
                image_url: chef.image_url || null,
                rating: chef.rating || 5.0,
                is_active: chef.is_active ?? true
            });
            logger.info('API_CHEFS', '✅ Chef added successfully to Supabase', { chefName: chef.chef_name });
            return true;
        } catch (error) {
            logger.error('API_CHEFS', '❌ Error adding chef to Supabase', error);
            return false;
        }
    },
    updateChef: async (chef: Chef): Promise<Chef | null> => {
        logger.info('API_CHEFS', '✏️ Updating chef in Supabase', { chefId: chef.id, chefName: chef.chef_name, is_active: chef.is_active });
        try {
            const result = await supabaseDataService.updateChef(chef.id, {
                chef_name: chef.chef_name,
                specialty: chef.specialty || null,
                description: chef.description || null,
                image_url: chef.image_url || null,
                rating: chef.rating,
                is_active: chef.is_active
            });
            
            if (!result) {
                logger.error('API_CHEFS', '❌ Chef update returned null', { chefId: chef.id });
                return null;
            }
            
            logger.info('API_CHEFS', '✅ Chef updated successfully in Supabase', { chefName: chef.chef_name, is_active: result.is_active });
            return result;
        } catch (error) {
            logger.error('API_CHEFS', '❌ Error updating chef in Supabase', error);
            throw error; // Re-throw so caller can handle it
        }
    },
    deleteChef: async (id: string): Promise<boolean> => {
        logger.warn('API_CHEFS', '🗑️ Deleting chef from Supabase', { chefId: id });
        try {
            await supabaseDataService.deleteChef(id);
            logger.info('API_CHEFS', '✅ Chef deleted from Supabase');
            return true;
        } catch (error) {
            logger.error('API_CHEFS', '❌ Error deleting chef from Supabase', error);
            return false;
        }
    },

    // --- Menu Items / Products ---
    addMenuItem: async (item: Partial<Product>): Promise<Product | null> => {
        logger.info('API_MENU', '➕ Adding menu item to Supabase', { name: item.name });
        try {
            const createdProduct = await supabaseDataService.createProduct({
                chef_id: item.chef_id || null,
                name: item.name,
                title: item.title || item.name, // Include title for DB sync
                description: item.description || null,
                price: item.price,
                image_url: item.image_url || null,
                category: item.category || 'main',
                is_available: item.is_available ?? true,
                is_featured: item.is_featured ?? false,
                is_offer: item.is_offer ?? false,
                offer_price: item.offer_price || null,
                prep_time: item.prep_time || 30, // Default prep time
                is_active: item.is_available ?? true // Sync with is_available
            });
            
            if (!createdProduct) {
                throw new Error('Failed to create product - no data returned');
            }
            
            logger.info('API_MENU', '✅ Menu item added to Supabase', { id: createdProduct.id, name: item.name });
            return createdProduct;
        } catch (error) {
            logger.error('API_MENU', '❌ Error adding menu item', error);
            return null;
        }
    },
    updateMenuItem: async (item: Product): Promise<Product | null> => {
        logger.info('API_MENU', '✏️ Updating menu item in Supabase', { name: item.name });
        try {
            const updatedProduct = await supabaseDataService.updateProduct(item.id, {
                chef_id: item.chef_id || null,
                name: item.name,
                description: item.description || null,
                price: item.price.toString(),
                image_url: item.image_url || null,
                category: item.category || null,
                is_available: item.is_available ?? true,
                is_featured: item.is_featured ?? false,
                is_offer: item.is_offer ?? false,
                offer_price: item.offer_price?.toString() || null,
                prep_time: item.prep_time || null
            });
            
            if (!updatedProduct) {
                logger.warn('API_MENU', '⚠️ Update returned null', { itemId: item.id });
                return null;
            }
            
            logger.info('API_MENU', '✅ Menu item updated in Supabase', { name: item.name });
            return updatedProduct;
        } catch (error) {
            logger.error('API_MENU', '❌ Error updating menu item', error);
            return null;
        }
    },
    deleteMenuItem: async (id: string): Promise<boolean> => {
        logger.warn('API_MENU', '🗑️ Deleting menu item from Supabase', { itemId: id });
        try {
            await supabaseDataService.deleteProduct(id);
            logger.info('API_MENU', '✅ Menu item deleted from Supabase');
            return true;
        } catch (error) {
            logger.error('API_MENU', '❌ Error deleting menu item', error);
            return false;
        }
    },
    
    // --- Boxes ---
    addBox: async (box: Box): Promise<boolean> => {
        logger.info('API_BOXES', '➕ Adding box to Supabase', { name: box.name });
        try {
            await supabaseDataService.createBox({
                name: box.name,
                description: box.description || null,
                price: box.price.toString(),
                image_url: box.image_url || null,
                items_count: box.items_count || null,
                is_active: box.is_active ?? true
            });
            logger.info('API_BOXES', '✅ Box added to Supabase', { name: box.name });
            return true;
        } catch (error) {
            logger.error('API_BOXES', '❌ Error adding box', error);
            return false;
        }
    },
    updateBox: async (box: Box): Promise<boolean> => {
        logger.info('API_BOXES', '✏️ Updating box in Supabase', { name: box.name });
        try {
            await supabaseDataService.updateBox(box.id, {
                name: box.name,
                description: box.description || null,
                price: box.price.toString(),
                image_url: box.image_url || null,
                items_count: box.items_count || null,
                is_active: box.is_active ?? true
            });
            logger.info('API_BOXES', '✅ Box updated in Supabase', { name: box.name });
            return true;
        } catch (error) {
            logger.error('API_BOXES', '❌ Error updating box', error);
            return false;
        }
    },
    deleteBox: async (id: string): Promise<boolean> => {
        logger.warn('API_BOXES', '🗑️ Deleting box from Supabase', { boxId: id });
        try {
            await supabaseDataService.deleteBox(id);
            logger.info('API_BOXES', '✅ Box deleted from Supabase');
            return true;
        } catch (error) {
            logger.error('API_BOXES', '❌ Error deleting box', error);
            return false;
        }
    },

    // --- Promo Codes (localStorage for now) ---
    addPromoCode: async (promo: PromoCode): Promise<boolean> => {
        logger.info('API_PROMOS', '➕ Adding promo code', { code: promo.code });
        const promos = getDB<PromoCode[]>(KEYS.PROMOS, []);
        promos.push(promo);
        saveDB(KEYS.PROMOS, promos);
        return true;
    },
    deletePromoCode: async (id: string): Promise<boolean> => {
        logger.warn('API_PROMOS', '🗑️ Deleting promo code', { promoId: id });
        const promos = getDB<PromoCode[]>(KEYS.PROMOS, []);
        const filtered = promos.filter(p => p.id !== id);
        saveDB(KEYS.PROMOS, filtered);
        return true;
    },

    // --- Contact Settings ---
    updateContactSettings: async (settings: ContactSettings): Promise<boolean> => {
        logger.info('API_SETTINGS', '✏️ Updating contact settings');
        try {
            // AdminContactSettings component handles the update directly via Supabase
            // This function is kept for backward compatibility but doesn't need to do anything
            // since AdminContactSettings updates contact_settings table directly
            logger.info('API_SETTINGS', '✅ Contact settings updated (handled by AdminContactSettings component)');
            return true;
        } catch (error) {
            logger.error('API_SETTINGS', '❌ Error updating settings', error);
            return false;
        }
    }
};

