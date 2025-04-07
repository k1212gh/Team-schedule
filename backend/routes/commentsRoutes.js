// backend/routes/commentsRoutes.js
const express = require("express");
const { authenticateToken } = require("../middlewares/authMiddleware");
const { createComment, getCommentsByTask } = require("../controllers/commentsController");

const router = express.Router();

router.use(authenticateToken);

router.post("/:taskId", createComment);
router.get("/:taskId", getCommentsByTask);

module.exports = router;

