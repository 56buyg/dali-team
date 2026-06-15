"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleLogin = async () => {
    if (!username.trim()) {
      setError("请输入用户名");
      return;
    }
    if (!password) {
      setError("请输入密码");
      return;
    }
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push("/tools/text-to-image");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "登录失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!username.trim() || username.trim().length < 2) {
      setError("用户名至少需要 2 个字符");
      return;
    }
    if (!password || password.length < 6) {
      setError("密码至少需要 6 个字符");
      return;
    }
    if (!captcha) {
      setError("请输入验证码");
      return;
    }
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password,
          captcha,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess("注册成功！请登录");
      setMode("login");
      setPassword("");
      setCaptcha("");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "注册失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      mode === "login" ? handleLogin() : handleRegister();
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ backgroundColor: "#FBFAF9" }}
    >
      <div
        className="w-full max-w-sm rounded-3xl border bg-white px-10 py-8"
        style={{ borderColor: "#EAEAEA" }}
      >
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            {["#018DFF", "#44C67F", "#5F5DE7"].map((color, i) => (
              <span
                key={i}
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <div
            className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-bold text-white"
            style={{ backgroundColor: "#343433" }}
          >
            D
          </div>
          <h1 className="text-xl font-bold" style={{ color: "#343433" }}>
            {mode === "login" ? "登录 DALI" : "注册 DALI"}
          </h1>
          <p className="mt-1 text-sm" style={{ color: "#848281" }}>
            DALI · 韶音设计AI — 让创意更快落地
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            className="mb-4 rounded-2xl px-5 py-3 text-sm"
            style={{ backgroundColor: "#FFF5F5", color: "#EF4444" }}
          >
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div
            className="mb-4 rounded-2xl px-5 py-3 text-sm"
            style={{ backgroundColor: "#EEFAF3", color: "#44C67F" }}
          >
            {success}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex flex-col items-center py-8">
            <div
              className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
              style={{ borderColor: "#EAEAEA", borderTopColor: "#343433" }}
            />
            <p className="mt-3 text-sm" style={{ color: "#848281" }}>
              {mode === "login" ? "登录中……" : "注册中……"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Username */}
            <div>
              <label
                className="mb-1.5 block text-sm font-medium"
                style={{ color: "#343433" }}
              >
                用户名
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="请输入用户名"
                autoComplete="username"
                className="w-full rounded-2xl border px-6 py-3 text-sm transition-colors placeholder:text-[#848281] focus:outline-none focus:ring-2"
                style={{
                  borderColor: "#EAEAEA",
                  backgroundColor: "#FBFAF9",
                  color: "#343433",
                }}
                onKeyDown={handleSubmit}
              />
            </div>

            {/* Password */}
            <div>
              <label
                className="mb-1.5 block text-sm font-medium"
                style={{ color: "#343433" }}
              >
                密码
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                className="w-full rounded-2xl border px-6 py-3 text-sm transition-colors placeholder:text-[#848281] focus:outline-none focus:ring-2"
                style={{
                  borderColor: "#EAEAEA",
                  backgroundColor: "#FBFAF9",
                  color: "#343433",
                }}
                onKeyDown={handleSubmit}
              />
            </div>

            {/* Captcha — only in register mode */}
            {mode === "register" && (
              <div>
                <label
                  className="mb-1.5 block text-sm font-medium"
                  style={{ color: "#343433" }}
                >
                  验证码
                </label>
                <input
                  type="text"
                  value={captcha}
                  onChange={(e) => setCaptcha(e.target.value)}
                  placeholder="请输入注册验证码"
                  className="w-full rounded-2xl border px-6 py-3 text-sm transition-colors placeholder:text-[#848281] focus:outline-none focus:ring-2"
                  style={{
                    borderColor: "#EAEAEA",
                    backgroundColor: "#FBFAF9",
                    color: "#343433",
                  }}
                  onKeyDown={handleSubmit}
                />
                <p className="mt-1 text-xs" style={{ color: "#848281" }}>
                  请联系管理员获取注册验证码
                </p>
              </div>
            )}

            {/* Submit button */}
            <button
              onClick={mode === "login" ? handleLogin : handleRegister}
              className="w-full rounded-full py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-md"
              style={{ backgroundColor: "#343433" }}
            >
              {mode === "login" ? "登录" : "注册"}
            </button>

            {/* Toggle mode */}
            <p className="text-center text-xs" style={{ color: "#848281" }}>
              {mode === "login" ? "还没有账号？" : "已有账号？"}
              <button
                onClick={() => {
                  setMode(mode === "login" ? "register" : "login");
                  setError("");
                  setSuccess("");
                }}
                className="ml-1 font-medium hover:underline"
                style={{ color: "#018DFF" }}
              >
                {mode === "login" ? "去注册" : "去登录"}
              </button>
            </p>

            <p className="text-center text-xs" style={{ color: "#848281" }}>
              仅限韶音设计部内部使用
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
