import React from 'react';
import { Link } from 'react-router-dom';

const CategoryTags = ({ categories = [], tags = [] }) => {
  return (
    <div className="space-y-3">
      {/* Categories */}
      {categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Categories:</span>
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/blogs?category=${category.slug}`}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
            >
              {category.name}
            </Link>
          ))}
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tags:</span>
          {tags.map((tag) => (
            <Link
              key={tag.id}
              to={`/blogs?tag=${tag.slug}`}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              #{tag.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryTags;