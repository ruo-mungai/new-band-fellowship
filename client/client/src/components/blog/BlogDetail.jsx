import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import {
  CalendarIcon,
  UserIcon,
  EyeIcon,
  ShareIcon,
  HeartIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import { fetchBlogBySlug, clearCurrentPost } from '@/store/slices/blogSlice';
import CommentSection from './CommentSection';
import CategoryTags from './CategoryTags';
import Loader from '@/components/common/Loader';
import Button from '@/components/common/Button';
import { Helmet } from 'react-helmet-async';

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentPost: post, loading, error } = useSelector((state) => state.blogs);

  useEffect(() => {
    if (slug) {
      console.log('Fetching blog with slug:', slug);
      dispatch(fetchBlogBySlug(slug));
    }
    
    // Cleanup on unmount
    return () => {
      dispatch(clearCurrentPost());
    };
  }, [dispatch, slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title || 'Blog Post',
        text: post?.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You might want to show a toast here
    }
  };

  const handleGoBack = () => {
    navigate('/blogs');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader size="lg" text="Loading post..." />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12">
        <div className="text-center max-w-md mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-4">
            Post Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The blog post you're looking for doesn't exist or may have been removed.
          </p>
          <Button
            variant="primary"
            onClick={handleGoBack}
            icon={ArrowLeftIcon}
          >
            Back to Blogs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} - New Band Fellowship</title>
        <meta name="description" content={post.excerpt || post.content?.substring(0, 160)} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.featuredImage} />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <article className="min-h-screen bg-white dark:bg-gray-900">
        {/* Hero Image */}
        <div className="relative h-[400px] md:h-[500px] overflow-hidden">
          <img
            src={post.featuredImage || 'https://images.unsplash.com/photo-1507692049790-de58290c433e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
          
          {/* Back Button */}
          <button
            onClick={handleGoBack}
            className="absolute top-6 left-6 bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white px-4 py-2 rounded-full flex items-center space-x-2 hover:bg-white dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span>Back to Blogs</span>
          </button>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mb-4">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <UserIcon className="h-4 w-4 mr-1" />
                {post.author?.firstName || 'Admin'} {post.author?.lastName || 'User'}
              </div>
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                {post.publishedAt ? format(new Date(post.publishedAt), 'MMMM d, yyyy') : 'Recent'}
              </div>
              <div className="flex items-center">
                <EyeIcon className="h-4 w-4 mr-1" />
                {post.views || 0} views
              </div>
            </div>

            {/* Categories and Tags */}
            {(post.categories?.length > 0 || post.tags?.length > 0) && (
              <div className="mt-4">
                <CategoryTags categories={post.categories || []} tags={post.tags || []} />
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center space-x-4 mt-6">
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <ShareIcon className="h-4 w-4" />
                <span>Share</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <HeartIcon className="h-4 w-4" />
                <span>Like</span>
              </button>
            </div>
          </div>

          {/* Blog Content */}
          <div 
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content || '<p>No content available</p>' }}
          />

          {/* Author Bio */}
          {post.author && (
            <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl">
              <div className="flex items-center space-x-4">
                {post.author.profileImage ? (
                  <img
                    src={post.author.profileImage}
                    alt={post.author.firstName}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                    <span className="text-primary-600 dark:text-primary-400 text-xl font-bold">
                      {post.author.firstName?.[0]}{post.author.lastName?.[0]}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {post.author.firstName} {post.author.lastName}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {post.author.bio || 'Contributor at New Band Fellowship'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Comments Section */}
          <div className="mt-12">
            <CommentSection postId={post.id} comments={post.comments || []} />
          </div>
        </div>
      </article>
    </>
  );
};

export default BlogDetail;