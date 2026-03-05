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

// Public routes
router.get('/master', async (req, res) => {
  try {
    const songs = await prisma.song.findMany({
      orderBy: { requestCount: 'desc' },
      include: {
        _count: {
          select: { requests: true }
        }
      }
    });

    res.json({
      status: 'success',
      data: { songs }
    });
  } catch (error) {
    console.error('Get songs error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch songs'
    });
  }
});

// Protected routes
router.use(authenticate);

// Create song request
router.post('/requests', async (req, res) => {
  try {
    const { songTitle, stanzaNumber, testimony, songId } = req.body;

    const request = await prisma.songRequest.create({
      data: {
        songTitle,
        stanzaNumber,
        testimony,
        userId: req.user.id,
        songId
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });

    // Update song request count if song exists
    if (songId) {
      await prisma.song.update({
        where: { id: songId },
        data: { requestCount: { increment: 1 } }
      });
    }

    res.status(201).json({
      status: 'success',
      data: { request }
    });
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create song request'
    });
  }
});

// Get song requests
router.get('/requests', async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    if (status) where.status = status;

    const [requests, total] = await Promise.all([
      prisma.songRequest.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          },
          song: true,
          _count: {
            select: { votes: true }
          }
        },
        orderBy: [
          { voteCount: 'desc' },
          { createdAt: 'desc' }
        ],
        skip: parseInt(skip),
        take: parseInt(limit)
      }),
      prisma.songRequest.count({ where })
    ]);

    res.json({
      status: 'success',
      data: {
        requests,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch requests'
    });
  }
});

// Vote on request
router.post('/requests/:requestId/vote', async (req, res) => {
  try {
    const { requestId } = req.params;

    // Check if request exists
    const request = await prisma.songRequest.findUnique({
      where: { id: requestId }
    });

    if (!request) {
      return res.status(404).json({
        status: 'error',
        message: 'Song request not found'
      });
    }

    // Check if user already voted
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_requestId: {
          userId: req.user.id,
          requestId
        }
      }
    });

    if (existingVote) {
      // Remove vote
      await prisma.$transaction([
        prisma.vote.delete({
          where: {
            userId_requestId: {
              userId: req.user.id,
              requestId
            }
          }
        }),
        prisma.songRequest.update({
          where: { id: requestId },
          data: { voteCount: { decrement: 1 } }
        })
      ]);
      
      res.json({
        status: 'success',
        data: { action: 'removed', voteCount: request.voteCount - 1 }
      });
    } else {
      // Add vote
      await prisma.$transaction([
        prisma.vote.create({
          data: {
            userId: req.user.id,
            requestId
          }
        }),
        prisma.songRequest.update({
          where: { id: requestId },
          data: { voteCount: { increment: 1 } }
        })
      ]);
      
      res.json({
        status: 'success',
        data: { action: 'added', voteCount: request.voteCount + 1 }
      });
    }
  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to process vote'
    });
  }
});

module.exports = router;