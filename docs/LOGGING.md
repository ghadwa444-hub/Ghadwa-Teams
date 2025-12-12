# Ghadwa Logging System Documentation

## Overview

The Ghadwa application now includes a comprehensive logging system to help with debugging, monitoring, and understanding application behavior. All logs are captured with timestamps, log levels, module names, and optional contextual data.

---

## Logger Architecture

### Location
`utils/logger.ts` - Centralized logger utility

### Exported Logger Instance
```typescript
import { logger } from './utils/logger';
```

### Available Log Levels
1. **DEBUG** - Detailed information for debugging
2. **INFO** - General information about application flow
3. **WARN** - Warning messages for potential issues
4. **ERROR** - Error messages for failures
5. **TRACE** - Low-level tracing information

---

## Using the Logger

### Basic Usage

```typescript
// Simple logging
logger.info('MODULE_NAME', 'User action performed');

// Logging with data
logger.debug('CART', '🛒 Item added to cart', { itemId: 123, quantity: 2 });

// Error logging
logger.error('API', '❌ Failed to fetch data', error);

// Warning
logger.warn('AUTH', '⚠️ Admin access attempted', { userId: 456 });
```

### Log Level Selection

#### DEBUG (Blue)
Use for detailed diagnostic information
```typescript
logger.debug('COMPONENT', 'Component rendered', { props });
logger.debug('API_STORAGE', '✅ Retrieved data from localStorage');
```

#### INFO (Green)
Use for important application events
```typescript
logger.info('APP', '🎉 Application started');
logger.info('ORDER', '📦 New order created', { orderId: 123 });
```

#### WARN (Yellow)
Use for recoverable issues or unusual conditions
```typescript
logger.warn('CART', '⚠️ Chef conflict detected', { currentChef, newChef });
logger.warn('AUTH', '⚠️ Multiple admin attempts');
```

#### ERROR (Red)
Use for failures and exceptions
```typescript
logger.error('API', '❌ Network request failed', error);
logger.error('STORAGE', '❌ localStorage quota exceeded', error);
```

#### TRACE (Gray)
Use for lowest-level tracing
```typescript
logger.trace('STORAGE', 'Reading key', { key });
```

---

## Module Naming Conventions

| Module | Purpose |
|--------|---------|
| **APP** | Core application lifecycle |
| **NAVIGATION** | Page routing and navigation |
| **AUTH** | Authentication and authorization |
| **CART** | Shopping cart operations |
| **ORDER** | Order creation and tracking |
| **API_CHEFS** | Chef API operations |
| **API_ORDERS** | Order API operations |
| **API_MENU** | Menu API operations |
| **API_OFFERS** | Offers API operations |
| **API_BOXES** | Boxes API operations |
| **API_BESTSELLERS** | Best sellers API operations |
| **API_PROMOS** | Promo codes API operations |
| **API_SETTINGS** | Settings API operations |
| **API_STORAGE** | Storage read/write operations |
| **ADMIN_ORDERS** | Admin order management |
| **ADMIN_CHEFS** | Admin chef management |
| **ADMIN_MEALS** | Admin meal management |
| **ADMIN_OFFERS** | Admin offers management |
| **ADMIN_BOXES** | Admin boxes management |
| **ADMIN_BESTSELLERS** | Admin best sellers management |
| **ADMIN_PROMOS** | Admin promo codes management |

---

## Debug Console UI

### Accessing the Debug Console

1. A blue bug icon button appears in the bottom-right corner
2. Click it to open the debug console
3. Console shows all logged events in real-time

### Debug Console Features

#### Search/Filter
- Filter logs by module name or message content
- Type in the filter field to search

#### Actions
- **Clear**: Remove all logs from console (keeps them in session storage)
- **Download**: Export logs as JSON file for analysis
- **Close (✕)**: Minimize the console

#### Statistics
- Total logs count
- Error count
- Warning count

#### Log Display
- Timestamp (HH:MM:SS)
- Log level badge (color-coded)
- Module name
- Message
- Contextual data (if provided)

---

## Data Persistence

### Storage Methods

#### 1. Session Storage
- All logs are automatically saved to browser's sessionStorage
- Key: `ghadwa_logs`
- Persists during current browser session
- Cleared when tab is closed

#### 2. In-Memory
- Logs are kept in memory with max 500 entries
- Oldest logs are removed when limit exceeded

#### 3. Browser Console
- All logs are also output to browser's DevTools console
- Color-coded by level for easy scanning

---

## Accessing Logs Programmatically

### In Browser Console

