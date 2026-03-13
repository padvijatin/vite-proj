const adminMiddleware = (req, res, next) => {
  if (!req.user || !req.auth) {
    return res.status(401).json({
      message: "Unauthorized: Authentication required",
      details: [],
    });
  }

  if (req.auth.isAdmin !== true) {
    return res.status(403).json({
      message: "Access denied. Admin only.",
      details: [],
    });
  }

  return next();
};

module.exports = adminMiddleware;
