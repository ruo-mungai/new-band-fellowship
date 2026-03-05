import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { songService } from '@/services/songService';
import { DEFAULT_PAGINATION } from '@/utils/constants';

// Fetch master songs list
export const fetchMasterSongs = createAsyncThunk(
  'songs/fetchMaster',
  async (params = {}, { rejectWithValue }) => {
    try {
      console.log('📡 Fetching master songs with params:', params);
      const response = await songService.getMasterList(params);
      console.log('📡 Master songs response:', response);
      return response;
    } catch (error) {
      console.error('❌ Error fetching master songs:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Fetch ALL song requests (admin/public view)
export const fetchAllSongRequests = createAsyncThunk(
  'songs/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      console.log('📡 Fetching ALL song requests with params:', params);
      const response = await songService.getRequests(params);
      console.log('📡 All song requests response:', response);
      return response;
    } catch (error) {
      console.error('❌ Error fetching all requests:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Fetch current user's song requests
export const fetchMySongRequests = createAsyncThunk(
  'songs/fetchMyRequests',
  async (params = {}, { rejectWithValue }) => {
    try {
      console.log('📡 Fetching MY song requests with params:', params);
      // Add userId parameter to get only current user's requests
      const response = await songService.getRequests({ ...params, userId: 'current' });
      console.log('📡 My song requests response:', response);
      return response;
    } catch (error) {
      console.error('❌ Error fetching my requests:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Create song request
export const createSongRequest = createAsyncThunk(
  'songs/createRequest',
  async (data, { rejectWithValue, dispatch }) => {
    try {
      console.log('📡 Creating song request with data:', data);
      const response = await songService.createRequest(data);
      console.log('📡 Create request response:', response);
      
      // After creating, refresh both all requests and my requests
      dispatch(fetchAllSongRequests({ limit: 10 }));
      dispatch(fetchMySongRequests({ limit: 10 }));
      
      return response;
    } catch (error) {
      console.error('❌ Error creating request:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update song request
export const updateSongRequest = createAsyncThunk(
  'songs/updateRequest',
  async ({ id, data }, { rejectWithValue, dispatch }) => {
    try {
      console.log('📡 Updating song request:', id, data);
      const response = await songService.updateRequest(id, data);
      console.log('📡 Update request response:', response);
      
      // Refresh both lists after update
      dispatch(fetchAllSongRequests({ limit: 10 }));
      dispatch(fetchMySongRequests({ limit: 10 }));
      
      return response;
    } catch (error) {
      console.error('❌ Error updating request:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete song request
export const deleteSongRequest = createAsyncThunk(
  'songs/deleteRequest',
  async (id, { rejectWithValue, dispatch }) => {
    try {
      console.log('📡 Deleting song request:', id);
      await songService.deleteRequest(id);
      
      // Refresh both lists after delete
      dispatch(fetchAllSongRequests({ limit: 10 }));
      dispatch(fetchMySongRequests({ limit: 10 }));
      
      return id;
    } catch (error) {
      console.error('❌ Error deleting request:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Vote on song request
export const voteRequest = createAsyncThunk(
  'songs/vote',
  async (id, { rejectWithValue, dispatch }) => {
    try {
      console.log('📡 Voting on song request:', id);
      const response = await songService.voteRequest(id);
      console.log('📡 Vote response:', response);
      
      // Refresh both lists after voting
      dispatch(fetchAllSongRequests({ limit: 10 }));
      dispatch(fetchMySongRequests({ limit: 10 }));
      
      return response;
    } catch (error) {
      console.error('❌ Error voting on request:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  masterSongs: [],
  allRequests: [],      // For admin/public view
  myRequests: [],       // For user's personal view
  pagination: DEFAULT_PAGINATION,
  loading: false,
  error: null,
};

const songSlice = createSlice({
  name: 'songs',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearRequests: (state) => {
      state.allRequests = [];
      state.myRequests = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // ========== MASTER SONGS ==========
      .addCase(fetchMasterSongs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMasterSongs.fulfilled, (state, action) => {
        state.loading = false;
        state.masterSongs = action.payload.items || action.payload || [];
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
        console.log('✅ Master songs loaded:', state.masterSongs.length);
      })
      .addCase(fetchMasterSongs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error('❌ Failed to load master songs:', action.payload);
      })
      
      // ========== ALL REQUESTS ==========
      .addCase(fetchAllSongRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllSongRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.allRequests = action.payload.items || action.payload || [];
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
        console.log('✅ All song requests loaded:', state.allRequests.length);
      })
      .addCase(fetchAllSongRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error('❌ Failed to load all requests:', action.payload);
      })
      
      // ========== MY REQUESTS ==========
      .addCase(fetchMySongRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMySongRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.myRequests = action.payload.items || action.payload || [];
        console.log('✅ My song requests loaded:', state.myRequests.length);
      })
      .addCase(fetchMySongRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error('❌ Failed to load my requests:', action.payload);
      })
      
      // ========== CREATE REQUEST ==========
      .addCase(createSongRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSongRequest.fulfilled, (state, action) => {
        state.loading = false;
        // Don't manually add - rely on the refresh in the thunk
        console.log('✅ Song request created:', action.payload);
      })
      .addCase(createSongRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error('❌ Failed to create request:', action.payload);
      })
      
      // ========== UPDATE REQUEST ==========
      .addCase(updateSongRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSongRequest.fulfilled, (state, action) => {
        state.loading = false;
        // Update in both arrays if present
        const updateInArray = (array) => {
          const index = array.findIndex(r => r.id === action.payload.id);
          if (index !== -1) {
            array[index] = action.payload;
          }
        };
        
        updateInArray(state.allRequests);
        updateInArray(state.myRequests);
        
        console.log('✅ Song request updated:', action.payload.id);
      })
      .addCase(updateSongRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error('❌ Failed to update request:', action.payload);
      })
      
      // ========== DELETE REQUEST ==========
      .addCase(deleteSongRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSongRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.allRequests = state.allRequests.filter(r => r.id !== action.payload);
        state.myRequests = state.myRequests.filter(r => r.id !== action.payload);
        console.log('✅ Song request deleted:', action.payload);
      })
      .addCase(deleteSongRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error('❌ Failed to delete request:', action.payload);
      })
      
      // ========== VOTE ON REQUEST ==========
      .addCase(voteRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(voteRequest.fulfilled, (state, action) => {
        state.loading = false;
        // Update vote count in both arrays
        const updateVoteInArray = (array) => {
          const index = array.findIndex(r => r.id === action.payload.id);
          if (index !== -1) {
            array[index] = {
              ...array[index],
              voteCount: action.payload.voteCount,
              votes: action.payload.votes
            };
          }
        };
        
        updateVoteInArray(state.allRequests);
        updateVoteInArray(state.myRequests);
        
        console.log('✅ Vote recorded on request:', action.payload.id);
      })
      .addCase(voteRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error('❌ Failed to vote on request:', action.payload);
      });
  },
});

export const { clearError, clearRequests } = songSlice.actions;
export default songSlice.reducer;