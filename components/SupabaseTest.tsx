import React, { useState, useEffect } from 'react';
import { supabaseHealthCheck } from '../services/supabase';
import { logger } from '../utils/logger';

interface HealthCheckResult {
  connected: boolean;
  auth: boolean;
  database: boolean;
  timestamp: string;
}

export const SupabaseTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState<HealthCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const runHealthCheck = async () => {
      try {
        setIsLoading(true);
        logger.info('SUPABASE_TEST', '🧪 Running Supabase health check...');
        
        const healthResult = await supabaseHealthCheck();
        
        setResult(healthResult);
        logger.info('SUPABASE_TEST', '✅ Health check completed', healthResult);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        logger.error('SUPABASE_TEST', '❌ Health check failed', err);
      } finally {
        setIsLoading(false);
      }
    };

    runHealthCheck();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="animate-spin">⚙️</div>
          <span className="text-blue-800 font-semibold">Testing Supabase connection...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-bold mb-2">❌ Connection Error</h3>
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-gray-700">No results available</p>
      </div>
    );
  }

  return (
    <div className={`p-6 border rounded-lg ${result.connected ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
      <h3 className={`font-bold mb-4 text-lg ${result.connected ? 'text-green-800' : 'text-red-800'}`}>
        {result.connected ? '✅ Supabase Connected Successfully!' : '❌ Supabase Connection Failed'}
      </h3>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between p-3 bg-white rounded border">
          <span className="font-semibold">Authentication Service</span>
          <span className={`px-3 py-1 rounded text-sm font-bold ${result.auth ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
            {result.auth ? '✅ Connected' : '❌ Failed'}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-white rounded border">
          <span className="font-semibold">Database Service</span>
          <span className={`px-3 py-1 rounded text-sm font-bold ${result.database ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
            {result.database ? '✅ Connected' : '❌ Failed'}
          </span>
        </div>

        <div className="mt-4 p-3 bg-white rounded border text-sm text-gray-600">
          <p><strong>Tested at:</strong> {new Date(result.timestamp).toLocaleString()}</p>
        </div>
      </div>

      {result.connected && (
        <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded">
          <p className="text-green-800 text-sm">
            🎉 All systems connected! You can now use Supabase in your application for orders and admin accounts.
          </p>
        </div>
      )}
    </div>
  );
};
