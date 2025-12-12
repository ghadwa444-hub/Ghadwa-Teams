# Ghadwa App - Agents Guide

This guide helps AI agents and developers quickly understand the Ghadwa application architecture, key features, and critical components.

## Quick Start for Agents

### What is Ghadwa?
Ghadwa is a **food delivery platform** connecting home chefs with customers. It's a full-stack React application with:
- Customer-facing marketplace
- Admin dashboard
- Real-time order tracking
- Review and rating system
- Shopping cart with multiple chef support
- Promotional features (offers, promo codes, meal boxes)

### Primary Objective
Enable customers to discover, order, and receive homemade food from local chefs while providing chefs and admins with management tools.

---

## Core Business Logic

### Key Concepts

#### 1. **Chef-Centric Model**
- Each chef has a profile with specialty, rating, working hours
- Chefs can have multiple menu items
- Orders are chef-specific (cart can have items from one chef at a time)
- Chef status determines if they're accepting orders (isOpen: boolean)

#### 2. **Shopping Cart Constraints**
- **Single Chef Rule**: Cart items must be from ONE chef only
- **Conflict Resolution**: When adding items from different chef, user sees conflict modal
- **Clear Cart Option**: User can clear cart to switch chefs
- Cart stored in React state (can be persisted)

#### 3. **Order Lifecycle**
```
pending → preparing → on-the-way → delivered
```
Each stage represents order progression from acceptance to delivery.

#### 4. **Pricing Strategy**
- Base item price
- Optional old price (for sale items)
- Discount percentage application
- Promo code discount support
- Total calculation: (item_price × quantity) - discounts

#### 5. **Category System**
Menu categories: "الكل", "مشويات", "محاشي", "طواجن", "أكل شعبي", "حلويات"
- Filter menu items by category
- Default "الكل" (All) category

---

## Critical Components Architecture

### Component Hierarchy & Dependencies

```
App.tsx (Root State Manager)
│
├── Navbar (Navigation)
│   ├── Search functionality
│   ├── Cart icon (trigger CartDrawer)
│   ├── Auth toggle (trigger AuthModal)
│   └── Admin toggle (switch to admin mode)
│
├── CartDrawer (Shopping Cart)
│   ├── Cart items display
│   ├── Quantity controls
│   ├── Promo code input
│   ├── Total calculation
│   └── Checkout button
│
├── Pages (Route-based views)
│   ├── Home (default landing page)
│   ├── ChefDetailsPage
│   ├── CheckoutPage
│   ├── AllChefsPage
│   ├── FavoritesPage
│   └── TrackOrderPage
│
├── Modals
│   ├── AuthModal (login)
│   ├── MenuModal (item details)
│   ├── ChefConflictModal (cart conflict)
│   ├── OrderSuccessModal (confirmation)
│   ├── ReviewModal (ratings)
│   └── ClearCartModal (confirmation)
│
└── Admin Interface (conditional rendering)
    ├── AdminSidebar (navigation)
    └── Admin Panels:
        ├── AdminDashboard (overview)
        ├── AdminOrders (manage orders)
        ├── AdminMeals (manage menu)
        ├── AdminChefs (manage chefs)
        ├── AdminOffers (manage promotions)
        ├── AdminBoxes (manage meal boxes)
        ├── AdminBestSellers (configure best sellers)
        ├── AdminPromoCodes (manage discounts)
        └── AdminContactSettings (manage contact info)
```

---

## State Management Map

### Critical App State Variables

```typescript
// Data State (fetched from API/localStorage)
chefs: Chef[]                           // All available chefs
orders: Order[]                         // All orders history
menuItems: MenuItem[]                   // All menu items
offers: MenuItem[]                      // Weekly promotional offers
boxes: Box[]                            // Meal packages/boxes
bestSellers: MenuItem[]                 // Top-selling items
promoCodes: PromoCode[]                 // Discount codes
contactSettings: ContactSettings        // App contact info
visitors: number                        // Visitor count metric

// User State
isLoggedIn: boolean                     // Authentication status
isAdmin: boolean                        // Admin access level
cart: CartItem[]                        // Current shopping cart
favorites: MenuItem[]                   // Saved favorite items

// UI State
activePage: string                      // Current page/route
selectedChef: Chef | null              // Currently viewed chef
selectedOrder: Order | null            // Currently viewing order
trackOrderId: number | null            // Order being tracked

// Modal States
isAuthOpen: boolean                     // Auth modal visibility
isMenuOpen: boolean                     // Menu modal visibility
isCartOpen: boolean                     // Cart drawer visibility
orderSuccess: { isOpen, orderId }      // Success modal
conflictModal: { isOpen, item, newQuantity } // Conflict modal
isClearCartModalOpen: boolean           // Clear cart confirmation

// Review State
reviewModalOpen: boolean                // Review modal visibility
reviewItem: MenuItem | null             // Item being reviewed
```

### Computed Values (Important)
```typescript
currentChefName = cart.length > 0 ? cart[0].chef : null
// Determines which chef's items are in cart

activeOrder = orders.find(o => o.status !== 'delivered')
// Most recent active order for live tracker
```

---

## API Service Layer (services/api.ts)

### Storage-Based Architecture
The app uses **localStorage** as its data persistence layer. All API calls simulate async operations with 500ms delay.

### Key API Methods

#### Chef Operations
```typescript
api.getChefs()              // GET all chefs
api.updateChef(id, data)    // UPDATE chef profile
api.createChef(data)        // CREATE new chef
```

#### Order Operations
```typescript
api.getOrders()             // GET all orders
api.createOrder(order)      // CREATE new order
api.updateOrderStatus(id, status) // UPDATE order status
api.getOrderById(id)        // GET specific order
```

#### Menu Operations
```typescript
api.getMenuItems()          // GET all menu items
api.addMenuItem(item)       // CREATE menu item
api.updateMenuItem(id, data) // UPDATE menu item
api.deleteMenuItem(id)      // DELETE menu item
```

#### Promotional Operations
```typescript
api.getOffers()             // GET weekly offers
api.getBoxes()              // GET meal boxes
api.getBestSellers()        // GET best sellers
api.getPromoCodes()         // GET promo codes
api.applyPromoCode(code)    // VALIDATE & APPLY promo code
```

#### Settings Operations
```typescript
api.getContactSettings()    // GET contact info
api.updateContactSettings() // UPDATE contact info
```

#### Review Operations
```typescript
api.addReview(itemId, review)  // ADD new review
api.getReviews(itemId)         // GET reviews for item
```

### Storage Keys (localStorage)
```
ghadwa_chefs
ghadwa_orders
ghadwa_menu
ghadwa_offers
ghadwa_boxes
ghadwa_best_sellers
ghadwa_promos
ghadwa_settings
```

---

## Feature Implementation Guides

### Feature 1: Shopping Cart System

**Files Involved**: 
- `App.tsx` (state management)
- `components/CartDrawer.tsx` (UI)
- `services/api.ts` (persistence)

**Key Logic**:
1. Add item to cart: Check if item's chef matches cart's chef
2. If different chef: Show `ChefConflictModal`
3. Update quantity: Recalculate total
4. Apply promo code: Validate and apply discount
5. Checkout: Create order and clear cart

**Critical State Operations**:
```typescript
// Adding item
if (cart.length > 0 && cart[0].chef !== item.chef) {
  // Show conflict modal - user chooses to clear or cancel
} else {
  // Add item or update quantity
}

// Calculating total
const total = cart.reduce((sum, item) => 
  sum + (item.price * item.quantity), 0) - discount
```

### Feature 2: Order Management

**Files Involved**:
- `App.tsx` (state)
- `pages/TrackOrderPage.tsx` (tracking)
- `components/home/LiveOrderTracker.tsx` (real-time display)
- `components/admin/AdminOrders.tsx` (admin control)
- `services/api.ts` (CRUD)

**Order Statuses**:
- `pending`: Order received, awaiting preparation
- `preparing`: Chef is preparing items
- `on-the-way`: Order in delivery
- `delivered`: Order completed

**Key Functions**:
```typescript
// Create order
const newOrder = {
  id: Math.max(...orders.map(o => o.id)) + 1,
  items: cart,
  total: calculatedTotal,
  status: 'pending',
  date: new Date().toISOString(),
  chefName: currentChef.name,
  // ... other fields
}

// Update status (admin)
api.updateOrderStatus(orderId, 'preparing')

// Get active order for tracking
const activeOrder = orders.find(o => o.status !== 'delivered')
```

### Feature 3: Review System

**Files Involved**:
- `types.ts` (Review interface)
- `components/Modals.tsx` (ReviewModal)
- `components/home/FullMenu.tsx` (rating display)
- `services/api.ts` (storage)

**Review Structure**:
```typescript
interface Review {
  id: number
  itemId: number
  rating: number (1-5)
  comment: string
  date: string
  customerName: string
}
```

