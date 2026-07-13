const fs = require('fs');

const merchantsRaw = fs.readFileSync('src/merchantsData.ts', 'utf8');

// Get all existing merchants
const oldMatches = [...merchantsRaw.matchAll(/\["([^"]+)", "([^"]+)",/g)].map(m => m[2]);

// Read OCR
const lines = fs.readFileSync('ocr_text.txt', 'utf8').split('\n').filter(l => l.trim().length > 0);

let newMerchants = [];
let dups = [];

// First add the 4 text items explicitly mentioned
newMerchants.push(`  ["桃園市", "全聯阪急麵包股份有限公司", "福壽不飽和大豆沙拉油 2L", "福壽"],`);
newMerchants.push(`  ["嘉義縣", "愛之味股份有限公司", "福壽花生風味精華調合油 2L", "福壽"],`);
newMerchants.push(`  ["新北市", "頂呱呱國際股份有限公司", "福壽不飽和大豆沙拉油 2L", "福壽"],`);
newMerchants.push(`  ["臺北市", "統一超食代股份有限公司", "福壽不飽和大豆沙拉油 2L", "福壽"],`);

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const match = line.match(/^(\d+)\s+([^\s]+)/);
  if (!match) continue;
  
  let rawName = match[2];
  
  let fullName = rawName;
  if (rawName === "勝博殿") {
     const nextWord = line.split(/\s+/)[2];
     if (nextWord && !nextWord.includes("臺中")) {
        fullName = rawName + nextWord;
     } else if (nextWord) {
        fullName = rawName + " " + nextWord;
     }
  } else if (rawName.includes("超級明星視聽歌唱有限公司")) {
     fullName = "超級明星視聽歌唱有限公司-經貿店";
  } else if (rawName === "胖老爹炸雞有限公司-臺中中") {
     fullName = "胖老爹炸雞有限公司-臺中中華店";
  } else if (rawName === "全聯實業股份有限公司東勢東關分公") {
     fullName = "全聯實業股份有限公司東勢東關分公司-東勢東關店";
  }
  
  let coreName = fullName.replace(/股份有限公司.*|有限公司.*|企業社.*|實業有限公司.*/, '').replace(/-.*/, '');
  
  let isDup = false;
  for (const old of oldMatches) {
    if (old.includes(coreName) && coreName.length >= 2) {
      isDup = true;
      dups.push(fullName);
      break;
    }
  }
  
  if (!isDup) {
    let cityMatch = line.match(/(臺中市|台中市|新北市|台北市|桃園市|雲林縣)/);
    let city = cityMatch ? cityMatch[1].replace('台', '臺') : "臺中市";
    
    let oil = "其他";
    let prod = "問題油品";
    if (line.includes("王牌液態油炸專用油")) { prod = "王牌液態油炸專用油"; }
    else if (line.includes("維佳無水烘焙油脂") || line.includes("維佳超特級烘焙油脂") || line.includes("南僑維佳") || line.includes("維佳液態蛋糕用油")) { prod = "維佳烘焙油脂"; }
    else if (line.includes("大豆沙拉油")) { prod = "大豆沙拉油"; }
    else if (line.includes("益康烹調油")) { prod = "益康烹調油(調合油)"; oil = "福懋"; }
    else if (line.includes("福壽大豆沙拉油")) { prod = "福壽大豆沙拉油"; oil = "福壽"; }
    else if (line.includes("泰山大豆沙拉油") || line.includes("泰山精選蔬菜油")) { prod = "泰山大豆沙拉油"; oil = "泰山"; }
    
    // Add to list and also to oldMatches to prevent duplicates *within* the new list (like "勝博殿")
    newMerchants.push(`  ["${city}", "${fullName}", "${prod}", "${oil}"],`);
    oldMatches.push(fullName);
  }
}

let newContent = merchantsRaw.replace('// === 基隆市 ===', '// === 第4、5批新增受波及業者 ===\n' + newMerchants.join('\n') + '\n\n  // === 基隆市 ===');
fs.writeFileSync('src/merchantsData.ts', newContent);

console.log(`Added ${newMerchants.length} merchants.`);
console.log(`Skipped ${dups.length} duplicates: ${dups.join(', ')}`);
