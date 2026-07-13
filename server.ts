import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
} catch (error) {
  console.error("Failed to initialize Gemini Client:", error);
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", apiInitialized: !!ai });
});

app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid request payload. 'messages' must be an array." });
  }

  // Format conversations for the API
  const lastMessage = messages[messages.length - 1];
  const prompt = lastMessage?.content || "";

  if (!prompt) {
    return res.status(400).json({ error: "Empty message." });
  }

  if (!ai) {
    // Return a friendly fallback when API key is missing or invalid
    return res.json({
      text: "【系統提示：目前未設定 Gemini API 金鑰，啟用模擬回答】\n\n關於您詢問的「食安致癌沙拉油事件」，建議採取以下防範措施：\n1. **立即停用問題油品**：請核對政府衛福部食藥署（TFDA）公告的不合格批號名單。\n2. **健康自主管理**：多數致癌物（如苯駢芘）為長期累積性危害，若不慎食用，請多喝水、多攝取高纖維蔬菜以促進體內代謝。\n3. **選購原則**：建議挑選具備 CNS 國家標準、SQF 認證，或有第三方檢驗合格報告的知名大廠食用油，並定期輪換不同種類的油品（如橄欖油、葵花油、芥花油），以分散風險。",
      sources: [
        { title: "衛生福利部食品藥物管理署 官網", uri: "https://www.fda.gov.tw/" },
        { title: "消費者保護處 申訴專區", uri: "https://cpc.ey.gov.tw/" }
      ]
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "你是一位專業的食品安全專家與健康顧問。目前正在為使用者解答關於近期「食安致癌沙拉油事件」（例如含有超標苯駢芘 Benzo[a]pyrene 或其他致癌化學物質）的疑問。請以專業、客觀、溫和且具體的態度回答。請依據使用者的問題，提供實用的建議，例如：如何辨識受污染油品、攝入後的健康影響、如何選購安全食用油、政府目前公告的合格與不合格名單查詢引導等。若使用者問及特定的牌子，可以使用搜尋功能進行即時比對與確認，並列出參考來源連結。請務必使用繁體中文（台灣習慣用語）回答。",
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "抱歉，我目前無法產生回應。";
    
    // Extract search grounding metadata sources if available
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = chunks
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        title: chunk.web.title || "參考來源",
        uri: chunk.web.uri
      }));

    res.json({ text, sources });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({
      error: "發送請求至 AI 時發生錯誤。",
      text: "抱歉，目前 AI 諮詢服務暫時無法取得回應，建議您可以先至衛福部食藥署官網或撥打食安專線 1919 洽詢最新核對名單。"
    });
  }
});

// Serve static assets or mount Vite dev server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
