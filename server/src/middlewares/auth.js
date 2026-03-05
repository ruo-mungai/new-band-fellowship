const AppError = require('../utils/AppError');

// Protect middleware - verifies user is authenticated
exports.protect = async (req, res, next) => {
  try {
    // For development/testing, add a test user
    // In production, this would verify JWT token
    req.user = {
      id: 'test-user-id-123',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'USER',
      isApproved: true,
      isBanned: false
    };
    
    next();
  } catch (error) {
    next(new AppError('Authentication failed', 401));
  }
};

// Restrict to specific roles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('You are not logged in', 401));
    }
    
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    
    next();
  };
};

// Check if user is approved
exports.isApproved = (req, res, next) => {
  if (!req.user.isApproved && req.user.role === 'USER') {
    return next(new AppError('Your account is pending approval', 403));
  }
  next();
};

// Check if user is banned
exports.isNotBanned = (req, res, next) => {
  if (req.user.isBanned) {
    return next(new AppError('Your account has been banned', 403));
  }
  next();
};