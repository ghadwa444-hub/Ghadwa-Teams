# Ghadwa Teams - Complete Documentation

## Project Overview

**Ghadwa** is a comprehensive food delivery platform that connects home chefs with customers, enabling them to order authentic homemade food for delivery. The platform features both a customer-facing interface and a powerful admin dashboard for managing chefs, meals, orders, and promotional content.

### Key Features
- 🍽️ **Chef Marketplace**: Browse and order from multiple home chefs
- 👨‍🍳 **Chef Profiles**: Detailed chef information with specialties, ratings, and working hours
- 🛒 **Shopping Cart**: Add items from multiple chefs with quantity management
- 📦 **Order Management**: Track orders in real-time with live status updates
- ⭐ **Ratings & Reviews**: Customer feedback system for menu items
- 💝 **Favorites**: Save favorite meals for quick reordering
- 🎁 **Promotional Features**: Weekly offers, promo codes, and special boxes
- 📊 **Admin Dashboard**: Comprehensive management tools for all platform data
- 🌍 **Multilingual Support**: RTL layout for Arabic (primary) and English support

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | React | 19.2.1 |
| **Build Tool** | Vite | 6.2.0 |
| **Language** | TypeScript | ~5.8.2 |
| **Styling** | Tailwind CSS | Latest (via CDN) |
| **Icons** | Font Awesome | 6.4.0 |
| **Fonts** | Cairo (Google Fonts) | Latest |
| **State Management** | React Hooks (useState, useEffect) | Native |
| **Storage** | Browser localStorage | Native |
| **Node Version** | Node.js LTS | Recommended |
| **Package Manager** | npm | Latest |

---

## Project Structure

```
Ghadwa-Teams/
├── App.tsx                          # Main application component
├── index.tsx                        # React app entry point
├── index.html                       # HTML template (RTL support)
├── vite.config.ts                   # Vite configuration
├── tsconfig.json                    # TypeScript configuration
├── package.json                     # Dependencies and scripts
├── constants.ts                     # Initial data and constants
├── types.ts                         # TypeScript type definitions
├── metadata.json                    # App metadata
├── DOCUMENTATION.md                 # This file
│
├── components/
│   ├── Navbar.tsx                   # Navigation bar with search and user menu
│   ├── Hero.tsx                     # Landing section hero banner
│   ├── Footer.tsx                   # Footer with contact and links
│   ├── Features.tsx                 # Features showcase section
│   ├── CartDrawer.tsx               # Shopping cart sidebar drawer
│   ├── Modals.tsx                   # Auth, menu, conflict, review modals
│   ├── UIHelpers.tsx                # Utility components (loading, badges, etc)
│   │
│   ├── home/
│   │   ├── WeeklyOffers.tsx         # Promotional offers carousel
│   │   ├── ChefsSection.tsx         # Featured chefs grid
│   │   ├── BestSellers.tsx          # Popular menu items section
│   │   ├── BoxesSection.tsx         # Meal boxes/packages section
│   │   ├── FullMenu.tsx             # Complete menu with filtering
│   │   ├── Categories.tsx           # Menu category selector
│   │   └── LiveOrderTracker.tsx     # Real-time order tracking
│   │
│   └── admin/
│       ├── AdminSidebar.tsx         # Admin navigation sidebar
│       ├── AdminDashboard.tsx       # Admin dashboard overview
│       ├── AdminOrders.tsx          # Orders management interface
│       ├── AdminOrderDetails.tsx    # Individual order details view
│       ├── AdminMeals.tsx           # Menu items management
│       ├── AdminChefs.tsx           # Chef profile management
│       ├── AdminOffers.tsx          # Promotional offers management
│       ├── AdminBoxes.tsx           # Meal boxes management
│       ├── AdminBestSellers.tsx     # Best sellers configuration
│       ├── AdminPromoCodes.tsx      # Promo codes management
│       └── AdminContactSettings.tsx # Contact information settings
│
├── pages/
│   ├── ChefDetailsPage.tsx          # Chef profile and menu page
│   ├── CheckoutPage.tsx             # Cart review and checkout
│   ├── AllChefsPage.tsx             # Browse all available chefs
│   ├── FavoritesPage.tsx            # User saved favorites
│   └── TrackOrderPage.tsx           # Order tracking details
│
└── services/
    └── api.ts                       # API service layer with localStorage persistence
```

---

## Data Models

