import React, { useState } from 'react';
import { adminService } from '@/services/adminService';
import { useAuth } from '@/contexts/AuthContext';

function LandingSectionForm({ section, data, onSuccess, onCancel }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: data?.title || '',
    subtitle: data?.subtitle || '',
    content: data?.content || '',
    imageUrl: data?.imageUrl || '',
    buttonText: data?.buttonText || '',
    buttonLink: data?.buttonLink || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Check if user is logged in and is admin
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      setError('Please login first');
      setLoading(false);
      return;
    }

    if (user?.role !== 'ADMIN' && user?.role !== 'SUPER_ADMIN') {
      setError('Admin access required');
      setLoading(false);
      return;
    }

    try {
      console.log(`Submitting ${section} section:`, formData);
      
      const response = await adminService.landing.update(section, formData);

      console.log('Response:', response);
      
      setSuccess(`${section} section updated successfully!`);
      
      if (onSuccess) {
        setTimeout(() => onSuccess(response), 1500);
      }
      
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.message || `Failed to update ${section} section. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getPlaceholder = () => {
    switch(section) {
      case 'hero':
        return {
          title: 'Welcome to New Band Fellowship',
          subtitle: 'Experience the beauty of worship',
          buttonText: 'Join Us',
          buttonLink: '/events'
        };
      case 'about':
        return {
          title: 'About Us',
          content: 'We are a community of believers...'
        };
      default:
        return {};
    }
  };

  const placeholder = getPlaceholder();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white capitalize">
        Edit {section} Section
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {(section === 'hero' || section === 'about' || section === 'mission' || section === 'vision') && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder={placeholder.title || `Enter ${section} title`}
            />
          </div>
        )}
        
        {section === 'hero' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Subtitle
            </label>
            <input
              type="text"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder={placeholder.subtitle}
            />
          </div>
        )}
        
        {(section === 'about' || section === 'mission' || section === 'vision') && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Content
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="6"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder={placeholder.content || `Enter ${section} content`}
            />
          </div>
        )}
        
        {(section === 'hero' || section === 'about') && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Image URL
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        )}
        
        {section === 'hero' && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Button Text
              </label>
              <input
                type="text"
                name="buttonText"
                value={formData.buttonText}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                placeholder={placeholder.buttonText}
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Button Link
              </label>
              <input
                type="text"
                name="buttonLink"
                value={formData.buttonLink}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                placeholder={placeholder.buttonLink}
              />
            </div>
          </>
        )}
        
        <div className="flex justify-end space-x-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default LandingSectionForm;