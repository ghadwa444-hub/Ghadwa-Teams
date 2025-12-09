import { logger } from '../utils/logger';

/**
 * Supabase Configuration Diagnostic
 * Use this to verify your Supabase setup is correct
 */

export const supabaseDiagnostics = {
  // Check environment variables
  checkEnvVars: () => {
    logger.info('SUPABASE_DIAG', '🔍 Checking environment variables...');
    
    const url = import.meta.env.VITE_SUPABASE_URL;
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const secretKey = import.meta.env.VITE_SUPABASE_SECRET_KEY;

    const results = {
      VITE_SUPABASE_URL: {
        exists: !!url,
        value: url ? `${url.substring(0, 30)}...` : 'NOT SET',
        format: url ? (url.includes('supabase.co') ? '✅ Valid format' : '❌ Invalid format') : 'N/A',
      },
      VITE_SUPABASE_ANON_KEY: {
        exists: !!anonKey,
        value: anonKey ? `${anonKey.substring(0, 20)}...` : 'NOT SET',
        format: anonKey ? (anonKey.startsWith('sb_') ? '✅ Valid format' : '⚠️ Unexpected format') : 'N/A',
      },
      VITE_SUPABASE_SECRET_KEY: {
        exists: !!secretKey,
        value: secretKey ? `${secretKey.substring(0, 20)}...` : 'NOT SET',
        format: secretKey ? (secretKey.startsWith('sb_') ? '✅ Valid format' : '⚠️ Unexpected format') : 'N/A',
      },
    };

    logger.info('SUPABASE_DIAG', '📋 Environment Variables Status', results);
    return results;
  },

  // Test URL accessibility
  testURLAccessibility: async () => {
    logger.info('SUPABASE_DIAG', '🌐 Testing URL accessibility...');
    
    const url = import.meta.env.VITE_SUPABASE_URL;
    
    if (!url) {
      logger.error('SUPABASE_DIAG', '❌ URL not configured');
      return { accessible: false, error: 'URL not set' };
    }

    try {
      const response = await fetch(url, { 
        method: 'HEAD',
        mode: 'no-cors' // Prevent CORS errors in test
      });
      
      logger.info('SUPABASE_DIAG', '✅ URL is accessible', {
        url,
        statusCode: response.status,
        statusText: response.statusText
      });
      return { accessible: true, url, status: response.status };
    } catch (error: any) {
      logger.error('SUPABASE_DIAG', '❌ URL is NOT accessible', {
        url,
        error: error.message
      });
      return { 
        accessible: false, 
        url, 
        error: error.message,
        troubleshooting: [
          'Check if Supabase project is active',
          'Verify URL is correct in .env file',
          'Check internet connection',
          'Verify firewall settings'
        ]
      };
    }
  },

  // Full diagnostic report
  fullReport: async () => {
    logger.info('SUPABASE_DIAG', '📊 Starting full diagnostic report...');
    
    const envCheck = supabaseDiagnostics.checkEnvVars();
    const urlCheck = await supabaseDiagnostics.testURLAccessibility();

    const report = {
      timestamp: new Date().toISOString(),
      environmentVariables: envCheck,
      urlAccessibility: urlCheck,
      recommendations: generateRecommendations(envCheck, urlCheck),
    };

    logger.info('SUPABASE_DIAG', '📊 Diagnostic Report Complete', report);
    return report;
  },
};

// Helper function to generate recommendations
function generateRecommendations(envCheck: any, urlCheck: any): string[] {
  const recommendations: string[] = [];

  if (!envCheck.VITE_SUPABASE_URL.exists) {
    recommendations.push('❌ VITE_SUPABASE_URL is not set in .env file');
    recommendations.push('   Add: VITE_SUPABASE_URL=https://your-project-id.supabase.co');
  }

  if (!envCheck.VITE_SUPABASE_ANON_KEY.exists) {
    recommendations.push('❌ VITE_SUPABASE_ANON_KEY is not set in .env file');
    recommendations.push('   Add: VITE_SUPABASE_ANON_KEY=your_publishable_key');
  }

  if (!urlCheck.accessible && envCheck.VITE_SUPABASE_URL.exists) {
    recommendations.push('⚠️ Supabase URL is not accessible');
    recommendations.push('   1. Check if your Supabase project is paused');
    recommendations.push('   2. Verify the URL is correct');
    recommendations.push('   3. Check your internet connection');
    recommendations.push('   4. Try again in a few moments');
  }

  if (recommendations.length === 0) {
    recommendations.push('✅ All checks passed! Your Supabase setup looks good.');
  }

  return recommendations;
}

// Expose on window for console access
if (typeof window !== 'undefined') {
  (window as any).GhadwaSupabaseDiag = supabaseDiagnostics;
  logger.info('SUPABASE_DIAG', '🪟 Diagnostics exposed on window.GhadwaSupabaseDiag');
}

export default supabaseDiagnostics;
