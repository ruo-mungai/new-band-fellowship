import { api } from './api';

export const eventService = {
  getAll: async (params) => {
    const response = await api.events.getAll(params);
    return response.data;
  },

  getOne: async (id) => {
    const response = await api.events.getOne(id);
    return response.data;
  },

  rsvp: async (eventId, data) => {
    const response = await api.events.rsvp(eventId, data);
    return response.data;
  },

  cancelRsvp: async (eventId) => {
    const response = await api.events.cancelRsvp(eventId);
    return response.data;
  },
};