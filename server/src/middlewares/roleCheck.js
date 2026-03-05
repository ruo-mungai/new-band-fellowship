const AppError = require('../utils/AppError');

// Check if user has required role
exports.hasRole = (...roles) => {
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

// Check if user is admin or super admin
exports.isAdmin = (req, res, next) => {
  if (!req.user) {
    return next(new AppError('You are not logged in', 401));
  }

  if (!['ADMIN', 'SUPER_ADMIN'].includes(req.user.role)) {
    return next(new AppError('Admin access required', 403));
  }

  next();
};

// Check if user is super admin
exports.isSuperAdmin = (req, res, next) => {
  if (!req.user) {
    return next(new AppError('You are not logged in', 401));
  }

  if (req.user.role !== 'SUPER_ADMIN') {
    return next(new AppError('Super admin access required', 403));
  }

  next();
};

// Check if user is the owner of the resource or admin
exports.isOwnerOrAdmin = (getOwnerId) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return next(new AppError('You are not logged in', 401));
      }

      // Admin can access anything
      if (['ADMIN', 'SUPER_ADMIN'].includes(req.user.role)) {
        return next();
      }

      // Get owner ID from request
      const ownerId = await getOwnerId(req);

      if (ownerId !== req.user.id) {
        return next(new AppError('You do not have permission to access this resource', 403));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Check if user is approved
exports.isApproved = (req, res, next) => {
  if (!req.user) {
    return next(new AppError('You are not logged in', 401));
  }

  if (!req.user.isApproved && req.user.role === 'USER') {
    return next(new AppError('Your account is pending approval', 403));
  }

  next();
};

// Check if user is not banned
exports.isNotBanned = (req, res, next) => {
  if (!req.user) {
    return next(new AppError('You are not logged in', 401));
  }

  if (req.user.isBanned) {
    return next(new AppError('Your account has been banned', 403));
  }

  next();
};

// Check multiple conditions
exports.and = (...middlewares) => {
  return async (req, res, next) => {
    try {
      for (const middleware of middlewares) {
        await new Promise((resolve, reject) => {
          middleware(req, res, (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

exports.or = (...middlewares) => {
  return async (req, res, next) => {
    const errors = [];
    
    for (const middleware of middlewares) {
      try {
        await new Promise((resolve, reject) => {
          middleware(req, res, (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
        // If one passes, we're good
        return next();
      } catch (error) {
        errors.push(error);
      }
    }

    // If all failed
    next(errors[0] || new AppError('Access denied', 403));
  };
};