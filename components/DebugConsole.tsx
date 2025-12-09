import React, { useState } from 'react';
import { logger } from '../utils/logger';

export const DebugConsole: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('');

  const allLogs = logger.getLogs();
  const filteredLogs = allLogs.filter(log =>
    log.module.toLowerCase().includes(filter.toLowerCase()) ||
    log.message.toLowerCase().includes(filter.toLowerCase())
  );

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg z-[9999]"
        title="Open Debug Console"
      >
        <i className="fas fa-bug text-lg"></i>
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 right-0 w-96 h-96 bg-gray-900 text-white rounded-t-lg shadow-2xl z-[9999] flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 p-3 flex justify-between items-center border-b border-gray-700">
        <h3 className="font-bold text-sm">🐛 Debug Console ({filteredLogs.length})</h3>
        <div className="flex gap-2">
          <button
            onClick={() => logger.clearLogs()}
            className="text-xs bg-red-600 hover:bg-red-700 px-2 py-1 rounded"
            title="Clear all logs"
          >
            Clear
          </button>
          <button
            onClick={() => logger.downloadLogs()}
            className="text-xs bg-green-600 hover:bg-green-700 px-2 py-1 rounded"
            title="Download logs as JSON"
          >
            Download
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-gray-800 p-2 border-b border-gray-700">
        <input
          type="text"
          placeholder="Filter logs..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full px-2 py-1 text-xs bg-gray-700 text-white rounded placeholder-gray-500"
        />
      </div>

      {/* Logs */}
      <div className="flex-1 overflow-y-auto font-mono text-xs p-2 bg-gray-950">
        {filteredLogs.length === 0 ? (
          <div className="text-gray-500">No logs to display</div>
        ) : (
          filteredLogs.map((log, idx) => (
            <div key={idx} className="mb-1 p-1 hover:bg-gray-800 rounded">
              <span className="text-gray-500">{log.timestamp.split('T')[1].slice(0, 8)}</span>{' '}
              <span className="font-bold text-yellow-400">[{log.level}]</span>{' '}
              <span className="text-blue-400">{log.module}</span>{' '}
              <span className="text-white">{log.message}</span>
              {log.data && (
                <div className="text-gray-400 ml-4 text-xs">
                  {JSON.stringify(log.data, null, 1).split('\n').map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer Stats */}
      <div className="bg-gray-800 border-t border-gray-700 p-2 text-xs text-gray-400 flex justify-between">
        <span>Total Logs: {allLogs.length}</span>
        <span>Errors: {logger.getLogsByLevel('ERROR' as any).length}</span>
        <span>Warnings: {logger.getLogsByLevel('WARN' as any).length}</span>
      </div>
    </div>
  );
};
