import api from './api';

export const adminService = {
  // Dashboard
  getDashboard: async () => {
    try {
      console.log('📡 Fetching dashboard stats...');
      const response = await api.admin.getDashboard();
      console.log('📡 Dashboard response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching dashboard:', error);
      throw error;
    }
  },

  // Users management
  users: {
    getAll: async (params) => {
      try {
        const response = await api.admin.users.getAll(params);
        return response.data;
      } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
    },

    getOne: async (id) => {
      try {
        const response = await api.admin.users.getOne(id);
        return response.data;
      } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
      }
    },

    approve: async (id) => {
      try {
        const response = await api.admin.users.approve(id);
        return response.data;
      } catch (error) {
        console.error('Error approving user:', error);
        throw error;
      }
    },

    ban: async (id) => {
      try {
        const response = await api.admin.users.ban(id);
        return response.data;
      } catch (error) {
        console.error('Error banning user:', error);
        throw error;
      }
    },

    unban: async (id) => {
      try {
        const response = await api.admin.users.unban(id);
        return response.data;
      } catch (error) {
        console.error('Error unbanning user:', error);
        throw error;
      }
    },

    changeRole: async (id, role) => {
      try {
        const response = await api.admin.users.changeRole(id, { role });
        return response.data;
      } catch (error) {
        console.error('Error changing user role:', error);
        throw error;
      }
    },

    delete: async (id) => {
      try {
        const response = await api.admin.users.delete(id);
        return response.data;
      } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
      }
    },
  },

  // Song requests management
  requests: {
    getAll: async (params) => {
      try {
        const response = await api.admin.requests.getAll(params);
        return response.data;
      } catch (error) {
        console.error('Error fetching requests:', error);
        throw error;
      }
    },

    update: async (id, data) => {
      try {
        const response = await api.admin.requests.update(id, data);
        return response.data;
      } catch (error) {
        console.error('Error updating request:', error);
        throw error;
      }
    },

    delete: async (id) => {
      try {
        const response = await api.admin.requests.delete(id);
        return response.data;
      } catch (error) {
        console.error('Error deleting request:', error);
        throw error;
      }
    },
  },

  // Events management - FIXED AND COMPLETE
  events: {
    getAll: async (params) => {
      try {
        console.log('📡 adminService.events.getAll called with params:', params);
        const response = await api.admin.events.getAll(params);
        console.log('📡 adminService.events.getAll response:', response.data);
        return response.data;
      } catch (error) {
        console.error('❌ Error fetching events:', error);
        throw error;
      }
    },

    getOne: async (id) => {
      try {
        console.log('📡 adminService.events.getOne called with id:', id);
        const response = await api.admin.events.getOne(id);
        console.log('📡 adminService.events.getOne response:', response.data);
        return response.data;
      } catch (error) {
        console.error('❌ Error fetching event:', error);
        throw error;
      }
    },

    create: async (data) => {
      try {
        console.log('📡 adminService.events.create called with:', data);
        const response = await api.admin.events.create(data);
        console.log('📡 adminService.events.create response:', response.data);
        return response.data;
      } catch (error) {
        console.error('❌ Error creating event:', error);
        throw error;
      }
    },

    update: async (id, data) => {
      try {
        console.log('📡 adminService.events.update called with id:', id, 'data:', data);
        const response = await api.admin.events.update(id, data);
        console.log('📡 adminService.events.update response:', response.data);
        return response.data;
      } catch (error) {
        console.error('❌ Error updating event:', error);
        throw error;
      }
    },

    delete: async (id) => {
      try {
        console.log('📡 adminService.events.delete called with id:', id);
        const response = await api.admin.events.delete(id);
        console.log('📡 adminService.events.delete response:', response.data);
        return response.data;
      } catch (error) {
        console.error('❌ Error deleting event:', error);
        throw error;
      }
    },
  },

  // Add this to your adminService.js, preferably after the events section and before playlist

