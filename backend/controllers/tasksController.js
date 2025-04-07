// backend/controllers/tasksController.js
const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const { sendMentionNotification } = require("../utils/notification");
const { parseMentions } = require("../utils/mentionParser");

// 일정 생성, 반복 일정, mention, 파일 첨부 등 확장 가능
exports.createTask = async (req, res, next) => {
  try {
    const { task_title, task_desc, task_datetime, repeat_type, repeat_end, task_priority, team_id } = req.body;
    const userId = req.user.id;

    // 중복 일정 체크 로직 등 필요 시 추가
    const taskId = uuidv4();
    await pool.query(
      `INSERT INTO tasks (id, task_title, task_desc, task_datetime, repeat_type, repeat_end, task_priority, created_by, team_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        taskId,
        task_title,
        task_desc || "",
        task_datetime,
        repeat_type || "none",
        repeat_end || null,
        task_priority || 1,
        userId,
        team_id || null // null이면 'General' 용도로 사용 가능
      ]
    );

    // mention 파싱하여 알림 발송
    const mentions = parseMentions(task_desc || "");
    if (mentions && mentions.length > 0) {
      await sendMentionNotification(mentions, {
        taskId,
        message: `[멘션] '${req.user.username}'가 당신을 언급했습니다: ${task_title}`,
      });
    }

    res.json({ message: "일정 생성 완료", taskId });
  } catch (err) {
    next(err);
  }
};

exports.getTasks = async (req, res, next) => {
  try {
    const { role, teamId } = req.user;
    let sql = "SELECT t.*, u.username AS creator_name FROM tasks t LEFT JOIN users u ON t.created_by = u.id";
    let where = [];

    // 관리자(admin)는 전체, 팀리더/유저는 본인 팀 + General
    if (role !== "admin") {
      sql += " WHERE (t.team_id = ? OR t.team_id IS NULL)";
      where.push(teamId);
    }

    const [rows] = await pool.query(sql, where);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { task_title, task_desc, task_datetime, repeat_type, repeat_end, task_priority } = req.body;
    const { id: userId, role } = req.user;

    // 기존 일정 조회
    const [existing] = await pool.query("SELECT * FROM tasks WHERE id = ?", [taskId]);
    if (existing.length === 0) return res.status(404).json({ error: "일정이 존재하지 않습니다." });

    const oldTask = existing[0];
    // admin이 아닌 경우, 작성자 여부 체크
    if (role !== "admin" && oldTask.created_by !== userId) {
      return res.status(403).json({ error: "해당 일정 수정 권한이 없습니다." });
    }

    await pool.query(
      `UPDATE tasks 
       SET task_title = ?, task_desc = ?, task_datetime = ?, repeat_type = ?, repeat_end = ?, task_priority = ?
       WHERE id = ?`,
      [
        task_title,
        task_desc,
        task_datetime,
        repeat_type,
        repeat_end || null,
        task_priority,
        taskId
      ]
    );

    // mention 파싱(수정 내용에서 멘션이 추가되었을 경우) & 알림
    const mentions = parseMentions(task_desc || "");
    if (mentions && mentions.length > 0) {
      await sendMentionNotification(mentions, {
        taskId,
        message: `[멘션] '${req.user.username}'가 당신을 언급했습니다: ${task_title}`,
      });
    }

    res.json({ message: "일정 수정 완료" });
  } catch (err) {
    next(err);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { id: userId, role } = req.user;

    const [existing] = await pool.query("SELECT * FROM tasks WHERE id = ?", [taskId]);
    if (existing.length === 0) return res.status(404).json({ error: "해당 일정이 존재하지 않습니다." });

    if (role !== "admin" && existing[0].created_by !== userId) {
      return res.status(403).json({ error: "삭제 권한이 없습니다." });
    }

    await pool.query("DELETE FROM tasks WHERE id = ?", [taskId]);
    res.json({ message: "일정 삭제 완료" });
  } catch (err) {
    next(err);
  }
};

exports.completeTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { id: userId, role } = req.user;

    const [rows] = await pool.query("SELECT * FROM tasks WHERE id = ?", [taskId]);
    if (rows.length === 0) return res.status(404).json({ error: "존재하지 않는 일정" });

    if (role !== "admin" && rows[0].created_by !== userId) {
      return res.status(403).json({ error: "완료 처리 권한이 없습니다." });
    }

    await pool.query("UPDATE tasks SET completed = 1 WHERE id = ?", [taskId]);
    res.json({ message: "일정 완료 처리" });
  } catch (err) {
    next(err);
  }
};

