const { PrismaClient } = require('@prisma/client');
const AppError = require('../utils/AppError');

const prisma = new PrismaClient();

class PlaylistService {
  async getPlaylistByEvent(eventId) {
    const playlist = await prisma.playlist.findUnique({
      where: { eventId },
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
      throw new AppError('Playlist not found for this event', 404);
    }

    return playlist;
  }

  async addItem(playlistId, data) {
    const { sessionId, songId, songRequestId, backgroundImage, backgroundColor, notes } = data;

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
        songRequest: {
          include: {
            user: true
          }
        },
        session: true
      }
    });

    // If this is from a song request, update its status to SCHEDULED
    if (songRequestId) {
      await prisma.songRequest.update({
        where: { id: songRequestId },
        data: { status: 'SCHEDULED' }
      });
    }

    return item;
  }

  async updateItem(itemId, data) {
    const item = await prisma.playlistItem.update({
      where: { id: itemId },
      data
    });

    return item;
  }

  async removeItem(itemId) {
    const item = await prisma.playlistItem.delete({
      where: { id: itemId }
    });

    // If this was from a song request, revert its status
    if (item.songRequestId) {
      await prisma.songRequest.update({
        where: { id: item.songRequestId },
        data: { status: 'PENDING' }
      });
    }

    // Reorder remaining items
    await this.reorderPlaylist(item.playlistId);

    return { message: 'Item removed successfully' };
  }

  async reorderItems(playlistId, itemOrders) {
    const updates = itemOrders.map(({ id, order }) =>
      prisma.playlistItem.update({
        where: { id },
        data: { order }
      })
    );

    await prisma.$transaction(updates);
    return { message: 'Playlist reordered successfully' };
  }

  async reorderPlaylist(playlistId) {
    const items = await prisma.playlistItem.findMany({
      where: { playlistId },
      orderBy: { order: 'asc' }
    });

    const updates = items.map((item, index) =>
      prisma.playlistItem.update({
        where: { id: item.id },
        data: { order: index + 1 }
      })
    );

    await prisma.$transaction(updates);
  }

  async markAsSung(itemId) {
    const item = await prisma.playlistItem.update({
      where: { id: itemId },
      data: {}
    });

    if (item.songRequestId) {
      await prisma.songRequest.update({
        where: { id: item.songRequestId },
        data: { status: 'SUNG' }
      });
    }

    return { message: 'Marked as sung' };
  }
}

module.exports = new PlaylistService();