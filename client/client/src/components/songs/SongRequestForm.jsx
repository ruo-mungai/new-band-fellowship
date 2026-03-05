import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { songService } from '@/services/songService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';

function SongRequestForm({ onSuccess }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    songTitle: '',
    stanzaNumber: '',
    testimony: '',
    songId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [masterSongs, setMasterSongs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSongSearch, setShowSongSearch] = useState(false);

  useEffect(() => {
    fetchMasterSongs();
  }, []);

  const fetchMasterSongs = async () => {
    try {
      const response = await songService.getMasterList({ limit: 100 });
      setMasterSongs(response.items || []);
    } catch (err) {
      console.error('Error fetching songs:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Check if user is logged in
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      setError('Please login first');
      setLoading(false);
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    try {
      console.log('Submitting song request:', formData);
      
      const response = await songService.createRequest({
        songTitle: formData.songTitle,
        stanzaNumber: formData.stanzaNumber || undefined,
        testimony: formData.testimony || undefined,
        songId: formData.songId || undefined
      });

      console.log('Response:', response);
      
      setSuccess('Song request submitted successfully!');
      setFormData({ songTitle: '', stanzaNumber: '', testimony: '', songId: '' });
      setSearchTerm('');
      
      toast.success('Song request submitted successfully!');
      
      if (onSuccess) {
        onSuccess(response);
      } else {
        setTimeout(() => navigate('/my-requests'), 2000);
      }
      
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to create request');
      toast.error(err.response?.data?.message || 'Failed to create request');
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

  const filteredSongs = masterSongs.filter(song =>
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (song.artist && song.artist.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const selectSong = (song) => {
    setFormData({
      ...formData,
      songTitle: song.title,
      songId: song.id
    });
    setSearchTerm(song.title);
    setShowSongSearch(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Request a Song</h2>
      
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
        {/* Song Search */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Search for a song (optional)
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSongSearch(true);
              }}
              onFocus={() => setShowSongSearch(true)}
              placeholder="Type to search existing songs..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            />
            <MagnifyingGlassIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            
            {showSongSearch && searchTerm && filteredSongs.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredSongs.map((song) => (
                  <button
                    key={song.id}
                    type="button"
                    onClick={() => selectSong(song)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b last:border-b-0 border-gray-100 dark:border-gray-700"
                  >
                    <p className="font-medium text-gray-900 dark:text-white">{song.title}</p>
                    {song.artist && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">{song.artist}</p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Song Title *
          </label>
          <input
            type="text"
            name="songTitle"
            value={formData.songTitle}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            placeholder="Enter song title"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Stanza Number (optional)
          </label>
          <input
            type="text"
            name="stanzaNumber"
            value={formData.stanzaNumber}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            placeholder="e.g., 1, 2, 3"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Testimony (optional)
          </label>
          <textarea
            name="testimony"
            value={formData.testimony}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            placeholder="Share why this song is meaningful to you..."
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </div>
  );
}

export default SongRequestForm;