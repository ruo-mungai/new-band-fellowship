import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { CalendarIcon, UserIcon, EyeIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const BlogCard = ({ post }) => {
  const {
    id,
    title,
    excerpt,
    content,
    featuredImage,
    author,
    publishedAt,
    views,
    commentsCount,
    slug,
  } = post;

  // Ensure we have a slug, if not, use id or create one from title
  const postSlug = slug || id || title?.toLowerCase().replace(/\s+/g, '-');

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft overflow-hidden hover:shadow-soft-lg transition-all duration-300"
    >
      {/* Image */}
      <Link to={`/blogs/${postSlug}`} className="block relative h-48 overflow-hidden">
        <img
          src={featuredImage || 'https://images.unsplash.com/photo-1507692049790-de58290c433e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'}
          alt={title}
          className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </Link>

      {/* Content */}
      <div className="p-6">
        {/* Meta Info */}
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3 space-x-4">
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-1" />
            {publishedAt ? format(new Date(publishedAt), 'MMM d, yyyy') : 'Recent'}
          </div>
          <div className="flex items-center">
            <UserIcon className="h-4 w-4 mr-1" />
            {author?.firstName || 'Admin'} {author?.lastName || 'User'}
          </div>
        </div>

        {/* Title */}
        <Link to={`/blogs/${postSlug}`}>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-2">
            {title || 'Untitled Post'}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
          {excerpt || (content ? content.substring(0, 150) : 'No description available')}...
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <EyeIcon className="h-4 w-4 mr-1" />
              {views || 0} views
            </div>
            <div className="flex items-center">
              <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
              {commentsCount || 0} comments
            </div>
          </div>
          
          <Link
            to={`/blogs/${postSlug}`}
            className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium flex items-center"
          >
            Read More →
          </Link>
        </div>
      </div>
    </motion.article>
  );
};

export default BlogCard;