import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  MusicalNoteIcon,
  UserIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import DataTable from '@/components/admin/DataTable';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Select from '@/components/common/Select';
import { adminService } from '@/services/adminService';
import { toast } from 'react-hot-toast';

const ManageRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ page: 1, limit: 10, status: '' });
  const [pagination, setPagination] = useState({ total: 0, pages: 0 });

  useEffect(() => {
    fetchRequests();
  }, [filters]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await adminService.requests.getAll(filters);
      setRequests(data.items);
      setPagination(data.pagination);
    } catch (error) {
      toast.error('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (requestId, status) => {
    try {
      await adminService.requests.update(requestId, { status });
      toast.success(`Request ${status.toLowerCase()} successfully`);
      fetchRequests();
    } catch (error) {
      toast.error('Failed to update request');
    }
  };

  const handleDelete = async (requestId) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      try {
        await adminService.requests.delete(requestId);
        toast.success('Request deleted successfully');
        fetchRequests();
      } catch (error) {
        toast.error('Failed to delete request');
      }
    }
  };

  const columns = [
    {
      key: 'song',
      label: 'Song Request',
      render: (_, row) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{row.songTitle}</p>
          {row.stanzaNumber && (
            <p className="text-sm text-gray-500 dark:text-gray-400">Stanza: {row.stanzaNumber}</p>
          )}
        </div>
      ),
    },
    {
      key: 'requester',
      label: 'Requested By',
      render: (_, row) => (
        <div className="flex items-center space-x-2">
          <UserIcon className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-900 dark:text-white">
            {row.user?.firstName} {row.user?.lastName}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (status) => {
        const colors = {
          PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
          SCHEDULED: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
          SUNG: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
          REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        };
        return (
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
            {status}
          </span>
        );
      },
    },
    {
      key: 'votes',
      label: 'Votes',
      render: (votes) => (
        <span className="text-sm font-medium text-gray-900 dark:text-white">{votes || 0}</span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Requested',
      render: (date) => (
        <div className="flex items-center space-x-1">
          <CalendarIcon className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {format(new Date(date), 'MMM d, yyyy')}
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          {row.status === 'PENDING' && (
            <>
              <Button
                size="sm"
                variant="success"
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpdateStatus(row.id, 'SCHEDULED');
                }}
              >
                Schedule
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpdateStatus(row.id, 'REJECTED');
                }}
              >
                Reject
              </Button>
            </>
          )}
          {row.status === 'SCHEDULED' && (
            <Button
              size="sm"
              variant="success"
              onClick={(e) => {
                e.stopPropagation();
                handleUpdateStatus(row.id, 'SUNG');
              }}
            >
              Mark Sung
            </Button>
          )}
          <Button
            size="sm"
            variant="danger"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row.id);
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Song Requests</h1>
        <div className="w-48">
          <Select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
            options={[
              { value: '', label: 'All Status' },
              { value: 'PENDING', label: 'Pending' },
              { value: 'SCHEDULED', label: 'Scheduled' },
              { value: 'SUNG', label: 'Sung' },
              { value: 'REJECTED', label: 'Rejected' },
            ]}
          />
        </div>
      </div>

      <Card>
        <DataTable
          columns={columns}
          data={requests}
          loading={loading}
          pagination={pagination}
          onPageChange={(page) => setFilters({ ...filters, page })}
        />
      </Card>
    </div>
  );
};

export default ManageRequests;