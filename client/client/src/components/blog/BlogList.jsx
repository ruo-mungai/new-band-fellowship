import React from 'react';
import { NewspaperIcon } from '@heroicons/react/24/outline'; // Add this import
import BlogCard from './BlogCard';
import Loader from '@/components/common/Loader';

const BlogList = ({ posts, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader size="lg" text="Loading posts..." />
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl">
        <NewspaperIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          No Blog Posts Yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Check back soon for new posts!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default BlogList;