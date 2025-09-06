"use client";
import "@/app/input/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useState } from "react";
export default function Input() {
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [category, setCategory] = useState("食費");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEntry = {
      date: date,
      amount: amount,
      memo: memo,
      category: category,
    };
    console.log(newEntry);
    setDate("");
    setAmount("");
    setMemo("");
    setCategory("食費");
    console.log("家計簿が記録されました");
  };
  return (
    <div className="container d-flex flex-column align-items-center mt-5">
      <h1 className="mb-4">家計簿入力</h1>
      <form
        onSubmit={handleSubmit}
        className="w-100"
        style={{ maxWidth: "400px" }}
      >
        <div className="mb-3">
          <label htmlFor="date" className="form-label">
            日付
          </label>
          <input
            type="date"
            className="form-control"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="amount" className="form-label">
            金額
          </label>
          <input
            type="number"
            className="form-control"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="category" className="form-label">
            カテゴリー
          </label>
          <select
            id="category"
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>食費</option>
            <option>外食費</option>
            <option>日用品</option>
            <option>交通費</option>
            <option>娯楽費</option>
            <option>その他</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="memo" className="form-label">
            メモ
          </label>
          <input
            type="text"
            className="form-control"
            id="memo"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          記録する
        </button>
      </form>
    </div>
  );
}
