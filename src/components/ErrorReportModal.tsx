import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, AlertTriangle, CheckCircle, Check, Send, Sparkles, Info
} from "lucide-react";

interface ErrorReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ErrorReportModal({ isOpen, onClose }: ErrorReportModalProps) {
  const [reporterName, setReporterName] = useState("");
  const [errorType, setErrorType] = useState("第二層商家資訊有誤");
  const [targetName, setTargetName] = useState("");
  const [description, setDescription] = useState("");
  const [correctInfo, setCorrectInfo] = useState("");
  const [evidenceUrl, setEvidenceUrl] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const errorTypes = [
    "第一層油品資料錯誤",
    "第二層商家資訊有誤",
    "第三層市售食品品項有誤",
    "抽檢報告數據或批號不符",
    "政府最新公告漏未登載",
    "其他系統功能建議"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetName.trim() || !description.trim()) {
      alert("請填寫涉案對象名稱與錯誤內容描述！");
      return;
    }

    setIsSubmitting(true);
    
    // Save to localStorage
    const newReport = {
      id: crypto.randomUUID(),
      reporterName: reporterName || "熱心民眾",
      errorType,
      targetName,
      description,
      correctInfo,
      evidenceUrl,
      timestamp: new Date().toISOString(),
      status: "pending"
    };

    const existingReports = JSON.parse(window.localStorage?.getItem("errorReports") || "[]");
    window.localStorage?.setItem("errorReports", JSON.stringify([newReport, ...existingReports]));
    
    // Simulate beautiful feedback transition
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  const resetForm = () => {
    setReporterName("");
    setErrorType("第二層商家資訊有誤");
    setTargetName("");
    setDescription("");
    setCorrectInfo("");
    setEvidenceUrl("");
    setIsSuccess(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900 z-50 cursor-pointer backdrop-blur-xs"
            id="error-report-backdrop"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed top-0 right-0 h-full w-full sm:max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200 overflow-hidden text-slate-800"
            id="error-report-drawer"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800" id="drawer-header">
              <div className="flex items-center gap-2">
                <div className="bg-red-500 text-white p-1.5 rounded-lg">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base tracking-tight flex items-center gap-1.5">
                    回報資料錯誤 / 建議
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  </h3>
                  <p className="text-[10px] text-slate-400">核對政府最新公告與現場稽查動態</p>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
                id="drawer-close-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Container */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5" id="drawer-scroll-container">
              {!isSuccess ? (
                <form onSubmit={handleSubmit} className="space-y-4" id="error-report-form">
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 flex gap-2 leading-relaxed" id="form-tip">
                    <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>通報說明：</strong>
                      本平台串接多達數百筆食安資料。若您發現縣市、商家、不合格油品或終端品項有名稱、批號、管制狀態等出入，歡迎利用此處即時通報，我們將即刻核對更正。
                    </div>
                  </div>

                  {/* Error Type */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-600">回報類別</label>
                    <select
                      value={errorType}
                      onChange={(e) => setErrorType(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-red-400 focus:bg-white transition-all cursor-pointer font-medium"
                      id="report-error-type"
                    >
                      {errorTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {/* Target Object Name */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-600">
                      涉案對象名稱 / 食品品項 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="例如：王記便當店、康健沙拉油 2.6L"
                      value={targetName}
                      onChange={(e) => setTargetName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-red-400 focus:bg-white transition-all font-medium"
                      id="report-target-name"
                    />
                  </div>

                  {/* Error Description */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-600">
                      現有錯誤內容描述 <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="請說明平台上哪裡標示有誤（例如：地址錯誤、本商家早已更換合格油品但未被更新等）"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-red-400 focus:bg-white transition-all font-medium resize-none"
                      id="report-desc"
                    />
                  </div>

                  {/* Correct Info */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-600">正確資訊 / 修正建議</label>
                    <textarea
                      rows={2}
                      placeholder="請填寫經查證後的正確資訊或您希望調整的呈現方式"
                      value={correctInfo}
                      onChange={(e) => setCorrectInfo(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-red-400 focus:bg-white transition-all font-medium resize-none"
                      id="report-correct-info"
                    />
                  </div>

                  {/* Evidence URL */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-600">佐證資料連結</label>
                    <input
                      type="url"
                      placeholder="例如：地方衛生局公告網址、新聞報導或官方澄清稿"
                      value={evidenceUrl}
                      onChange={(e) => setEvidenceUrl(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-red-400 focus:bg-white transition-all font-medium"
                      id="report-evidence-url"
                    />
                  </div>

                  {/* Reporter Contact Info */}
                  <div className="grid grid-cols-1 gap-3 pt-2">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-600">通報人姓名</label>
                      <input
                        type="text"
                        placeholder="選填，如：張先生"
                        value={reporterName}
                        onChange={(e) => setReporterName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-red-400 focus:bg-white transition-all font-medium"
                        id="report-reporter-name"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-extrabold py-3 px-4 rounded-xl text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-6"
                    id="submit-report-btn"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>正在送出回報資料...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>送出錯誤通報</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Success screen */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-6 text-center space-y-6"
                  id="report-success-screen"
                >
                  <div className="w-16 h-16 bg-emerald-50 border-2 border-emerald-300 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-lg font-extrabold text-slate-900">感謝您的食安通報！</h4>
                    <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                      我們已經收到您的通報資訊，後續將會盡快核對更新。共同防衛全民食品安全！
                    </p>
                  </div>

                  {/* Manual controls */}
                  <div className="space-y-3 pt-6">
                    <button
                      onClick={onClose}
                      className="w-full bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      id="close-success-btn"
                    >
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>關閉視窗</span>
                    </button>
                    
                    <button
                      onClick={resetForm}
                      className="w-full text-slate-400 hover:text-slate-600 text-xs font-semibold py-2 hover:underline cursor-pointer"
                      id="report-another-btn"
                    >
                      回報另一則錯誤
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer Sign */}
            <div className="p-4 bg-slate-50 border-t border-slate-150 text-center text-[10px] text-slate-400 font-medium" id="drawer-footer">
              守護全民食安防線 &bull; 自主糾錯與通報核實系統
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
