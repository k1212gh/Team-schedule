// 백엔드 API URL
//const API_URL = "http://k1212gh.site:4000/api";
const API_URL = "/team-api/api"; // ← nginx 프록시 경로에 맞게 수정됨
// 토큰 포함된 요청 헤더
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token
    ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    : { "Content-Type": "application/json" };
};

// 1) 로그인
export const loginApi = async (username, password) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("로그인 실패");
  return res.json();
};

// 2) 회원가입 (관리자만 접근)
export const registerApi = async (username, password, role, team) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      newUsername: username,
      newPassword: password,
      role,
      team,
    }),
  });
  if (!res.ok) throw new Error("회원가입 실패");
  return res.json();
};

// 3) 일정(Task)
export const fetchTasks = async () => {
  const res = await fetch(`${API_URL}/tasks`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("일정 목록 조회 실패");
  return res.json();
};

export const createTaskApi = async (task) => {
  const res = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error("일정 생성 실패");
  return res.json();
};

export const updateTaskApi = async (taskId, payload) => {
  const res = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("일정 수정 실패");
  return res.json();
};

export const deleteTaskApi = async (taskId) => {
  const res = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("일정 삭제 실패");
  return res.json();
};

export const completeTaskApi = async (taskId) => {
  const res = await fetch(`${API_URL}/tasks/${taskId}/complete`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("일정 완료 처리 실패");
  return res.json();
};

// 4) 댓글(Comment)
export const fetchCommentsByTask = async (taskId) => {
  const res = await fetch(`${API_URL}/comments/${taskId}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("댓글 목록 불러오기 실패");
  return res.json();
};

export const createComment = async (taskId, content) => {
  const res = await fetch(`${API_URL}/comments/${taskId}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error("댓글 등록 실패");
  return res.json();
};

// 5) 팀(Team)
export const fetchTeams = async () => {
  const res = await fetch(`${API_URL}/team`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("팀 목록 불러오기 실패");
  return res.json();
};

export const createTeam = async (name, description) => {
  const res = await fetch(`${API_URL}/team`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ name, description }),
  });
  if (!res.ok) throw new Error("팀 생성 실패");
  return res.json();
};

export const fetchTeamInfo = async (teamId) => {
  const res = await fetch(`${API_URL}/team/${teamId}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("팀 정보 조회 실패");
  return res.json();
};

export const inviteUserToTeam = async (userId, teamId) => {
  const res = await fetch(`${API_URL}/team/invite`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ userId, teamId }),
  });
  if (!res.ok) throw new Error("팀 초대 실패");
  return res.json();
};

// 6) 파일 업로드
export const uploadFileLink = async (taskId, fileUrl, fileName) => {
  const res = await fetch(`${API_URL}/upload`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ taskId, file_url: fileUrl, file_name: fileName }),
  });
  if (!res.ok) throw new Error("파일 업로드 실패");
  return res.json();
};

// 7) 사용자 관리 (관리자 전용)
export const fetchUsers = async () => {
  const res = await fetch(`${API_URL}/users`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("유저 목록 조회 실패");
  return res.json();
};

export const deleteUser = async (userId) => {
  const res = await fetch(`${API_URL}/users/${userId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("유저 삭제 실패");
  return res.json();
};

export const updateUserRole = async (userId, role) => {
  const res = await fetch(`${API_URL}/users/${userId}/role`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ role }),
  });
  if (!res.ok) throw new Error("역할 변경 실패");
  return res.json();
};

export const updateUserTeam = async (userId, team) => {
  const res = await fetch(`${API_URL}/users/${userId}/team`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ team }),
  });
  if (!res.ok) throw new Error("팀 변경 실패");
  return res.json();
};

