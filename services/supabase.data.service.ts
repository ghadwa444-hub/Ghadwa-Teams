import { supabase, type Profile, type Chef, type Product, type Order, type OrderItem, type AdminSetting } from './supabase';
import { logger } from '../utils/logger';

// ============================================================================
// SUPABASE DATA SERVICE
// ============================================================================
// Replaces localStorage with real Supabase database operations
// All operations respect Row Level Security (RLS) policies
// ============================================================================

export class SupabaseDataService {
  // ==========================================================================
  // CHEFS
  // ==========================================================================

  async getChefs(): Promise<Chef[]> {
    try {
      logger.info('SUPABASE', '🔍 Fetching chefs...');
      
      // Don't filter by is_active here - let RLS handle it
      // RLS will return:
      // - All chefs (including inactive) for admins
      // - Only active chefs for regular users
      const { data, error } = await supabase
        .from('chefs')
        .select('*')
        .order('rating', { ascending: false });

      if (error) throw error;

      logger.info('SUPABASE', `✅ Fetched ${data.length} chefs (RLS filtered)`);
      return data || [];
    } catch (error) {
      logger.error('SUPABASE', '❌ Failed to fetch chefs', error);
      return [];
    }
  }

  // Helper: Validate UUID (basic v4 format check)
  private isValidUUID(id: string | undefined | null): boolean {
    if (!id || typeof id !== 'string') return false;
    const uuidV4 = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidV4.test(id);
  }

  // Helper: Keep only allowed chef fields to avoid sending unexpected columns
  private sanitizeChefPayload(chef: Partial<Chef>): Partial<Chef> {
    const allowed: (keyof Chef)[] = ['chef_name', 'specialty', 'description', 'image_url', 'cover_image_url', 'working_hours', 'delivery_time', 'is_active', 'rating', 'profile_id'];
    const out: Partial<Chef> = {};
    for (const key of allowed) {
      if (chef[key] !== undefined) out[key] = chef[key];
    }
    return out;
  }

  // Helper: Keep only allowed product fields to avoid sending unexpected columns
  private sanitizeProductPayload(product: Partial<Product>): any {
    const allowed: (keyof Product)[] = ['name', 'description', 'price', 'image_url', 'category', 'is_available', 'is_featured', 'is_offer', 'offer_price', 'prep_time', 'stock_quantity', 'chef_id'];
    const out: any = {};
    for (const key of allowed) {
      if (product[key] !== undefined) out[key] = product[key];
    }
    
    // Clean chef_id: empty string or whitespace becomes null
    if (out.chef_id !== undefined) {
      if (typeof out.chef_id === 'string' && out.chef_id.trim() === '') {
        out.chef_id = null;
      } else if (out.chef_id === '') {
        out.chef_id = null;
      }
    }
    
    // Database has dual fields (title ↔ name, is_active ↔ is_available, preparation_time ↔ prep_time)
    // Sync them for backward compatibility
    if (product.name !== undefined) {
      out.title = product.name; // Sync name → title (title is NOT NULL in DB)
    } else if (product.title !== undefined) {
      out.title = product.title; // Use title if provided directly
      out.name = product.title; // Sync title → name
    }
    if (product.is_available !== undefined) {
      out.is_active = product.is_available; // Sync is_available → is_active
    } else if (product.is_active !== undefined) {
      out.is_active = product.is_active; // Use is_active if provided directly
      out.is_available = product.is_active; // Sync is_active → is_available
    }
    if (product.prep_time !== undefined) {
      out.preparation_time = product.prep_time; // Sync prep_time → preparation_time
    } else if (product.preparation_time !== undefined) {
      out.preparation_time = product.preparation_time; // Use preparation_time if provided directly
      out.prep_time = product.preparation_time; // Sync preparation_time → prep_time
    } else {
      // Default prep_time if not provided
      out.prep_time = 30;
      out.preparation_time = 30;
    }
    
    // Ensure category has a default value
    if (!out.category) {
      out.category = 'main';
    }
    
    return out;
  }

