const fs = require('fs');

const merchantsRaw = fs.readFileSync('src/merchantsData.ts', 'utf8');
const oldData = merchantsRaw.substring(merchantsRaw.indexOf('=== 基隆市 ==='));

const mMatches = [...oldData.matchAll(/\["([^"]+)", "([^"]+)",/g)].map(m => m[2]);

const lines = fs.readFileSync('ocr_text.txt', 'utf8').split('\n').filter(l => l.trim().length > 0);

let dups = [];
let newItems = [];

// common prefixes to extract core names
function getCore(name) {
  return name.replace(/股份有限公司.*|有限公司.*|企業有限公司.*|企業社.*|實業有限公司.*/, '')
             .replace(/-.*/, '');
}

for (const line of lines) {
  const match = line.match(/^\d+\s+([^\s]+)/);
  if (match) {
    let name = match[1];
    let coreName = getCore(name);
    
    if (coreName.length < 2) continue;
    
    let isDup = false;
    let dupWith = "";
    for (const old of mMatches) {
      if (old.includes(coreName) || coreName.includes(old)) {
        isDup = true;
        dupWith = old;
        break;
      }
    }
    
    if (isDup) {
      dups.push({ newName: name, oldName: dupWith });
    } else {
      newItems.push(name);
    }
  }
}

console.log("=== POTENTIAL DUPLICATES ===");
dups.forEach(d => console.log(`${d.newName} -> ${d.oldName}`));
