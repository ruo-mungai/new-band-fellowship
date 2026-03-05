const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const slugify = require('slugify');

const prisma = new PrismaClient();
const router = express.Router();

// ======================
// PUBLIC ROUTES
// ======================

// Get published posts
router.get('/posts', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, tag, search } = req.query;
    const skip = (page - 1) * limit;

    const where = { isPublished: true };

    if (category) {
      where.categories = {
        some: { slug: category }
      };
    }

    if (tag) {
      where.tags = {
        some: { slug: tag }
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        include: {
          author: {
            select: {
              firstName: true,
              lastName: true
            }
          },
          categories: true,
          tags: true,
          _count: {
            select: { comments: true }
          }
        },
        orderBy: { publishedAt: 'desc' },
        skip: parseInt(skip),
        take: parseInt(limit)
      }),
      prisma.blogPost.count({ where })
    ]);

    res.json({
      status: 'success',
      data: {
        posts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch posts'
    });
  }
});

// Get single post by slug
router.get('/posts/:slug', async (req, res) => {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug: req.params.slug },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        categories: true,
        tags: true,
        comments: {
          where: { isApproved: true },
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!post || !post.isPublished) {
      return res.status(404).json({
        status: 'error',
        message: 'Post not found'
      });
    }

    // Increment view count
    await prisma.blogPost.update({
      where: { id: post.id },
      data: { views: { increment: 1 } }
    });

    res.json({
      status: 'success',
      data: { post }
    });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch post'
    });
  }
});

// Get categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { posts: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json({
      status: 'success',
      data: { categories }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch categories'
    });
  }
});

// Get tags
router.get('/tags', async (req, res) => {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: { posts: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json({
      status: 'success',
      data: { tags }
    });
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch tags'
    });
  }
});

module.exports = router;