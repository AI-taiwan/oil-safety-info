import { useState } from "react";
import Header from "./components/Header";
import AdBanner from "./components/AdBanner";
import NewsSection from "./components/NewsSection";
import InspectionChecker from "./components/InspectionChecker";
import SupplyChainTracker from "./components/SupplyChainTracker";
import LocalMerchants from "./components/LocalMerchants";
import FAQSection from "./components/FAQSection";
import AIChatBot from "./components/AIChatBot";
import ErrorReportModal from "./components/ErrorReportModal";
import AdminDashboard from "./components/AdminDashboard";
import { ShieldCheck, Info, FileText, AlertCircle, MessageSquareWarning, Settings } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("news");
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [selectedSupplyNodeId, setSelectedSupplyNodeId] = useState<string | null>(null);

  const handleTraceInSupply = (nodeId: string) => {
    setSelectedSupplyNodeId(nodeId);
    setActiveTab("supply");
  };

  return (
    <div className="min-h-screen bg-[#070b14] flex flex-col font-sans text-slate-100 relative" id="app-root">
      {/* Top Main Navigation Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8" id="main-content">
        
        {/* Dynamic Tab Rendering with Framer Motion Fade/Slide Transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            id="active-tab-container"
          >
            {activeTab === "news" && <NewsSection />}
            {activeTab === "checker" && <InspectionChecker />}
            {activeTab === "supply" && (
              <SupplyChainTracker 
                selectedNodeId={selectedSupplyNodeId} 
                setSelectedNodeId={setSelectedSupplyNodeId} 
              />
            )}
            {activeTab === "merchants" && (
              <LocalMerchants 
                onTraceInSupply={handleTraceInSupply} 
              />
            )}
            {activeTab === "faq" && <FAQSection />}
            {activeTab === "chat" && <AIChatBot />}
            {activeTab === "admin" && <AdminDashboard />}
          </motion.div>
        </AnimatePresence>

        {/* Persistent Food Safety Advertisement Banner (Moved to bottom) */}
        <div className="mt-8">
          <AdBanner />
        </div>
      </main>

      {/* Floating Error Reporting Action Button */}
      <div className="fixed bottom-6 right-6 z-40" id="floating-action-container">
        <button
          onClick={() => setIsReportOpen(true)}
          className="flex items-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-full shadow-lg font-extrabold text-xs sm:text-sm transition-all duration-200 hover:scale-105 active:scale-95 group relative cursor-pointer"
          id="floating-report-btn"
          title="通報平台上資料錯誤或更正建議"
        >
          {/* Subtle Pulse Rings */}
          <span className="absolute -inset-1 rounded-full bg-red-500/30 animate-ping opacity-75 group-hover:opacity-0 transition-opacity pointer-events-none" />
          <MessageSquareWarning className="w-4 h-4 sm:w-5 h-5 flex-shrink-0" />
          <span className="tracking-tight">回報錯誤 / 建議</span>
        </button>
      </div>

      {/* Slide-over Error Report Drawer Modal */}
      <ErrorReportModal isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} />

      {/* Bottom Footer & Info Section */}
      <footer className="bg-[#0b101f] border-t border-slate-800/60 py-8 mt-12" id="footer-root">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6" id="footer-content">
          <div className="space-y-1.5" id="footer-brand-info">
            <div className="flex items-center gap-2 text-slate-100 font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>致癌沙拉油事件資訊平台</span>
            </div>
            <p className="text-xs text-slate-400">
              本平台為公益、中立之食品安全資訊整合網。所有抽檢數據與流向資訊皆同步自政府衛生福利部食品藥物管理署（TFDA）及地方衛生局之公開新聞稿。
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-400" id="footer-links">
            <a
              href="https://www.fda.gov.tw/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-slate-200 transition-colors"
              id="footer-link-tfda"
            >
              <Info className="w-3.5 h-3.5 text-indigo-400" />
              <span>食藥署官方網站</span>
            </a>
            <a
              href="https://cpc.ey.gov.tw/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-slate-200 transition-colors"
              id="footer-link-cpc"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span>消費者保護處申訴</span>
            </a>
            <button
              onClick={() => setActiveTab("admin")}
              className="flex items-center gap-1 hover:text-slate-200 transition-colors cursor-pointer"
              id="footer-link-admin"
            >
              <Settings className="w-3.5 h-3.5 text-indigo-400" />
              <span>系統後台登入</span>
            </button>
            <div className="flex items-center gap-1 text-red-500 font-bold" id="footer-link-hotline">
              <AlertCircle className="w-3.5 h-3.5 animate-pulse" />
              <span>食安檢舉專線：1919</span>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 pt-6 border-t border-slate-800/40 text-center text-[10px] text-slate-500" id="footer-copyright">
          © 2026 食品安全 人人有責
        </div>
      </footer>
    </div>
  );
}
