import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import landingReducer from './slices/landingSlice';
import songReducer from './slices/songSlice';
import eventReducer from './slices/eventSlice';
import blogReducer from './slices/blogSlice';
import galleryReducer from './slices/gallerySlice';
import settingsReducer from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    landing: landingReducer,
    songs: songReducer,
    events: eventReducer,
    blogs: blogReducer,
    gallery: galleryReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;