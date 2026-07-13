const fs = require('fs');
const merchantsRaw = fs.readFileSync('src/merchantsData.ts', 'utf8');
const oldData = merchantsRaw.substring(merchantsRaw.indexOf('=== 基隆市 ==='));

const mMatches = [...oldData.matchAll(/\["([^"]+)", "([^"]+)",/g)].map(m => m[2]);
console.log(mMatches.filter(m => m.includes('胖老爹')));
console.log(mMatches.filter(m => m.includes('全聯')));
