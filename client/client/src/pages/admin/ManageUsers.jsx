import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  UserIcon,
  ShieldCheckIcon,
  NoSymbolIcon, // Replaces BanIcon
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import DataTable from '@/components/admin/DataTable';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import { adminService } from '@/services/adminService';
import { toast } from 'react-hot-toast';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [filters, setFilters] = useState({ page: 1, limit: 10, search: '' });
  const [pagination, setPagination] = useState({ total: 0, pages: 0 });

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await adminService.users.getAll(filters);
      setUsers(data.items);
      setPagination(data.pagination);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await adminService.users.approve(userId);
      toast.success('User approved successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to approve user');
    }
  };

  const handleBan = async (userId) => {
    try {
      await adminService.users.ban(userId);
      toast.success('User banned successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to ban user');
    }
  };

  const handleUnban = async (userId) => {
    try {
      await adminService.users.unban(userId);
      toast.success('User unbanned successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to unban user');
    }
  };

  const handleRoleChange = async (userId, role) => {
    try {
      await adminService.users.changeRole(userId, role);
      toast.success('User role updated');
      setIsEditModalOpen(false);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminService.users.delete(userId);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const columns = [
    {
      key: 'user',
      label: 'User',
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center space-x-3">
          {row.profileImage ? (
            <img src={row.profileImage} alt={row.firstName} className="h-8 w-8 rounded-full" />
          ) : (
            <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
              <UserIcon className="h-4 w-4 text-primary-600 dark:text-primary-400" />
            </div>
          )}
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {row.firstName} {row.lastName}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (role) => (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
          role === 'ADMIN' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
          'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
        }`}>
          {role}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (_, row) => (
        <div className="space-y-1">
          {row.isApproved ? (
            <span className="inline-flex items-center text-green-600 dark:text-green-400 text-xs">
              <CheckCircleIcon className="h-3 w-3 mr-1" />
              Approved
            </span>
          ) : (
            <span className="inline-flex items-center text-yellow-600 dark:text-yellow-400 text-xs">
              <XCircleIcon className="h-3 w-3 mr-1" />
              Pending
            </span>
          )}
          {row.isBanned && (
            <span className="inline-flex items-center text-red-600 dark:text-red-400 text-xs">
              <NoSymbolIcon className="h-3 w-3 mr-1" />
              Banned
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Joined',
      sortable: true,
      render: (date) => format(new Date(date), 'MMM d, yyyy'),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          {!row.isApproved && (
            <Button
              size="sm"
              variant="success"
              onClick={(e) => {
                e.stopPropagation();
                handleApprove(row.id);
              }}
            >
              Approve
            </Button>
          )}
          {row.isBanned ? (
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                handleUnban(row.id);
              }}
            >
              Unban
            </Button>
          ) : (
            <Button
              size="sm"
              variant="danger"
              onClick={(e) => {
                e.stopPropagation();
                handleBan(row.id);
              }}
            >
              Ban
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedUser(row);
              setIsEditModalOpen(true);
            }}
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row.id);
            }}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Users</h1>
      </div>

      <Card>
        <DataTable
          columns={columns}
          data={users}
          loading={loading}
          pagination={pagination}
          onPageChange={(page) => setFilters({ ...filters, page })}
          onFilter={(newFilters) => setFilters({ ...filters, ...newFilters, page: 1 })}
          onSort={(column, direction) => {
            setFilters({ ...filters, sortBy: column, sortOrder: direction });
          }}
        />
      </Card>

      {/* Edit Role Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Change User Role"
      >
        {selectedUser && (
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              Change role for {selectedUser.firstName} {selectedUser.lastName}
            </p>
            <div className="space-y-2">
              {['USER', 'ADMIN', 'SUPER_ADMIN'].map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleChange(selectedUser.id, role)}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">{role}</span>
                    {selectedUser.role === role && (
                      <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageUsers;