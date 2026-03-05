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

// Public routes
router.get('/', async (req, res) => {
  try {
    const includePast = req.query.includePast === 'true';
    const now = new Date();

    const events = await prisma.event.findMany({
      where: includePast ? {} : {
        eventDate: { gte: now },
        isActive: true
      },
      include: {
        sessions: {
          orderBy: { order: 'asc' }
        },
        _count: {
          select: { rsvps: true }
        }
      },
      orderBy: { eventDate: 'asc' }
    });

    res.json({
      status: 'success',
      data: { events }
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch events'
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
      include: {
        sessions: {
          orderBy: { order: 'asc' }
        },
        playlist: {
          include: {
            items: {
              orderBy: { order: 'asc' },
              include: {
                song: true,
                session: true
              }
            }
          }
        }
      }
    });

    if (!event) {
      return res.status(404).json({
        status: 'error',
        message: 'Event not found'
      });
    }

    res.json({
      status: 'success',
      data: { event }
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch event'
    });
  }
});

// Protected routes (require login)
router.use(authenticate);

// RSVP to event
router.post('/:eventId/rsvp', async (req, res) => {
  try {
    const { eventId } = req.params;
    const { numberOfGuests = 1, notes } = req.body;

    const rsvp = await prisma.rSVP.upsert({
      where: {
        userId_eventId: {
          userId: req.user.id,
          eventId
        }
      },
      update: {
        numberOfGuests,
        notes,
        status: 'CONFIRMED'
      },
      create: {
        userId: req.user.id,
        eventId,
        numberOfGuests,
        notes
      }
    });

    res.status(201).json({
      status: 'success',
      data: { rsvp }
    });
  } catch (error) {
    console.error('RSVP error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to RSVP'
    });
  }
});

// Cancel RSVP
router.delete('/:eventId/rsvp', async (req, res) => {
  try {
    await prisma.rSVP.delete({
      where: {
        userId_eventId: {
          userId: req.user.id,
          eventId: req.params.eventId
        }
      }
    });

    res.json({
      status: 'success',
      message: 'RSVP cancelled'
    });
  } catch (error) {
    console.error('Cancel RSVP error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to cancel RSVP'
    });
  }
});

// Admin routes
router.use(requireAdmin);

// Create event
router.post('/', async (req, res) => {
  try {
    const { title, description, eventDate, bannerImage } = req.body;

    const event = await prisma.event.create({
      data: {
        title,
        description,
        eventDate: new Date(eventDate),
        bannerImage
      }
    });

    // Create default sessions
    const date = new Date(eventDate);
    const sessions = [
      {
        type: 'FIRST_SESSION',
        title: 'Opening Worship',
        startTime: new Date(date.setHours(14, 0, 0, 0)),
        endTime: new Date(date.setHours(15, 0, 0, 0)),
        order: 1,
        eventId: event.id
      },
      {
        type: 'REQUEST_TIME',
        title: 'Song Requests',
        startTime: new Date(date.setHours(15, 0, 0, 0)),
        endTime: new Date(date.setHours(15, 30, 0, 0)),
        order: 2,
        eventId: event.id
      },
      {
        type: 'SECOND_SESSION',
        title: 'Main Worship',
        startTime: new Date(date.setHours(15, 30, 0, 0)),
        endTime: new Date(date.setHours(16, 30, 0, 0)),
        order: 3,
        eventId: event.id
      },
      {
        type: 'TESTIMONY_TIME',
        title: 'Testimonies',
        startTime: new Date(date.setHours(16, 30, 0, 0)),
        endTime: new Date(date.setHours(17, 0, 0, 0)),
        order: 4,
        eventId: event.id
      }
    ];

    await prisma.session.createMany({
      data: sessions
    });

    // Create playlist
    await prisma.playlist.create({
      data: {
        eventId: event.id,
        isActive: true
      }
    });

    res.status(201).json({
      status: 'success',
      data: { event }
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create event'
    });
  }
});

// Update event
router.patch('/:id', async (req, res) => {
  try {
    const event = await prisma.event.update({
      where: { id: req.params.id },
      data: req.body
    });

    res.json({
      status: 'success',
      data: { event }
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update event'
    });
  }
});

// Delete event
router.delete('/:id', async (req, res) => {
  try {
    await prisma.event.delete({
      where: { id: req.params.id }
    });

    res.json({
      status: 'success',
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete event'
    });
  }
});

module.exports = router;