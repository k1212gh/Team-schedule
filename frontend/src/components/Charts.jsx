import React, { useEffect, useState } from "react";
import { fetchTasks } from "../services/api";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

function Charts() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadStats = async () => {
      const tasks = await fetchTasks();
      const priorities = [1, 2, 3, 4].map((p) => ({
        name: `우선순위 ${p}`,
        value: tasks.filter((t) => t.task_priority === p).length,
      }));
      setData(priorities);
    };
    loadStats();
  }, []);

  return (
    <div style={{ marginTop: 40 }}>
      <h3>📊 우선순위별 일정 분포</h3>
      <PieChart width={400} height={300}>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}

export default Charts;
