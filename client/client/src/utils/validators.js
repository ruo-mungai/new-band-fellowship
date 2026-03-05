import { z } from 'zod';

// User validation schemas
export const userSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const profileUpdateSchema = z.object({
  firstName: z.string().min(2, 'First name is required').optional(),
  lastName: z.string().min(2, 'Last name is required').optional(),
  phone: z.string().optional(),
  bio: z.string().max(500, 'Bio too long').optional(),
});

// Song request validation
export const songRequestSchema = z.object({
  songTitle: z.string().min(3, 'Song title is required'),
  stanzaNumber: z.string().optional(),
  testimony: z.string().min(10, 'Testimony too short').optional(),
  songId: z.string().optional(),
});

// Event validation
export const eventSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  description: z.string().min(10, 'Description is required'),
  eventDate: z.string().min(1, 'Event date is required'),
  location: z.string().min(3, 'Location is required'),
  maxAttendees: z.number().optional(),
  bannerImage: z.string().url('Invalid image URL').optional(),
});

// Blog post validation
export const blogSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  content: z.string().min(10, 'Content is required'),
  excerpt: z.string().optional(),
  featuredImage: z.string().url('Invalid image URL').optional(),
  categoryId: z.string().optional(),
  tags: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
});

// Comment validation
export const commentSchema = z.object({
  content: z.string().min(3, 'Comment too short').max(500, 'Comment too long'),
});

// RSVP validation
export const rsvpSchema = z.object({
  numberOfGuests: z.number().min(1, 'At least 1 guest').max(10, 'Maximum 10 guests'),
  notes: z.string().optional(),
});

// Donation validation
export const donationSchema = z.object({
  amount: z.number().min(100, 'Minimum donation is 100'),
  currency: z.string().default('KES'),
  donorName: z.string().optional(),
  donorEmail: z.string().email('Invalid email').optional(),
  isAnonymous: z.boolean().default(false),
  message: z.string().max(200, 'Message too long').optional(),
});

// Gallery image validation
export const galleryImageSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  description: z.string().optional(),
  imageUrl: z.string().url('Invalid image URL'),
  order: z.number().optional(),
});

// Playlist item validation
export const playlistItemSchema = z.object({
  songId: z.string().min(1, 'Song is required'),
  sessionId: z.string().optional(),
  order: z.number().min(1, 'Order is required'),
  backgroundImage: z.string().url('Invalid image URL').optional(),
  backgroundColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format').optional(),
  notes: z.string().optional(),
});

// Settings validation
export const settingsSchema = z.object({
  siteName: z.string().min(3, 'Site name is required'),
  siteDescription: z.string().optional(),
  siteEmail: z.string().email('Invalid email'),
  sitePhone: z.string().optional(),
  siteAddress: z.string().optional(),
  allowRegistration: z.boolean(),
  requireApproval: z.boolean(),
  enableDonations: z.boolean(),
  enableLiveStreaming: z.boolean(),
  enableRSVP: z.boolean(),
  enableComments: z.boolean(),
  voteMode: z.enum(['ENABLED', 'DISABLED', 'HYBRID']),
});

// Password change validation
export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Contact form validation
export const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message is required'),
});

// Search validation
export const searchSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  tag: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});

// Validation helper functions
export const validators = {
  // Check if value is a valid URL
  isUrl: (value) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },

  // Check if value is a valid phone number (international)
  isPhone: (value) => {
    const re = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,4}$/;
    return re.test(value);
  },

  // Check if value is a valid Kenyan ID number
  isKenyanId: (value) => {
    const re = /^\d{7,8}$/;
    return re.test(value);
  },

  // Check if value is a valid password (at least one number, one uppercase, one lowercase)
  isStrongPassword: (value) => {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return re.test(value);
  },

  // Check if file is valid image
  isValidImage: (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    return validTypes.includes(file.type);
  },

  // Check if file size is within limit
  isValidFileSize: (file, maxSize = 5 * 1024 * 1024) => {
    return file.size <= maxSize;
  },
};