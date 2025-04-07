import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchTeamInfo, inviteUserToTeam } from "../services/api";

/**
 * 팀 상세 페이지
 * - 팀 정보, 팀원 목록
 * - 특정 유저 초대 (userId로 팀 가입)
 */
function TeamInfoPage() {
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [inviteUserId, setInviteUserId] = useState("");

  const loadTeam = async () => {
    try {
      const data = await fetchTeamInfo(teamId);
      // 백엔드에서 { team: {...}, members: [...] } 형태 반환
      setTeam(data.team);
      setMembers(data.members || []);
    } catch (err) {
      alert(err.message || "팀 정보 불러오기 실패");
    }
  };

  useEffect(() => {
    loadTeam();
  }, [teamId]);

  const handleInvite = async () => {
    if (!inviteUserId) return;
    try {
      await inviteUserToTeam(inviteUserId, teamId);
      alert("초대 성공");
      setInviteUserId("");
      loadTeam();
    } catch (err) {
      alert(err.message || "초대 실패");
    }
  };

  if (!team) return <div>로딩중...</div>;

  return (
    <div style={{ margin: 20 }}>
      <h2>팀 상세</h2>
      <p>ID: {team.id}</p>
      <p>이름: {team.name}</p>
      <p>설명: {team.description}</p>

      <hr />
      <h3>팀원 목록</h3>
      <ul>
        {members.map((m) => (
          <li key={m.id}>
            {m.username} ({m.role})
          </li>
        ))}
      </ul>

      <hr />
      <h3>사용자 초대</h3>
      <div>
        <label>유저 ID</label>
        <input
          value={inviteUserId}
          onChange={(e) => setInviteUserId(e.target.value)}
          placeholder="초대할 user의 ID"
        />
        <button onClick={handleInvite}>초대</button>
      </div>
    </div>
  );
}

export default TeamInfoPage;

