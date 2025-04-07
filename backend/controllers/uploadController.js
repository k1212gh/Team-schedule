// backend/controllers/uploadController.js
// 여기서는 구글 드라이브 링크만 DB에 저장하는 간단한 예시
const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");

exports.uploadFileLink = async (req, res, next) => {
  try {
    // file_url, file_name, task_id 등 클라이언트에서 전달
    const { taskId, file_url, file_name } = req.body;
    const uploaderId = req.user.id;

    if (!taskId || !file_url) {
      return res.status(400).json({ error: "taskId와 file_url은 필수입니다." });
    }

    const attachId = uuidv4();
    await pool.query(
      "INSERT INTO attachments (id, task_id, file_url, file_name, uploader_id) VALUES (?, ?, ?, ?, ?)",
      [attachId, taskId, file_url, file_name || null, uploaderId]
    );

    res.json({ message: "파일 링크 저장 완료", attachId });
  } catch (err) {
    next(err);
  }
};

