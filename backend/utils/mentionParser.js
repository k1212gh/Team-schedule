// backend/utils/mentionParser.js
// 예: "@홍길동 일정 확인" 문장 -> ["홍길동"] 추출

exports.parseMentions = (text) => {
  if (!text) return [];
  const mentionRegex = /@(\S+)/g;  // 공백 아닌 문자들 매칭
  const matches = text.match(mentionRegex);
  if (!matches) return [];
  // ["@홍길동", "@kevin"] -> ["홍길동", "kevin"]
  return matches.map(m => m.slice(1));
};

