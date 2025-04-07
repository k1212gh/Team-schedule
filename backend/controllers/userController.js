const { pool } = require("../config/db");

exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.query("SELECT id, username, email, role, team FROM users");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "유저 목록 조회 실패" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM users WHERE id = ?", [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "유저 삭제 실패" });
  }
};

exports.updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  try {
    await pool.query("UPDATE users SET role = ? WHERE id = ?", [role, id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "역할 변경 실패" });
  }
};

exports.updateUserTeam = async (req, res) => {
  const { id } = req.params;
  const { team } = req.body;
  try {
    await pool.query("UPDATE users SET team = ? WHERE id = ?", [team, id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "팀 변경 실패" });
  }
};

