const { PrismaClient } = require('@prisma/client');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// ======================
// DASHBOARD STATISTICS
// ======================

exports.getDashboardStats = catchAsync(async (req, res) => {
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

  // Get recent activity
  const recentActivity = await prisma.$transaction([
    prisma.songRequest.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { firstName: true, lastName: true } } }
    }),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, firstName: true, lastName: true, email: true, createdAt: true }
    }),
    prisma.comment.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { firstName: true, lastName: true } } }
    })
  ]);

  const formattedActivity = [
    ...recentActivity[0].map(r => ({
      type: 'song_request',
      description: `${r.user.firstName} ${r.user.lastName} requested "${r.songTitle}"`,
      time: r.createdAt
    })),
    ...recentActivity[1].map(u => ({
      type: 'new_user',
      description: `${u.firstName} ${u.lastName} registered`,
      time: u.createdAt
    })),
    ...recentActivity[2].map(c => ({
      type: 'comment',
      description: `${c.user.firstName} ${c.user.lastName} commented`,
      time: c.createdAt
    }))
  ].sort((a, b) => b.time - a.time).slice(0, 10);

  res.status(200).json({
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
      recentActivity: formattedActivity
    }
  });
});

// ======================
// USER MANAGEMENT
// ======================

exports.getAllUsers = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const search = req.query.search || '';

  const where = search ? {
    OR: [
      { email: { contains: search, mode: 'insensitive' } },
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } }
    ]
  } : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        profileImage: true,
        role: true,
        isApproved: true,
        isBanned: true,
        createdAt: true,
        _count: {
          select: {
            songRequests: true,
            comments: true,
            rsvps: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    }),
    prisma.user.count({ where })
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

exports.getUserDetails = catchAsync(async (req, res) => {
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
      },
      rsvps: {
        include: { event: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Remove password
  delete user.password;

  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

exports.approveUser = catchAsync(async (req, res) => {
  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: { isApproved: true }
  });

  // Send email notification (would call email service)
  // emailService.sendAccountApproved(user.email, user.firstName);

  res.status(200).json({
    status: 'success',
    message: 'User approved successfully',
    data: { user }
  });
});

exports.banUser = catchAsync(async (req, res) => {
  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: { isBanned: true }
  });

  res.status(200).json({
    status: 'success',
    message: 'User banned successfully',
    data: { user }
  });
});

exports.unbanUser = catchAsync(async (req, res) => {
  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: { isBanned: false }
  });

  res.status(200).json({
    status: 'success',
    message: 'User unbanned successfully',
    data: { user }
  });
});

exports.updateUserRole = catchAsync(async (req, res) => {
  const { role } = req.body;

  if (!['USER', 'ADMIN', 'SUPER_ADMIN'].includes(role)) {
    throw new AppError('Invalid role', 400);
  }

  // Prevent super admin from being demoted by non-super admin
  const targetUser = await prisma.user.findUnique({
    where: { id: req.params.id }
  });

  if (targetUser.role === 'SUPER_ADMIN' && req.user.role !== 'SUPER_ADMIN') {
    throw new AppError('Cannot modify super admin', 403);
  }

  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: { role }
  });

  res.status(200).json({
    status: 'success',
    message: 'User role updated successfully',
    data: { user }
  });
});

exports.deleteUser = catchAsync(async (req, res) => {
  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id: req.params.id }
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Prevent deleting super admin
  if (user.role === 'SUPER_ADMIN') {
    throw new AppError('Cannot delete super admin', 403);
  }

  // Delete user and all related data (cascading deletes will handle this)
  await prisma.user.delete({
    where: { id: req.params.id }
  });

  res.status(200).json({
    status: 'success',
    message: 'User deleted successfully'
  });
});

// ======================
// CONTENT MANAGEMENT
// ======================

exports.updateLandingContent = catchAsync(async (req, res) => {
  const { section } = req.params;
  const content = await prisma.landingContent.upsert({
    where: { section },
    update: req.body,
    create: {
      section,
      ...req.body
    }
  });

  res.status(200).json({
    status: 'success',
    data: { content }
  });
});

exports.createEventBanner = catchAsync(async (req, res) => {
  // Deactivate all other banners
  await prisma.eventBanner.updateMany({
    data: { isActive: false }
  });

  const banner = await prisma.eventBanner.create({
    data: {
      ...req.body,
      isActive: true
    }
  });

  res.status(201).json({
    status: 'success',
    data: { banner }
  });
});

exports.getSystemSettings = catchAsync(async (req, res) => {
  const settings = await prisma.systemSettings.findMany();
  
  const formatted = settings.reduce((acc, s) => {
    let value = s.value;
    if (s.type === 'boolean') value = value === 'true';
    if (s.type === 'number') value = Number(value);
    if (s.type === 'json') value = JSON.parse(value);
    acc[s.key] = value;
    return acc;
  }, {});

  res.status(200).json({
    status: 'success',
    data: formatted
  });
});

exports.updateSystemSettings = catchAsync(async (req, res) => {
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

  res.status(200).json({
    status: 'success',
    message: 'Settings updated successfully'
  });
});

// ======================
// ADMIN MANAGEMENT
// ======================

exports.createAdmin = catchAsync(async (req, res) => {
  const { email, password, firstName, lastName, phone } = req.body;

  // Check if user exists
  const existing = await prisma.user.findUnique({
    where: { email }
  });

  if (existing) {
    throw new AppError('User already exists with this email', 400);
  }

  // Hash password
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
    }
  });

  delete admin.password;

  res.status(201).json({
    status: 'success',
    data: { admin }
  });
});

exports.getAdmins = catchAsync(async (req, res) => {
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

  res.status(200).json({
    status: 'success',
    data: { admins }
  });
});