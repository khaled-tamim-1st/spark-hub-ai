"use client";

import { useState } from "react";
import { Calculator, Clock, DollarSign, TrendingUp, ArrowLeft } from "lucide-react";
import { getAppUrl } from "@/lib/config";

export default function RoiCalculator() {
  const [conversations, setConversations] = useState(2500);

  // Business Math assumptions for Saudi e-commerce:
  const agentsSaved = (conversations / 1200).toFixed(1);
  const moneySaved = Math.round(Number(agentsSaved) * 4000);
  const hoursSaved = Math.round((conversations * 4) / 60);

  return (
    <section id="roi-calculator" className="py-24 bg-slate-50/70 border-y border-slate-200 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-[#0052FF] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Calculator size={14} />
            <span>حاسبة العائد على الاستثمار (ROI)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 mb-4">
            احسب كم ستوفر شهرياً مع Ecomate
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-medium">
            حرّك المؤشر وحدد عدد المحادثات أو الطلبات التي يستقبلها متجرك شهرياً لرؤية التوفير الفوري.
          </p>
        </div>

        {/* Interactive Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl shadow-blue-900/5">
          
          {/* Slider Control */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-4">
              <label htmlFor="conv-slider" className="text-sm sm:text-base font-bold text-slate-900">
                عدد المحادثات الشهرية المقدرة لمتجرك:
              </label>
              <div className="bg-blue-50 border border-blue-200 text-[#0052FF] font-black text-lg sm:text-xl px-4 py-1.5 rounded-2xl shadow-sm">
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
              className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0052FF]"
            />
            
            <div className="flex justify-between text-xs text-slate-500 font-semibold mt-2">
              <span>300 محادثة (متجر مبتدئ)</span>
              <span>7,500 محادثة (متجر متوسط)</span>
              <span>15,000+ محادثة (براند كبير)</span>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            
            {/* Money Saved */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                <DollarSign size={20} />
              </div>
              <span className="text-slate-500 text-xs block mb-1 font-semibold">توفير تكاليف توظيف</span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-600">
                {moneySaved.toLocaleString("ar-SA")} ر.س
              </span>
              <span className="text-[11px] text-slate-400 block mt-1 font-medium">شهرياً في المتوسط</span>
            </div>

            {/* Hours Saved */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0052FF] flex items-center justify-center mx-auto mb-3">
                <Clock size={20} />
              </div>
              <span className="text-slate-500 text-xs block mb-1 font-semibold">ساعات عمل موفرة</span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900">
                {hoursSaved.toLocaleString("ar-SA")} ساعة
              </span>
              <span className="text-[11px] text-[#0052FF] block mt-1 font-bold">تتفرغ فيها للتسويق والنمو</span>
            </div>

            {/* Speed & Resolution */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3">
                <TrendingUp size={20} />
              </div>
              <span className="text-slate-500 text-xs block mb-1 font-semibold">سرعة الرد التلقائي</span>
              <span className="text-2xl sm:text-3xl font-black text-amber-600">
                1.2 ثانية
              </span>
              <span className="text-[11px] text-slate-400 block mt-1 font-medium">مقارنة بـ 45 دقيقة للموظف</span>
            </div>

          </div>

          {/* CTA Box */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-right">
              <p className="text-slate-950 font-bold text-sm">
                ابدأ بتوفير وقتك وفلوسك من اليوم — تجربة مجانية 14 يوم
              </p>
              <p className="text-slate-500 text-xs mt-0.5 font-medium">
                تفعيل فوري مع سلة خلال أقل من 5 دقائق بدون أي عقود
              </p>
            </div>

            <a
              href={getAppUrl("/register")}
              className="inline-flex items-center gap-2 bg-[#0052FF] hover:bg-[#0040CC] text-white px-7 py-3 rounded-xl text-sm font-bold shadow-md shadow-[#0052FF]/20 transition-all hover:scale-105"
            >
              <span>جرّب Ecomate مجاناً الآن</span>
              <ArrowLeft size={16} />
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
