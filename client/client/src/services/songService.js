import api from './api';

export const songService = {
  // Get all songs with pagination
  getMasterList: async (params) => {
    try {
      console.log('📡 Fetching master songs with params:', params);
      const response = await api.songs.getMasterList(params);
      console.log('📡 Master songs response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching songs:', error);
      return { items: [], pagination: { page: 1, limit: 20, total: 0, pages: 0 } };
    }
  },

  // Get single song by ID
  getSongById: async (id) => {
    try {
      console.log('📡 Fetching song by ID:', id);
      const response = await api.songs.getById(id);
      console.log('📡 Song response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching song:', error);
      throw error;
    }
  },

  // Create new song
  createSong: async (data) => {
    try {
      console.log('📡 Creating new song:', data);
      const response = await api.songs.create(data);
      console.log('📡 Create song response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error creating song:', error);
      throw error;
    }
  },

  // Update song
  updateSong: async (id, data) => {
    try {
      console.log('📡 Updating song:', id, data);
      const response = await api.songs.update(id, data);
      console.log('📡 Update song response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error updating song:', error);
      throw error;
    }
  },

  // Delete song
  deleteSong: async (id) => {
    try {
      console.log('📡 Deleting song:', id);
      const response = await api.songs.delete(id);
      console.log('📡 Delete song response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error deleting song:', error);
      throw error;
    }
  },

  // Get all song requests (with optional filters)
  getRequests: async (params) => {
    try {
      console.log('📡 Fetching song requests with params:', params);
      const response = await api.songs.getRequests(params);
      console.log('📡 Song requests response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching song requests:', error);
      // Return empty result on error to prevent UI breaking
      return { items: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } };
    }
  },

  // Create song request
  createRequest: async (data) => {
    try {
      console.log('📡 Creating song request with data:', data);
      const response = await api.songs.createRequest(data);
      console.log('📡 Create request response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error creating song request:', error);
      throw error;
    }
  },

  // Update song request
  updateRequest: async (id, data) => {
    try {
      console.log('📡 Updating song request:', id, data);
      const response = await api.songs.updateRequest(id, data);
      console.log('📡 Update request response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error updating song request:', error);
      throw error;
    }
  },

  // Delete song request
  deleteRequest: async (id) => {
    try {
      console.log('📡 Deleting song request:', id);
      const response = await api.songs.deleteRequest(id);
      console.log('📡 Delete request response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error deleting song request:', error);
      throw error;
    }
  },

  // Vote on song request
  voteRequest: async (id) => {
    try {
      console.log('📡 Voting on song request:', id);
      const response = await api.songs.voteRequest(id);
      console.log('📡 Vote response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error voting on request:', error);
      throw error;
    }
  },

  // Get playlist item details
  getPlaylistItem: async (playlistId, songId) => {
    try {
      console.log('📡 Fetching playlist item:', { playlistId, songId });
      const response = await api.songs.getPlaylistItem(playlistId, songId);
      console.log('📡 Playlist item response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching playlist item:', error);
      throw error;
    }
  },
};