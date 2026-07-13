import { useState } from "react";
import { inspectionData } from "../data";
import { InspectionRecord } from "../types";
import { Search, ShieldCheck, ShieldAlert, AlertCircle, HelpCircle, ArrowUpDown } from "lucide-react";
import { motion } from "motion/react";

export default function InspectionChecker() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("全部");
  const [sortByValue, setSortByValue] = useState<boolean>(false);

  // Filter & Search logic
  const filteredRecords = inspectionData.filter((record) => {
    const matchesSearch =
      record.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.batchNumber.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === "全部") return matchesSearch;
    if (statusFilter === "合格") return matchesSearch && record.status === "passed";
    if (statusFilter === "超標") return matchesSearch && record.status === "failed";
    if (statusFilter === "檢驗中") return matchesSearch && record.status === "pending";
    return matchesSearch;
  });

  // Sort logic
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    if (sortByValue) {
      return b.benzopyreneValue - a.benzopyreneValue; // Descending
    }
    // Default alphabetical by brand
    return a.brand.localeCompare(b.brand);
  });

  // Stats calculation
  const totalPassed = inspectionData.filter(r => r.status === "passed").length;
  const totalFailed = inspectionData.filter(r => r.status === "failed").length;
  const totalPending = inspectionData.filter(r => r.status === "pending").length;

  return (
    <div className="space-y-6" id="checker-root">
      {/* Intro Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5" id="stats-grid">
        <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-emerald-950/40 via-[#0e1c18] to-emerald-900/10 border border-emerald-800/60 rounded-2xl p-5 flex items-center gap-4 shadow-sm transition-all duration-300" id="stat-passed">
          <div className="bg-emerald-600 text-white p-3.5 rounded-xl shadow-lg shadow-emerald-900/20">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="text-3xl font-black text-emerald-400 tracking-tight">{totalPassed} 款</div>
            <div className="text-xs text-emerald-500 font-bold mt-1">首波抽檢完全合格產品</div>
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-red-950/40 via-[#261014] to-red-900/10 border border-red-800/60 rounded-2xl p-5 flex items-center gap-4 shadow-sm transition-all duration-300 relative overflow-hidden" id="stat-failed">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
          <div className="bg-red-600 text-white p-3.5 rounded-xl shadow-lg shadow-red-900/20 relative z-10">
            <ShieldAlert className="w-7 h-7 animate-pulse" />
          </div>
          <div className="relative z-10">
            <div className="text-3xl font-black text-red-400 tracking-tight">{totalFailed} 款</div>
            <div className="text-xs text-red-400 font-bold mt-1">檢出致癌物超標產品 (苯駢芘 &gt; 2.0)</div>
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-amber-950/40 via-[#22180f] to-amber-900/10 border border-amber-800/60 rounded-2xl p-5 flex items-center gap-4 shadow-sm transition-all duration-300" id="stat-pending">
          <div className="bg-amber-500 text-white p-3.5 rounded-xl shadow-lg shadow-amber-900/20">
            <HelpCircle className="w-7 h-7" />
          </div>
          <div>
            <div className="text-3xl font-black text-amber-400 tracking-tight">{totalPending} 款</div>
            <div className="text-xs text-amber-500 font-bold mt-1">預防性下架送驗中產品</div>
          </div>
        </motion.div>
      </div>

      {/* Control Panel */}
      <div className="bg-[#0b0f19] p-6 rounded-2xl border border-slate-800 space-y-5 shadow-lg shadow-slate-950/40" id="checker-control-panel">
        <div className="flex flex-col md:flex-row gap-5 justify-between" id="controls-row">
          {/* Search Box */}
          <div className="relative flex-1 group" id="search-box-container">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <input
              type="text"
              id="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="輸入品牌、產品名稱、代工廠或批號..."
              className="w-full pl-11 pr-4 py-3.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium"
            />
          </div>

          {/* Status & Sort Buttons */}
          <div className="flex flex-wrap items-center gap-3" id="filters-container">
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800" id="status-filters">
              {["全部", "合格", "超標", "檢驗中"].map((status) => {
                const isSelected = statusFilter === status;
                let selectedStyle = "bg-slate-700 text-white shadow-sm";
                if (isSelected) {
                  if (status === "合格") selectedStyle = "bg-emerald-600 text-white shadow-md font-bold";
                  else if (status === "超標") selectedStyle = "bg-red-600 text-white shadow-md font-bold";
                  else if (status === "檢驗中") selectedStyle = "bg-amber-600 text-white shadow-md font-bold";
                }
                return (
                  <button
                    key={status}
                    id={`status-filter-${status}`}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2.5 text-xs font-bold rounded-lg cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? selectedStyle
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                    }`}
                  >
                    {status}
                  </button>
                );
              })}
            </div>

            <button
              id="sort-toggle-btn"
              onClick={() => setSortByValue(!sortByValue)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border rounded-xl cursor-pointer transition-colors ${
                sortByValue
                  ? "bg-amber-950/40 border-amber-800/60 text-amber-300"
                  : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <ArrowUpDown className="w-4 h-4" />
              <span>按超標量排序</span>
            </button>
          </div>
        </div>

        {/* Informative Warning Note */}
        <div className="bg-amber-950/20 border border-amber-900/30 rounded-xl p-4 text-xs text-amber-200/80 flex items-start gap-3" id="threshold-notice">
          <AlertCircle className="w-5 h-5 text-amber-500/80 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed font-medium">
            根據中華民國<strong>《食品中污染物質及毒素衛生標準》</strong>規定，食用油脂中<strong>苯駢芘（Benzo[a]pyrene）</strong>限量標準為 <strong>2.0 μg/kg</strong>。若檢驗數值大於 2.0 即屬违法不合格，須立即下架銷毀並接受裁罰。
          </p>
        </div>
      </div>

      {/* Results Table & Grid */}
      <div className="bg-[#0e1424] rounded-2xl border-2 border-slate-800 overflow-hidden shadow-xl shadow-slate-950/20" id="checker-results-container">
        {sortedRecords.length > 0 ? (
          <div className="overflow-x-auto" id="checker-table-wrapper">
            <table className="w-full text-left border-collapse" id="checker-table">
              <thead>
                <tr className="bg-gradient-to-r from-slate-950 to-slate-900 border-b border-slate-800/80 text-slate-100 text-xs uppercase font-extrabold">
                  <th className="py-4 px-5">品牌 / 產品名稱</th>
                  <th className="py-4 px-5">製造商 / 代工廠</th>
                  <th className="py-4 px-5">批號</th>
                  <th className="py-4 px-5 text-center">苯駢芘檢測值 (μg/kg)</th>
                  <th className="py-4 px-5">狀態</th>
                  <th className="py-4 px-5">處置作為</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {sortedRecords.map((record, index) => {
                  const isFailed = record.status === "failed";
                  const isPending = record.status === "pending";
                  const isPassed = record.status === "passed";

                  return (
                    <motion.tr
                      key={record.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                      id={`record-row-${record.id}`}
                      className="hover:bg-slate-900/40 transition-colors"
                    >
                      {/* Name */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-white" id={`record-brand-${record.id}`}>{record.brand}</div>
                        <div className="text-xs text-slate-400 mt-0.5" id={`record-pname-${record.id}`}>{record.productName}</div>
                      </td>

                      {/* Manufacturer */}
                      <td className="py-3 px-4">
                        <span className="text-slate-300 text-xs sm:text-sm" id={`record-mfg-${record.id}`}>{record.manufacturer}</span>
                      </td>

                      {/* Batch Number */}
                      <td className="py-3 px-4 font-mono text-xs text-slate-400" id={`record-batch-${record.id}`}>
                        {record.batchNumber}
                      </td>

                      {/* Detection Value (Visual Bar) */}
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex flex-col items-center w-full max-w-[120px]" id={`record-value-container-${record.id}`}>
                          <span
                            id={`record-value-txt-${record.id}`}
                            className={`font-mono font-bold text-base ${
                              isFailed ? "text-red-400" : isPassed ? "text-emerald-400" : "text-slate-400"
                            }`}
                          >
                            {isPending ? "未出爐" : `${record.benzopyreneValue.toFixed(2)}`}
                          </span>
                          {!isPending && (
                            <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mt-1 border border-slate-800" id={`record-bar-${record.id}`}>
                              <div
                                id={`record-bar-fill-${record.id}`}
                                className={`h-full rounded-full ${isFailed ? "bg-red-500" : "bg-emerald-500"}`}
                                style={{ width: `${Math.min((record.benzopyreneValue / 6.0) * 100, 100)}%` }}
                              />
                            </div>
                          )}
                          {!isPending && (
                            <span id={`record-ratio-${record.id}`} className="text-[10px] text-slate-400 mt-0.5">
                              {isFailed
                                                    ? `超標 ${(record.benzopyreneValue / 2.0).toFixed(1)} 倍`
                                : "低於限量標準"}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status Tag */}
                      <td className="py-3 px-4">
                        <span
                          id={`record-status-badge-${record.id}`}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            isFailed
                              ? "bg-red-950/50 text-red-300 border border-red-900/50"
                              : isPassed
                              ? "bg-emerald-950/50 text-emerald-300 border border-emerald-900/50"
                              : "bg-amber-950/50 text-amber-300 border border-amber-900/50 animate-pulse"
                          }`}
                        >
                          {isFailed ? "超標不合格" : isPassed ? "檢驗合格" : "檢驗中"}
                        </span>
                      </td>

                      {/* Action Taken */}
                      <td className="py-3 px-4 text-xs max-w-[200px]" id={`record-action-${record.id}`}>
                        <p className={isFailed ? "text-red-300 font-medium" : "text-slate-400"}>
                          {record.action}
                        </p>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 text-slate-400" id="checker-no-results">
            <ShieldAlert className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-sm">查無符合條件的食用油品牌或檢驗紀錄。</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("全部");
              }}
              className="text-xs text-indigo-400 hover:underline mt-2 font-medium cursor-pointer"
            >
              清除所有搜尋與篩選條件
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
