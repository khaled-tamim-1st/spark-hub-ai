"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown, HelpCircle, MessageCircle } from "lucide-react";

const categories = [
  { id: "all", label: "جميع الأسئلة" },
  { id: "salla", label: "سلة والشحن" },
  { id: "ai", label: "الذكاء الاصطناعي" },
  { id: "billing", label: "الأسعار والتجربة" },
];

const faqs = [
  {
    category: "salla",
    q: "كيف يتصل Ecomate بمتجري على سلة؟",
    a: "الربط يتم بخطوات بسيطة جداً عبر تطبيق سلة الرسمي أو باستخدام مفتاح API. بعد الربط، يقوم Ecomate بسحب وتحديث بيانات الطلبات والمخزون وحالة الشحن من شركات (سمسا، أرامكس، أوتو) بشكل لحظي وتلقائي.",
  },
  {
    category: "ai",
    q: "هل يضمن Ecomate عدم (الهلوسة) أو اختراع أسعار ومعلومات خاطئة؟",
    a: "نعم 100%. تم تصميم وتدريب محرك Ecomate بتقنية Grounded Retrieval الصارمة؛ حيث يلتزم الذكاء الاصطناعي فقط بالمعلومات الموجودة في قاعدة معرفة متجرك وسلة، وفي حال عدم توفر المعلومة يعتذر للعميل ويحوّل المحادثة فورياً لموظف بشري.",
  },
  {
    category: "salla",
    q: "هل يستطيع العميل تتبع شحنته مباشرة عبر الواتساب؟",
    a: "نعم! بمجرد أن يرسل العميل رقم طلبه أو رقم جواله، يتعرف Ecomate على الطلب ويستعلم عن بوليصة الشحن لدى شركة الشحن المعنية ويرسل له تقريراً مفصلاً مع رابط التتبع ورقم البوليصة وتاريخ الوصول المتوقع.",
  },
  {
    category: "billing",
    q: "هل أحتاج لإدخال بطاقة ائتمانية لبدء التجربة المجانية؟",
    a: "لا، التجربة المجانية لمدة 30 يوماً مجانية بالكامل وبدون أي بطاقة ائتمانية. يمكنك التسجيل وربط متجرك فوراً وتجربة كل المميزات.",
  },
  {
    category: "ai",
    q: "هل يمكنني التدخل والرد على العميل بنفسي أثناء محادثة Ecomate؟",
    a: "بالتأكيد. توفر لوحة تحكم Ecomate صندوق وارد تفاعلي يمكنك من خلاله رؤية جميع المحادثات الحية، والتدخل في أي محادثة وإيقاف الرد الآلي بنقرة زر واحدة متى ما رغبت.",
  },
  {
    category: "billing",
    q: "ماذا يحدث إذا تجاوزت عدد المحادثات الشهري المخصص للباقة؟",
    a: "سنرسل لك تنبيهاً قبل نفاد باقتك. يمكنك ترقية باقتك بسهولة أو شراء باقة محادثات إضافية بأسعار رمزية بدون أي انقطاع في الخدمة.",
  },
];

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = activeCategory === "all"
    ? faqs
    : faqs.filter((f) => f.category === activeCategory);

  return (
    <section id="faq" className="py-28 bg-slate-50/70 border-t border-slate-200 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-[#3B4FE8] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <HelpCircle size={14} />
            <span>إجابات واضحة ومباشرة</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 leading-tight mb-4">
            الأسئلة الأكثر شيوعاً حول Ecomate
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-medium">
            كل ما يدور في ذهنك حول عمل Ecomate وتكامله مع متجرك على سلة
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setOpenIndex(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeCategory === cat.id
                  ? "bg-[#3B4FE8] text-white shadow-md shadow-[#3B4FE8]/20"
                  : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={faq.q}
                className="bg-white rounded-2xl border border-slate-200 hover:border-blue-200 overflow-hidden transition-all duration-200 shadow-sm"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full p-5 text-right flex items-center justify-between gap-4 select-none hover:bg-slate-50/70"
                  aria-expanded={isOpen}
                >
                  <span className={`text-sm sm:text-base font-bold transition-colors ${isOpen ? "text-[#3B4FE8]" : "text-slate-900"}`}>
                    {faq.q}
                  </span>
                  <div className={`w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 bg-blue-50 text-[#3B4FE8]" : "text-slate-400"}`}>
                    <ChevronDown size={18} />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 font-medium">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Still have questions card */}
        <div className="mt-12 text-center bg-white border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="text-center sm:text-right">
            <p className="text-slate-950 font-bold text-sm">
              لديك استفسار خاص بمتجرك لم تجد إجابته هنا؟
            </p>
            <p className="text-slate-500 text-xs mt-0.5 font-medium">
              فريق خدمة العملاء لدينا متاح لمساعدتك والإجابة على كل أسئلتك.
            </p>
          </div>
          <a
            href="mailto:hello@ecomate.ai"
            className="inline-flex items-center gap-2 bg-slate-100 hover:bg-blue-50 text-[#3B4FE8] px-5 py-2.5 rounded-xl text-xs font-bold transition-colors border border-slate-200"
          >
            <MessageCircle size={15} />
            <span>تواصل مع الدعم الفني</span>
          </a>
        </div>

      </div>
    </section>
  );
}
