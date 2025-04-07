// backend/middlewares/errorHandler.js
exports.errorHandler = (err, req, res, next) => {
  console.error("[ERROR HANDLER]", err);
  res.status(err.statusCode || 500).json({ error: err.message || "서버 오류" });
};
// backend/middlewares/errorHandler.js
exports.errorHandler = (err, req, res, next) => {
  console.error("[ERROR HANDLER]", err);
  res.status(err.statusCode || 500).json({ error: err.message || "서버 오류" });
};

