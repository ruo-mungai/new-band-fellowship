import { api } from './api';

export const userService = {
  getProfile: async () => {
    const response = await api.users.getProfile();
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.users.updateProfile(data);
    return response.data;
  },

  uploadProfileImage: async (file) => {
    const formData = new FormData();
    formData.append('profileImage', file);
    const response = await api.users.uploadProfileImage(formData);
    return response.data;
  },

  getMyRequests: async (params) => {
    const response = await api.users.getMyRequests(params);
    return response.data;
  },
};