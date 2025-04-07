// backend/utils/notification.js
// 멘션 사용자에게 알림, 이메일 전송 등
// 실제 구현 시 socket.io, 이메일 API, FCM 등을 사용할 수 있음

// backend/utils/notification.js
const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");

exports.sendMentionNotification = async (mentionedUsernames, payload) => {
  const { taskId, message } = payload;

  for (const username of mentionedUsernames) {
    const [[user]] = await pool.query("SELECT id FROM users WHERE username = ?", [username]);
    if (user) {
      const notiId = uuidv4();
      await pool.query(`
        INSERT INTO notifications (id, user_id, message, url, is_read)
        VALUES (?, ?, ?, ?, false)
      `, [notiId, user.id, message, `/task/${taskId}`]);

      console.log(`[NOTIFICATION] @${username} → 알림 전송됨`);
    }
  }
};

exports.sendReminderNotification = async (userId, task) => {
  // 일정 시작 1시간 전 푸시 알림
  console.log("[NOTIFICATION] 리마인더 알림 전송", userId, task);
};

