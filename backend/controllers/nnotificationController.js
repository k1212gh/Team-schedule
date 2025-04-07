const pool = require("../config/db");

exports.getMyNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query(`
      SELECT * FROM notifications
      WHERE user_id = ? ORDER BY created_at DESC
    `, [userId]);

    res.json(rows);
  } catch (err) {
    next(err);
  }
};

