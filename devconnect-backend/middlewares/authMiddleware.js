const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');

module.exports = (required = true, roles = []) => {
  // Handle old signature: authMiddleware(roles)
  if (typeof required !== 'boolean') {
    roles = required;
    required = true;
  }
  
  if (typeof roles === 'string') roles = [roles];   // allow single role

  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    // If authentication is not required and no token provided, continue
    if (!required && (!authHeader || !authHeader.startsWith('Bearer '))) {
      req.user = null;
      return next();
    }

    // If authentication is required but no token provided, return error
    if (required && (!authHeader || !authHeader.startsWith('Bearer '))) {
      return next(new ErrorResponse('Not authenticated', 401));
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // { id, role }
      if (roles.length && !roles.includes(req.user.role))
        return next(new ErrorResponse('Forbidden', 403));
      next();
    } catch (err) {
      // If auth is optional and token is invalid, continue without user
      if (!required) {
        req.user = null;
        return next();
      }
      next(new ErrorResponse('Invalid token', 401));
    }
  };
};