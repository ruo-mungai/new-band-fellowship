const { z } = require('zod');

const createEventSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Event title is required'),
    description: z.string().optional(),
    eventDate: z.string().datetime('Invalid date format'),
    bannerImage: z.string().optional()
  })
});

const updateEventSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    eventDate: z.string().datetime().optional(),
    bannerImage: z.string().optional(),
    isActive: z.boolean().optional()
  }),
  params: z.object({
    id: z.string().cuid()
  })
});

const createRSVPSchema = z.object({
  body: z.object({
    numberOfGuests: z.number().min(1).max(10).default(1),
    notes: z.string().optional()
  }),
  params: z.object({
    eventId: z.string().cuid()
  })
});

const updateSessionSchema = z.object({
  body: z.object({
    type: z.enum(['FIRST_SESSION', 'SECOND_SESSION', 'REQUEST_TIME', 'TESTIMONY_TIME']).optional(),
    title: z.string().optional(),
    startTime: z.string().datetime().optional(),
    endTime: z.string().datetime().optional(),
    worshipLeader: z.string().optional(),
    notes: z.string().optional()
  }),
  params: z.object({
    sessionId: z.string().cuid()
  })
});

module.exports = {
  createEventSchema,
  updateEventSchema,
  createRSVPSchema,
  updateSessionSchema
};