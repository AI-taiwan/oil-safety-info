export interface NewsItem {
  id: string;
  title: string;
  date: string;
  category: "政府公告" | "廠商回收" | "健康指引" | "檢驗進度";
  content: string;
  source: string;
  importance: "high" | "medium" | "low";
}

export interface InspectionRecord {
  id: string;
  brand: string;
  productName: string;
  type: string; // e.g., 芥花油, 葵花油, 調和油, 100%純沙拉油
  manufacturer: string;
  batchNumber: string;
  benzopyreneValue: number; // 苯駢芘測得值 (μg/kg) - 法規限量 2.0 μg/kg
  status: "passed" | "failed" | "pending";
  action: string; // 處置作為 (例如：全面下架回收、預防性下架、合格上架)
  inspectDate: string;
}

export interface SupplyChainNode {
  id: string;
  label: string;
  category: "原料進口" | "精煉加工" | "分裝品牌" | "下游通路";
  status: "danger" | "warning" | "safe";
  description: string;
  connections: string[]; // Target node IDs
}

export interface Message {
  id: string;
  sender: "user" | "ai";
  content: string;
  timestamp: Date;
  sources?: { title: string; uri: string }[];
  isError?: boolean;
}

export interface DownstreamMerchant {
  id: string;
  county: string;       // e.g., 基隆市, 台北市, 新北市
  merchantName: string; // 業者名稱
  productName: string;  // 購買品項
  oilBrand: "福懋" | "福壽" | "泰山" | "台糖" | "中聯" | "其他";
  batchNumber?: string;  // 涉案批號
  effectiveDate?: string;// 有效日期
  remark?: string;       // 官方稽查備註
  tagType?: "duplicate" | "deleted" | "non-food" | "feed" | "normal"; // 狀態標籤 (如：重複、非食品用、飼料用等)
}

