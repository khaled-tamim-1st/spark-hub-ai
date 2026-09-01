"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Phone, Building2, User, Sparkles, ArrowLeft } from "lucide-react";

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const sectors = [
  { id: "restaurant", label: "مطعم / كافيه 🍽️" },
  { id: "clinic", label: "عيادة / مركز طبي 🩺" },
  { id: "salon", label: "صالون / مركز عناية ✂️" },
  { id: "brand", label: "براند منتجات محلية 🛍️" },
  { id: "other", label: "نشاط تجاري آخر 🏢" },
];

export default function ConsultationModal({ isOpen, onClose }: ConsultationModalProps) {
  const [name, setName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [phone, setPhone] = useState("");
  const [sector, setSector] = useState("restaurant");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const sectorLabel = sectors.find(s => s.id === sector)?.label || sector;
    const text = encodeURIComponent(
      `مرحباً فريق ECOMATE،\nأود طلب جلسة استشارية أولية لبحث حلول الأعمال:\n- الاسم: ${name}\n- اسم البراند/النشاط: ${brandName || 'لم يُحدد'}\n- نوع النشاط: ${sectorLabel}\n- وسيلة التواصل: ${phone}`
    );
    
    window.open(`https://wa.me/966500000000?text=${text}`, '_blank');
    setSubmitted(true);
  };

  const handleReset = () => {
    setName("");
    setBrandName("");
    setPhone("");
    setSector("restaurant");
    setSubmitted(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 overflow-hidden z-10 text-right"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 left-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
              aria-label="إغلاق"
            >
              <X size={18} />
            </button>

            {!submitted ? (
              <div>
                {/* Header */}
                <div className="mb-6">
                  <div className="inline-flex items-center gap-1.5 bg-blue-50 text-[#0454FF] border border-blue-100 text-xs font-bold px-3 py-1 rounded-full mb-3">
                    <Sparkles size={13} />
                    <span>جلسة استشارية أولية متخصصة</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-950 mb-2">
                    مناقشة متطلبات وأولويات براندك
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed">
                    جلسة مباشرة مع مستشاري ECOMATE لدراسة واقع فروعك وحضورك الرقمي وتحديد مسار العمل والحلول الأنسب لنشاطك.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      الاسم الكريم *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="الاسم الكامل"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-[#0454FF] focus:bg-white transition-all pl-9"
                      />
                      <User size={16} className="absolute left-3 top-3 text-slate-400" />
                    </div>
                  </div>

                  {/* Brand Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      اسم البراند أو المنشأة
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        placeholder="اسم البراند أو المشروع التجاري"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-[#0454FF] focus:bg-white transition-all pl-9"
                      />
                      <Building2 size={16} className="absolute left-3 top-3 text-slate-400" />
                    </div>
                  </div>

                  {/* Phone / WhatsApp */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      رقم الجوال أو الواتساب *
                    </label>
                    <div className="relative" dir="ltr">
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="05xxxxxxxx"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-[#0454FF] focus:bg-white transition-all pl-9 text-left font-mono"
                      />
                      <Phone size={16} className="absolute left-3 top-3 text-slate-400" />
                    </div>
                  </div>

                  {/* Sector Selection */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      نوع النشاط التجاري
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {sectors.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setSector(s.id)}
                          className={`text-xs font-bold py-2 px-2.5 rounded-xl border transition-all text-center truncate ${
                            sector === s.id
                              ? "bg-[#0454FF] text-white border-[#0454FF] shadow-xs"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-3">
                    <button
                      type="submit"
                      className="w-full bg-[#0454FF] hover:bg-[#0047E0] text-white py-3.5 px-6 rounded-xl font-bold text-sm shadow-md shadow-[#0454FF]/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
                    >
                      <span>إرسال طلب الجلسة الاستشارية</span>
                      <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <span className="block text-center text-[11px] text-slate-400 font-medium mt-2">
                      سيتواصل معك فريقنا لتنسيق موعد مناسب ومناقشة تفاصيل نشاطك
                    </span>
                  </div>
                </form>
              </div>
            ) : (
              /* Success Confirmation */
              <div className="py-8 text-center">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                  <CheckCircle2 size={32} />
                </div>
                <h4 className="text-2xl font-black text-slate-950 mb-2">
                  تم استلام طلبك بنجاح
                </h4>
                <p className="text-slate-600 text-sm font-medium leading-relaxed max-w-sm mx-auto mb-6">
                  شكراً لك {name}. سيتواصل معك أحد مستشاري ECOMATE لتنسيق الموعد وبحث متطلبات براندك.
                </p>
                <button
                  onClick={handleReset}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all"
                >
                  إغلاق
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
