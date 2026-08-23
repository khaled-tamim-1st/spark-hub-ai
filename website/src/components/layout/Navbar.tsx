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
          ? "py-3 bg-[#07070C]/85 backdrop-blur-xl border-b border-[#6B00FF]/20 shadow-2xl shadow-[#6B00FF]/5"
          : "py-5 bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 relative flex-shrink-0 rounded-xl bg-gradient-to-br from-[#6B00FF]/30 to-[#9B59FF]/10 p-1.5 border border-[#6B00FF]/30 group-hover:border-[#9B59FF]/60 transition-all duration-300 shadow-md shadow-[#6B00FF]/10">
              <Image
                src="/logo.png"
                alt="شعار سند"
                fill
                className="object-contain p-1"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-black text-xl tracking-tight flex items-center gap-1.5">
                سند
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#9B59FF] bg-[#6B00FF]/20 px-1.5 py-0.5 rounded border border-[#6B00FF]/40">
                  AI
                </span>
              </span>
              <span className="text-[10px] text-gray-400 font-medium -mt-0.5">
                المساعد الذكي لمتاجر سلة
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1 bg-[#141422]/70 border border-[#6B00FF]/15 px-3 py-1.5 rounded-full backdrop-blur-md">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-gray-300 hover:text-white px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all hover:bg-white/5 hover:text-[#C499FF]"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={getAppUrl("/login")}
              className="text-gray-300 hover:text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors hover:bg-white/5"
            >
              تسجيل الدخول
            </a>
            <a
              href={getAppUrl("/register")}
              className="relative group overflow-hidden bg-gradient-to-r from-[#6B00FF] to-[#9B59FF] hover:from-[#5800D9] hover:to-[#8B33FF] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 hover:shadow-lg hover:shadow-[#6B00FF]/30 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
            >
              <span>جرّب مجاناً 14 يوم</span>
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-white p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            aria-label={isOpen ? "إغلاق القائمة" : "فتح القائمة"}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className="lg:hidden mt-4 bg-[#0E0E17]/95 border border-[#6B00FF]/25 rounded-2xl p-5 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col space-y-1 pb-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-gray-200 hover:text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-white/5 flex items-center justify-between"
                >
                  <span>{link.label}</span>
                  <span className="text-gray-600 text-xs">←</span>
                </a>
              ))}
            </div>
            <div className="pt-4 border-t border-white/10 flex flex-col gap-2.5">
              <a
                href={getAppUrl("/login")}
                className="w-full text-center text-gray-300 hover:text-white py-2.5 text-sm font-semibold rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                تسجيل الدخول إلى لوحة التحكم
              </a>
              <a
                href={getAppUrl("/register")}
                className="w-full text-center bg-gradient-to-r from-[#6B00FF] to-[#9B59FF] text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-[#6B00FF]/30 transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
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
