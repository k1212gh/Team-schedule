import React from "react";
import styled from "styled-components";

const NotiContainer = styled.div`
  position: fixed;
  top: 16px;
  right: 16px;
  background: #f44336;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
`;

function ChatNotification({ message, onClose }) {
  return message ? (
    <NotiContainer onClick={onClose}>
      📢 {message} (클릭하여 닫기)
    </NotiContainer>
  ) : null;
}

export default ChatNotification;
