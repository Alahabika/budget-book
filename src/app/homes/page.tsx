"use client";
import "@/app/homes/globals.css";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "../../../utils/supabase";

async function generateMascotDialog(context: string, balance: number) {
  console.log("generateMascotDialog関数が呼び出されました。");
  const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!API_KEY) {
    throw new Error("NEXT_PUBLIC_GEMINI_API_KEY is not defined");
  }
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  let prompt;
  if (balance <= 0) {
    prompt = `あなたは家計簿アプリのマスコットキャラクターです。ユーザーの残高は0円を下回り、あなたは栄養が足りなくなり死にました。ユーザーが貯金したいと思うように短い哀愁の漂うセリフを一つ提案してください。`;
  } else if (balance <= 1000) {
    prompt = `あなたは家計簿アプリのマスコットキャラクターです。ユーザーの残高は1000円以下とかなり少ない状況です。そのためあなたは栄養不足でお腹がペコペコで死にそうです。この状況が打破できるよう、弱弱しくユーザーに助けて欲しい旨を伝える短いセリフを一つ提案してください。`;
  } else {
    prompt = `あなたは家計簿アプリのマスコットキャラクターです。ユーザーを応援し、アプリの利用を促進してください。現在の状況は以下の通りです。\n\n${context}\n\nこの状況に合った、短いポジティブなセリフを一つ提案してください。`;
  }

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  console.log("AIが生成したセリフ:", text);
  return text.trim();
}
function getMascotExpression(dialogText: string, balance: number) {
  if (balance <= 0) {
    return "/heg_die.png";
  } else if (balance <= 1000) {
    return "/heg_soondie.png";
  } else if (
    dialogText.includes("すごい") ||
    dialogText.includes("おめでとう") ||
    dialogText.includes("ありがとう") ||
    dialogText.includes("やったー")
  ) {
    return "/heg_happy.png";
  } else if (
    dialogText.includes("残念") ||
    dialogText.includes("泣") ||
    dialogText.includes("涙")
  ) {
    return "/heg_cry.png";
  } else if (
    dialogText.includes("！！") ||
    dialogText.includes("わーい") ||
    dialogText.includes("リフレッシュ")
  ) {
    return "/heg_happy_more.png";
  } else if (
    dialogText.includes("おい") ||
    dialogText.includes("こら") ||
    dialogText.includes("怒")
  ) {
    return "/heg_angry.png";
  } else if (
    dialogText.includes("お前") ||
    dialogText.includes("う～ん") ||
    dialogText.includes("うーん")
  ) {
    return "heg_gennnnari.png";
  }
  {
    return "/heg_normal.png";
  }
}

export default function Homes() {
  const [balance, setBalance] = useState<number | null>(null); //残高
  //  useEffect( () => {
  //   const timer = setTimeout(() => setIsSpeechBubbleVisible(false),5000);
  //    return () => clearTimeout(timer);
  //  },[]);
  //残高によって初期値（表情とテキスト）を変える
  const getInitialExpression = (initialBalance: number) => {
    if (initialBalance <= 0) {
      return "/heg_die.png";
    } else if (initialBalance <= 1000) {
      return "/heg_soondie.png";
    } else {
      return "/heg_normal.png";
    }
  };
  const getInitialMascotText = (initialBalance: number) => {
    if (initialBalance <= 0) {
      return "残高がなくなってしまいました……。";
    } else if (initialBalance <= 1000) {
      return "残高が残り少なくなってきました……。";
    }
    return "こんにちは！";
  };
  const [mascotText, setMascotText] = useState("計算中...");
  const [mascotExpression, setMascotExpression] = useState("/heg_normal.png");
  const [isSpeechBubbleVisible, setIsSpeechBubbleVisible] = useState(true);
  const [expenses, setExpenses] = useState<any[]>([]);
  const fetchExpenses = async () => {
    const { data, error } = await supabase.from("transactions").select("*");

    if (error) {
      console.error("Error fetching expenses:", error);
    } else {
      setExpenses(data);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);
  //expensesが更新されたときに実行される
  /*useEffect(() => {
    // データが読み込まれた後にのみ実行されるようにチェック
    if (expenses.length > 0) {
      const latestExpense = expenses[expenses.length - 1];
      console.log("expenses配列の長さ:", expenses.length);
      console.log("最新の金額:", latestExpense.amount);
    }
  }, [expenses]);*/
  const latestExpense = expenses[expenses.length - 1];
  let context = "現在の残高は${balance}円です。";
  if (latestExpense) {
    const latestAmount = latestExpense.amount;
    const latestCategory = latestExpense.category;

    console.log("最新の金額:", latestAmount);
    console.log("最新のカテゴリ:", latestCategory);
    if (latestExpense && latestExpense.memo) {
      const latestMemo = latestExpense.memo;
      context = `現在の残高は${balance}円です。
    ユーザーが一番最近に使ったカテゴリは${latestCategory}で、
    その中身は${latestMemo}です。
  `;
      console.log(latestMemo);
    } else {
      context = `現在の残高は${balance}円です。
    ユーザーが一番最近に使ったカテゴリは${latestCategory}です
  `;
    }
  }
  useEffect(() => {
    const fetchBalance = async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("amount");
      if (error) {
        console.error("Error fetching transactions:", error);
        return;
      }
      if (data) {
        const total = data.reduce((sum, row) => sum + row.amount, 0);
        setBalance(total);
      }
    };
    fetchBalance();
  }, []);
  useEffect(() => {
    if (balance === null) return;

    setMascotText(getInitialMascotText(balance));
    setMascotExpression(getInitialExpression(balance));
    setIsSpeechBubbleVisible(true);
    setTimeout(() => {
      setTimeout(() => setIsSpeechBubbleVisible(false), 5000);
      setMascotText("・・・");
    }, 3000);
  }, [balance]);

  const handleClick = async () => {
    if (isSpeechBubbleVisible) return;

    setIsSpeechBubbleVisible(true);
    if (balance !== null && balance <= 0) {
      setMascotExpression("/heg_die_sleep.png");
    } else if (balance !== null && balance <= 1000) {
      setMascotExpression("/heg_soondie_sleep.png");
    } else {
      setMascotExpression("/heg_sleep.png");
    }
    const dialog = await generateMascotDialog(context, balance ?? 0);
    setMascotText(dialog);
    setMascotExpression(getMascotExpression(dialog, balance ?? 0));

    setTimeout(() => {
      setIsSpeechBubbleVisible(false);
      setMascotText("・・・");
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
            <div className="speech-bubble mb-3">{mascotText}</div>
          )}
          <Image
            src={mascotExpression}
            alt="ハリちゃん"
            fill
            priority
            sizes="50vw"
          />
        </div>
        <div className="status-bar">
          <label>残高: {balance}円</label>
        </div>
      </div>
    </main>
  );
}
