import React, { useState } from 'react';
import { adminService } from '@/services/adminService';
import { useAuth } from '@/contexts/AuthContext';

function GalleryImageForm({ image, onSuccess, onCancel }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: image?.title || '',
    description: image?.description || '',
    imageUrl: image?.imageUrl || ''
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
      console.log('Submitting gallery image:', formData);
      
      let response;
      if (image) {
        // Update existing image
        response = await adminService.gallery.update(image.id, formData);
      } else {
        // Add new image
        response = await adminService.gallery.add(formData);
      }

      console.log('Response:', response);
      
      setSuccess(image ? 'Image updated successfully!' : 'Image added successfully!');
      
      if (onSuccess) {
        setTimeout(() => onSuccess(response), 1500);
      }
      
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.message || `Failed to ${image ? 'update' : 'add'} image. Please try again.`);
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

  return (
    <div className="p-6">
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
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Image Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            placeholder="Enter image title"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description (optional)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            placeholder="Enter image description"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Image URL *
          </label>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            placeholder="https://example.com/image.jpg"
          />
        </div>
        
        {formData.imageUrl && (
          <div className="mb-6">
            <img
              src={formData.imageUrl}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x300?text=Invalid+Image';
              }}
            />
          </div>
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
            {loading ? (image ? 'Updating...' : 'Adding...') : (image ? 'Update Image' : 'Add Image')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default GalleryImageForm;