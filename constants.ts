
import { Chef, MenuItem, Order, Box, PromoCode, ContactSettings } from './types';

export const MENU_CATEGORIES = ["الكل", "مشويات", "محاشي", "طواجن", "أكل شعبي", "حلويات"];

export const INITIAL_CHEFS: Chef[] = [];

export const INITIAL_ORDERS: Order[] = [];

export const INITIAL_OFFERS: MenuItem[] = [];

export const INITIAL_BEST_SELLERS: MenuItem[] = [];

export const INITIAL_BOXES: Box[] = [];

export const INITIAL_MENU_ITEMS: MenuItem[] = [];

export const INITIAL_PROMO_CODES: PromoCode[] = [];

export const INITIAL_CONTACT_SETTINGS: ContactSettings = {
    phone: "01000000000",
    whatsapp: "201109318581",
    email: "hello@ghadwa.com",
    address: "المعادي، القاهرة، مصر",
    facebookUrl: "#",
    instagramUrl: "#",
    tiktokUrl: "#"
};
