const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5000;
const DATABASE_URL = process.env.DATABASE_URL;

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your-refresh-secret-key-change-this';

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// ==================== MIDDLEWARE ====================

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// ==================== AUTH MIDDLEWARE ====================

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  console.log('🔑 Auth header:', authHeader ? 'Present' : 'Missing');
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log('❌ JWT verification failed:', err.message);
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    console.log('✅ JWT verified for user ID:', user.id);
    req.user = user;
    next();
  });
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

const requireSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ message: 'Super admin access required' });
  }
  next();
};

// ==================== ROOT & TEST ENDPOINTS ====================

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'New Band Fellowship API',
    status: 'running',
    timestamp: new Date(),
    endpoints: [
      '/api/test',
      '/api/public/landing',
      '/api/public/events',
      '/api/public/gallery',
      '/api/public/blogs',
      '/api/public/blogs/:slug',
      '/api/public/playlist/upcoming',
      '/api/public/categories',
      '/api/public/tags',
      '/api/events',
      '/api/events/:id',
      '/api/blogs',
      '/api/blogs/:slug',
      '/api/gallery',
      '/api/songs/master',
      '/api/songs/:id',
      '/api/songs',
      '/api/songs/requests',
      '/api/playlists/:playlistId/songs/:songId',
      '/api/auth/register',
      '/api/auth/login',
      '/api/auth/me',
      '/api/auth/logout',
      '/api/auth/refresh-token',
      '/api/users/profile',
      '/api/users/song-requests',
      '/api/admin/dashboard',
      '/api/admin/users',
      '/api/admin/settings',
      '/api/admin/events',
      '/api/admin/gallery',
      '/api/admin/landing',
      '/api/admin/requests',
      '/api/admin/playlist/:eventId',
      '/api/admin/playlist/:eventId/items',
      '/api/admin/playlist/items/:itemId',
      '/api/admin/playlist/:eventId/reorder',
      '/api/admin/blogs',
      '/api/admin/comments',
      '/api/admin/banner',
      '/api/admin/sessions',
      '/api/admin/team',
      '/api/admin/super/admins',
      '/api/admin/super/logs'
    ]
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working!',
    timestamp: new Date(),
    cors: 'enabled'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// ==================== PUBLIC ROUTES ====================

// Public: Get landing page content
app.get('/api/public/landing', async (req, res) => {
  try {
    const hero = await prisma.landingContent.findUnique({ where: { section: 'hero' } });
    const about = await prisma.landingContent.findUnique({ where: { section: 'about' } });
    const mission = await prisma.landingContent.findUnique({ where: { section: 'mission' } });
    const vision = await prisma.landingContent.findUnique({ where: { section: 'vision' } });
    
    const settings = await prisma.systemSettings.findMany();
    const siteTitle = settings.find(s => s.key === 'siteTitle')?.value || 'New Band Fellowship';
    const logo = settings.find(s => s.key === 'logo')?.value || '';

    res.json({
      hero: hero || {
        title: 'Welcome to New Band Fellowship',
        subtitle: 'Experience the beauty of worship through Nyimbo cia Agendi',
        backgroundImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7',
        buttonText: 'Join Us This Sunday',
        buttonLink: '/events',
      },
      about: about || {
        title: 'About New Band Fellowship',
        content: 'We are a community of believers dedicated to preserving and celebrating the rich heritage of Kikuyu gospel music.',
        imageUrl: 'https://images.unsplash.com/photo-1524863479829-916d8e77f114',
      },
      mission: mission || {
        title: 'Our Mission',
        content: 'To preserve and promote the rich heritage of Kikuyu gospel music.',
      },
      vision: vision || {
        title: 'Our Vision',
        content: 'A community where traditional gospel music bridges generations.',
      },
      siteTitle,
      logo,
    });
  } catch (error) {
    console.error('Error fetching landing content:', error);
    res.status(500).json({ message: 'Failed to fetch landing content' });
  }
});

// Public: Get events
app.get('/api/public/events', async (req, res) => {
  try {
    console.log('📡 GET /api/public/events - Fetching events');
    const { upcoming, past, limit = 10, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let where = {};
    const now = new Date();
    
    if (upcoming === 'true') {
      where.eventDate = { gt: now };
    } else if (past === 'true') {
      where.eventDate = { lt: now };
    }
    
    const events = await prisma.event.findMany({
      where,
      include: {
        rsvps: true,
        sessions: true,
      },
      orderBy: { eventDate: 'asc' },
      skip,
      take: parseInt(limit),
    });

    const total = await prisma.event.count({ where });

    console.log(`✅ Found ${events.length} events`);
    
    res.json({
      items: events.map(event => ({
        ...event,
        attendees: event.rsvps?.length || 0
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('❌ Error fetching events:', error);
    res.status(500).json({ message: 'Failed to fetch events' });
  }
});

// Public: Get single event by ID
app.get('/api/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📡 GET /api/events/${id} - Fetching event details`);
    
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        sessions: {
          orderBy: { order: 'asc' }
        },
        playlist: {
          include: {
            items: {
              include: {
                song: true,
                session: true,
              },
              orderBy: { order: 'asc' }
            }
          }
        },
        rsvps: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profileImage: true
              }
            }
          }
        }
      }
    });
    
    if (!event) {
      console.log(`❌ Event not found: ${id}`);
      return res.status(404).json({ message: 'Event not found' });
    }
    
    console.log(`✅ Event found: ${event.title}`);
    res.json({
      ...event,
      attendees: event.rsvps?.length || 0
    });
  } catch (error) {
    console.error('❌ Error fetching event:', error);
    res.status(500).json({ message: 'Failed to fetch event' });
  }
});

// Get all events (alternative endpoint without /public)
app.get('/api/events', async (req, res) => {
  try {
    console.log('📡 GET /api/events - Fetching events');
    const { upcoming, past, limit = 10, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let where = {};
    const now = new Date();
    
    if (upcoming === 'true') {
      where.eventDate = { gt: now };
    } else if (past === 'true') {
      where.eventDate = { lt: now };
    }
    
    const events = await prisma.event.findMany({
      where,
      include: {
        rsvps: true,
        sessions: true,
      },
      orderBy: { eventDate: 'asc' },
      skip,
      take: parseInt(limit),
    });

    const total = await prisma.event.count({ where });

    res.json({
      items: events.map(event => ({
        ...event,
        attendees: event.rsvps?.length || 0
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Failed to fetch events' });
  }
});

// RSVP to event (requires authentication)
app.post('/api/events/:id/rsvp', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { numberOfGuests = 1, notes } = req.body;
    
    console.log(`📝 POST /api/events/${id}/rsvp - User ${req.user.id} RSVPing`);
    
    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id }
    });
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if user already RSVPed
    const existingRSVP = await prisma.rSVP.findUnique({
      where: {
        userId_eventId: {
          userId: req.user.id,
          eventId: id
        }
      }
    });
    
    if (existingRSVP) {
      return res.status(400).json({ message: 'Already RSVPed to this event' });
    }
    
    // Create RSVP
    const rsvp = await prisma.rSVP.create({
      data: {
        userId: req.user.id,
        eventId: id,
        numberOfGuests,
        notes,
        status: 'CONFIRMED'
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true
          }
        }
      }
    });
    
    console.log(`✅ RSVP created for event ${id}`);
    res.status(201).json(rsvp);
  } catch (error) {
    console.error('❌ Error creating RSVP:', error);
    res.status(500).json({ message: 'Failed to create RSVP' });
  }
});

