import api from './api';

export const blogService = {
  getAll: async (params) => {
    try {
      const response = await api.public.getBlogs(params);
      return response.data;
    } catch (error) {
      console.error('Error fetching blogs:', error);
      throw error;
    }
  },

  getBySlug: async (slug) => {
    try {
      const response = await api.public.getBlogBySlug(slug);
      return response.data;
    } catch (error) {
      console.error('Error fetching blog:', error);
      throw error;
    }
  },

  getCategories: async () => {
    try {
      const response = await api.public.getCategories();
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },

  getTags: async () => {
    try {
      const response = await api.public.getTags();
      return response.data;
    } catch (error) {
      console.error('Error fetching tags:', error);
      return [];
    }
  }
};