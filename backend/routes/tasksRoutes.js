// backend/routes/tasksRoutes.js
const express = require("express");
const { authenticateToken } = require("../middlewares/authMiddleware");
const { createTask, getTasks, updateTask, deleteTask, completeTask } = require("../controllers/tasksController");

const router = express.Router();

router.use(authenticateToken);

// 일정
router.post("/", createTask);
router.get("/", getTasks);
router.put("/:taskId", updateTask);
router.delete("/:taskId", deleteTask);
router.put("/:taskId/complete", completeTask);

module.exports = router;