// Cancel RSVP (requires authentication)
app.delete('/api/events/:id/rsvp', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`📝 DELETE /api/events/${id}/rsvp - User ${req.user.id} cancelling RSVP`);
    
    await prisma.rSVP.delete({
      where: {
        userId_eventId: {
          userId: req.user.id,
          eventId: id
        }
      }
    });
    
    console.log(`✅ RSVP cancelled for event ${id}`);
    res.json({ message: 'RSVP cancelled successfully' });
  } catch (error) {
    console.error('❌ Error cancelling RSVP:', error);
    res.status(500).json({ message: 'Failed to cancel RSVP' });
  }
});

// Public: Get gallery images
app.get('/api/public/gallery', async (req, res) => {
  try {
    const images = await prisma.gallery.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });
    res.json(images);
  } catch (error) {
    console.error('Error fetching gallery:', error);
    res.status(500).json({ message: 'Failed to fetch gallery' });
  }
});

// Public: Get blog posts
app.get('/api/public/blogs', async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let where = { isPublished: true };
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    const posts = await prisma.blogPost.findMany({
      where,
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, profileImage: true }
        },
        categories: true,
        tags: true,
        _count: {
          select: { comments: true }
        }
      },
      orderBy: { publishedAt: 'desc' },
      skip,
      take: parseInt(limit),
    });

    const total = await prisma.blogPost.count({ where });

    res.json({
      items: posts.map(post => ({
        ...post,
        commentsCount: post._count.comments,
        _count: undefined
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ message: 'Failed to fetch blogs' });
  }
});

// Public: Get single blog post by slug
app.get('/api/public/blogs/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, profileImage: true, bio: true }
        },
        categories: true,
        tags: true,
        comments: {
          where: { isApproved: true },
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, profileImage: true }
            },
            replies: {
              include: {
                user: {
                  select: { id: true, firstName: true, lastName: true, profileImage: true }
                }
              }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    // Increment view count
    await prisma.blogPost.update({
      where: { id: post.id },
      data: { views: { increment: 1 } }
    });

    res.json(post);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ message: 'Failed to fetch blog post' });
  }
});

// Public: Get upcoming playlist
app.get('/api/public/playlist/upcoming', async (req, res) => {
  try {
    const nextEvent = await prisma.event.findFirst({
      where: {
        eventDate: { gt: new Date() },
      },
      include: {
        playlist: {
          include: {
            items: {
              include: {
                song: true,
                session: true,
              },
              orderBy: { order: 'asc' }
            }
          }
        }
      },
      orderBy: { eventDate: 'asc' }
    });

    if (!nextEvent || !nextEvent.playlist) {
      return res.status(404).json({ message: 'No upcoming playlist found' });
    }

    res.json({
      id: nextEvent.playlist.id,
      eventId: nextEvent.id,
      eventTitle: nextEvent.title,
      eventDate: nextEvent.eventDate,
      items: nextEvent.playlist.items,
    });
  } catch (error) {
    console.error('Error fetching upcoming playlist:', error);
    res.status(500).json({ message: 'Failed to fetch upcoming playlist' });
  }
});

// Public: Get categories
app.get('/api/public/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
});

// Public: Get tags
app.get('/api/public/tags', async (req, res) => {
  try {
    const tags = await prisma.tag.findMany();
    res.json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ message: 'Failed to fetch tags' });
  }
});

// Public: Get team members
app.get('/api/public/team', async (req, res) => {
  try {
    const team = await prisma.teamMember.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });
    res.json(team);
  } catch (error) {
    console.error('Error fetching team:', error);
    res.status(500).json({ message: 'Failed to fetch team' });
  }
});

// Public settings endpoint
app.get('/api/public/settings', async (req, res) => {
  try {
    const settings = await prisma.systemSettings.findMany();
    
    const settingsObj = {};
    settings.forEach(s => {
      settingsObj[s.key] = s.type === 'number' ? parseFloat(s.value) : 
                          s.type === 'boolean' ? s.value === 'true' : s.value;
    });
    
    // Return only public settings
    res.json({
      enableDonations: settingsObj.enableDonations || false,
      siteName: settingsObj.siteName || 'New Band Fellowship',
      siteDescription: settingsObj.siteDescription || '',
    });
  } catch (error) {
    console.error('Error fetching public settings:', error);
    res.status(500).json({ message: 'Failed to fetch settings' });
  }
});

// ==================== AUTH ROUTES ====================

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;
    
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        role: 'USER',
        isApproved: false,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isApproved: true,
      }
    });
    
    res.status(201).json({ 
      message: 'Registration successful. Please wait for approval.',
      user 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    if (user.isBanned) {
      return res.status(403).json({ message: 'Account is banned' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '15m' }
    );
    
    const refreshToken = jwt.sign(
      { id: user.id },
      REFRESH_SECRET,
      { expiresIn: '7d' }
    );
    
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken }
    });
    
    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        isApproved: user.isApproved,
        profileImage: user.profileImage,
        bio: user.bio,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

// Get current user
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    console.log('📡 GET /api/auth/me - User ID:', req.user.id);
    
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isApproved: true,
        isBanned: true,
        profileImage: true,
        bio: true,
        createdAt: true,
      }
    });
    
    if (!user) {
      console.log('❌ User not found:', req.user.id);
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.isBanned) {
      console.log('❌ User is banned:', user.email);
      return res.status(403).json({ message: 'Account is banned' });
    }
    
    console.log('✅ Returning user data for:', user.email);
    res.json(user);
  } catch (error) {
    console.error('❌ Error in /api/auth/me:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Logout
app.post('/api/auth/logout', authenticateToken, async (req, res) => {
  try {
    await prisma.user.update({
      where: { id: req.user.id },
      data: { refreshToken: null }
    });
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Logout failed' });
  }
});

// Refresh token
app.post('/api/auth/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }
    
    const user = await prisma.user.findFirst({
      where: { refreshToken }
    });
    
    if (!user) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }
    
    jwt.verify(refreshToken, REFRESH_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid refresh token' });
      }
      
      const accessToken = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '15m' }
      );
      
      res.json({ accessToken });
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ message: 'Token refresh failed' });
  }
});

// ==================== USER ROUTES ====================

// Get user profile
app.get('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isApproved: true,
        profileImage: true,
        bio: true,
        createdAt: true,
      }
    });
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

// Update user profile
app.patch('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, phone, bio } = req.body;
    
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { firstName, lastName, phone, bio },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isApproved: true,
        profileImage: true,
        bio: true,
      }
    });
    
    res.json(user);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

// Upload profile image
app.post('/api/users/profile/image', authenticateToken, upload.single('profileImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const imageUrl = `/uploads/${req.file.filename}`;
    
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { profileImage: imageUrl },
      select: { profileImage: true }
    });
    
    res.json({ profileImage: user.profileImage });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Failed to upload image' });
  }
});

