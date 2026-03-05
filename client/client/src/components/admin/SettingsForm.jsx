import React, { useState } from 'react';
import { adminService } from '@/services/adminService';
import { useAuth } from '@/contexts/AuthContext';

function SettingsForm({ settings, onSuccess }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    siteName: settings?.siteName || 'New Band Fellowship',
    siteDescription: settings?.siteDescription || '',
    siteEmail: settings?.siteEmail || '',
    sitePhone: settings?.sitePhone || '',
    siteAddress: settings?.siteAddress || '',
    allowRegistration: settings?.allowRegistration ?? true,
    requireApproval: settings?.requireApproval ?? true,
    enableDonations: settings?.enableDonations ?? false,
    enableLiveStreaming: settings?.enableLiveStreaming ?? false,
    enableRSVP: settings?.enableRSVP ?? true,
    enableComments: settings?.enableComments ?? true,
    voteMode: settings?.voteMode || 'DISABLED',
    facebook: settings?.facebook || '',
    twitter: settings?.twitter || '',
    instagram: settings?.instagram || '',
    youtube: settings?.youtube || '',
    metaTitle: settings?.metaTitle || '',
    metaDescription: settings?.metaDescription || '',
    metaKeywords: settings?.metaKeywords || ''
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
      console.log('Submitting settings:', formData);
      
      const response = await adminService.settings.update(formData);

      console.log('Response:', response);
      
      setSuccess('Settings updated successfully!');
      
      if (onSuccess) {
        setTimeout(() => onSuccess(response), 1500);
      }
      
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.message || 'Failed to update settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">System Settings</h2>
      
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
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">General Settings</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Site Name
          </label>
          <input
            type="text"
            name="siteName"
            value={formData.siteName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Site Description
          </label>
          <textarea
            name="siteDescription"
            value={formData.siteDescription}
            onChange={handleChange}
            rows="2"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Contact Email
          </label>
          <input
            type="email"
            name="siteEmail"
            value={formData.siteEmail}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Contact Phone
          </label>
          <input
            type="text"
            name="sitePhone"
            value={formData.sitePhone}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Address
          </label>
          <input
            type="text"
            name="siteAddress"
            value={formData.siteAddress}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-6 mb-4">Feature Toggles</h3>
        
        <div className="space-y-3 mb-6">
          <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Allow Registration</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Enable new user registration</p>
            </div>
            <input
              type="checkbox"
              name="allowRegistration"
              checked={formData.allowRegistration}
              onChange={handleChange}
              className="h-5 w-5 text-primary-600 rounded focus:ring-primary-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Require Approval</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">New users need admin approval</p>
            </div>
            <input
              type="checkbox"
              name="requireApproval"
              checked={formData.requireApproval}
              onChange={handleChange}
              className="h-5 w-5 text-primary-600 rounded focus:ring-primary-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Enable Donations</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Accept online donations</p>
            </div>
            <input
              type="checkbox"
              name="enableDonations"
              checked={formData.enableDonations}
              onChange={handleChange}
              className="h-5 w-5 text-primary-600 rounded focus:ring-primary-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Enable Live Streaming</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Show live stream on website</p>
            </div>
            <input
              type="checkbox"
              name="enableLiveStreaming"
              checked={formData.enableLiveStreaming}
              onChange={handleChange}
              className="h-5 w-5 text-primary-600 rounded focus:ring-primary-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Enable RSVP</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Allow users to RSVP for events</p>
            </div>
            <input
              type="checkbox"
              name="enableRSVP"
              checked={formData.enableRSVP}
              onChange={handleChange}
              className="h-5 w-5 text-primary-600 rounded focus:ring-primary-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Enable Comments</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Allow comments on blog posts</p>
            </div>
            <input
              type="checkbox"
              name="enableComments"
              checked={formData.enableComments}
              onChange={handleChange}
              className="h-5 w-5 text-primary-600 rounded focus:ring-primary-500"
            />
          </label>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Voting Mode
          </label>
          <select
            name="voteMode"
            value={formData.voteMode}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="DISABLED">Disabled (First-come, first-served)</option>
            <option value="ENABLED">Enabled (Community voting)</option>
            <option value="HYBRID">Hybrid (Admin can override)</option>
          </select>
        </div>
        
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-6 mb-4">Social Media</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Facebook URL
          </label>
          <input
            type="url"
            name="facebook"
            value={formData.facebook}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            placeholder="https://facebook.com/..."
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Twitter URL
          </label>
          <input
            type="url"
            name="twitter"
            value={formData.twitter}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            placeholder="https://twitter.com/..."
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Instagram URL
          </label>
          <input
            type="url"
            name="instagram"
            value={formData.instagram}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            placeholder="https://instagram.com/..."
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            YouTube URL
          </label>
          <input
            type="url"
            name="youtube"
            value={formData.youtube}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            placeholder="https://youtube.com/..."
          />
        </div>
        
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-6 mb-4">SEO Settings</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Meta Title
          </label>
          <input
            type="text"
            name="metaTitle"
            value={formData.metaTitle}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Meta Description
          </label>
          <textarea
            name="metaDescription"
            value={formData.metaDescription}
            onChange={handleChange}
            rows="2"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Meta Keywords
          </label>
          <input
            type="text"
            name="metaKeywords"
            value={formData.metaKeywords}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            placeholder="worship, fellowship, gospel"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}

export default SettingsForm;