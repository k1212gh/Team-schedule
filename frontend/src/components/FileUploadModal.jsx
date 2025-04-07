import React, { useState } from "react";
import styled from "styled-components";
import { uploadFileLink } from "../services/api";

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
  background-color: ${(props) => (props.cancel ? "#aaa" : "#28a745")};
  border-radius: 4px;
`;

function FileUploadModal({ taskId, onClose, onUploaded }) {
  const [fileUrl, setFileUrl] = useState("");
  const [fileName, setFileName] = useState("");

  const handleSubmit = async () => {
    try {
      await uploadFileLink(taskId, fileUrl, fileName);
      alert("업로드 성공");
      onUploaded();
      onClose();
    } catch (err) {
      alert("업로드 실패");
    }
  };

  return (
    <>
      <Backdrop onClick={onClose} />
      <Modal>
        <h3>🔗 파일 업로드</h3>
        <Input
          placeholder="Google Drive 링크"
          value={fileUrl}
          onChange={(e) => setFileUrl(e.target.value)}
        />
        <Input
          placeholder="파일명"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
        />
        <div>
          <Button onClick={handleSubmit}>업로드</Button>
          <Button cancel onClick={onClose}>취소</Button>
        </div>
      </Modal>
    </>
  );
}

export default FileUploadModal;