// Get user's song requests
app.get('/api/users/song-requests', authenticateToken, async (req, res) => {
  try {
    const requests = await prisma.songRequest.findMany({
      where: { userId: req.user.id },
      include: {
        song: true,
        votes: true,
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(requests.map(req => ({
      ...req,
      voteCount: req.votes.length,
    })));
  } catch (error) {
    console.error('Error fetching user requests:', error);
    res.status(500).json({ message: 'Failed to fetch requests' });
  }
});

// ==================== SONG ROUTES ====================

// Get all songs with pagination
app.get('/api/songs/master', async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let where = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { artist: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    const songs = await prisma.song.findMany({
      where,
      orderBy: { title: 'asc' },
      skip,
      take: parseInt(limit),
    });

    const total = await prisma.song.count({ where });

    res.json({
      items: songs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching songs:', error);
    res.status(500).json({ message: 'Failed to fetch songs' });
  }
});

// Get single song by ID
app.get('/api/songs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📡 GET /api/songs/${id} - Fetching song details`);
    
    const song = await prisma.song.findUnique({
      where: { id },
      include: {
        requests: {
          select: {
            id: true,
            status: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        _count: {
          select: { requests: true }
        }
      }
    });
    
    if (!song) {
      console.log(`❌ Song not found: ${id}`);
      return res.status(404).json({ message: 'Song not found' });
    }
    
    console.log(`✅ Song found: ${song.title}`);
    res.json({
      ...song,
      requestCount: song._count.requests,
    });
  } catch (error) {
    console.error('❌ Error fetching song:', error);
    res.status(500).json({ message: 'Failed to fetch song' });
  }
});

// Create new song (admin only)
app.post('/api/songs', authenticateToken, requireAdmin, async (req, res) => {
  try {
    console.log('📝 Creating new song:', req.body);
    
    const { title, artist, lyrics, youtubeUrl, isOriginal } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: 'Song title is required' });
    }
    
    const song = await prisma.song.create({
      data: {
        title,
        artist: artist || null,
        lyrics: lyrics || null,
        youtubeUrl: youtubeUrl || null,
        isOriginal: isOriginal || false,
      },
    });
    
    console.log(`✅ Song created: ${song.id}`);
    res.status(201).json(song);
  } catch (error) {
    console.error('❌ Error creating song:', error);
    res.status(500).json({ message: 'Failed to create song' });
  }
});

// Update song (admin only)
app.patch('/api/songs/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    console.log(`📝 Updating song ${id}:`, updates);
    
    const song = await prisma.song.update({
      where: { id },
      data: updates,
    });
    
    console.log(`✅ Song ${id} updated`);
    res.json(song);
  } catch (error) {
    console.error('❌ Error updating song:', error);
    res.status(500).json({ message: 'Failed to update song' });
  }
});

// Delete song (admin only)
app.delete('/api/songs/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`📝 Deleting song ${id}`);
    
    // Check if song is used in any playlists
    const playlistItems = await prisma.playlistItem.count({
      where: { songId: id }
    });
    
    if (playlistItems > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete song because it is used in playlists. Remove it from playlists first.' 
      });
    }
    
    await prisma.song.delete({ where: { id } });
    
    console.log(`✅ Song ${id} deleted`);
    res.json({ message: 'Song deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting song:', error);
    res.status(500).json({ message: 'Failed to delete song' });
  }
});

// Get all song requests - WITH USER FILTERING FIXED
app.get('/api/songs/requests', authenticateToken, async (req, res) => {
  try {
    const { status, page = 1, limit = 10, userId } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    console.log('📡 GET /api/songs/requests - Query params:', { 
      status, 
      page, 
      limit, 
      userId,
      authenticatedUser: req.user?.id 
    });
    
    let where = {};
    
    // Filter by status if provided
    if (status) {
      where.status = status;
    }
    
    // Filter by userId if provided
    if (userId) {
      if (userId === 'current') {
        // Use the authenticated user's ID from the token
        where.userId = req.user.id;
        console.log('📡 Filtering by current user ID:', req.user.id);
      } else {
        where.userId = userId;
      }
    }
    
    console.log('📡 Where clause:', where);
    
    const requests = await prisma.songRequest.findMany({
      where,
      include: {
        user: {
          select: { 
            id: true, 
            firstName: true, 
            lastName: true,
            email: true,
            profileImage: true
          }
        },
        song: true,
        votes: {
          include: {
            user: {
              select: { 
                id: true, 
                firstName: true, 
                lastName: true 
              }
            }
          }
        },
        _count: {
          select: { votes: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: parseInt(limit),
    });

    const total = await prisma.songRequest.count({ where });

    console.log(`✅ Found ${requests.length} song requests (total: ${total})`);

    // Format the response to include vote count
    const formattedRequests = requests.map(req => ({
      ...req,
      voteCount: req._count.votes,
      _count: undefined,
      // Ensure votes array is included
      votes: req.votes || []
    }));

    res.json({
      items: formattedRequests,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('❌ Error fetching song requests:', error);
    console.error('❌ Error details:', error.message);
    res.status(500).json({ 
      message: 'Failed to fetch song requests',
      error: error.message 
    });
  }
});

// Create song request - FIXED
app.post('/api/songs/requests', authenticateToken, async (req, res) => {
  try {
    console.log('📝 Creating song request with data:', req.body);
    
    const { songTitle, stanzaNumber, testimony, songId } = req.body;
    
    // Validate required fields
    if (!songTitle) {
      return res.status(400).json({ message: 'Song title is required' });
    }
    
    // Prepare the data for creation
    const requestData = {
      songTitle,
      stanzaNumber: stanzaNumber || null,
      testimony: testimony || null,
      userId: req.user.id,
      status: 'PENDING',
    };
    
    // If songId is provided, add it directly
    if (songId) {
      // Verify the song exists
      const song = await prisma.song.findUnique({
        where: { id: songId }
      });
      
      if (song) {
        requestData.songId = songId;
      }
    }
    
    console.log('📝 Creating with data:', requestData);
    
    const request = await prisma.songRequest.create({
      data: requestData,
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true }
        },
        song: true,
      }
    });
    
    // If song exists, increment its request count
    if (songId) {
      try {
        await prisma.song.update({
          where: { id: songId },
          data: { requestCount: { increment: 1 } }
        });
      } catch (err) {
        console.log('⚠️ Could not increment song count:', err.message);
      }
    }
    
    console.log('✅ Song request created:', request.id);
    res.status(201).json({
      ...request,
      voteCount: 0,
    });
  } catch (error) {
    console.error('❌ Error creating song request:', error);
    console.error('❌ Error details:', error.message);
    res.status(500).json({ 
      message: 'Failed to create song request',
      error: error.message 
    });
  }
});

// Vote on song request
app.post('/api/songs/requests/:id/vote', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`📝 Voting on request ${id} by user ${req.user.id}`);
    
    // Check if user already voted
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_requestId: {
          userId: req.user.id,
          requestId: id
        }
      }
    });
    
    if (existingVote) {
      // Remove vote
      await prisma.vote.delete({
        where: {
          userId_requestId: {
            userId: req.user.id,
            requestId: id
          }
        }
      });
      console.log('✅ Vote removed');
    } else {
      // Add vote
      await prisma.vote.create({
        data: {
          userId: req.user.id,
          requestId: id
        }
      });
      console.log('✅ Vote added');
    }
    
    // Get updated request
    const request = await prisma.songRequest.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true }
        },
        song: true,
        votes: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true }
            }
          }
        },
        _count: {
          select: { votes: true }
        }
      }
    });
    
    res.json({
      ...request,
      voteCount: request._count.votes,
      _count: undefined
    });
  } catch (error) {
    console.error('❌ Error voting on request:', error);
    res.status(500).json({ message: 'Failed to vote' });
  }
});

