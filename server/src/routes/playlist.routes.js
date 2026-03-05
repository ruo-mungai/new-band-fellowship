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

// Public route to get playlist by event
router.get('/event/:eventId', async (req, res) => {
  try {
    const playlist = await prisma.playlist.findUnique({
      where: { eventId: req.params.eventId },
      include: {
        items: {
          orderBy: { order: 'asc' },
          include: {
            song: true,
            songRequest: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true
                  }
                }
              }
            },
            session: true
          }
        },
        event: true
      }
    });

    if (!playlist) {
      return res.status(404).json({
        status: 'error',
        message: 'Playlist not found'
      });
    }

    res.json({
      status: 'success',
      data: { playlist }
    });
  } catch (error) {
    console.error('Get playlist error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch playlist'
    });
  }
});

// All remaining routes require authentication and admin
router.use(authenticate);
router.use(requireAdmin);

// Add item to playlist
router.post('/:playlistId/items', async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { sessionId, songId, songRequestId, backgroundImage, backgroundColor, notes } = req.body;

    // Get current max order
    const lastItem = await prisma.playlistItem.findFirst({
      where: { playlistId },
      orderBy: { order: 'desc' }
    });

    const newOrder = lastItem ? lastItem.order + 1 : 1;

    const item = await prisma.playlistItem.create({
      data: {
        order: newOrder,
        playlistId,
        sessionId,
        songId,
        songRequestId,
        backgroundImage,
        backgroundColor,
        notes
      },
      include: {
        song: true,
        session: true
      }
    });

    // If from song request, update its status
    if (songRequestId) {
      await prisma.songRequest.update({
        where: { id: songRequestId },
        data: { status: 'SCHEDULED' }
      });
    }

    res.status(201).json({
      status: 'success',
      data: { item }
    });
  } catch (error) {
    console.error('Add item error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to add item to playlist'
    });
  }
});

// Update playlist item
router.patch('/items/:itemId', async (req, res) => {
  try {
    const item = await prisma.playlistItem.update({
      where: { id: req.params.itemId },
      data: req.body
    });

    res.json({
      status: 'success',
      data: { item }
    });
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update item'
    });
  }
});

// Remove item from playlist
router.delete('/items/:itemId', async (req, res) => {
  try {
    const item = await prisma.playlistItem.delete({
      where: { id: req.params.itemId }
    });

    // If from song request, revert status
    if (item.songRequestId) {
      await prisma.songRequest.update({
        where: { id: item.songRequestId },
        data: { status: 'PENDING' }
      });
    }

    // Reorder remaining items
    const remainingItems = await prisma.playlistItem.findMany({
      where: { playlistId: item.playlistId },
      orderBy: { order: 'asc' }
    });

    for (let i = 0; i < remainingItems.length; i++) {
      await prisma.playlistItem.update({
        where: { id: remainingItems[i].id },
        data: { order: i + 1 }
      });
    }

    res.json({
      status: 'success',
      message: 'Item removed successfully'
    });
  } catch (error) {
    console.error('Remove item error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to remove item'
    });
  }
});

// Reorder playlist items
router.post('/:playlistId/items/reorder', async (req, res) => {
  try {
    const { items } = req.body; // Array of { id, order }

    for (const item of items) {
      await prisma.playlistItem.update({
        where: { id: item.id },
        data: { order: item.order }
      });
    }

    res.json({
      status: 'success',
      message: 'Playlist reordered successfully'
    });
  } catch (error) {
    console.error('Reorder error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to reorder playlist'
    });
  }
});

// Mark item as sung
router.patch('/items/:itemId/sung', async (req, res) => {
  try {
    const item = await prisma.playlistItem.findUnique({
      where: { id: req.params.itemId }
    });

    if (item.songRequestId) {
      await prisma.songRequest.update({
        where: { id: item.songRequestId },
        data: { status: 'SUNG' }
      });
    }

    res.json({
      status: 'success',
      message: 'Marked as sung'
    });
  } catch (error) {
    console.error('Mark sung error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to mark as sung'
    });
  }
});

module.exports = router;