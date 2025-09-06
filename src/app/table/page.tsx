"use client";
import "@/app/table/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useState } from "react";
const Expenses = [
  { date: "2025-09-05", amount: 3500 },
  { date: "2025-09-10", amount: 1500 },
  { date: "2025-09-15", amount: 5000 },
  { date: "2025-09-20", amount: 200 },
];
export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  //前の月に移動
  const goToPrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };
  //来月に移動
  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const calendarDays = [];
  const startDayOfWeek = firstDay.getDay(); // 曜日のインデックス（0:日, 1:月...）
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= lastDay.getDate(); i++) {
    calendarDays.push(i);
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button className="btn btn-outline-secondary" onClick={goToPrevMonth}>
          &lt;
        </button>
        <h2 className="text-center">
          {year}年 {month + 1}月
        </h2>
        <button className="btn btn-outline-secondary" onClick={goToNextMonth}>
          &gt;
        </button>
      </div>
      <h2 className="text-center">
        {year}年 {month + 1}月
      </h2>
      <div className="row text-center border-bottom pb-2">
        {["日", "月", "火", "水", "木", "金", "土"].map((day) => (
          <div key={day} className="col">
            <strong>{day}</strong>
          </div>
        ))}
      </div>
      <div className="row">
        {calendarDays.map((day, index) => (
          <div key={index} className="col text-center py-2 border">
            {day ? (
              <div className="fw-bold">{day}</div>
            ) : (
              <div className="text-muted"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
