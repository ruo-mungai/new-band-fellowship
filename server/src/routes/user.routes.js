const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

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

// All routes require authentication
router.use(authenticate);

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        profileImage: true,
        role: true,
        isApproved: true,
        createdAt: true,
        _count: {
          select: {
            songRequests: true,
            comments: true,
            rsvps: true
          }
        }
      }
    });

    res.json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch profile'
    });
  }
});

// Update profile
router.patch('/profile', async (req, res) => {
  try {
    const { firstName, lastName, phone, profileImage } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        firstName,
        lastName,
        phone,
        profileImage
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        profileImage: true,
        role: true
      }
    });

    res.json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update profile'
    });
  }
});

// Get user's song requests
router.get('/song-requests', async (req, res) => {
  try {
    const requests = await prisma.songRequest.findMany({
      where: { userId: req.user.id },
      include: {
        song: true,
        _count: {
          select: { votes: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      status: 'success',
      data: { requests }
    });
  } catch (error) {
    console.error('Song requests error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch song requests'
    });
  }
});

// Get user's comments
router.get('/comments', async (req, res) => {
  try {
    const comments = await prisma.comment.findMany({
      where: { userId: req.user.id },
      include: {
        post: {
          select: {
            title: true,
            slug: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      status: 'success',
      data: { comments }
    });
  } catch (error) {
    console.error('Comments error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch comments'
    });
  }
});

// Get user's RSVPs
router.get('/rsvps', async (req, res) => {
  try {
    const rsvps = await prisma.rSVP.findMany({
      where: { userId: req.user.id },
      include: {
        event: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      status: 'success',
      data: { rsvps }
    });
  } catch (error) {
    console.error('RSVPs error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch RSVPs'
    });
  }
});

module.exports = router;