"use client";
import "@/app/login/globals.css";
import Link from "next/link";

export default function Login() {
  const backhistory = () => {
    history.back();
  };
  return (
    <main>
      <form action="login" method="post" id="registration-form">
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
            onClick={backhistory}
          >
            戻る
          </button>
          <Link href="/input">
            <button
              type="button"
              className="btn btn-primary"
              id="submit-button"
            >
              登録
            </button>
          </Link>
        </div>
      </form>
    </main>
  );
}
