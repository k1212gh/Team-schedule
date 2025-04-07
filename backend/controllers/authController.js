// backend/controllers/authController.js
const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

exports.register = async (req, res, next) => {
  try {
    const { username, password, role, teamId } = req.body;

    // username 중복 확인
    const [existing] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);
    if (existing.length > 0) {
      return res.status(400).json({ error: "이미 존재하는 username입니다." });
    }

    // 비밀번호 해시
    const hashedPw = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    // 사용자 생성
    await pool.query(
      "INSERT INTO users (id, username, password, role, team_id) VALUES (?, ?, ?, ?, ?)",
      [userId, username, hashedPw, role || "user", teamId || null]
    );

    res.json({ message: "사용자 등록 완료", userId });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);
    if (rows.length === 0) return res.status(401).json({ error: "사용자를 찾을 수 없습니다." });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "비밀번호가 틀립니다." });

    // JWT 발급
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role, teamId: user.team_id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "로그인 성공", token, user });
  } catch (err) {
    next(err);
  }
};

