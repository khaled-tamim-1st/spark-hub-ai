"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "هل سند يدعم اللغة العربية بشكل كامل؟",
    a: "نعم، سند مصمم أساساً للسوق السعودي والخليجي، ويتحدث العربية بطلاقة مع فهم عميق للسياق المحلي وأسلوب التخاطب مع العملاء السعوديين.",
  },
  {
    q: "كيف يتصل سند بمتجري على سلة؟",
    a: "عبر ربط API سلة الرسمي بخطوتين بسيطتين من لوحة تحكم سند. بعد الربط، يتزامن سند مع طلباتك ومنتجاتك وحالة الشحن فورياً وبشكل تلقائي.",
  },
  {
    q: "هل الردود التلقائية دقيقة ولا تخترع معلومات؟",
    a: "نعم 100%. سند يعتمد فقط على قاعدة المعرفة التي تحددها أنت، ولا يخترع منتجات أو أسعار أو معلومات من تلقاء نفسه. إذا لم يعرف الإجابة، يحوّل المحادثة لك مباشرة.",
  },
  {
    q: "كم يستغرق الإعداد؟",
    a: "إعداد سند لا يتجاوز 15 دقيقة بالكامل — ربط سلة، إضافة واتساب، ورفع قاعدة المعرفة. لا تحتاج أي خبرة تقنية على الإطلاق.",
  },
  {
    q: "هل يمكنني رؤية المحادثات التي ردّ عليها سند؟",
    a: "بالطبع. لوحة تحكم سند تعرض كل المحادثات وردودها بشكل مفصل. يمكنك التدخل في أي محادثة وتعديل ردود سند ومراقعة الأداء من خلال التقارير.",
  },
  {
    q: "ماذا يحدث إذا لم يعرف سند الإجابة؟",
    a: "سند يُخبر العميل بشكل لطيف أنه سيحوّله للفريق، ثم يرسل لك إشعاراً فورياً بالمحادثة حتى تتولاها بنفسك — لا يترك عميلاً بدون رد أبداً.",
  },
];

function FAQItem({ q, a, isOpen, onClick }: { q: string; a: string; isOpen: boolean; onClick: () => void }) {
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between gap-4 py-5 text-right"
        aria-expanded={isOpen}
      >
        <span className={`font-semibold text-base transition-colors ${isOpen ? "text-[#6B00FF]" : "text-gray-900"}`}>
          {q}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown size={20} className={isOpen ? "text-[#6B00FF]" : "text-gray-400"} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="text-gray-500 text-sm leading-relaxed pb-5">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-[#6B00FF] font-semibold text-sm uppercase tracking-wider mb-3"
          >
            أسئلة شائعة
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold text-gray-900"
          >
            كل ما تريد معرفته عن سند
          </motion.h2>
        </div>

        {/* Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-gray-100 rounded-2xl shadow-sm px-6"
        >
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              q={faq.q}
              a={faq.a}
              isOpen={openIndex === i}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </motion.div>

        {/* Extra CTA */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-gray-500 text-sm mt-8"
        >
          لديك سؤال آخر؟{" "}
          <a href="mailto:hello@sanadai.com" className="text-[#6B00FF] font-semibold hover:underline">
            تواصل مع فريقنا
          </a>
        </motion.p>
      </div>
    </section>
  );
}
