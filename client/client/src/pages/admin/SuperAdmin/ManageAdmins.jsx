import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  PlusIcon,
  UserIcon,
  ShieldCheckIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import DataTable from '@/components/admin/DataTable';
import { adminService } from '@/services/adminService';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const adminSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const ManageAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(adminSchema),
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const data = await adminService.super.getAdmins();
      setAdmins(data);
    } catch (error) {
      toast.error('Failed to fetch admins');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      await adminService.super.createAdmin(data);
      toast.success('Admin created successfully');
      setIsModalOpen(false);
      reset();
      fetchAdmins();
    } catch (error) {
      toast.error('Failed to create admin');
    }
  };

  const handleDelete = async (adminId) => {
    if (window.confirm('Are you sure you want to remove this admin?')) {
      try {
        await adminService.super.deleteAdmin(adminId);
        toast.success('Admin removed');
        fetchAdmins();
      } catch (error) {
        toast.error('Failed to remove admin');
      }
    }
  };

  const columns = [
    {
      key: 'user',
      label: 'Admin',
      render: (_, row) => (
        <div className="flex items-center space-x-3">
          {row.profileImage ? (
            <img src={row.profileImage} alt={row.firstName} className="h-8 w-8 rounded-full" />
          ) : (
            <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
              <ShieldCheckIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
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
      render: (role) => (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
          {role}
        </span>
      ),
    },
    {
      key: 'lastLogin',
      label: 'Last Login',
      render: (date) => date ? format(new Date(date), 'MMM d, yyyy') : 'Never',
    },
    {
      key: 'createdAt',
      label: 'Added',
      render: (date) => format(new Date(date), 'MMM d, yyyy'),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
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
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Administrators</h1>
        <Button
          variant="primary"
          icon={PlusIcon}
          onClick={() => setIsModalOpen(true)}
        >
          Add Admin
        </Button>
      </div>

      <Card>
        <DataTable
          columns={columns}
          data={admins}
          loading={loading}
        />
      </Card>

      {/* Add Admin Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          reset();
        }}
        title="Add New Administrator"
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              {...register('firstName')}
              error={errors.firstName?.message}
            />
            <Input
              label="Last Name"
              {...register('lastName')}
              error={errors.lastName?.message}
            />
          </div>

          <Input
            label="Email"
            type="email"
            {...register('email')}
            error={errors.email?.message}
          />

          <Input
            label="Phone (optional)"
            {...register('phone')}
            error={errors.phone?.message}
          />

          <Input
            label="Password"
            type="password"
            {...register('password')}
            error={errors.password?.message}
          />

          <Input
            label="Confirm Password"
            type="password"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />

          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Note:</strong> New administrators will have full access to all admin features except super admin controls.
            </p>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create Admin
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageAdmins;