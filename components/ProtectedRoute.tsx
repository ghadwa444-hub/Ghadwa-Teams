import React, { useEffect, useState } from 'react';
import { authService } from '../services/auth.service';
import type { Profile } from '../services/supabase';
import { logger } from '../utils/logger';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  onUnauthorized?: () => void;
}

/**
 * ProtectedRoute component that checks authentication and authorization
 * Redirects to login if not authenticated
 * Redirects to home if authenticated but not authorized (for admin routes)
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
  onUnauthorized
}) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      logger.debug('PROTECTED_ROUTE', '🔍 Checking authentication...');

      const { session } = await authService.getSession();

      if (!session) {
        logger.warn('PROTECTED_ROUTE', '❌ No active session found');
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      setIsAuthenticated(true);
      logger.info('PROTECTED_ROUTE', '✅ User authenticated', { userId: session.user.id });

      if (requireAdmin) {
        const profile = await authService.getProfile(session.user.id);
        const adminStatus = profile?.role === 'admin';
        setIsAdmin(adminStatus);
        
        if (!adminStatus) {
          logger.warn('PROTECTED_ROUTE', '⚠️ Admin access required but user is not admin');
        } else {
          logger.info('PROTECTED_ROUTE', '✅ Admin access granted');
        }
      }
    } catch (error) {
      logger.error('PROTECTED_ROUTE', '❌ Auth check failed', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#8B2525] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-bold">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    logger.warn('PROTECTED_ROUTE', '🚫 Access denied - not authenticated');
    if (onUnauthorized) {
      onUnauthorized();
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-lock text-3xl text-[#8B2525]"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">تسجيل الدخول مطلوب</h2>
          <p className="text-gray-600 mb-6">يجب عليك تسجيل الدخول للوصول إلى هذه الصفحة</p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-[#8B2525] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#6b1c1c] transition"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  if (requireAdmin && !isAdmin) {
    logger.warn('PROTECTED_ROUTE', '🚫 Access denied - admin required');
    if (onUnauthorized) {
      onUnauthorized();
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-shield-halved text-3xl text-orange-600"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">غير مصرح</h2>
          <p className="text-gray-600 mb-6">ليس لديك صلاحيات الوصول إلى لوحة الإدارة</p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-[#8B2525] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#6b1c1c] transition"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
