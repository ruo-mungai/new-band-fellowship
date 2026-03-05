import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminService } from '@/services/adminService';

export const fetchSettings = createAsyncThunk(
  'settings/fetch',
  async () => {
    const response = await adminService.settings.get();
    return response;
  }
);

export const updateSettings = createAsyncThunk(
  'settings/update',
  async (data) => {
    const response = await adminService.settings.update(data);
    return response;
  }
);

const initialState = {
  settings: {
    siteName: 'New Band Fellowship',
    siteDescription: '',
    siteEmail: '',
    sitePhone: '',
    siteAddress: '',
    allowRegistration: true,
    requireApproval: true,
    enableDonations: false,
    enableLiveStreaming: false,
    enableRSVP: true,
    enableComments: true,
    voteMode: 'DISABLED',
    facebook: '',
    twitter: '',
    instagram: '',
    youtube: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
  },
  loading: false,
  error: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateLocalSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Settings
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = { ...state.settings, ...action.payload };
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update Settings
      .addCase(updateSettings.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = { ...state.settings, ...action.payload };
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { updateLocalSettings, clearError } = settingsSlice.actions;
export default settingsSlice.reducer;