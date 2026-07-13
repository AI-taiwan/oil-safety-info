import { ShieldAlert, Info, HelpCircle, MapPin, MessageSquare, Settings, Biohazard } from "lucide-react";
import { motion } from "motion/react";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Header({ activeTab, setActiveTab }: HeaderProps) {
  const tabs = [
    { id: "news", label: "最新公告與警報", icon: Info, color: "from-blue-600 to-indigo-600" },
    { id: "merchants", label: "哪些商家受影響？", icon: MapPin, color: "from-amber-500 to-red-600" },
    { id: "checker", label: "查油品合不合格", icon: ShieldAlert, color: "from-red-600 to-rose-600" },
    { id: "supply", label: "看油品雙向流向", icon: ShieldAlert, color: "from-violet-600 to-fuchsia-600" },
    { id: "faq", label: "消費者應對指南", icon: HelpCircle, color: "from-emerald-600 to-teal-600" },
    { id: "chat", label: "AI 線上諮詢", icon: MessageSquare, color: "from-cyan-600 to-blue-600" },
  ];

  return (
    <header className="bg-[#0b0f19]/80 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-50 shadow-lg shadow-slate-950/40" id="header-root">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6" id="header-content">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3 min-w-0" id="brand-container">
          <div className="bg-gradient-to-br from-red-900/60 to-rose-950/40 text-red-400 p-2.5 rounded-xl border border-red-800/50 shadow-inner shrink-0" id="brand-logo">
            <Biohazard className="w-7 h-7 animate-pulse drop-shadow-[0_0_8px_rgba(248,113,113,0.5)]" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-sm truncate" id="brand-title">
              毒油事件 一站式平台
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-medium truncate" id="brand-subtitle">
              全民食安衛士：即時掌握受污染油品流向、檢驗數據與健康指引
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex overflow-x-auto hide-scrollbar xl:justify-end gap-2 md:border-none pb-2 xl:pb-0 px-2 sm:px-0 flex-1 min-w-0" id="nav-tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isMerchants = tab.id === "merchants";

            return (
              <button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center justify-center shrink-0 gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all duration-300 cursor-pointer overflow-hidden whitespace-nowrap ${
                  isActive 
                    ? "text-white shadow-lg" 
                    : isMerchants 
                      ? "text-amber-300 bg-amber-950/30 border border-amber-800/40 hover:bg-amber-900/40"
                      : "text-slate-300 bg-slate-800/30 border border-slate-700/40 hover:bg-slate-700/50 hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className={`absolute inset-0 bg-gradient-to-r ${tab.color} opacity-100 rounded-xl`}
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <Icon className={`w-4 h-4 ${isActive ? "animate-bounce drop-shadow-md" : (isMerchants ? "text-amber-500" : "text-slate-400")}`} />
                  <span className={isActive ? "drop-shadow-md" : ""}>{tab.label}</span>
                </span>
                
                {isMerchants && !isActive && (
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping absolute top-2 right-2" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
