import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { fetchBlogs, fetchCategories, fetchTags } from '@/store/slices/blogSlice';
import BlogList from '@/components/blog/BlogList';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import Pagination from '@/components/common/Pagination';
import Loader from '@/components/common/Loader';

const BlogsPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { posts, pagination, loading, categories, tags } = useSelector((state) => state.blogs);
  
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [tag, setTag] = useState(searchParams.get('tag') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

  useEffect(() => {
    // Fetch categories and tags
    dispatch(fetchCategories());
    dispatch(fetchTags());
  }, [dispatch]);

  useEffect(() => {
    const params = {
      page: searchParams.get('page') || 1,
      limit: 9,
      search,
      category,
      tag,
      sort,
    };
    console.log('📡 Fetching blogs with params:', params);
    dispatch(fetchBlogs(params));
  }, [dispatch, searchParams, search, category, tag, sort]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategory(value);
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('category', value);
    } else {
      params.delete('category');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleTagChange = (e) => {
    const value = e.target.value;
    setTag(value);
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('tag', value);
    } else {
      params.delete('tag');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSort(value);
    const params = new URLSearchParams(searchParams);
    params.set('sort', value);
    params.set('page', '1');
    setSearchParams(params);
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page);
    setSearchParams(params);
  };

  if (loading && posts.length === 0) {
    return <Loader fullScreen text="Loading blog posts..." />;
  }

  return (
    <>
      <Helmet>
        <title>Blog - New Band Fellowship</title>
        <meta name="description" content="Read our latest blog posts about worship, fellowship, and Kikuyu gospel music." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-4">
              Our Blog
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Insights, stories, and teachings from our fellowship community
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft p-6 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="col-span-1">
                <Input
                  type="text"
                  placeholder="Search posts..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  icon={MagnifyingGlassIcon}
                />
              </form>

              {/* Category Filter */}
              <Select
                value={category}
                onChange={handleCategoryChange}
                options={[
                  { value: '', label: 'All Categories' },
                  ...categories.map(cat => ({ value: cat.slug, label: cat.name })),
                ]}
              />

              {/* Tag Filter */}
              <Select
                value={tag}
                onChange={handleTagChange}
                options={[
                  { value: '', label: 'All Tags' },
                  ...tags.map(t => ({ value: t.slug, label: t.name })),
                ]}
              />

              {/* Sort */}
              <Select
                value={sort}
                onChange={handleSortChange}
                options={[
                  { value: 'newest', label: 'Newest First' },
                  { value: 'oldest', label: 'Oldest First' },
                  { value: 'popular', label: 'Most Popular' },
                ]}
              />
            </div>
          </motion.div>

          {/* Blog Grid */}
          <BlogList posts={posts} loading={loading} />

          {/* Pagination */}
          {pagination?.pages > 1 && (
            <div className="mt-12">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.pages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BlogsPage;