**Key Operations**:
```typescript
// Add review
api.addReview(itemId, {
  id: Math.random(),
  itemId,
  rating: selectedRating,
  comment: reviewText,
  date: new Date().toLocaleDateString('ar-EG'),
  customerName: userName
})

// Display reviews
const itemReviews = menuItem.reviewsList || []
const avgRating = itemReviews.length > 0 
  ? (itemReviews.reduce((sum, r) => sum + r.rating, 0) / itemReviews.length).toFixed(1)
  : 'N/A'
```

### Feature 4: Admin Dashboard

**Files Involved**:
- `components/admin/*` (all admin components)
- `App.tsx` (route and state management)
- `services/api.ts` (data operations)

**Admin Sections**:
1. **Orders**: View, track, and update order status
2. **Meals**: Create, edit, delete menu items
3. **Chefs**: Manage chef profiles and availability
4. **Offers**: Configure weekly promotional items
5. **Boxes**: Create and manage meal boxes
6. **Best Sellers**: Configure top-selling items
7. **Promo Codes**: Create and manage discount codes
8. **Contact Settings**: Update app contact information

**Admin Access Gate**:
```typescript
if (!isAdmin) {
  setActivePage('home')
  return // Redirect to home
}
```

### Feature 5: Favorites System

**Files Involved**:
- `App.tsx` (state: favorites)
- `pages/FavoritesPage.tsx` (display)
- `components/UIHelpers.tsx` (heart icon)

**Key Logic**:
```typescript
// Add to favorites
setFavorites([...favorites, item])

// Remove from favorites
setFavorites(favorites.filter(f => f.id !== item.id))

// Check if favorited
const isFavorited = favorites.some(f => f.id === item.id)
```

### Feature 6: Search & Filter

**Files Involved**:
- `components/Navbar.tsx` (search input)
- `components/home/FullMenu.tsx` (filtering logic)
- `components/home/Categories.tsx` (category filter)

**Filtering Logic**:
```typescript
// By search term
const filtered = menuItems.filter(item =>
  item.name.includes(searchTerm) || 
  item.desc?.includes(searchTerm)
)

// By category
const filtered = menuItems.filter(item =>
  item.category === selectedCategory
)

// By chef
const filtered = menuItems.filter(item =>
  item.chef === selectedChef
)
```

---

## Most Important Components

### Tier 1: Critical Components (App Won't Work Without)

1. **App.tsx**
   - Root component managing all global state
   - Handles data fetching, routing, modal management
   - ~500+ lines of critical logic
   - **Never refactor without understanding full impact**

2. **services/api.ts**
   - All data persistence logic
   - localStorage integration
   - Mock API layer
   - **Changing this affects entire app data flow**

3. **types.ts**
   - All TypeScript interfaces
   - Data structure definitions
   - **Breaking these interfaces breaks multiple components**

### Tier 2: Feature-Critical Components (Features Won't Work Without)

4. **components/CartDrawer.tsx**
   - Shopping cart UI
   - Total calculation
   - Promo code application
   - **Essential for e-commerce flow**

5. **components/home/FullMenu.tsx**
   - Menu display and filtering
   - Category selection
   - Search integration
   - **Core browsing experience**

6. **components/admin/AdminDashboard.tsx** + **Admin sidebar**
   - Admin interface routing
   - All admin operations
   - **Essential for content management**

7. **components/Navbar.tsx**
   - Navigation and search
   - Cart/auth access
   - Admin toggle
   - **User access point**

8. **pages/CheckoutPage.tsx**
   - Order creation logic
   - Form validation
   - **Critical for sales flow**

### Tier 3: Important Components (Enhance Features)

9. **components/home/LiveOrderTracker.tsx** - Real-time order tracking
10. **pages/ChefDetailsPage.tsx** - Chef profile and menu
11. **components/Modals.tsx** - All modal functionality
12. **components/home/ChefsSection.tsx** - Chef discovery

---

## Data Flow Examples

### Example 1: Adding Item to Cart

```
User clicks "Add to Cart" in FullMenu.tsx
  ↓
Check: Cart empty OR item.chef === cart[0].chef?
  ├─ YES: Add item to cart state, update CartDrawer
  └─ NO: Show ChefConflictModal
        User chooses "Switch Chef" → Clear cart → Add item
        User chooses "Cancel" → Keep current cart
  ↓
CartDrawer updates with new item
  ↓
Calculate and display new total
  ↓
On checkout → api.createOrder() → localStorage updated
```

### Example 2: Updating Order Status (Admin)

