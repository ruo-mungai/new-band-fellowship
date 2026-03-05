const { z } = require('zod');

const createSongRequestSchema = z.object({
  body: z.object({
    songTitle: z.string().min(1, 'Song title is required'),
    stanzaNumber: z.string().optional(),
    testimony: z.string().optional(),
    songId: z.string().cuid().optional()
  })
});

const updateRequestStatusSchema = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'SCHEDULED', 'SUNG', 'REJECTED']),
    scheduledDate: z.string().datetime().optional()
  }),
  params: z.object({
    requestId: z.string().cuid()
  })
});

const voteSchema = z.object({
  params: z.object({
    requestId: z.string().cuid()
  })
});

const createSongSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Song title is required'),
    artist: z.string().optional(),
    lyrics: z.string().optional(),
    youtubeUrl: z.string().url().optional(),
    isOriginal: z.boolean().optional()
  })
});

module.exports = {
  createSongRequestSchema,
  updateRequestStatusSchema,
  voteSchema,
  createSongSchema
};