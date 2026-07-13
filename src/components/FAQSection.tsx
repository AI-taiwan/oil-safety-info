import { useState } from "react";
import { faqData } from "../data";
import { ChevronDown, HelpCircle, Heart, ShieldAlert, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="faq-root">
      {/* FAQ Accordions (Left 2 columns) */}
      <div className="lg:col-span-2 space-y-4" id="faq-accordions">
        <h3 className="text-lg font-black text-white mb-4 tracking-tight flex items-center gap-2">
          <span className="w-2.5 h-6 bg-gradient-to-b from-indigo-500 to-blue-500 rounded-full inline-block"></span>
          常規問題與食安科普
        </h3>
        {faqData.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              id={`faq-item-${index}`}
              className={`rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                isOpen
                  ? "bg-slate-900 border-indigo-500/50 shadow-lg shadow-indigo-900/10"
                  : "bg-[#0b0f19] border-slate-800 hover:border-slate-700 shadow-sm"
              }`}
            >
              <button
                id={`faq-trigger-${index}`}
                onClick={() => toggleFAQ(index)}
                className={`w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-extrabold transition-colors cursor-pointer ${
                  isOpen ? "text-indigo-300 bg-indigo-950/20" : "text-slate-300 hover:bg-slate-900/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className={`w-5 h-5 flex-shrink-0 transition-colors ${isOpen ? "text-indigo-400 font-extrabold animate-pulse" : "text-slate-500"}`} />
                  <span className="text-sm sm:text-base leading-snug">{faq.q}</span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 transition-transform duration-300 flex-shrink-0 ${
                    isOpen ? "rotate-180 text-indigo-400" : "text-slate-500"
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                    id={`faq-content-wrapper-${index}`}
                  >
                    <div className="p-5 sm:p-6 pt-0 text-sm text-slate-400 leading-relaxed space-y-2.5 whitespace-pre-line border-t border-indigo-900/40 font-medium" id={`faq-answer-${index}`}>
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Sidebar Health Advice & Selection Guide (Right 1 column) */}
      <div className="lg:col-span-1 space-y-6" id="faq-sidebar">
        {/* Health Promotion */}
        <div className="bg-gradient-to-br from-emerald-950/40 via-[#0e1c18] to-emerald-900/10 border border-emerald-800/60 rounded-2xl p-5 space-y-4 shadow-sm hover:scale-[1.01] transition-all duration-300 relative overflow-hidden" id="health-promo-card">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center gap-2 text-emerald-400 border-b border-emerald-800/60 pb-3" id="health-header">
            <Heart className="w-5 h-5 fill-emerald-500 stroke-emerald-500 animate-pulse" />
            <h4 className="font-black text-sm sm:text-base text-emerald-300">日常排毒與體質調理</h4>
          </div>
          <div className="text-xs text-emerald-100/70 space-y-3 leading-relaxed font-semibold relative z-10" id="health-body">
            <p className="font-bold text-emerald-300">
              若擔憂日常飲食已攝入微量苯駢芘等有害物質，可藉由調整飲食來增強體內代謝機制：
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong className="text-emerald-300">高纖維攝取：</strong>燕麥、地瓜、蘋果及竹筍能促進腸道蠕動，減少致癌物在腸胃道的停留時間。
              </li>
              <li>
                <strong className="text-emerald-300">抗氧化十字花科：</strong>青花菜、高麗菜、芥藍富含「吲哚」與「蘿蔔硫素」，有助於活化肝臟解毒酵素系統。
              </li>
              <li>
                <strong className="text-emerald-300">豐富維生素 C/E：</strong>奇異果、芭樂、綠茶等天然食品富含高活性抗氧化物，能有效清除自由基，降低發炎反應。
              </li>
              <li>
                <strong className="text-emerald-300">足量飲水與運動：</strong>多喝水與固定運動排汗，能增強身體腎臟與汗腺的自然排泄。
              </li>
            </ul>
          </div>
        </div>

        {/* Selection Rules */}
        <div className="bg-gradient-to-br from-blue-950/40 via-[#0a1224] to-blue-900/10 border border-blue-800/60 rounded-2xl p-5 space-y-4 shadow-sm hover:scale-[1.01] transition-all duration-300 relative overflow-hidden" id="selection-guide-card">
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center gap-2 text-blue-400 border-b border-blue-800/60 pb-3" id="selection-header">
            <ShoppingBag className="w-5 h-5 text-blue-400 animate-pulse" />
            <h4 className="font-black text-sm sm:text-base text-blue-300">安全選油「三不二要」</h4>
          </div>
          <div className="text-xs text-blue-100/70 space-y-3 leading-relaxed font-semibold relative z-10" id="selection-body">
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 bg-red-950/50 border border-red-900/50 text-red-400 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">❌</span>
                <span><strong className="text-blue-300">不要購買散裝或標示不清油品：</strong>避免來源不明或無防偽標記的餐飲專用大桶油，以防止混油風險。</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 bg-red-950/50 border border-red-900/50 text-red-400 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">❌</span>
                <span><strong className="text-blue-300">加熱不要到冒煙程度：</strong>任何好油只要持續高溫冒煙，皆會變質並產生有害致癌物。</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 bg-red-950/50 border border-red-900/50 text-red-400 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">❌</span>
                <span><strong className="text-blue-300">不要長期只單吃同一品牌：</strong>定期輪替油品種類及不同大廠品牌，分散系統性食安風險。</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 bg-emerald-950/50 border border-emerald-900/50 text-emerald-400 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">✅</span>
                <span><strong className="text-blue-300">要認明第三方安全標章：</strong>優先挑選具備 CAS、CNS、SGS 或頂級 <strong>SQF 國際食品安全品質認證</strong>。</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 bg-emerald-950/50 border border-emerald-900/50 text-emerald-400 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">✅</span>
                <span><strong className="text-blue-300">要上網查閱批號合格證明：</strong>合規油脂大廠會於官方安心履歷專區，主動出具每批油脂的苯駢芘、重金屬合格報告書。</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
