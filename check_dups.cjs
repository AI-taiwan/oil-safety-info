const fs = require('fs');
const merchantsRaw = fs.readFileSync('src/merchantsData.ts', 'utf8');
const tier3Raw = fs.readFileSync('src/tier3Data.ts', 'utf8');

const mMatches = [...merchantsRaw.matchAll(/\["[^"]+", "([^"]+)"/g)].map(m => m[1]);
const tMatches = [...tier3Raw.matchAll(/"manufacturer":\s*"([^"]+)"/g)].map(m => m[1]);

const allMerchants = [...mMatches, ...tMatches];

const ocrNames = [
  "燒瓶子投資股份有限公司",
  "佳信食品工業股份有限公司",
  "食樂唯食品有限公司",
  "川月企業社",
  "台塑餐飲美食調理有限公司",
  "捷順國際食品(股)公司",
  "全錸蒔國際餐飲會館",
  "采市整合行銷國際有限公司",
  "兆賀食品工業有限公司",
  "億昌油廠",
  "財團法人瑪利亞社會福利基金會附設瑪利亞學園",
  "臺中市私立耶思托嬰中心",
  "臺中市私立耶思瑪亞托嬰中心",
  "臺中市私立金像獎托嬰中心",
  "臺中市德璐兒少之家",
  "禾膳股份有限公司臺中分公司",
  "臺中榮民總醫院營養室",
  "佳愛餐盒食品廠",
  "美食園事業有限公司",
  "台邑食品有限公司",
  "潔達有限公司",
  "ㄚ香雜貨鋪",
  "勝一商行",
  "奇萌籽",
  "胖老爹炸雞有限公司"
];

for (const name of ocrNames) {
  if (allMerchants.includes(name)) {
    console.log("EXACT DUPLICATE FOUND: " + name);
  } else {
    // Check partial
    const partials = allMerchants.filter(m => m.includes(name) || name.includes(m));
    if (partials.length > 0) {
      console.log("PARTIAL MATCH FOUND FOR: " + name + " -> " + partials.join(", "));
    }
  }
}
