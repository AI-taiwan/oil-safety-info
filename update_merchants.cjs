const fs = require('fs');

const merchantsRaw = fs.readFileSync('src/merchantsData.ts', 'utf8');
const oldData = merchantsRaw.substring(merchantsRaw.indexOf('=== 基隆市 ==='));
const oldMatches = [...oldData.matchAll(/\["([^"]+)", "([^"]+)", "([^"]+)", "([^"]+)"/g)].map(m => m[2]);

const lines = fs.readFileSync('ocr_text.txt', 'utf8').split('\n').filter(l => l.trim().length > 0);

let newMerchants = [];
let dups = [];

// Manually mapping some based on visual inspection
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const match = line.match(/^(\d+)\s+([^\s]+)/);
  if (!match) continue; // skip wrapped lines
  
  let num = parseInt(match[1]);
  if (num <= 15) continue; // we already added 1-15 manually!

  let rawName = match[2];
  
  // special handling for spaces in name
  let fullName = rawName;
  if (rawName === "勝博殿") {
     const nextWord = line.split(/\s+/)[2];
     if (nextWord && !nextWord.includes("臺中")) {
        fullName = rawName + nextWord;
     } else if (nextWord) {
        fullName = rawName + " " + nextWord;
     }
  } else if (rawName === "超級明星視聽歌唱有限公司-經貿店(可能沒用到)") {
     fullName = "超級明星視聽歌唱有限公司-經貿店";
  }
  
  // clean up names
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
    // try to get city
    let cityMatch = line.match(/(臺中市|台中市|新北市|台北市|桃園市|雲林縣)/);
    let city = cityMatch ? cityMatch[1].replace('台', '臺') : "臺中市";
    
    // figure out oil and product
    let oil = "其他";
    let prod = "問題油品";
    if (line.includes("王牌液態油炸專用油")) { prod = "王牌液態油炸專用油"; oil = "其他"; }
    else if (line.includes("維佳無水烘焙油脂") || line.includes("維佳超特級烘焙油脂") || line.includes("南僑維佳")) { prod = "維佳烘焙油脂"; oil = "其他"; }
    else if (line.includes("大豆沙拉油")) { prod = "大豆沙拉油"; }
    else if (line.includes("益康烹調油")) { prod = "益康烹調油(調合油)"; oil = "福懋"; }
    else if (line.includes("福壽大豆沙拉油")) { prod = "福壽大豆沙拉油"; oil = "福壽"; }
    else if (line.includes("泰山大豆沙拉油") || line.includes("泰山精選蔬菜油")) { prod = "泰山大豆沙拉油"; oil = "泰山"; }
    
    newMerchants.push(`  ["${city}", "${fullName}", "${prod}", "${oil}"],`);
  }
}

// insert into the file
let newContent = merchantsRaw.replace('// === 基隆市 ===', newMerchants.join('\n') + '\n\n  // === 基隆市 ===');
fs.writeFileSync('src/merchantsData.ts', newContent);

console.log(`Added ${newMerchants.length} merchants.`);
console.log(`Skipped ${dups.length} duplicates: ${dups.join(', ')}`);
