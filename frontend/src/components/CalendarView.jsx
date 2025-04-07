// 📁 src/components/CalendarView.jsx
import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { fetchTasks } from "../services/api";

function CalendarView() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const loadTasks = async () => {
      const tasks = await fetchTasks();
      const events = tasks.map((task) => ({
        id: task.id,
        title: task.task_title,
        start: task.task_datetime,
        color: task.task_priority === 1 ? "#f00" : "#2196f3"
      }));
      setEvents(events);
    };
    loadTasks();
  }, []);

  return (
    <div style={{ marginTop: "30px" }}>
      <h3>📅 일정 캘린더</h3>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        height={600}
      />
    </div>
  );
}

export default CalendarView;