// Get playlist item details
app.get('/api/playlists/:playlistId/songs/:songId', async (req, res) => {
  try {
    const { playlistId, songId } = req.params;
    
    const playlistItem = await prisma.playlistItem.findFirst({
      where: {
        playlistId,
        songId,
      },
      include: {
        session: true,
        playlist: {
          include: {
            event: true,
          }
        }
      }
    });
    
    if (!playlistItem) {
      return res.status(404).json({ message: 'Playlist item not found' });
    }
    
    res.json(playlistItem);
  } catch (error) {
    console.error('Error fetching playlist item:', error);
    res.status(500).json({ message: 'Failed to fetch playlist item' });
  }
});

// ==================== ADMIN ROUTES ====================

// Get dashboard statistics
app.get('/api/admin/dashboard', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const pendingUsers = await prisma.user.count({ where: { isApproved: false } });
    const totalEvents = await prisma.event.count();
    const upcomingEvents = await prisma.event.count({
      where: { eventDate: { gt: new Date() } }
    });
    const totalRequests = await prisma.songRequest.count();
    const pendingRequests = await prisma.songRequest.count({
      where: { status: 'PENDING' }
    });
    const totalBlogs = await prisma.blogPost.count();
    const totalComments = await prisma.comment.count();
    const totalSongs = await prisma.song.count();
    
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      }
    });
    
    const recentRequests = await prisma.songRequest.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    });
    
    const recentActivity = [
      ...recentUsers.map(u => ({
        description: `New user registered: ${u.firstName} ${u.lastName}`,
        timestamp: u.createdAt,
        type: 'info',
        action: 'REGISTER'
      })),
      ...recentRequests.map(r => ({
        description: `${r.user?.firstName || 'Someone'} requested "${r.songTitle}"`,
        timestamp: r.createdAt,
        type: 'success',
        action: 'REQUEST'
      }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10);
    
    res.json({
      stats: {
        totalUsers,
        pendingUsers,
        totalEvents,
        upcomingEvents,
        totalRequests,
        pendingRequests,
        totalBlogs,
        totalComments,
        totalSongs,
      },
      recentActivity
    });
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard' });
  }
});

// Get all users (admin)
app.get('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let where = {};
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: parseInt(limit),
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isApproved: true,
        isBanned: true,
        profileImage: true,
        createdAt: true,
      }
    });
    
    const total = await prisma.user.count({ where });
    
    res.json({
      items: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// Get single user (admin)
app.get('/api/admin/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isApproved: true,
        isBanned: true,
        profileImage: true,
        bio: true,
        createdAt: true,
      }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

// Approve user
app.patch('/api/admin/users/:id/approve', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await prisma.user.update({
      where: { id },
      data: { isApproved: true },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isApproved: true,
      }
    });
    
    res.json(user);
  } catch (error) {
    console.error('Error approving user:', error);
    res.status(500).json({ message: 'Failed to approve user' });
  }
});

// Ban user
app.patch('/api/admin/users/:id/ban', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await prisma.user.update({
      where: { id },
      data: { isBanned: true },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isBanned: true,
      }
    });
    
    res.json(user);
  } catch (error) {
    console.error('Error banning user:', error);
    res.status(500).json({ message: 'Failed to ban user' });
  }
});

// Unban user
app.patch('/api/admin/users/:id/unban', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await prisma.user.update({
      where: { id },
      data: { isBanned: false },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isBanned: true,
      }
    });
    
    res.json(user);
  } catch (error) {
    console.error('Error unbanning user:', error);
    res.status(500).json({ message: 'Failed to unban user' });
  }
});

// Change user role
app.patch('/api/admin/users/:id/role', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if (!['USER', 'ADMIN', 'SUPER_ADMIN'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      }
    });
    
    res.json(user);
  } catch (error) {
    console.error('Error changing user role:', error);
    res.status(500).json({ message: 'Failed to change user role' });
  }
});

// Delete user
app.delete('/api/admin/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.user.delete({ where: { id } });
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

// Get system settings
app.get('/api/admin/settings', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const settings = await prisma.systemSettings.findMany();
    
    const settingsObj = {};
    settings.forEach(s => {
      settingsObj[s.key] = s.type === 'number' ? parseFloat(s.value) : 
                          s.type === 'boolean' ? s.value === 'true' : s.value;
    });
    
    res.json(settingsObj);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Failed to fetch settings' });
  }
});

// Update system settings
app.patch('/api/admin/settings', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const settings = req.body;
    
    const updates = Object.entries(settings).map(([key, value]) => {
      let type = typeof value;
      if (type === 'number') type = 'number';
      if (type === 'boolean') type = 'boolean';
      
      return prisma.systemSettings.upsert({
        where: { key },
        update: { value: String(value), type },
        create: {
          key,
          value: String(value),
          type,
        },
      });
    });
    
    await Promise.all(updates);
    
    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Failed to update settings' });
  }
});

// Admin: Get all events (with filters)
app.get('/api/admin/events', authenticateToken, requireAdmin, async (req, res) => {
  try {
    console.log('📡 GET /api/admin/events - Fetching events for admin');
    const { page = 1, limit = 10, upcoming, past } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let where = {};
    const now = new Date();
    
    if (upcoming === 'true') {
      where.eventDate = { gt: now };
    } else if (past === 'true') {
      where.eventDate = { lt: now };
    }
    
    const events = await prisma.event.findMany({
      where,
      include: {
        rsvps: true,
        sessions: {
          orderBy: { order: 'asc' }
        },
        _count: {
          select: { rsvps: true }
        }
      },
      orderBy: { eventDate: 'asc' },
      skip,
      take: parseInt(limit),
    });

    const total = await prisma.event.count({ where });

    console.log(`✅ Found ${events.length} events for admin`);

    res.json({
      items: events.map(event => ({
        ...event,
        attendees: event.rsvps?.length || 0,
        rsvpCount: event._count?.rsvps || 0
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('❌ Error fetching admin events:', error);
    res.status(500).json({ message: 'Failed to fetch events' });
  }
});

// Admin: Create event
app.post('/api/admin/events', authenticateToken, requireAdmin, async (req, res) => {
  try {
    console.log('📝 Creating new event:', req.body);
    
    const { title, description, eventDate, location, bannerImage, maxAttendees } = req.body;
    
    if (!title || !description || !eventDate || !location) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const event = await prisma.event.create({
      data: {
        title,
        description,
        eventDate: new Date(eventDate),
        location,
        bannerImage: bannerImage || null,
        maxAttendees: maxAttendees ? parseInt(maxAttendees) : null,
        isActive: true,
      }
    });
    
    console.log(`✅ Event created: ${event.id}`);
    res.status(201).json(event);
  } catch (error) {
    console.error('❌ Error creating event:', error);
    res.status(500).json({ message: 'Failed to create event' });
  }
});

// Admin: Get single event
app.get('/api/admin/events/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📡 GET /api/admin/events/${id} - Fetching event for admin`);
    
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        rsvps: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profileImage: true
              }
            }
          }
        },
        sessions: {
          orderBy: { order: 'asc' }
        },
        playlist: {
          include: {
            items: {
              include: {
                song: true,
                session: true,
              },
              orderBy: { order: 'asc' }
            }
          }
        }
      }
    });
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json({
      ...event,
      attendees: event.rsvps?.length || 0
    });
  } catch (error) {
    console.error('❌ Error fetching event:', error);
    res.status(500).json({ message: 'Failed to fetch event' });
  }
});

