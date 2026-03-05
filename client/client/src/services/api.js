import axiosInstance from '@/config/axios';

export const api = {
  // Public endpoints
  public: {
    getLanding: () => axiosInstance.get('/public/landing'),
    getEvents: (params) => axiosInstance.get('/public/events', { params }),
    getGallery: () => axiosInstance.get('/public/gallery'),
    getBlogs: (params) => axiosInstance.get('/public/blogs', { params }),
    getBlogBySlug: (slug) => axiosInstance.get(`/public/blogs/${slug}`),
    getUpcomingPlaylist: () => axiosInstance.get('/public/playlist/upcoming'),
    getCategories: () => axiosInstance.get('/public/categories'),
    getTags: () => axiosInstance.get('/public/tags'),
      getTeam: () => axiosInstance.get('/public/team'),
  },

  // Auth
  auth: {
    register: (data) => {
      console.log('📤 API POST /auth/register');
      return axiosInstance.post('/auth/register', data);
    },
    login: (data) => {
      console.log('📤 API POST /auth/login');
      return axiosInstance.post('/auth/login', data);
    },
    logout: () => {
      console.log('📤 API POST /auth/logout');
      return axiosInstance.post('/auth/logout');
    },
    getMe: () => {
      console.log('📤 API GET /auth/me');
      return axiosInstance.get('/auth/me');
    },
    refreshToken: (data) => {
      console.log('📤 API POST /auth/refresh-token');
      return axiosInstance.post('/auth/refresh-token', data);
    },
  },

  // Users
  users: {
    getProfile: () => axiosInstance.get('/users/profile'),
    updateProfile: (data) => axiosInstance.patch('/users/profile', data),
    uploadProfileImage: (formData) => axiosInstance.post('/users/profile/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
    getMyRequests: (params) => axiosInstance.get('/users/song-requests', { params }),
  },

  // Songs - COMPLETE WITH ALL ENDPOINTS
  songs: {
    // Master song list with pagination
    getMasterList: (params) => axiosInstance.get('/songs/master', { params }),
    
    // Single song operations
    getById: (id) => axiosInstance.get(`/songs/${id}`),
    create: (data) => axiosInstance.post('/songs', data),
    update: (id, data) => axiosInstance.patch(`/songs/${id}`, data),
    delete: (id) => axiosInstance.delete(`/songs/${id}`),
    
    // Song requests
    getRequests: (params) => axiosInstance.get('/songs/requests', { params }),
    createRequest: (data) => axiosInstance.post('/songs/requests', data),
    updateRequest: (id, data) => axiosInstance.patch(`/songs/requests/${id}`, data),
    deleteRequest: (id) => axiosInstance.delete(`/songs/requests/${id}`),
    voteRequest: (id) => axiosInstance.post(`/songs/requests/${id}/vote`),
    
    // Playlist item details
    getPlaylistItem: (playlistId, songId) => 
      axiosInstance.get(`/playlists/${playlistId}/songs/${songId}`),
  },

  // Events
  events: {
    getAll: (params) => axiosInstance.get('/public/events', { params }),
    getOne: (id) => axiosInstance.get(`/events/${id}`),
    rsvp: (id, data) => axiosInstance.post(`/events/${id}/rsvp`, data),
    cancelRsvp: (id) => axiosInstance.delete(`/events/${id}/rsvp`),
  },

  // Admin - COMPLETE
  admin: {
    getDashboard: () => axiosInstance.get('/admin/dashboard'),
    
    // Users management
    users: {
      getAll: (params) => axiosInstance.get('/admin/users', { params }),
      getOne: (id) => axiosInstance.get(`/admin/users/${id}`),
      approve: (id) => axiosInstance.patch(`/admin/users/${id}/approve`),
      ban: (id) => axiosInstance.patch(`/admin/users/${id}/ban`),
      unban: (id) => axiosInstance.patch(`/admin/users/${id}/unban`),
      changeRole: (id, data) => axiosInstance.patch(`/admin/users/${id}/role`, data),
      delete: (id) => axiosInstance.delete(`/admin/users/${id}`),
    },

    // Song requests management
    requests: {
      getAll: (params) => axiosInstance.get('/admin/requests', { params }),
      update: (id, data) => axiosInstance.patch(`/admin/requests/${id}`, data),
      delete: (id) => axiosInstance.delete(`/admin/requests/${id}`),
    },

    // Events management
    events: {
      getAll: (params) => axiosInstance.get('/admin/events', { params }),
      getOne: (id) => axiosInstance.get(`/admin/events/${id}`),
      create: (data) => axiosInstance.post('/admin/events', data),
      update: (id, data) => axiosInstance.patch(`/admin/events/${id}`, data),
      delete: (id) => axiosInstance.delete(`/admin/events/${id}`),
    },

    // Playlist management
    playlist: {
      get: (eventId) => axiosInstance.get(`/admin/playlist/${eventId}`),
      update: (eventId, data) => axiosInstance.patch(`/admin/playlist/${eventId}`, data),
      addSong: (eventId, data) => axiosInstance.post(`/admin/playlist/${eventId}/items`, data),
      updateSong: (itemId, data) => axiosInstance.patch(`/admin/playlist/items/${itemId}`, data),
      removeSong: (itemId) => axiosInstance.delete(`/admin/playlist/items/${itemId}`),
      reorder: (eventId, data) => axiosInstance.post(`/admin/playlist/${eventId}/reorder`, data),
    },

    // Blog management
    blogs: {
      getAll: (params) => axiosInstance.get('/admin/blogs', { params }),
      create: (data) => axiosInstance.post('/admin/blogs', data),
      update: (id, data) => axiosInstance.patch(`/admin/blogs/${id}`, data),
      delete: (id) => axiosInstance.delete(`/admin/blogs/${id}`),
      publish: (id) => axiosInstance.post(`/admin/blogs/${id}/publish`),
      unpublish: (id) => axiosInstance.post(`/admin/blogs/${id}/unpublish`),
      getCategories: () => axiosInstance.get('/admin/blogs/categories'),
    },

    // Comments management
    comments: {
      getAll: (params) => axiosInstance.get('/admin/comments', { params }),
      approve: (id) => axiosInstance.patch(`/admin/comments/${id}/approve`),
      reject: (id) => axiosInstance.patch(`/admin/comments/${id}/reject`),
      delete: (id) => axiosInstance.delete(`/admin/comments/${id}`),
    },

    // In the admin section of api.js, add:
sessions: {
  getAll: (params) => axiosInstance.get('/admin/sessions', { params }),
  create: (data) => axiosInstance.post('/admin/sessions', data),
  update: (id, data) => axiosInstance.patch(`/admin/sessions/${id}`, data),
  delete: (id) => axiosInstance.delete(`/admin/sessions/${id}`),
},

// In the admin section of api.js, add:
team: {
  getAll: (params) => axiosInstance.get('/admin/team', { params }),
  create: (data) => axiosInstance.post('/admin/team', data),
  update: (id, data) => axiosInstance.patch(`/admin/team/${id}`, data),
  delete: (id) => axiosInstance.delete(`/admin/team/${id}`),
},
    // Gallery management
    gallery: {
      getAll: () => axiosInstance.get('/admin/gallery'),
      add: (data) => axiosInstance.post('/admin/gallery', data),
      update: (id, data) => axiosInstance.patch(`/admin/gallery/${id}`, data),
      delete: (id) => axiosInstance.delete(`/admin/gallery/${id}`),
      reorder: (data) => axiosInstance.post('/admin/gallery/reorder', data),
    },

    // Landing page management
    landing: {
      get: () => axiosInstance.get('/admin/landing'),
      update: (section, data) => axiosInstance.patch(`/admin/landing/${section}`, data),
      uploadImage: (formData) => axiosInstance.post('/admin/landing/images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    },

    // Banner management
    banner: {
      create: (data) => axiosInstance.post('/admin/banner', data),
    },

    // In the admin section
team: {
  getAll: (params) => axiosInstance.get('/admin/team', { params }),
  create: (data) => axiosInstance.post('/admin/team', data),
  update: (id, data) => axiosInstance.patch(`/admin/team/${id}`, data),
  delete: (id) => axiosInstance.delete(`/admin/team/${id}`),
},

    // Settings
    settings: {
      get: () => axiosInstance.get('/admin/settings'),
      update: (data) => axiosInstance.patch('/admin/settings', data),
    },

    // Super admin
    super: {
      getAdmins: () => axiosInstance.get('/admin/super/admins'),
      createAdmin: (data) => axiosInstance.post('/admin/super/admins', data),
      deleteAdmin: (id) => axiosInstance.delete(`/admin/super/admins/${id}`),
      getLogs: (params) => axiosInstance.get('/admin/super/logs', { params }),
    },
  },
};

// Export as default for easier imports
export default api;