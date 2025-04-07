import React, { useEffect, useState } from "react";
import { fetchTeams, createTeam } from "../services/api";
import { useNavigate } from "react-router-dom";

/**
 * - 팀 목록 / 팀 생성 폼
 * - 백엔드에서 GET /api/team → 팀 목록을 반환하도록 해야 함
 */
function TeamListPage() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDesc, setNewTeamDesc] = useState("");

  const loadTeams = async () => {
    try {
      const data = await fetchTeams();
      // 백엔드에서 전체 팀 목록을 반환한다고 가정
      setTeams(data);
    } catch (err) {
      alert("팀 목록 불러오기 실패");
    }
  };

  useEffect(() => {
    loadTeams();
  }, []);

  const handleCreateTeam = async () => {
    if (!newTeamName) return alert("팀 이름 입력");
    try {
      await createTeam(newTeamName, newTeamDesc);
      alert("팀 생성 완료");
      setNewTeamName("");
      setNewTeamDesc("");
      loadTeams();
    } catch (err) {
      alert(err.message || "팀 생성 실패");
    }
  };

  return (
    <div style={{ margin: 20 }}>
      <h2>팀 목록</h2>
      <div style={{ marginBottom: 20 }}>
        <input
          value={newTeamName}
          onChange={(e) => setNewTeamName(e.target.value)}
          placeholder="팀 이름"
        />
        <input
          value={newTeamDesc}
          onChange={(e) => setNewTeamDesc(e.target.value)}
          placeholder="설명"
        />
        <button onClick={handleCreateTeam}>팀 생성</button>
      </div>
      <ul>
        {teams.map((team) => (
          <li key={team.id}>
            <b>{team.name}</b> - {team.description}
            {" "}
            <button onClick={() => navigate(`/team/${team.id}`)}>자세히</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TeamListPage;

