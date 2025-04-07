// backend/routes/uploadRoutes.js
const express = require("express");
const { authenticateToken } = require("../middlewares/authMiddleware");
const { uploadFileLink } = require("../controllers/uploadController");

const router = express.Router();
router.use(authenticateToken);

// Google Drive 링크만 DB에 저장하는 예시
router.post("/", uploadFileLink);

module.exports = router;

