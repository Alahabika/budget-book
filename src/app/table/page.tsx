"use client";
import "@/app/table/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useState, useEffect } from "react";
import ScrollPicker from "react-scroll-picker";
import { getAllBudgets } from "../../../utils/supabasefunctions";

// 仮のデータを定義
type Expense = {
  id: number;
  amount: number;
  category: string;
  type: "+" | "-";
  date: string;
};

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 8)); // 2025年9月を初期値に
  const [showMonthSelector, setShowMonthSelector] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const fetchExpenses = async () => {
      const { data, error } = await getAllBudgets();
      console.log("data:", data, "error:", error);

      if (error) {
        console.error("Error fetching expenses:", error);
      }
      if (data) {
        setExpenses(data as Expense[]);
      } else {
        setExpenses([]); // ← null の場合に保険
      }
    };
    fetchExpenses();
  }, []);

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

  const expensesByDate: Record<string, number> = {};
  expenses.forEach((expense) => {
    const dateKey = expense.date; // ← Date にせずそのまま使う
    expensesByDate[dateKey] = (expensesByDate[dateKey] || 0) + expense.amount;
  });

  const monthlyExpenses = expenses.filter((expense) => {
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
  // 現在表示している月の取引だけを抽出
  const currentMonthExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return (
      expenseDate.getFullYear() === currentDate.getFullYear() &&
      expenseDate.getMonth() === currentDate.getMonth()
    );
  });
  //日付を新しい順に並び変える
  const sortedExpenses = [...currentMonthExpenses].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });
  return (
    <div className="container mt-4">
      {/* 年月と切り替えボタン */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button className="btn btn-outline-secondary" onClick={goToPrevMonth}>
          &lt;
        </button>
        <button
          className="text-center yearAndMonth fs-2"
          onClick={toggleMonthSelector}
        >
          {year}年 {month + 1}月
        </button>

        <button className="btn btn-outline-secondary" onClick={goToNextMonth}>
          &gt;
        </button>
      </div>
    <div className="calendar-wrapper w-100">
      <div className="row text-center border-bottom pb-2">
        {["日", "月", "火", "水", "木", "金", "土"].map((day) => (
          <div key={day} className="col">
            <strong>{day}</strong>
          </div>
        ))}
      </div>
      {calendarDays.map((date, index) => {
        // 週の最初なら <div className="row"> を開始
        if (index % 7 === 0) {
          return (
            <div className="row" key={index}>
              {calendarDays.slice(index, index + 7).map((d, i) => {
                const dateKey = d ? d.toLocaleDateString("sv-SE") : "";
                return (
                  <div key={i} className="col col_d text-center py-2 border">
                    {d ? (
                      <>
                        {/*その日の支出を合計して収入の方が多いのなら緑色、そうでないなら赤色*/}
                        <div className="fw-bold">{d.getDate()}</div>
                        {expensesByDate[dateKey] && (
                          <div
                            className={` ${
                              expensesByDate[dateKey] >= 0
                                ? "text-success"
                                : "text-danger"
                            }`}
                          >
                            {expensesByDate[dateKey] >= 0
                              ? `+¥${expensesByDate[dateKey]}`
                              : `-¥${expensesByDate[dateKey] * -1}`}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-muted"></div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        }
        return null; // 7日単位でまとめたので他は null
      })}
    </div>
      <div
        className="mt-5 p-3 rounded shadow-sm"
        style={{ backgroundColor: "#f8f9fa" }}
      >
        <div className="d-flex justify-content-around fw-bold">
          <div className="text-success">
            収入: ¥{totalIncome.toLocaleString()}
          </div>
          <div className="text-danger">
            出費: -¥{(totalExpense * -1).toLocaleString()}
          </div>
          <div>合計: ¥{totalBalance.toLocaleString()}</div>
        </div>
      </div>
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="cute-submit-btn"
      >
        {showDetails ? "詳細を非表示" : "詳細を表示"}
      </button>
      {/* 詳細表示エリア*/}
      {showDetails && (
        <div className="details-table mt-4">
          <h2>取引詳細</h2>
          <ul>
            {/* 並び替えた配列をmap()で表示 */}
            {sortedExpenses.map((item) => (
              <li key={item.id}>
                {item.date} - {item.category}({item.memo}): {item.type}
                {Math.abs(item.amount)}円
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