// Admin: Update event
app.patch('/api/admin/events/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    console.log(`📝 Updating event ${id}:`, updates);
    
    if (updates.eventDate) {
      updates.eventDate = new Date(updates.eventDate);
    }
    
    const event = await prisma.event.update({
      where: { id },
      data: updates,
    });
    
    console.log(`✅ Event ${id} updated`);
    res.json(event);
  } catch (error) {
    console.error('❌ Error updating event:', error);
    res.status(500).json({ message: 'Failed to update event' });
  }
});

// Admin: Delete event
app.delete('/api/admin/events/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`📝 Deleting event ${id}`);
    
    await prisma.event.delete({ where: { id } });
    
    console.log(`✅ Event ${id} deleted`);
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting event:', error);
    res.status(500).json({ message: 'Failed to delete event' });
  }
});

// Get all gallery images (admin)
app.get('/api/admin/gallery', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const images = await prisma.gallery.findMany({
      orderBy: { order: 'asc' }
    });
    res.json(images);
  } catch (error) {
    console.error('Error fetching gallery:', error);
    res.status(500).json({ message: 'Failed to fetch gallery' });
  }
});

// Add gallery image
app.post('/api/admin/gallery', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, description, imageUrl } = req.body;
    
    if (!title || !imageUrl) {
      return res.status(400).json({ message: 'Title and image URL are required' });
    }
    
    const lastImage = await prisma.gallery.findFirst({
      orderBy: { order: 'desc' }
    });
    
    const image = await prisma.gallery.create({
      data: {
        title,
        description: description || '',
        imageUrl,
        order: (lastImage?.order || 0) + 1,
        isActive: true,
      }
    });
    
    res.status(201).json(image);
  } catch (error) {
    console.error('Error adding gallery image:', error);
    res.status(500).json({ message: 'Failed to add gallery image' });
  }
});

// Update gallery image
app.patch('/api/admin/gallery/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, imageUrl } = req.body;
    
    const image = await prisma.gallery.update({
      where: { id },
      data: { title, description, imageUrl }
    });
    
    res.json(image);
  } catch (error) {
    console.error('Error updating gallery image:', error);
    res.status(500).json({ message: 'Failed to update gallery image' });
  }
});

// Delete gallery image
app.delete('/api/admin/gallery/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.gallery.delete({ where: { id } });
    
    res.json({ message: 'Gallery image deleted successfully' });
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    res.status(500).json({ message: 'Failed to delete gallery image' });
  }
});

// Reorder gallery
app.post('/api/admin/gallery/reorder', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { items } = req.body;
    
    const updates = items.map((item, index) => 
      prisma.gallery.update({
        where: { id: item.id },
        data: { order: index + 1 }
      })
    );
    
    await Promise.all(updates);
    
    res.json({ message: 'Gallery reordered successfully' });
  } catch (error) {
    console.error('Error reordering gallery:', error);
    res.status(500).json({ message: 'Failed to reorder gallery' });
  }
});

// Get landing content for editing
app.get('/api/admin/landing', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const sections = await prisma.landingContent.findMany();
    
    const content = {};
    sections.forEach(s => {
      content[s.section] = {
        title: s.title || '',
        subtitle: s.subtitle || '',
        content: s.content || '',
        imageUrl: s.imageUrl || '',
        buttonText: s.buttonText || '',
        buttonLink: s.buttonLink || '',
      };
    });
    
    const settings = await prisma.systemSettings.findMany();
    const siteTitle = settings.find(s => s.key === 'siteTitle')?.value || 'New Band Fellowship';
    const logo = settings.find(s => s.key === 'logo')?.value || '';
    
    res.json({
      hero: content.hero || { title: '', subtitle: '', content: '', imageUrl: '', buttonText: '', buttonLink: '' },
      about: content.about || { title: '', content: '', imageUrl: '' },
      mission: content.mission || { title: '', content: '' },
      vision: content.vision || { title: '', content: '' },
      siteTitle,
      logo,
    });
  } catch (error) {
    console.error('Error fetching landing content:', error);
    res.status(500).json({ message: 'Failed to fetch landing content' });
  }
});

// Update landing section
app.patch('/api/admin/landing/:section', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { section } = req.params;
    const data = req.body;
    
    const content = await prisma.landingContent.upsert({
      where: { section },
      update: data,
      create: {
        section,
        ...data,
      },
    });
    
    res.json(content);
  } catch (error) {
    console.error(`Error updating ${section} section:`, error);
    res.status(500).json({ message: `Failed to update ${section} section` });
  }
});

// Upload landing image
app.post('/api/admin/landing/images', authenticateToken, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ url: imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Failed to upload image' });
  }
});

// Get all song requests (admin)
app.get('/api/admin/requests', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let where = {};
    if (status) {
      where.status = status;
    }
    
    const requests = await prisma.songRequest.findMany({
      where,
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true }
        },
        song: true,
        votes: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true }
            }
          }
        },
        _count: {
          select: { votes: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: parseInt(limit),
    });

    const total = await prisma.songRequest.count({ where });

    res.json({
      items: requests.map(req => ({
        ...req,
        voteCount: req._count.votes,
        _count: undefined,
        votes: undefined
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching song requests:', error);
    res.status(500).json({ message: 'Failed to fetch song requests' });
  }
});

// Update song request status (admin)
app.patch('/api/admin/requests/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, scheduledDate } = req.body;
    
    const request = await prisma.songRequest.update({
      where: { id },
      data: {
        status,
        scheduledDate: scheduledDate ? new Date(scheduledDate) : undefined,
      },
      include: {
        user: true,
        song: true,
      }
    });
    
    res.json(request);
  } catch (error) {
    console.error('Error updating song request:', error);
    res.status(500).json({ message: 'Failed to update song request' });
  }
});

// Delete song request (admin)
app.delete('/api/admin/requests/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.songRequest.delete({ where: { id } });
    
    res.json({ message: 'Song request deleted successfully' });
  } catch (error) {
    console.error('Error deleting song request:', error);
    res.status(500).json({ message: 'Failed to delete song request' });
  }
});

// ==================== PLAYLIST MANAGEMENT ROUTES ====================

