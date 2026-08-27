"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowLeft, Sparkles } from "lucide-react";
import { getAppUrl } from "@/lib/config";

const navLinks = [
  { label: "الرئيسية", href: "/" },
  { label: "المميزات", href: "#features" },
  { label: "حاسبة التوفير", href: "#roi-calculator" },
  { label: "كيف يعمل", href: "#how-it-works" },
  { label: "التكاملات", href: "#integrations" },
  { label: "الأسعار", href: "#pricing" },
  { label: "الأسئلة الشائعة", href: "#faq" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "py-3 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-sm shadow-blue-900/5"
          : "py-5 bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 relative flex-shrink-0 rounded-xl bg-white p-1 border border-slate-200 group-hover:border-[#3B4FE8]/50 transition-all duration-300 shadow-sm">
              <Image
                src="/logo.png"
                alt="Ecomate Logo"
                fill
                className="object-contain p-0.5"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-slate-950 font-black text-xl tracking-tight flex items-center gap-1.5 font-sans">
                <span>ECOM</span>
                <span className="text-[#3B4FE8]">ATE</span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#3B4FE8] bg-blue-50 px-1.5 py-0.5 rounded-md border border-blue-200">
                  AI
                </span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium -mt-0.5">
                المساعد الذكي لمتاجر سلة
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1 bg-white/90 border border-slate-200 px-3.5 py-1.5 rounded-full shadow-sm">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-slate-600 hover:text-[#3B4FE8] px-3.5 py-1.5 rounded-full text-xs font-bold transition-all hover:bg-blue-50"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={getAppUrl("/login")}
              className="text-slate-700 hover:text-[#3B4FE8] text-xs font-bold px-4 py-2.5 rounded-xl transition-colors hover:bg-slate-100"
            >
              تسجيل الدخول
            </a>
            <a
              href={getAppUrl("/register")}
              className="relative group overflow-hidden bg-[#3B4FE8] hover:bg-[#0040CC] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 shadow-md shadow-[#3B4FE8]/20 hover:shadow-lg hover:shadow-[#3B4FE8]/30 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
            >
              <span>جرّب مجاناً 14 يوم</span>
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-slate-700 p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
            aria-label={isOpen ? "إغلاق القائمة" : "فتح القائمة"}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className="lg:hidden mt-4 bg-white/95 border border-slate-200 rounded-2xl p-5 shadow-xl backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col space-y-1 pb-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-slate-700 hover:text-[#3B4FE8] px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors hover:bg-blue-50 flex items-center justify-between"
                >
                  <span>{link.label}</span>
                  <span className="text-slate-400 text-xs">←</span>
                </a>
              ))}
            </div>
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
              <a
                href={getAppUrl("/login")}
                className="w-full text-center text-slate-700 hover:text-[#3B4FE8] py-2.5 text-sm font-bold rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                تسجيل الدخول إلى لوحة التحكم
              </a>
              <a
                href={getAppUrl("/register")}
                className="w-full text-center bg-[#3B4FE8] text-white py-3 rounded-xl text-sm font-bold shadow-md shadow-[#3B4FE8]/25 transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Sparkles size={16} />
                <span>ابدأ تجربتك المجانية (14 يوم)</span>
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
