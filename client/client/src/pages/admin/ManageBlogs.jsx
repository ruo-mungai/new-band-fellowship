import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';
import DataTable from '@/components/admin/DataTable';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import RichTextEditor from '@/components/admin/RichTextEditor';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import { adminService } from '@/services/adminService';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const blogSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  content: z.string().min(10, 'Content is required'),
  excerpt: z.string().optional(),
  featuredImage: z.string().optional(),
  categoryId: z.string().optional(),
  tags: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
});

const ManageBlogs = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [categories, setCategories] = useState([]);
  const [content, setContent] = useState('');
  const [filters, setFilters] = useState({ page: 1, limit: 10 });

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(blogSchema),
  });

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, [filters]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await adminService.blogs.getAll(filters);
      setPosts(data.items);
    } catch (error) {
      toast.error('Failed to fetch blog posts');
    } finally {
      setLoading(false);
    }
  };

  // const fetchCategories = async () => {
  //   try {
  //     const data = await adminService.blogs.getCategories();
  //     setCategories(data);
  //   } catch (error) {
  //     console.error('Failed to fetch categories:', error);
  //   }
  // };
  
    useEffect(() => {
  fetchCategories();
}, []);

const fetchCategories = async () => {
  try {
    const data = await adminService.blogs.getCategories();
    setCategories(data || []);
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    setCategories([]); // Set empty array on error
  }
};



  const onSubmit = async (data) => {
  try {
    console.log('📝 Submitting blog form with data:', data);
    
    // Ensure content is not empty
    if (!content || content.trim() === '') {
      toast.error('Content is required');
      return;
    }
    
    const postData = {
      ...data,
      content, // This comes from the RichTextEditor state
      tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
    };

    console.log('📝 Final post data:', postData);
    
    if (selectedPost) {
      await adminService.blogs.update(selectedPost.id, postData);
      toast.success('Blog post updated successfully');
    } else {
      await adminService.blogs.create(postData);
      toast.success('Blog post created successfully');
    }
    
    setIsModalOpen(false);
    reset();
    setContent('');
    setSelectedPost(null);
    fetchPosts();
  } catch (error) {
    console.error('❌ Failed to save blog post:', error);
    console.error('❌ Error details:', error.response?.data);
    toast.error(error.response?.data?.message || error.message || 'Failed to save blog post');
  }
};

  const handlePublish = async (postId, publish) => {
    try {
      if (publish) {
        await adminService.blogs.publish(postId);
        toast.success('Blog post published');
      } else {
        await adminService.blogs.unpublish(postId);
        toast.success('Blog post unpublished');
      }
      fetchPosts();
    } catch (error) {
      toast.error('Failed to update publish status');
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await adminService.blogs.delete(postId);
        toast.success('Blog post deleted');
        fetchPosts();
      } catch (error) {
        toast.error('Failed to delete blog post');
      }
    }
  };

  const columns = [
    {
      key: 'title',
      label: 'Title',
      render: (_, row) => (
        <div className="flex items-center space-x-3">
          {row.featuredImage && (
            <img src={row.featuredImage} alt={row.title} className="h-10 w-10 rounded object-cover" />
          )}
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{row.title}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{row.excerpt?.substring(0, 60)}...</p>
          </div>
        </div>
      ),
    },
    {
      key: 'author',
      label: 'Author',
      render: (_, row) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {row.author?.firstName} {row.author?.lastName}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (_, row) => (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          row.isPublished 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
        }`}>
          {row.isPublished ? 'Published' : 'Draft'}
        </span>
      ),
    },
    {
      key: 'views',
      label: 'Views',
      render: (views) => (
        <span className="text-sm font-medium text-gray-900 dark:text-white">{views || 0}</span>
      ),
    },
    {
      key: 'publishedAt',
      label: 'Published',
      render: (date) => date ? format(new Date(date), 'MMM d, yyyy') : '-',
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              handlePublish(row.id, !row.isPublished);
            }}
          >
            {row.isPublished ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPost(row);
              setContent(row.content);
              reset(row);
              setIsModalOpen(true);
            }}
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row.id);
            }}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Blog Posts</h1>
        <Button
          variant="primary"
          icon={PlusIcon}
          onClick={() => {
            setSelectedPost(null);
            setContent('');
            reset({});
            setIsModalOpen(true);
          }}
        >
          New Post
        </Button>
      </div>

      <Card>
        <DataTable
          columns={columns}
          data={posts}
          loading={loading}
          pagination={{
            page: filters.page,
            limit: filters.limit,
            total: posts.length,
            pages: Math.ceil(posts.length / filters.limit),
          }}
          onPageChange={(page) => setFilters({ ...filters, page })}
        />
      </Card>

      {/* Blog Post Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPost(null);
          setContent('');
          reset({});
        }}
        title={selectedPost ? 'Edit Blog Post' : 'Create New Blog Post'}
        size="xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Title"
            {...register('title')}
            error={errors.title?.message}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Content
            </label>
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="Write your blog post content here..."
            />
          </div>

          <Input
            label="Excerpt (optional)"
            {...register('excerpt')}
            error={errors.excerpt?.message}
            placeholder="Brief summary of the post"
          />

          <Input
            label="Featured Image URL (optional)"
            {...register('featuredImage')}
            error={errors.featuredImage?.message}
          />

          <Select
            label="Category"
            {...register('categoryId')}
            error={errors.categoryId?.message}
            options={[
              { value: '', label: 'Select a category' },
              ...categories.map(cat => ({ value: cat.id, label: cat.name })),
            ]}
          />

          <Input
            label="Tags (comma-separated)"
            {...register('tags')}
            error={errors.tags?.message}
            placeholder="worship, fellowship, gospel"
          />

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">SEO Settings</h3>
            
            <Input
              label="Meta Title"
              {...register('metaTitle')}
              error={errors.metaTitle?.message}
            />

            <Input
              label="Meta Description"
              {...register('metaDescription')}
              error={errors.metaDescription?.message}
            />

            <Input
              label="Meta Keywords"
              {...register('metaKeywords')}
              error={errors.metaKeywords?.message}
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setSelectedPost(null);
                setContent('');
                reset({});
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {selectedPost ? 'Update' : 'Create'} Post
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageBlogs;