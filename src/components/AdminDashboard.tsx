import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  ShieldAlert, Settings, AlertTriangle, CheckCircle, Clock, Search, Trash2, Check, RefreshCw, Lock
} from "lucide-react";

interface ReportData {
  id: string;
  reporterName: string;
  errorType: string;
  targetName: string;
  description: string;
  correctInfo: string;
  evidenceUrl: string;
  timestamp: string;
  status: "pending" | "resolved";
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [reports, setReports] = useState<ReportData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "resolved">("all");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "910113") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("密碼錯誤，請重新輸入");
    }
  };

  const loadReports = () => {
    const data = localStorage.getItem("errorReports");
    if (data) {
      setReports(JSON.parse(data));
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleStatusChange = (id: string, newStatus: "pending" | "resolved") => {
    const updatedReports = reports.map(report => 
      report.id === id ? { ...report, status: newStatus } : report
    );
    setReports(updatedReports);
    localStorage.setItem("errorReports", JSON.stringify(updatedReports));
  };

  const handleDelete = (id: string) => {
    if (window.confirm("確定要刪除這筆通報紀錄嗎？")) {
      const updatedReports = reports.filter(report => report.id !== id);
      setReports(updatedReports);
      localStorage.setItem("errorReports", JSON.stringify(updatedReports));
    }
  };

  const clearAllReports = () => {
    if (window.confirm("確定要清空所有通報紀錄嗎？此操作無法還原。")) {
      setReports([]);
      localStorage.removeItem("errorReports");
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.targetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reporterName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" ? true : report.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const pendingCount = reports.filter(r => r.status === "pending").length;
  const resolvedCount = reports.filter(r => r.status === "resolved").length;

  if (!isAuthenticated) {
    return (
      <div className="w-full max-w-md mx-auto mt-10 p-6 bg-[#0b0f19] border border-slate-800 rounded-2xl shadow-xl">
        <div className="flex flex-col items-center gap-3 mb-6">
          <div className="bg-slate-900 p-3 rounded-full border border-slate-800">
            <Lock className="w-6 h-6 text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-white">後台檢視系統</h2>
          <p className="text-xs text-slate-500">請輸入管理員密碼以查看通報紀錄</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="請輸入密碼..."
              className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              autoFocus
            />
            {error && <p className="text-xs text-red-400 mt-2 ml-1">{error}</p>}
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold rounded-xl transition-colors cursor-pointer"
          >
            登入系統
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6" id="admin-dashboard-root">
      {/* Admin Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5" id="admin-stats">
        <motion.div whileHover={{ scale: 1.02 }} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="bg-blue-600 text-white p-3.5 rounded-xl shadow-lg shadow-blue-900/20">
            <Settings className="w-7 h-7" />
          </div>
          <div>
            <div className="text-3xl font-black text-white tracking-tight">{reports.length}</div>
            <div className="text-xs text-slate-400 font-bold mt-1">總通報件數</div>
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="bg-amber-500 text-white p-3.5 rounded-xl shadow-lg shadow-amber-900/20">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div>
            <div className="text-3xl font-black text-amber-400 tracking-tight">{pendingCount}</div>
            <div className="text-xs text-slate-400 font-bold mt-1">待處理通報</div>
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="bg-emerald-600 text-white p-3.5 rounded-xl shadow-lg shadow-emerald-900/20">
            <CheckCircle className="w-7 h-7" />
          </div>
          <div>
            <div className="text-3xl font-black text-emerald-400 tracking-tight">{resolvedCount}</div>
            <div className="text-xs text-slate-400 font-bold mt-1">已解決案件</div>
          </div>
        </motion.div>
      </div>

      {/* Control Panel */}
      <div className="bg-[#0b0f19] p-6 rounded-2xl border border-slate-800 space-y-5 shadow-lg shadow-slate-950/40">
        <div className="flex flex-col md:flex-row gap-5 justify-between">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜尋涉案對象、通報內容或通報人..."
              className="w-full pl-11 pr-4 py-3.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-4 py-2.5 text-xs font-bold rounded-lg cursor-pointer transition-all duration-200 ${
                  statusFilter === "all" ? "bg-slate-700 text-white shadow-md" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                }`}
              >
                全部
              </button>
              <button
                onClick={() => setStatusFilter("pending")}
                className={`px-4 py-2.5 text-xs font-bold rounded-lg cursor-pointer transition-all duration-200 ${
                  statusFilter === "pending" ? "bg-amber-600 text-white shadow-md" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                }`}
              >
                待處理
              </button>
              <button
                onClick={() => setStatusFilter("resolved")}
                className={`px-4 py-2.5 text-xs font-bold rounded-lg cursor-pointer transition-all duration-200 ${
                  statusFilter === "resolved" ? "bg-emerald-600 text-white shadow-md" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                }`}
              >
                已解決
              </button>
            </div>
            
            <button
              onClick={loadReports}
              className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
              title="重新整理"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={clearAllReports}
              className="p-3 bg-red-950/40 border border-red-900/50 rounded-xl text-red-400 hover:bg-red-900/50 hover:text-red-300 transition-colors cursor-pointer"
              title="清空所有資料"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-4 pt-2">
          {filteredReports.length === 0 ? (
            <div className="py-12 text-center text-slate-500 flex flex-col items-center gap-3">
              <ShieldAlert className="w-12 h-12 text-slate-700" />
              <p className="font-bold">目前沒有符合條件的通報紀錄</p>
            </div>
          ) : (
            filteredReports.map((report) => (
              <motion.div 
                key={report.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-5 rounded-xl border transition-colors ${
                  report.status === "resolved" 
                    ? "bg-emerald-950/20 border-emerald-900/30" 
                    : "bg-slate-900/50 border-slate-800"
                }`}
              >
                <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-1 text-[10px] font-bold rounded-md ${
                        report.status === "resolved" ? "bg-emerald-950 text-emerald-400 border border-emerald-800" : "bg-amber-950 text-amber-400 border border-amber-800"
                      }`}>
                        {report.status === "resolved" ? "已解決" : "待處理"}
                      </span>
                      <span className="px-2 py-1 bg-slate-800 text-slate-300 text-[10px] font-bold rounded-md border border-slate-700">
                        {report.errorType}
                      </span>
                      <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(report.timestamp).toLocaleString("zh-TW")}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-extrabold text-white flex items-center gap-2">
                        {report.targetName}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">通報人：{report.reporterName}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mt-3">
                      <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/60">
                        <div className="text-[10px] text-red-400 font-bold mb-1.5 uppercase tracking-wider">錯誤內容描述</div>
                        <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{report.description}</p>
                      </div>
                      
                      {report.correctInfo && (
                        <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/60">
                          <div className="text-[10px] text-emerald-400 font-bold mb-1.5 uppercase tracking-wider">正確資訊建議</div>
                          <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{report.correctInfo}</p>
                        </div>
                      )}
                    </div>
                    
                    {report.evidenceUrl && (
                      <div className="text-xs mt-2">
                        <span className="text-slate-500 font-bold">佐證連結：</span>
                        <a href={report.evidenceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline underline-offset-2 break-all">
                          {report.evidenceUrl}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="flex md:flex-col gap-2 shrink-0 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-4 w-full md:w-auto">
                    {report.status === "pending" ? (
                      <button
                        onClick={() => handleStatusChange(report.id, "resolved")}
                        className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>標記解決</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(report.id, "pending")}
                        className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>設為待辦</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(report.id)}
                      className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-red-950/50 hover:bg-red-900/60 text-red-400 text-xs font-bold rounded-lg border border-red-900/50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>刪除</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
