const fs = require('fs');
const text = fs.readFileSync('src/merchantsData.ts', 'utf8');
const lines = text.split('\n');
const seen = new Set();
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const m = line.match(/\["([^"]+)", "([^"]+)"/);
  if (m) {
    if (seen.has(m[2])) {
      console.log("Duplicate found: " + m[2]);
    }
    seen.add(m[2]);
  }
}
