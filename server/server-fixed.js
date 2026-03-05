const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import your actual route files
const publicRoutes = require('./src/routes/public.routes');

// Direct test routes
app.get('/', (req, res) => {
  res.json({ message: 'API Root' });
});

app.get('/test', (req, res) => {
  res.json({ message: 'Test works' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Mount your routes
app.use('/api/public', publicRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}/test`);
  console.log(`📍 http://localhost:${PORT}/api/public/test`);
});