```javascript
// Access the logger from window
window.GhadwaLogger

// Get all logs
window.GhadwaLogger.getLogs()

// Get logs by level
window.GhadwaLogger.getLogsByLevel('ERROR')

// Get logs by module
window.GhadwaLogger.getLogsByModule('CART')

// Clear all logs
window.GhadwaLogger.clearLogs()

// Export logs as JSON string
window.GhadwaLogger.exportLogs()

// Download logs as file
window.GhadwaLogger.downloadLogs()
```

### In Application Code

```typescript
import { logger } from './utils/logger';

// Get all logs
const allLogs = logger.getLogs();

// Filter by level
const errors = logger.getLogsByLevel('ERROR');

// Filter by module
const cartLogs = logger.getLogsByModule('CART');

// Clear logs
logger.clearLogs();
```

---

## Common Logging Patterns

### Pattern 1: Async Operations
```typescript
logger.debug('API_MENU', '🔄 Fetching menu items from API...');
await delay(500);
const data = getDB<MenuItem[]>(KEYS.MENU, INITIAL_MENU_ITEMS);
logger.info('API_MENU', `✅ Fetched ${data.length} menu items`, { count: data.length });
```

### Pattern 2: User Actions
```typescript
logger.debug('CART', '🛒 Update quantity requested', { itemId: id, newQuantity: qty });
// ... perform action ...
logger.info('CART', '✏️ Item quantity updated', { itemId: id, quantity: qty });
```

### Pattern 3: Error Handling
```typescript
try {
    // operation
} catch (error) {
    logger.error('MODULE', '❌ Error message', error);
}
```

### Pattern 4: State Changes
```typescript
logger.info('AUTH', `🔓 User logged in as ${type}`, { loginType: type });
setIsLoggedIn(true);
```

### Pattern 5: Data Validation
```typescript
if (itemToAdd.chef !== currentChef) {
    logger.warn('CART', '⚠️ Chef conflict detected', { 
        currentChef: currentChef,
        newChef: itemToAdd.chef
    });
}
```

---

## Troubleshooting with Logs

### Issue: Blank Page Display

**Steps to diagnose:**
1. Open Debug Console (blue bug icon)
2. Look for ERROR logs in red
3. Check messages for specific failures
4. Example errors:
   - "Root element not found" → DOM issue
   - "Error loading data" → API issue
   - "Cannot read property" → Data structure issue

### Issue: Cart Not Updating

**Steps to diagnose:**
1. Filter logs for "CART" module
2. Look for "Update quantity requested" entries
3. Check if "Item added to cart" or "Item removed from cart" appears
4. Verify quantities match expected values

### Issue: Orders Not Saving

**Steps to diagnose:**
1. Filter logs for "API_ORDERS" module
2. Look for "Submitting new order" entries
3. Check for "Order saved successfully" confirmation
4. Look for any ERROR level logs

### Issue: Admin Operations Not Working

**Steps to diagnose:**
1. Filter logs for "ADMIN_*" modules
2. Verify "Admin mode activated" appears in AUTH logs
3. Look for successful operation logs (✅)
4. Check for permission-related warnings

---

## Log Analysis Examples

### Example 1: Complete Order Flow
```
[INFO] [APP] App component mounted
[INFO] [NAVIGATION] Page changed to: home
[DEBUG] [CART] 🛒 Update quantity requested {itemId: 1, quantity: 1}
[INFO] [CART] Item added to cart {itemId: 1}
[INFO] [NAVIGATION] Page changed to: checkout
[INFO] [ORDER] 📦 New order being placed {customerName: "Ahmed"}
[DEBUG] [ORDER] 💰 Order pricing {subtotal: 150, discount: 0, finalTotal: 150}
[INFO] [API_ORDERS] 📤 Submitting new order {orderId: 12345}
[INFO] [API_ORDERS] ✅ Order saved successfully {orderId: 12345}
[INFO] [ORDER] 🎉 Order submitted successfully {orderId: 12345}
```

### Example 2: Error Scenario
```
[INFO] [APP] 🚀 Ghadwa Application Starting
[ERROR] [APP] ❌ Root element not found {elementId: "root"}
```
**Analysis**: The div#root doesn't exist in index.html

### Example 3: Data Loading
```
[DEBUG] [API_MENU] 🔄 Fetching menu items from API...
[DEBUG] [API_STORAGE] ✅ Retrieved ghadwa_menu from localStorage
[INFO] [API_MENU] ✅ Fetched 25 menu items {count: 25}
```
**Analysis**: Menu items loaded successfully from storage

---

## Performance Monitoring

### Using Logs to Identify Bottlenecks

```typescript
// In code - measure specific operations
const startTime = performance.now();
const [data1, data2] = await Promise.all([api.call1(), api.call2()]);
const loadTime = performance.now() - startTime;

logger.info('APP', `✅ Data loaded in ${loadTime.toFixed(2)}ms`, {
    duration: loadTime,
    dataCount: data1.length + data2.length
});
```

