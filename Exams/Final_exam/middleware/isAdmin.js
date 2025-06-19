module.exports = function (req, res, next) {
  if (req.session && req.session.user && req.session.user.isAdmin) {
    return next(); // allow access
  } else {
    return res.status(403).send('Access denied. Admins only.');
  }
};
