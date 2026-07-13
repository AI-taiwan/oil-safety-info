const fs = require('fs');
let text = fs.readFileSync('src/merchantsData.ts', 'utf8');

// The file currently has duplicate entries because I ran the update script.
// Let's strip out everything between `// === 第4、5批新增受波及業者 ===` and `// === 基隆市 ===`
const startIdx = text.indexOf('// === 第4、5批新增受波及業者 ===');
const endIdx = text.indexOf('// === 基隆市 ===');

if (startIdx !== -1 && endIdx !== -1) {
  let oldHeader = text.substring(0, startIdx);
  let oldFooter = text.substring(endIdx);
  fs.writeFileSync('src/merchantsData.ts', oldHeader + oldFooter);
}
