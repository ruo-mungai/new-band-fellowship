const express = require('express');
const cors = require('cors');
// ... other imports

// Import ALL routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const songRoutes = require('./routes/song.routes');
const eventRoutes = require('./routes/event.routes');
const playlistRoutes = require('./routes/playlist.routes');
const blogRoutes = require('./routes/blog.routes');
const adminRoutes = require('./routes/admin.routes');
const publicRoutes = require('./routes/public.routes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// ======================
// MOUNT ALL ROUTES
// ======================
app.use('/api/auth', authRoutes);      // <-- THIS WAS MISSING
app.use('/api/users', userRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);  // <-- YOU HAVE THIS

// Test direct routes
app.get('/test', (req, res) => {
  res.json({ message: 'Test works' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// 404 handler - MUST BE LAST
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

module.exports = app;