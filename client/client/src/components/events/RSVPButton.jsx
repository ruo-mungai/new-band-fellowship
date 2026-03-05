import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';

const rsvpSchema = z.object({
  numberOfGuests: z.number().min(1, 'At least 1 guest').max(10, 'Maximum 10 guests'),
  notes: z.string().optional(),
});

const RSVPButton = ({ eventId, onRSVP }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      numberOfGuests: 1,
      notes: '',
    },
  });

  const handleRSVPClick = () => {
    if (!isAuthenticated) {
      // Redirect to login with return URL
      navigate('/login', { state: { from: `/events/${eventId}` } });
      return;
    }
    setIsOpen(true);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/events/${eventId}/rsvp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to RSVP');

      setIsRegistered(true);
      setIsOpen(false);
      reset();
      toast.success('RSVP confirmed!');
      if (onRSVP) onRSVP();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRSVP = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/events/${eventId}/rsvp`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to cancel RSVP');

      setIsRegistered(false);
      toast.success('RSVP cancelled');
      if (onRSVP) onRSVP();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (isRegistered) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-center space-x-2 text-green-600 dark:text-green-400">
          <CheckCircleIcon className="h-5 w-5" />
          <span className="font-medium">You're registered!</span>
        </div>
        <Button
          variant="outline"
          onClick={handleCancelRSVP}
          loading={loading}
          fullWidth
        >
          Cancel RSVP
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button
        variant="primary"
        onClick={handleRSVPClick}
        fullWidth
      >
        RSVP for Event
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="RSVP for Event"
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Number of Guests"
            type="number"
            min={1}
            max={10}
            {...register('numberOfGuests', { valueAsNumber: true })}
            error={errors.numberOfGuests?.message}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes (optional)
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors duration-200"
              placeholder="Any special requests or notes?"
            />
            {errors.notes && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.notes.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
            >
              Confirm RSVP
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default RSVPButton;