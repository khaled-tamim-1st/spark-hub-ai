"use client";

import Link from "next/link";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";

const footerNavigation = {
  solutions: [
    { name: "أتمتة العمليات والمهام", href: "/#services" },
    { name: "إدارة وتجربة العملاء (CRM)", href: "/#services" },
    { name: "تحليل البيانات والتقارير", href: "/#services" },
    { name: "تطوير حلول برمجية مخصصة", href: "/#services" },
  ],
  products: [
    { name: "المساعد الذكي للمتاجر 🚀", href: "/assistant" },
    { name: "محاكي واتساب التفاعلي", href: "/assistant" },
    { name: "حاسبة التوفير والعائد (ROI)", href: "/assistant#roi-calculator" },
    { name: "باقات وأسعار المساعد", href: "/pricing" },
  ],
  company: [
    { name: "عن ECOMATE", href: "/" },
    { name: "خدماتنا وحلولنا", href: "/#services" },
    { name: "المدونة والمعرفة", href: "/blog" },
    { name: "تواصل معنا", href: "mailto:hello@ecomate.ai" },
  ],
  legal: [
    { name: "شروط الاستخدام", href: "#" },
    { name: "سياسة الخصوصية", href: "#" },
    { name: "أمان وحماية البيانات", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#0D0E1F] border-t border-slate-800 text-slate-300 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 relative flex-shrink-0 rounded-xl bg-white p-1 shadow-sm">
                <Image
                  src="/logo.png?v=2"
                  alt="ECOMATE Logo"
                  width={40}
                  height={40}
                  className="object-contain p-0.5"
                  unoptimized
                />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-black text-2xl tracking-tight font-sans flex items-center" dir="ltr">
                  <span>ECOM</span>
                  <span className="text-[#7B8FFF]">ATE</span>
                </span>
                <span className="text-[10px] text-slate-400 font-bold -mt-0.5">
                  حلول الأعمال والمنتجات الرقمية
                </span>
              </div>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-sm font-medium">
              حلول رقمية وأتمتة ذكية تساعد أعمالك على العمل بكفاءة أعلى، وخدمة عملائها بشكل أفضل، والنمو باستدامة.
            </p>

            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 bg-slate-800/80 border border-slate-700 px-3.5 py-1.5 rounded-xl text-xs text-slate-300 font-bold">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>حلول رقمية وأتمتة ذكية مدعومة بالذكاء الاصطناعي</span>
            </div>
          </div>

          {/* Solutions Column */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">حلول الأعمال</h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-semibold">
              {footerNavigation.solutions.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products Column */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">المنتجات الرقمية</h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-semibold">
              {footerNavigation.products.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-[#7B8FFF] transition-colors flex items-center gap-1">
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">الشركة والمعرفة</h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-semibold">
              {footerNavigation.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <p>© {new Date().getFullYear()} ECOMATE. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-6">
            {footerNavigation.legal.map((item) => (
              <a key={item.name} href={item.href} className="hover:text-slate-400 transition-colors">
                {item.name}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
