import React, { useRef, useState } from 'react';
import { PhotoIcon, XMarkIcon, LinkIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';
import Button from '@/components/common/Button';
import { adminService } from '@/services/adminService';
import { toast } from 'react-hot-toast';

const ImageUpload = ({ label, value, onUpload, onRemove, folder = 'general' }) => {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', folder);

      const response = await adminService.landing.uploadImage(formData);
      onUpload(response.url);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput) {
      onUpload(urlInput);
      setUrlInput('');
      setShowUrlInput(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      
      {value ? (
        <div className="relative w-full h-48 rounded-lg overflow-hidden group">
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300?text=Invalid+Image';
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <button
              onClick={onRemove}
              className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Upload options */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 dark:hover:border-primary-400 transition-colors disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Uploading...</span>
                </>
              ) : (
                <>
                  <CloudArrowUpIcon className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Upload from computer</span>
                  <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 dark:hover:border-primary-400 transition-colors"
            >
              <LinkIcon className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Use URL</span>
              <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">Paste image URL</span>
            </button>
          </div>

          {/* URL input field */}
          {showUrlInput && (
            <div className="flex space-x-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <Button type="button" onClick={handleUrlSubmit} disabled={!urlInput}>
                Add
              </Button>
            </div>
          )}
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;