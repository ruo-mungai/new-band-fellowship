import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import DataTable from '@/components/admin/DataTable';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import { adminService } from '@/services/adminService';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const sessionSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  type: z.enum(['FIRST_SESSION', 'SECOND_SESSION', 'REQUEST_TIME', 'TESTIMONY_TIME']),
  eventId: z.string().min(1, 'Event is required'),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  worshipLeader: z.string().optional(),
  notes: z.string().optional(),
  order: z.number().min(1, 'Order is required'),
});

const sessionTypes = [
  { value: 'FIRST_SESSION', label: 'First Session' },
  { value: 'SECOND_SESSION', label: 'Second Session' },
  { value: 'REQUEST_TIME', label: 'Request Time' },
  { value: 'TESTIMONY_TIME', label: 'Testimony Time' },
];

const ManageSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [filters, setFilters] = useState({ page: 1, limit: 20 });

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      order: 1,
    },
  });

  useEffect(() => {
    fetchSessions();
    fetchEvents();
  }, [filters]);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const data = await adminService.sessions.getAll(filters);
      console.log('Sessions data:', data);
      setSessions(data.items || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast.error('Failed to fetch sessions');
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const data = await adminService.events.getAll({ limit: 100 });
      console.log('Events data:', data);
      setEvents(data.items || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to fetch events');
      setEvents([]);
    }
  };

  const onSubmit = async (data) => {
    try {
      console.log('Submitting session data:', data);
      
      if (selectedSession) {
        await adminService.sessions.update(selectedSession.id, data);
        toast.success('Session updated successfully');
      } else {
        await adminService.sessions.create(data);
        toast.success('Session created successfully');
      }
      
      setIsModalOpen(false);
      reset({ order: 1 });
      setSelectedSession(null);
      fetchSessions();
    } catch (error) {
      console.error('Error saving session:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to save session');
    }
  };

  const handleDelete = async (sessionId) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      try {
        await adminService.sessions.delete(sessionId);
        toast.success('Session deleted successfully');
        fetchSessions();
      } catch (error) {
        console.error('Error deleting session:', error);
        toast.error(error.response?.data?.message || 'Failed to delete session');
      }
    }
  };

  const columns = [
    {
      key: 'title',
      label: 'Session',
      render: (_, row) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{row.title}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{row.event?.title || 'No event'}</p>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      render: (type) => {
        const typeLabels = {
          FIRST_SESSION: 'First Session',
          SECOND_SESSION: 'Second Session',
          REQUEST_TIME: 'Request Time',
          TESTIMONY_TIME: 'Testimony Time',
        };
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
            {typeLabels[type] || type}
          </span>
        );
      },
    },
    {
      key: 'time',
      label: 'Time',
      render: (_, row) => (
        <div className="flex items-center space-x-1">
          <ClockIcon className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {row.startTime ? new Date(row.startTime).toLocaleTimeString() : 'TBD'}
            {row.endTime && ` - ${new Date(row.endTime).toLocaleTimeString()}`}
          </span>
        </div>
      ),
    },
    {
      key: 'worshipLeader',
      label: 'Worship Leader',
      render: (leader) => leader || '—',
    },
    {
      key: 'order',
      label: 'Order',
      render: (order) => order,
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
              setSelectedSession(row);
              reset({
                title: row.title,
                type: row.type,
                eventId: row.eventId,
                startTime: row.startTime ? new Date(row.startTime).toISOString().slice(0, 16) : '',
                endTime: row.endTime ? new Date(row.endTime).toISOString().slice(0, 16) : '',
                worshipLeader: row.worshipLeader || '',
                notes: row.notes || '',
                order: row.order,
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
        <title>Manage Sessions - New Band Fellowship</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Sessions</h1>
          <Button
            variant="primary"
            icon={PlusIcon}
            onClick={() => {
              setSelectedSession(null);
              reset({ order: 1 });
              setIsModalOpen(true);
            }}
          >
            Add Session
          </Button>
        </div>

        <Card>
          <DataTable
            columns={columns}
            data={sessions}
            loading={loading}
            pagination={{
              page: filters.page,
              limit: filters.limit,
              total: sessions.length,
              pages: Math.ceil(sessions.length / filters.limit) || 1,
            }}
            onPageChange={(page) => setFilters({ ...filters, page })}
          />
        </Card>

        {/* Session Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedSession(null);
            reset({ order: 1 });
          }}
          title={selectedSession ? 'Edit Session' : 'Add New Session'}
          size="lg"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6">
            <Select
              label="Event *"
              {...register('eventId')}
              error={errors.eventId?.message}
              options={[
                { value: '', label: 'Select an event...' },
                ...events.map(event => ({
                  value: event.id,
                  label: `${event.title} (${event.eventDate ? new Date(event.eventDate).toLocaleDateString() : 'No date'})`,
                })),
              ]}
            />

            <Input
              label="Session Title *"
              {...register('title')}
              error={errors.title?.message}
              placeholder="e.g., Opening Worship"
            />

            <Select
              label="Session Type *"
              {...register('type')}
              error={errors.type?.message}
              options={sessionTypes}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Start Time"
                type="datetime-local"
                {...register('startTime')}
                error={errors.startTime?.message}
              />
              <Input
                label="End Time"
                type="datetime-local"
                {...register('endTime')}
                error={errors.endTime?.message}
              />
            </div>

            <Input
              label="Worship Leader (optional)"
              {...register('worshipLeader')}
              error={errors.worshipLeader?.message}
              placeholder="Enter worship leader name"
            />

            <Input
              label="Order *"
              type="number"
              min="1"
              {...register('order', { valueAsNumber: true })}
              error={errors.order?.message}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notes (optional)
              </label>
              <textarea
                {...register('notes')}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Any special notes for this session..."
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button type="button" variant="outline" onClick={() => {
                setIsModalOpen(false);
                setSelectedSession(null);
                reset({ order: 1 });
              }}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {selectedSession ? 'Update' : 'Create'} Session
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </>
  );
};

export default ManageSessions;