### Chef
```typescript
interface Chef {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  orders: string;              // e.g., "1.2k"
  img: string;                 // Profile image URL
  bio: string;                 // Chef biography
  cover: string;               // Cover/banner image URL
  isOpen: boolean;             // Currently accepting orders
  workingHours: string;        // Operating hours
  deliveryTime: string;        // Estimated delivery time
  badges: string[];            // Achievement badges
}
```

### MenuItem
```typescript
interface MenuItem {
  id: number;
  name: string;
  price: number;
  category?: string;
  categoryId?: string;
  chef?: string;               // Chef who made the item
  img: string;                 // Item image URL
  rating?: number;             // Customer rating
  time?: string;               // Preparation time
  desc?: string;               // Description
  oldPrice?: number;           // Original price (for offers)
  discount?: string;           // Discount percentage
  chefImg?: string;            // Chef's profile image
  orderCount?: number;         // Times ordered
  reviewsList?: Review[];      // Customer reviews
  expiryDate?: string;         // For limited-time offers
}
```

### Order
```typescript
interface Order {
  id: number;
  items: CartItem[];
  total: number;
  status: 'pending' | 'preparing' | 'on-the-way' | 'delivered';
  deliveryTime: string;
  date: string;
  chefName: string;
  customerName?: string;
  customerPhone?: string;
  address?: string;
  promoCode?: string;
  discount?: number;
}
```

### Other Models
- **CartItem**: MenuItem with quantity property
- **Box**: Meal packages/bundles
- **PromoCode**: Discount codes with terms
- **Review**: Customer ratings and comments
- **ContactSettings**: App contact information

---

## Getting Started

### Prerequisites
- **Node.js** (LTS version 18 or higher recommended)
- **npm** (comes with Node.js)
- A modern web browser (Chrome, Firefox, Safari, Edge)

### Installation Steps

#### 1. Clone the Repository
```bash
cd e:\Programming\Ghadwa-Teams
```

#### 2. Install Dependencies
```bash
npm install
```

This will install:
- `react` and `react-dom` for UI framework
- `vite` for fast development and production builds
- `typescript` for type safety
- `@vitejs/plugin-react` for React JSX support

#### 3. Environment Configuration (Optional)
Create a `.env.local` file in the root directory if you need to configure API keys:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_API_URL=http://localhost:3000
```

Note: Currently, the app uses localStorage for data persistence. The API layer is configured to read/write from browser storage.

#### 4. Start Development Server
```bash
npm run dev
```

The application will be available at:
- **Local**: `http://localhost:3000`
- **Network**: `http://0.0.0.0:3000`

---

## Development Commands

### Development
```bash
npm run dev
```
- Starts Vite development server with hot module replacement (HMR)
- Watch mode for automatic recompilation
- Available on port 3000
- Open `http://localhost:3000` in your browser

### Production Build
```bash
npm run build
```
- Creates optimized production bundle
- Output directory: `dist/`
- Minified CSS, JS, and images
- Ready for deployment

### Preview Production Build
```bash
npm run preview
```
- Serves the production build locally
- Useful for testing before deployment
- Available on port 4173 by default

---

## Configuration Files

### vite.config.ts
```typescript
- Port: 3000
- Host: 0.0.0.0 (accessible from network)
- React plugin enabled for JSX support
- Path alias: @ -> root directory
- Environment variables loaded from .env.local
- Gemini API key exposed to client-side
```

### tsconfig.json
```typescript
- Target: ES2022
- Module: ESNext
- JSX: react-jsx
- Strict: Enabled for type safety
- Path aliases configured for imports
```

### index.html
```html
- RTL layout (dir="rtl") for Arabic support
- Cairo font for Arabic typography
- Tailwind CSS via CDN
- Font Awesome icons
- Responsive viewport meta tags
- Custom animations and theming
```

---

## Core Features Explained

### 1. Authentication System
- Email/password login modal
- Admin access level verification
- Session management via React state
- Can be connected to backend auth service

### 2. Shopping Cart
- Multi-chef cart (items from different chefs)
- Quantity management with +/- controls
- Dynamic total calculation
- Promo code application
- Cart conflict resolution (switching chefs)
- Persistent cart state

### 3. Order Management
- Create, track, and manage orders
- Real-time status updates (pending → preparing → on-the-way → delivered)
- Order history display
- Live order tracker component for current active order

### 4. Admin Dashboard
- Complete data management interface
- Real-time updates via API service
- Multi-section management:
  - Orders monitoring and updates
  - Menu items CRUD operations
  - Chef profile management
  - Promotional content (offers, boxes, best sellers)
  - Promo code configuration
  - Contact settings

### 5. Review System
- Star ratings (1-5)
- Comment submissions
- Review list display
- Associated with menu items

