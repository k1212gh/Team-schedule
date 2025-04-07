// backend/controllers/teamController.js
const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");

// 팀 생성, 초대, 팀 정보 조회, 팀 관리자 지정 등
exports.createTeam = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const teamId = uuidv4();

    // 팀 이름 중복 체크
    const [check] = await pool.query("SELECT * FROM teams WHERE name = ?", [name]);
    if (check.length > 0) return res.status(400).json({ error: "이미 존재하는 팀명입니다." });

    await pool.query("INSERT INTO teams (id, name, description) VALUES (?, ?, ?)", [teamId, name, description || ""]);
    res.json({ message: "팀 생성 완료", teamId });
  } catch (err) {
    next(err);
  }
};

exports.getTeamInfo = async (req, res, next) => {
  try {
    const { teamId } = req.params;
    // 팀 정보 + 팀원 리스트
    const [teams] = await pool.query("SELECT * FROM teams WHERE id = ?", [teamId]);
    if (teams.length === 0) return res.status(404).json({ error: "해당 팀이 없습니다." });
    const team = teams[0];

    const [members] = await pool.query(
      "SELECT id, username, role FROM users WHERE team_id = ?",
      [teamId]
    );

    res.json({ team, members });
  } catch (err) {
    next(err);
  }
};

// 모든 팀 조회
exports.getAllTeams = async (req, res, next) => {
  try {
    const [teams] = await pool.query("SELECT * FROM teams");
    res.json(teams);
  } catch (err) {
    next(err);
  }
};

exports.inviteUser = async (req, res, next) => {
  try {
    // 초대 로직 (이메일 전송, DB 초대 테이블 생성 등) - 예시
    // 지금은 단순히 user의 team_id 업데이트
    const { userId, teamId } = req.body;

    // 존재하는 팀인지 체크
    const [t] = await pool.query("SELECT * FROM teams WHERE id = ?", [teamId]);
    if (t.length === 0) return res.status(404).json({ error: "해당 팀이 존재하지 않습니다." });

    await pool.query("UPDATE users SET team_id = ? WHERE id = ?", [teamId, userId]);
    res.json({ message: "팀 초대(배정) 완료" });
  } catch (err) {
    next(err);
  }
};

