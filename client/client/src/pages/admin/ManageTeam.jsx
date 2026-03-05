import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import DataTable from '@/components/admin/DataTable';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import TextArea from '@/components/common/TextArea';
import ImageUpload from '@/components/admin/ImageUpload';
import { adminService } from '@/services/adminService';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const teamMemberSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  role: z.string().min(2, 'Role is required'),
  bio: z.string().optional(),
  imageUrl: z.string().optional(),
  order: z.number().min(1, 'Order is required'),
  isActive: z.boolean().optional(),
});

const ManageTeam = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [filters, setFilters] = useState({ page: 1, limit: 20 });

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      isActive: true,
      order: 1,
    },
  });

  useEffect(() => {
    fetchTeam();
  }, [filters]);

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const data = await adminService.team.getAll(filters);
      console.log('Team data:', data);
      setTeam(data.items || []);
    } catch (error) {
      console.error('Error fetching team:', error);
      toast.error('Failed to fetch team');
      setTeam([]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      console.log('Submitting team member:', data);
      
      if (selectedMember) {
        await adminService.team.update(selectedMember.id, data);
        toast.success('Team member updated successfully');
      } else {
        await adminService.team.create(data);
        toast.success('Team member added successfully');
      }
      setIsModalOpen(false);
      reset({ isActive: true, order: 1 });
      setSelectedMember(null);
      fetchTeam();
    } catch (error) {
      console.error('Error saving team member:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to save team member');
    }
  };

  const handleDelete = async (memberId) => {
    if (window.confirm('Are you sure you want to remove this team member?')) {
      try {
        await adminService.team.delete(memberId);
        toast.success('Team member removed successfully');
        fetchTeam();
      } catch (error) {
        console.error('Error deleting team member:', error);
        toast.error(error.response?.data?.message || 'Failed to remove team member');
      }
    }
  };

  const handleImageUpload = (url) => {
    setValue('imageUrl', url);
  };

  const columns = [
    {
      key: 'member',
      label: 'Team Member',
      render: (_, row) => (
        <div className="flex items-center space-x-3">
          {row.imageUrl ? (
            <img src={row.imageUrl} alt={row.name} className="h-10 w-10 rounded-full object-cover" />
          ) : (
            <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
              <UserIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
          )}
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{row.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{row.role}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'bio',
      label: 'Bio',
      render: (bio) => bio ? bio.substring(0, 50) + '...' : '—',
    },
    {
      key: 'order',
      label: 'Order',
      render: (order) => order,
    },
    {
      key: 'status',
      label: 'Status',
      render: (_, row) => (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          row.isActive 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
        }`}>
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedMember(row);
              reset({
                name: row.name,
                role: row.role,
                bio: row.bio || '',
                imageUrl: row.imageUrl || '',
                order: row.order,
                isActive: row.isActive,
              });
              setIsModalOpen(true);
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
    <>
      <Helmet>
        <title>Manage Team - New Band Fellowship</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Team</h1>
          <Button
            variant="primary"
            icon={PlusIcon}
            onClick={() => {
              setSelectedMember(null);
              reset({ isActive: true, order: 1 });
              setIsModalOpen(true);
            }}
          >
            Add Team Member
          </Button>
        </div>

        <Card>
          <DataTable
            columns={columns}
            data={team}
            loading={loading}
            pagination={{
              page: filters.page,
              limit: filters.limit,
              total: team.length,
              pages: Math.ceil(team.length / filters.limit) || 1,
            }}
            onPageChange={(page) => setFilters({ ...filters, page })}
          />
        </Card>

        {/* Team Member Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedMember(null);
            reset({ isActive: true, order: 1 });
          }}
          title={selectedMember ? 'Edit Team Member' : 'Add Team Member'}
          size="lg"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6">
            <Input
              label="Full Name *"
              {...register('name')}
              error={errors.name?.message}
              placeholder="Enter full name"
            />

            <Input
              label="Role/Position *"
              {...register('role')}
              error={errors.role?.message}
              placeholder="e.g., Senior Pastor, Worship Leader"
            />

            <TextArea
              label="Bio (optional)"
              {...register('bio')}
              error={errors.bio?.message}
              rows={4}
              placeholder="Tell about this team member..."
            />

            <ImageUpload
              label="Profile Photo"
              value={selectedMember?.imageUrl}
              onUpload={handleImageUpload}
              onRemove={() => setValue('imageUrl', '')}
            />

            <Input
              label="Display Order *"
              type="number"
              min="1"
              {...register('order', { valueAsNumber: true })}
              error={errors.order?.message}
            />

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                {...register('isActive')}
                className="h-4 w-4 text-primary-600 rounded focus:ring-primary-500"
              />
              <label htmlFor="isActive" className="text-sm text-gray-700 dark:text-gray-300">
                Active (show on website)
              </label>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button type="button" variant="outline" onClick={() => {
                setIsModalOpen(false);
                setSelectedMember(null);
                reset({ isActive: true, order: 1 });
              }}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {selectedMember ? 'Update' : 'Add'} Member
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </>
  );
};

export default ManageTeam;