"use client";
import "@/app/login/globals.css";
import Link from "next/link";
import { supabase } from "../../../utils/supabase";

export default function Register() {
  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    console.log("data:", JSON.stringify(data, null, 2));
    console.log("error:", JSON.stringify(error, null, 2));
    if (error) {
      console.error("SignUp error:", error.message);
    } else {
      console.log("SignUp success:", data);
    }
  };

  return (
    <main>
      <form id="registration-form">
        <div>
          <label htmlFor="email">メールアドレス</label>
          <input
            name="email"
            id="email"
            className="box"
            type="email"
            placeholder="example@example.com"
          />
          <span id="error-message-email" style={{ color: "#ff6465" }}></span>
        </div>

        <div>
          <label htmlFor="password">パスワード</label>
          <input
            name="password"
            id="password"
            className="box"
            type="password"
            placeholder="パスワードを入力してください"
          />
          <span id="error-message-password" style={{ color: "#ff6465" }}></span>
        </div>

        <div className="attention">
          パスワードは以下の条件を満たす必要があります。
          <ul>
            <li>8文字以上</li>
            <li>以下の両方を含む</li>
            <ul>
              <li>半角英字(a-z, A-Z)</li>
              <li>半角数字(0-9)</li>
            </ul>
          </ul>
          <div>
            <label htmlFor="password_re" minLength={8}>
              パスワード確認用
            </label>
            <input
              id="password_re"
              className="box"
              type="password"
              placeholder="もう一度入力してください"
            />
            <span id="re_passerror-message" style={{ color: "#ff6465" }}></span>
          </div>
        </div>

        <div className="submit_buttons">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => history.back()}
          >
            戻る
          </button>

          <button
            type="button"
            className="btn btn-primary"
            id="submit-button"
            onClick={async () => {
              const email = (document.getElementById("email") as HTMLInputElement).value;
              const password = (document.getElementById("password") as HTMLInputElement).value;
              await signUp(email, password);
              // 成功したら /input へ遷移
              window.location.href = "/input";
            }}
          >
            登録
          </button>
        </div>
      </form>
    </main>
  );
}
