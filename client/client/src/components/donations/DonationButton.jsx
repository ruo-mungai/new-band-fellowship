import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';

const donationSchema = z.object({
  amount: z.number().min(100, 'Minimum donation is 100'),
  donorName: z.string().optional(),
  donorEmail: z.string().email('Invalid email').optional(),
  isAnonymous: z.boolean().default(false),
  message: z.string().max(200, 'Message too long').optional(),
});

const DonationButton = () => {
  const { isAuthenticated, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      amount: 1000,
      isAnonymous: false,
      donorName: user ? `${user.firstName} ${user.lastName}` : '',
      donorEmail: user ? user.email : '',
    },
  });

  const isAnonymous = watch('isAnonymous');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(isAuthenticated && {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          }),
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Donation failed');

      const result = await response.json();
      
      // Redirect to payment page or show payment instructions
      if (result.paymentUrl) {
        window.location.href = result.paymentUrl;
      } else {
        toast.success('Thank you for your donation!');
        setIsOpen(false);
        reset();
      }
    } catch (error) {
      toast.error('Failed to process donation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="primary"
        icon={CurrencyDollarIcon}
        onClick={() => setIsOpen(true)}
      >
        Donate
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Make a Donation"
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Amount (KES)
            </label>
            <Input
              type="number"
              min="100"
              step="100"
              {...register('amount', { valueAsNumber: true })}
              error={errors.amount?.message}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isAnonymous"
              {...register('isAnonymous')}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="isAnonymous" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Donate anonymously
            </label>
          </div>

          {!isAnonymous && (
            <>
              <Input
                label="Your Name (optional)"
                {...register('donorName')}
                error={errors.donorName?.message}
              />

              <Input
                label="Email Address (optional)"
                type="email"
                {...register('donorEmail')}
                error={errors.donorEmail?.message}
              />
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Message (optional)
            </label>
            <textarea
              {...register('message')}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Add a prayer request or message..."
            />
            {errors.message && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.message.message}</p>
            )}
          </div>

          <div className="bg-primary-50 dark:bg-gray-800 rounded-lg p-4">
            <p className="text-sm text-primary-800 dark:text-primary-200">
              💝 Your donation helps us continue our worship and fellowship activities in Ruiru Town.
            </p>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
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
              Proceed to Payment
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default DonationButton;