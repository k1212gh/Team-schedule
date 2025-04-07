// 📁 src/components/NotificationBell.jsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";

const BellWrapper = styled.div`
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 9999;
`;

const BellButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 24px;
  position: relative;
`;

const Badge = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  background: red;
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 50%;
`;

const NotificationPanel = styled.div`
  position: absolute;
  top: 36px;
  right: 0;
  width: 300px;
  max-height: 300px;
  overflow-y: auto;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  padding: 10px;
  display: ${(props) => (props.visible ? "block" : "none")};
`;

const NotificationItem = styled.div`
  padding: 10px;
  border-bottom: 1px solid #eee;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background-color: #f9f9f9;
  }
`;

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [visible, setVisible] = useState(false);
  const [latest, setLatest] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await fetch("/team-api/api/notifications", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setNotifications(data);
      const unread = data.find((n) => !n.is_read);
      if (unread) {
        setLatest(unread);
        setTimeout(() => setLatest(null), 5000); // 5초 후 자동 숨김
      }
    };
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    await fetch(`/team-api/api/notifications/${id}/read`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <BellWrapper>
      <BellButton onClick={() => setVisible(!visible)}>
        🔔
        {unreadCount > 0 && <Badge>{unreadCount}</Badge>}
      </BellButton>
      {latest && (
        <NotificationPanel visible={true}>
          <NotificationItem onClick={() => markAsRead(latest.id)}>
            <b>📢 {latest.message}</b>
          </NotificationItem>
        </NotificationPanel>
      )}
      <NotificationPanel visible={visible}>
        {notifications.map((noti) => (
          <NotificationItem
            key={noti.id}
            style={{ fontWeight: noti.is_read ? "normal" : "bold" }}
            onClick={() => markAsRead(noti.id)}
          >
            {noti.message}
          </NotificationItem>
        ))}
      </NotificationPanel>
    </BellWrapper>
  );
}

export default NotificationBell;

