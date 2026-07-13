import { useState, useMemo } from "react";
import { supplyChainNodes } from "../data";
import { SupplyChainNode } from "../types";
import { downstreamMerchantsData } from "../merchantsData";
import { TIER3_FOODS } from "../tier3Data";
import { 
  ShieldAlert, ArrowRight, Layers, HelpCircle, CheckCircle2, ChevronRight,
  Search, Building2, Utensils, Tag, ChevronLeft, Check, Sparkles, AlertTriangle
} from "lucide-react";
import { motion } from "motion/react";

interface SupplyChainTrackerProps {
  selectedNodeId?: string | null;
  setSelectedNodeId?: (id: string) => void;
}

export default function SupplyChainTracker({
  selectedNodeId: propSelectedNodeId,
  setSelectedNodeId: propSetSelectedNodeId,
}: SupplyChainTrackerProps = {}) {
  const [localSelectedNodeId, setLocalSelectedNodeId] = useState<string>("s1");
  const [inspectorSearch, setInspectorSearch] = useState<string>("");
  const [inspectorPage, setInspectorPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 5;

  const selectedNodeId = propSelectedNodeId !== undefined && propSelectedNodeId !== null
    ? propSelectedNodeId
    : localSelectedNodeId;

  const setSelectedNodeId = propSetSelectedNodeId || setLocalSelectedNodeId;

  const handleNodeSelect = (id: string) => {
    setSelectedNodeId(id);
    setInspectorSearch("");
    setInspectorPage(1);
  };

  const selectedNode = supplyChainNodes.find((n) => n.id === selectedNodeId) || supplyChainNodes[0];

  const categories = ["原料進口", "精煉加工", "分裝品牌", "下游通路"];

  // Downstream connection helper
  const getConnections = (node: SupplyChainNode) => {
    return supplyChainNodes.filter((n) => node.connections.includes(n.id));
  };

  // Upstream source helper (who points to me?)
  const getUpstreamSources = (nodeId: string) => {
    return supplyChainNodes.filter((n) => n.connections.includes(nodeId));
  };

  const downstream = getConnections(selectedNode);
  const upstream = getUpstreamSources(selectedNodeId);

  // Reset page when search or selected node changes
  const [prevNodeAndSearch, setPrevNodeAndSearch] = useState({ id: selectedNodeId, search: "" });
  if (selectedNodeId !== prevNodeAndSearch.id || inspectorSearch !== prevNodeAndSearch.search) {
    setInspectorPage(1);
    setPrevNodeAndSearch({ id: selectedNodeId, search: inspectorSearch });
  }

  // Dual-trace interactive dataset binding
  const linkedData = useMemo(() => {
    const searchLower = inspectorSearch.toLowerCase().trim();

    const filterMerchants = (list: typeof downstreamMerchantsData) => {
      if (!searchLower) return list;
      return list.filter(m => 
        m.county.toLowerCase().includes(searchLower) ||
        m.merchantName.toLowerCase().includes(searchLower) ||
        m.productName.toLowerCase().includes(searchLower) ||
        m.oilBrand.toLowerCase().includes(searchLower)
      );
    };

    const filterFoods = (list: typeof TIER3_FOODS) => {
      if (!searchLower) return list;
      return list.filter(f => 
        f.name.toLowerCase().includes(searchLower) ||
        f.manufacturer.toLowerCase().includes(searchLower) ||
        f.category.toLowerCase().includes(searchLower) ||
        f.status.toLowerCase().includes(searchLower)
      );
    };

    switch (selectedNodeId) {
      case "s1": { // 頂順貿易 - 原料進口
        const totalCount = downstreamMerchantsData.length;
        const fusoCount = downstreamMerchantsData.filter(m => m.oilBrand === "福壽").length;
        const fortuneCount = downstreamMerchantsData.filter(m => m.oilBrand === "福懋").length;
        const taisunCount = downstreamMerchantsData.filter(m => m.oilBrand === "泰山").length;
        return {
          type: "stats",
          title: "全台涉案流向總體數據",
          stats: {
            total: totalCount,
            fortune: fortuneCount,
            fuso: fusoCount,
            taisun: taisunCount,
            foods: TIER3_FOODS.length
          }
        };
      }

      case "s3": { // 恆新製油工廠 - 涉案代工廠
        const list = downstreamMerchantsData.filter(m => m.oilBrand === "福懋" || m.oilBrand === "泰山");
        return {
          type: "merchants",
          title: "恆新精煉代工：受害商家名冊",
          items: filterMerchants(list)
        };
      }

      case "s4": { // 源豐生技 - 部分受波及代工廠
        const list = downstreamMerchantsData.filter(m => m.oilBrand === "福壽" || m.productName.includes("御品膳"));
        return {
          type: "merchants",
          title: "源豐精煉代工：稽查商家名冊",
          items: filterMerchants(list)
        };
      }

      case "s7": { // 康健食品 - 受害委託品牌
        const list = downstreamMerchantsData.filter(m => m.productName.includes("康健") || m.merchantName.includes("康健") || m.productName.includes("益康"));
        return {
          type: "merchants",
          title: "康健品牌：下架通路稽查名單",
          items: filterMerchants(list)
        };
      }

      case "s8": { // 廚神牌 - 受害委託品牌
        const list = downstreamMerchantsData.filter(m => m.productName.includes("廚神") || m.merchantName.includes("廚神"));
        return {
          type: "merchants",
          title: "廚神品牌：下架通路稽查名單",
          items: filterMerchants(list)
        };
      }

      case "s9": { // 安心家 & 美味廚房 - 預防性品牌
        const list = downstreamMerchantsData.filter(m => 
          m.productName.includes("安心家") || 
          m.productName.includes("美味廚房") || 
          m.merchantName.includes("安心家") || 
          m.merchantName.includes("美味廚房")
        );
        return {
          type: "merchants",
          title: "安心家/美味廚房：預防性管制通路",
          items: filterMerchants(list)
        };
      }

      case "s10": { // 御品膳 - 受波及品牌
        const list = downstreamMerchantsData.filter(m => m.productName.includes("御品膳") || m.merchantName.includes("御品膳"));
        return {
          type: "merchants",
          title: "御品膳品牌：下架通路稽查名單",
          items: filterMerchants(list)
        };
      }

      case "s11": { // 義美、統一、得意的一天 - 合規安全品牌
        return {
          type: "safe_products",
          title: "完全合規：政府與廠端驗證安全油品",
          items: [
            { name: "義美 100% 純大豆沙拉油 (1.6L)", brand: "義美食品", desc: "100% 自主進口安全大豆，批批合格，完全未涉及污染源" },
            { name: "統一綺麗健康油 (1L)", brand: "統一企業", desc: "獨立合規供應鏈，精煉製程完全合格" },
            { name: "得意的一天 100%葵花油 (2L)", brand: "得意的一天", desc: "採購合規優質原油，自主檢驗多環芳香烴合格" },
            { name: "泰山純芥花油 (1.5L)", brand: "泰山食品", desc: "經稽查與抽檢，該款非涉案產線，原料安全正常銷售" },
            { name: "福壽大豆沙拉油 (3L)", brand: "福壽實業", desc: "工廠自主及衛福部抽檢報告合格，正常销售" }
          ]
        };
      }

      case "s13": { // 各大超市量販店 (家樂福、全聯、大潤發)
        const list = downstreamMerchantsData.filter(m => 
          m.merchantName.includes("全聯") || 
          m.merchantName.includes("家樂福") || 
          m.merchantName.includes("大潤發") || 
          m.merchantName.includes("愛買") || 
          m.merchantName.includes("好市多") || 
          m.merchantName.includes("福利社") || 
          m.merchantName.includes("合作社") || 
          m.merchantName.includes("物流")
        );
        return {
          type: "merchants",
          title: "大型量販與超市：稽查受害門市",
          items: filterMerchants(list)
        };
      }

      case "s14": { // 中小型餐飲業者、夜市攤商
        const list = downstreamMerchantsData.filter(m => 
          !(
            m.merchantName.includes("全聯") || 
            m.merchantName.includes("家樂福") || 
            m.merchantName.includes("大潤發") || 
            m.merchantName.includes("愛買") || 
            m.merchantName.includes("好市多") || 
            m.merchantName.includes("福利社") || 
            m.merchantName.includes("合作社") || 
            m.merchantName.includes("物流")
          )
        );
        return {
          type: "merchants",
          title: "中小型餐飲與传统零售：受害通路",
          items: filterMerchants(list)
        };
      }

      case "s15": { // 一般家庭消費者
        // Consumers match directly to TIER3_FOODS processed foods!
        return {
          type: "foods",
          title: "市售受影響加工食品比對名單",
          items: filterFoods(TIER3_FOODS)
        };
      }

      default:
        return { type: "none", items: [] };
    }
  }, [selectedNodeId, inspectorSearch]);

  // Paginated items for the active list
  const pagedItems = useMemo(() => {
    if (linkedData.type === "merchants" || linkedData.type === "foods") {
      const items = (linkedData as any).items || [];
      const startIndex = (inspectorPage - 1) * ITEMS_PER_PAGE;
      return items.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }
    return [];
  }, [linkedData, inspectorPage]);

  const totalPages = useMemo(() => {
    if (linkedData.type === "merchants" || linkedData.type === "foods") {
      const items = (linkedData as any).items || [];
      return Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE));
    }
    return 1;
  }, [linkedData]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="supply-tracker-root">
      {/* Left 2 Cols: Interactive Map / Node List */}
      <div className="lg:col-span-2 space-y-6" id="supply-left-col">
        {/* Helper Note */}
        <div className="bg-slate-900/40 border border-indigo-950/60 p-5 rounded-2xl flex items-start gap-3 shadow-sm" id="supply-help">
          <Layers className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0 animate-bounce" />
          <div className="text-xs sm:text-sm text-slate-300" id="supply-help-text">
            <h4 className="font-extrabold text-indigo-300 flex items-center gap-1.5">
              互動式食品雙向溯源流向圖
            </h4>
            <p className="mt-1 leading-relaxed">
              點擊下方供應鏈中的任何<strong>節點（Node）</strong>，可在右側詳細面板查看其「上游進口源頭」與「下游銷售通路」。我們已將<strong>縣市商家稽查名冊</strong>與<strong>加工食品管制名單</strong>的真實數據直接串接於下方詳細面版中，供您隨時核對。
            </p>
          </div>
        </div>

        {/* Categories Swimlanes */}
        <div className="flex flex-col gap-6 bg-slate-900/20 p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-sm" id="supply-swimlanes">
          {categories.map((category, catIdx) => {
            const nodesInCat = supplyChainNodes.filter((node) => node.category === category);
            
            // Dynamic theme color based on category
            let badgeBg = "bg-slate-950";
            let rowColor = "border-slate-800";
            if (category === "原料進口") { badgeBg = "bg-blue-600"; rowColor = "border-blue-900/50"; }
            else if (category === "精煉加工") { badgeBg = "bg-violet-600"; rowColor = "border-violet-900/50"; }
            else if (category === "分裝品牌") { badgeBg = "bg-amber-500"; rowColor = "border-amber-900/50"; }
            else if (category === "下游通路") { badgeBg = "bg-emerald-600"; rowColor = "border-emerald-900/50"; }

            return (
              <div key={category} className="space-y-4" id={`cat-row-${catIdx}`}>
                <div className={`flex items-center gap-2 pb-1.5 border-b-2 ${rowColor}`} id={`cat-header-${catIdx}`}>
                  <span className={`${badgeBg} text-white font-mono text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold shadow-sm`}>
                    {catIdx + 1}
                  </span>
                  <h3 className="text-sm font-black text-slate-200 tracking-wide">{category}</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3" id={`cat-nodes-${catIdx}`}>
                  {nodesInCat.map((node) => {
                    const isSelected = node.id === selectedNodeId;
                    const isRelatedToSelection =
                      isSelected ||
                      selectedNode.connections.includes(node.id) ||
                      node.connections.includes(selectedNodeId);

                    // Dynamic colors when selected based on status
                    let nodeStyle = "bg-[#0b0f19] border-slate-800 text-slate-300 hover:border-slate-700";
                    if (isSelected) {
                      if (node.status === "danger") {
                        nodeStyle = "bg-gradient-to-r from-red-600 via-red-500 to-rose-600 text-white border-transparent shadow-lg shadow-red-500/30 scale-[1.03] ring-2 ring-offset-2 ring-red-500 ring-offset-slate-950";
                      } else if (node.status === "warning") {
                        nodeStyle = "bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 text-white border-transparent shadow-lg shadow-amber-500/30 scale-[1.03] ring-2 ring-offset-2 ring-amber-400 ring-offset-slate-950";
                      } else {
                        nodeStyle = "bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 text-white border-transparent shadow-lg shadow-emerald-500/30 scale-[1.03] ring-2 ring-offset-2 ring-emerald-500 ring-offset-slate-950";
                      }
                    } else if (isRelatedToSelection) {
                      nodeStyle = "bg-slate-900 border-indigo-900/60 text-white shadow-xs hover:bg-slate-850";
                    }

                    return (
                      <button
                        key={node.id}
                        id={`supply-node-btn-${node.id}`}
                        onClick={() => handleNodeSelect(node.id)}
                        className={`text-left p-3.5 rounded-xl border-2 transition-all duration-300 cursor-pointer relative overflow-hidden ${nodeStyle}`}
                      >
                        {/* Danger Indicator corner */}
                        <div
                          id={`node-status-line-${node.id}`}
                          className={`absolute top-0 left-0 w-1.5 h-full ${
                            node.status === "danger"
                              ? "bg-red-500"
                              : node.status === "warning"
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                          }`}
                        />

                        <div className="pl-2" id={`node-inner-${node.id}`}>
                          <div className="flex items-center justify-between gap-1">
                            <span
                              id={`node-label-${node.id}`}
                              className={`text-xs sm:text-sm font-extrabold block truncate ${
                                isSelected ? "text-white" : "text-slate-100"
                              }`}
                            >
                              {node.label}
                            </span>
                            <ChevronRight className={`w-4 h-4 flex-shrink-0 ${isSelected ? "text-white/80 animate-ping" : "text-slate-500"}`} />
                          </div>

                          <div className="flex items-center gap-1.5 mt-2" id={`node-badge-row-${node.id}`}>
                            <span
                              id={`node-status-tag-${node.id}`}
                              className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                                isSelected
                                  ? "bg-white/20 text-white"
                                  : node.status === "danger"
                                  ? "bg-red-950/60 text-red-400 border border-red-900/40"
                                  : node.status === "warning"
                                  ? "bg-amber-950/60 text-amber-400 border border-amber-900/40"
                                  : "bg-emerald-950/60 text-emerald-400 border border-emerald-900/40"
                              }`}
                            >
                              {node.status === "danger"
                                ? "高風險 / 涉案"
                                : node.status === "warning"
                                ? "預防性管制"
                                : "完全合規"}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {catIdx < categories.length - 1 && (
                  <div className="flex justify-center py-1" id={`connector-${catIdx}`}>
                    <ArrowRight className="w-5 h-5 text-slate-700 rotate-90" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right 1 Col: Detailed Focus Inspector */}
      <div className="lg:col-span-1" id="supply-right-col">
        <motion.div
          key={selectedNode.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-[#0e1424] border border-slate-800 rounded-2xl shadow-xl overflow-hidden sticky top-36"
          id="node-inspector"
        >
          {/* Header */}
          <div
            id="inspector-header"
            className={`p-5 text-white ${
              selectedNode.status === "danger"
                ? "bg-gradient-to-r from-red-900 to-rose-850"
                : selectedNode.status === "warning"
                ? "bg-gradient-to-r from-amber-700 to-orange-650"
                : "bg-gradient-to-r from-emerald-900 to-teal-850"
            }`}
          >
            <span className="text-[10px] font-black tracking-wider bg-white/20 px-2.5 py-1 rounded-md uppercase border border-white/10">
              {selectedNode.category}
            </span>
            <h3 className="text-base sm:text-lg font-black mt-2 leading-snug" id="inspector-node-label">
              {selectedNode.label}
            </h3>
          </div>

          <div className="p-5 space-y-5" id="inspector-body">
            {/* Core Description */}
            <div className="space-y-1.5" id="inspector-desc-block">
              <span className="text-xs font-bold text-slate-500 block">營運角色與涉案說明</span>
              <p className="text-sm text-slate-300 leading-relaxed font-medium" id="inspector-node-desc">
                {selectedNode.description}
              </p>
            </div>

            {/* Status Alert */}
            <div
              id="inspector-status-banner"
              className={`p-3.5 rounded-lg border flex items-start gap-2.5 ${
                selectedNode.status === "danger"
                  ? "bg-red-950/40 border-red-900/40 text-red-300"
                  : selectedNode.status === "warning"
                  ? "bg-amber-950/40 border-amber-900/40 text-amber-300"
                  : "bg-emerald-950/40 border-emerald-900/40 text-emerald-300"
              }`}
            >
              {selectedNode.status === "danger" ? (
                <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              ) : selectedNode.status === "warning" ? (
                <HelpCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              )}
              <div className="text-xs" id="inspector-status-text">
                <span className="font-bold block">管制狀態評估</span>
                <p className="mt-0.5">
                  {selectedNode.status === "danger"
                    ? "該處已被主管機關勒令停工、產品限期收回、或查封原料，屬於高度受污染風險區域，請勿採購其產品。"
                    : selectedNode.status === "warning"
                    ? "該節點處於預防性措施管制中。部分產品因關聯性暫時下架封存，待進一步詳細抽驗結果。"
                    : "安全，未涉入任何本次污染源粗油供應鏈，經抽驗證實產品安全合規，可放心採購。"}
                </p>
              </div>
            </div>

            {/* Upstream Sources */}
            <div className="border-t border-slate-800 pt-4 space-y-2" id="inspector-upstream-block">
              <span className="text-xs font-bold text-slate-500 block">上游進貨源頭</span>
              {upstream.length > 0 ? (
                <div className="space-y-2" id="inspector-upstream-list">
                  {upstream.map((up) => (
                    <div
                      key={up.id}
                      onClick={() => handleNodeSelect(up.id)}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-900 border border-slate-850 transition-colors cursor-pointer"
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          up.status === "danger" ? "bg-red-500" : up.status === "warning" ? "bg-amber-500" : "bg-emerald-500"
                        }`}
                      />
                      <span className="text-xs font-semibold text-slate-300 truncate flex-1">{up.label}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-slate-500 block italic">（此節點為最源頭進口商）</span>
              )}
            </div>

            {/* Downstream Targets */}
            <div className="border-t border-slate-800 pt-4 space-y-2" id="inspector-downstream-block">
              <span className="text-xs font-bold text-slate-500 block">下游流向節點</span>
              {downstream.length > 0 ? (
                <div className="space-y-2" id="inspector-downstream-list">
                  {downstream.map((down) => (
                    <div
                      key={down.id}
                      onClick={() => handleNodeSelect(down.id)}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-900 border border-slate-850 transition-colors cursor-pointer"
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          down.status === "danger" ? "bg-red-500" : down.status === "warning" ? "bg-amber-500" : "bg-emerald-500"
                        }`}
                      />
                      <span className="text-xs font-semibold text-slate-300 truncate flex-1">{down.label}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-slate-500 block italic">（此節點無進一步下游流向）</span>
              )}
            </div>

            {/* Dynamic Real Data Linkage Section (縣市名冊與加工食品串聯) */}
            {linkedData.type !== "none" && (
              <div className="border-t border-slate-800 pt-4 space-y-3" id="inspector-interactive-section">
                <div className="flex items-center justify-between" id="interactive-title-row">
                  <span className="text-xs font-bold text-indigo-300 flex items-center gap-1">
                    {linkedData.type === "merchants" && <Building2 className="w-3.5 h-3.5 text-indigo-400" />}
                    {linkedData.type === "foods" && <Utensils className="w-3.5 h-3.5 text-indigo-400" />}
                    {linkedData.type === "stats" && <Layers className="w-3.5 h-3.5 text-indigo-400" />}
                    {linkedData.type === "safe_products" && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    {linkedData.title}
                  </span>
                  
                  {(linkedData.type === "merchants" || linkedData.type === "foods") && (
                    <span className="text-[10px] font-bold text-slate-400 px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded">
                      共 {(linkedData as any).items.length} 筆
                    </span>
                  )}
                </div>

                {/* SEARCH INPUT */}
                {(linkedData.type === "merchants" || linkedData.type === "foods") && (
                  <div className="relative" id="interactive-search-wrapper">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={inspectorSearch}
                      onChange={(e) => setInspectorSearch(e.target.value)}
                      placeholder={linkedData.type === "merchants" ? "搜尋縣市、店名、或油品..." : "搜尋食品名稱、大廠..."}
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-950 hover:bg-slate-900 focus:bg-slate-950 border border-slate-800 text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg outline-hidden transition-all placeholder:text-slate-500"
                    />
                  </div>
                )}

                {/* STATS RENDER (s1) */}
                {linkedData.type === "stats" && (
                  <div className="grid grid-cols-2 gap-2 text-xs" id="interactive-stats-grid">
                    <div className="p-2.5 bg-red-950/40 border border-red-900/40 rounded-xl space-y-0.5">
                      <span className="text-[10px] font-bold text-red-400 block">下游受害商家</span>
                      <strong className="text-base text-red-200 block">{(linkedData as any).stats.total} 家</strong>
                      <span className="text-[9px] text-slate-400 block">全台 22 縣市聯合稽查</span>
                    </div>
                    <div className="p-2.5 bg-amber-950/40 border border-amber-900/40 rounded-xl space-y-0.5">
                      <span className="text-[10px] font-bold text-amber-400 block">市售加工食品</span>
                      <strong className="text-base text-amber-200 block">{(linkedData as any).stats.foods.toLocaleString()} 件</strong>
                      <span className="text-[9px] text-slate-400 block">預防性停用或下架管制</span>
                    </div>
                    <div className="p-2 bg-slate-950 rounded-lg col-span-2 space-y-1 border border-slate-850">
                      <span className="text-[9px] font-bold text-slate-500 block">受波及品牌原油分配流向</span>
                      <div className="flex items-center gap-3 text-[10px] font-semibold text-slate-300">
                        <span>福懋: <strong className="text-red-400">{(linkedData as any).stats.fortune} 處</strong></span>
                        <span>福壽: <strong className="text-red-400">{(linkedData as any).stats.fuso} 處</strong></span>
                        <span>泰山: <strong className="text-red-400">{(linkedData as any).stats.taisun} 處</strong></span>
                      </div>
                    </div>
                  </div>
                )}

                {/* SAFE PRODUCTS RENDER (s11) */}
                {linkedData.type === "safe_products" && (
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1" id="interactive-safe-list">
                    {(linkedData as any).items.map((prod: any, idx: number) => (
                      <div key={idx} className="p-2 bg-emerald-950/40 border border-emerald-900/40 rounded-lg flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <div className="text-[11px]">
                          <strong className="text-emerald-300 font-bold block">{prod.name}</strong>
                          <span className="text-[9px] text-emerald-400 block mt-0.5">品牌：{prod.brand}</span>
                          <p className="text-[9px] text-slate-400 mt-1 leading-relaxed">{prod.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* MERCHANTS LIST RENDER */}
                {linkedData.type === "merchants" && (
                  <div className="space-y-1.5" id="interactive-merchants-wrapper">
                    {pagedItems.length > 0 ? (
                      <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1" id="interactive-merchants-scroll">
                        {pagedItems.map((item: any) => (
                          <div 
                            key={item.id} 
                            className="p-2 bg-slate-950 hover:bg-slate-900 border border-slate-850 rounded-lg flex items-start justify-between gap-2 transition-colors"
                          >
                            <div className="text-[11px] min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="bg-slate-800 text-slate-300 px-1 py-0.5 rounded text-[8px] font-black">
                                  {item.county}
                                </span>
                                <strong className="text-white font-extrabold truncate block">
                                  {item.merchantName}
                                </strong>
                              </div>
                              <p className="text-[9px] text-slate-400 truncate mt-1">
                                購油：{item.productName} 
                                <span className="text-red-400 font-bold ml-1">({item.oilBrand})</span>
                              </p>
                            </div>
                            <span className="text-[9px] text-red-400 font-bold bg-red-950/60 border border-red-900/50 px-1.5 py-0.5 rounded flex-shrink-0">
                              下架封存
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-xs text-slate-500 italic">
                        無相符的商家稽查紀錄
                      </div>
                    )}
                  </div>
                )}

                {/* FOODS LIST RENDER */}
                {linkedData.type === "foods" && (
                  <div className="space-y-1.5" id="interactive-foods-wrapper">
                    {pagedItems.length > 0 ? (
                      <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1" id="interactive-foods-scroll">
                        {pagedItems.map((item: any) => (
                          <div 
                            key={item.id} 
                            className="p-2 bg-slate-950 hover:bg-slate-900 border border-slate-855 rounded-lg flex flex-col gap-1 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-1">
                              <div className="text-[11px] min-w-0 flex-1">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="bg-amber-950/60 text-amber-400 px-1 py-0.5 rounded text-[8px] font-bold border border-amber-900/40">
                                    {item.category}
                                  </span>
                                  <strong className="text-white font-extrabold truncate block">
                                    {item.name}
                                  </strong>
                                </div>
                                <span className="text-[9px] text-slate-400 block mt-1">
                                  代工大廠：{item.manufacturer}
                                </span>
                              </div>
                              <span className="text-[8px] text-amber-400 font-bold bg-amber-950/60 border border-amber-900/50 px-1.5 py-0.5 rounded flex-shrink-0">
                                {item.status}
                              </span>
                            </div>
                            <p className="text-[9px] bg-slate-900 border border-slate-850 p-1 rounded-sm text-slate-300 leading-relaxed">
                              <span className="font-extrabold text-red-400">影響：</span>{item.hazard}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-xs text-slate-500 italic">
                        無相符的加工食品紀錄
                      </div>
                    )}
                  </div>
                )}

                {/* PAGINATION CONTROLS */}
                {(linkedData.type === "merchants" || linkedData.type === "foods") && (linkedData as any).items.length > ITEMS_PER_PAGE && (
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800" id="interactive-pagination">
                    <span className="text-[10px] text-slate-500 font-medium">
                      第 {inspectorPage} / {totalPages} 頁
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setInspectorPage(p => Math.max(1, p - 1))}
                        disabled={inspectorPage === 1}
                        className="p-1 rounded-md border border-slate-800 hover:bg-slate-800 text-slate-300 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer transition-colors"
                      >
                        <ChevronLeft className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => setInspectorPage(p => Math.min(totalPages, p + 1))}
                        disabled={inspectorPage === totalPages}
                        className="p-1 rounded-md border border-slate-800 hover:bg-slate-800 text-slate-300 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer transition-colors"
                      >
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