// Sessions management
sessions: {
  getAll: async (params) => {
    try {
      console.log('📡 Fetching sessions with params:', params);
      const response = await api.admin.sessions.getAll(params);
      console.log('📡 Sessions response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching sessions:', error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      console.log('📡 Creating session:', data);
      const response = await api.admin.sessions.create(data);
      console.log('📡 Create session response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error creating session:', error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      console.log('📡 Updating session:', id, data);
      const response = await api.admin.sessions.update(id, data);
      console.log('📡 Update session response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error updating session:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      console.log('📡 Deleting session:', id);
      const response = await api.admin.sessions.delete(id);
      console.log('📡 Delete session response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error deleting session:', error);
      throw error;
    }
  },
},

  // Playlist management

playlist: {
  get: async (eventId) => {
    try {
      console.log('📡 Fetching playlist for event:', eventId);
      const response = await api.admin.playlist.get(eventId);
      console.log('📡 Playlist response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching playlist:', error);
      // Return empty structure on error
      return { items: [], sessions: [] };
    }
  },

  update: async (eventId, data) => {
    try {
      const response = await api.admin.playlist.update(eventId, data);
      return response.data;
    } catch (error) {
      console.error('Error updating playlist:', error);
      throw error;
    }
  },

  addSong: async (eventId, data) => {
    try {
      console.log('📡 Adding song to playlist:', { eventId, data });
      const response = await api.admin.playlist.addSong(eventId, data);
      console.log('📡 Add song response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error adding song to playlist:', error);
      throw error;
    }
  },

  updateSong: async (itemId, data) => {
    try {
      const response = await api.admin.playlist.updateSong(itemId, data);
      return response.data;
    } catch (error) {
      console.error('Error updating playlist item:', error);
      throw error;
    }
  },

  removeSong: async (itemId) => {
    try {
      const response = await api.admin.playlist.removeSong(itemId);
      return response.data;
    } catch (error) {
      console.error('Error removing song from playlist:', error);
      throw error;
    }
  },

  reorder: async (eventId, items) => {
    try {
      const response = await api.admin.playlist.reorder(eventId, { items });
      return response.data;
    } catch (error) {
      console.error('Error reordering playlist:', error);
      throw error;
    }
  },
},
 // Blog management - FIXED
blogs: {
  getAll: async (params) => {
    try {
      console.log('📡 Fetching blog posts with params:', params);
      const response = await api.admin.blogs.getAll(params);
      console.log('📡 Blog posts response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching blogs:', error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      console.log('📡 Creating blog post with data:', data);
      
      // Ensure data is properly formatted
      const postData = {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt || '',
        featuredImage: data.featuredImage || '',
        categoryId: data.categoryId || null,
        tags: data.tags || [],
        metaTitle: data.metaTitle || data.title,
        metaDescription: data.metaDescription || data.excerpt || data.content.substring(0, 160),
        metaKeywords: data.metaKeywords || '',
      };
      
      console.log('📡 Sending blog data:', postData);
      
      const response = await api.admin.blogs.create(postData);
      console.log('📡 Create blog response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error creating blog post:', error);
      console.error('❌ Error response:', error.response?.data);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      console.log('📡 Updating blog post:', id, data);
      const response = await api.admin.blogs.update(id, data);
      console.log('📡 Update blog response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error updating blog post:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      console.log('📡 Deleting blog post:', id);
      const response = await api.admin.blogs.delete(id);
      console.log('📡 Delete blog response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error deleting blog post:', error);
      throw error;
    }
  },

  publish: async (id) => {
    try {
      console.log('📡 Publishing blog post:', id);
      const response = await api.admin.blogs.publish(id);
      console.log('📡 Publish blog response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error publishing blog post:', error);
      throw error;
    }
  },

  unpublish: async (id) => {
    try {
      console.log('📡 Unpublishing blog post:', id);
      const response = await api.admin.blogs.unpublish(id);
      console.log('📡 Unpublish blog response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error unpublishing blog post:', error);
      throw error;
    }
  },

  getCategories: async () => {
    try {
      console.log('📡 Fetching blog categories...');
      const response = await api.admin.blogs.getCategories();
      console.log('📡 Categories response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching categories:', error);
      return [];
    }
  },
},

  // Comments management
  comments: {
    getAll: async (params) => {
      try {
        const response = await api.admin.comments.getAll(params);
        return response.data;
      } catch (error) {
        console.error('Error fetching comments:', error);
        throw error;
      }
    },

    approve: async (id) => {
      try {
        const response = await api.admin.comments.approve(id);
        return response.data;
      } catch (error) {
        console.error('Error approving comment:', error);
        throw error;
      }
    },

    reject: async (id) => {
      try {
        const response = await api.admin.comments.reject(id);
        return response.data;
      } catch (error) {
        console.error('Error rejecting comment:', error);
        throw error;
      }
    },

    delete: async (id) => {
      try {
        const response = await api.admin.comments.delete(id);
        return response.data;
      } catch (error) {
        console.error('Error deleting comment:', error);
        throw error;
      }
    },
  },

 // Team management
team: {
  getAll: async (params) => {
    try {
      console.log('📡 Fetching team members with params:', params);
      const response = await api.admin.team.getAll(params);
      console.log('📡 Team response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching team:', error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      console.log('📡 Creating team member:', data);
      const response = await api.admin.team.create(data);
      console.log('📡 Create team response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error creating team member:', error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      console.log('📡 Updating team member:', id, data);
      const response = await api.admin.team.update(id, data);
      console.log('📡 Update team response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error updating team member:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      console.log('📡 Deleting team member:', id);
      const response = await api.admin.team.delete(id);
      console.log('📡 Delete team response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error deleting team member:', error);
      throw error;
    }
  },
},

  // Gallery management
  gallery: {
    getAll: async () => {
      try {
        const response = await api.admin.gallery.getAll();
        return response.data;
      } catch (error) {
        console.error('Error fetching gallery:', error);
        throw error;
      }
    },

    add: async (data) => {
      try {
        console.log('📡 Adding gallery image:', data);
        const response = await api.admin.gallery.add(data);
        console.log('📡 Add gallery response:', response.data);
        return response.data;
      } catch (error) {
        console.error('❌ Error adding gallery image:', error);
        throw error;
      }
    },

    update: async (id, data) => {
      try {
        const response = await api.admin.gallery.update(id, data);
        return response.data;
      } catch (error) {
        console.error('Error updating gallery image:', error);
        throw error;
      }
    },

    delete: async (id) => {
      try {
        const response = await api.admin.gallery.delete(id);
        return response.data;
      } catch (error) {
        console.error('Error deleting gallery image:', error);
        throw error;
      }
    },

    reorder: async (items) => {
      try {
        const response = await api.admin.gallery.reorder({ items });
        return response.data;
      } catch (error) {
        console.error('Error reordering gallery:', error);
        throw error;
      }
    },
  },

  // Landing page management
  landing: {
    get: async () => {
      try {
        console.log('📡 Fetching landing content...');
        const response = await api.admin.landing.get();
        console.log('📡 Landing response:', response.data);
        return response.data;
      } catch (error) {
        console.error('❌ Error fetching landing content:', error);
        throw error;
      }
    },

    update: async (section, data) => {
      try {
        console.log(`📡 Updating ${section} section:`, data);
        const response = await api.admin.landing.update(section, data);
        console.log(`📡 Update ${section} response:`, response.data);
        return response.data;
      } catch (error) {
        console.error(`❌ Error updating ${section} section:`, error);
        throw error;
      }
    },

    uploadImage: async (formData) => {
      try {
        const response = await api.admin.landing.uploadImage(formData);
        return response.data;
      } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
      }
    },
  },

  // Banner management
  banner: {
    create: async (data) => {
      try {
        const response = await api.admin.banner.create(data);
        return response.data;
      } catch (error) {
        console.error('Error creating banner:', error);
        throw error;
      }
    },
  },

  // Settings management
  settings: {
    get: async () => {
      try {
        console.log('📡 Fetching settings...');
        const response = await api.admin.settings.get();
        console.log('📡 Settings response:', response.data);
        return response.data;
      } catch (error) {
        console.error('❌ Error fetching settings:', error);
        throw error;
      }
    },

    update: async (data) => {
      try {
        console.log('📡 Updating settings:', data);
        const response = await api.admin.settings.update(data);
        console.log('📡 Update settings response:', response.data);
        return response.data;
      } catch (error) {
        console.error('❌ Error updating settings:', error);
        throw error;
      }
    },
  },

  // Super admin management
  super: {
    getAdmins: async () => {
      try {
        const response = await api.admin.super.getAdmins();
        return response.data;
      } catch (error) {
        console.error('Error fetching admins:', error);
        throw error;
      }
    },

    createAdmin: async (data) => {
      try {
        const response = await api.admin.super.createAdmin(data);
        return response.data;
      } catch (error) {
        console.error('Error creating admin:', error);
        throw error;
      }
    },

    deleteAdmin: async (id) => {
      try {
        const response = await api.admin.super.deleteAdmin(id);
        return response.data;
      } catch (error) {
        console.error('Error deleting admin:', error);
        throw error;
      }
    },

    getLogs: async (params) => {
      try {
        const response = await api.admin.super.getLogs(params);
        return response.data;
      } catch (error) {
        console.error('Error fetching logs:', error);
        throw error;
      }
    },
  },

  // Songs (for admin use)
  songs: {
    getMasterList: async () => {
      try {
        const response = await api.songs.getMasterList();
        return response.data;
      } catch (error) {
        console.error('Error fetching songs:', error);
        throw error;
      }
    },
  },
};