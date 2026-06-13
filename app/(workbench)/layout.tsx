import Sidebar from "@/components/sidebar";
import Header from "@/components/header";

export default function WorkbenchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "#FBFAF9" }}>
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: "#FBFAF9" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
