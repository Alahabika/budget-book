"use client";
import "@/app/input/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useState } from "react";
import { supabase } from "../../../utils/supabase";
import {
  FaMoneyBillWave,
  FaWallet,
  FaUtensils,
  FaShoppingBag,
  FaSubway,
  FaFilm,
  FaPiggyBank,
  FaMoneyCheckAlt,
  FaPlus,
  FaCarrot,
} from "react-icons/fa";

const categoryIcons = {
  食費: <FaCarrot />,
  外食費: <FaUtensils />,
  日用品: <FaShoppingBag />,
  交通費: <FaSubway />,
  娯楽費: <FaFilm />,
  その他: <FaPlus />,
  給与: <FaMoneyBillWave />,
  お小遣い: <FaPiggyBank />,
  その他収入: <FaMoneyCheckAlt />,
};

export default function Input() {
  const today = new Date();
  const JST_OFFSET = 9 * 60;
  const utc = today.getTime() + today.getTimezoneOffset() * 60 * 1000;
  const jstDate = new Date(utc + JST_OFFSET * 60 * 1000);
  const formattedDate = jstDate.toISOString().slice(0, 10);
  const [date, setDate] = useState(formattedDate);
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [category, setCategory] = useState("食費");
  const [isIncome, setIsIncome] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let finalAmount = parseInt(amount, 10);
    if (!isIncome) {
      // 支出の場合、金額をマイナスにする
      finalAmount = -finalAmount;
    }
    const { data, error } = await supabase.from("transactions").insert([
      {
        date,
        amount: finalAmount,
        memo,
        category,
        type: isIncome ? "+" : "-",
      },
    ]);

    if (error) {
      console.error("Error inserting data:", error);
    } else {
      console.log("Inserted:", data);
      // 入力リセット
      setDate(new Date().toISOString().slice(0, 10));
      setAmount("");
      setMemo("");
      setCategory(isIncome ? "給与" : "食費");
      console.log("家計簿が記録されました");
    }
  };

  const handleIncomeClick = () => {
    setIsIncome(true);
    setCategory("給与");
  };
  const handleExpenseClick = () => {
    setIsIncome(false);
    setCategory("食費");
  };
  return (
    <div className="cute-container">
      <h1 className="cute-title">家計簿入力</h1>
      <div className="cute-buttons">
        <button
          className={`cute-btn ${
            !isIncome ? "cute-btn-primary" : "cute-btn-outline"
          }`}
          onClick={handleExpenseClick}
        >
          <FaWallet className="me-2" />
          支出
        </button>
        <button
          className={`cute-btn ${
            isIncome ? "cute-btn-primary" : "cute-btn-outline"
          }`}
          onClick={handleIncomeClick}
        >
          <FaMoneyBillWave className="me-2" />
          収入
        </button>
      </div>
      <form onSubmit={handleSubmit} className="cute-form">
        <div className="cute-input-group">
          <label htmlFor="date" className="cute-label">
            日付
          </label>
          <input
            type="date"
            className="cute-form-control"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="cute-input-group">
          <label htmlFor="amount" className="cute-label">
            金額
          </label>
          <input
            type="number"
            className="cute-form-control"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div className="cute-input-group">
          <label htmlFor="category" className="cute-label">
            カテゴリー
          </label>
          <div className="cute-select-wrapper">
            <select
              id="category"
              className="cute-form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {isIncome ? (
                <>
                  <option>給与</option>
                  <option>お小遣い</option>
                  <option>その他収入</option>
                </>
              ) : (
                <>
                  <option>食費</option>
                  <option>外食費</option>
                  <option>日用品</option>
                  <option>交通費</option>
                  <option>娯楽費</option>
                  <option>その他</option>
                </>
              )}
            </select>
            {categoryIcons[category as keyof typeof categoryIcons]}
          </div>
        </div>

        <div className="cute-input-group">
          <label htmlFor="memo" className="cute-label">
            メモ
          </label>
          <input
            type="text"
            className="cute-form-control"
            id="memo"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />
        </div>
        <button type="submit" className="cute-submit-btn">
          記録する
        </button>
      </form>
    </div>
  );
}
