import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { eventService } from '@/services/eventService';

// Fetch upcoming events
export const fetchUpcomingEvents = createAsyncThunk(
  'events/fetchUpcoming',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await eventService.getAll({ ...params, upcoming: true });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch upcoming events');
    }
  }
);

// Fetch past events
export const fetchPastEvents = createAsyncThunk(
  'events/fetchPast',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await eventService.getAll({ ...params, past: true });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch past events');
    }
  }
);

// Fetch event by ID
export const fetchEventById = createAsyncThunk(
  'events/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await eventService.getOne(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch event');
    }
  }
);

// RSVP to event
export const rsvpToEvent = createAsyncThunk(
  'events/rsvp',
  async ({ eventId, data }, { rejectWithValue }) => {
    try {
      const response = await eventService.rsvp(eventId, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to RSVP');
    }
  }
);

// Cancel RSVP
export const cancelRsvp = createAsyncThunk(
  'events/cancelRsvp',
  async (eventId, { rejectWithValue }) => {
    try {
      await eventService.cancelRsvp(eventId);
      return eventId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel RSVP');
    }
  }
);

const initialState = {
  upcoming: [],
  past: [],
  currentEvent: null,
  loading: false,
  error: null,
};

const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    clearCurrentEvent: (state) => {
      state.currentEvent = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetEvents: (state) => {
      state.upcoming = [];
      state.past = [];
      state.currentEvent = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Upcoming Events
      .addCase(fetchUpcomingEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUpcomingEvents.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload || {};
        
        // Extract events array safely
        if (payload.data?.events) {
          state.upcoming = payload.data.events;
        } else if (payload.events) {
          state.upcoming = payload.events;
        } else if (Array.isArray(payload)) {
          state.upcoming = payload;
        } else if (payload.data?.items) {
          state.upcoming = payload.data.items;
        } else if (payload.items) {
          state.upcoming = payload.items;
        } else {
          state.upcoming = [];
        }
      })
      .addCase(fetchUpcomingEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch upcoming events';
        state.upcoming = [];
      })
      
      // Fetch Past Events
      .addCase(fetchPastEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPastEvents.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload || {};
        
        if (payload.data?.events) {
          state.past = payload.data.events;
        } else if (payload.events) {
          state.past = payload.events;
        } else if (Array.isArray(payload)) {
          state.past = payload;
        } else if (payload.data?.items) {
          state.past = payload.data.items;
        } else if (payload.items) {
          state.past = payload.items;
        } else {
          state.past = [];
        }
      })
      .addCase(fetchPastEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch past events';
        state.past = [];
      })
      
      // Fetch Event By Id
      .addCase(fetchEventById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload || {};
        
        if (payload.data?.event) {
          state.currentEvent = payload.data.event;
        } else if (payload.event) {
          state.currentEvent = payload.event;
        } else {
          state.currentEvent = payload;
        }
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch event';
        state.currentEvent = null;
      })
      
      // RSVP to Event
      .addCase(rsvpToEvent.fulfilled, (state, action) => {
        const payload = action.payload || {};
        
        let rsvp;
        if (payload.data?.rsvp) {
          rsvp = payload.data.rsvp;
        } else if (payload.rsvp) {
          rsvp = payload.rsvp;
        }
        
        if (rsvp && state.currentEvent) {
          if (!state.currentEvent.rsvps) {
            state.currentEvent.rsvps = [];
          }
          state.currentEvent.rsvps.push(rsvp);
          
          // Also update the count in upcoming/past lists if needed
          const eventInUpcoming = state.upcoming.find(e => e.id === state.currentEvent.id);
          if (eventInUpcoming) {
            eventInUpcoming.rsvpCount = (eventInUpcoming.rsvpCount || 0) + 1;
          }
        }
      })
      
      // Cancel RSVP
      .addCase(cancelRsvp.fulfilled, (state, action) => {
        const eventId = action.payload;
        
        if (state.currentEvent && state.currentEvent.id === eventId) {
          if (state.currentEvent.rsvps) {
            state.currentEvent.rsvps = state.currentEvent.rsvps.filter(
              r => r.userId !== action.meta.arg
            );
          }
        }
        
        // Update the count in upcoming/past lists
        const eventInUpcoming = state.upcoming.find(e => e.id === eventId);
        if (eventInUpcoming) {
          eventInUpcoming.rsvpCount = Math.max(0, (eventInUpcoming.rsvpCount || 1) - 1);
        }
      });
  },
});

export const { clearCurrentEvent, clearError, resetEvents } = eventSlice.actions;
export default eventSlice.reducer;