```
Admin clicks order in AdminOrders.tsx
  ↓
Shows AdminOrderDetails.tsx
  ↓
Admin changes status dropdown
  ↓
Calls api.updateOrderStatus(orderId, newStatus)
  ↓
Updates localStorage
  ↓
Updates orders state in App.tsx
  ↓
LiveOrderTracker.tsx reflects change in real-time
  ↓
Customer sees status change on TrackOrderPage.tsx
```

### Example 3: Adding Menu Item (Admin)

```
Admin navigates to AdminMeals.tsx
  ↓
Clicks "Add New Meal"
  ↓
Fills form with item details
  ↓
Submits → api.addMenuItem(newItem)
  ↓
New item saved to localStorage
  ↓
menuItems state updates in App.tsx
  ↓
FullMenu.tsx immediately shows new item
  ↓
Item appears in menu filters and searches
```

---

## Common Patterns Used

### Pattern 1: Modal Management
```typescript
// Boolean state for visibility
const [isModalOpen, setIsModalOpen] = useState(false)

// Trigger opening
<button onClick={() => setIsModalOpen(true)}>Open</button>

// Modal renders conditionally
{isModalOpen && <ModalComponent onClose={() => setIsModalOpen(false)} />}
```

### Pattern 2: Item Filtering
```typescript
const filtered = items.filter(item => {
  const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase())
  const matchesCategory = !category || item.category === category
  const matchesChef = !chef || item.chef === chef
  return matchesSearch && matchesCategory && matchesChef
})
```

### Pattern 3: Total Calculation
```typescript
const subtotal = cart.reduce((sum, item) => 
  sum + (item.price * item.quantity), 0)
const discount = subtotal * (discountPercent / 100)
const total = subtotal - discount
```

### Pattern 4: Async Data Loading
```typescript
useEffect(() => {
  const loadData = async () => {
    try {
      setIsLoading(true)
      const data = await api.getData()
      setState(data)
    } catch (error) {
      console.error('Failed to load:', error)
    } finally {
      setIsLoading(false)
    }
  }
  loadData()
}, []) // Dependency array
```

### Pattern 5: Conditional Rendering by User Type
```typescript
{isAdmin ? (
  <AdminInterface />
) : (
  <CustomerInterface />
)}
```

---

## Key Files Reference

