
import React, { useState, useEffect } from 'react';
import { Chef, Order, MenuItem, Box, CartItem, CheckoutForm, PromoCode, ContactSettings } from './types';
import { MENU_CATEGORIES } from './constants';
import { api } from './services/api';
import { logger } from './utils/logger';
import { authService } from './services/auth.service';
import type { Profile } from './services/supabase';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal, MenuModal, ChefConflictModal, OrderSuccessModal, ClearCartModal, ReviewModal } from './components/Modals';
import { LoadingScreen } from './components/UIHelpers';
import { WeeklyOffers } from './components/home/WeeklyOffers';
import { ChefsSection } from './components/home/ChefsSection';
import { BestSellers } from './components/home/BestSellers';
import { BoxesSection } from './components/home/BoxesSection';
import { FullMenu } from './components/home/FullMenu';
import { LiveOrderTracker } from './components/home/LiveOrderTracker';

// Pages
import { ChefDetailsPage } from './pages/ChefDetailsPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AllChefsPage } from './pages/AllChefsPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { TrackOrderPage } from './pages/TrackOrderPage';

// Admin
import { AdminSidebar } from './components/admin/AdminSidebar';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminOrders } from './components/admin/AdminOrders';
import { AdminOrderDetails } from './components/admin/AdminOrderDetails';
import { AdminMeals } from './components/admin/AdminMeals';
import { AdminChefs } from './components/admin/AdminChefs';
import { AdminOffers } from './components/admin/AdminOffers';
import { AdminBoxes } from './components/admin/AdminBoxes';
import { AdminBestSellers } from './components/admin/AdminBestSellers';
import { AdminPromoCodes } from './components/admin/AdminPromoCodes';
import { AdminContactSettings } from './components/admin/AdminContactSettings';

