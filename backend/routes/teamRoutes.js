// backend/routes/teamRoutes.js
const express = require("express");
const { authenticateToken } = require("../middlewares/authMiddleware");
const { requireRole } = require("../middlewares/roleMiddleware");
const { createTeam, getTeamInfo, inviteUser, getAllTeams } = require("../controllers/teamController");

const router = express.Router();
router.use(authenticateToken);

// 팀 생성: admin 혹은 leader 권한만 예시
router.post("/", requireRole("admin", "leader"), createTeam);

// 팀 정보 조회 (모든 팀원 가능)
router.get("/:teamId", getTeamInfo);

router.get("/", getAllTeams); // ✅ 추가

// 팀 초대(팀 배정) - leader, admin 권한
router.post("/invite", requireRole("admin", "leader"), inviteUser);

module.exports = router;