// Get playlist for event
app.get('/api/admin/playlist/:eventId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { eventId } = req.params;
    console.log(`📡 GET /api/admin/playlist/${eventId} - Fetching playlist`);
    
    const playlist = await prisma.playlist.findUnique({
      where: { eventId },
      include: {
        items: {
          include: {
            song: true,
            session: true,
          },
          orderBy: { order: 'asc' }
        }
      }
    });
    
    const sessions = await prisma.session.findMany({
      where: { eventId },
      orderBy: { order: 'asc' }
    });
    
    console.log(`✅ Playlist found:`, playlist ? 'yes' : 'no');
    
    res.json({
      ...playlist,
      sessions,
      items: playlist?.items || []
    });
  } catch (error) {
    console.error('❌ Error fetching playlist:', error);
    res.status(500).json({ 
      message: 'Failed to fetch playlist',
      error: error.message 
    });
  }
});

// Update playlist
app.patch('/api/admin/playlist/:eventId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { eventId } = req.params;
    const { flowNotes } = req.body;
    
    console.log(`📝 Updating playlist for event ${eventId}`);
    
    const playlist = await prisma.playlist.upsert({
      where: { eventId },
      update: { flowNotes },
      create: {
        eventId,
        flowNotes,
        isActive: true,
      }
    });
    
    console.log(`✅ Playlist updated`);
    res.json(playlist);
  } catch (error) {
    console.error('❌ Error updating playlist:', error);
    res.status(500).json({ 
      message: 'Failed to update playlist',
      error: error.message 
    });
  }
});

// Add song to playlist - with auto-order
app.post('/api/admin/playlist/:eventId/items', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { eventId } = req.params;
    const { songId, sessionId, backgroundImage, backgroundColor, notes } = req.body;
    
    console.log(`📝 Adding song to playlist for event ${eventId}:`, req.body);
    
    // Validate required fields
    if (!songId) {
      return res.status(400).json({ message: 'Song ID is required' });
    }
    
    // Get or create playlist
    let playlist = await prisma.playlist.findUnique({ 
      where: { eventId } 
    });
    
    if (!playlist) {
      playlist = await prisma.playlist.create({
        data: { 
          eventId, 
          isActive: true 
        }
      });
      console.log(`✅ Created new playlist for event ${eventId}`);
    }
    
    // Get the highest order number currently in the playlist
    const highestOrderItem = await prisma.playlistItem.findFirst({
      where: { playlistId: playlist.id },
      orderBy: { order: 'desc' }
    });
    
    const nextOrder = highestOrderItem ? highestOrderItem.order + 1 : 1;
    console.log(`📊 Next available order: ${nextOrder}`);
    
    // Create the playlist item with the next available order
    const item = await prisma.playlistItem.create({
      data: {
        playlistId: playlist.id,
        songId,
        sessionId: sessionId || null,
        order: nextOrder,
        backgroundImage: backgroundImage || null,
        backgroundColor: backgroundColor || '#f97316',
        notes: notes || null,
      },
      include: {
        song: true,
        session: true,
      }
    });
    
    console.log(`✅ Song added to playlist with order ${nextOrder}`);
    res.status(201).json(item);
  } catch (error) {
    console.error('❌ Error adding song to playlist:', error);
    
    // Handle unique constraint error specifically
    if (error.code === 'P2002') {
      return res.status(400).json({ 
        message: 'Order conflict. Please try again.',
        error: 'The selected order number is already taken.'
      });
    }
    
    res.status(500).json({ 
      message: 'Failed to add song to playlist',
      error: error.message 
    });
  }
});

// Update playlist item
app.patch('/api/admin/playlist/items/:itemId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { itemId } = req.params;
    const updates = req.body;
    
    console.log(`📝 Updating playlist item ${itemId}:`, updates);
    
    // If order is being updated, check if it's already taken
    if (updates.order) {
      const item = await prisma.playlistItem.findUnique({
        where: { id: itemId },
        select: { playlistId: true }
      });
      
      if (item) {
        const existingItem = await prisma.playlistItem.findFirst({
          where: {
            playlistId: item.playlistId,
            order: parseInt(updates.order),
            NOT: { id: itemId }
          }
        });
        
        if (existingItem) {
          return res.status(400).json({ 
            message: 'Order number already taken in this playlist',
            error: 'Please choose a different order number'
          });
        }
      }
      
      updates.order = parseInt(updates.order);
    }
    
    // Remove undefined values
    Object.keys(updates).forEach(key => 
      updates[key] === undefined && delete updates[key]
    );
    
    const updatedItem = await prisma.playlistItem.update({
      where: { id: itemId },
      data: updates,
      include: {
        song: true,
        session: true,
      }
    });
    
    console.log(`✅ Playlist item ${itemId} updated`);
    res.json(updatedItem);
  } catch (error) {
    console.error('❌ Error updating playlist item:', error);
    
    if (error.code === 'P2002') {
      return res.status(400).json({ 
        message: 'Order number already taken',
        error: 'Please choose a different order number'
      });
    }
    
    res.status(500).json({ 
      message: 'Failed to update playlist item',
      error: error.message 
    });
  }
});

// Delete playlist item
app.delete('/api/admin/playlist/items/:itemId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { itemId } = req.params;
    
    console.log(`📝 Deleting playlist item ${itemId}`);
    
    await prisma.playlistItem.delete({ 
      where: { id: itemId } 
    });
    
    console.log(`✅ Playlist item ${itemId} deleted`);
    res.json({ message: 'Playlist item deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting playlist item:', error);
    res.status(500).json({ 
      message: 'Failed to delete playlist item',
      error: error.message 
    });
  }
});

// Reorder playlist
app.post('/api/admin/playlist/:eventId/reorder', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { eventId } = req.params;
    const { items } = req.body;
    
    console.log(`📝 Reordering playlist for event ${eventId}`);
    
    // Use a transaction to update all items
    const updates = items.map((item, index) => 
      prisma.playlistItem.update({
        where: { id: item.id },
        data: { order: index + 1 }
      })
    );
    
    await prisma.$transaction(updates);
    
    console.log(`✅ Playlist reordered successfully`);
    res.json({ message: 'Playlist reordered successfully' });
  } catch (error) {
    console.error('❌ Error reordering playlist:', error);
    res.status(500).json({ 
      message: 'Failed to reorder playlist',
      error: error.message 
    });
  }
});

// ==================== BLOG MANAGEMENT ROUTES ====================

