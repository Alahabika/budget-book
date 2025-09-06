"use client";
import "@/app/globals.css";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>はじめてのNext.js！</h1>
      <p>これが私の最初のページです。</p>
      <Link href="/login">
        <button>クリックして下さい</button>
      </Link>
    </main>
  );
}
