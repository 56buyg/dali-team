"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "otp" | "loading">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 倒计时
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  const sendOtp = async () => {
    if (!email.includes("@")) {
      setError("请输入有效的邮箱地址");
      return;
    }
    setError("");
    setStep("loading");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStep("otp");
      setCountdown(60);
      otpRefs.current[0]?.focus();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "发送失败");
      setStep("email");
    }
  };

  const verifyOtp = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      setError("请输入完整的 6 位验证码");
      return;
    }
    setError("");
    setStep("loading");
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token: code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push("/");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "验证失败");
      setStep("otp");
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
    if (next.every((d) => d)) verifyOtpWithCode(next.join(""));
  };

  const verifyOtpWithCode = async (code: string) => {
    setStep("loading");
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token: code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push("/");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "验证失败");
      setStep("otp");
    }
  };

  const brandOrange = "#FF6A00";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div
            className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold text-white"
            style={{ backgroundColor: brandOrange }}
          >
            韶
          </div>
          <h1 className="text-xl font-bold text-gray-900">韶音设计</h1>
          <p className="text-sm text-gray-500">Shokz Design AI 工具箱</p>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* 邮箱输入 */}
        {step === "email" && (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                邮箱地址
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@shokz.com"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                onKeyDown={(e) => e.key === "Enter" && sendOtp()}
              />
            </div>
            <button
              onClick={sendOtp}
              className="w-full rounded-lg py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90"
              style={{ backgroundColor: brandOrange }}
            >
              发送验证码
            </button>
          </div>
        )}

        {/* 验证码输入 */}
        {step === "otp" && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 text-center">
              验证码已发送至 <span className="font-medium text-gray-900">{email}</span>
            </p>
            <div className="flex justify-center gap-2">
              {otp.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => { otpRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  className="h-12 w-10 rounded-lg border border-gray-300 text-center text-lg font-bold focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              ))}
            </div>
            <button
              onClick={verifyOtp}
              className="w-full rounded-lg py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90"
              style={{ backgroundColor: brandOrange }}
              disabled={otp.some((d) => !d)}
            >
              验证登录
            </button>
            <div className="text-center text-xs text-gray-400 space-x-2">
              {countdown > 0 ? (
                <span>{countdown}s 后可重发</span>
              ) : (
                <button onClick={sendOtp} className="text-orange-500 hover:underline">
                  重新发送
                </button>
              )}
              <button onClick={() => { setStep("email"); setOtp(["", "", "", "", "", ""]); }} className="text-gray-400 hover:underline">
                修改邮箱
              </button>
            </div>
          </div>
        )}

        {/* 加载中 */}
        {step === "loading" && (
          <div className="flex flex-col items-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
            <p className="mt-3 text-sm text-gray-500">加载中...</p>
          </div>
        )}
      </div>
    </div>
  );
}
