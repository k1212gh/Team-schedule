import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  updateTaskApi,
  deleteTaskApi,
  fetchCommentsByTask,
  createComment
} from "../services/api";

/** 
 * 일정 상세 / 댓글 UI
 * 일정 상세 조회 API가 필요하다면, 백엔드에 GET /api/tasks/:taskId 추가 구현 필요
 * 여기서는 tasks 전체 목록에서 필터링하거나, 
 * 직접 DB 조회 로직을 구현했다고 가정.
 */
function TaskDetailPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();

  // 일정/댓글 정보
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDateTime, setTaskDateTime] = useState("");
  const [taskPriority, setTaskPriority] = useState(1);
  
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  // TODO: 일정 상세 로딩 API 필요
  // 일단 this page can do partial demonstration

  const loadComments = async () => {
    try {
      const data = await fetchCommentsByTask(taskId);
      setComments(data);
    } catch (err) {
      alert("댓글 로딩 실패");
    }
  };

  useEffect(() => {
    // 여기서 일정 상세를 불러오는 API가 있다면 로드
    // loadTaskDetail(taskId)
    loadComments();
    // eslint-disable-next-line
  }, [taskId]);

  const handleUpdateTask = async () => {
    try {
      await updateTaskApi(taskId, {
        task: taskTitle,
        task_datetime: taskDateTime,
        task_priority: taskPriority
      });
      alert("일정 수정완료");
    } catch (err) {
      alert(err.message || "일정 수정 실패");
    }
  };

  const handleDeleteTask = async () => {
    if (!window.confirm("정말 삭제할까요?")) return;
    try {
      await deleteTaskApi(taskId);
      alert("삭제되었습니다");
      navigate("/");
    } catch (err) {
      alert(err.message || "삭제 실패");
    }
  };

  const handleAddComment = async () => {
    if (!commentText) return;
    try {
      await createComment(taskId, commentText);
      setCommentText("");
      loadComments();
    } catch (err) {
      alert(err.message || "댓글 등록 실패");
    }
  };

  return (
    <div style={{ margin: 20 }}>
      <h2>일정 상세: {taskId}</h2>
      <div style={{ border: "1px solid #ddd", padding: 10 }}>
        <label>제목</label>
        <input
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          placeholder="수정할 제목"
        />
        <br />
        <label>시간</label>
        <input
          type="datetime-local"
          value={taskDateTime}
          onChange={(e) => setTaskDateTime(e.target.value)}
        />
        <br />
        <label>우선순위</label>
        <select
          value={taskPriority}
          onChange={(e) => setTaskPriority(e.target.value)}
        >
          <option value={1}>낮음</option>
          <option value={2}>보통</option>
          <option value={3}>높음</option>
          <option value={4}>매우 높음</option>
        </select>
        <br />
        <button onClick={handleUpdateTask}>일정 수정</button>
        <button onClick={handleDeleteTask}>일정 삭제</button>
      </div>

      <hr />

      <h3>댓글</h3>
      <div style={{ marginBottom: 12 }}>
        <input
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="@홍길동 이렇게 멘션"
        />
        <button onClick={handleAddComment}>등록</button>
      </div>
      <ul>
        {comments.map((c) => (
          <li key={c.id}>
            <b>{c.username}:</b> {c.content} <br/>
            <small>({c.created_at})</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskDetailPage;

