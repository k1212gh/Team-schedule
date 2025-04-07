// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { errorHandler } = require("./middlewares/errorHandler");
const authRoutes = require("./routes/authRoutes");
const tasksRoutes = require("./routes/tasksRoutes");
const commentsRoutes = require("./routes/commentsRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const teamRoutes = require("./routes/teamRoutes");
const pool = require("./config/db"); 
const bcrypt = require("bcrypt");
const userRoutes = require("./routes/userRoutes");
const notificationRoutes = require("./routes/notificationRoutes");


// node-schedule job (import)
require("./utils/schedule");

const app = express();
app.use(cors());
app.use(express.json());

// 라우트 등록
app.use("/api/auth", authRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);

// 에러 핸들러
app.use(errorHandler);
async function createInitialAdmin() {
  const [rows] = await pool.execute("SELECT * FROM users WHERE role = 'admin'");
  if (rows.length === 0) {
    const hashedPassword = await bcrypt.hash("admin1234", 10);
    await pool.execute(
      "INSERT INTO users (id, username, password, role, team_id) VALUES (UUID(), ?, ?, ?, ?)",
      ["admin", hashedPassword, "admin", "General"]
    );
    console.log("✅ 최초 관리자 계정(admin/admin1234)이 생성되었습니다.");
  } else {
    console.log("ℹ️ 관리자 계정이 이미 존재합니다.");
  }
}
createInitialAdmin();
// 포트 설정 (예: 4000)
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Express Server started on port ${PORT}`);
});

