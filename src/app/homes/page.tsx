"use client";
import "@/app/homes/globals.css";
import { useState, useEffect } from "react";
import Image from "next/image";

const normalExpressions = [
  { src: "/heg_normal.png", text: "こんにちは！" },
  { src: "/heg_happy.png", text: "にこにこ" },
  { src: "/heg_sleep.png", text: "すやすや……" },
];
const lowBalanceExpression = { src: "/heg_soondie.png", text: "死にかけ" };
const zeroBalanceExpression = { src: "/heg_die.png", text: "死にました！" };
export default function Homes() {
  const [currentExpression, setCurrentExpression] = useState(
    normalExpressions[0]
  ); //表情
  const [isSpeechBubbleVisible, setIsSpeechBubbleVisible] = useState(false); //吹き出し
  const [balance, setBalance] = useState(2500); //残高
  useEffect(() => {
    if (balance <= 0) {
      setCurrentExpression(zeroBalanceExpression);
    } else if (balance <= 1000) {
      setCurrentExpression(lowBalanceExpression);
    } else {
      const randomIndex = Math.floor(Math.random() * normalExpressions.length);
      setCurrentExpression(normalExpressions[randomIndex]);
    }
  }, [balance]);
  const handleClick = () => {
    // 吹き出しを表示
    setIsSpeechBubbleVisible(true);
    setTimeout(() => {
      setIsSpeechBubbleVisible(false);
    }, 5000);
  };
  return (
    <main className="d-flex flex-column align-items-center justify-content-center min-vh-100">
      <div className="text-center position-relative">
        <div
          onClick={handleClick}
          style={{
            cursor: "pointer",
            width: "50vw",
            height: "calc(50vw * 767/ 600)",
            position: "relative",
          }}
        >
          {isSpeechBubbleVisible && (
            <div className="speech-bubble mb-3">{currentExpression.text}</div>
          )}
          <Image src={currentExpression.src} alt="ハリちゃん" fill priority />
        </div>
        <div className="status-bar">
          <label>残高: {balance}円</label>
        </div>
      </div>
    </main>
  );
}