### 6. Favorites System
- Save/unsave menu items
- Quick access on favorites page
- Persistent across sessions (via state)

### 7. Search & Filtering
- Search menu items by name
- Filter by category
- Filter by price range
- Sort by rating/popularity

---

## API Service Layer (`services/api.ts`)

The app uses a **localStorage-based API layer** that simulates a backend:

### Available Methods

#### Chef Operations
- `getChefs()`: Fetch all chefs
- `updateChef(id, data)`: Update chef information
- `createChef(data)`: Add new chef

#### Order Operations
- `getOrders()`: Fetch all orders
- `createOrder(order)`: Create new order
- `updateOrderStatus(id, status)`: Update order status
- `getOrderById(id)`: Get specific order

#### Menu Operations
- `getMenuItems()`: Fetch all menu items
- `addMenuItem(item)`: Add new menu item
- `updateMenuItem(id, data)`: Update menu item
- `deleteMenuItem(id)`: Remove menu item

#### Promotional Features
- `getOffers()`: Fetch weekly offers
- `getBoxes()`: Fetch meal boxes
- `getBestSellers()`: Fetch best-selling items
- `getPromoCodes()`: Fetch promo codes
- `applyPromoCode(code)`: Validate and apply promo code

#### Settings
- `getContactSettings()`: Fetch contact information
- `updateContactSettings(data)`: Update contact details

#### Reviews
- `addReview(itemId, review)`: Add customer review
- `getReviews(itemId)`: Get reviews for item

### Storage Keys
```typescript
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

## Component Architecture

### Layout Components
- **Navbar**: Top navigation with search, cart, auth, admin toggle
- **Footer**: Contact and information footer
- **Hero**: Landing page banner

### Feature Components
- **CartDrawer**: Side panel for shopping cart
- **WeeklyOffers**: Carousel of promotional items
- **ChefsSection**: Grid of featured chefs
- **FullMenu**: Complete menu with categories and filters
- **LiveOrderTracker**: Real-time order status display

### Modal Components
- **AuthModal**: Login/registration modal
- **MenuModal**: Menu item details popup
- **ChefConflictModal**: Chef selection conflict resolution
- **OrderSuccessModal**: Order confirmation popup
- **ReviewModal**: Review submission popup
- **ClearCartModal**: Confirmation for cart clearing

### Admin Components
- Each admin component handles specific data management
- Follows CRUD pattern
- Integrated with API service layer
- Real-time UI updates

---

## State Management

The app uses **React Hooks** for state management with the following patterns:

### Global App State (App.tsx)
```typescript
// Data State
const [chefs, setChefs] = useState<Chef[]>(INITIAL_CHEFS);
const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
// ... other data states

// UI State
const [activePage, setActivePage] = useState('home');
const [isCartOpen, setIsCartOpen] = useState(false);
const [isAuthOpen, setIsAuthOpen] = useState(false);
// ... other UI states

// User State
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [isAdmin, setIsAdmin] = useState(false);
const [cart, setCart] = useState<CartItem[]>([]);
const [favorites, setFavorites] = useState<MenuItem[]>([]);
```

### State Prop Drilling
State is passed down through props to child components. Consider using React Context API or a state management library (Redux, Zustand) for deeper component trees.

---

## Data Flow

```
Initial Data (constants.ts)
         ↓
    App.tsx (loads data)
         ↓
    API Service Layer (localStorage)
         ↓
    React State (useState)
         ↓
    Props → Child Components
         ↓
    User Interactions → setState
         ↓
    API Service Updates (save to storage)
