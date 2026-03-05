import { format, formatDistance, formatRelative } from 'date-fns';
import { DATE_FORMATS } from './constants';

/**
 * Format currency
 */
export const formatCurrency = (amount, currency = 'KES', locale = 'en-KE') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format number with commas
 */
export const formatNumber = (number) => {
  return new Intl.NumberFormat().format(number);
};

/**
 * Format percentage
 */
export const formatPercentage = (value, total, decimals = 0) => {
  if (total === 0) return '0%';
  const percentage = (value / total) * 100;
  return `${percentage.toFixed(decimals)}%`;
};

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Format phone number for display
 */
export const formatPhoneDisplay = (phone, country = 'KE') => {
  if (!phone) return '';
  
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format based on country
  switch (country) {
    case 'KE':
      if (cleaned.length === 9) {
        return `0${cleaned.slice(0, 2)}-${cleaned.slice(2, 5)}-${cleaned.slice(5)}`;
      } else if (cleaned.length === 12 && cleaned.startsWith('254')) {
        return `0${cleaned.slice(3, 5)}-${cleaned.slice(5, 8)}-${cleaned.slice(8)}`;
      }
      break;
    case 'US':
      if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
      }
      break;
  }
  
  return phone;
};

/**
 * Format address
 */
export const formatAddress = (address) => {
  const parts = [];
  if (address.street) parts.push(address.street);
  if (address.city) parts.push(address.city);
  if (address.state) parts.push(address.state);
  if (address.postalCode) parts.push(address.postalCode);
  if (address.country) parts.push(address.country);
  
  return parts.join(', ');
};

/**
 * Format duration in seconds to human readable
 */
export const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);
  
  return parts.join(' ');
};

/**
 * Format name (First Last or First M. Last)
 */
export const formatName = (firstName, lastName, middleName = null) => {
  if (!firstName && !lastName) return '';
  if (!lastName) return firstName;
  if (!firstName) return lastName;
  
  if (middleName) {
    return `${firstName} ${middleName.charAt(0)}. ${lastName}`;
  }
  
  return `${firstName} ${lastName}`;
};

/**
 * Format initials
 */
export const formatInitials = (firstName, lastName) => {
  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
};

/**
 * Format list with commas and "and"
 */
export const formatList = (items, conjunction = 'and') => {
  if (!items || items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;
  
  const last = items.pop();
  return `${items.join(', ')}, ${conjunction} ${last}`;
};

/**
 * Format JSON for display
 */
export const formatJSON = (obj, indent = 2) => {
  return JSON.stringify(obj, null, indent);
};

/**
 * Format bytes to human readable
 */
export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

/**
 * Format time ago
 */
export const formatTimeAgo = (date) => {
  return formatDistance(new Date(date), new Date(), { addSuffix: true });
};

/**
 * Format relative time
 */
export const formatRelativeTime = (date, baseDate = new Date()) => {
  return formatRelative(new Date(date), baseDate);
};

/**
 * Format range (e.g., "10 - 20 items")
 */
export const formatRange = (min, max, unit = '') => {
  if (min === max) return `${min}${unit}`;
  return `${min}${unit} - ${max}${unit}`;
};

/**
 * Format percentage change
 */
export const formatChange = (oldValue, newValue, showSign = true) => {
  if (oldValue === 0) return '+100%';
  
  const change = ((newValue - oldValue) / oldValue) * 100;
  const sign = change > 0 ? '+' : '';
  
  return showSign ? `${sign}${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
};

/**
 * Format social media URL for display
 */
export const formatSocialUrl = (platform, handle) => {
  const urls = {
    twitter: `https://twitter.com/${handle}`,
    facebook: `https://facebook.com/${handle}`,
    instagram: `https://instagram.com/${handle}`,
    youtube: `https://youtube.com/@${handle}`,
    linkedin: `https://linkedin.com/in/${handle}`,
    github: `https://github.com/${handle}`,
  };
  
  return urls[platform] || handle;
};

/**
 * Format search query for display
 */
export const formatSearchQuery = (query, maxLength = 50) => {
  if (!query) return '';
  if (query.length <= maxLength) return query;
  return `${query.substring(0, maxLength)}...`;
};

/**
 * Format array as string with separator
 */
export const formatArray = (array, separator = ', ') => {
  if (!array || !Array.isArray(array)) return '';
  return array.join(separator);
};

/**
 * Format boolean as Yes/No
 */
export const formatBoolean = (value, yes = 'Yes', no = 'No') => {
  return value ? yes : no;
};

/**
 * Format rating (e.g., 4.5/5)
 */
export const formatRating = (rating, max = 5, decimals = 1) => {
  return `${rating.toFixed(decimals)}/${max}`;
};