| File | Purpose | Complexity | Impact |
|------|---------|-----------|--------|
| App.tsx | Root state and routing | HIGH | CRITICAL |
| services/api.ts | Data persistence | MEDIUM | CRITICAL |
| types.ts | Type definitions | LOW | HIGH |
| constants.ts | Initial data | LOW | MEDIUM |
| components/CartDrawer.tsx | Cart UI | MEDIUM | HIGH |
| components/home/FullMenu.tsx | Menu display | MEDIUM | HIGH |
| components/admin/* | Admin interface | MEDIUM | MEDIUM |
| components/Navbar.tsx | Navigation | MEDIUM | MEDIUM |
| pages/CheckoutPage.tsx | Order creation | MEDIUM | HIGH |
| components/Modals.tsx | All modals | MEDIUM | MEDIUM |

---

## Performance Considerations

### Current Bottlenecks
1. **No code splitting**: All components loaded at once
2. **No image optimization**: Direct URLs from external sources
3. **localStorage limitation**: No pagination for large datasets
4. **Re-renders**: Props drilling causes unnecessary re-renders

### Optimization Priorities
1. Implement React.lazy() for routes
2. Add useMemo/useCallback for expensive operations
3. Implement image lazy loading
4. Consider Context API or state management library

---

## Testing Checklist

### Unit Tests to Write
- [ ] Cart add/remove/update logic
- [ ] Total calculation with discounts
- [ ] Promo code validation
- [ ] Menu filtering by category/search
- [ ] Order status transitions

### Integration Tests
- [ ] Full checkout flow
- [ ] Admin create/update/delete operations
- [ ] Multi-chef cart conflict resolution
- [ ] Order tracking updates

### Manual Testing Paths
- [ ] Add item from different chefs
- [ ] Apply promo code and verify discount
- [ ] Complete checkout and verify order creation
- [ ] Update order status as admin and verify live update
- [ ] Add review and verify display
- [ ] Search and filter functionality

---

## Development Tips for Agents

### When Modifying App.tsx
1. Always preserve existing state structure
2. Update useEffect dependencies correctly
3. Test data flow through entire component tree
4. Verify modal state management
5. Check admin/customer mode switching

### When Adding New Features
1. Define data model in types.ts first
2. Add initial data in constants.ts
3. Implement API methods in services/api.ts
4. Add state management in App.tsx
5. Create UI components
6. Wire components to state in App.tsx
7. Test complete flow

### When Debugging
1. Check React DevTools for state shape
2. Inspect localStorage data
3. Verify API call responses
4. Check component props with console.log
5. Use network tab to see API calls (look for delays)

### Common Mistakes to Avoid
1. ❌ Forgetting to check currentChefName before adding to cart
2. ❌ Not updating API method when state structure changes
3. ❌ Forgetting to add dependencies to useEffect
4. ❌ Not handling async API calls properly
5. ❌ Modifying state directly instead of using setState
6. ❌ Breaking cart single-chef constraint

---

## Scaling Considerations

### When User Base Grows
1. Migrate from localStorage to real backend
2. Implement user authentication
3. Add payment processing
4. Scale image hosting
5. Implement CDN for assets
6. Add caching layer
7. Implement proper error handling

### When Data Grows
1. Add pagination to lists
2. Implement search with backend filtering
3. Archive old orders
4. Implement infinite scroll for menu
5. Add database indexing

---

## Architecture Decision Records (ADR)

### ADR 1: localStorage-Based API
**Decision**: Use localStorage instead of real backend
**Rationale**: Rapid prototyping, no backend dependency, instant data availability
**Tradeoff**: Not scalable, data lost on browser clear, no real persistence
**Future**: Replace with REST API when backend ready

### ADR 2: Single Chef Cart Constraint
**Decision**: Cart items must be from one chef only
**Rationale**: Simplifies delivery, matches real-world model, easier payment calculation
**Tradeoff**: Less flexible for customers wanting from multiple chefs
**Alternative**: Could implement multiple separate orders

### ADR 3: Props Drilling for State
**Decision**: Pass state through props instead of Context/Redux
**Rationale**: Simple for medium app size, easier to understand data flow
**Tradeoff**: Prop drilling in deeper components, harder to maintain at scale
**Future**: Migrate to Context API or Zustand when component tree grows

### ADR 4: All Modals in One Component
**Decision**: Manage all modals in Modals.tsx
**Rationale**: Easier to control modal priority, centralized modal state
**Tradeoff**: Modals.tsx file gets large, harder to maintain
**Alternative**: Create separate modal components

---

## Emergency Fixes (When Things Break)

### Cart Not Updating
1. Check App.tsx cart state
2. Verify api.createOrder() is called
3. Check localStorage for ghadwa_orders
4. Clear browser cache and localStorage

### Orders Not Showing
1. Verify api.getOrders() in useEffect
2. Check localStorage for ghadwa_orders
3. Ensure orders state is initialized
4. Check admin mode is properly set

### Admin Operations Not Saving
1. Verify isAdmin state is true
2. Check API method is called
3. Verify localStorage keys match KEYS object
4. Check network delay is completed

### Styling Missing (Tailwind not loading)
1. Verify CDN link in index.html
2. Hard refresh browser (Ctrl+Shift+R)
3. Check browser console for errors
4. Verify Tailwind config in script tag

---

## Glossary

- **Chef**: Home-based food provider with specialty items
- **MenuItem**: Individual dish/product offered by a chef
- **CartItem**: MenuItem with quantity in shopping cart
- **Promo Code**: Discount code with percentage/amount reduction
- **Box**: Pre-defined meal package/bundle
- **Best Sellers**: Top-ordered items across all chefs
- **Offer**: Limited-time promotional menu item
- **Order Status**: Current state of delivery (pending/preparing/on-the-way/delivered)
- **Review**: Customer rating and comment for menu item
- **isOpen**: Chef's current availability for accepting orders
- **isAdmin**: User's access level for admin operations

---

## Quick Navigation by Task

### I need to...
- **Add a new feature** → Review types.ts, constants.ts, add state to App.tsx, create component
- **Fix a bug** → Check services/api.ts, App.tsx state, component props
- **Optimize performance** → Review Re-render patterns, implement useMemo/useCallback
- **Add admin functionality** → Create component in admin/, add state to App.tsx, add API method
- **Change data model** → Update types.ts first, then constants.ts, then services/api.ts
- **Style component** → Use Tailwind classes, check index.html for custom animations
- **Handle user interaction** → Add onClick handler, update state via setState, trigger modal if needed
- **Display data from API** → Call api method in useEffect, store in state, render in component
- **Test the app** → Go to npm run dev, check console for errors, inspect localStorage

---

**Last Updated**: December 9, 2025  
**Version**: 1.0  
**For**: Copilot and AI Agents  
**Maintained By**: Ghadwa Development Team