**Output example:**
```
[INFO] [APP] ✅ API data fetched in 2450.45ms {
  chefsCount: 6,
  ordersCount: 5,
  menuItemsCount: 25
}
```

---

## Best Practices

### ✅ DO
- Log at appropriate levels (not everything as INFO)
- Include emoji for quick visual scanning
- Add context data for important operations
- Use consistent module naming
- Log before and after critical operations
- Include user/resource IDs when relevant

### ❌ DON'T
- Log sensitive information (passwords, tokens)
- Log every single state change (too noisy)
- Use console.log directly (use logger instead)
- Include large objects without summarizing
- Log inside tight loops
- Forget to remove debug logs from production

---

## Integration Points

### Where Logging is Integrated

1. **index.tsx** - Application startup
2. **App.tsx** - Component lifecycle and state management
3. **services/api.ts** - All API operations and storage
4. **components/** - User interactions (optional per component)
5. **DebugConsole.tsx** - Debug UI component

### How to Add Logging to New Components

```typescript
import { logger } from '../utils/logger';

export const MyComponent = () => {
    useEffect(() => {
        logger.debug('MY_COMPONENT', 'Component mounted');
        return () => {
            logger.debug('MY_COMPONENT', 'Component unmounting');
        };
    }, []);

    const handleClick = () => {
        logger.info('MY_COMPONENT', 'Button clicked');
        // perform action
    };

    return <button onClick={handleClick}>Click Me</button>;
};
```

---

## Export and Analysis

### Downloading Logs

1. Click "Download" button in Debug Console
2. File name format: `ghadwa-logs-YYYY-MM-DDTHH:mm:ss.sssZ.json`
3. Use JSON viewer or text editor to analyze

### Log File Format

```json
[
  {
    "timestamp": "2025-12-09T10:30:45.123Z",
    "level": "INFO",
    "module": "CART",
    "message": "Item added to cart",
    "data": {
      "itemId": 123,
      "quantity": 2
    }
  },
  ...
]
```

### Analyzing Exported Logs

```javascript
// In browser console or Node.js
const logs = require('ghadwa-logs-...json');

// Get error counts
const errors = logs.filter(l => l.level === 'ERROR');
console.log(`Total errors: ${errors.length}`);

// Get timeline
logs.forEach(l => {
    console.log(`${l.timestamp} [${l.level}] ${l.module}: ${l.message}`);
});

// Get module breakdown
const byModule = {};
logs.forEach(l => {
    byModule[l.module] = (byModule[l.module] || 0) + 1;
});
console.log(byModule);
```

---

## Browser DevTools Integration

### Chrome DevTools Console

1. Press `F12` or `Ctrl+Shift+I`
2. Go to "Console" tab
3. All logs appear with color coding
4. Access logger: `window.GhadwaLogger`

### Filtering in DevTools

```javascript
// Show only errors
window.GhadwaLogger.getLogsByLevel('ERROR')

// Show only specific module
window.GhadwaLogger.getLogsByModule('CART')

// Show logs from last 5 minutes
const now = new Date();
const fiveMinutesAgo = new Date(now - 5*60*1000);
window.GhadwaLogger.getLogs().filter(l => new Date(l.timestamp) > fiveMinutesAgo)
```

---

## Performance Impact

### Logger Performance Characteristics
- **Memory**: ~500 logs max in memory (~100KB)
- **Storage**: sessionStorage used (~1-2MB per session)
- **CPU**: Minimal overhead, < 1ms per log operation
- **Network**: No network impact (local only)

### Production Considerations
The logger can remain enabled in production as it has minimal performance impact. Consider:
- Setting lower log level (fewer INFO/DEBUG)
- Increasing max log limit for longer sessions
- Implementing external log aggregation service

---

## Future Enhancements

Potential improvements to the logging system:
- [ ] Remote log aggregation service integration
- [ ] Structured logging format (JSON Lines)
- [ ] Custom log formatting rules
- [ ] Performance metrics dashboard
- [ ] Error reporting service integration
- [ ] Log filtering by time range
- [ ] User behavior tracking
- [ ] A/B testing event logging

---

## Changelog

### Version 1.0 (Current)
- ✅ Comprehensive logging system
- ✅ Multiple log levels with color coding
- ✅ Debug Console UI component
- ✅ Session storage persistence
- ✅ Filter and search capabilities
- ✅ Export to JSON functionality
- ✅ Module-based organization

---

## Support & Questions

For issues or questions about the logging system:
1. Check Debug Console for error messages
2. Review this documentation
3. Export logs for analysis
4. Check browser DevTools console

**Last Updated**: December 9, 2025  
**Version**: 1.0
