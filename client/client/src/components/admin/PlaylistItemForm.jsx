import React, { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';
import { useAuth } from '@/contexts/AuthContext';
import { PhotoIcon } from '@heroicons/react/24/outline';

function PlaylistItemForm({ item, eventId, sessions, onSuccess, onCancel }) {
  const { user } = useAuth();
  const [songs, setSongs] = useState([]);
  const [formData, setFormData] = useState({
    songId: item?.songId || '',
    sessionId: item?.sessionId || '',
    order: item?.order || 1,
    backgroundImage: item?.backgroundImage || '',
    backgroundColor: item?.backgroundColor || '#f97316',
    notes: item?.notes || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fetchingSongs, setFetchingSongs] = useState(true);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    setFetchingSongs(true);
    try {
      const response = await adminService.songs.getMasterList();
      setSongs(response || []);
    } catch (err) {
      console.error('Error fetching songs:', err);
    } finally {
      setFetchingSongs(false);
    }
  };

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
      console.log('Submitting playlist item:', formData);
      
      let response;
      if (item) {
        // Update existing item
        response = await adminService.playlist.updateSong(item.id, formData);
      } else {
        // Add new item
        response = await adminService.playlist.addSong(eventId, formData);
      }

      console.log('Response:', response);
      
      setSuccess(item ? 'Item updated successfully!' : 'Item added successfully!');
      
      if (onSuccess) {
        setTimeout(() => onSuccess(response), 1500);
      }
      
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.message || `Failed to ${item ? 'update' : 'add'} item. Please try again.`);
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
            Select Song *
          </label>
          {fetchingSongs ? (
            <div className="text-gray-500">Loading songs...</div>
          ) : (
            <select
              name="songId"
              value={formData.songId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Choose a song...</option>
              {songs.map(song => (
                <option key={song.id} value={song.id}>
                  {song.title} {song.artist ? `- ${song.artist}` : ''}
                </option>
              ))}
            </select>
          )}
        </div>
        
        <div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
    Session *
  </label>
  <Select
    value={formData.sessionId}
    onChange={(e) => setFormData({ ...formData, sessionId: e.target.value })}
    options={[
      { value: '', label: 'Select a session...' },
      ...sessions.map(session => ({
        value: session.id,
        label: `${session.title} (${session.type.replace('_', ' ')})`,
      })),
    ]}
    required
  />
  <p className="mt-1 text-xs text-gray-500">
    Select which part of the service this song belongs to
  </p>
</div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Order *
          </label>
          <input
            type="number"
            name="order"
            value={formData.order}
            onChange={handleChange}
            min="1"
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Background Image URL (optional)
          </label>
          <div className="relative">
            <input
              type="url"
              name="backgroundImage"
              value={formData.backgroundImage}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white pl-10"
              placeholder="https://example.com/image.jpg"
            />
            <PhotoIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Background Color
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              name="backgroundColor"
              value={formData.backgroundColor}
              onChange={handleChange}
              className="h-10 w-20 rounded border border-gray-300 dark:border-gray-600"
            />
            <input
              type="text"
              name="backgroundColor"
              value={formData.backgroundColor}
              onChange={handleChange}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder="#f97316"
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Notes (optional)
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            placeholder="Any special instructions or notes..."
          />
        </div>
        
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
            disabled={loading || fetchingSongs}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (item ? 'Updating...' : 'Adding...') : (item ? 'Update Item' : 'Add Item')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PlaylistItemForm;