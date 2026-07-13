const fs = require('fs');
const merchantsRaw = fs.readFileSync('src/merchantsData.ts', 'utf8');

// Exclude the ones I just added under "第4、5批新增受波及業者"
// by looking only after "=== 基隆市 ==="
const oldMerchantsStr = merchantsRaw.substring(merchantsRaw.indexOf('=== 基隆市 ==='));

const mMatches = [...oldMerchantsStr.matchAll(/\["[^"]+", "([^"]+)"/g)].map(m => m[1]);

const checkList = [
  "燒瓶子", "佳信", "食樂唯", "川月", "捷順", "采市", "兆賀", "億昌", 
  "瑪利亞", "耶思托嬰", "耶思瑪亞", "金像獎", "德璐", "禾膳", "榮民總醫院",
  "佳愛", "美食園", "台邑", "潔達", "ㄚ香", "勝一", "奇萌籽", "胖老爹",
  "全聯實業", "好樂迪", "榮記顏新發糕餅", "合興通食品", "成偉食品", "今口香調理", "大友食品", "台灣楓康超市",
  "東美食品", "寶御食品", "藝起做創意", "勝博殿", "儷晶皇宮", "超級明星", "超級倡星", "麒湟", "超級巨星",
  "御品餐飲", "成記手工麵", "小上海山東", "五街麵店", "永豐小吃", "辣六街", "鑫鼎熱炒", "品味小館", "芫儂",
  "三民街果菜行", "大東勢五金百貨", "東億便利商店", "金穗商店", "喜客便利商店", "上禾超級市場", "茂松商店",
  "土饅頭小巷舖", "遠百企業", "巧瑋國際", "志達實業", "高○青", "躉泰食品",
  "霧峰區本堂社區", "新社區馬力埔", "大肚區社腳社區", "潭子區聚興社區", "福康關懷協會", "台中市街友關懷協會"
];

for (const name of checkList) {
  const partials = mMatches.filter(m => m.includes(name));
  if (partials.length > 0) {
    console.log("MATCH FOUND FOR: " + name + " -> " + partials.join(", "));
  }
}
