import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: false,
  theme: localStorage.getItem('theme') || 'light',
  notifications: [],
  loading: {
    global: false,
    requests: {},
  },
  modals: {},
  toast: {
    visible: false,
    message: '',
    type: 'info',
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setGlobalLoading: (state, action) => {
      state.loading.global = action.payload;
    },
    setRequestLoading: (state, action) => {
      const { key, isLoading } = action.payload;
      state.loading.requests[key] = isLoading;
    },
    openModal: (state, action) => {
      const { modalId, data } = action.payload;
      state.modals[modalId] = { isOpen: true, data };
    },
    closeModal: (state, action) => {
      const modalId = action.payload;
      state.modals[modalId] = { isOpen: false, data: null };
    },
    closeAllModals: (state) => {
      state.modals = {};
    },
    showToast: (state, action) => {
      state.toast = {
        visible: true,
        ...action.payload,
      };
    },
    hideToast: (state) => {
      state.toast.visible = false;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setTheme,
  addNotification,
  removeNotification,
  clearNotifications,
  setGlobalLoading,
  setRequestLoading,
  openModal,
  closeModal,
  closeAllModals,
  showToast,
  hideToast,
} = uiSlice.actions;

export default uiSlice.reducer;