// Get all blog posts (admin)
app.get('/api/admin/blogs', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const posts = await prisma.blogPost.findMany({
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true }
        },
        categories: true,
        tags: true,
        _count: {
          select: { comments: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: parseInt(limit),
    });

    const total = await prisma.blogPost.count();

    res.json({
      items: posts.map(post => ({
        ...post,
        commentsCount: post._count.comments,
        _count: undefined
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ message: 'Failed to fetch blog posts' });
  }
});

// Create blog post - FIXED
app.post('/api/admin/blogs', authenticateToken, requireAdmin, async (req, res) => {
  try {
    console.log('📝 Creating blog post - Received data:', req.body);
    
    const { title, content, excerpt, featuredImage, categoryId, tags, metaTitle, metaDescription, metaKeywords } = req.body;
    
    // Validation
    if (!title || !content) {
      console.log('❌ Missing required fields:', { title: !!title, content: !!content });
      return res.status(400).json({ message: 'Title and content are required' });
    }

    if (!title.trim() || !content.trim()) {
      return res.status(400).json({ message: 'Title and content cannot be empty' });
    }
    
    // Generate slug from title
    let slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
    
    // Check if slug already exists
    let existingPost = await prisma.blogPost.findUnique({
      where: { slug }
    });
    
    if (existingPost) {
      // Append timestamp to make slug unique
      const timestamp = Date.now();
      slug = `${slug}-${timestamp}`;
      console.log('📝 Slug already exists, new slug:', slug);
    }
    
    // Create the blog post
    const postData = {
      title: title.trim(),
      slug,
      content: content.trim(),
      excerpt: excerpt?.trim() || content.substring(0, 150) + '...',
      featuredImage: featuredImage || null,
      metaTitle: metaTitle?.trim() || title.trim(),
      metaDescription: metaDescription?.trim() || excerpt?.trim() || content.substring(0, 160),
      metaKeywords: metaKeywords?.trim() || '',
      authorId: req.user.id,
      isPublished: false,
    };
    
    // Handle category if provided
    if (categoryId) {
      postData.categories = {
        connect: { id: categoryId }
      };
    }
    
    // Handle tags if provided
    if (tags) {
      const tagList = Array.isArray(tags) ? tags : 
                     (typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(t => t) : []);
      
      if (tagList.length > 0) {
        postData.tags = {
          connectOrCreate: tagList.map(tagName => ({
            where: { name: tagName },
            create: { 
              name: tagName, 
              slug: tagName.toLowerCase().replace(/\s+/g, '-') 
            }
          }))
        };
      }
    }
    
    console.log('📝 Creating with data:', JSON.stringify(postData, null, 2));
    
    const post = await prisma.blogPost.create({
      data: postData,
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true }
        },
        categories: true,
        tags: true
      }
    });
    
    console.log('✅ Blog post created successfully:', post.id);
    console.log('📝 Blog title:', post.title);
    console.log('📝 Blog slug:', post.slug);
    
    res.status(201).json(post);
  } catch (error) {
    console.error('❌ Error creating blog post:', error);
    console.error('❌ Error details:', error.message);
    console.error('❌ Error stack:', error.stack);
    
    // Handle specific Prisma errors
    if (error.code === 'P2002') {
      return res.status(400).json({ 
        message: 'A blog post with this title already exists. Please use a different title.',
        error: error.message 
      });
    }
    
    res.status(500).json({ 
      message: 'Failed to create blog post',
      error: error.message 
    });
  }
});

// Update blog post
app.patch('/api/admin/blogs/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    console.log(`📝 Updating blog post ${id}:`, updates);
    
    // If title is being updated, regenerate slug
    if (updates.title) {
      let newSlug = updates.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim();
      
      // Check if new slug conflicts with another post
      if (newSlug) {
        const existingPost = await prisma.blogPost.findFirst({
          where: { 
            slug: newSlug,
            NOT: { id }
          }
        });
        
        if (existingPost) {
          // Append timestamp to make slug unique
          const timestamp = Date.now();
          newSlug = `${newSlug}-${timestamp}`;
        }
        
        updates.slug = newSlug;
      }
    }
    
    const post = await prisma.blogPost.update({
      where: { id },
      data: updates,
      include: {
        author: true,
        categories: true,
        tags: true
      }
    });
    
    console.log(`✅ Blog post ${id} updated`);
    res.json(post);
  } catch (error) {
    console.error('❌ Error updating blog post:', error);
    res.status(500).json({ 
      message: 'Failed to update blog post',
      error: error.message 
    });
  }
});

// Delete blog post
app.delete('/api/admin/blogs/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.blogPost.delete({ where: { id } });
    
    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ message: 'Failed to delete blog post' });
  }
});

// Publish blog post
app.post('/api/admin/blogs/:id/publish', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        isPublished: true,
        publishedAt: new Date(),
      }
    });
    
    res.json(post);
  } catch (error) {
    console.error('Error publishing blog post:', error);
    res.status(500).json({ message: 'Failed to publish blog post' });
  }
});

// Unpublish blog post
app.post('/api/admin/blogs/:id/unpublish', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        isPublished: false,
        publishedAt: null,
      }
    });
    
    res.json(post);
  } catch (error) {
    console.error('Error unpublishing blog post:', error);
    res.status(500).json({ message: 'Failed to unpublish blog post' });
  }
});

// Get categories (admin)
app.get('/api/admin/blogs/categories', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
});

// Get comments (admin)
app.get('/api/admin/comments', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const comments = await prisma.comment.findMany({
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true }
        },
        post: {
          select: { id: true, title: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: parseInt(limit),
    });

    const total = await prisma.comment.count();

    res.json({
      items: comments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
});

// Approve comment
app.patch('/api/admin/comments/:id/approve', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const comment = await prisma.comment.update({
      where: { id },
      data: { isApproved: true }
    });
    
    res.json(comment);
  } catch (error) {
    console.error('Error approving comment:', error);
    res.status(500).json({ message: 'Failed to approve comment' });
  }
});

// Reject comment
app.patch('/api/admin/comments/:id/reject', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const comment = await prisma.comment.update({
      where: { id },
      data: { isApproved: false }
    });
    
    res.json(comment);
  } catch (error) {
    console.error('Error rejecting comment:', error);
    res.status(500).json({ message: 'Failed to reject comment' });
  }
});

// Delete comment
app.delete('/api/admin/comments/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.comment.delete({ where: { id } });
    
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Failed to delete comment' });
  }
});

// Create banner
app.post('/api/admin/banner', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { message, linkUrl, linkText, backgroundColor, textColor } = req.body;
    
    await prisma.eventBanner.updateMany({
      data: { isActive: false }
    });
    
    const banner = await prisma.eventBanner.create({
      data: {
        message,
        linkUrl: linkUrl || null,
        linkText: linkText || 'Learn More',
        backgroundColor: backgroundColor || '#f97316',
        textColor: textColor || '#ffffff',
        isActive: true,
        startDate: new Date(),
      }
    });
    
    res.status(201).json(banner);
  } catch (error) {
    console.error('Error creating banner:', error);
    res.status(500).json({ message: 'Failed to create banner' });
  }
});

// ==================== SESSION MANAGEMENT ROUTES ====================

// Get all sessions
app.get('/api/admin/sessions', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, eventId } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let where = {};
    if (eventId) {
      where.eventId = eventId;
    }
    
    const sessions = await prisma.session.findMany({
      where,
      include: {
        event: {
          select: { id: true, title: true, eventDate: true }
        }
      },
      orderBy: [
        { eventId: 'asc' },
        { order: 'asc' }
      ],
      skip,
      take: parseInt(limit),
    });

    const total = await prisma.session.count({ where });

    res.json({
      items: sessions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ message: 'Failed to fetch sessions' });
  }
});

// Create session
app.post('/api/admin/sessions', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, type, eventId, startTime, endTime, worshipLeader, notes, order } = req.body;
    
    if (!title || !type || !eventId || !order) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const session = await prisma.session.create({
      data: {
        title,
        type,
        eventId,
        startTime: startTime ? new Date(startTime) : null,
        endTime: endTime ? new Date(endTime) : null,
        worshipLeader: worshipLeader || null,
        notes: notes || null,
        order: parseInt(order),
      },
      include: {
        event: true
      }
    });
    
    res.status(201).json(session);
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ message: 'Failed to create session' });
  }
});

