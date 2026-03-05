const express = require('express');
const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  console.log('✅ Public test route hit');
  res.json({
    status: 'success',
    message: 'Public routes are working',
    timestamp: new Date().toISOString()
  });
});

// Landing route
router.get('/landing', (req, res) => {
  console.log('✅ Landing route hit');
  res.json({
    status: 'success',
    data: {
      hero: {
        title: 'Welcome to New Band Fellowship',
        subtitle: 'Experience Worship in Ruiru Town'
      }
    }
  });
});

// Events route
router.get('/events', (req, res) => {
  res.json({
    status: 'success',
    data: { events: [] }
  });
});

// Gallery route
router.get('/gallery', (req, res) => {
  res.json({
    status: 'success',
    data: { images: [] }
  });
});

module.exports = router;