```

---

## Styling Approach

### Tailwind CSS
- Used for all styling via CDN in `index.html`
- Custom configuration in script tag:
  - Cairo font family for Arabic
  - Custom animations (fade-in, fade-in-up, slide-in-right, bounce-slow)
  - Theme extensions for colors and spacing

### Design System
- Primary colors: Blue/Cyan accents
- Neutral colors: Gray scales for backgrounds/text
- Interactive elements: Hover and focus states
- Responsive design: Mobile-first approach with Tailwind breakpoints

### RTL Support
- HTML `dir="rtl"` attribute
- Arabic language support
- Flexbox reversed layouts where needed
- Direction-aware margins and padding

---

## Browser Support

- Modern browsers (2023+)
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Performance Considerations

### Current Optimizations
- Code splitting via Vite
- Tree-shaking of unused code
- Lazy loading of routes (potential)
- localStorage caching of data

### Recommendations for Improvement
1. **Route-based code splitting**: Use React.lazy() for pages
2. **Image optimization**: Use responsive images, WebP format
3. **Bundle analysis**: Use vite-plugin-visualizer
4. **Memoization**: useMemo/useCallback for expensive computations
5. **Virtual scrolling**: For large lists
6. **Service Worker**: Offline support

---

## Error Handling

### Current Implementation
- Try-catch blocks in API calls
- Fallback to initial data if API fails
- Loading states during data fetching

### Recommended Improvements
1. Error boundary component for crash prevention
2. User-friendly error messages
3. Retry logic for failed API calls
4. Error logging to external service
5. Toast notifications for user feedback

---

## Testing Recommendations

### Unit Testing
```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```
- Test individual components
- Test utility functions in api.ts
- Test state management logic

### Integration Testing
- Test component interactions
- Test data flow through component tree
- Test modal workflows

### E2E Testing
```bash
npm install --save-dev cypress
```
- Test complete user journeys
- Test checkout flow
- Test admin operations

---

## Deployment Guide

### Build for Production
```bash
npm run build
```

### Deployment Platforms

#### Vercel (Recommended for Vite)
```bash
npm install -g vercel
vercel
```

#### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

#### GitHub Pages
- Update vite.config.ts base URL
- Push to gh-pages branch

#### Traditional Hosting
- Upload `dist/` folder contents
- Ensure server rewrites to index.html for SPA routing

### Environment Variables for Production
```env
VITE_GEMINI_API_KEY=production_key_here
VITE_API_URL=https://api.ghadwa.com
```

---

## Troubleshooting

### Common Issues

#### Port 3000 Already in Use
```bash
# Kill process on port 3000 (Windows PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process

# Or specify different port
vite --port 3001
```

#### Module Not Found Error
```bash
# Clear node_modules and reinstall
rm -r node_modules
npm install
```

#### Styles Not Loading
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh (Ctrl+Shift+R)
- Ensure CDN links are working

#### localStorage Quota Exceeded
- Clear browser storage
- Reduce stored data size
- Implement data cleanup logic

#### TypeScript Compilation Errors
```bash
# Check configuration
npx tsc --noEmit

# Update TypeScript
npm install --save-dev typescript@latest
```

---

## Future Enhancements

### Planned Features
- [ ] Real backend API integration (REST/GraphQL)
- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] SMS/Email notifications
- [ ] Push notifications
- [ ] User authentication system
- [ ] Rating and review system improvements
- [ ] Chef onboarding workflow
- [ ] Analytics dashboard
- [ ] Multi-language support (i18n)
- [ ] Progressive Web App (PWA) features

### Architecture Improvements
- [ ] State management (Redux/Zustand)
- [ ] Component library (Storybook)
- [ ] API integration layer refactor
- [ ] Error boundary implementation
- [ ] Performance monitoring
- [ ] Accessibility (a11y) audit

---

## Contributing Guidelines

### Code Style
- Use TypeScript for type safety
- Follow functional component patterns
- Use meaningful variable/function names
- Comment complex logic
- Keep components focused and reusable

### Git Workflow
1. Create feature branch: `git checkout -b feature/feature-name`
2. Commit with clear messages: `git commit -m "feat: add feature"`
3. Push to branch: `git push origin feature/feature-name`
4. Create pull request with description

### Commit Message Format
```
<type>: <description>

feat: add new feature
fix: fix bug
docs: update documentation
style: format code
refactor: restructure code
test: add tests
chore: update dependencies
```

---

## Resources & Links

### Official Documentation
- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Tools & Libraries
- [Font Awesome Icons](https://fontawesome.com)
- [Google Fonts - Cairo](https://fonts.google.com/specimen/Cairo)

### Learning Resources
- React Patterns and Best Practices
- TypeScript Advanced Types
- Performance Optimization Techniques

---

## License & Credits

**Project**: Ghadwa - Home Chef Delivery Platform  
**Owner**: ghadwa444-hub  
**Repository**: GitHub Ghadwa-Teams  
**Last Updated**: December 9, 2025

### Contact & Support
For questions or support, contact the development team or create an issue in the repository.

---

## Quick Reference

### Starting the App
```bash
npm install          # Install dependencies
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Create production build
npm run preview      # Preview production build
```

### Key Files to Know
- **App.tsx**: Main application logic and state
- **constants.ts**: Initial data and configurations
- **types.ts**: TypeScript type definitions
- **services/api.ts**: Data persistence and API simulation
- **components/**: UI components
- **pages/**: Full page components

### Default Admin Credentials
Check the auth modal implementation or admin verification logic in App.tsx

---

**End of Documentation**
