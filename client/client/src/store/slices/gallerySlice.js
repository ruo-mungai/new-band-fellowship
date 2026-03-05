import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { publicService } from '@/services/publicService';

export const fetchGallery = createAsyncThunk(
  'gallery/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await publicService.getGallery();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch gallery');
    }
  }
);

const initialState = {
  images: [],
  loading: false,
  error: null,
};

const gallerySlice = createSlice({
  name: 'gallery',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGallery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGallery.fulfilled, (state, action) => {
        state.loading = false;
        state.images = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchGallery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch gallery';
        state.images = [];
      });
  },
});

export const { clearError } = gallerySlice.actions;
export default gallerySlice.reducer;