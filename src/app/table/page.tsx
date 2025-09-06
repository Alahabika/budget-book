"use client";
import "@/app/table/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useState, useMemo } from "react";
import ScrollPicker from "react-scroll-picker";

// 仮のデータを定義
const Expenses = [
  { date: "2025-09-05", amount: 3500 },
  { date: "2025-09-05", amount: 2500 },
  { date: "2025-09-10", amount: 1500 },
  { date: "2025-09-15", amount: 5000 },
  { date: "2025-09-20", amount: 200 },
];

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 8)); // 2025年9月を初期値に
  const [showMonthSelector, setShowMonthSelector] = useState(false);

  // 前月へ移動
  const goToPrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  // 次月へ移動
  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };
  //年月選択の表示の可否
  const toggleMonthSelector = () => {
    setShowMonthSelector((prev) => !prev);
  };
  //表示されている月の取得
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const calendarDays = [];
  const startDayOfWeek = firstDay.getDay();

  // 前月の空白部分
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // 今月の日付（Dateオブジェクトとして格納）
  for (let i = 1; i <= lastDay.getDate(); i++) {
    calendarDays.push(new Date(year, month, i));
  }

  const expensesByDate = {};
  Expenses.forEach((expense) => {
    const expenseDate = new Date(expense.date);
    const dateKey = `${expenseDate.getFullYear()}-${String(
      expenseDate.getMonth() + 1
    ).padStart(2, "0")}-${String(expenseDate.getDate() - 1).padStart(2, "0")}`;
    expensesByDate[dateKey] = (expensesByDate[dateKey] || 0) + expense.amount; // 同じ日付の出費を合計
  });
  const monthlyExpenses = Expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return (
      expenseDate.getFullYear() === year && expenseDate.getMonth() === month
    );
  });
  const totalIncome = monthlyExpenses
    .filter((expense) => expense.amount > 0)
    .reduce((sum, expense) => sum + expense.amount, 0);

  const totalExpense = monthlyExpenses
    .filter((expense) => expense.amount < 0)
    .reduce((sum, expense) => sum + expense.amount, 0);

  const totalBalance = totalIncome + totalExpense;
  return (
    <div className="container mt-4">
      {/* 年月と切り替えボタン */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button className="btn btn-outline-secondary" onClick={goToPrevMonth}>
          &lt;
        </button>
        <div className="position-relative">
          <button
            className="text-center yearAndMonth fs-2"
            onClick={toggleMonthSelector}
          >
            {year}年 {month + 1}月
          </button>
          {/*年月選択のドロップダウン */}
          {showMonthSelector && (
            <div className="month-selector-dropdown position-absolute top-100 start-50 translate-middle-x mt-2">
              {/* 年の選択リスト */}
              <div className="d-flex justify-content-center mb-2">
                <select
                  className="form-select w-auto"
                  onChange={(e) => {
                    const newYear = parseInt(e.target.value);
                    setCurrentDate(new Date(newYear, currentDate.getMonth()));
                  }}
                  value={year}
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={year - 5 + i} value={year - 5 + i}>
                      {year - 5 + i}年
                    </option>
                  ))}
                </select>
              </div>

              {/* 月の選択リスト */}
              <div
                className="d-flex flex-wrap justify-content-center"
                style={{ maxWidth: "250px" }}
              >
                {[...Array(12)].map((_, i) => (
                  <button
                    key={i}
                    className={`btn m-1 ${
                      currentDate.getMonth() === i
                        ? "btn-primary"
                        : "btn-outline-primary"
                    }`}
                    onClick={() => {
                      setCurrentDate(new Date(year, i));
                      setShowMonthSelector(false);
                    }}
                  >
                    {i + 1}月
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <button className="btn btn-outline-secondary" onClick={goToNextMonth}>
          &gt;
        </button>
      </div>

      <div className="row text-center border-bottom pb-2">
        {["日", "月", "火", "水", "木", "金", "土"].map((day) => (
          <div key={day} className="col">
            <strong>{day}</strong>
          </div>
        ))}
      </div>
      <div className="row">
        {calendarDays.map((date, index) => (
          <div key={index} className="col col_d text-center py-2 border">
            {date ? (
              <>
                <div className="fw-bold">{date.getDate()}</div>
                {/* 日付に出費があれば表示 */}
                {expensesByDate[date.toISOString().slice(0, 10)] && (
                  <div className="text-danger fw-bold">
                    -¥{expensesByDate[date.toISOString().slice(0, 10)]}
                  </div>
                )}
              </>
            ) : (
              <div className="text-muted"></div>
            )}
          </div>
        ))}
        <div
          className="mt-5 p-3 rounded shadow-sm"
          style={{ backgroundColor: "#f8f9fa" }}
        >
          <div className="d-flex justify-content-around fw-bold">
            <div className="text-success">
              収入: ¥{totalIncome.toLocaleString()}
            </div>
            <div className="text-danger">
              出費: ¥{-totalExpense.toLocaleString()}
            </div>
            <div>合計: ¥{totalBalance.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
