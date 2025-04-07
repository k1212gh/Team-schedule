// backend/config/db.js
require("dotenv").config();
const mysql = require("mysql2/promise");

// RDS MySQL 연결 설정
const pool = mysql.createPool({
  host: process.env.DB_HOST,       // ex) hancomai.c7gyqeqyar1g.ap-northeast-2.rds.amazonaws.com
  user: process.env.DB_USER,       // ex) team_schedule_app_admin
  password: process.env.DB_PASS,   // ex) kevin777716
  database: process.env.DB_NAME,   // ex) team_schedule_app
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;

