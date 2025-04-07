// backend/utils/schedule.js
// node-schedule로 정기 작업(알림 등) 처리 예시
const schedule = require("node-schedule");

// 매일 9시에 만료된 일정 자동 아카이빙, 알림 발송 등
const job = schedule.scheduleJob("0 9 * * *", () => {
  console.log("[SCHEDULE] 매일 9시에 실행되는 작업");
  // TODO: 만료 일정 처리, 알림 로직 등
});

module.exports = job;

