const rateLimit = require('express-rate-limit');

// General API rate limiter
exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Too many requests from this IP, please try again later'
  }
});

// Strict limiter for auth endpoints
exports.authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 attempts per hour
  skipSuccessfulRequests: true,
  message: {
    status: 'error',
    message: 'Too many authentication attempts. Please try again later.'
  }
});

// Upload limiter (stricter for file uploads)
exports.uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 uploads per hour
  message: {
    status: 'error',
    message: 'Upload limit exceeded. Please try again later.'
  }
});

// Comment limiter
exports.commentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 comments per 15 minutes
  message: {
    status: 'error',
    message: 'Too many comments. Please slow down.'
  }
});

// Vote limiter
exports.voteLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 votes per minute
  message: {
    status: 'error',
    message: 'Too many votes. Please slow down.'
  }
});

// Create custom limiter with options
exports.createLimiter = (options) => {
  return rateLimit({
    windowMs: options.windowMs || 15 * 60 * 1000,
    max: options.max || 100,
    message: options.message || {
      status: 'error',
      message: 'Too many requests'
    },
    skipSuccessfulRequests: options.skipSuccessfulRequests || false,
    keyGenerator: options.keyGenerator || ((req) => req.ip)
  });
};