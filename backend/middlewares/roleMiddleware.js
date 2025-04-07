// backend/middlewares/roleMiddleware.js
exports.requireRole = (...roles) => {
  return (req, res, next) => {
    // req.user.role이 roles 중 하나인지 확인
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "해당 권한이 없습니다." });
    }
    next();
  };
};

