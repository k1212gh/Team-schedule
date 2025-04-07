import React, { useState } from "react";
import styled from "styled-components";
import { createTaskApi } from "../services/api";

const Backdrop = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.5);
  z-index: 1000;
`;

const Modal = styled.div`
  position: fixed;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 24px;
  width: 400px;
  border-radius: 8px;
  z-index: 1001;
`;

const Input = styled.input`
  width: 100%;
  margin-bottom: 12px;
  padding: 10px;
  border: 1px solid #ccc;
`;

const Button = styled.button`
  padding: 10px 16px;
  margin-right: 10px;
  border: none;
  color: white;
  background-color: ${(props) => (props.cancel ? "#aaa" : "#007bff")};
  border-radius: 4px;
`;

function TaskFormModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    task_title: "",
    task_desc: "",
    task_datetime: "",
    task_priority: 2,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.task_title || !form.task_datetime) {
      alert("제목과 시간은 필수입니다.");
      return;
    }
    try {
      await createTaskApi(form);
      alert("일정이 등록되었습니다.");
      onCreated(); // 외부에서 목록 새로고침
      onClose();   // 모달 닫기
    } catch (err) {
      alert("일정 등록 실패");
    }
  };

  return (
    <>
      <Backdrop onClick={onClose} />
      <Modal>
        <h3>새 일정 등록</h3>
        <Input name="task_title" placeholder="제목" value={form.task_title} onChange={handleChange} />
        <Input name="task_desc" placeholder="설명" value={form.task_desc} onChange={handleChange} />
        <Input name="task_datetime" type="datetime-local" value={form.task_datetime} onChange={handleChange} />
        <Input name="task_priority" type="number" min="1" max="4" value={form.task_priority} onChange={handleChange} />
        <div>
          <Button onClick={handleSubmit}>등록</Button>
          <Button cancel onClick={onClose}>취소</Button>
        </div>
      </Modal>
    </>
  );
}

export default TaskFormModal;

