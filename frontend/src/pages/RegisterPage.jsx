import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { registerApi } from "../services/api";

/**
 * - 관리자만 이 페이지로 접근할 수 있다고 가정하면,
 *   SchedulePage나 UserManagement에서 /register 로 라우팅할 수도 있음
 * - 간단 예시: role, teamId 등을 입력
 */
function RegisterPage() {
  const { user } = useContext(AuthContext);  // user.role === 'admin' 이면 가능
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [teamId, setTeamId] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!user || user.role !== "admin") {
      return alert("관리자만 접근 가능합니다!");
    }
    try {
      await registerApi(username, password, role, teamId);
      alert("등록 성공");
      setUsername(""); setPassword(""); setRole("user"); setTeamId("");
    } catch (err) {
      setError(err.message || "등록 실패");
    }
  };

  return (
    <div style={{ margin: "40px" }}>
      <h2>사용자 등록</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
        <label>아이디</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <label>비밀번호</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div>
        <label>역할</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="user">사용자</option>
          <option value="leader">리더</option>
          <option value="admin">관리자</option>
        </select>
      </div>
      <div>
        <label>팀 ID</label>
        <input value={teamId} onChange={(e) => setTeamId(e.target.value)} placeholder="없으면 공백" />
      </div>

      <button onClick={handleRegister}>등록</button>
    </div>
  );
}

export default RegisterPage;

