import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { Helmet } from 'react-helmet-async';
import { CameraIcon } from '@heroicons/react/24/outline';
import Card from '@/components/common/Card';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { toast } from 'react-hot-toast';

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  bio: z.string().max(500, 'Bio too long').optional(),
});

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  console.log('👤 ProfilePage - Rendering with user:', user);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      const updatedUser = await response.json();
      updateUser(updatedUser);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profileImage', file);

    try {
      const response = await fetch('/api/users/profile/image', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload image');

      const { profileImage } = await response.json();
      updateUser({ ...user, profileImage });
      toast.success('Profile image updated');
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Helmet>
        <title>Profile - New Band Fellowship</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-8">
            My Profile
          </h1>

          <Card>
            {/* Profile Image */}
            <div className="text-center mb-8">
              <div className="relative inline-block">
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.firstName}
                    className="h-32 w-32 rounded-full object-cover border-4 border-primary-500"
                  />
                ) : (
                  <div className="h-32 w-32 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center border-4 border-primary-500">
                    <span className="text-primary-600 dark:text-primary-400 text-4xl font-bold">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </span>
                  </div>
                )}
                <label
                  htmlFor="profile-image"
                  className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full cursor-pointer hover:bg-primary-700 transition-colors"
                >
                  <CameraIcon className="h-5 w-5" />
                </label>
                <input
                  type="file"
                  id="profile-image"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="First Name"
                  {...register('firstName')}
                  error={errors.firstName?.message}
                  disabled={!isEditing}
                />
                <Input
                  label="Last Name"
                  {...register('lastName')}
                  error={errors.lastName?.message}
                  disabled={!isEditing}
                />
              </div>

              <Input
                label="Email"
                type="email"
                {...register('email')}
                error={errors.email?.message}
                disabled={!isEditing}
              />

              <Input
                label="Phone Number"
                type="tel"
                {...register('phone')}
                error={errors.phone?.message}
                disabled={!isEditing}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bio
                </label>
                <textarea
                  {...register('bio')}
                  rows={4}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors duration-200 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  placeholder="Tell us a little about yourself..."
                />
                {errors.bio && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.bio.message}</p>
                )}
              </div>

              {/* Role Badge */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Account Type</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {user?.role || 'USER'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                {isEditing ? (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      loading={loading}
                    >
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
            </form>
          </Card>

          {/* Account Settings */}
          <div className="mt-8">
            <Card>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Account Settings
              </h2>
              <div className="space-y-4">
                <Link
                  to="/change-password"
                  className="block p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <p className="font-medium text-gray-900 dark:text-white">Change Password</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Update your password regularly for security
                  </p>
                </Link>
                <Link
                  to="/notification-settings"
                  className="block p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <p className="font-medium text-gray-900 dark:text-white">Notification Settings</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Manage your email and push notifications
                  </p>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;