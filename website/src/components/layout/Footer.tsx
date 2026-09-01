"use client";

import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Sparkles, Heart } from "lucide-react";

const footerNavigation = {
  pillars: [
    { name: "1. البراندنج والهوية البصرية", href: "/#growth-journey" },
    { name: "2. التسويق والنمو المحلي", href: "/#growth-journey" },
    { name: "3. الحلول التقنية والأنظمة", href: "/#growth-journey" },
    { name: "4. الأتمتة وردود الواتساب", href: "/#growth-journey" },
  ],
  sectors: [
    { name: "مطاعم وسلاسل مطاعم 🍽️", href: "/#sectors" },
    { name: "عيادات ومراكز طبية 🩺", href: "/#sectors" },
    { name: "صالونات ومراكز عناية ✂️", href: "/#sectors" },
    { name: "منصة ECO CX (قريباً)", href: "/#eco-cx" },
  ],
  company: [
    { name: "الرئيسية", href: "/" },
    { name: "رحلة نمو البراندات", href: "/#growth-journey" },
    { name: "المدونة والمعرفة", href: "/blog" },
    { name: "احجز مكالمتك المجانية", href: "/#contact" },
  ],
  legal: [
    { name: "شروط الاستخدام", href: "#" },
    { name: "سياسة الخصوصية", href: "#" },
    { name: "أمان وحماية البيانات", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#0D0E1F] border-t border-slate-800 text-slate-300 pt-16 pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="md:col-span-2 text-right">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 relative flex-shrink-0 rounded-xl bg-white p-1 shadow-sm">
                <Image
                  src="/logo.png?v=3"
                  alt="ECOMATE Logo"
                  width={40}
                  height={40}
                  className="object-contain"
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
              شريكك في بناء هوية براندك، الوصول للعملاء الصح، وبناء الأدوات والأتمتة اللي تخليهم يرجعوا لك كل يوم.
            </p>

            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 bg-slate-800/80 border border-slate-700 px-3.5 py-1.5 rounded-xl text-xs text-slate-300 font-bold">
              <Sparkles size={14} className="text-[#5B8EFF]" />
              <span>حلول شاملة للبراندات والأعمال المحلية في السوق السعودي</span>
            </div>
          </div>

          {/* Pillars Column */}
          <div className="text-right">
            <h4 className="text-white font-bold text-sm mb-4">أركان النمو الأربعة</h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-semibold">
              {footerNavigation.pillars.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sectors Column */}
          <div className="text-right">
            <h4 className="text-white font-bold text-sm mb-4">قطاعات الأعمال</h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-semibold">
              {footerNavigation.sectors.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-[#7B8FFF] transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div className="text-right">
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
