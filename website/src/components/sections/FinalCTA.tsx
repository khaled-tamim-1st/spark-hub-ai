"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Shield } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Purple gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#4A00B3] via-[#6B00FF] to-[#9B59FF]" />

      {/* Grid overlay */}
      <div className="absolute inset-0 hero-grid opacity-20" />

      {/* Glow blobs */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#0A0A0F]/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Shield size={16} />
            <span>مجاناً لمدة 14 يوم — بدون بطاقة ائتمانية</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-6">
            هل أنت مستعد لتوفير{" "}
            <span className="text-yellow-300">40+ ساعة</span>{" "}
            عمل كل أسبوع؟
          </h2>

          <p className="text-white/70 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            دع سند يتولى خدمة عملاءك وأنت تركّز على تنمية متجرك.
            إعداد في أقل من 15 دقيقة.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://app.sanadai.com/register"
              className="group inline-flex items-center justify-center gap-2 bg-white text-[#6B00FF] hover:bg-gray-100 px-8 py-4 rounded-xl font-black text-lg transition-all hover:shadow-2xl hover:scale-105 active:scale-95"
            >
              ابدأ الآن مجاناً
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </a>
            <a
              href="mailto:hello@sanadai.com"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/30 hover:border-white/60 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:bg-white/10"
            >
              تحدث مع الفريق
            </a>
          </div>

          <p className="text-white/50 text-sm mt-8">
            +500 متجر على سلة يثق بسند يومياً ✓
          </p>
        </motion.div>
      </div>
    </section>
  );
}
