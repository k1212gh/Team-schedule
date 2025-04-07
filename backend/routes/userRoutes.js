const express = require("express");
const { authenticateToken } = require("../middlewares/authMiddleware");
const { requireRole } = require("../middlewares/roleMiddleware");
const {
  getAllUsers,
  deleteUser,
  updateUserRole,
  updateUserTeam
} = require("../controllers/userController");

const router = express.Router();
router.use(authenticateToken);

// 모든 유저 조회 - 관리자만
router.get("/", requireRole("admin"), getAllUsers);

// 유저 삭제
router.delete("/:id", requireRole("admin"), deleteUser);

// 역할 변경
router.patch("/:id/role", requireRole("admin"), updateUserRole);

// 팀 변경
router.patch("/:id/team", requireRole("admin", "leader"), updateUserTeam);

module.exports = router;

