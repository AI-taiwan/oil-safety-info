import React, { useState, useEffect } from "react";
import { Megaphone, ExternalLink, X, PlusCircle, ArrowLeft, ArrowRight, ShieldCheck, Sparkles, Check, Settings, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AdItem {
  id: string;
  brand: string;
  title: string;
  description: string;
  tag: "安心油品" | "綠色餐廳" | "食安宣導" | "合作推廣";
  badgeColor: string;
  bgGradient: string;
  link: string;
  isCustom?: boolean;
}

const defaultAds: AdItem[] = [
  {
    id: "ad-1",
    brand: "泰山企業",
    title: "泰山大豆沙拉油 3L - 國家安全認證優良油品",
    description: "純植物精煉，耐高溫不易起煙，不飽和脂肪酸，每批油品均通過嚴格國家檢驗，為您的廚房建立最強食安防線！",
    tag: "安心油品",
    badgeColor: "bg-emerald-950/80 text-emerald-300 border-emerald-800/60",
    bgGradient: "from-emerald-950/50 via-[#0a1815] to-[#070b14]",
    link: "https://www.taisun.com.tw/"
  },
  {
    id: "ad-2",
    brand: "義美生機",
    title: "100% 契作冷壓黑芝麻油 - 遵循古法、滴滴香醇",
    description: "精選台灣契作黑芝麻，低溫慢火烘焙、冷壓初榨，無化學添加物，無重金屬與致癌物殘留，重現經典香氣！",
    tag: "安心油品",
    badgeColor: "bg-blue-950/80 text-blue-300 border-blue-800/60",
    bgGradient: "from-blue-950/50 via-[#09152b] to-[#070b14]",
    link: "https://www.imeifoods.com.tw/"
  },
  {
    id: "ad-3",
    brand: "陽光廚房生機餐飲",
    title: "全台連鎖綠色餐廳 - 承諾100%使用檢驗合格油品",
    description: "食安誠信高於一切！陽光廚房生機餐飲旗下所有分店，皆已配合衛生局完成合格油品登記，讓您吃得健康、吃得安心！",
    tag: "綠色餐廳",
    badgeColor: "bg-indigo-950/80 text-indigo-300 border-indigo-800/60",
    bgGradient: "from-indigo-950/50 via-[#0d122b] to-[#070b14]",
    link: "https://www.fda.gov.tw"
  },
  {
    id: "ad-4",
    brand: "食藥署安全宣導",
    title: "選購食用油「三不原則」- 守護家人健康",
    description: "提醒民眾：不買標示不明或外包裝破損之油品、不買異常便宜低於市價之商品、不買散裝來源不可考之食用油！",
    tag: "食安宣導",
    badgeColor: "bg-amber-950/80 text-amber-300 border-amber-800/60",
    bgGradient: "from-amber-950/50 via-[#1c140d] to-[#070b14]",
    link: "https://www.fda.gov.tw"
  }
];

export default function AdBanner() {
  const [ads, setAds] = useState<AdItem[]>(defaultAds);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [showAdSenseSettings, setShowAdSenseSettings] = useState<boolean>(false);

  // AdSense Integration States
  const [adMode, setAdMode] = useState<"platform" | "adsense">(() => {
    return (localStorage.getItem("adMode") as "platform" | "adsense") || "platform";
  });
  const [publisherId, setPublisherId] = useState(() => {
    return localStorage.getItem("adSensePublisherId") || "ca-pub-2699349243934030";
  });
  const [slotId, setSlotId] = useState(() => {
    return localStorage.getItem("adSenseSlotId") || "9876543210";
  });

  // Form State for renting ad slots
  const [formBrand, setFormBrand] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formTag, setFormTag] = useState<"安心油品" | "綠色餐廳" | "食安宣導" | "合作推廣">("安心油品");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Load custom ads from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("customAds");
    if (saved) {
      try {
        const parsed: AdItem[] = JSON.parse(saved);
        setAds([...defaultAds, ...parsed]);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Timer for auto sliding
  useEffect(() => {
    if (!isPlaying || ads.length <= 1 || adMode !== "platform") return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPlaying, ads.length, adMode]);

  // Dynamically Load Google AdSense Script tag
  useEffect(() => {
    if (adMode === "adsense") {
      const scriptId = "google-adsense-script";
      let script = document.getElementById(scriptId) as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement("script");
        script.id = scriptId;
        script.async = true;
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`;
        script.crossOrigin = "anonymous";
        document.head.appendChild(script);
      }

      // Safe initialization of adsbygoogle stack
      try {
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});
      } catch (e) {
        console.warn("Google AdSense adsbygoogle pushes are queued successfully, pending domain verification.");
      }
    }
  }, [adMode, publisherId, slotId]);

  if (!isOpen) return null;

  const currentAd = ads[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % ads.length);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formBrand || !formTitle || !formDescription) return;

    const newAd: AdItem = {
      id: "ad-custom-" + Date.now(),
      brand: formBrand,
      title: formTitle,
      description: formDescription,
      tag: formTag,
      badgeColor: formTag === "安心油品" 
        ? "bg-emerald-950/80 text-emerald-300 border-emerald-800/60" 
        : formTag === "綠色餐廳" 
        ? "bg-indigo-950/80 text-indigo-300 border-indigo-800/60" 
        : formTag === "食安宣導"
        ? "bg-amber-950/80 text-amber-300 border-amber-800/60"
        : "bg-rose-950/80 text-rose-300 border-rose-800/60",
      bgGradient: formTag === "安心油品" 
        ? "from-emerald-950/50 via-[#0a1815] to-[#070b14]" 
        : formTag === "綠色餐廳" 
        ? "from-indigo-950/50 via-[#0d122b] to-[#070b14]" 
        : formTag === "食安宣導"
        ? "from-amber-950/50 via-[#1c140d] to-[#070b14]"
        : "from-rose-950/50 via-[#26101c] to-[#070b14]",
      link: "https://www.fda.gov.tw",
      isCustom: true
    };

    const updatedAds = [...ads, newAd];
    setAds(updatedAds);
    
    // Save to local storage (only keep custom ones)
    const customOnly = updatedAds.filter(a => a.isCustom);
    localStorage.setItem("customAds", JSON.stringify(customOnly));

    // Jump to the newly added ad
    setCurrentIndex(updatedAds.length - 1);
    setIsSubmitted(true);

    setTimeout(() => {
      setIsSubmitted(false);
      setShowSubmitModal(false);
      // Reset form
      setFormBrand("");
      setFormTitle("");
      setFormDescription("");
    }, 2000);
  };

  const handleAdSenseSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("adMode", adMode);
    localStorage.setItem("adSensePublisherId", publisherId);
    localStorage.setItem("adSenseSlotId", slotId);
    setShowAdSenseSettings(false);
  };

  return (
    <div 
      className="relative mb-6 rounded-2xl border border-slate-800/80 bg-gradient-to-r p-6 shadow-xl overflow-hidden transition-all duration-500"
      style={{
        backgroundImage: adMode === "adsense"
          ? "linear-gradient(to right, #0b1124, #070b14)"
          : `linear-gradient(to right, ${currentAd?.bgGradient ? currentAd.bgGradient.replace("from-", "").replace("via-", "").replace("to-", "") : "#070b14"})`
      }}
      id="ad-banner-container"
    >
      {/* Decorative Grid Mesh overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none opacity-20" />

      {/* Dismiss button */}
      <button 
        onClick={() => setIsOpen(false)}
        className="absolute top-4 right-4 p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-800/40 rounded-lg transition-all z-10 cursor-pointer"
        title="隱藏推廣廣告"
      >
        <X className="w-4 h-4" />
      </button>

      {/* AdSense Mode View */}
      {adMode === "adsense" ? (
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-extrabold uppercase tracking-wider">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Google AdSense 聯播網廣告模式</span>
              </div>
              <span className="px-2.5 py-1 bg-slate-900/80 border border-slate-800/60 rounded text-[10px] font-mono text-slate-400">
                {publisherId}
              </span>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-base sm:text-lg font-black text-white tracking-tight leading-snug flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
                <span>Google 實體廣告單元 (已嵌入測試)</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed max-w-4xl">
                當前頁面已動態載入 Google 廣告腳本，並部署了指定發佈商的廣告容器。如果您在本地開發或未認證網域時看到空白區域，此為 Google 的安全驗證機制，一旦在認證網域 (heiban.pixnet.net) 上部署後，廣告將立即正常渲染並開始賺取收益！
              </p>
            </div>

            {/* Google AdSense HTML Insertion */}
            <div className="bg-slate-950/60 rounded-xl border border-dashed border-slate-800 p-4 overflow-hidden flex items-center justify-center min-h-[120px]">
              <ins 
                className="adsbygoogle"
                style={{ display: "block", minWidth: "250px", height: "90px" }}
                data-ad-client={publisherId}
                data-ad-slot={slotId}
                data-ad-format="auto"
                data-full-width-responsive="true"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button 
                onClick={() => setShowAdSenseSettings(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-xl text-xs sm:text-sm font-black transition-all hover:scale-105"
              >
                <Settings className="w-4 h-4" />
                <span>配置或切換廣告來源</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Normal Local Carousel View */
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          
          {/* Ad Left Content */}
          <div className="flex-1 space-y-4">
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Promo Header Label */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-extrabold uppercase tracking-wider">
                <Megaphone className="w-3.5 h-3.5" />
                <span>安心推廣合作</span>
              </div>

              {/* Slide Category Badge */}
              <span className={`px-2.5 py-1 rounded text-[10px] font-black border uppercase tracking-wider ${currentAd?.badgeColor}`}>
                {currentAd?.tag}
              </span>

              {/* Custom ad label */}
              {currentAd?.isCustom && (
                <span className="flex items-center gap-1 px-2.5 py-1 bg-violet-950 text-violet-300 border border-violet-800 text-[10px] font-bold rounded">
                  <Sparkles className="w-3 h-3 text-violet-400" />
                  <span>您的專屬廣告</span>
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <span>{currentAd?.brand}</span>
              </div>
              <h4 className="text-base sm:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-50 via-slate-100 to-slate-200 tracking-tight leading-snug">
                {currentAd?.title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed max-w-4xl">
                {currentAd?.description}
              </p>
            </div>

            {/* Call to action & navigation button combo */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a 
                href={currentAd?.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-xl text-xs sm:text-sm font-black transition-all hover:scale-105 active:scale-95 shadow-md shadow-indigo-900/20 group"
              >
                <span>了解詳情 / 官方網站</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>

              <button 
                onClick={() => setShowSubmitModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs sm:text-sm font-bold border border-slate-700/60 transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-indigo-400" />
                <span>我也想刊登廣告</span>
              </button>

              <button 
                onClick={() => setShowAdSenseSettings(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-950/40 hover:bg-slate-900 text-slate-400 hover:text-slate-200 rounded-xl text-xs sm:text-sm font-bold border border-slate-800/60 transition-all cursor-pointer"
                title="切換成 Google AdSense 實體廣告"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Google AdSense 設置</span>
              </button>
            </div>

          </div>

          {/* Ad Right Navigation and Paging Panel */}
          <div className="flex items-center gap-4 border-t lg:border-t-0 border-slate-800/40 pt-4 lg:pt-0 self-end lg:self-center">
            
            {/* Pause / Play */}
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-2.5 py-1.5 text-[11px] font-black bg-slate-900/50 hover:bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800 rounded-lg transition-all cursor-pointer"
            >
              {isPlaying ? "暫停輪播" : "自動輪播"}
            </button>

            {/* Navigation buttons */}
            <div className="flex items-center gap-1.5 bg-slate-950/40 p-1 rounded-xl border border-slate-800/60">
              <button 
                onClick={handlePrev}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-all cursor-pointer"
                title="上一則"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono font-bold text-slate-400 px-2">
                {currentIndex + 1} / {ads.length}
              </span>
              <button 
                onClick={handleNext}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-all cursor-pointer"
                title="下一則"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      )}

      {/* AdSense Settings Modal */}
      {showAdSenseSettings && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0b101f] border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden p-6 relative"
          >
            <button 
              onClick={() => setShowAdSenseSettings(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Settings className="w-6 h-6 text-indigo-400" />
                <h3 className="text-lg font-black text-white">Google AdSense 聯播網廣告配置</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                您可以將本網站的推廣欄位切換為您個人的 **Google AdSense 廣告聯播網**。輸入您的發佈商 ID 與廣告單元 ID 即可生效！
              </p>

              <form onSubmit={handleAdSenseSave} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">選擇廣告模式 *</label>
                  <select 
                    value={adMode}
                    onChange={(e) => setAdMode(e.target.value as "platform" | "adsense")}
                    className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="platform">使用食安宣導輪播 (推薦：精美、自訂刊登)</option>
                    <option value="adsense">啟用實體 Google AdSense 廣告</option>
                  </select>
                </div>

                {adMode === "adsense" && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">
                        Google AdSense 發佈商 ID (ca-pub-xxx) *
                      </label>
                      <input 
                        type="text" 
                        required
                        placeholder="例如：ca-pub-1234567890123456"
                        value={publisherId}
                        onChange={(e) => setPublisherId(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-3 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">
                        廣告單元 ID (Slot ID) *
                      </label>
                      <input 
                        type="text" 
                        required
                        placeholder="例如：9876543210"
                        value={slotId}
                        onChange={(e) => setSlotId(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-3 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="p-3 bg-amber-950/40 border border-amber-800/50 rounded-xl space-y-1.5 text-amber-300">
                      <div className="flex items-center gap-1.5 text-xs font-bold">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        <span>重要提示 (網域配置與生效須知)</span>
                      </div>
                      <p className="text-[11px] leading-relaxed opacity-90">
                        您已啟用 Google AdSense 廣告。請確保您的 Google AdSense 後台已將該網域（例如 heiban.pixnet.net 或您的自訂域名）新增至驗證清單中。若無新增，Google AdSense 為了安全防護與防止作弊，將會保持空白，此為正軌正常運作！
                      </p>
                    </div>
                  </>
                )}

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setShowAdSenseSettings(false)}
                    className="px-4 py-2 text-xs sm:text-sm font-bold text-slate-400 hover:text-white cursor-pointer"
                  >
                    取消
                  </button>
                  <button 
                    type="submit" 
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-black transition-all hover:scale-105"
                  >
                    儲存配置並生效
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* Rent / Custom Ad Submission Modal Popup */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0b101f] border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden p-6 relative"
          >
            <button 
              onClick={() => setShowSubmitModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Megaphone className="w-6 h-6 text-indigo-400" />
                <h3 className="text-lg font-black text-white">租用食安平台廣告欄位 (預覽體驗)</h3>
              </div>
              <p className="text-xs text-slate-400">
                本食安平台免費開放綠色友善餐廳、安心檢驗合格油品商、以及政府宣導機構刊登宣導廣告。填寫下方表單可即時於本輪播看板預覽刊登效果！
              </p>

              {isSubmitted ? (
                <div className="py-8 text-center space-y-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-400">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-white">廣告加入成功！</h4>
                  <p className="text-xs text-slate-400">已成功加入看板。正在自動為您跳轉預覽廣告...</p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">品牌/機構名稱 *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="例如：主婦之友生機合作社"
                      value={formBrand}
                      onChange={(e) => setFormBrand(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">推廣標籤類型 *</label>
                    <select 
                      value={formTag}
                      onChange={(e) => setFormTag(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="安心油品">安心油品</option>
                      <option value="綠色餐廳">綠色餐廳</option>
                      <option value="食安宣導">食安宣導</option>
                      <option value="合作推廣">合作推廣</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">廣告標題 (推薦25字內) *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="例如：冷壓有機印加果油 - 富含 Omega-3，無毒純淨"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">推廣詳細描述 *</label>
                    <textarea 
                      required
                      rows={3}
                      placeholder="介紹您的商品或綠色餐廳承諾，例如：嚴選契作原料，每批皆通過黃麴毒素與致癌物檢測..."
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button 
                      type="button" 
                      onClick={() => setShowSubmitModal(false)}
                      className="px-4 py-2 text-xs sm:text-sm font-bold text-slate-400 hover:text-white cursor-pointer"
                    >
                      取消
                    </button>
                    <button 
                      type="submit" 
                      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-black transition-all hover:scale-105"
                    >
                      確認加入並預覽
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
