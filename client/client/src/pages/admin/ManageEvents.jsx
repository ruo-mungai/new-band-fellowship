import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  PlusIcon,
  CalendarIcon,
  MapPinIcon,
  UserGroupIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import DataTable from '@/components/admin/DataTable';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import TextArea from '@/components/common/TextArea';
import { adminService } from '@/services/adminService';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const eventSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  description: z.string().min(10, 'Description is required'),
  eventDate: z.string().min(1, 'Event date is required'),
  location: z.string().min(3, 'Location is required'),
  maxAttendees: z.number().optional(),
  bannerImage: z.string().optional(),
});

const ManageEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filters, setFilters] = useState({ page: 1, limit: 10 });
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(eventSchema),
  });

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await adminService.events.getAll(filters);
      console.log('📡 Events data received:', data);
      
      if (data && data.items) {
        setEvents(data.items);
        setPagination(data.pagination || { page: 1, limit: 10, total: data.items.length, pages: 1 });
      } else if (Array.isArray(data)) {
        setEvents(data);
        setPagination({ page: 1, limit: 10, total: data.length, pages: 1 });
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error('❌ Failed to fetch events:', error);
      toast.error('Failed to fetch events');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      // Convert maxAttendees to number if provided
      const eventData = {
        ...data,
        maxAttendees: data.maxAttendees ? parseInt(data.maxAttendees) : null,
      };

      if (selectedEvent) {
        await adminService.events.update(selectedEvent.id, eventData);
        toast.success('Event updated successfully');
      } else {
        await adminService.events.create(eventData);
        toast.success('Event created successfully');
      }
      setIsModalOpen(false);
      reset();
      setSelectedEvent(null);
      fetchEvents();
    } catch (error) {
      console.error('Failed to save event:', error);
      toast.error(error.message || 'Failed to save event');
    }
  };

  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await adminService.events.delete(eventId);
        toast.success('Event deleted successfully');
        fetchEvents();
      } catch (error) {
        toast.error('Failed to delete event');
      }
    }
  };

  const columns = [
    {
      key: 'title',
      label: 'Event',
      render: (_, row) => (
        <div className="flex items-center space-x-3">
          {row.bannerImage && (
            <img src={row.bannerImage} alt={row.title} className="h-10 w-10 rounded object-cover" />
          )}
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{row.title}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{row.description}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'eventDate',
      label: 'Date & Time',
      render: (date) => (
        <div className="flex items-center space-x-1">
          <CalendarIcon className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {date ? format(new Date(date), 'MMM d, yyyy h:mm a') : 'N/A'}
          </span>
        </div>
      ),
    },
    {
      key: 'location',
      label: 'Location',
      render: (location) => (
        <div className="flex items-center space-x-1">
          <MapPinIcon className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">{location || 'N/A'}</span>
        </div>
      ),
    },
    {
      key: 'attendees',
      label: 'Attendance',
      render: (_, row) => (
        <div className="flex items-center space-x-1">
          <UserGroupIcon className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {row.rsvps?.length || 0} / {row.maxAttendees || '∞'}
          </span>
        </div>
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
              navigate(`/admin/playlist?event=${row.id}`);
            }}
          >
            Playlist
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              window.open(`/events/${row.id}`, '_blank');
            }}
          >
            <EyeIcon className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedEvent(row);
              reset({
                title: row.title,
                description: row.description,
                eventDate: row.eventDate ? new Date(row.eventDate).toISOString().slice(0, 16) : '',
                location: row.location,
                maxAttendees: row.maxAttendees,
                bannerImage: row.bannerImage || '',
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Events</h1>
        <Button
          variant="primary"
          icon={PlusIcon}
          onClick={() => {
            setSelectedEvent(null);
            reset({});
            setIsModalOpen(true);
          }}
        >
          New Event
        </Button>
      </div>

      <Card>
        <DataTable
          columns={columns}
          data={events}
          loading={loading}
          onRowClick={(row) => navigate(`/admin/events/${row.id}`)}
          pagination={pagination}
          onPageChange={(page) => setFilters({ ...filters, page })}
        />
      </Card>

      {/* Event Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvent(null);
          reset({});
        }}
        title={selectedEvent ? 'Edit Event' : 'Create New Event'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6">
          <Input
            label="Event Title"
            {...register('title')}
            error={errors.title?.message}
          />
          
          <TextArea
            label="Description"
            {...register('description')}
            error={errors.description?.message}
            rows={4}
          />
          
          <Input
            label="Event Date & Time"
            type="datetime-local"
            {...register('eventDate')}
            error={errors.eventDate?.message}
          />
          
          <Input
            label="Location"
            {...register('location')}
            error={errors.location?.message}
          />
          
          <Input
            label="Maximum Attendees (optional)"
            type="number"
            {...register('maxAttendees', { valueAsNumber: true })}
            error={errors.maxAttendees?.message}
          />
          
          <Input
            label="Banner Image URL (optional)"
            {...register('bannerImage')}
            error={errors.bannerImage?.message}
          />
          
          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setSelectedEvent(null);
                reset({});
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {selectedEvent ? 'Update' : 'Create'} Event
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageEvents;