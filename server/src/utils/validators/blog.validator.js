const { z } = require('zod');

const createPostSchema = z.object({
  body: z.object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    content: z.string().min(50, 'Content must be at least 50 characters'),
    excerpt: z.string().optional(),
    featuredImage: z.string().url().optional(),
    youtubeUrl: z.string().url().optional(),
    categories: z.array(z.string().cuid()).optional(),
    tags: z.array(z.string().cuid()).optional(),
    isPublished: z.boolean().optional()
  })
});

const updatePostSchema = z.object({
  body: z.object({
    title: z.string().min(5).optional(),
    content: z.string().min(50).optional(),
    excerpt: z.string().optional(),
    featuredImage: z.string().url().optional(),
    youtubeUrl: z.string().url().optional(),
    categories: z.array(z.string().cuid()).optional(),
    tags: z.array(z.string().cuid()).optional(),
    isPublished: z.boolean().optional()
  }),
  params: z.object({
    id: z.string().cuid()
  })
});

const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Category name must be at least 2 characters'),
    description: z.string().optional()
  })
});

const createTagSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Tag name must be at least 2 characters')
  })
});

const addCommentSchema = z.object({
  body: z.object({
    content: z.string().min(2, 'Comment must be at least 2 characters'),
    parentId: z.string().cuid().optional()
  }),
  params: z.object({
    postId: z.string().cuid()
  })
});

module.exports = {
  createPostSchema,
  updatePostSchema,
  createCategorySchema,
  createTagSchema,
  addCommentSchema
};