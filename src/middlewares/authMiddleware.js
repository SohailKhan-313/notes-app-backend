const passport = require('passport');

// Middleware to protect routes using Passport JWT strategy
const authenticateUser = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        success: false,
        message: info && info.message ? info.message : 'Unauthorized access. Please login.',
      });
    }
    req.user = user;
    next();
  })(req, res, next);
};

module.exports = { authenticateUser };
