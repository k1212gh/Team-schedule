const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authMiddleware");
const { getMyNotifications } = require("../controllers/notificationController");

router.use(authenticateToken);
router.get("/", getMyNotifications);

module.exports = router;

