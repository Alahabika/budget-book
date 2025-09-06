"use client";
import "@/app/table/globals.css";
import { useState } from "react";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // 今月の最初の日と最後の日を取得
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // カレンダーの配列を生成
  const calendarDays = [];
  const startDayOfWeek = firstDay.getDay(); // 曜日のインデックス（0:日, 1:月...）

  // 前月の空白部分
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // 今月の日付
  for (let i = 1; i <= lastDay.getDate(); i++) {
    calendarDays.push(i);
  }

  return (
    <div className="container mt-4">
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
