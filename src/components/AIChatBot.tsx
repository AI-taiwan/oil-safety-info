import { useState, useRef, useEffect } from "react";
import { Message } from "../types";
import { Send, Bot, User, Loader2, Sparkles, HelpCircle, ExternalLink, RefreshCw } from "lucide-react";
import { motion } from "motion/react";

export default function AIChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "ai",
      content: "您好！我是您的 **AI 食安健康諮詢助理**。針對這此「食安致癌沙拉油事件」，不論您是想查詢特定品牌是否合格、了解超標致癌物「苯駢芘」的健康危害，還是想知道日常如何排除毒素或選用安全好油，我都能為您提供最新、且經過 Google 搜尋查證的專業解答。請在下方輸入您的問題，或點選推薦問題開始諮詢！",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const suggestedPrompts = [
    "如何查詢某品牌沙拉油是否檢驗合格？",
    "不小心吃到含苯駢芘的油，日常吃什麼可以幫助排毒？",
    "什麼是苯駢芘？食用超標油品會有哪些癌症危害？",
    "請推薦幾款首波抽驗完全合格且安全的知名沙拉油品牌"
  ];

  // Scroll to bottom whenever messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      sender: "user",
      content: text,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.sender === "user" ? "user" : "model",
            content: m.content
          }))
        })
      });

      if (!response.ok) {
        throw new Error("Failed to contact API");
      }

      const data = await response.json();
      
      const aiMessage: Message = {
        id: `msg-${Date.now()}-ai`,
        sender: "ai",
        content: data.text || "抱歉，我目前無法回應這個問題。",
        timestamp: new Date(),
        sources: data.sources || []
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: `msg-${Date.now()}-err`,
        sender: "ai",
        content: "抱歉，與 AI 連線時發生異常。建議您可以稍後再試，或點擊下方按鈕重新嘗試連線。",
        timestamp: new Date(),
        isError: true
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: "welcome",
        sender: "ai",
        content: "您好！我是您的 **AI 食安健康諮詢助理**。針對這此「食安致癌沙拉油事件」，不論您是想查詢特定品牌是否合格、了解超標致癌物「苯駢芘」的健康危害，還是想知道日常如何排除毒素或選用安全好油，我都能為您提供最新、且經過 Google 搜尋查證的專業解答。請在下方輸入您的問題，或點選推薦問題開始諮詢！",
        timestamp: new Date()
      }
    ]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[650px]" id="ai-chat-root">
      {/* Left 1 Col: Suggested Prompt Sidepanel */}
      <div className="lg:col-span-1 bg-gradient-to-b from-indigo-50/90 via-sky-50/50 to-white border-2 border-indigo-150 rounded-2xl p-5 flex flex-col justify-between shadow-sm" id="chat-sidebar">
        <div className="space-y-4" id="chat-sidebar-top">
          <div className="flex items-center gap-2 text-indigo-950" id="chat-sidebar-header">
            <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500 animate-spin-slow" />
            <h4 className="font-extrabold text-sm tracking-tight text-indigo-950">AI 快速諮詢指引</h4>
          </div>
          <p className="text-xs text-indigo-900/80 leading-relaxed font-semibold">
            您可以直接點選以下預設的熱門諮詢問題，AI 將依據衛福部食藥署與最新的食安新聞為您進行查證回答：
          </p>
          <div className="space-y-2.5" id="suggested-prompts-list">
            {suggestedPrompts.map((prompt, idx) => (
              <button
                key={idx}
                id={`suggested-prompt-${idx}`}
                onClick={() => handleSendMessage(prompt)}
                disabled={isLoading}
                className="w-full text-left p-3.5 bg-white hover:bg-indigo-50/75 disabled:hover:bg-white border-2 border-slate-200 hover:border-indigo-350 rounded-xl text-xs font-bold text-slate-700 hover:text-indigo-900 transition-all cursor-pointer leading-relaxed shadow-2xs"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Clear/Reset button */}
        <button
          onClick={handleResetChat}
          id="reset-chat-btn"
          className="flex items-center justify-center gap-2 w-full mt-4 py-3 bg-white hover:bg-rose-50 border-2 border-rose-200 hover:border-rose-300 rounded-xl text-xs font-extrabold text-rose-600 transition-all cursor-pointer shadow-2xs"
        >
          <RefreshCw className="w-3.5 h-3.5 text-rose-500 animate-spin" />
          <span>重啟諮詢（清空歷史）</span>
        </button>
      </div>

      {/* Right 3 Cols: Active Dialogue Window */}
      <div className="lg:col-span-3 flex flex-col bg-white border-2 border-slate-200 rounded-2xl overflow-hidden h-full shadow-sm" id="chat-window-container">
        {/* Chat Window Header */}
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-950 text-white p-5 flex items-center justify-between border-b border-indigo-900/40" id="chat-header">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 p-2 rounded-xl shadow-lg shadow-amber-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-black flex items-center gap-1.5 tracking-tight">
                <span>AI 食安諮詢安全助手</span>
                <span className="text-[9px] font-black text-emerald-400 bg-emerald-950 border border-emerald-900/60 px-2 py-0.5 rounded-full uppercase">
                  Google Search Grounded
                </span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5 font-medium">提供最即時、客觀的新聞數據比對與食品安全解答</div>
            </div>
          </div>
        </div>

        {/* Messages Log area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-gradient-to-b from-slate-50 to-slate-100/50" id="chat-messages-container">
          {messages.map((msg) => {
            const isAi = msg.sender === "ai";
            return (
              <div
                key={msg.id}
                id={`chat-msg-bubble-${msg.id}`}
                className={`flex gap-3 max-w-[85%] ${isAi ? "mr-auto" : "ml-auto flex-row-reverse"}`}
              >
                {/* Avatar Icon */}
                <div
                  className={`w-8.5 h-8.5 rounded-full flex items-center justify-center flex-shrink-0 text-white border-2 shadow-sm ${
                    isAi
                      ? "bg-slate-950 border-slate-800"
                      : "bg-gradient-to-br from-blue-500 to-indigo-600 border-indigo-400"
                  }`}
                  id={`chat-avatar-${msg.id}`}
                >
                  {isAi ? <Bot className="w-4.5 h-4.5" /> : <User className="w-4.5 h-4.5" />}
                </div>

                {/* Bubble Text */}
                <div className="space-y-1.5" id={`chat-bubble-content-${msg.id}`}>
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-medium ${
                      isAi
                        ? msg.isError
                          ? "bg-red-50 border-2 border-red-200 text-red-800 shadow-sm"
                          : "bg-white border-2 border-slate-200 text-slate-800 shadow-xs"
                        : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/10"
                    }`}
                  >
                    {msg.content}
                  </div>

                  {/* Grounded Sources */}
                  {isAi && msg.sources && msg.sources.length > 0 && (
                    <div className="bg-slate-100/80 border border-slate-200/50 rounded-xl p-2.5 space-y-1.5 mt-2" id={`chat-sources-${msg.id}`}>
                      <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                        <HelpCircle className="w-3 h-3" />
                        AI 搜尋查證參考來源：
                      </span>
                      <div className="flex flex-wrap gap-2" id={`sources-links-${msg.id}`}>
                        {msg.sources.map((source, sIdx) => (
                          <a
                            key={sIdx}
                            href={source.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 bg-white hover:bg-slate-200 border border-slate-200 rounded-md px-2 py-1 text-[11px] font-semibold text-blue-600 transition-colors"
                          >
                            <span>{source.title}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 max-w-[80%] mr-auto" id="chat-loading-bubble">
              <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-white">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center gap-2 text-slate-500 text-xs sm:text-sm">
                <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                <span>正在調用 Google 搜尋進行即時食安資訊比對...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Message Input Box */}
        <form
          id="chat-input-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputValue);
          }}
          className="border-t border-slate-200 p-4 bg-white flex gap-2"
        >
          <input
            type="text"
            id="chat-input-field"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            placeholder="請輸入關於特定品牌油品檢驗合格狀態、或苯駢芘毒性等食安問題..."
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-400 focus:bg-white transition-all disabled:opacity-60"
          />
          <button
            type="submit"
            id="chat-send-btn"
            disabled={!inputValue.trim() || isLoading}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl flex items-center justify-center transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
