const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');

module.exports = (roles = []) => {
  if (typeof roles === 'string') roles = [roles];   // allow single role

  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer '))
      return next(new ErrorResponse('Not authenticated', 401));

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // { id, role }
      if (roles.length && !roles.includes(req.user.role))
        return next(new ErrorResponse('Forbidden', 403));
      next();
    } catch (err) {
      next(new ErrorResponse('Invalid token', 401));
    }
  };
};