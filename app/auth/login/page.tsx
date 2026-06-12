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
      setError(e instanceof Error ? e.message : "发送失败，请稍后重试");
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
      setError(e instanceof Error ? e.message : "验证失败，请重新输入");
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
      setError(e instanceof Error ? e.message : "验证失败，请重新输入");
      setStep("otp");
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ backgroundColor: "#FBFAF9" }}
    >
      <div
        className="w-full max-w-sm rounded-2xl border bg-white p-8"
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
            className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold text-white"
            style={{ backgroundColor: "#343433" }}
          >
            D
          </div>
          <h1 className="text-xl font-bold" style={{ color: "#343433" }}>
            登录 DALI
          </h1>
          <p className="mt-1 text-sm" style={{ color: "#848281" }}>
            DALI · 韶音设计AI — 让创意更快落地
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            className="mb-4 rounded-xl p-3 text-sm"
            style={{ backgroundColor: "#FFF5F5", color: "#EF4444" }}
          >
            {error}
          </div>
        )}

        {/* Email step */}
        {step === "email" && (
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium" style={{ color: "#343433" }}>
                邮箱地址
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@shokz.com"
                className="w-full rounded-xl border px-4 py-3 text-sm transition-colors placeholder:text-[#848281] focus:outline-none focus:ring-2"
                style={{ borderColor: "#EAEAEA", backgroundColor: "#FBFAF9", color: "#343433" }}
                onKeyDown={(e) => e.key === "Enter" && sendOtp()}
              />
            </div>
            <button
              onClick={sendOtp}
              className="w-full rounded-xl py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-md"
              style={{ backgroundColor: "#343433" }}
            >
              发送验证码
            </button>
            <p className="text-center text-xs" style={{ color: "#848281" }}>
              仅限韶音设计部内部使用
            </p>
          </div>
        )}

        {/* OTP step */}
        {step === "otp" && (
          <div className="space-y-4">
            <p className="text-center text-sm" style={{ color: "#848281" }}>
              验证码已发送至{" "}
              <span className="font-medium" style={{ color: "#343433" }}>{email}</span>
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
                  className="h-12 w-10 rounded-xl border text-center text-lg font-bold transition-colors focus:outline-none focus:ring-2"
                  style={{ borderColor: "#EAEAEA", color: "#343433", backgroundColor: "#FFFFFF" }}
                />
              ))}
            </div>
            <button
              onClick={verifyOtp}
              className="w-full rounded-xl py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50 disabled:hover:translate-y-0"
              style={{ backgroundColor: "#343433" }}
              disabled={otp.some((d) => !d)}
            >
              验证登录
            </button>
            <div className="flex justify-center gap-4 text-xs" style={{ color: "#848281" }}>
              {countdown > 0 ? (
                <span>{countdown}s 后可重发</span>
              ) : (
                <button onClick={sendOtp} style={{ color: "#018DFF" }} className="hover:underline">
                  重新发送
                </button>
              )}
              <button
                onClick={() => { setStep("email"); setOtp(["", "", "", "", "", ""]); }}
                className="hover:underline"
              >
                修改邮箱
              </button>
            </div>
          </div>
        )}

        {/* Loading */}
        {step === "loading" && (
          <div className="flex flex-col items-center py-8">
            <div
              className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
              style={{ borderColor: "#EAEAEA", borderTopColor: "#343433" }}
            />
            <p className="mt-3 text-sm" style={{ color: "#848281" }}>验证中……</p>
          </div>
        )}
      </div>
    </div>
  );
}