// Update session
app.patch('/api/admin/sessions/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    if (updates.startTime) updates.startTime = new Date(updates.startTime);
    if (updates.endTime) updates.endTime = new Date(updates.endTime);
    if (updates.order) updates.order = parseInt(updates.order);
    
    const session = await prisma.session.update({
      where: { id },
      data: updates,
      include: {
        event: true
      }
    });
    
    res.json(session);
  } catch (error) {
    console.error('Error updating session:', error);
    res.status(500).json({ message: 'Failed to update session' });
  }
});

// Delete session
app.delete('/api/admin/sessions/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if session is used in any playlist items
    const playlistItems = await prisma.playlistItem.count({
      where: { sessionId: id }
    });
    
    if (playlistItems > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete session because it has songs assigned. Remove songs from this session first.' 
      });
    }
    
    await prisma.session.delete({ where: { id } });
    
    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ message: 'Failed to delete session' });
  }
});

// ==================== TEAM MANAGEMENT ROUTES ====================

// Get all team members (admin)
app.get('/api/admin/team', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const team = await prisma.teamMember.findMany({
      orderBy: { order: 'asc' },
      skip,
      take: parseInt(limit),
    });

    const total = await prisma.teamMember.count();

    res.json({
      items: team,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching team:', error);
    res.status(500).json({ message: 'Failed to fetch team' });
  }
});

// Create team member
app.post('/api/admin/team', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, role, bio, imageUrl, order, isActive } = req.body;
    
    if (!name || !role) {
      return res.status(400).json({ message: 'Name and role are required' });
    }
    
    const member = await prisma.teamMember.create({
      data: {
        name,
        role,
        bio: bio || null,
        imageUrl: imageUrl || null,
        order: order || 0,
        isActive: isActive ?? true,
      }
    });
    
    res.status(201).json(member);
  } catch (error) {
    console.error('Error creating team member:', error);
    res.status(500).json({ message: 'Failed to create team member' });
  }
});

// Update team member
app.patch('/api/admin/team/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const member = await prisma.teamMember.update({
      where: { id },
      data: updates,
    });
    
    res.json(member);
  } catch (error) {
    console.error('Error updating team member:', error);
    res.status(500).json({ message: 'Failed to update team member' });
  }
});

// Delete team member
app.delete('/api/admin/team/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.teamMember.delete({ where: { id } });
    
    res.json({ message: 'Team member deleted successfully' });
  } catch (error) {
    console.error('Error deleting team member:', error);
    res.status(500).json({ message: 'Failed to delete team member' });
  }
});

// ==================== SUPER ADMIN ROUTES ====================

// Get all admins
app.get('/api/admin/super/admins', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
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
        profileImage: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(admins);
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ message: 'Failed to fetch admins' });
  }
});

// Create new admin
app.post('/api/admin/super/admins', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;
    
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const admin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone: phone || null,
        role: 'ADMIN',
        isApproved: true,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      }
    });
    
    res.status(201).json(admin);
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ message: 'Failed to create admin' });
  }
});

// Delete admin
app.delete('/api/admin/super/admins/:id', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    if (id === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }
    
    await prisma.user.delete({ where: { id } });
    
    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('Error deleting admin:', error);
    res.status(500).json({ message: 'Failed to delete admin' });
  }
});

// Get system logs
app.get('/api/admin/super/logs', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    
    res.json({
      items: [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: 0,
        pages: 0
      }
    });
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ message: 'Failed to fetch logs' });
  }
});

// ==================== DEBUG ENDPOINTS ====================

// Debug: Check user requests
app.get('/api/debug/user-requests', authenticateToken, async (req, res) => {
  try {
    const userRequests = await prisma.songRequest.findMany({
      where: { userId: req.user.id },
      include: {
        user: true,
        song: true
      }
    });
    
    res.json({
      userId: req.user.id,
      requestCount: userRequests.length,
      requests: userRequests
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== SEED ROUTES (FOR TESTING) ====================

// Seed sample events
app.post('/api/seed/events', async (req, res) => {
  try {
    // Clear existing events
    await prisma.event.deleteMany({});
    
    // Create sample events
    const events = await prisma.event.createMany({
      data: [
        {
          title: 'Sunday Worship Service',
          description: 'Join us for a powerful time of worship and fellowship.',
          eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          location: 'Ruiru Town Hall',
          bannerImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7',
          isActive: true,
        },
        {
          title: 'Wednesday Prayer Meeting',
          description: 'Mid-week prayer and bible study session.',
          eventDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          location: 'Fellowship Center',
          bannerImage: 'https://images.unsplash.com/photo-1524863479829-916d8e77f114',
          isActive: true,
        },
        {
          title: 'Friday Choir Practice',
          description: 'Preparation for Sunday worship service.',
          eventDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          location: 'Music Room',
          bannerImage: 'https://images.unsplash.com/photo-1507692049790-de58290c433e',
          isActive: true,
        },
      ],
    });
    
    console.log(`✅ Created ${events.count} sample events`);
    res.json({ message: `Created ${events.count} sample events` });
  } catch (error) {
    console.error('Error seeding events:', error);
    res.status(500).json({ message: 'Failed to seed events' });
  }
});

// Seed sample songs
app.post('/api/seed/songs', async (req, res) => {
  try {
    // Clear existing songs
    await prisma.song.deleteMany({});
    
    // Create sample songs
    const songs = await prisma.song.createMany({
      data: [
        {
          title: 'Njambi Ya Thengo',
          artist: 'Traditional',
          lyrics: `Njambi ya thengo, njambi ya thengo\nTwendee twendee twendee\nNjambi ya thengo, njambi ya thengo\nTwendee twendee twendee`,
          isOriginal: false,
        },
        {
          title: 'Wendo Wi Mwega',
          artist: 'Kikuyu Gospel',
          lyrics: `Wendo wi mwega, wendo wi mwega\nNjambi ahendire andu othe\nWendo wi mwega, wendo wi mwega\nTwendane o ta uria Njambi atwendete`,
          isOriginal: false,
        },
        {
          title: 'Ndi Mukenya',
          artist: 'Agendi',
          lyrics: `Ndi mukenya, ndi mukenya\nNĩ ũndũ wa Njambi wakwa\nNdi mukenya, ndi mukenya\nNĩ wendo wake uhunjagia`,
          isOriginal: true,
        },
      ],
    });
    
    console.log(`✅ Created ${songs.count} sample songs`);
    res.json({ message: `Created ${songs.count} sample songs` });
  } catch (error) {
    console.error('Error seeding songs:', error);
    res.status(500).json({ message: 'Failed to seed songs' });
  }
});

// ==================== ERROR HANDLING ====================

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method
  });
});

// ==================== SERVER START ====================

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 API available at http://localhost:${PORT}/api`);
  console.log(`📍 Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`📍 Public events: http://localhost:${PORT}/api/public/events`);
  console.log(`📍 Admin events: http://localhost:${PORT}/api/admin/events`);
  console.log(`📍 Songs API: http://localhost:${PORT}/api/songs/master`);
  console.log(`📍 Song requests: http://localhost:${PORT}/api/songs/requests`);
});

module.exports = app;

// Keep your local development server
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}