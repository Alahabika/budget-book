import "@/app/globals.css";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import React from "react";

export default function Header() {
  return (
    <header className="py-2 bg-light fixed-bottom border-top">
      {" "}
      {/* ヘッダーのスタイル */}
      <nav className="container-fluid">
        <ul className="nav justify-content-center nav-justified">
          <li className="nav-item">
            {/* 入力画面*/}
            <Link href="/input" className="nav-link text-dark header-icon-link">
              <i className="bi bi-pencil-fill me-1 cute-icon"></i>
              <span className="d-none d-sm-inline ms-1 cute-label">
                入力画面
              </span>
            </Link>
          </li>
          <li className="nav-item">
            {/* お家アイコン */}
            <Link href="/homes" className="nav-link text-dark header-icon-link">
              <i className="bi bi-house-fill me-1 cute-icon"></i>
              <span className="d-none d-sm-inline ms-1 cute-label">
                ホーム画面
              </span>
            </Link>
          </li>
          <li className="nav-item">
            {/* グラフアイコン */}
            <Link href="/graph" className="nav-link text-dark header-icon-link">
              <i className="bi bi-pie-chart-fill me-1 cute-icon"></i>
              <span className="d-none d-sm-inline ms-1 cute-label">グラフ</span>
            </Link>
          </li>
          <li className="nav-item">
            {/* カレンダーアイコン */}
            <Link href="/table" className="nav-link text-dark header-icon-link">
              <i className="bi bi-calendar-fill me-1 cute-icon"></i>
              <span className="d-none d-sm-inline ms-1 cute-label">一覧</span>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
