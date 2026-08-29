"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowLeft, Bot, MessageSquare } from "lucide-react";

const navLinks = [
  { label: "الرئيسية", href: "/" },
  { label: "عن الشركة", href: "/#about" },
  { label: "الخدمات والحلول", href: "/#services" },
  { label: "المساعد الذكي للمتاجر", href: "/assistant" },
  { label: "المدونة والمعرفة", href: "/#blog" },
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
          ? "py-3 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-xs"
          : "py-4 bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 relative flex-shrink-0 rounded-xl bg-white p-1 border border-slate-200 group-hover:border-[#0454FF]/40 transition-all duration-300 shadow-xs">
              <Image
                src="/logo.png?v=3"
                alt="ECOMATE Logo"
                width={40}
                height={40}
                className="object-contain"
                unoptimized
                priority
              />
            </div>
            <div className="flex flex-col text-right">
              <span className="text-slate-950 font-black text-xl tracking-tight font-sans flex items-center justify-end" dir="ltr">
                <span>ECOM</span><span className="text-[#3B4FE8]">ATE</span>
              </span>
              <span className="text-[10px] text-slate-500 font-bold -mt-0.5">
                حلول الأعمال والمنتجات الرقمية
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1 bg-white/90 border border-slate-200 px-4 py-1.5 rounded-full shadow-xs">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-slate-600 hover:text-[#3B4FE8] px-3.5 py-1.5 rounded-full text-xs font-bold transition-all hover:bg-blue-50"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="mailto:hello@ecomate.ai?subject=استشارة أعمال"
              className="text-slate-700 hover:text-[#3B4FE8] text-xs font-bold px-3.5 py-2 rounded-xl transition-colors hover:bg-slate-100 flex items-center gap-1.5"
            >
              <MessageSquare size={14} className="text-[#3B4FE8]" />
              <span>تحدث معنا</span>
            </a>

            <Link
              href="/assistant"
              className="bg-[#3B4FE8] hover:bg-[#2D3ED0] text-white px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm shadow-[#3B4FE8]/20 hover:scale-105 flex items-center gap-1.5"
            >
              <Bot size={14} />
              <span>مساعد المتاجر</span>
              <ArrowLeft size={13} />
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-slate-700 p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50"
            aria-label={isOpen ? "إغلاق القائمة" : "فتح القائمة"}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className="lg:hidden mt-3 bg-white/95 border border-slate-200 rounded-2xl p-4 shadow-xl backdrop-blur-2xl">
            <div className="flex flex-col space-y-1 pb-3">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-slate-700 hover:text-[#3B4FE8] px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors hover:bg-blue-50 flex items-center justify-between"
                >
                  <span>{link.label}</span>
                  <span className="text-slate-400 text-xs">←</span>
                </Link>
              ))}
            </div>
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <a
                href="mailto:hello@ecomate.ai"
                className="w-full text-center text-slate-700 hover:text-[#3B4FE8] py-2.5 text-xs font-bold rounded-xl bg-slate-100"
              >
                تحدث مع فريق ECOMATE
              </a>
              <Link
                href="/assistant"
                onClick={() => setIsOpen(false)}
                className="w-full text-center bg-[#3B4FE8] text-white py-2.5 rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-1.5"
              >
                <Bot size={14} />
                <span>اكتشف مساعد المتاجر</span>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
