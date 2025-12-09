
import React, { useState, useEffect } from 'react';
import { Chef, Order, MenuItem, Box, CartItem, CheckoutForm, PromoCode, ContactSettings } from './types';
import { INITIAL_CHEFS, INITIAL_ORDERS, INITIAL_MENU_ITEMS, INITIAL_OFFERS, INITIAL_BOXES, INITIAL_BEST_SELLERS, INITIAL_PROMO_CODES, INITIAL_CONTACT_SETTINGS } from './constants';
import { api } from './services/api';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal, MenuModal, ChefConflictModal, OrderSuccessModal, ClearCartModal } from './components/Modals';
import { LoadingScreen } from './components/UIHelpers';
import { WeeklyOffers } from './components/home/WeeklyOffers';
import { ChefsSection } from './components/home/ChefsSection';
import { BestSellers } from './components/home/BestSellers';
import { BoxesSection } from './components/home/BoxesSection';
import { FullMenu } from './components/home/FullMenu';
import { Categories } from './components/home/Categories';

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
    const [activePage, setActivePage] = useState('home');
    const [isLoading, setIsLoading] = useState(true);
    
    // Data State
    const [chefs, setChefs] = useState<Chef[]>(INITIAL_CHEFS);
    const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
    const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
    const [offers, setOffers] = useState<MenuItem[]>(INITIAL_OFFERS);
    const [boxes, setBoxes] = useState<Box[]>(INITIAL_BOXES);
    const [bestSellers, setBestSellers] = useState<MenuItem[]>(INITIAL_BEST_SELLERS);
    const [promoCodes, setPromoCodes] = useState<PromoCode[]>(INITIAL_PROMO_CODES);
    const [contactSettings, setContactSettings] = useState<ContactSettings>(INITIAL_CONTACT_SETTINGS);
    const [visitors, setVisitors] = useState(1250);

    // App State
    const [selectedChef, setSelectedChef] = useState<Chef | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [trackOrderId, setTrackOrderId] = useState<number | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [favorites, setFavorites] = useState<MenuItem[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState<{ isOpen: boolean; orderId: number | null }>({ isOpen: false, orderId: null });
    const [conflictModal, setConflictModal] = useState<{ isOpen: boolean; item: MenuItem | null; newQuantity: number }>({ isOpen: false, item: null, newQuantity: 0 });
    const [isClearCartModalOpen, setIsClearCartModalOpen] = useState(false);

    const currentChefName = cart.length > 0 ? cart[0].chef : null;

    // Fetch Data on Mount
    useEffect(() => {
        const loadData = async () => {
            try {
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

                // Only update if fetch returned data, otherwise stick to INITIAL constants
                if (chefsData.length) setChefs(chefsData);
                if (menuData.length) setMenuItems(menuData);
                if (offersData.length) setOffers(offersData);
                if (boxesData.length) setBoxes(boxesData);
                if (bestSellersData.length) setBestSellers(bestSellersData);
                if (promosData.length) setPromoCodes(promosData);
                
                // Orders start empty usually, but if fetched, set them
                if (ordersData) setOrders(ordersData);
                if (settingsData) setContactSettings(settingsData);
                
            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    const updateQuantity = (id: number, newQty: number, itemToAdd?: MenuItem) => {
        if (newQty < 0) return;

        if (itemToAdd && cart.length > 0 && itemToAdd.chef && currentChefName && itemToAdd.chef !== currentChefName) {
            setConflictModal({ isOpen: true, item: itemToAdd, newQuantity: 1 });
            return;
        }

        if (newQty === 0) {
            setCart(prev => prev.filter(item => item.id !== id));
        } else {
            setCart(prev => {
                const exists = prev.find(item => item.id === id);
                if (exists) {
                    return prev.map(item => item.id === id ? { ...item, quantity: newQty } : item);
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
             setCart([{ ...item, quantity: newQuantity }]);
        }
        setConflictModal({ isOpen: false, item: null, newQuantity: 0 });
    };

    const handleClearCart = () => {
        setCart([]);
        setIsClearCartModalOpen(false);
    };

    const handleLogin = (type: string) => {
        setIsLoggedIn(true);
        if (type === 'admin') {
            setIsAdmin(true);
            setActivePage('admin-dashboard');
        } else {
            setIsAdmin(false);
            setActivePage('home');
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setIsAdmin(false);
        setActivePage('home');
    };

    // --- Admin Handlers (Using API Service) ---
    const updateOrderStatus = (id: number, status: string) => {
        // Optimistic update
        setOrders(prev => prev.map(o => o.id === id ? {...o, status} : o));
        api.updateOrderStatus(id, status);
    };
    
    // Explicit Delete Handlers with window.confirm
    const handleDeleteOrder = (id: number) => {
        if(window.confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
            setOrders(prev => prev.filter(o => o.id !== id));
            api.deleteOrder(id);
            if (activePage === 'admin-order-details' && selectedOrder?.id === id) {
                setActivePage('admin-orders');
            }
        }
    }
    
    const handleViewOrder = (order: Order) => {
        setSelectedOrder(order);
        setActivePage('admin-order-details');
    }
    const toggleChefStatus = (id: number) => {
        const updatedChefs = chefs.map(c => c.id === id ? {...c, isOpen: !c.isOpen} : c);
        setChefs(updatedChefs);
        const chef = updatedChefs.find(c => c.id === id);
        if (chef) api.updateChef(chef);
    };
    const handleAddChef = (newChef: Chef) => {
        setChefs([...chefs, newChef]);
        api.addChef(newChef);
    }
    const handleEditChef = (updatedChef: Chef) => {
        setChefs(prev => prev.map(c => c.id === updatedChef.id ? updatedChef : c));
        api.updateChef(updatedChef);
    }
    
    const handleDeleteChef = (id: number) => { 
        if(window.confirm('هل أنت متأكد من حذف هذا الشيف؟')) {
            setChefs(prev => prev.filter(c => c.id !== id)); 
            api.deleteChef(id);
        }
    }
    
    const handleAddMeal = (newMeal: MenuItem) => {
        setMenuItems([...menuItems, newMeal]);
        api.addMenuItem(newMeal);
    }
    const handleEditMeal = (updatedMeal: MenuItem) => {
        setMenuItems(prev => prev.map(m => m.id === updatedMeal.id ? updatedMeal : m));
        api.updateMenuItem(updatedMeal);
    }
    
    const handleDeleteMeal = (id: number) => { 
        if(window.confirm('هل أنت متأكد من حذف هذه الوجبة؟')) {
            setMenuItems(prev => prev.filter(m => m.id !== id)); 
            api.deleteMenuItem(id);
        }
    }
    
    const handleAddOffer = (newOffer: MenuItem) => {
        setOffers([...offers, newOffer]);
        api.addOffer(newOffer);
    }
    const handleEditOffer = (updatedOffer: MenuItem) => {
        setOffers(prev => prev.map(o => o.id === updatedOffer.id ? updatedOffer : o));
        api.updateOffer(updatedOffer);
    }
    
    const handleDeleteOffer = (id: number) => { 
        if(window.confirm('هل أنت متأكد من حذف هذا العرض؟')) {
            setOffers(prev => prev.filter(o => o.id !== id)); 
            api.deleteOffer(id);
        }
    }
    
    const handleAddBox = (newBox: Box) => {
        setBoxes([...boxes, newBox]);
        api.addBox(newBox);
    }
    const handleEditBox = (updatedBox: Box) => {
        setBoxes(prev => prev.map(b => b.id === updatedBox.id ? updatedBox : b));
        api.updateBox(updatedBox);
    }
    
    const handleDeleteBox = (id: number) => { 
        if(window.confirm('هل أنت متأكد من حذف هذا البوكس؟')) {
            setBoxes(prev => prev.filter(b => b.id !== id)); 
            api.deleteBox(id);
        }
    }
    
    const handleAddBestSeller = (newItem: MenuItem) => {
        setBestSellers([...bestSellers, newItem]);
        api.addBestSeller(newItem);
    }
    const handleEditBestSeller = (updatedItem: MenuItem) => {
        setBestSellers(prev => prev.map(i => i.id === updatedItem.id ? updatedItem : i));
        api.updateBestSeller(updatedItem);
    }
    
    const handleDeleteBestSeller = (id: number) => { 
        if(window.confirm('هل أنت متأكد من حذف الوجبة من الأكثر مبيعاً؟')) {
            setBestSellers(prev => prev.filter(i => i.id !== id)); 
            api.deleteBestSeller(id);
        }
    }
    
    // Promo Handlers
    const handleAddPromo = (newPromo: PromoCode) => {
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

    const handlePlaceOrder = (formData: CheckoutForm) => {
        // Total includes food subtotal - discount. Delivery is excluded and determined later.
        const totalBeforeDiscount = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
        const discountAmount = formData.discountApplied || 0;
        const finalTotal = totalBeforeDiscount - discountAmount;

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
        
        // Update Local State for UI
        setOrders([newOrder, ...orders]);
        
        // Simulate sending to backend (Company)
        api.submitOrder(newOrder).then(success => {
            if(success) console.log("Order submitted successfully");
        });
        
        // Clear Cart and Show Success Modal immediately
        setCart([]);
        setOrderSuccess({ isOpen: true, orderId: newOrder.id });
    };

    if (isLoading) {
        return <LoadingScreen />;
    }

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

            {isAdmin && activePage.startsWith('admin') ? (
                <div className="flex bg-gray-50 min-h-screen">
                    <AdminSidebar activePage={activePage} onNavigate={setActivePage} onLogout={handleLogout} />
                    <div className="flex-1 md:mr-64 p-8">
                         {activePage === 'admin-dashboard' && <AdminDashboard orders={orders} chefs={chefs} mealsCount={menuItems.length} visitorsCount={visitors} />}
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
                            <Features />
                            <WeeklyOffers offers={offers} cart={cart} updateQuantity={updateQuantity} />
                            <Categories onCategoryClick={(cat) => {
                                const el = document.getElementById('menu');
                                if(el) el.scrollIntoView({behavior: 'smooth'});
                            }} />
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
