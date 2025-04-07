// backend/controllers/commentsController.js
const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const { sendMentionNotification } = require("../utils/notification");
const { parseMentions } = require("../utils/mentionParser");

exports.createComment = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;
    const commentId = uuidv4();

    // 해당 task 존재여부 확인 (필요시)
    await pool.query("INSERT INTO comments (id, task_id, user_id, content) VALUES (?, ?, ?, ?)", [
      commentId,
      taskId,
      userId,
      content
    ]);

    // mention 파싱 & 알림
    const mentions = parseMentions(content);
    if (mentions && mentions.length > 0) {
      await sendMentionNotification(mentions, {
        taskId,
        message: `[댓글 멘션] '${req.user.username}'가 당신을 언급했습니다: ${content}`
      });
    }

    res.json({ message: "댓글 등록 완료", commentId });
  } catch (err) {
    next(err);
  }
};

exports.getCommentsByTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const [rows] = await pool.query(`
      SELECT c.*, u.username
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.task_id = ?
      ORDER BY c.created_at ASC
    `, [taskId]);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

