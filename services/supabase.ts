import { createClient } from '@supabase/supabase-js';
import { logger } from '../utils/logger';

// Get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate credentials
if (!supabaseUrl || !supabaseAnonKey) {
  logger.error('SUPABASE', '❌ Missing Supabase credentials in environment variables', {
    urlMissing: !supabaseUrl,
    keyMissing: !supabaseAnonKey
  });
  throw new Error('Missing Supabase credentials. Please check your .env file.');
}

logger.info('SUPABASE', '🔌 Initializing Supabase client', {
  url: supabaseUrl,
  hasAnonKey: !!supabaseAnonKey
});

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Health check function
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    logger.debug('SUPABASE', '🔍 Testing Supabase connection...');
    
    // Test connection by fetching from auth
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      logger.error('SUPABASE', '❌ Connection test failed', {
        error: error.message,
        errorCode: error.status
      });
      return false;
    }

    logger.info('SUPABASE', '✅ Supabase connection successful', {
      hasSession: !!data.session,
      timestamp: new Date().toISOString()
    });
    return true;
  } catch (error) {
    logger.error('SUPABASE', '❌ Unexpected error during connection test', error);
    return false;
  }
};

// Test database connection by querying a simple table
export const testDatabaseConnection = async (): Promise<boolean> => {
  try {
    logger.debug('SUPABASE', '🗄️ Testing database connection...');
    
    // Try to query the auth.users table (public schema)
    // This is a simple test to verify DB connectivity
    const { error } = await supabase
      .from('users')
      .select('count', { count: 'exact', head: true })
      .limit(0);
    
    // If the table doesn't exist, that's OK for now - it means the DB is connected
    if (error && error.code === 'PGRST116') {
      logger.warn('SUPABASE', '⚠️ Users table not found (expected for fresh projects)', {
        errorCode: error.code
      });
      return true; // DB is connected, table just doesn't exist yet
    }

    if (error) {
      logger.error('SUPABASE', '❌ Database test failed', {
        error: error.message,
        errorCode: error.code
      });
      return false;
    }

    logger.info('SUPABASE', '✅ Database connection successful');
    return true;
  } catch (error) {
    logger.error('SUPABASE', '❌ Unexpected error during DB test', error);
    return false;
  }
};

// Full health check
export const supabaseHealthCheck = async (): Promise<{
  connected: boolean;
  auth: boolean;
  database: boolean;
  timestamp: string;
}> => {
  logger.info('SUPABASE', '🏥 Starting Supabase health check...');
  
  const authConnected = await checkSupabaseConnection();
  const dbConnected = await testDatabaseConnection();
  
  const result = {
    connected: authConnected && dbConnected,
    auth: authConnected,
    database: dbConnected,
    timestamp: new Date().toISOString()
  };

  logger.info('SUPABASE', '🏥 Health check complete', result);
  
  return result;
};

export default supabase;

// Expose Supabase client on window for easy testing in console
if (typeof window !== 'undefined') {
  // Expose the full Supabase client for database console tests
  (window as any).GhadwaSupabase = supabase;
  
  // Also expose utility functions
  (window as any).GhadwaSupabaseUtils = {
    healthCheck: supabaseHealthCheck,
    testConnection: checkSupabaseConnection,
    testDatabase: testDatabaseConnection
  };
  
  logger.info('SUPABASE', '🪟 Supabase exposed on window.GhadwaSupabase for testing', {
    methods: ['from()', 'auth', 'storage']
  });
}
