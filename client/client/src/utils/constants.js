// User Roles
export const ROLES = {
  GUEST: 'GUEST',
  USER: 'USER',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
};

// Song Request Status
export const REQUEST_STATUS = {
  PENDING: 'PENDING',
  SCHEDULED: 'SCHEDULED',
  SUNG: 'SUNG',
  REJECTED: 'REJECTED',
};

// Session Types
export const SESSION_TYPES = {
  FIRST_SESSION: 'FIRST_SESSION',
  SECOND_SESSION: 'SECOND_SESSION',
  REQUEST_TIME: 'REQUEST_TIME',
  TESTIMONY_TIME: 'TESTIMONY_TIME',
};

// Event RSVP Status
export const RSVP_STATUS = {
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  WAITLIST: 'WAITLIST',
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
};

// Notification Types
export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  THEME: 'theme',
  SETTINGS: 'settings',
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh-token',
  ME: '/auth/me',
  
  // Public
  LANDING: '/public/landing',
  EVENTS: '/public/events',
  GALLERY: '/public/gallery',
  BLOGS: '/public/blogs',
  PLAYLIST: '/public/playlist/upcoming',
  
  // Users
  PROFILE: '/users/profile',
  MY_REQUESTS: '/users/song-requests',
  
  // Songs
  MASTER_SONGS: '/songs/master',
  SONG_REQUESTS: '/songs/requests',
  VOTE: (id) => `/songs/requests/${id}/vote`,
  
  // Admin
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_SETTINGS: '/admin/settings',
};

// Default Pagination
export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10,
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMMM d, yyyy',
  DISPLAY_WITH_TIME: 'MMMM d, yyyy h:mm a',
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
  API: 'yyyy-MM-dd',
  TIME: 'h:mm a',
};

// Toast Messages
export const TOAST_MESSAGES = {
  LOGIN_SUCCESS: 'Welcome back!',
  LOGOUT_SUCCESS: 'Logged out successfully',
  REGISTER_SUCCESS: 'Registration successful! Please check your email.',
  PROFILE_UPDATE_SUCCESS: 'Profile updated successfully',
  SONG_REQUEST_SUCCESS: 'Song request submitted successfully',
  VOTE_SUCCESS: 'Vote recorded',
  RSVP_SUCCESS: 'RSVP confirmed',
  DONATION_SUCCESS: 'Thank you for your donation!',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
  NOT_FOUND: 'The requested resource was not found',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
};

// Theme Colors
export const THEME_COLORS = {
  primary: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
  },
};

// Social Media Platforms
export const SOCIAL_PLATFORMS = [
  { id: 'facebook', name: 'Facebook', icon: 'FacebookIcon', color: '#1877f2' },
  { id: 'twitter', name: 'Twitter', icon: 'TwitterIcon', color: '#1da1f2' },
  { id: 'instagram', name: 'Instagram', icon: 'InstagramIcon', color: '#e4405f' },
  { id: 'youtube', name: 'YouTube', icon: 'YoutubeIcon', color: '#ff0000' },
  { id: 'whatsapp', name: 'WhatsApp', icon: 'WhatsAppIcon', color: '#25d366' },
];

// File Upload Limits
export const FILE_UPLOAD_LIMITS = {
  IMAGE_MAX_SIZE: 5 * 1024 * 1024, // 5MB
  IMAGE_ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  VIDEO_MAX_SIZE: 50 * 1024 * 1024, // 50MB
  VIDEO_ALLOWED_TYPES: ['video/mp4', 'video/webm'],
};

// Cache Durations (in milliseconds)
export const CACHE_DURATION = {
  SHORT: 5 * 60 * 1000, // 5 minutes
  MEDIUM: 30 * 60 * 1000, // 30 minutes
  LONG: 60 * 60 * 1000, // 1 hour
  DAY: 24 * 60 * 60 * 1000, // 24 hours
};