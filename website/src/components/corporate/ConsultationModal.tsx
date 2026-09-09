"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Send, CheckCircle } from "lucide-react";

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: "en" | "ar";
}

const labels = {
  en: {
    title: "Start a Conversation",
    subtitle: "Tell us about your challenge. We'll figure out the right approach together.",
    name: "Full Name",
    email: "Email",
    company: "Company",
    role: "Your Role",
    interest: "What are you looking to do?",
    interests: [
      "Build or evolve a brand",
      "Grow our market",
      "Launch something new",
      "Improve customer experience",
      "Build digital platform",
      "Automate operations",
      "Strategic consulting",
      "Other",
    ],
    message: "Tell us about your challenge",
    submit: "Send Message",
    success: "Thank you! We'll be in touch soon.",
    close: "Close",
  },
  ar: {
    title: "ابدأ محادثة",
    subtitle: "أخبرنا عن تحديك. سنحدد معاً النهج المناسب.",
    name: "الاسم الكامل",
    email: "البريد الإلكتروني",
    company: "الشركة",
    role: "دورك",
    interest: "ما الذي تتطلع لتحقيقه؟",
    interests: [
      "بناء أو تطوير علامة تجارية",
      "تنمية السوق",
      "إطلاق شيء جديد",
      "تحسين تجربة العملاء",
      "بناء منصة رقمية",
      "أتمتة العمليات",
      "استشارات استراتيجية",
      "أخرى",
    ],
    message: "أخبرنا عن تحديك",
    submit: "أرسل الرسالة",
    success: "شكراً! سنتواصل معك قريباً.",
    close: "إغلاق",
  },
};

export default function ConsultationModal({ isOpen, onClose, locale }: ConsultationModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [selectedInterest, setSelectedInterest] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);
  const t = labels[locale];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setSubmitted(false);
      setSelectedInterest("");
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Trap focus and handle escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-[#0B0F19]/70 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label={t.title}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{t.title}</h2>
                <p className="text-sm text-slate-500 mt-1">{t.subtitle}</p>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors focus-ring cursor-pointer"
                aria-label={t.close}
              >
                <X size={18} />
              </button>
            </div>

            {submitted ? (
              /* Success State */
              <div className="px-6 py-16 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.5 }}
                >
                  <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                </motion.div>
                <p className="text-lg font-semibold text-slate-900">{t.success}</p>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                {/* Name + Company row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">{t.name}</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-[#0454FF] focus:ring-1 focus:ring-[#0454FF]/20 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">{t.company}</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-[#0454FF] focus:ring-1 focus:ring-[#0454FF]/20 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Email + Role row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">{t.email}</label>
                    <input
                      type="email"
                      required
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-[#0454FF] focus:ring-1 focus:ring-[#0454FF]/20 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">{t.role}</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-[#0454FF] focus:ring-1 focus:ring-[#0454FF]/20 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Interest */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2">{t.interest}</label>
                  <div className="flex flex-wrap gap-2">
                    {t.interests.map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => setSelectedInterest(interest)}
                        className={`px-3 py-1.5 text-xs rounded-full border transition-all cursor-pointer ${
                          selectedInterest === interest
                            ? "bg-[#0454FF] text-white border-[#0454FF]"
                            : "border-slate-200 text-slate-600 hover:border-[#0454FF]/30 hover:bg-slate-50"
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">{t.message}</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-[#0454FF] focus:ring-1 focus:ring-[#0454FF]/20 outline-none transition-all resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full bg-[#0454FF] hover:bg-[#003ECC] text-white py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>{t.submit}</span>
                  <Send size={14} className="group-hover:translate-x-0.5 transition-transform rtl-flip" />
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