  async getChef(id: string): Promise<Chef | null> {
    try {
      const { data, error } = await supabase
        .from('chefs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('SUPABASE', '❌ Failed to fetch chef', error);
      return null;
    }
  }

  async createChef(chef: Partial<Chef>): Promise<Chef | null> {
    try {
      logger.info('SUPABASE', '➕ Creating chef...');

      // Sanitize payload to avoid sending unknown columns (eg. badges, name, img)
      const payload = this.sanitizeChefPayload(chef);

      const { data, error } = await supabase
        .from('chefs')
        .insert([payload])
        .select()
        .single();

      if (error) throw error;

      logger.info('SUPABASE', '✅ Chef created successfully');
      return data;
    } catch (error) {
      logger.error('SUPABASE', '❌ Failed to create chef', error);
      return null;
    }
  }

  async updateChef(id: string, updates: Partial<Chef>): Promise<Chef | null> {
    try {
      logger.info('SUPABASE', '📝 Updating chef...', { id, updates });

      if (!this.isValidUUID(id)) {
        throw new Error(`Invalid chef id (expected UUID): ${id}`);
      }

      const payload = this.sanitizeChefPayload(updates);
      logger.info('SUPABASE', '📝 Update payload', { payload });

      // First, try to update without select to see if it works
      const { error: updateError, count } = await supabase
        .from('chefs')
        .update(payload)
        .eq('id', id)
        .select('id', { count: 'exact', head: true });

      if (updateError) {
        logger.error('SUPABASE', '❌ Update error', updateError);
        throw updateError;
      }

      logger.info('SUPABASE', '📝 Update count', { count });

      // Now fetch the updated chef
      const { data, error: selectError } = await supabase
        .from('chefs')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (selectError) {
        logger.error('SUPABASE', '❌ Select error after update', selectError);
        throw selectError;
      }

      if (!data) {
        logger.warn('SUPABASE', '⚠️ Chef not found after update', { id });
        return null;
      }

      logger.info('SUPABASE', '✅ Chef updated successfully', { chefId: id, is_active: data.is_active });
      return data;
    } catch (error) {
      logger.error('SUPABASE', '❌ Failed to update chef', error);
      throw error; // Re-throw so caller can handle it
    }
  }

  async deleteChef(id: string): Promise<boolean> {
    try {
      logger.info('SUPABASE', '🗑️ Deleting chef...', { id });

      if (!this.isValidUUID(id)) {
        throw new Error(`Invalid chef id (expected UUID): ${id}`);
      }

      const { error } = await supabase
        .from('chefs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      logger.info('SUPABASE', '✅ Chef deleted successfully');
      return true;
    } catch (error) {
      logger.error('SUPABASE', '❌ Failed to delete chef', error);
      return false;
    }
  }

  // ==========================================================================
  // PRODUCTS (Menu Items)
  // ==========================================================================

  async getProducts(): Promise<Product[]> {
    try {
      logger.info('SUPABASE', '🔍 Fetching products...');

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      logger.info('SUPABASE', `✅ Fetched ${data.length} products`);
      return data || [];
    } catch (error) {
      logger.error('SUPABASE', '❌ Failed to fetch products', error);
      return [];
    }
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .eq('is_active', true);

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('SUPABASE', '❌ Failed to fetch products by category', error);
      return [];
    }
  }

  async getProductsByChef(chefId: string): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('chef_id', chefId)
        .eq('is_active', true);

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('SUPABASE', '❌ Failed to fetch products by chef', error);
      return [];
    }
  }

  async createProduct(product: Partial<Product>): Promise<Product | null> {
    try {
      logger.info('SUPABASE', '➕ Creating product...');

      const payload = this.sanitizeProductPayload(product);

      const { data, error } = await supabase
        .from('products')
        .insert([payload])
        .select()
        .single();

      if (error) throw error;

      logger.info('SUPABASE', '✅ Product created successfully');
      return data;
    } catch (error) {
      logger.error('SUPABASE', '❌ Failed to create product', error);
      return null;
    }
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    try {
      logger.info('SUPABASE', '📝 Updating product...', { id, updates });

      if (!this.isValidUUID(id)) {
        throw new Error(`Invalid product id (expected UUID): ${id}`);
      }

      const payload = this.sanitizeProductPayload(updates);
      logger.info('SUPABASE', '📝 Update payload', { payload });

      // First, try to update
      const { error: updateError } = await supabase
        .from('products')
        .update(payload)
        .eq('id', id);

      if (updateError) {
        logger.error('SUPABASE', '❌ Update error', updateError);
        throw updateError;
      }

      logger.info('SUPABASE', '✅ Update successful, fetching updated product...');

      // Now fetch the updated product
      const { data, error: selectError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (selectError) {
        logger.error('SUPABASE', '❌ Select error after update', selectError);
        throw selectError;
      }

      if (!data) {
        logger.warn('SUPABASE', '⚠️ Product not found after update', { id });
        return null;
      }

      logger.info('SUPABASE', '✅ Product updated successfully', { id, name: data.name });
      return data;
    } catch (error) {
      logger.error('SUPABASE', '❌ Failed to update product', error);
      return null;
    }
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      logger.info('SUPABASE', '🗑️ Deleting product...', { id });

      if (!this.isValidUUID(id)) {
        throw new Error(`Invalid product id (expected UUID): ${id}`);
      }

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      logger.info('SUPABASE', '✅ Product deleted successfully');
      return true;
    } catch (error) {
      logger.error('SUPABASE', '❌ Failed to delete product', error);
      return false;
    }
  }

  // ==========================================================================
  // ORDERS
  // ==========================================================================

  async getOrders(): Promise<Order[]> {
    try {
      logger.info('SUPABASE', '🔍 Fetching orders with items...');

      // Try to fetch orders with order_items joined
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_id,
            product_name,
            quantity,
            unit_price,
            total_price,
            notes
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        logger.warn('SUPABASE', '⚠️ Failed to fetch orders with join, trying separate query', error);
        // Fallback: fetch orders and items separately
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;

        // Fetch items for each order
        const ordersWithItems = await Promise.all((ordersData || []).map(async (order: any) => {
          const { data: itemsData } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', order.id);

          return {
            ...order,
            items: itemsData || [],
            itemsDetails: itemsData || []
          };
        }));

        logger.info('SUPABASE', `✅ Fetched ${ordersWithItems.length} orders with items (separate queries)`);
        return ordersWithItems;
      }

      // Map order_items to items array for compatibility
      const ordersWithItems = await Promise.all((data || []).map(async (order: any) => {
        let items = order.order_items || [];
        
        // If order_items is empty or null, try to fetch separately (RLS might block join)
        if (!items || items.length === 0) {
          logger.debug('SUPABASE', `Order ${order.id} has no items from join, fetching separately...`);
          const { data: itemsData, error: itemsError } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', order.id);
          
          if (itemsError) {
            logger.warn('SUPABASE', `Failed to fetch items for order ${order.id}`, itemsError);
          } else {
            items = itemsData || [];
            logger.debug('SUPABASE', `Fetched ${items.length} items separately for order ${order.id}`);
          }
        }
        
        logger.debug('SUPABASE', `Order ${order.id} has ${items.length} items`, {
          orderId: order.id,
          itemsCount: items.length,
          items: items.map((i: any) => ({ name: i.product_name, qty: i.quantity }))
        });
        
        return {
          ...order,
          items: items,
          itemsDetails: items, // For backward compatibility
          order_items: items // Also set order_items for consistency
        };
      }));

      logger.info('SUPABASE', `✅ Fetched ${ordersWithItems.length} orders with items`);
      return ordersWithItems || [];
    } catch (error) {
      logger.error('SUPABASE', '❌ Failed to fetch orders', error);
      return [];
    }
  }

  async getOrdersByCustomer(customerId: string): Promise<Order[]> {
    try {
      logger.info('SUPABASE', '🔍 Fetching customer orders with items...', { customerId });

      // Fetch orders with order_items joined
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_id,
            product_name,
            quantity,
            unit_price,
            total_price,
            notes
          )
        `)
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map order_items to items array for compatibility
      const ordersWithItems = (data || []).map((order: any) => ({
        ...order,
        items: order.order_items || [],
        itemsDetails: order.order_items || [] // For backward compatibility
      }));

      logger.info('SUPABASE', `✅ Fetched ${ordersWithItems.length} customer orders with items`);
      return ordersWithItems || [];
    } catch (error) {
      logger.error('SUPABASE', '❌ Failed to fetch customer orders', error);
      return [];
    }
  }

  async getOrder(id: string): Promise<Order | null> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('SUPABASE', '❌ Failed to fetch order', error);
      return null;
    }
  }

  async createOrder(order: Partial<Order>): Promise<Order | null> {
    try {
      logger.info('SUPABASE', '➕ Creating order...');

      // Generate order number
      const orderNumber = `GHD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      const { data, error } = await supabase
        .from('orders')
        .insert([{ ...order, order_number: orderNumber }])
        .select()
        .single();

      if (error) throw error;

      logger.info('SUPABASE', '✅ Order created successfully', { orderNumber });
      return data;
    } catch (error) {
      logger.error('SUPABASE', '❌ Failed to create order', error);
      return null;
    }
  }

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order | null> {
    try {
      logger.info('SUPABASE', '📝 Updating order status...', { id, status });

      const updates: Partial<Order> = { status };

      // Set timestamps based on status
      if (status === 'confirmed') {
        updates.confirmed_at = new Date().toISOString();
      } else if (status === 'delivered') {
        updates.delivered_at = new Date().toISOString();
      } else if (status === 'cancelled') {
        updates.cancelled_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      logger.info('SUPABASE', '✅ Order status updated successfully');
      return data;
    } catch (error) {
      logger.error('SUPABASE', '❌ Failed to update order status', error);
      return null;
    }
  }

  // ==========================================================================
  // ORDER ITEMS
  // ==========================================================================

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    try {
      const { data, error } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('SUPABASE', '❌ Failed to fetch order items', error);
      return [];
    }
  }

  async createOrderItems(items: Partial<OrderItem>[]): Promise<boolean> {
    try {
      logger.info('SUPABASE', '➕ Creating order items...', { count: items.length });
      logger.debug('SUPABASE', '📦 Order items data:', JSON.stringify(items, null, 2));

      if (!items || items.length === 0) {
        logger.warn('SUPABASE', '⚠️ No items to create');
        return false;
      }

      // Remove image_url if column doesn't exist (will be handled by retry)
      // First, try to insert with all fields
      let { data, error } = await supabase
        .from('order_items')
        .insert(items)
        .select();

      // If error is about missing image_url column, retry without it
      if (error && (error.message?.includes('image_url') || error.code === 'PGRST204')) {
        logger.warn('SUPABASE', '⚠️ image_url column not found, retrying without it...');
        
        // Remove image_url from all items
        const itemsWithoutImage = items.map((item: any) => {
          const { image_url, ...rest } = item;
          return rest;
        });
        
        logger.debug('SUPABASE', '📦 Retrying with items (without image_url):', JSON.stringify(itemsWithoutImage, null, 2));
        
        const { data: retryData, error: retryError } = await supabase
          .from('order_items')
          .insert(itemsWithoutImage)
          .select();

        if (retryError) {
          logger.error('SUPABASE', '❌ Failed to create order items (retry without image_url)', retryError);
          logger.error('SUPABASE', '❌ Retry error details:', JSON.stringify(retryError, null, 2));
          throw retryError;
        }

        logger.info('SUPABASE', '✅ Order items created successfully (without image_url)', { 
          count: retryData?.length || 0,
          createdIds: retryData?.map((item: any) => item.id)
        });
        return true;
      }

      if (error) {
        logger.error('SUPABASE', '❌ Failed to create order items', error);
        logger.error('SUPABASE', '❌ Error details:', JSON.stringify(error, null, 2));
        throw error;
      }

      logger.info('SUPABASE', '✅ Order items created successfully', { 
        count: data?.length || 0,
        createdIds: data?.map((item: any) => item.id)
      });
      return true;
    } catch (error: any) {
      logger.error('SUPABASE', '❌ Failed to create order items', error);
      logger.error('SUPABASE', '❌ Error message:', error?.message);
      logger.error('SUPABASE', '❌ Error code:', error?.code);
      logger.error('SUPABASE', '❌ Error details:', error?.details);
      logger.error('SUPABASE', '❌ Error hint:', error?.hint);
      return false;
    }
  }

  // ==========================================================================
  // ADMIN SETTINGS
  // ==========================================================================

  async getSettings(): Promise<AdminSetting[]> {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*');

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('SUPABASE', '❌ Failed to fetch settings', error);
      return [];
    }
  }

  async getContactSettings(): Promise<any | null> {
    try {
      logger.info('SUPABASE', '🔍 Fetching contact settings...');
      
      const { data, error } = await supabase
        .from('contact_settings')
        .select('*')
        .limit(1)
        .single();

      if (error) throw error;

      logger.info('SUPABASE', '✅ Fetched contact settings');
      return data;
    } catch (error) {
      logger.error('SUPABASE', '❌ Failed to fetch contact settings', error);
      return null;
    }
  }

  async getSetting(key: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('setting_value')
        .eq('setting_key', key)
        .single();

      if (error) throw error;
      return data?.setting_value || null;
    } catch (error) {
      logger.error('SUPABASE', '❌ Failed to fetch setting', error);
      return null;
    }
  }

  async updateSetting(key: string, value: string): Promise<boolean> {
    try {
      logger.info('SUPABASE', '📝 Updating setting...', { key });

      const { error } = await supabase
        .from('admin_settings')
        .update({ setting_value: value })
        .eq('setting_key', key);

      if (error) throw error;

      logger.info('SUPABASE', '✅ Setting updated successfully');
      return true;
    } catch (error) {
      logger.error('SUPABASE', '❌ Failed to update setting', error);
      return false;
    }
  }

  // ==========================================================================
  // BOXES
  // ==========================================================================

  async getBoxes(): Promise<any[]> {
    try {
      logger.info('SUPABASE', '🔍 Fetching boxes...');
      
      const { data, error } = await supabase
        .from('boxes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      logger.info('SUPABASE', `✅ Fetched ${data?.length || 0} boxes`);
      return data || [];
    } catch (error) {
      logger.error('SUPABASE', '❌ Failed to fetch boxes', error);
      return [];
    }
  }

  async deleteBox(id: string | number): Promise<boolean> {
    try {
      logger.info('SUPABASE', '🗑️ Deleting box...', { id });

      // Boxes use BIGINT (number) IDs, not UUIDs
      const boxId = Number(id);
      if (isNaN(boxId)) {
        throw new Error(`Invalid box id (expected number): ${id}`);
      }

      const { error } = await supabase
        .from('boxes')
        .delete()
        .eq('id', boxId);

      if (error) throw error;

      logger.info('SUPABASE', '✅ Box deleted successfully');
      return true;
    } catch (error) {
      logger.error('SUPABASE', '❌ Failed to delete box', error);
      return false;
    }
  }
}

export const supabaseDataService = new SupabaseDataService();
