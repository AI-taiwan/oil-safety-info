import { useState, useEffect } from "react";
import { newsData as initialNewsData } from "../data";
import { NewsItem } from "../types";
import { AlertCircle, Calendar, ExternalLink, Filter } from "lucide-react";
import { motion } from "motion/react";

export default function NewsSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("全部");
  const [newsList, setNewsList] = useState<NewsItem[]>(initialNewsData);

  useEffect(() => {
    // Load custom news from localStorage and merge with hardcoded initialNewsData
    const data = localStorage.getItem("customNews");
    if (data) {
      const parsedCustomNews: NewsItem[] = JSON.parse(data);
      // Combine custom news (at top) with initial news
      setNewsList([...parsedCustomNews, ...initialNewsData]);
    }
  }, []);

  const categories = ["全部", "政府公告", "廠商回收", "健康指引", "檢驗進度"];

  const filteredNews = newsList.filter((item) => {
    if (selectedCategory === "全部") return true;
    return item.category === selectedCategory;
  });

  return (
    <div className="space-y-6" id="news-section-root">
      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#0e1424] p-5 rounded-2xl border border-slate-800/80 shadow-lg" id="news-filter-bar">
        <div className="flex items-center gap-2" id="filter-title-container">
          <Filter className="w-5 h-5 text-indigo-400 animate-pulse" />
          <span className="text-sm font-extrabold text-slate-200 tracking-tight">新聞資訊公告篩選</span>
        </div>
        <div className="flex flex-wrap gap-2" id="filter-buttons">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            let activeColorClass = "from-blue-600 to-indigo-600";
            if (cat === "廠商回收") activeColorClass = "from-red-600 to-rose-600";
            else if (cat === "健康指引") activeColorClass = "from-emerald-600 to-teal-600";
            else if (cat === "檢驗進度") activeColorClass = "from-amber-500 to-amber-600";

            return (
              <button
                key={cat}
                id={`filter-news-${cat}`}
                onClick={() => setSelectedCategory(cat)}
                className={`relative px-4 py-2.5 text-xs sm:text-sm rounded-xl transition-all duration-300 cursor-pointer font-bold overflow-hidden ${
                  isSelected
                    ? "text-white shadow-lg"
                    : "bg-slate-900/60 text-slate-300 border border-slate-700/60 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="newsFilterIndicator"
                    className={`absolute inset-0 bg-gradient-to-r ${activeColorClass} opacity-100 rounded-xl`}
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Alert Banner */}
      {selectedCategory === "全部" && (
        <div className="bg-gradient-to-r from-red-950 via-red-900 to-rose-950 border border-red-700 rounded-2xl p-6 flex flex-col md:flex-row items-start gap-5 shadow-xl text-white relative overflow-hidden" id="main-alert-banner">
          {/* Decorative Background Glows */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-rose-400/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="bg-red-500/20 border border-red-400/30 text-red-200 p-3 rounded-xl flex-shrink-0" id="alert-icon-container">
            <AlertCircle className="w-8 h-8 animate-pulse text-red-400" />
          </div>
          <div className="flex-1 space-y-3 z-10" id="alert-text-container">
            <h3 className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-red-100 flex items-center gap-2">
              致癌沙拉油事件核心摘要 (截至今日 2026/07/12)
            </h3>
            <ul className="text-xs sm:text-sm text-red-100/90 space-y-2 list-none">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-1 font-bold">●</span>
                <span><strong>致癌源頭：</strong>頂順貿易進口之粗製大豆油與菜籽油，檢出高濃度「苯駢芘（BaP）」達 6.8 μg/kg（法規限量 2.0 μg/kg）。</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-1 font-bold">●</span>
                <span><strong>涉案廠商：</strong>恆新製油工廠採購問題粗油代工包裝，康健食品、廚神牌、御品膳等下游終端品牌之超標油品已遭緊急勒令封存。</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-1 font-bold">●</span>
                <span><strong>檢驗結果：</strong>目前已有 4 款商品確認超標，而合格大廠（如義美、泰山、福壽、台糖等）最新檢驗均為合格，大眾可安心烹調。</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-1 font-bold">●</span>
                <span><strong>退費窗口：</strong>購買到不合格批號消費者，可憑電子發票或產品空罐向原購買通路（全聯、家樂福、大潤發等）申請全額退款。</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* News Feed */}
      <div className="grid grid-cols-1 gap-5" id="news-feed-grid">
        {filteredNews.length > 0 ? (
          filteredNews.map((news, index) => {
            // Apply distinct premium gradient styles based on category
            let cardBgStyle = "from-[#0e1424] to-[#121a2f] border-slate-800 hover:border-slate-700";
            let leftBorderColor = "border-l-slate-500";
            let accentText = "text-slate-200 hover:text-indigo-400";
            
            if (news.category === "政府公告") {
              cardBgStyle = "from-[#0b1428] to-[#0f1d3a] border-blue-900/55 hover:border-blue-700/60";
              leftBorderColor = "border-l-blue-500";
              accentText = "text-blue-400";
            } else if (news.category === "廠商回收") {
              cardBgStyle = "from-[#1c0f18] to-[#2d1222] border-red-900/55 hover:border-red-700/60";
              leftBorderColor = "border-l-red-500";
              accentText = "text-red-400";
            } else if (news.category === "健康指引") {
              cardBgStyle = "from-[#0a1815] to-[#0d2621] border-emerald-900/55 hover:border-emerald-700/60";
              leftBorderColor = "border-l-emerald-500";
              accentText = "text-emerald-400";
            } else if (news.category === "檢驗進度") {
              cardBgStyle = "from-[#1c140d] to-[#2a1c10] border-amber-900/55 hover:border-amber-700/60";
              leftBorderColor = "border-l-amber-500";
              accentText = "text-amber-400";
            }

            return (
              <motion.div
                key={news.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                id={`news-card-${news.id}`}
                className={`bg-gradient-to-br ${cardBgStyle} rounded-2xl border-2 border-l-8 ${leftBorderColor} p-5 sm:p-6 transition-all duration-300 hover:shadow-lg relative overflow-hidden`}
              >
                {/* Decorative background circle */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-slate-500/5 rounded-full pointer-events-none" />

                {/* Card Badge & Meta */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5" id={`news-meta-${news.id}`}>
                  <div className="flex items-center gap-2">
                    <span
                      id={`news-badge-category-${news.id}`}
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        news.category === "政府公告"
                          ? "bg-blue-900/50 text-blue-300 border border-blue-800/40"
                          : news.category === "廠商回收"
                          ? "bg-red-900/50 text-red-300 border border-red-800/40"
                          : news.category === "健康指引"
                          ? "bg-emerald-900/50 text-emerald-300 border border-emerald-800/40"
                          : "bg-amber-900/50 text-amber-300 border border-amber-800/40"
                      }`}
                    >
                      {news.category}
                    </span>
                    {news.importance === "high" && (
                      <span id={`news-badge-importance-${news.id}`} className="bg-red-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase animate-pulse shadow-sm">
                        特級重要
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs sm:text-sm font-medium" id={`news-date-${news.id}`}>
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span>{news.date}</span>
                  </div>
                </div>

                {/* Title & Body */}
                <h2 className="text-base sm:text-lg font-black text-white leading-snug hover:text-indigo-300 transition-colors cursor-pointer" id={`news-title-${news.id}`}>
                  {news.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-2.5 leading-relaxed font-medium" id={`news-content-${news.id}`}>
                  {news.content}
                </p>

                {/* Source Footer */}
                <div className="mt-5 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400" id={`news-footer-${news.id}`}>
                  <div className="flex items-center gap-1.5" id={`news-source-${news.id}`}>
                    <span className="text-slate-500 font-bold">發布主管機關：</span>
                    <span className="font-extrabold text-slate-200 bg-slate-800 px-2 py-0.5 rounded-md">{news.source}</span>
                  </div>
                  <div className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-bold transition-colors cursor-pointer" id={`news-link-${news.id}`}>
                    <span>官方公告連結</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-[#0e1424] rounded-2xl border border-slate-800 text-slate-400 font-semibold" id="no-news-placeholder">
            目前無該類別相關公告。
          </div>
        )}
      </div>
    </div>
  );
}
