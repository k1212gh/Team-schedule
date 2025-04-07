// 📁 src/pages/SchedulePage.jsx
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { fetchTasks, createTaskApi, deleteTaskApi } from "../services/api";
import CalendarView from "../components/CalendarView";
import Charts from "../components/Charts";
import TaskFormModal from "../components/TaskFormModal";
import ChatNotification from "../components/ChatNotification";
import { useNavigate } from "react-router-dom";

function SchedulePage() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [noti, setNoti] = useState("");

  const loadTasks = async () => {
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch {
      setNoti("일정 목록 불러오기 실패");
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("정말 삭제할까요?")) return;
    try {
      await deleteTaskApi(taskId);
      loadTasks();
      setNoti("일정 삭제 완료");
    } catch {
      setNoti("삭제 실패");
    }
  };

  return (
    <div style={{ margin: "40px" }}>
      <h2>📅 스케줄 페이지</h2>
      <p>현재 로그인: {user?.username} / 역할: {user?.role}</p>
      <button onClick={() => setUser(null)}>로그아웃</button>
      {user.role === "admin" && <button onClick={() => navigate("/register")}>사용자 등록</button>}
      <button onClick={() => navigate("/teams")}>팀 목록</button>
      <button onClick={() => setShowModal(true)}>새 일정 추가</button>

      {showModal && (
        <TaskFormModal
          onClose={() => setShowModal(false)}
          onCreated={loadTasks}
        />
      )}

      <CalendarView />
      <Charts />

      <h3 style={{ marginTop: 30 }}>📝 일정 목록</h3>
      <ul>
        {tasks.map((t) => (
          <li key={t.id}>
            <b>[{t.task_priority}] {t.task_title}</b> - {t.task_datetime}
            <button onClick={() => navigate(`/task/${t.id}`)}>상세</button>
            {(user.role === "admin" || user.id === t.created_by) && (
              <button onClick={() => handleDeleteTask(t.id)}>삭제</button>
            )}
          </li>
        ))}
      </ul>

      <ChatNotification message={noti} onClose={() => setNoti("")} />
    </div>
  );
}

export default SchedulePage;

