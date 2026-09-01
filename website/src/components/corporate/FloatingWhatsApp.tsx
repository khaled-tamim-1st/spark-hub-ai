"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingWhatsApp() {
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const whatsappUrl =
    "https://wa.me/966500000000?text=" +
    encodeURIComponent("مرحباً فريق ECOMATE، أود الاستفسار عن حلول نمو الأعمال لمنشأتي.");

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-end gap-3 font-sans" dir="rtl">
      {/* Tooltip Message */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="hidden sm:flex items-center gap-2.5 bg-white border border-slate-200 text-slate-800 px-4 py-2.5 rounded-2xl shadow-xl text-xs font-bold relative"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>تحدث مباشرة مع مستشار ECOMATE</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(false);
              }}
              className="text-slate-400 hover:text-slate-600 mr-1 p-0.5 rounded-md"
              aria-label="إغلاق"
            >
              <X size={13} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-2xl shadow-lg shadow-[#25D366]/30 flex items-center justify-center transition-all hover:scale-110 active:scale-95 group relative"
        aria-label="تواصل عبر واتساب للأعمال"
      >
        <MessageCircle size={28} className="fill-current" />
        <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full" />
      </a>
    </div>
  );
}
