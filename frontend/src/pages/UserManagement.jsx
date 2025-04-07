// frontend/src/pages/UserManagement.jsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  getUsers,
  updateUserRole,
  updateUserTeam,
  deleteUser
} from "../services/api";

const PageContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
`;

const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 16px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
`;

const Th = styled.th`
  background: #f0f0f0;
  padding: 12px;
  text-align: left;
  border-bottom: 2px solid #ddd;
`;

const Td = styled.td`
  padding: 10px;
  border-bottom: 1px solid #eee;
`;

const Select = styled.select`
  padding: 6px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const Button = styled.button`
  background-color: #d9534f;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #c9302c;
  }
`;

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const roleOptions = ["user", "leader", "admin"];
  const teamOptions = ["General", "Engineering", "Design", "Marketing"];

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
      setLoading(false);
    } catch (err) {
      alert("유저 목록 조회 실패");
      console.error(err);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await updateUserRole(id, newRole);
      loadUsers();
    } catch (err) {
      alert("역할 변경 실패");
    }
  };

  const handleTeamChange = async (id, newTeam) => {
    try {
      await updateUserTeam(id, newTeam);
      loadUsers();
    } catch (err) {
      alert("팀 변경 실패");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("정말로 삭제하시겠습니까?")) return;
    try {
      await deleteUser(id);
      loadUsers();
    } catch (err) {
      alert("유저 삭제 실패");
    }
  };

  return (
    <PageContainer>
      <Title>유저 관리</Title>
      {loading ? (
        <p>불러오는 중...</p>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>ID</Th>
              <Th>아이디</Th>
              <Th>이메일</Th>
              <Th>역할</Th>
              <Th>팀</Th>
              <Th>삭제</Th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <Td>{user.id}</Td>
                <Td>{user.username}</Td>
                <Td>{user.email}</Td>
                <Td>
                  <Select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  >
                    {roleOptions.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </Select>
                </Td>
                <Td>
                  <Select
                    value={user.team}
                    onChange={(e) => handleTeamChange(user.id, e.target.value)}
                  >
                    {teamOptions.map((team) => (
                      <option key={team} value={team}>
                        {team}
                      </option>
                    ))}
                  </Select>
                </Td>
                <Td>
                  <Button onClick={() => handleDelete(user.id)}>삭제</Button>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </PageContainer>
  );
}

export default UserManagement;

