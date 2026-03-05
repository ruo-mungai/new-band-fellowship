const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();
const router = express.Router();

// Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'User not found'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token'
    });
  }
};

// Admin middleware
const requireAdmin = (req, res, next) => {
  if (!['ADMIN', 'SUPER_ADMIN'].includes(req.user.role)) {
    return res.status(403).json({
      status: 'error',
      message: 'Admin access required'
    });
  }
  next();
};

// Super admin middleware
const requireSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({
      status: 'error',
      message: 'Super admin access required'
    });
  }
  next();
};

// All routes require authentication and admin
router.use(authenticate);
router.use(requireAdmin);

// ======================
// DASHBOARD
// ======================

router.get('/dashboard', async (req, res) => {
  try {
    const [
      totalUsers,
      pendingUsers,
      totalSongs,
      totalRequests,
      pendingRequests,
      totalEvents,
      upcomingEvents,
      totalBlogs,
      publishedBlogs,
      totalComments,
      pendingComments,
      totalGallery
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isApproved: false } }),
      prisma.song.count(),
      prisma.songRequest.count(),
      prisma.songRequest.count({ where: { status: 'PENDING' } }),
      prisma.event.count(),
      prisma.event.count({ where: { eventDate: { gte: new Date() } } }),
      prisma.blogPost.count(),
      prisma.blogPost.count({ where: { isPublished: true } }),
      prisma.comment.count(),
      prisma.comment.count({ where: { isApproved: false } }),
      prisma.gallery.count()
    ]);

    // Recent activity
    const recentRequests = await prisma.songRequest.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { firstName: true, lastName: true }
        }
      }
    });

    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true
      }
    });

    const recentComments = await prisma.comment.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { firstName: true, lastName: true }
        },
        post: {
          select: { title: true }
        }
      }
    });

    res.json({
      status: 'success',
      data: {
        stats: {
          users: { total: totalUsers, pending: pendingUsers },
          songs: { total: totalSongs, requests: totalRequests, pending: pendingRequests },
          events: { total: totalEvents, upcoming: upcomingEvents },
          blogs: { total: totalBlogs, published: publishedBlogs },
          comments: { total: totalComments, pending: pendingComments },
          gallery: totalGallery
        },
        recent: {
          requests: recentRequests,
          users: recentUsers,
          comments: recentComments
        }
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch dashboard data'
    });
  }
});

// ======================
// USER MANAGEMENT
// ======================

router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          isApproved: true,
          isBanned: true,
          createdAt: true,
          _count: {
            select: {
              songRequests: true,
              comments: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: parseInt(skip),
        take: parseInt(limit)
      }),
      prisma.user.count({ where })
    ]);

    res.json({
      status: 'success',
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch users'
    });
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        songRequests: {
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        comments: {
          include: { post: { select: { title: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    delete user.password;

    res.json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch user'
    });
  }
});

router.patch('/users/:id/approve', async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { isApproved: true }
    });

    delete user.password;

    res.json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    console.error('Approve user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to approve user'
    });
  }
});

router.patch('/users/:id/ban', async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { isBanned: true }
    });

    delete user.password;

    res.json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    console.error('Ban user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to ban user'
    });
  }
});

router.patch('/users/:id/unban', async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { isBanned: false }
    });

    delete user.password;

    res.json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    console.error('Unban user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to unban user'
    });
  }
});

router.patch('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;

    if (!['USER', 'ADMIN'].includes(role)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid role'
      });
    }

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { role }
    });

    delete user.password;

    res.json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update role'
    });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    await prisma.user.delete({
      where: { id: req.params.id }
    });

    res.json({
      status: 'success',
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete user'
    });
  }
});

// ======================
// SYSTEM SETTINGS
// ======================

router.get('/settings', async (req, res) => {
  try {
    const settings = await prisma.systemSettings.findMany();

    const formatted = settings.reduce((acc, s) => {
      let value = s.value;
      if (s.type === 'boolean') value = value === 'true';
      if (s.type === 'number') value = Number(value);
      if (s.type === 'json') value = JSON.parse(value);
      acc[s.key] = value;
      return acc;
    }, {});

    res.json({
      status: 'success',
      data: formatted
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch settings'
    });
  }
});

router.patch('/settings', async (req, res) => {
  try {
    const updates = Object.entries(req.body).map(([key, value]) => {
      let type = 'string';
      if (typeof value === 'boolean') type = 'boolean';
      if (typeof value === 'number') type = 'number';
      if (typeof value === 'object') {
        type = 'json';
        value = JSON.stringify(value);
      }

      return prisma.systemSettings.upsert({
        where: { key },
        update: { value: String(value), type },
        create: { key, value: String(value), type }
      });
    });

    await prisma.$transaction(updates);

    res.json({
      status: 'success',
      message: 'Settings updated successfully'
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update settings'
    });
  }
});

// ======================
// SUPER ADMIN ONLY ROUTES
// ======================

router.use('/super', requireSuperAdmin);

router.get('/super/admins', async (req, res) => {
  try {
    const admins = await prisma.user.findMany({
      where: {
        OR: [
          { role: 'ADMIN' },
          { role: 'SUPER_ADMIN' }
        ]
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true
      }
    });

    res.json({
      status: 'success',
      data: { admins }
    });
  } catch (error) {
    console.error('Get admins error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch admins'
    });
  }
});

router.post('/super/admins', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    const existing = await prisma.user.findUnique({
      where: { email }
    });

    if (existing) {
      return res.status(400).json({
        status: 'error',
        message: 'User already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        role: 'ADMIN',
        isApproved: true
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true
      }
    });

    res.status(201).json({
      status: 'success',
      data: { admin }
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create admin'
    });
  }
});

module.exports = router;