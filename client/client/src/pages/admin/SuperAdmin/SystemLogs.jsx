import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  FunnelIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon,
} from '@heroicons/react/24/outline';
import Card from '@/components/common/Card';
import Select from '@/components/common/Select';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { adminService } from '@/services/adminService';
import { toast } from 'react-hot-toast';

const SystemLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    level: '',
    from: '',
    to: '',
    search: '',
  });

  useEffect(() => {
    fetchLogs();
  }, [filters]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await adminService.super.getLogs(filters);
      setLogs(data);
    } catch (error) {
      toast.error('Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'ERROR':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'WARNING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'INFO':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'DEBUG':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const exportLogs = () => {
    const dataStr = JSON.stringify(logs, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `system-logs-${format(new Date(), 'yyyy-MM-dd')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Logs</h1>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            icon={ArrowPathIcon}
            onClick={fetchLogs}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            icon={DocumentArrowDownIcon}
            onClick={exportLogs}
          >
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select
            value={filters.level}
            onChange={(e) => setFilters({ ...filters, level: e.target.value })}
            options={[
              { value: '', label: 'All Levels' },
              { value: 'ERROR', label: 'Error' },
              { value: 'WARNING', label: 'Warning' },
              { value: 'INFO', label: 'Info' },
              { value: 'DEBUG', label: 'Debug' },
            ]}
            icon={FunnelIcon}
          />

          <Input
            type="date"
            value={filters.from}
            onChange={(e) => setFilters({ ...filters, from: e.target.value })}
            placeholder="From Date"
          />

          <Input
            type="date"
            value={filters.to}
            onChange={(e) => setFilters({ ...filters, to: e.target.value })}
            placeholder="To Date"
          />

          <Input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="Search logs..."
          />
        </div>
      </Card>

      {/* Logs */}
      <Card>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
          </div>
        ) : (
          <div className="space-y-4">
            {logs.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-12">
                No logs found
              </p>
            ) : (
              logs.map((log, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(log.level)}`}>
                        {log.level}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss')}
                      </span>
                    </div>
                    {log.user && (
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        User: {log.user}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-900 dark:text-white font-mono text-sm">
                    {log.message}
                  </p>
                  {log.details && (
                    <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-900 rounded text-xs overflow-x-auto">
                      {JSON.stringify(log.details, null, 2)}
                    </pre>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default SystemLogs;