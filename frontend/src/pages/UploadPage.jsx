// 📁 src/pages/UploadPage.jsx
import React, { useState } from "react";
import FileUploadModal from "../components/FileUploadModal";

function UploadPage() {
  const [taskId, setTaskId] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleOpen = () => {
    if (!taskId) return alert("일정 ID를 입력해주세요");
    setShowModal(true);
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>📎 파일 업로드 페이지</h2>
      <input
        placeholder="일정 ID 입력"
        value={taskId}
        onChange={(e) => setTaskId(e.target.value)}
      />
      <button onClick={handleOpen}>업로드 창 열기</button>

      {showModal && (
        <FileUploadModal
          taskId={taskId}
          onClose={() => setShowModal(false)}
          onUploaded={() => alert("업로드 완료 후 후처리")}
        />
      )}
    </div>
  );
}

export default UploadPage;

