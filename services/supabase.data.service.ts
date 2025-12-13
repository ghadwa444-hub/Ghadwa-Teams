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
      
      const { data, error } = await supabase
        .from('chefs')
        .select('*')
        .eq('is_active', true)
        .order('rating', { ascending: false });

      if (error) throw error;

      logger.info('SUPABASE', `✅ Fetched ${data.length} chefs`);
      return data || [];
    } catch (error) {
      logger.error('SUPABASE', '❌ Failed to fetch chefs', error);
      return [];
    }
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

      const { data, error } = await supabase
        .from('chefs')
        .insert([chef])
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
      logger.info('SUPABASE', '📝 Updating chef...', { id });

      const { data, error } = await supabase
        .from('chefs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      logger.info('SUPABASE', '✅ Chef updated successfully');
      return data;
    } catch (error) {
      logger.error('SUPABASE', '❌ Failed to update chef', error);
      return null;
    }
  }

  async deleteChef(id: string): Promise<boolean> {
    try {
      logger.info('SUPABASE', '🗑️ Deleting chef...', { id });

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

      const { data, error } = await supabase
        .from('products')
        .insert([product])
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
      logger.info('SUPABASE', '📝 Updating product...', { id });

      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      logger.info('SUPABASE', '✅ Product updated successfully');
      return data;
    } catch (error) {
      logger.error('SUPABASE', '❌ Failed to update product', error);
      return null;
    }
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      logger.info('SUPABASE', '🗑️ Deleting product...', { id });

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
      logger.info('SUPABASE', '🔍 Fetching orders...');

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      logger.info('SUPABASE', `✅ Fetched ${data.length} orders`);
      return data || [];
    } catch (error) {
      logger.error('SUPABASE', '❌ Failed to fetch orders', error);
      return [];
    }
  }

  async getOrdersByCustomer(customerId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
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

      const { error } = await supabase
        .from('order_items')
        .insert(items);

      if (error) throw error;

      logger.info('SUPABASE', '✅ Order items created successfully');
      return true;
    } catch (error) {
      logger.error('SUPABASE', '❌ Failed to create order items', error);
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
}

export const supabaseDataService = new SupabaseDataService();
