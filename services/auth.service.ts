import { supabase } from './supabase';
import type { Profile } from './supabase';
import { logger } from '../utils/logger';

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  whatsappNumber: string;
  deliveryAddress?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export class AuthService {
  /**
   * Sign up a new user
   */
  async signUp(data: SignUpData) {
    try {
      logger.info('AUTH', '📝 Attempting to sign up new user', { email: data.email });

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            whatsapp_number: data.whatsappNumber,
            delivery_address: data.deliveryAddress,
            role: 'customer'
          }
        }
      });

      if (authError) {
        logger.error('AUTH', '❌ Sign up failed', authError);
        throw authError;
      }

      logger.info('AUTH', '✅ User signed up successfully', { userId: authData.user?.id });
      return { user: authData.user, error: null };
    } catch (error) {
      logger.error('AUTH', '❌ Sign up error', error);
      return { user: null, error: error as Error };
    }
  }

  /**
   * Sign in existing user
   */
  async signIn(data: SignInData) {
    try {
      logger.info('AUTH', '🔐 Attempting to sign in', { email: data.email });

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });

      if (authError) {
        logger.error('AUTH', '❌ Sign in failed', authError);
        throw authError;
      }

      // Fetch user profile
      const profile = await this.getProfile(authData.user.id);

      logger.info('AUTH', '✅ User signed in successfully', {
        userId: authData.user.id,
        role: profile?.role
      });

      return { user: authData.user, profile, error: null };
    } catch (error) {
      logger.error('AUTH', '❌ Sign in error', error);
      return { user: null, profile: null, error: error as Error };
    }
  }

  /**
   * Sign out current user
   */
  async signOut() {
    try {
      logger.info('AUTH', '👋 Signing out user');

      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      logger.info('AUTH', '✅ User signed out successfully');
      return { error: null };
    } catch (error) {
      logger.error('AUTH', '❌ Sign out error', error);
      return { error: error as Error };
    }
  }

  /**
   * Get current session
   */
  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return { session: data.session, error: null };
    } catch (error) {
      return { session: null, error: error as Error };
    }
  }

  /**
   * Get user profile
   */
  async getProfile(userId: string): Promise<Profile | null> {
    try {
      logger.debug('AUTH', '📋 Fetching profile', { userId });

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      logger.debug('AUTH', '✅ Profile fetched', { role: data?.role });
      return data;
    } catch (error) {
      logger.error('AUTH', '❌ Get profile error', error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updates: Partial<Profile>) {
    try {
      logger.info('AUTH', '📝 Updating profile', { userId });

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      logger.info('AUTH', '✅ Profile updated successfully');
      return { profile: data, error: null };
    } catch (error) {
      logger.error('AUTH', '❌ Update profile error', error);
      return { profile: null, error: error as Error };
    }
  }

  /**
   * Check if user is admin
   */
  async isAdmin(userId: string): Promise<boolean> {
    const profile = await this.getProfile(userId);
    return profile?.role === 'admin';
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }

  /**
   * Get current user
   */
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return { user, error: null };
    } catch (error) {
      return { user: null, error: error as Error };
    }
  }
}

export const authService = new AuthService();
