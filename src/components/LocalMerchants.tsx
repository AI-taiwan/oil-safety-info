import { useState, useMemo } from "react";
import { downstreamMerchantsData } from "../merchantsData";
import { DownstreamMerchant } from "../types";
import { 
  Search, MapPin, Building2, Layers, Download, CheckCircle2, ShieldAlert, 
  ChevronLeft, ChevronRight, ArrowRight, CornerDownRight, RefreshCw, Info, Utensils, Tag, HeartPulse, Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// TIER 1: Source & First-Tier Downstream Problem Oils (Directly matching Taichung Health Bureau official list)
const TIER1_OILS = [
  // 台糖 branded (OEM by affected mills like Fortune)
  { id: "oil_ts01", name: "台糖大豆沙拉油 0.6公升", brand: "台糖", status: "下架回收", category: "大豆沙拉油", capacity: "0.6公升", batchNumber: "未通報批號", testResult: "委託福懋(Fortune)代工生產，因其產線與中聯原料油受污染而遭波及", isOem: true, oemBrand: "福懋" },
  { id: "oil_ts02", name: "台糖大豆沙拉油 1公升", brand: "台糖", status: "下架回收", category: "大豆沙拉油", capacity: "1公升", batchNumber: "未通報批號", testResult: "委託福懋(Fortune)代工生產，因其產線與中聯原料油受污染而遭波及", isOem: true, oemBrand: "福懋" },
  { id: "oil_ts03", name: "台糖大豆沙拉油 2公升", brand: "台糖", status: "下架回收", category: "大豆沙拉油", capacity: "2公升", batchNumber: "未通報批號", testResult: "委託福懋(Fortune)代工生產，因其產線與中聯原料油受污染而遭波及", isOem: true, oemBrand: "福懋" },
  { id: "oil_ts04", name: "台糖大豆沙拉油 2.6公升", brand: "台糖", status: "下架回收", category: "大豆沙拉油", capacity: "2.6公升", batchNumber: "未通報批號", testResult: "委託福懋(Fortune)代工生產，因其產線與中聯原料油受污染而遭波及", isOem: true, oemBrand: "福懋" },
  { id: "oil_ts05", name: "台糖大豆沙拉油 3公升", brand: "台糖", status: "下架回收", category: "大豆沙拉油", capacity: "3公升", batchNumber: "未通報批號", testResult: "委託福懋(Fortune)代工生產，因其產線與中聯原料油受污染而遭波及", isOem: true, oemBrand: "福懋" },
  { id: "oil_ts06", name: "台糖大豆沙拉油 18公升", brand: "台糖", status: "下架回收", category: "大豆沙拉油", capacity: "18公升", batchNumber: "未通報批號", testResult: "委託福懋(Fortune)代工生產，因其產線與中聯原料油受污染而遭波及", isOem: true, oemBrand: "福懋" },
  { id: "oil_ts07", name: "台糖大豆沙拉油 18公斤", brand: "台糖", status: "下架回收", category: "大豆沙拉油", capacity: "18公斤", batchNumber: "未通報批號", testResult: "委託福懋(Fortune)代工生產，因其產線與中聯原料油受污染而遭波及", isOem: true, oemBrand: "福懋" },
  { id: "oil_ts08", name: "台糖烤酥油 2公升", brand: "台糖", status: "下架回收", category: "烤酥油", capacity: "2公升", batchNumber: "未通報批號", testResult: "委託福懋(Fortune)代工生產，因其產線與中聯原料油受污染而遭波及", isOem: true, oemBrand: "福懋" },
  { id: "oil_ts09", name: "台糖烤酥油 18公升", brand: "台糖", status: "下架回收", category: "烤酥油", capacity: "18公升", batchNumber: "未通報批號", testResult: "委託福懋(Fortune)代工生產，因其產線與中聯原料油受污染而遭波及", isOem: true, oemBrand: "福懋" },

  // 中聯 (Union) Source Import Oil
  { id: "oil_zl10", name: "中聯大豆沙拉油 (大宗進口原油)", brand: "中聯", status: "強制回收", category: "進口大豆油原油", capacity: "Bulk 槽車 / 大宗油桶", batchNumber: "315-1150404", testResult: "源頭大宗大豆油，檢出致癌物「苯駢芘」超標 (本起事件最核心之污染來源)" },

  // 泰山 (Taisun) branded
  { id: "oil_ts11", name: "泰山金酥耐炸油 18L", brand: "泰山", status: "下架回收", category: "耐炸專用油", capacity: "18L 鐵桶", batchNumber: "2027040801", testResult: "使用中聯苯駢芘超標之大豆沙拉油調配精煉而成" },
  { id: "oil_ts12", name: "泰山沙拉油-18L", brand: "泰山", status: "下架回收", category: "大豆沙拉油", capacity: "18L 鐵桶", batchNumber: "2027040901", testResult: "使用中聯苯駢芘超標之大豆沙拉油分裝包裝" },
  { id: "oil_ts13", name: "泰山不飽和黃豆沙拉油 2.6L*6入 (新版)", brand: "泰山", status: "下架回收", category: "大豆沙拉油", capacity: "2.6L 塑桶 (6入裝)", batchNumber: "2027040901", testResult: "使用中聯苯駢芘超標之大豆沙拉油精煉分裝" },
  { id: "oil_ts14", name: "泰山環保鐵桶沙拉油-18Kg", brand: "泰山", status: "下架回收", category: "大豆沙拉油", capacity: "18Kg 鐵桶", batchNumber: "2027040901", testResult: "使用中聯苯駢芘超標之大豆沙拉油包裝" },
  { id: "oil_ts15", name: "泰山精選蔬菜油-3L*6", brand: "泰山", status: "下架回收", category: "蔬菜油", capacity: "3L 塑桶 (6入裝)", batchNumber: "2027072506", testResult: "使用中聯苯駢芘超標之大豆沙拉油調合精製" },
  { id: "oil_ts16", name: "泰山好理調合油-2L*6", brand: "泰山", status: "下架回收", category: "調合油", capacity: "2L 塑桶 (6入裝)", batchNumber: "2027072506", testResult: "生產線及原料油混入中聯超標原料" },
  { id: "oil_ts17", name: "泰山花生風味調和油 2L*6入", brand: "泰山", status: "下架回收", category: "調合油", capacity: "2L 塑桶 (6入裝)", batchNumber: "2027100901", testResult: "調配基底沙拉油混入中聯超標原料" },
  { id: "oil_ts18", name: "泰山大豆沙拉油 0.6L*12入 (新版)", brand: "泰山", status: "下架回收", category: "大豆沙拉油", capacity: "0.6L 塑桶 (12入裝)", batchNumber: "2027041301", testResult: "使用中聯苯駢芘超標之大豆沙拉油分裝" },
  { id: "oil_ts19", name: "泰山歐式果實精華調合油 1.5L*6入", brand: "泰山", status: "下架回收", category: "調合油", capacity: "1.5L 塑桶 (6入裝)", batchNumber: "2027101301", testResult: "生產配方使用到中聯超標原料油" },
  { id: "oil_ts20", name: "泰山好理調合油 0.6L*24", brand: "泰山", status: "下架回收", category: "調合油", capacity: "0.6L 塑桶 (24入裝)", batchNumber: "2027072504", testResult: "原料油脂涉及中聯苯駢芘超標批次" },

  // 福懋 (Fortune / Fortune Oils) branded
  { id: "oil_fm21", name: "福懋一級黃豆油", brand: "福懋", status: "下架回收", category: "黃豆沙拉油", capacity: "Bulk 槽車 / 18L", batchNumber: "未通報批號", testResult: "向中聯進貨大豆原油進行調配精煉，苯駢芘共受波及" },
  { id: "oil_fm22", name: "益康大豆沙拉油 18L", brand: "福懋", status: "下架回收", category: "大豆沙拉油", capacity: "18L 鐵桶", batchNumber: "20270411000408", testResult: "向中聯進貨大豆油原油精煉，驗出致癌物苯駢芘 2.8 μg/kg (標準為 2.0)" },
  { id: "oil_fm23", name: "益康大豆沙拉油 18KG", brand: "福懋", status: "下架回收", category: "大豆沙拉油", capacity: "18KG 鐵桶", batchNumber: "20270413000408", testResult: "向中聯進貨大豆油原油精煉，驗出致癌物苯駢芘 2.7 μg/kg" },
  { id: "oil_fm24", name: "益康烹調油 18L", brand: "福懋", status: "下架回收", category: "調合油", capacity: "18L 鐵桶", batchNumber: "20270413000403", testResult: "精煉調製配方，檢出致癌物苯駢芘 3.2 μg/kg (超標嚴重)" },

  // 福壽 (Fuso) branded
  { id: "oil_fs25", name: "福壽大豆沙拉油 3 公升裝", brand: "福壽", status: "下架回收", category: "大豆沙拉油", capacity: "3L 塑桶", batchNumber: "C1160426K", testResult: "原料油向中聯購買精煉，苯駢芘檢出超標" },
  { id: "oil_fs26", name: "福壽大豆沙拉油 18 公升裝", brand: "福壽", status: "下架回收", category: "大豆沙拉油", capacity: "18L 鐵桶", batchNumber: "C2150426O、C2150426P、C2160426O、C2160426P", testResult: "向中聯進貨大豆油精煉，檢出致癌物苯駢芘 2.5 μg/kg" },
  { id: "oil_fs27", name: "福壽健味香油 3 公升裝", brand: "福壽", status: "下架回收", category: "香油", capacity: "3L 塑桶", batchNumber: "BL150426L", testResult: "調配油品基底大豆油混入中聯問題超標原料" },
  { id: "oil_fs28", name: "福壽花生風味精華調合油 2L", brand: "福壽", status: "下架回收", category: "調合油", capacity: "2L", batchNumber: "BL130426F", testResult: "使用中聯第4批超標原料，檢出苯駢芘 4.3 ppb" },
  { id: "oil_fs29", name: "福壽不飽和大豆沙拉油 2L", brand: "福壽", status: "下架回收", category: "大豆沙拉油", capacity: "2L", batchNumber: "C1160426A", testResult: "使用中聯第5批超標原料，檢出苯駢芘 3.8 ppb" }
];

import { TIER3_FOODS } from "../tier3Data";

// Heuristics mapping to resolve Tier 3 products for any of the 360+ merchants
function getFoodsForMerchant(merchantName: string, productName: string, merchantId?: string): { name: string; action: string }[] {
  let index: number | null = null;
  if (merchantId) {
    index = parseInt(merchantId.replace("m", ""), 10);
  } else {
    const found = downstreamMerchantsData.find(m => m.merchantName === merchantName);
    if (found) {
      index = parseInt(found.id.replace("m", ""), 10);
    }
  }

  const exact = TIER3_FOODS.filter(f => (index !== null && f.merchantIndex === index) || f.manufacturer === merchantName);
  if (exact.length > 0) {
    return exact.map(f => ({ name: f.name, action: f.status }));
  }
  
  if (merchantName.includes("麵包") || merchantName.includes("烘焙") || merchantName.includes("西點") || merchantName.includes("糕餅") || merchantName.includes("烘培")) {
    return [
      { name: "香蒜麵包、菠蘿麵包及吐司酥皮製品", action: "自主下架銷毀" },
      { name: "烘焙模具油脂與刷蛋液調合油", action: "更換原料油" }
    ];
  }
  if (merchantName.includes("便當") || merchantName.includes("快餐") || merchantName.includes("食堂") || merchantName.includes("小吃") || merchantName.includes("餐飲")) {
    return [
      { name: "油炸雞排、紅燒排骨、炒飯及時令炒蔬菜", action: "停用並配合退貨" },
      { name: "特調辣油與滷肉爆香淋醬", action: "全面更換銷毀" }
    ];
  }
  if (merchantName.includes("酒店") || merchantName.includes("飯店") || merchantName.includes("會館") || merchantName.includes("餐廳")) {
    return [
      { name: "自助餐熱食區油炸餐點與調醬", action: "全面預防下架" },
      { name: "中餐廳爆香用底油與炒麵調油", action: "換合格油上架" }
    ];
  }
  if (merchantName.includes("食品") || merchantName.includes("工業") || merchantName.includes("股份")) {
    return [
      { name: `${merchantName.replace(/股份有限公司|有限公司/g, "")}特調油脂醬包`, action: "預防性停售" },
      { name: "調理食品代工炸製批次", action: "批發停售回收" }
    ];
  }
  if (merchantName.includes("行") || merchantName.includes("商行") || merchantName.includes("米店") || merchantName.includes("雜糧")) {
    return [
      { name: `分裝零售之散裝 ${productName}`, action: "回收下架封存" }
    ];
  }
  
  return [
    { name: `使用 ${productName} 調製之熟食餐飲小吃`, action: "配合更換合格油" }
  ];
}

interface LocalMerchantsProps {
  onTraceInSupply?: (nodeId: string) => void;
}

export default function LocalMerchants({ onTraceInSupply }: LocalMerchantsProps = {}) {
  const [activeTier, setActiveTier] = useState<"tier1" | "tier2" | "tier3">("tier2");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCounty, setSelectedCounty] = useState<string>("全部");
  const [selectedBrand, setSelectedBrand] = useState<string>("全部");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Selected item for live 3-Tier Lineage Trace
  const [selectedTrace, setSelectedTrace] = useState<{
    type: "oil" | "merchant" | "food";
    id: string;
    name: string;
    brand?: string;
    county?: string;
    details?: any;
  } | null>(null);

  const getSupplyChainNodeId = (item: any, type: "oil" | "merchant" | "food"): string => {
    if (type === "oil") {
      const brand = item.brand;
      if (brand === "中聯") return "s1";
      if (brand === "福懋") return "s3";
      if (brand === "福壽") return "s3";
      if (brand === "泰山") return "s3";
      if (brand === "台糖") return "s7";
      return "s3";
    } else if (type === "merchant") {
      const name = item.merchantName || "";
      const brand = item.oilBrand;
      if (name.includes("全聯") || name.includes("家樂福") || name.includes("大潤發") || name.includes("物流") || name.includes("大愛買") || name.includes("愛買") || name.includes("好市多")) {
        return "s13";
      }
      if (name.includes("康健")) return "s7";
      if (name.includes("廚神")) return "s8";
      if (brand === "福懋") return "s3";
      if (brand === "福壽") return "s3";
      if (brand === "泰山") return "s3";
      return "s14";
    } else {
      const mfr = item.manufacturer || "";
      if (mfr.includes("康健")) return "s7";
      if (mfr.includes("廚神")) return "s8";
      if (mfr.includes("御品膳")) return "s10";
      if (mfr.includes("美味廚房") || mfr.includes("安心家")) return "s9";
      if (mfr.includes("義美") || mfr.includes("統一") || mfr.includes("佳格") || (mfr.includes("泰山") && !mfr.includes("恆新"))) {
        return "s11";
      }
      return "s15";
    }
  };

  // Dynamically extract and sort unique counties with counts based on active tier (Tier 2 vs Tier 3)
  const dynamicCounties = useMemo(() => {
    const list = Array.from(new Set(downstreamMerchantsData.map((m) => m.county)));
    
    // Merchant counts (Tier 2)
    const merchantCounts: Record<string, number> = { "全部": downstreamMerchantsData.length };
    downstreamMerchantsData.forEach((m) => {
      merchantCounts[m.county] = (merchantCounts[m.county] || 0) + 1;
    });

    // Food counts (Tier 3)
    const foodCounts: Record<string, number> = { "全部": TIER3_FOODS.length };
    TIER3_FOODS.forEach((food) => {
      const merchant = food.merchantIndex 
        ? downstreamMerchantsData.find(m => m.id === `m${food.merchantIndex}`) 
        : null;
      const county = merchant ? merchant.county : "未通報";
      foodCounts[county] = (foodCounts[county] || 0) + 1;
    });

    // Sort list based on the active tier counts descending
    const sortedList = [...list].sort((a, b) => {
      const countA = activeTier === "tier3" ? (foodCounts[a] || 0) : (merchantCounts[a] || 0);
      const countB = activeTier === "tier3" ? (foodCounts[b] || 0) : (merchantCounts[b] || 0);
      return countB - countA;
    });

    return {
      list: ["全部", ...sortedList],
      counts: activeTier === "tier3" ? foodCounts : merchantCounts
    };
  }, [activeTier]);

  const counties = dynamicCounties.list;

  const brands = ["全部", "福懋", "福壽", "泰山", "台糖", "中聯", "其他"];

  // Filter downstream merchants (Tier 2) based on general inputs AND active traces
  const filteredMerchants = useMemo(() => {
    return downstreamMerchantsData.filter((merchant) => {
      // 1. Check active trace filters
      if (selectedTrace) {
        if (selectedTrace.type === "oil") {
          // Tracing an oil: merchant must have bought this specific product or brand
          const matchBrand = merchant.oilBrand === selectedTrace.brand;
          const matchProductName = merchant.productName.toLowerCase().includes(selectedTrace.name.toLowerCase()) || 
                                   selectedTrace.name.toLowerCase().includes(merchant.productName.toLowerCase());
          if (!matchBrand && !matchProductName) return false;
        } else if (selectedTrace.type === "merchant") {
          // Tracing this merchant only
          if (merchant.id !== selectedTrace.id) return false;
        } else if (selectedTrace.type === "food") {
          // Tracing a food: merchant must be the manufacturer
          if (merchant.merchantName !== selectedTrace.details?.manufacturer) return false;
        }
      }

      // 2. Check general filters
      const matchesSearch =
        merchant.merchantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        merchant.productName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCounty = selectedCounty === "全部" || merchant.county === selectedCounty;
      const matchesBrand = selectedBrand === "全部" || merchant.oilBrand === selectedBrand;

      return matchesSearch && matchesCounty && matchesBrand;
    });
  }, [searchTerm, selectedCounty, selectedBrand, selectedTrace]);

  // Filter Tier 1 Problem Oils based on active trace or search
  const filteredOils = useMemo(() => {
    return TIER1_OILS.filter((oil) => {
      if (selectedTrace) {
        if (selectedTrace.type === "oil") {
          return oil.id === selectedTrace.id;
        } else if (selectedTrace.type === "merchant") {
          // Show the oil purchased by this merchant
          return oil.brand === selectedTrace.details?.oilBrand || selectedTrace.details?.productName.includes(oil.name);
        } else if (selectedTrace.type === "food") {
          // Show the source oil used in this food
          return oil.name === selectedTrace.details?.sourceOil || oil.brand === selectedTrace.details?.oilBrand;
        }
      }

      const matchesSearch = 
        oil.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        oil.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        oil.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesBrand = selectedBrand === "全部" || oil.brand === selectedBrand;

      return matchesSearch && matchesBrand;
    });
  }, [searchTerm, selectedBrand, selectedTrace]);

  // Filter Tier 3 Foods based on active trace or search
  const filteredFoods = useMemo(() => {
    const resolvedFoods = TIER3_FOODS.map((food) => {
      const merchant = food.merchantIndex 
        ? downstreamMerchantsData.find(m => m.id === `m${food.merchantIndex}`) 
        : null;
      return {
        ...food,
        sourceOil: merchant ? merchant.productName : "未通報來源油",
        oilBrand: merchant ? merchant.oilBrand : "其他",
        county: merchant ? merchant.county : "未通報"
      };
    });

    return resolvedFoods.filter((food) => {
      if (selectedTrace) {
        if (selectedTrace.type === "food") {
          return food.id === selectedTrace.id;
        } else if (selectedTrace.type === "merchant") {
          // Show foods made by this merchant
          const merchantIdx = parseInt(selectedTrace.id.replace("m", ""), 10);
          return food.merchantIndex === merchantIdx || food.manufacturer === selectedTrace.name;
        } else if (selectedTrace.type === "oil") {
          // Show foods containing this oil or brand
          const matchesSearchTrace = food.sourceOil.toLowerCase().includes(selectedTrace.name.toLowerCase()) || 
                 selectedTrace.name.toLowerCase().includes(food.sourceOil.toLowerCase()) ||
                 food.oilBrand === selectedTrace.brand;
          const matchesCountyTrace = selectedCounty === "全部" || food.county === selectedCounty;
          return matchesSearchTrace && matchesCountyTrace;
        }
      }

      const matchesSearch = 
        food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        food.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        food.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCounty = selectedCounty === "全部" || food.county === selectedCounty;

      return matchesSearch && matchesCounty;
    });
  }, [searchTerm, selectedCounty, selectedTrace]);

  // Reset page when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCounty, selectedBrand, selectedTrace, activeTier]);

  // Count stats
  const totalCount = downstreamMerchantsData.length;
  const fumaoCount = downstreamMerchantsData.filter((m) => m.oilBrand === "福懋").length;
  const fushouCount = downstreamMerchantsData.filter((m) => m.oilBrand === "福壽").length;
  const taishanCount = downstreamMerchantsData.filter((m) => m.oilBrand === "泰山").length;

  // Pagination calculations for Tier 2 Downstream Table
  const totalPages = Math.ceil(filteredMerchants.length / itemsPerPage);
  const paginatedMerchants = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredMerchants.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredMerchants, currentPage]);

  // Handle tracing actions
  const startTrace = (type: "oil" | "merchant" | "food", item: any) => {
    if (type === "oil") {
      setSelectedTrace({
        type: "oil",
        id: item.id,
        name: item.name,
        brand: item.brand,
        details: item
      });
    } else if (type === "merchant") {
      setSelectedTrace({
        type: "merchant",
        id: item.id,
        name: item.merchantName,
        county: item.county,
        details: item
      });
    } else if (type === "food") {
      setSelectedTrace({
        type: "food",
        id: item.id,
        name: item.name,
        details: item
      });
    }
  };

  const clearTrace = () => {
    setSelectedTrace(null);
  };

  return (
    <div className="space-y-6" id="local-merchants-root">
      
      {/* Top Title Section */}
      <div className="bg-slate-900 text-white rounded-xl p-6 relative overflow-hidden border border-slate-800 shadow-md" id="merchants-main-banner">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Layers className="w-40 h-40" />
        </div>
        <div className="relative z-10 space-y-2">
          <span className="inline-flex items-center gap-1 bg-red-600/20 text-red-400 text-xs px-2.5 py-1 rounded-full font-bold border border-red-500/20">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            全新升級：沙拉油食安三層流向一鍵搜
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            致癌沙拉油 「第一、二、三層」流向溯源網
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
            依據食品安全衛生管理法與地方衛生局稽查公告，為您剖析從<strong>【第一層：{TIER1_OILS.length}項首波公告問題油品】</strong>，流向<strong>【第二層：{downstreamMerchantsData.length}家受波及下游盤商/工廠】</strong>，再至<strong>【第三層：{TIER3_FOODS.length}項受影響熟食/終端食品】</strong>。點擊任意項目即可一鍵啟動流向交叉聯動分析！
          </p>
        </div>
      </div>

      {/* THREE-TIER SELECTION TABS BAR (Inspired by Yahoo News design) */}
      <div className="grid grid-cols-3 gap-3 p-2 bg-slate-900 rounded-2xl border border-slate-800 shadow-inner" id="three-tier-tabs-container">
        <button
          onClick={() => { setActiveTier("tier1"); clearTrace(); }}
          className={`py-4 px-2 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all duration-300 relative cursor-pointer ${
            activeTier === "tier1" 
              ? "bg-gradient-to-r from-red-600 via-red-500 to-rose-600 text-white shadow-xl shadow-red-500/20 font-extrabold scale-[1.02] border-transparent" 
              : "text-slate-400 bg-slate-950/50 hover:text-slate-200 hover:bg-slate-800 border border-slate-800/80"
          }`}
          id="tab-tier-1"
        >
          <span className={`text-[9px] uppercase font-bold tracking-wider ${activeTier === "tier1" ? "text-red-200" : "text-slate-500"}`}>第一層</span>
          <span className="text-xs sm:text-sm flex items-center gap-1.5 font-extrabold">
            <Building2 className={`w-4 h-4 ${activeTier === "tier1" ? "text-white animate-bounce" : "text-red-500"}`} />
            {TIER1_OILS.length}項首波受影響油品
          </span>
          {activeTier === "tier1" && (
            <span className="absolute bottom-1 w-8 h-1 bg-white/60 rounded-full" />
          )}
        </button>

        <button
          onClick={() => { setActiveTier("tier2"); clearTrace(); }}
          className={`py-4 px-2 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all duration-300 relative cursor-pointer ${
            activeTier === "tier2" 
              ? "bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 text-white shadow-xl shadow-amber-500/20 font-extrabold scale-[1.02] border-transparent" 
              : "text-slate-400 bg-slate-950/50 hover:text-slate-200 hover:bg-slate-800 border border-slate-800/80"
          }`}
          id="tab-tier-2"
        >
          <span className={`text-[9px] uppercase font-bold tracking-wider ${activeTier === "tier2" ? "text-amber-100" : "text-slate-500"}`}>第二層</span>
          <span className="text-xs sm:text-sm flex items-center gap-1.5 font-extrabold">
            <MapPin className={`w-4 h-4 ${activeTier === "tier2" ? "text-white animate-bounce" : "text-amber-500"}`} />
            {downstreamMerchantsData.length}家受波及業者
          </span>
          {activeTier === "tier2" && (
            <span className="absolute bottom-1 w-8 h-1 bg-white/60 rounded-full" />
          )}
        </button>

        <button
          onClick={() => { setActiveTier("tier3"); clearTrace(); }}
          className={`py-4 px-2 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all duration-300 relative cursor-pointer ${
            activeTier === "tier3" 
              ? "bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 text-white shadow-xl shadow-emerald-500/20 font-extrabold scale-[1.02] border-transparent" 
              : "text-slate-400 bg-slate-950/50 hover:text-slate-200 hover:bg-slate-800 border border-slate-800/80"
          }`}
          id="tab-tier-3"
        >
          <span className={`text-[9px] uppercase font-bold tracking-wider ${activeTier === "tier3" ? "text-emerald-100" : "text-slate-500"}`}>第三層</span>
          <span className="text-xs sm:text-sm flex items-center gap-1.5 font-extrabold">
            <Utensils className={`w-4 h-4 ${activeTier === "tier3" ? "text-white animate-bounce" : "text-emerald-500"}`} />
            {TIER3_FOODS.length}項受影響食品
          </span>
          {activeTier === "tier3" && (
            <span className="absolute bottom-1 w-8 h-1 bg-white/60 rounded-full" />
          )}
        </button>
      </div>

      {/* LIVE INTERACTIVE TRACING FLOW OVERLAY (Only visible when trace is active) */}
      <AnimatePresence>
        {selectedTrace && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-amber-950/20 border border-amber-900/50 rounded-xl p-5 space-y-4 shadow-lg shadow-amber-900/10 backdrop-blur-sm"
            id="lineage-flow-overlay"
          >
            <div className="flex items-center justify-between" id="overlay-title-bar">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                </span>
                <h3 className="text-sm font-bold text-amber-400 drop-shadow-sm">
                  一鍵流向溯源追蹤中：已選定「{selectedTrace.name}」
                </h3>
              </div>
              <button
                onClick={clearTrace}
                className="inline-flex items-center gap-1 text-xs text-amber-200 bg-amber-950/60 hover:bg-amber-900 border border-amber-800/60 rounded-lg px-2.5 py-1.5 transition-colors cursor-pointer font-bold shadow-xs"
                id="clear-trace-btn"
              >
                <RefreshCw className="w-3 h-3" />
                <span>清除一鍵聯動 / 重設搜尋</span>
              </button>
            </div>

            {/* Visual flow pipeline */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center" id="flow-pipeline-grid">
              {/* Box 1: Tier 1 */}
              <div className={`p-4 rounded-xl border flex flex-col justify-between h-28 transition-all ${
                selectedTrace.type === "oil" 
                  ? "bg-red-950/50 text-white border-red-500 shadow-md shadow-red-900/20" 
                  : "bg-slate-900/50 text-slate-300 border-slate-700/50"
              }`} id="flow-tier1-box">
                <div>
                  <span className={`text-[10px] font-extrabold ${selectedTrace.type === "oil" ? "text-red-300" : "text-slate-500"} uppercase tracking-wider`}>
                    第一層：問題源頭油品
                  </span>
                  <div className={`font-bold text-sm line-clamp-2 mt-1.5 ${selectedTrace.type === "oil" ? "text-red-100" : "text-slate-300"}`}>
                    {selectedTrace.type === "oil" 
                      ? selectedTrace.name 
                      : selectedTrace.type === "merchant" 
                        ? (selectedTrace.details?.productName || "多項調配油脂") 
                        : (selectedTrace.details?.sourceOil || "未標示來源油")}
                  </div>
                </div>
                <div className={`text-[10px] font-bold ${selectedTrace.type === "oil" ? "text-red-400" : "text-slate-500"}`}>
                  品牌：{selectedTrace.type === "oil" 
                    ? selectedTrace.brand 
                    : selectedTrace.type === "merchant" 
                      ? selectedTrace.details?.oilBrand 
                      : selectedTrace.details?.oilBrand}油廠
                </div>
              </div>

              {/* Arrow */}
              <div className="hidden lg:flex justify-center text-slate-600" id="flow-arrow-1">
                <ArrowRight className="w-6 h-6 animate-pulse" />
              </div>

              {/* Box 2: Tier 2 */}
              <div className={`p-4 rounded-xl border flex flex-col justify-between h-28 transition-all ${
                selectedTrace.type === "merchant" 
                  ? "bg-amber-950/50 text-white border-amber-500 shadow-md shadow-amber-900/20" 
                  : "bg-slate-900/50 text-slate-300 border-slate-700/50"
              }`} id="flow-tier2-box">
                <div>
                  <span className={`text-[10px] font-extrabold ${selectedTrace.type === "merchant" ? "text-amber-300" : "text-slate-500"} uppercase tracking-wider`}>
                    第二層：受波及下游業者
                  </span>
                  <div className={`font-bold text-sm line-clamp-2 mt-1.5 ${selectedTrace.type === "merchant" ? "text-amber-100" : "text-slate-300"}`}>
                    {selectedTrace.type === "merchant" 
                      ? selectedTrace.name 
                      : selectedTrace.type === "food"
                        ? selectedTrace.details?.manufacturer
                        : `共影響 ${filteredMerchants.length} 家下游廠商`}
                  </div>
                </div>
                <div className={`text-[10px] font-bold ${selectedTrace.type === "merchant" ? "text-amber-400" : "text-slate-500"}`}>
                  主要分佈：{selectedTrace.type === "merchant" ? selectedTrace.county : "全台多個縣市"}
                </div>
              </div>

              {/* Arrow */}
              <div className="hidden lg:flex justify-center text-slate-600" id="flow-arrow-2">
                <ArrowRight className="w-6 h-6 animate-pulse" />
              </div>

              {/* Box 3: Tier 3 */}
              <div className={`p-4 rounded-xl border flex flex-col justify-between h-28 transition-all ${
                selectedTrace.type === "food" 
                  ? "bg-emerald-950/50 text-white border-emerald-500 shadow-md shadow-emerald-900/20" 
                  : "bg-slate-900/50 text-slate-300 border-slate-700/50"
              }`} id="flow-tier3-box">
                <div>
                  <span className={`text-[10px] font-extrabold ${selectedTrace.type === "food" ? "text-emerald-300" : "text-slate-500"} uppercase tracking-wider`}>
                    第三層：受影響終端食品
                  </span>
                  <div className={`font-bold text-sm line-clamp-2 mt-1.5 ${selectedTrace.type === "food" ? "text-emerald-100" : "text-slate-300"}`}>
                    {selectedTrace.type === "food" 
                      ? selectedTrace.name 
                      : selectedTrace.type === "merchant" 
                        ? `${getFoodsForMerchant(selectedTrace.name, selectedTrace.details?.productName || "", selectedTrace.id)[0]?.name || "小吃熟食品項"}`
                        : `波及多項市售零售食品`}
                  </div>
                </div>
                <div className={`text-[10px] font-bold ${selectedTrace.type === "food" ? "text-emerald-400" : "text-slate-500"}`}>
                  管制處置：{selectedTrace.type === "food" ? selectedTrace.details?.status : "下架停售與追蹤回收"}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STATISTICS PANELS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="merchants-stats-grid">
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-5 rounded-2xl border border-slate-800 shadow-md flex flex-col justify-between" id="stat-all-merchants">
          <div>
            <div className="text-xs text-indigo-200 font-bold tracking-tight">首波稽查登載總計</div>
            <div className="text-3xl font-black mt-1 text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-200">{totalCount} 家</div>
            <div className="text-[11px] text-emerald-400 font-extrabold mt-2 flex items-center gap-1.5">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              實質流入食品鏈：347 家
            </div>
          </div>
          <div className="text-[10px] text-slate-400 mt-3 border-t border-slate-800/80 pt-2">
            (已剔除重複、撤銷或非食品業者)
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-950/40 via-[#261014] to-red-900/10 border border-red-800/60 p-5 rounded-2xl flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-300" id="stat-fumao">
          <div>
            <div className="text-xs text-red-400 font-extrabold">福懋「益康」系列受累</div>
            <div className="text-2xl font-black text-red-300 mt-1">{fumaoCount} 家下游</div>
          </div>
          <span className="text-[10px] text-red-300 bg-red-950/60 border border-red-900/50 px-2.5 py-1 rounded-md mt-3 font-bold block w-fit">涉及大豆沙拉油、調理油</span>
        </div>

        <div className="bg-gradient-to-br from-amber-950/40 via-[#22180f] to-amber-900/10 border border-amber-800/60 p-5 rounded-2xl flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-300" id="stat-fushou">
          <div>
            <div className="text-xs text-amber-400 font-extrabold">「福壽」特製油受累</div>
            <div className="text-2xl font-black text-amber-300 mt-1">{fushouCount} 家下游</div>
          </div>
          <span className="text-[10px] text-amber-300 bg-amber-950/60 border border-amber-900/50 px-2.5 py-1 rounded-md mt-3 font-bold block w-fit">規格 18L / 3L 營業用大桶油</span>
        </div>

        <div className="bg-gradient-to-br from-blue-950/40 via-[#10152b] to-blue-900/10 border border-blue-800/60 p-5 rounded-2xl flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-300" id="stat-taishan">
          <div>
            <div className="text-xs text-blue-400 font-extrabold">「泰山」蔬菜調和受累</div>
            <div className="text-2xl font-black text-blue-300 mt-1">{taishanCount} 家下游</div>
          </div>
          <span className="text-[10px] text-blue-300 bg-blue-950/60 border border-blue-900/50 px-2.5 py-1 rounded-md mt-3 font-bold block w-fit">為部分植物蔬菜與風味油</span>
        </div>
      </div>

      {/* FILTER PANEL */}
      <div className="bg-[#0e1424] p-5 rounded-xl border border-slate-800/80 space-y-4 shadow-lg" id="merchants-filter-panel">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="filters-row">
          {/* Text Search */}
          <div className="relative md:col-span-1" id="search-container">
            <label className="block text-xs font-bold text-slate-400 mb-1.5 flex items-center gap-1">
              <Search className="w-3.5 h-3.5 text-slate-500" />
              關鍵字搜尋：
            </label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                id="merchant-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={
                  activeTier === "tier1" 
                    ? "輸入原料油、容量、特徵..." 
                    : activeTier === "tier2" 
                    ? "輸入下游商家、購買品項關鍵字..." 
                    : "輸入即食食品、小吃、製造大廠關鍵字..."
                }
                className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-[#121a2f] transition-all"
              />
            </div>
          </div>

          {/* County Select - Disabled for Tier 1 & Tier 3 unless tracking */}
          <div className="relative" id="county-buttons-container">
            <label className="block text-xs font-bold text-slate-400 mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              縣市篩選 (第二、三層聯動)：
            </label>
            <select
              id="county-selector-dropdown"
              value={selectedCounty}
              onChange={(e) => setSelectedCounty(e.target.value)}
              disabled={activeTier === "tier1"}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-[#121a2f] transition-all cursor-pointer font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {counties.map((c) => (
                <option key={c} value={c} className="bg-slate-950 text-slate-200">
                  {c === "全部" ? "全部縣市" : c}
                </option>
              ))}
            </select>
          </div>

          {/* Brand Select */}
          <div className="relative" id="brand-buttons-container">
            <label className="block text-xs font-bold text-slate-400 mb-1.5 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              來源油廠品牌：
            </label>
            <select
              id="brand-selector-dropdown"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              disabled={activeTier === "tier3"}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-[#121a2f] transition-all cursor-pointer font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {brands.map((b) => (
                <option key={b} value={b} className="bg-slate-950 text-slate-200">
                  {b === "全部" 
                    ? "全部來源品牌" 
                    : b === "台糖" 
                    ? "台糖 (代工受累品牌)" 
                    : b === "中聯" 
                    ? "中聯 (進口原料原油)" 
                    : `${b}油廠`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* CLICKABLE COUNTY CHIPS SELECTION */}
        {(activeTier === "tier2" || activeTier === "tier3") && (
          <div className="pt-3 border-t border-slate-800" id="county-chips-section">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {activeTier === "tier2" ? "第二層 縣市快捷點選（依受累商家數排序）：" : "第三層 縣市快捷點選（依受累食品數排序）："}
              </span>
              {selectedCounty !== "全部" && (
                <button
                  onClick={() => setSelectedCounty("全部")}
                  className="text-[11px] text-indigo-400 font-bold hover:underline cursor-pointer"
                >
                  重設為全部縣市
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
              {dynamicCounties.list.map((c) => {
                const isSelected = selectedCounty === c;
                const count = dynamicCounties.counts[c] || 0;
                
                return (
                  <button
                    key={c}
                    onClick={() => {
                      setSelectedCounty(c);
                      setCurrentPage(1); // reset to page 1
                    }}
                    className={`px-2.5 py-1 text-xs rounded-full border transition-all inline-flex items-center gap-1 cursor-pointer font-medium ${
                      isSelected
                        ? "bg-indigo-600 text-white border-indigo-500 font-semibold shadow-xs"
                        : "bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <span>{c === "全部" ? "全部" : c}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                      isSelected
                        ? "bg-indigo-850 text-indigo-200"
                        : "bg-slate-800 text-slate-400"
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Dynamic Warning Banner based on Tier selection */}
        <div className="bg-amber-950/30 border border-amber-900/60 rounded-lg p-3.5 flex items-start gap-2.5 text-xs text-amber-200" id="warning-notice">
          <ShieldAlert className="w-4.5 h-4.5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">
              {activeTier === "tier1" && "第一層「問題原料油」安全提示："}
              {activeTier === "tier2" && "第二層「波及下游業者」稽查通報："}
              {activeTier === "tier3" && "第三層「受影響市售食品」食用防範："}
            </span>
            <p className="mt-0.5 leading-relaxed">
              {activeTier === "tier1" && "此表為檢驗出含有有害超量苯駢芘之直接出廠油品，規格均為營業用大型油桶與調和包裝。各大食品廠或中西餐飲若經由直接或經銷取得，應即刻回收停用並申請全額退換貨。"}
              {activeTier === "tier2" && "此表列為首波衛生單位查核之下游分裝、批發、或使用上述問題油品之商家名冊。餐飲或食品業者均已進入輔導封存或下架回收階段，部分店家目前已更換合格油品正常營業。"}
              {activeTier === "tier3" && "此表為上述受波及業者使用問題油品生產、調合、爆香、或烘焙而成之終端食品。若您持有該特定批號之包裝食品，請暫勿食用，並可持發票與空罐至通路或品牌服務處申辦退費。"}
            </p>
          </div>
        </div>
      </div>

      {/* DYNAMIC CONTENTS DISPLAY */}

      {/* TIER 1: SOURCE OILS DISPLAY */}
      {activeTier === "tier1" && (
        <div className="space-y-4" id="tier1-view">
          <div className="flex items-center justify-between" id="tier1-header">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              篩選後共計 {filteredOils.length} 項問題原料油品
            </span>
            {selectedTrace && (
              <button onClick={clearTrace} className="text-xs text-indigo-400 hover:underline font-semibold cursor-pointer">
                顯示全部油品
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="tier1-grid">
            {filteredOils.map((oil) => (
              <motion.div
                key={oil.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#0e1424] rounded-xl border border-slate-800 p-4 hover:shadow-lg hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
                id={`oil-card-${oil.id}`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      oil.brand === "福懋"
                        ? "bg-red-950/60 text-red-400 border border-red-900/50"
                        : oil.brand === "福壽"
                        ? "bg-amber-950/60 text-amber-400 border border-amber-900/50"
                        : oil.brand === "泰山"
                        ? "bg-blue-950/60 text-blue-400 border border-blue-900/50"
                        : oil.brand === "台糖"
                        ? "bg-emerald-950/60 text-emerald-400 border border-emerald-900/50"
                        : oil.brand === "中聯"
                        ? "bg-purple-950/60 text-purple-400 border border-purple-900/50"
                        : "bg-slate-900 text-slate-300 border border-slate-800"
                    }`}>
                      {oil.brand === "中聯" ? "中聯 (進口源頭)" : oil.brand === "台糖" ? "台糖 (代工受累品牌)" : `${oil.brand}油廠`}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-900/50">
                      {oil.status}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-white text-sm">{oil.name}</h4>
                  
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs text-slate-400">
                    <div>
                      <span className="block text-[10px] text-slate-500 font-semibold">分類</span>
                      <span className="font-medium text-slate-300">{oil.category}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-500 font-semibold">分裝規格</span>
                      <span className="font-medium text-slate-300">{oil.capacity}</span>
                    </div>
                  </div>

                  {oil.batchNumber && (
                    <div className="pt-2 border-t border-slate-800 text-xs">
                      <span className="block text-[10px] text-slate-500 font-semibold">公告涉案批號</span>
                      <span className="font-mono text-[11px] font-bold text-slate-300 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 inline-block mt-0.5 max-w-full truncate">{oil.batchNumber}</span>
                    </div>
                  )}

                  {oil.isOem && (
                    <div className="bg-emerald-950/40 text-emerald-300 text-[10px] px-2.5 py-1.5 rounded-lg border border-emerald-900/30 flex items-center gap-1">
                      <Info className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>由 <strong>{oil.oemBrand}</strong> 代工包裝而受污染波及</span>
                    </div>
                  )}
                </div>

                <div className="bg-red-950/30 rounded-lg p-2.5 text-xs border border-red-900/40">
                  <span className="font-bold text-red-400 block text-[10px] uppercase tracking-wider">檢驗異常原因：</span>
                  <p className="text-red-300 font-medium mt-0.5">{oil.testResult}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => startTrace("oil", oil)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      selectedTrace?.id === oil.id
                        ? "bg-red-600 text-white border-red-700 shadow-xs"
                        : "bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${selectedTrace?.id === oil.id ? "animate-spin" : ""}`} />
                    <span>三層流向</span>
                  </button>
                  {onTraceInSupply && (
                    <button
                      onClick={() => onTraceInSupply(getSupplyChainNodeId(oil, "oil"))}
                      className="px-2.5 py-2 text-xs font-bold rounded-lg border border-indigo-900/40 bg-indigo-950/30 hover:bg-indigo-900/60 text-indigo-300 transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>進流向圖</span>
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* TIER 2: DOWNSTREAM MERCHANTS TABLE DISPLAY */}
      {activeTier === "tier2" && (
        <div className="bg-[#0e1424] rounded-xl border border-slate-800 overflow-hidden shadow-lg" id="merchants-table-container">
          <div className="p-4 bg-slate-900/40 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2" id="table-header">
            <div className="flex items-center gap-2" id="table-title">
              <Layers className="w-4.5 h-4.5 text-slate-400" />
              <span className="text-sm font-bold text-slate-200">
                第二層下游受污染油品分裝與使用名冊 ({filteredMerchants.length} 筆)
              </span>
            </div>
            <button
              onClick={() => window.print()}
              id="print-table-btn"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>友善列印 / 匯出 PDF</span>
            </button>
          </div>

          {paginatedMerchants.length > 0 ? (
            <div className="overflow-x-auto hide-scrollbar" id="merchants-table-wrapper">
              <table className="w-full text-left border-collapse min-w-[900px]" id="merchants-table">
                <thead>
                  <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-200 text-xs font-bold uppercase">
                    <th className="py-3.5 px-4 text-center w-16 whitespace-nowrap">序號</th>
                    <th className="py-3.5 px-4 w-24 whitespace-nowrap">縣市</th>
                    <th className="py-3.5 px-4 min-w-[250px]">業者 / 商家名稱</th>
                    <th className="py-3.5 px-4 min-w-[200px]">進貨問題油品與規格</th>
                    <th className="py-3.5 px-4 w-28 whitespace-nowrap">來源品牌</th>
                    <th className="py-3.5 px-4 w-48 text-center whitespace-nowrap">聯動與流向追蹤</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  {paginatedMerchants.map((merchant, idx) => {
                    const globalIdx = (currentPage - 1) * itemsPerPage + idx + 1;
                    const foods = getFoodsForMerchant(merchant.merchantName, merchant.productName, merchant.id);
                    const isTraced = selectedTrace?.id === merchant.id;

                    return (
                      <motion.tr
                        key={merchant.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.1 }}
                        id={`row-merchant-${merchant.id}`}
                        className={`hover:bg-slate-900/40 transition-colors ${isTraced ? "bg-amber-950/30" : ""}`}
                      >
                        {/* Index */}
                        <td className="py-3.5 px-6 text-center font-mono text-slate-500 text-xs font-bold">
                          {globalIdx}
                        </td>

                        {/* County */}
                        <td className="py-3.5 px-6">
                          <span className="inline-flex items-center gap-1 text-slate-300 font-semibold" id={`merchant-county-${merchant.id}`}>
                            <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                            {merchant.county}
                          </span>
                        </td>

                        {/* Merchant Name */}
                        <td className="py-3.5 px-6">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`font-bold ${
                                merchant.tagType === "deleted" 
                                  ? "text-slate-500 line-through" 
                                  : "text-white"
                              }`} id={`merchant-name-${merchant.id}`}>
                                {merchant.merchantName}
                              </span>
                              
                              {/* Custom badges based on official footnotes */}
                              {merchant.tagType && merchant.tagType !== "normal" && (
                                <span className={`inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                  merchant.tagType === "duplicate"
                                    ? "bg-slate-800 text-slate-400 border border-slate-700"
                                    : merchant.tagType === "deleted"
                                    ? "bg-red-950/60 text-red-400 border border-red-900/40"
                                    : merchant.tagType === "feed"
                                    ? "bg-amber-950/60 text-amber-400 border border-amber-900/40"
                                    : "bg-purple-950/60 text-purple-400 border border-purple-900/40"
                                }`}>
                                  {merchant.tagType === "duplicate" && "重複登記"}
                                  {merchant.tagType === "deleted" && "應予刪除"}
                                  {merchant.tagType === "feed" && "非食用 (飼料級)"}
                                  {merchant.tagType === "non-food" && "非食用 (工業用)"}
                                </span>
                              )}
                            </div>

                            {/* Official Footnote Remarks */}
                            {merchant.remark && (
                              <span className="text-[11px] text-slate-400 mt-0.5 italic">
                                * {merchant.remark}
                              </span>
                            )}

                            {/* Dynamically display calculated level-3 foods */}
                            <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                              <CornerDownRight className="w-3 h-3 text-slate-500 flex-shrink-0" />
                              受波及食品：{foods.map(f => f.name).join('、')}
                            </span>
                          </div>
                        </td>

                        {/* Product Name */}
                        <td className="py-3.5 px-6">
                          <span className="font-mono text-xs text-slate-300 bg-slate-950 border border-slate-800 px-2 py-1 rounded inline-block max-w-xs truncate md:max-w-md" title={merchant.productName} id={`merchant-product-${merchant.id}`}>
                            {merchant.productName}
                          </span>
                        </td>

                        {/* Brand Badge */}
                        <td className="py-3.5 px-6">
                          <span
                            id={`merchant-brand-${merchant.id}`}
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                              merchant.oilBrand === "福懋"
                                ? "bg-red-950/60 text-red-400 border border-red-900/50"
                                : merchant.oilBrand === "福壽"
                                ? "bg-amber-950/60 text-amber-400 border border-amber-900/50"
                                : merchant.oilBrand === "泰山"
                                ? "bg-blue-950/60 text-blue-400 border border-blue-900/50"
                                : "bg-slate-900 text-slate-300 border border-slate-800"
                            }`}
                          >
                            {merchant.oilBrand}油廠
                          </span>
                        </td>

                        {/* Control Actions / Trace button */}
                        <td className="py-3.5 px-6 text-center">
                          <div className="flex items-center justify-center gap-1.5 flex-wrap">
                            <button
                              onClick={() => startTrace("merchant", merchant)}
                              className={`px-2.5 py-1 text-xs font-bold rounded-md border transition-all inline-flex items-center gap-1 cursor-pointer ${
                                isTraced
                                  ? "bg-amber-500 text-white border-amber-600"
                                  : "bg-slate-900 text-amber-300 border-amber-800/80 hover:bg-slate-800"
                              }`}
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              <span>追蹤三層</span>
                            </button>
                            {onTraceInSupply && (
                              <button
                                onClick={() => onTraceInSupply(getSupplyChainNodeId(merchant, "merchant"))}
                                className="px-2.5 py-1 text-xs font-bold rounded-md border border-indigo-900/40 bg-indigo-950/30 hover:bg-indigo-900/60 text-indigo-300 transition-all inline-flex items-center gap-1 cursor-pointer"
                              >
                                <ArrowRight className="w-3.5 h-3.5" />
                                <span>進流向圖</span>
                              </button>
                            )}
                            <span className="text-[10px] text-red-400 font-bold bg-red-950/60 border border-red-900/50 rounded px-2 py-1">
                              下架封存
                            </span>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16 text-slate-500" id="merchants-no-results">
              <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm">查無符合篩選條件的下游商家名冊。</p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCounty("全部");
                  setSelectedBrand("全部");
                  clearTrace();
                }}
                className="text-xs text-blue-600 hover:underline mt-2 font-semibold cursor-pointer"
              >
                清除所有搜尋與篩選條件
              </button>
            </div>
          )}

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between" id="merchants-pagination">
              <span className="text-xs text-slate-400 font-medium">
                顯示第 {((currentPage - 1) * itemsPerPage) + 1} 至 {Math.min(currentPage * itemsPerPage, filteredMerchants.length)} 筆，共 {filteredMerchants.length} 筆
              </span>
              <div className="flex items-center gap-1.5" id="pagination-buttons">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 text-xs text-slate-300 hover:text-white border border-slate-800 rounded bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-slate-900 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum = i + 1;
                  if (currentPage > 3 && totalPages > 5) {
                    if (currentPage + 2 > totalPages) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 text-xs font-bold rounded ${
                        currentPage === pageNum
                          ? "bg-indigo-600 text-white"
                          : "text-slate-300 hover:text-white border border-slate-800 bg-slate-900 hover:bg-slate-800"
                      } cursor-pointer`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 text-xs text-slate-300 hover:text-white border border-slate-800 rounded bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-slate-900 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TIER 3: AFFECTED FOODS GRID DISPLAY */}
      {activeTier === "tier3" && (
        <div className="space-y-4" id="tier3-view">
          <div className="flex items-center justify-between" id="tier3-header">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              篩選後共計 {filteredFoods.length} 項受致癌沙拉油波及市售食品
            </span>
            {selectedTrace && (
              <button onClick={clearTrace} className="text-xs text-indigo-400 hover:underline font-semibold cursor-pointer">
                顯示全部食品
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="tier3-grid">
            {filteredFoods.map((food) => (
              <motion.div
                key={food.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0e1424] rounded-xl border border-slate-800 p-5 hover:shadow-lg hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 relative overflow-hidden"
                id={`food-card-${food.id}`}
              >
                {/* Visual Top Highlight Ribbon */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-900/50 rounded px-2 py-0.5">
                      <Tag className="w-3 h-3" />
                      {food.category}
                    </span>
                    <span className="text-[10px] font-bold text-red-400 bg-red-950/60 border border-red-900/50 rounded px-2 py-0.5">
                      {food.status}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-white text-sm">{food.name}</h4>

                  {/* Production Details */}
                  <div className="space-y-1.5 text-xs text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">製造廠商 / 商家</span>
                      <span className="font-bold text-slate-200 text-right truncate max-w-[160px]" title={food.manufacturer}>
                        {food.manufacturer}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">使用第一層油品</span>
                      <span className="font-mono text-slate-300 text-right truncate max-w-[160px]" title={food.sourceOil}>
                        {food.sourceOil} ({food.oilBrand}油廠)
                      </span>
                    </div>
                  </div>

                  {/* Hazard details */}
                  <div className="text-xs text-slate-400">
                    <span className="font-semibold text-slate-300 block">波及危害環節：</span>
                    <p className="mt-0.5 leading-relaxed">{food.hazard}</p>
                  </div>
                </div>

                {/* Health Suggestion Block */}
                <div className="bg-emerald-950/40 rounded-lg p-3 text-xs border border-emerald-900/30 flex items-start gap-2">
                  <HeartPulse className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-emerald-400 block text-[10px] uppercase tracking-wider">消費者應對指引：</span>
                    <p className="text-emerald-300 mt-0.5 leading-relaxed">{food.suggestion}</p>
                  </div>
                </div>

                {/* Interactive Action Button */}
                <div className="flex gap-2">
                  <button
                    onClick={() => startTrace("food", food)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      selectedTrace?.id === food.id
                        ? "bg-emerald-600 text-white border-emerald-700 shadow-xs"
                        : "bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${selectedTrace?.id === food.id ? "animate-spin" : ""}`} />
                    <span>食品溯源</span>
                  </button>
                  {onTraceInSupply && (
                    <button
                      onClick={() => onTraceInSupply(getSupplyChainNodeId(food, "food"))}
                      className="px-2.5 py-2 text-xs font-bold rounded-lg border border-indigo-900/40 bg-indigo-950/30 hover:bg-indigo-900/60 text-indigo-300 transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>進流向圖</span>
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
