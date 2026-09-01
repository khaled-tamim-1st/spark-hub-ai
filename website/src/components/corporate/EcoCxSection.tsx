"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Layers,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Building,
  Users2,
  LineChart,
} from "lucide-react";

export default function EcoCxSection() {
  const [brandName, setBrandName] = useState("");
  const [contact, setContact] = useState("");
  const [branches, setBranches] = useState("1-2");
  const [registered, setRegistered] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim()) return;

    const text = encodeURIComponent(
      `مرحباً فريق ECOMATE،\nأود التسجيل في برنامج المعاينة المبكرة لمنصة ECO CX:\n- اسم البراند/المنشأة: ${brandName || 'لم يُحدد'}\n- عدد الفروع: ${branches}\n- وسيلة التواصل: ${contact}`
    );
    window.open(`https://wa.me/966500000000?text=${text}`, '_blank');
    setRegistered(true);
  };

  return (
    <section id="eco-cx" className="py-24 bg-white relative overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Main Distinct Banner Box with Clear Architectural Separation */}
        <div className="relative rounded-3xl bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-slate-50 border border-[#0454FF]/25 p-8 sm:p-14 shadow-lg overflow-hidden">
          
          {/* Ambient Lighting */}
          <div className="absolute -top-32 right-1/4 w-96 h-96 bg-[#0454FF]/10 rounded-full blur-[110px] pointer-events-none" />
          <div className="absolute -bottom-32 left-1/4 w-80 h-80 bg-[#5B8EFF]/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-right">
              
              {/* Development Status Badges */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 bg-[#0454FF] text-white px-3.5 py-1 rounded-full text-xs font-bold shadow-xs">
                  <Sparkles size={13} />
                  <span>المبادرات الرقمية القادمة</span>
                </span>
                <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold">
                  <Lock size={12} />
                  <span>قيد التطوير • وصول مبكر (Early Access)</span>
                </span>
              </div>

              {/* Title */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 leading-tight">
                منصة ECO CX: نحو إدارة مركزية لتجربة وعلاقات العملاء
              </h2>

              {/* Paragraph */}
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-medium">
                نعمل في ECOMATE على تطوير منصة <strong className="text-slate-950 font-bold">ECO CX</strong> كمنظومة برمجية متقدمة تمكّن الشركات والبراندات متعددة الفروع من توحيد قنوات خدمة العملاء، ومتابعة سجلات التفاعل، وتحليل مؤشرات الرضا عبر لوحة تحكم مركزية شاملة.
              </p>

              {/* Core Pillars of the Upcoming Platform */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-white/95 border border-slate-200 rounded-2xl p-4 shadow-xs">
                  <Building size={20} className="text-[#0454FF] mb-2" />
                  <h4 className="text-xs font-black text-slate-900 mb-1">إدارة مركزية للفروع</h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                    متابعة موحدة لنقاط الخدمة والمحادثات لجميع الفروع.
                  </p>
                </div>

                <div className="bg-white/95 border border-slate-200 rounded-2xl p-4 shadow-xs">
                  <Users2 size={20} className="text-[#0454FF] mb-2" />
                  <h4 className="text-xs font-black text-slate-900 mb-1">ملف العميل الموحد</h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                    توثيق تفضيلات العميل وسجل زياراته لتقديم تجربة شخصية.
                  </p>
                </div>

                <div className="bg-white/95 border border-slate-200 rounded-2xl p-4 shadow-xs">
                  <LineChart size={20} className="text-[#0454FF] mb-2" />
                  <h4 className="text-xs font-black text-slate-900 mb-1">تحليل مؤشرات الجودة</h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                    تقارير دورية لقياس سرعة الاستجابة ومستوى رضا العملاء.
                  </p>
                </div>
              </div>

            </div>

            {/* Right Column: Early Access Waitlist Registration */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl text-right">
                
                {!registered ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="mb-4">
                      <span className="text-xs font-bold text-[#0454FF] bg-blue-50 border border-blue-100 px-3 py-1 rounded-full inline-block mb-2">
                        برنامج المعاينة والتجربة المبكرة
                      </span>
                      <h3 className="text-xl font-black text-slate-950">
                        التسجيل في قائمة الاهتمام
                      </h3>
                      <p className="text-slate-500 text-xs font-medium mt-1">
                        سجّل بيانات نشاطك ليصلك إشعار ودعوة معاينة تجريبية فور إطلاق المرحلة التجريبية للمنصة.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        اسم البراند أو المنشأة
                      </label>
                      <input
                        type="text"
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        placeholder="مثال: مطعم سحاب / عيادات د. سارة"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-[#0454FF] focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        البريد الإلكتروني أو رقم التواصل *
                      </label>
                      <input
                        type="text"
                        required
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder="05xxxxxxxx أو contact@brand.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-[#0454FF] focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        عدد الفروع الحالية
                      </label>
                      <select
                        value={branches}
                        onChange={(e) => setBranches(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-[#0454FF] focus:bg-white transition-all"
                      >
                        <option value="1">فرع واحد</option>
                        <option value="2-3">من فرعين إلى 3 فروع</option>
                        <option value="4+">4 فروع فأكثر</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#0454FF] hover:bg-[#0047E0] text-white py-3.5 px-6 rounded-xl font-bold text-sm shadow-md shadow-[#0454FF]/20 hover:scale-102 transition-all flex items-center justify-center gap-2 group mt-2"
                    >
                      <span>تأكيد التسجيل في قائمة الاهتمام</span>
                      <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                  </form>
                ) : (
                  <div className="py-6 text-center">
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 border border-emerald-100">
                      <CheckCircle2 size={28} />
                    </div>
                    <h4 className="text-xl font-black text-slate-950 mb-2">
                      تم تسجيل اهتمامك بنجاح
                    </h4>
                    <p className="text-slate-600 text-xs font-medium leading-relaxed mb-4">
                      سنقوم بإرسال تفاصيل ودعوة الانضمام للمرحلة التجريبية لمنصة ECO CX فور تدشينها لقطاعك.
                    </p>
                    <button
                      onClick={() => setRegistered(false)}
                      className="text-xs font-bold text-[#0454FF] hover:underline"
                    >
                      تسجيل براند آخر
                    </button>
                  </div>
                )}

              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
