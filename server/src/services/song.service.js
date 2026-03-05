const { PrismaClient } = require('@prisma/client');
const AppError = require('../utils/AppError');

const prisma = new PrismaClient();

class SongService {
  async createRequest(userId, data) {
    const { songTitle, stanzaNumber, testimony, songId } = data;

    // Check if voting is enabled
    const voteModeSetting = await prisma.systemSettings.findUnique({
      where: { key: 'VOTE_MODE' }
    });
    const voteMode = voteModeSetting?.value === 'ENABLED';

    const request = await prisma.songRequest.create({
      data: {
        songTitle,
        stanzaNumber,
        testimony,
        userId,
        songId
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        song: true
      }
    });

    // Update song request count if song exists
    if (songId) {
      await prisma.song.update({
        where: { id: songId },
        data: { requestCount: { increment: 1 } }
      });
    }

    return request;
  }

  async getRequests(filters = {}) {
    const { status, userId, search, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const where = {};
    if (status) where.status = status;
    if (userId) where.userId = userId;
    if (search) {
      where.OR = [
        { songTitle: { contains: search, mode: 'insensitive' } },
        { testimony: { contains: search, mode: 'insensitive' } }
      ];
    }

    const requests = await prisma.songRequest.findMany({
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
        votes: {
          select: {
            userId: true
          }
        },
        _count: {
          select: { votes: true }
        }
      },
      orderBy: [
        { voteCount: 'desc' },
        { createdAt: 'desc' }
      ],
      skip,
      take: limit
    });

    const total = await prisma.songRequest.count({ where });

    // Check if current user has voted (would need userId in real implementation)
    const requestsWithVoteStatus = requests.map(req => ({
      ...req,
      userVoted: false // This would be set based on actual user
    }));

    return {
      requests: requestsWithVoteStatus,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async toggleVote(userId, requestId) {
    // Check if voting is enabled
    const voteModeSetting = await prisma.systemSettings.findUnique({
      where: { key: 'VOTE_MODE' }
    });
    
    if (voteModeSetting?.value !== 'ENABLED') {
      throw new AppError('Voting is currently disabled', 400);
    }

    // Check if request exists
    const request = await prisma.songRequest.findUnique({
      where: { id: requestId }
    });

    if (!request) {
      throw new AppError('Song request not found', 404);
    }

    // Check if user already voted
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_requestId: {
          userId,
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
              userId,
              requestId
            }
          }
        }),
        prisma.songRequest.update({
          where: { id: requestId },
          data: { voteCount: { decrement: 1 } }
        })
      ]);
      return { action: 'removed', voteCount: request.voteCount - 1 };
    } else {
      // Add vote
      await prisma.$transaction([
        prisma.vote.create({
          data: {
            userId,
            requestId
          }
        }),
        prisma.songRequest.update({
          where: { id: requestId },
          data: { voteCount: { increment: 1 } }
        })
      ]);
      return { action: 'added', voteCount: request.voteCount + 1 };
    }
  }

  async updateStatus(requestId, status, scheduledDate = null) {
    const request = await prisma.songRequest.findUnique({
      where: { id: requestId }
    });

    if (!request) {
      throw new AppError('Song request not found', 404);
    }

    const updated = await prisma.songRequest.update({
      where: { id: requestId },
      data: {
        status,
        scheduledDate: scheduledDate ? new Date(scheduledDate) : null
      },
      include: {
        user: true,
        song: true
      }
    });

    return updated;
  }

  async getStats() {
    const total = await prisma.songRequest.count();
    const pending = await prisma.songRequest.count({ where: { status: 'PENDING' } });
    const scheduled = await prisma.songRequest.count({ where: { status: 'SCHEDULED' } });
    const sung = await prisma.songRequest.count({ where: { status: 'SUNG' } });
    const totalVotes = await prisma.vote.count();

    return {
      total,
      pending,
      scheduled,
      sung,
      totalVotes
    };
  }

  // Song master functions
  async getAllSongs(search = '') {
    const where = search ? {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { artist: { contains: search, mode: 'insensitive' } }
      ]
    } : {};

    const songs = await prisma.song.findMany({
      where,
      orderBy: { requestCount: 'desc' },
      include: {
        _count: {
          select: { requests: true }
        }
      }
    });

    return songs;
  }

  async addSong(data) {
    const { title, artist, lyrics, youtubeUrl, isOriginal } = data;

    // Check if song exists
    const existing = await prisma.song.findFirst({
      where: {
        title,
        artist: artist || null
      }
    });

    if (existing) {
      throw new AppError('Song already exists', 400);
    }

    const song = await prisma.song.create({
      data: {
        title,
        artist,
        lyrics,
        youtubeUrl,
        isOriginal: isOriginal || false
      }
    });

    return song;
  }

  async updateSong(id, data) {
    const song = await prisma.song.update({
      where: { id },
      data
    });

    return song;
  }

  async deleteSong(id) {
    // Check if song has requests
    const requestCount = await prisma.songRequest.count({
      where: { songId: id }
    });

    if (requestCount > 0) {
      throw new AppError('Cannot delete song with existing requests', 400);
    }

    await prisma.song.delete({
      where: { id }
    });

    return { message: 'Song deleted successfully' };
  }
}

module.exports = new SongService();