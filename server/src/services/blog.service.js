const { PrismaClient } = require('@prisma/client');
const slugify = require('slugify');
const AppError = require('../utils/AppError');

const prisma = new PrismaClient();

class BlogService {
  // Create a new blog post
  async createPost(authorId, data) {
    const { title, content, excerpt, featuredImage, youtubeUrl, categories, tags, isPublished } = data;

    // Generate slug from title
    const slug = slugify(title, { lower: true, strict: true });

    // Check if slug exists
    const existing = await prisma.blogPost.findUnique({
      where: { slug }
    });

    if (existing) {
      throw new AppError('A post with this title already exists', 400);
    }

    // Prepare categories and tags connections
    const categoriesConnect = categories?.map(id => ({ id })) || [];
    const tagsConnect = tags?.map(id => ({ id })) || [];

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        featuredImage,
        youtubeUrl,
        isPublished: isPublished || false,
        publishedAt: isPublished ? new Date() : null,
        authorId,
        categories: {
          connect: categoriesConnect
        },
        tags: {
          connect: tagsConnect
        }
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true
          }
        },
        categories: true,
        tags: true
      }
    });

    return post;
  }

  // Get all blog posts with filters
  async getAllPosts(filters = {}) {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      tag, 
      search, 
      authorId,
      published 
    } = filters;

    const skip = (page - 1) * limit;

    // Build where clause
    const where = {};

    if (published !== undefined) {
      where.isPublished = published === 'true' || published === true;
    }

    if (authorId) {
      where.authorId = authorId;
    }

    if (category) {
      where.categories = {
        some: {
          slug: category
        }
      };
    }

    if (tag) {
      where.tags = {
        some: {
          slug: tag
        }
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Get posts
    const posts = await prisma.blogPost.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true
          }
        },
        categories: true,
        tags: true,
        _count: {
          select: {
            comments: true
          }
        }
      },
      orderBy: {
        publishedAt: 'desc'
      },
      skip,
      take: parseInt(limit)
    });

    // Get total count
    const total = await prisma.blogPost.count({ where });

    return {
      posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  // Get single post by slug
  async getPostBySlug(slug, incrementViews = true) {
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
            bio: true
          }
        },
        categories: true,
        tags: true,
        comments: {
          where: { isApproved: true },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profileImage: true
              }
            },
            replies: {
              include: {
                user: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    profileImage: true
                  }
                }
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!post) {
      throw new AppError('Blog post not found', 404);
    }

    // Increment view count if requested
    if (incrementViews) {
      await prisma.blogPost.update({
        where: { id: post.id },
        data: { views: { increment: 1 } }
      });
    }

    return post;
  }

  // Get post by ID (for admin)
  async getPostById(id) {
    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        categories: true,
        tags: true,
        comments: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!post) {
      throw new AppError('Blog post not found', 404);
    }

    return post;
  }

  // Update post
  async updatePost(id, data) {
    const { title, content, excerpt, featuredImage, youtubeUrl, categories, tags, isPublished } = data;

    // Prepare update data
    const updateData = {};

    if (title) {
      updateData.title = title;
      updateData.slug = slugify(title, { lower: true, strict: true });
    }
    if (content) updateData.content = content;
    if (excerpt) updateData.excerpt = excerpt;
    if (featuredImage) updateData.featuredImage = featuredImage;
    if (youtubeUrl) updateData.youtubeUrl = youtubeUrl;
    if (isPublished !== undefined) {
      updateData.isPublished = isPublished;
      if (isPublished && !updateData.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    // Handle categories and tags updates
    if (categories) {
      updateData.categories = {
        set: categories.map(id => ({ id }))
      };
    }

    if (tags) {
      updateData.tags = {
        set: tags.map(id => ({ id }))
      };
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        categories: true,
        tags: true
      }
    });

    return post;
  }

  // Delete post
  async deletePost(id) {
    // Delete all comments first
    await prisma.comment.deleteMany({
      where: { postId: id }
    });

    // Delete post
    await prisma.blogPost.delete({
      where: { id }
    });

    return { message: 'Post deleted successfully' };
  }

  // Category management
  async createCategory(data) {
    const { name, description } = data;
    const slug = slugify(name, { lower: true, strict: true });

    const existing = await prisma.category.findUnique({
      where: { slug }
    });

    if (existing) {
      throw new AppError('Category already exists', 400);
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description
      }
    });

    return category;
  }

  async getAllCategories() {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { posts: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    return categories;
  }

  async updateCategory(id, data) {
    const updateData = { ...data };
    if (data.name) {
      updateData.slug = slugify(data.name, { lower: true, strict: true });
    }

    const category = await prisma.category.update({
      where: { id },
      data: updateData
    });

    return category;
  }

  async deleteCategory(id) {
    // Check if category has posts
    const postsCount = await prisma.blogPostCategory.count({
      where: { categoryId: id }
    });

    if (postsCount > 0) {
      throw new AppError('Cannot delete category with existing posts', 400);
    }

    await prisma.category.delete({
      where: { id }
    });

    return { message: 'Category deleted successfully' };
  }

  // Tag management
  async createTag(data) {
    const { name } = data;
    const slug = slugify(name, { lower: true, strict: true });

    const existing = await prisma.tag.findUnique({
      where: { slug }
    });

    if (existing) {
      throw new AppError('Tag already exists', 400);
    }

    const tag = await prisma.tag.create({
      data: {
        name,
        slug
      }
    });

    return tag;
  }

  async getAllTags() {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: { posts: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    return tags;
  }

  async updateTag(id, data) {
    const updateData = { ...data };
    if (data.name) {
      updateData.slug = slugify(data.name, { lower: true, strict: true });
    }

    const tag = await prisma.tag.update({
      where: { id },
      data: updateData
    });

    return tag;
  }

  async deleteTag(id) {
    // Check if tag has posts
    const postsCount = await prisma.blogPostTag.count({
      where: { tagId: id }
    });

    if (postsCount > 0) {
      throw new AppError('Cannot delete tag with existing posts', 400);
    }

    await prisma.tag.delete({
      where: { id }
    });

    return { message: 'Tag deleted successfully' };
  }

  // Comment management
  async addComment(userId, postId, data) {
    const { content, parentId } = data;

    // Check if post exists and is published
    const post = await prisma.blogPost.findUnique({
      where: { id: postId }
    });

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    // Auto-approve comments from approved users? Or require moderation
    const comment = await prisma.comment.create({
      data: {
        content,
        userId,
        postId,
        parentId,
        isApproved: false // Require moderation
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            profileImage: true
          }
        }
      }
    });

    return comment;
  }

  async getComments(postId, filters = {}) {
    const { approved, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where = { postId };
    if (approved !== undefined) {
      where.isApproved = approved === 'true' || approved === true;
    }

    const comments = await prisma.comment.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true
          }
        },
        replies: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: parseInt(limit)
    });

    const total = await prisma.comment.count({ where });

    return {
      comments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async approveComment(commentId) {
    const comment = await prisma.comment.update({
      where: { id: commentId },
      data: { isApproved: true }
    });

    return comment;
  }

  async deleteComment(commentId) {
    // Delete replies first
    await prisma.comment.deleteMany({
      where: { parentId: commentId }
    });

    // Delete comment
    await prisma.comment.delete({
      where: { id: commentId }
    });

    return { message: 'Comment deleted successfully' };
  }

  // Get blog stats for dashboard
  async getStats() {
    const [
      totalPosts,
      publishedPosts,
      draftPosts,
      totalComments,
      pendingComments,
      totalCategories,
      totalTags
    ] = await Promise.all([
      prisma.blogPost.count(),
      prisma.blogPost.count({ where: { isPublished: true } }),
      prisma.blogPost.count({ where: { isPublished: false } }),
      prisma.comment.count(),
      prisma.comment.count({ where: { isApproved: false } }),
      prisma.category.count(),
      prisma.tag.count()
    ]);

    // Get most viewed posts
    const popularPosts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { views: 'desc' },
      take: 5,
      select: {
        title: true,
        slug: true,
        views: true
      }
    });

    return {
      totalPosts,
      publishedPosts,
      draftPosts,
      totalComments,
      pendingComments,
      totalCategories,
      totalTags,
      popularPosts
    };
  }
}

module.exports = new BlogService();