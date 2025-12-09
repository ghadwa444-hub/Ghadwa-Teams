
import { Chef, MenuItem, Order, Box, PromoCode, ContactSettings } from '../types';
import { INITIAL_CHEFS, INITIAL_ORDERS, INITIAL_MENU_ITEMS, INITIAL_OFFERS, INITIAL_BOXES, INITIAL_BEST_SELLERS, INITIAL_PROMO_CODES, INITIAL_CONTACT_SETTINGS } from '../constants';

const SIMULATE_API = true; // Toggle this to false when real backend is ready
const API_BASE_URL = 'https://api.ghadwa.com'; // Placeholder URL

async function fetchData<T>(endpoint: string, fallback: T): Promise<T> {
    if (SIMULATE_API) {
        // Simulate network delay of 1.5 seconds to show loading state
        return new Promise(resolve => setTimeout(() => resolve(fallback), 1500));
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        if (!response.ok) throw new Error(`Failed to fetch ${endpoint}`);
        return await response.json();
    } catch (error) {
        console.error(`API Error (${endpoint}):`, error);
        return fallback;
    }
}

export const api = {
    getChefs: () => fetchData<Chef[]>('/chefs', INITIAL_CHEFS),
    getOrders: () => fetchData<Order[]>('/orders', INITIAL_ORDERS),
    getMenuItems: () => fetchData<MenuItem[]>('/menu', INITIAL_MENU_ITEMS),
    getOffers: () => fetchData<MenuItem[]>('/offers', INITIAL_OFFERS),
    getBoxes: () => fetchData<Box[]>('/boxes', INITIAL_BOXES),
    getBestSellers: () => fetchData<MenuItem[]>('/best-sellers', INITIAL_BEST_SELLERS),
    getPromoCodes: () => fetchData<PromoCode[]>('/promos', INITIAL_PROMO_CODES),
    getContactSettings: () => fetchData<ContactSettings>('/settings', INITIAL_CONTACT_SETTINGS),
    
    // Simulate submitting an order to the backend/company
    submitOrder: async (order: Order): Promise<boolean> => {
        console.log("Order submitted to backend:", order);
        if (SIMULATE_API) {
             return new Promise(resolve => setTimeout(() => resolve(true), 1000));
        }
        try {
            const response = await fetch(`${API_BASE_URL}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(order)
            });
            return response.ok;
        } catch (e) {
            console.error("Failed to submit order", e);
            return false;
        }
    },

    updateContactSettings: async (settings: ContactSettings): Promise<boolean> => {
        console.log("Settings updated:", settings);
        if (SIMULATE_API) {
            return new Promise(resolve => setTimeout(() => resolve(true), 1000));
        }
        // Real API call would go here
        return true;
    }
};
