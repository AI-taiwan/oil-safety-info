const fs = require('fs');
const lines = fs.readFileSync('ocr_text.txt', 'utf8').split('\n').filter(l => l.trim().length > 0);

let names = [];
let dups = [];

for (const line of lines) {
  const match = line.match(/^\d+\s+([^\s]+)/);
  if (match) {
    let name = match[1];
    if (names.includes(name)) {
      dups.push(name);
    }
    names.push(name);
  }
}

console.log("Self Duplicates:");
console.log(dups);
