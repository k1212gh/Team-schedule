import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { loginApi } from "../services/api";

function LoginPage() {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const data = await loginApi(username, password);
      // data: { token, id, username, role, team, ...}
      localStorage.setItem("token", data.token); 
      setUser({
        id: data.id,
        username: data.username,
        role: data.role,
        team: data.team
      });
      navigate("/");
    } catch (err) {
      alert(err.message || "로그인 실패");
    }
  };

  return (
    <div style={{ margin: "40px" }}>
      <h2>로그인</h2>
      <div>
        <label>아이디</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="아이디"
        />
      </div>
      <div>
        <label>비밀번호</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
        />
      </div>
      <button onClick={handleLogin}>로그인</button>
    </div>
  );
}

export default LoginPage;