const App = () => {
    // Data State
    const [chefs, setChefs] = useState<Chef[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [offers, setOffers] = useState<MenuItem[]>([]);
    const [boxes, setBoxes] = useState<Box[]>([]);
    const [bestSellers, setBestSellers] = useState<MenuItem[]>([]);
    const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
    const [contactSettings, setContactSettings] = useState<ContactSettings>({
        phone: '',
        whatsapp: '',
        email: '',
        address: '',
        facebookUrl: '',
        instagramUrl: '',
        tiktokUrl: ''
    });
    const [visitors, setVisitors] = useState(1250);

    // UI State
    const [activePage, setActivePage] = useState('home');
    const [isLoading, setIsLoading] = useState(true);
    
    // App State
    const [selectedChef, setSelectedChef] = useState<Chef | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [trackOrderId, setTrackOrderId] = useState<number | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [favorites, setFavorites] = useState<MenuItem[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [currentUser, setCurrentUser] = useState<Profile | null>(null);
    
    // Check authentication status on mount
    useEffect(() => {
        logger.info('APP', '🎯 App component mounted');
        checkAuthStatus();
        
        // TEMPORARILY DISABLED AUTH LISTENER TO DEBUG INFINITE LOOP
        // Listen to auth state changes
        // const { data: authListener } = authService.onAuthStateChange(async (event, session) => {
        //     logger.info('APP', '🔐 Auth state changed', { event, userId: session?.user?.id });
        //     
        //     if (event === 'SIGNED_IN' && session?.user) {
        //         const profile = await authService.getProfile(session.user.id);
        //         if (profile) {
        //             setCurrentUser(profile);
        //             setIsLoggedIn(true);
        //             setIsAdmin(profile.role === 'admin');
        //             localStorage.setItem('ghadwa_user', JSON.stringify(profile));
        //         }
        //     } else if (event === 'SIGNED_OUT') {
        //         setCurrentUser(null);
        //         setIsLoggedIn(false);
        //         setIsAdmin(false);
        //         localStorage.removeItem('ghadwa_user');
        //     }
        // });
        
        return () => {
            logger.debug('APP', '🔴 App component unmounting');
            // authListener?.subscription?.unsubscribe();
        };
    }, []);
    
    // Check if user is already logged in
    const checkAuthStatus = async () => {
        try {
            const { session } = await authService.getSession();
            
            if (session?.user) {
                const profile = await authService.getProfile(session.user.id);
                if (profile) {
                    setCurrentUser(profile);
                    setIsLoggedIn(true);
                    setIsAdmin(profile.role === 'admin');
                    logger.info('APP', '✅ User session restored', { role: profile.role });
                }
            } else {
                logger.info('APP', 'ℹ️ No active session found');
            }
        } catch (error) {
            logger.error('APP', '❌ Failed to check auth status', error);
        }
    };

    // Log page navigation changes
    useEffect(() => {
        logger.info('NAVIGATION', `📍 Page changed to: ${activePage}`, { 
            page: activePage,
            isAdmin: isAdmin,
            isLoggedIn: isLoggedIn,
            cartSize: cart.length
        });
    }, [activePage, isAdmin, isLoggedIn, cart.length]);
    
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState<{ isOpen: boolean; orderId: number | null }>({ isOpen: false, orderId: null });
    const [conflictModal, setConflictModal] = useState<{ isOpen: boolean; item: MenuItem | null; newQuantity: number }>({ isOpen: false, item: null, newQuantity: 0 });
    const [isClearCartModalOpen, setIsClearCartModalOpen] = useState(false);
    
    // Review State
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [reviewItem, setReviewItem] = useState<MenuItem | null>(null);

    const currentChefName = cart.length > 0 ? cart[0].chef : null;

    // Find the most recent active order (not delivered) for the Live Tracker
    // Sort by ID descending (newest first) and get the first non-delivered order
    const activeOrder = [...orders]
        .sort((a, b) => b.id - a.id)
        .find(o => o.status !== 'delivered');

    // Fetch Data on Mount
    useEffect(() => {
        const loadData = async () => {
            logger.info('APP', '📥 Starting data loading...');
            try {
                logger.debug('APP', '🔄 Fetching all data from API...');
                
                const startTime = performance.now();
                const [chefsData, ordersData, menuData, offersData, boxesData, bestSellersData, promosData, settingsData] = await Promise.all([
                    api.getChefs(),
                    api.getOrders(),
                    api.getMenuItems(),
                    api.getOffers(),
                    api.getBoxes(),
                    api.getBestSellers(),
                    api.getPromoCodes(),
                    api.getContactSettings()
                ]);
                const loadTime = performance.now() - startTime;

                logger.info('APP', `✅ API data fetched in ${loadTime.toFixed(2)}ms`, {
                    chefsCount: chefsData.length,
                    ordersCount: ordersData.length,
                    menuItemsCount: menuData.length,
                    offersCount: offersData.length,
                    boxesCount: boxesData.length,
                    bestSellersCount: bestSellersData.length,
                    promosCount: promosData.length
                });

                if (chefsData.length) {
                    setChefs(chefsData);
                    logger.debug('APP', `✅ Loaded ${chefsData.length} chefs`);
                }
                if (menuData.length) {
                    setMenuItems(menuData);
                    logger.debug('APP', `✅ Loaded ${menuData.length} menu items`);
                }
                if (offersData.length) {
                    setOffers(offersData);
                    logger.debug('APP', `✅ Loaded ${offersData.length} offers`);
                }
                if (boxesData.length) {
                    setBoxes(boxesData);
                    logger.debug('APP', `✅ Loaded ${boxesData.length} boxes`);
                }
                if (bestSellersData.length) {
                    setBestSellers(bestSellersData);
                    logger.debug('APP', `✅ Loaded ${bestSellersData.length} best sellers`);
                }
                if (promosData.length) {
                    setPromoCodes(promosData);
                    logger.debug('APP', `✅ Loaded ${promosData.length} promo codes`);
                }
                if (ordersData) {
                    setOrders(ordersData);
                    logger.debug('APP', `✅ Loaded ${ordersData.length} orders`);
                }
                if (settingsData) {
                    setContactSettings(settingsData);
                    logger.debug('APP', '✅ Loaded contact settings');
                }
                
                logger.info('APP', '🎉 All data loaded successfully');
            } catch (error) {
                logger.error('APP', '❌ Error loading data', error);
            } finally {
                setIsLoading(false);
                logger.info('APP', '⏳ Loading complete, rendering UI');
            }
        };

        loadData();
    }, []);

    const updateQuantity = (id: number, newQty: number, itemToAdd?: MenuItem) => {
        if (newQty < 0) return;

        logger.debug('CART', '🛒 Update quantity requested', { itemId: id, newQuantity: newQty, itemName: itemToAdd?.name });

        if (itemToAdd && cart.length > 0 && itemToAdd.chef && currentChefName && itemToAdd.chef !== currentChefName) {
            logger.warn('CART', '⚠️ Chef conflict detected', { 
                currentChef: currentChefName, 
                newChef: itemToAdd.chef,
                currentItem: itemToAdd.name
            });
            setConflictModal({ isOpen: true, item: itemToAdd, newQuantity: 1 });
            return;
        }

        if (newQty === 0) {
            setCart(prev => {
                const updated = prev.filter(item => item.id !== id);
                logger.info('CART', '🗑️ Item removed from cart', { itemId: id, cartSize: updated.length });
                return updated;
            });
        } else {
            setCart(prev => {
                const exists = prev.find(item => item.id === id);
                if (exists) {
                    const updated = prev.map(item => item.id === id ? { ...item, quantity: newQty } : item);
                    logger.info('CART', '✏️ Item quantity updated', { itemId: id, quantity: newQty });
                    return updated;
                } else if (itemToAdd) {
                    return [...prev, { ...itemToAdd, quantity: newQty }];
                }
                return prev;
            });
        }
    };

    const handleClearCartAndAdd = () => {
        const { item, newQuantity } = conflictModal;
        if (item) {
            logger.info('CART', '🔄 Clearing cart and adding new item from different chef', { 
                chefName: item.chef,
                itemName: item.name,
                quantity: newQuantity
            });
            setCart([{ ...item, quantity: newQuantity }]);
        }
        setConflictModal({ isOpen: false, item: null, newQuantity: 0 });
    };

    const handleClearCart = () => {
        logger.info('CART', '🗑️ Clearing entire cart');
        setCart([]);
        setIsClearCartModalOpen(false);
    };

    const handleLogin = (type: string) => {
        logger.info('AUTH', `🔓 User logged in as ${type}`, { loginType: type });
        setIsLoggedIn(true);
        if (type === 'admin') {
            setIsAdmin(true);
            setActivePage('admin-dashboard');
            logger.warn('AUTH', '⚠️ Admin mode activated');
        } else {
            setIsAdmin(false);
            setActivePage('home');
        }
    };

    const handleLogout = async () => {
        logger.info('AUTH', '🔐 Logging out user');
        
        try {
            await authService.signOut();
            setIsLoggedIn(false);
            setIsAdmin(false);
            setCurrentUser(null);
            localStorage.removeItem('ghadwa_user');
            logger.info('AUTH', '✅ User logged out successfully');
        } catch (error) {
            logger.error('AUTH', '❌ Logout failed', error);
        }
        setActivePage('home');
    };

    // --- Admin Handlers (Using API Service) ---
    const updateOrderStatus = (id: number, status: string) => {
        logger.info('ADMIN_ORDERS', `📊 Order status updated`, { orderId: id, newStatus: status });
        setOrders(prev => prev.map(o => o.id === id ? {...o, status} : o));
        api.updateOrderStatus(id, status);
    };
    
    const handleDeleteOrder = (id: number) => {
        if(window.confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
            logger.warn('ADMIN_ORDERS', '🗑️ Order deleted', { orderId: id });
            setOrders(prev => prev.filter(o => o.id !== id));
            api.deleteOrder(id);
            if (activePage === 'admin-order-details' && selectedOrder?.id === id) {
                setActivePage('admin-orders');
            }
        }
    }
    
    const handleViewOrder = (order: Order) => {
        logger.debug('ADMIN_ORDERS', '👁️ Viewing order details', { orderId: order.id, chefName: order.chefName });
        setSelectedOrder(order);
        setActivePage('admin-order-details');
    }
    const toggleChefStatus = (id: number) => {
        const updatedChefs = chefs.map(c => c.id === id ? {...c, isOpen: !c.isOpen} : c);
        const chef = updatedChefs.find(c => c.id === id);
        logger.info('ADMIN_CHEFS', `🔄 Chef status toggled`, { chefId: id, chefName: chef?.name, isNowOpen: chef?.isOpen });
        setChefs(updatedChefs);
        if (chef) api.updateChef(chef);
    };
    const handleAddChef = (newChef: Chef) => {
        logger.info('ADMIN_CHEFS', '➕ New chef added', { chefName: newChef.name, specialty: newChef.specialty });
        setChefs([...chefs, newChef]);
        api.addChef(newChef);
    }
    const handleEditChef = (updatedChef: Chef) => {
        logger.info('ADMIN_CHEFS', '✏️ Chef updated', { chefId: updatedChef.id, chefName: updatedChef.name });
        setChefs(prev => prev.map(c => c.id === updatedChef.id ? updatedChef : c));
        api.updateChef(updatedChef);
    }
    
    const handleDeleteChef = (id: number) => { 
        if(window.confirm('هل أنت متأكد من حذف هذا الشيف؟')) {
            const chef = chefs.find(c => c.id === id);
            logger.warn('ADMIN_CHEFS', '🗑️ Chef deleted', { chefId: id, chefName: chef?.name });
            setChefs(prev => prev.filter(c => c.id !== id)); 
            api.deleteChef(id);
        }
    }
    
    const handleAddMeal = (newMeal: MenuItem) => {
        logger.info('ADMIN_MEALS', '➕ New meal added', { mealName: newMeal.name, price: newMeal.price });
        setMenuItems([...menuItems, newMeal]);
        api.addMenuItem(newMeal);
    }
    const handleEditMeal = (updatedMeal: MenuItem) => {
        logger.info('ADMIN_MEALS', '✏️ Meal updated', { mealId: updatedMeal.id, mealName: updatedMeal.name });
        setMenuItems(prev => prev.map(m => m.id === updatedMeal.id ? updatedMeal : m));
        api.updateMenuItem(updatedMeal);
    }
    
    const handleDeleteMeal = (id: number) => { 
        const meal = menuItems.find(m => m.id === id);
        logger.warn('ADMIN_MEALS', '🗑️ Meal deleted', { mealId: id, mealName: meal?.name });
        setMenuItems(prev => prev.filter(m => m.id !== id)); 
        api.deleteMenuItem(id);
    }
    
    const handleAddOffer = (newOffer: MenuItem) => {
        logger.info('ADMIN_OFFERS', '➕ New offer added', { offerName: newOffer.name, discount: newOffer.discount });
        setOffers([...offers, newOffer]);
        api.addOffer(newOffer);
    }
    const handleEditOffer = (updatedOffer: MenuItem) => {
        logger.info('ADMIN_OFFERS', '✏️ Offer updated', { offerId: updatedOffer.id, offerName: updatedOffer.name });
        setOffers(prev => prev.map(o => o.id === updatedOffer.id ? updatedOffer : o));
        api.updateOffer(updatedOffer);
    }
    
    const handleDeleteOffer = (id: number) => { 
        if(window.confirm('هل أنت متأكد من حذف هذا العرض؟')) {
            const offer = offers.find(o => o.id === id);
            logger.warn('ADMIN_OFFERS', '🗑️ Offer deleted', { offerId: id, offerName: offer?.name });
            setOffers(prev => prev.filter(o => o.id !== id)); 
            api.deleteOffer(id);
        }
    }
    
    const handleAddBox = (newBox: Box) => {
        logger.info('ADMIN_BOXES', '➕ New box added', { boxName: newBox.name, itemCount: newBox.items?.length || 0 });
        setBoxes([...boxes, newBox]);
        api.addBox(newBox);
    }
    const handleEditBox = (updatedBox: Box) => {
        logger.info('ADMIN_BOXES', '✏️ Box updated', { boxId: updatedBox.id, boxName: updatedBox.name });
        setBoxes(prev => prev.map(b => b.id === updatedBox.id ? updatedBox : b));
        api.updateBox(updatedBox);
    }
    
    const handleDeleteBox = (id: number) => { 
        if(window.confirm('هل أنت متأكد من حذف هذا البوكس؟')) {
            const box = boxes.find(b => b.id === id);
            logger.warn('ADMIN_BOXES', '🗑️ Box deleted', { boxId: id, boxName: box?.name });
            setBoxes(prev => prev.filter(b => b.id !== id)); 
            api.deleteBox(id);
        }
    }
    
    const handleAddBestSeller = (newItem: MenuItem) => {
        logger.info('ADMIN_BESTSELLERS', '➕ Best seller added', { itemName: newItem.name });
        setBestSellers([...bestSellers, newItem]);
        api.addBestSeller(newItem);
    }
    const handleEditBestSeller = (updatedItem: MenuItem) => {
        logger.info('ADMIN_BESTSELLERS', '✏️ Best seller updated', { itemId: updatedItem.id, itemName: updatedItem.name });
        setBestSellers(prev => prev.map(i => i.id === updatedItem.id ? updatedItem : i));
        api.updateBestSeller(updatedItem);
    }
    
    const handleDeleteBestSeller = (id: number) => { 
        if(window.confirm('هل أنت متأكد من حذف الوجبة من الأكثر مبيعاً؟')) {
            const item = bestSellers.find(i => i.id === id);
            logger.warn('ADMIN_BESTSELLERS', '🗑️ Best seller deleted', { itemId: id, itemName: item?.name });
            setBestSellers(prev => prev.filter(i => i.id !== id)); 
            api.deleteBestSeller(id);
        }
    }
    
    const handleAddPromo = (newPromo: PromoCode) => {
        logger.info('ADMIN_PROMOS', '➕ New promo code added', { code: newPromo.code, discount: newPromo.discount });
        setPromoCodes([...promoCodes, newPromo]);
        api.addPromoCode(newPromo);
    }
    const handleDeletePromo = (id: number) => { 
        if(window.confirm('هل أنت متأكد من حذف هذا الكوبون؟')) {
            setPromoCodes(prev => prev.filter(p => p.id !== id)); 
            api.deletePromoCode(id);
        }
    }

    const handleUpdateContactSettings = (newSettings: ContactSettings) => {
        setContactSettings(newSettings);
        api.updateContactSettings(newSettings);
    };

    // Review Handler
    const handleOpenReview = (item: MenuItem) => {
        setReviewItem(item);
        setReviewModalOpen(true);
    };

    const handleSubmitReview = (rating: number, comment: string) => {
        if (reviewItem) {
            const review = {
                id: Date.now(),
                itemId: reviewItem.id,
                rating,
                comment,
                date: new Date().toLocaleDateString('ar-EG'),
                customerName: 'عميل غدوة' // In a real app, use logged-in user name
            };
            
            // Update Menu Items state with new review logic (simplified)
            // Ideally we re-fetch or optimistically update specific item
            // For now we assume API call handles the backend
            api.addReview(review).then(() => {
                alert('شكراً لتقييمك! رأيك يهمنا ❤️');
                // Optional: Refresh menu items to show updated rating
                api.getMenuItems().then(setMenuItems);
            });
        }
        setReviewModalOpen(false);
    };

    const handlePlaceOrder = (formData: CheckoutForm) => {
        logger.info('ORDER', '📦 New order being placed', { 
            customerName: formData.name,
            itemCount: cart.length,
            totalItems: cart.reduce((sum, i) => sum + i.quantity, 0)
        });

        const totalBeforeDiscount = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
        const discountAmount = formData.discountApplied || 0;
        const finalTotal = totalBeforeDiscount - discountAmount;

        logger.debug('ORDER', '💰 Order pricing', {
            subtotal: totalBeforeDiscount,
            discount: discountAmount,
            finalTotal: finalTotal
        });

        const newOrder: Order = {
            id: Math.floor(Math.random() * 10000),
            customer: formData.name,
            phone: formData.phone,
            address: formData.address,
            date: new Date().toISOString().split('T')[0],
            total: finalTotal,
            status: "pending",
            items: cart.map(i => i.name).join(", "),
            itemsDetails: cart.map(i => ({...i}))
        };
        
        logger.info('ORDER', '✅ Order created with ID', { orderId: newOrder.id });
        
        setOrders([newOrder, ...orders]);
        
        api.submitOrder(newOrder).then(success => {
            if(success) {
                logger.info('ORDER', '🎉 Order submitted successfully to API', { orderId: newOrder.id });
                setCart([]);
                setOrderSuccess({ isOpen: true, orderId: newOrder.id });
                logger.info('ORDER', '🛒 Cart cleared after order placement');
            } else {
                logger.error('ORDER', '❌ Order submission failed', { orderId: newOrder.id });
                alert('عذراً، حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.');
                // Remove the failed order from state
                setOrders(orders.filter(o => o.id !== newOrder.id));
            }
        });
    };

    if (isLoading) {
        logger.debug('APP', '⏳ App still loading, showing loading screen');
        return <LoadingScreen />;
    }

    logger.info('APP', '🎨 Rendering application UI');

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans">
            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onLogin={handleLogin} />
            <MenuModal isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
            <CartDrawer 
                isOpen={isCartOpen} 
                onClose={() => setIsCartOpen(false)} 
                cart={cart} 
                updateQuantity={updateQuantity} 
                onCheckout={() => {
                    setIsCartOpen(false);
                    setActivePage('checkout');
                }} 
                onClearCart={() => setIsClearCartModalOpen(true)}
            />
            <ChefConflictModal 
                isOpen={conflictModal.isOpen} 
                onClose={() => setConflictModal({ isOpen: false, item: null, newQuantity: 0 })}
                onConfirm={handleClearCartAndAdd}
                currentChef={currentChefName}
                newChef={conflictModal.item?.chef}
            />
            <OrderSuccessModal 
                isOpen={orderSuccess.isOpen} 
                orderId={orderSuccess.orderId} 
                onTrack={() => {
                    setOrderSuccess({ ...orderSuccess, isOpen: false });
                    setTrackOrderId(orderSuccess.orderId);
                    setActivePage('track-order');
                }}
                onClose={() => {
                    setOrderSuccess({ ...orderSuccess, isOpen: false });
                    setActivePage('home');
                }} 
            />
            <ClearCartModal 
                isOpen={isClearCartModalOpen}
                onClose={() => setIsClearCartModalOpen(false)}
                onConfirm={handleClearCart}
            />
            
            <ReviewModal 
                isOpen={reviewModalOpen}
                onClose={() => setReviewModalOpen(false)}
                onSubmit={handleSubmitReview}
                itemName={reviewItem?.name || ''}
            />

            {isAdmin && activePage.startsWith('admin') ? (
                <div className="flex bg-gray-50 min-h-screen">
                    <AdminSidebar activePage={activePage} onNavigate={setActivePage} onLogout={handleLogout} />
                    <div className="flex-1 md:mr-64 p-8">
                         {activePage === 'admin-dashboard' && (
                            <AdminDashboard 
                                orders={orders} 
                                chefs={chefs} 
                                mealsCount={menuItems.length} 
                                offersCount={offers.length} 
                                visitorsCount={visitors} 
                                onNavigate={setActivePage}
                            />
                         )}
                         {activePage === 'admin-orders' && <AdminOrders orders={orders} updateOrderStatus={updateOrderStatus} onDeleteOrder={handleDeleteOrder} onViewOrder={handleViewOrder} />}
                         {activePage === 'admin-order-details' && <AdminOrderDetails order={selectedOrder} onBack={() => setActivePage('admin-orders')} updateOrderStatus={updateOrderStatus} />}
                         {activePage === 'admin-chefs' && <AdminChefs chefs={chefs} orders={orders} toggleChefStatus={toggleChefStatus} onAdd={handleAddChef} onEdit={handleEditChef} onDelete={handleDeleteChef} />}
                         {activePage === 'admin-meals' && <AdminMeals meals={menuItems} chefs={chefs} onAdd={handleAddMeal} onEdit={handleEditMeal} onDelete={handleDeleteMeal} />}
                         {activePage === 'admin-offers' && <AdminOffers offers={offers} chefs={chefs} onAdd={handleAddOffer} onEdit={handleEditOffer} onDelete={handleDeleteOffer} />}
                         {activePage === 'admin-boxes' && <AdminBoxes boxes={boxes} chefs={chefs} onAdd={handleAddBox} onEdit={handleEditBox} onDelete={handleDeleteBox} />}
                         {activePage === 'admin-bestsellers' && <AdminBestSellers bestSellers={bestSellers} chefs={chefs} onAdd={handleAddBestSeller} onEdit={handleEditBestSeller} onDelete={handleDeleteBestSeller} />}
                         {activePage === 'admin-promos' && <AdminPromoCodes promoCodes={promoCodes} onAdd={handleAddPromo} onDelete={handleDeletePromo} />}
                         {activePage === 'admin-settings' && <AdminContactSettings settings={contactSettings} onUpdate={handleUpdateContactSettings} />}
                    </div>
                </div>
            ) : (
                <>
                    <Navbar 
                        onNavigate={setActivePage} 
                        currentPage={activePage} 
                        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
                        favoritesCount={favorites.length} 
                        onOpenCart={() => setIsCartOpen(true)}
                        onOpenAuth={() => setIsAuthOpen(true)}
                        onOpenMenu={() => setIsMenuOpen(true)}
                        isLoggedIn={isLoggedIn}
                        onLogout={handleLogout}
                        isAdmin={isAdmin}
                        contactSettings={contactSettings}
                    />
                    
                    {activePage === 'home' && (
                        <main>
                            <Hero onNavigate={setActivePage} onOpenMenu={() => setIsMenuOpen(true)} onOpenAuth={() => setIsAuthOpen(true)} />
                            
                            {activeOrder && (
                                <LiveOrderTracker 
                                    order={activeOrder} 
                                    onTrackClick={() => {
                                        setTrackOrderId(activeOrder.id);
                                        setActivePage('track-order');
                                    }} 
                                />
                            )}

                            <Features />
                            <WeeklyOffers offers={offers} cart={cart} updateQuantity={updateQuantity} />
                            
                            {/* Categories Removed */}

                            <ChefsSection onNavigate={setActivePage} onChefClick={(chef) => {
                                setSelectedChef(chef);
                                setActivePage('chef-details');
                            }} chefs={chefs} />
                            <BestSellers cart={cart} updateQuantity={updateQuantity} chefs={chefs} bestSellers={bestSellers} />
                            <BoxesSection boxes={boxes} cart={cart} updateQuantity={updateQuantity} />
                            <FullMenu menuItems={menuItems} cart={cart} updateQuantity={updateQuantity} />
                        </main>
                    )}

                    {activePage === 'track-order' && (
                        <TrackOrderPage 
                            orders={orders}
                            initialOrderId={trackOrderId}
                            onBack={() => setActivePage('home')}
                            onRateItem={handleOpenReview}
                        />
                    )}

                    {activePage === 'chef-details' && selectedChef && (
                         <ChefDetailsPage 
                            chef={selectedChef} 
                            onBack={() => setActivePage('home')}
                            cart={cart}
                            updateQuantity={updateQuantity}
                            meals={menuItems.filter(m => m.chef === selectedChef.name)}
                         />
                    )}

                    {activePage === 'all-chefs' && (
                        <AllChefsPage 
                            chefs={chefs} 
                            onBack={() => setActivePage('home')}
                            onChefClick={(chef) => {
                                setSelectedChef(chef);
                                setActivePage('chef-details');
                            }}
                        />
                    )}

                    {activePage === 'favorites' && (
                        <FavoritesPage 
                            favorites={favorites} 
                            cart={cart} 
                            updateQuantity={updateQuantity} 
                            onBack={() => setActivePage('home')}
                        />
                    )}

                    {activePage === 'checkout' && (
                        <CheckoutPage 
                            cart={cart}
                            onBack={() => setActivePage('home')}
                            onPlaceOrder={handlePlaceOrder}
                            promoCodes={promoCodes}
                        />
                    )}
                    
                    <Footer contactSettings={contactSettings} />
                </>
            )}
        </div>
    );
};

export default App;
