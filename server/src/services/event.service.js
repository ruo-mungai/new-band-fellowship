const { PrismaClient } = require('@prisma/client');
const AppError = require('../utils/AppError');

const prisma = new PrismaClient();

class EventService {
  async createEvent(data) {
    const { title, description, eventDate, bannerImage } = data;

    // Check if event exists on this date
    const existing = await prisma.event.findUnique({
      where: { eventDate: new Date(eventDate) }
    });

    if (existing) {
      throw new AppError('An event already exists on this date', 400);
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        eventDate: new Date(eventDate),
        bannerImage
      }
    });

    // Create default sessions
    await this.createDefaultSessions(event.id, eventDate);

    return event;
  }

  async createDefaultSessions(eventId, eventDate) {
    const date = new Date(eventDate);
    
    const sessions = [
      {
        type: 'FIRST_SESSION',
        title: 'Opening Worship',
        startTime: new Date(date.setHours(14, 0, 0, 0)),
        endTime: new Date(date.setHours(15, 0, 0, 0)),
        order: 1,
        eventId
      },
      {
        type: 'REQUEST_TIME',
        title: 'Song Requests',
        startTime: new Date(date.setHours(15, 0, 0, 0)),
        endTime: new Date(date.setHours(15, 30, 0, 0)),
        order: 2,
        eventId
      },
      {
        type: 'SECOND_SESSION',
        title: 'Main Worship',
        startTime: new Date(date.setHours(15, 30, 0, 0)),
        endTime: new Date(date.setHours(16, 30, 0, 0)),
        order: 3,
        eventId
      },
      {
        type: 'TESTIMONY_TIME',
        title: 'Testimonies',
        startTime: new Date(date.setHours(16, 30, 0, 0)),
        endTime: new Date(date.setHours(17, 0, 0, 0)),
        order: 4,
        eventId
      }
    ];

    await prisma.session.createMany({
      data: sessions
    });

    // Create playlist
    await prisma.playlist.create({
      data: {
        eventId,
        isActive: true
      }
    });
  }

  async getAllEvents(includePast = false) {
    const now = new Date();
    const where = includePast ? {} : {
      eventDate: { gte: now }
    };

    const events = await prisma.event.findMany({
      where,
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

    return events;
  }

  async getEventById(id) {
    const event = await prisma.event.findUnique({
      where: { id },
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
            }
          }
        },
        rsvps: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });

    if (!event) {
      throw new AppError('Event not found', 404);
    }

    return event;
  }

  async updateEvent(id, data) {
    const event = await prisma.event.update({
      where: { id },
      data
    });

    return event;
  }

  async deleteEvent(id) {
    await prisma.event.delete({
      where: { id }
    });

    return { message: 'Event deleted successfully' };
  }

  // Session management
  async updateSession(sessionId, data) {
    const session = await prisma.session.update({
      where: { id: sessionId },
      data
    });

    return session;
  }

  async reorderSessions(eventId, sessionOrders) {
    const updates = sessionOrders.map(({ id, order }) =>
      prisma.session.update({
        where: { id },
        data: { order }
      })
    );

    await prisma.$transaction(updates);
    return { message: 'Sessions reordered successfully' };
  }

  // RSVP
  async createRSVP(userId, eventId, data) {
    const { numberOfGuests, notes } = data;

    const rsvp = await prisma.rsvp.upsert({
      where: {
        userId_eventId: {
          userId,
          eventId
        }
      },
      update: {
        numberOfGuests,
        notes,
        status: 'CONFIRMED'
      },
      create: {
        userId,
        eventId,
        numberOfGuests,
        notes
      }
    });

    return rsvp;
  }

  async cancelRSVP(userId, eventId) {
    await prisma.rsvp.delete({
      where: {
        userId_eventId: {
          userId,
          eventId
        }
      }
    });

    return { message: 'RSVP cancelled' };
  }
}

module.exports = new EventService();