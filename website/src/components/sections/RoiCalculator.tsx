"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, Clock, DollarSign, TrendingUp, Sparkles, ArrowLeft } from "lucide-react";
import { getAppUrl } from "@/lib/config";

export default function RoiCalculator() {
  const [conversations, setConversations] = useState(2500);

  // Business Math assumptions for Saudi e-commerce:
  // 1 support agent handles ~1,200 conversations/month at ~4,000 SAR salary
  const agentsSaved = (conversations / 1200).toFixed(1);
  const moneySaved = Math.round(Number(agentsSaved) * 4000);
  const hoursSaved = Math.round((conversations * 4) / 60); // 4 minutes per ticket average

  return (
    <section id="roi-calculator" className="py-24 bg-[#0B0B14] border-y border-white/5 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-[#6B00FF]/15 border border-[#6B00FF]/30 text-[#C499FF] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            <Calculator size={14} />
            <span>حاسبة العائد على الاستثمار (ROI)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            احسب كم ستوفر شهرياً مع سند
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            حرّك المؤشر وحدد عدد المحادثات أو الطلبات التي يستقبلها متجرك شهرياً لرؤية التوفير الفوري.
          </p>
        </div>

        {/* Interactive Box */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-[#6B00FF]/30 shadow-2xl">
          
          {/* Slider Control */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-4">
              <label htmlFor="conv-slider" className="text-sm sm:text-base font-bold text-white">
                عدد المحادثات الشهرية المقدرة لمتجرك:
              </label>
              <div className="bg-[#6B00FF]/25 border border-[#9B59FF]/50 text-white font-black text-lg sm:text-xl px-4 py-1.5 rounded-2xl">
                {conversations.toLocaleString("ar-SA")} محادثة
              </div>
            </div>
            
            <input
              id="conv-slider"
              type="range"
              min="300"
              max="15000"
              step="100"
              value={conversations}
              onChange={(e) => setConversations(Number(e.target.value))}
              className="w-full h-3 bg-[#1A1A2E] rounded-lg appearance-none cursor-pointer accent-[#9B59FF]"
            />
            
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>300 محادثة (متجر مبتدئ)</span>
              <span>7,500 محادثة (متجر متوسط)</span>
              <span>15,000+ محادثة (براند كبير)</span>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            
            {/* Money Saved */}
            <div className="bg-[#141422] border border-white/5 rounded-2xl p-5 text-center">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                <DollarSign size={20} />
              </div>
              <span className="text-gray-400 text-xs block mb-1">توفير تكاليف توظيف</span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                {moneySaved.toLocaleString("ar-SA")} ر.س
              </span>
              <span className="text-[11px] text-gray-500 block mt-1">شهرياً في المتوسط</span>
            </div>

            {/* Hours Saved */}
            <div className="bg-[#141422] border border-white/5 rounded-2xl p-5 text-center">
              <div className="w-10 h-10 rounded-xl bg-[#6B00FF]/20 text-[#C499FF] flex items-center justify-center mx-auto mb-3">
                <Clock size={20} />
              </div>
              <span className="text-gray-400 text-xs block mb-1">ساعات عمل موفرة</span>
              <span className="text-2xl sm:text-3xl font-black text-white">
                {hoursSaved.toLocaleString("ar-SA")} ساعة
              </span>
              <span className="text-[11px] text-gray-500 block mt-1">تتفرغ فيها للتسويق والنمو</span>
            </div>

            {/* Speed & Resolution */}
            <div className="bg-[#141422] border border-white/5 rounded-2xl p-5 text-center">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center mx-auto mb-3">
                <TrendingUp size={20} />
              </div>
              <span className="text-gray-400 text-xs block mb-1">سرعة الرد التلقائي</span>
              <span className="text-2xl sm:text-3xl font-black text-amber-400">
                1.2 ثانية
              </span>
              <span className="text-[11px] text-gray-500 block mt-1">مقارنة بـ 45 دقيقة للموظف</span>
            </div>

          </div>

          {/* CTA Box */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-right">
              <p className="text-white font-bold text-sm">
                ابدأ بتوفير وقتك وفلوسك من اليوم — تجربة مجانية 14 يوم
              </p>
              <p className="text-gray-400 text-xs mt-0.5">
                تفعيل فوري مع سلة خلال أقل من 5 دقائق بدون أي عقود
              </p>
            </div>

            <a
              href={getAppUrl("/register")}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#6B00FF] to-[#9B59FF] hover:from-[#5800D9] hover:to-[#8B33FF] text-white px-7 py-3 rounded-xl text-sm font-bold shadow-lg shadow-[#6B00FF]/30 transition-all hover:scale-105"
            >
              <span>جرّب سند مجاناً الآن</span>
              <ArrowLeft size={16} />
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
