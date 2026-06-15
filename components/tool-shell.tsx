"use client";

export default function ToolShell({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">{children}</div>;
}

export function ToolInput({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-5 rounded-3xl border bg-white p-8" style={{ borderColor: "#EAEAEA" }}>
      <h3 className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#848281" }}>{title ?? "输入参数"}</h3>
      {children}
    </div>
  );
}

export function ToolResult({ loading, error, files }: { loading?: boolean; error?: string; files?: string[] }) {
  return (
    <div className="space-y-5 rounded-3xl border bg-white p-8" style={{ borderColor: "#EAEAEA" }}>
      <h3 className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#848281" }}>生成结果</h3>

      {loading && (
        <div className="flex flex-col items-center py-12">
          {/* CSS geometric loading indicator */}
          <div className="mb-4 relative flex items-center justify-center" style={{ width: 120, height: 120 }}>
            <div className="decor-shape decor-shape-lg decor-circle decor-gold" style={{ position: "relative", opacity: 0.35, animation: "spin 3s linear infinite" }} />
            <div className="decor-shape decor-shape-sm decor-circle decor-blue" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", opacity: 0.5 }} />
            <div className="decor-shape decor-dot decor-green" style={{ position: "absolute", top: "15%", right: "20%", opacity: 0.7, animation: "decorFloat1 4s ease-in-out infinite" }} />
            <div className="decor-shape decor-dot decor-purple" style={{ position: "absolute", bottom: "18%", left: "22%", opacity: 0.6, animation: "decorFloat2 5s ease-in-out infinite" }} />
          </div>
          <p className="text-sm font-medium" style={{ color: "#343433" }}>AI 正在为你生成……</p>
          <p className="mt-1 text-xs" style={{ color: "#848281" }}>通常需要 10-30 秒，请稍候</p>
        </div>
      )}

      {error && !loading && (
        <div className="flex flex-col items-center py-8">
          {/* CSS geometric error indicator */}
          <div className="mb-4 relative flex items-center justify-center" style={{ width: 80, height: 80 }}>
            <div className="decor-shape decor-shape-md decor-octagon decor-orange" style={{ position: "relative", opacity: 0.3 }} />
            <div className="decor-shape decor-dot decor-pink" style={{ position: "absolute", top: "45%", left: "50%", transform: "translate(-50%,-50%)", opacity: 0.7 }} />
          </div>
          <div className="rounded-2xl p-4 text-sm w-full text-center" style={{ backgroundColor: "#FFF5F5", color: "#EF4444" }}>
            <p className="font-medium mb-1">生成失败</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {files && files.length > 0 && !loading && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {/* CSS geometric success indicator */}
            <div className="relative flex items-center justify-center" style={{ width: 32, height: 32 }}>
              <div className="decor-shape decor-shape-sm decor-circle decor-green" style={{ position: "relative", opacity: 0.4 }} />
              <div className="decor-shape decor-dot decor-green" style={{ position: "absolute", opacity: 0.8 }} />
            </div>
            <span className="inline-flex items-center gap-1 rounded-lg px-2.5 py-0.5 text-xs font-semibold" style={{ backgroundColor: "#EEFAF3", color: "#44C67F" }}>✓ 生成完成</span>
            <span className="text-xs" style={{ color: "#848281" }}>共 {files.length} 张</span>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {files.map((url, i) => (
              <img key={i} src={url} alt={`生成结果 ${i + 1}`} className="w-full rounded-2xl border" style={{ borderColor: "#EAEAEA" }} />
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {files.map((url, i) => (
              <a key={i} href={url} download target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-2xl border px-6 py-2 text-xs font-medium transition-colors hover:bg-gray-50" style={{ borderColor: "#EAEAEA", color: "#494440" }}>下载</a>
            ))}
          </div>
        </div>
      )}

      {!loading && !error && (!files || files.length === 0) && (
        <div className="flex flex-col items-center py-12 text-center">
          {/* CSS geometric empty state */}
          <div className="mb-4 relative flex items-center justify-center" style={{ width: 120, height: 120 }}>
            <div className="decor-shape decor-shape-lg decor-hexagon decor-purple" style={{ position: "relative", opacity: 0.18, animation: "decorFloat1 6s ease-in-out infinite" }} />
            <div className="decor-shape decor-shape-sm decor-circle decor-blue" style={{ position: "absolute", top: "25%", right: "18%", opacity: 0.25, animation: "decorFloat2 5s ease-in-out infinite" }} />
            <div className="decor-shape decor-dot decor-gold" style={{ position: "absolute", bottom: "30%", left: "22%", opacity: 0.3 }} />
          </div>
          <p className="text-sm font-medium" style={{ color: "#848281" }}>还没有生成结果</p>
          <p className="mt-1 text-xs" style={{ color: "#848281" }}>在左侧输入框中描述你想要的画面</p>
        </div>
      )}
    </div>
  );
}
