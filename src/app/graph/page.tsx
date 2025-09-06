"use client";
import "@/app/login/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { supabase } from "../../../utils/supabase";
ChartJS.register(ArcElement, Tooltip, Legend);

type Expense = {
  id: number;
  amount: number;
  category: string;
  type: "+" | "-";
  date: string;
};

export default function Graph() {
  const today = new Date();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
  const fetchExpenses = async () => {
    const { data, error } = await supabase.from("transactions").select("*");
    if (error) {
      console.error("Error fetching data:", error);
    } else {
      setExpenses(data || []);
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
  //表示されている年月と同じ月のデータを取り出す
  const currentMonthExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return (
      expense.amount < 0 &&
      expenseDate.getFullYear() === year &&
      expenseDate.getMonth() === month
    );
  });
  // カテゴリーごとに合計金額を計算
  const expensesByCategory = currentMonthExpenses.reduce<
    Record<string, number>
  >((acc, expense) => {
    const amount = Math.abs(expense.amount);
    acc[expense.category] = (acc[expense.category] || 0) + amount;
    return acc;
  }, {});

  // グラフに渡すデータを整形
  const chartData = {
    labels: Object.keys(expensesByCategory),
    datasets: [
      {
        data: Object.values(expensesByCategory),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
      },
      title: {
        display: true,
        text: "今月のカテゴリー別出費",
        font: {
          size: 20,
        },
      },
    },
  };
  return (
    <div className="container d-flex flex-column align-items-center mt-5">
      {/* 年月と切り替えボタン */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button className="btn btn-outline-secondary" onClick={goToPrevMonth}>
          &lt;
        </button>
        <div className="position-relative">
          <button className="text-center yearAndMonth fs-2">
            {year}年 {month + 1}月
          </button>
          <button className="btn btn-outline-secondary" onClick={goToNextMonth}>
            &gt;
          </button>
        </div>
      </div>
      <div style={{ position: "relative", height: "50vw", width: "50vw" }}>
        <Pie data={chartData} options={options} />
      </div>
      {/*グラフの下にカテゴリー別の合計金額を表示する */}
      <div className="mt-5 w-100" style={{ maxWidth: "400px" }}>
        <ul className="list-group">
          {Object.entries(expensesByCategory).map(([category, amount]) => (
            <li
              key={category}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {category}
              <span className="">¥{amount.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
