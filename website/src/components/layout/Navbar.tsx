"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowLeft, PhoneCall, Sparkles, MessageSquare } from "lucide-react";

interface NavbarProps {
  onOpenConsultation?: () => void;
}

const navLinks = [
  { label: "الرئيسية", href: "/" },
  { label: "حلولنا", href: "/#growth-journey" },
  { label: "قطاعات الأعمال", href: "/#sectors" },
  { label: "منصة ECO CX", href: "/#eco-cx" },
  { label: "المدونة", href: "/blog" },
  { label: "تواصل معنا", href: "/#contact" },
];

export default function Navbar({ onOpenConsultation }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCtaClick = () => {
    if (onOpenConsultation) {
      onOpenConsultation();
    } else {
      const el = document.getElementById("contact");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

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
                className="text-slate-600 hover:text-[#0454FF] px-3.5 py-1.5 rounded-full text-xs font-bold transition-all hover:bg-blue-50"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://wa.me/966500000000?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D9%81%D8%B1%D9%8A%D9%82%20ECOMATE"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-700 hover:text-[#0454FF] text-xs font-bold px-3.5 py-2 rounded-xl transition-colors hover:bg-slate-100 flex items-center gap-1.5"
            >
              <MessageSquare size={14} className="text-[#0454FF]" />
              <span>واتساب</span>
            </a>

            <button
              onClick={handleCtaClick}
              className="bg-[#0454FF] hover:bg-[#0047E0] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-[#0454FF]/20 hover:scale-105 flex items-center gap-1.5"
            >
              <Sparkles size={13} />
              <span>احجز استشارة مجانية</span>
              <ArrowLeft size={13} />
            </button>
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
                  className="text-slate-700 hover:text-[#0454FF] px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors hover:bg-blue-50 flex items-center justify-between"
                >
                  <span>{link.label}</span>
                  <span className="text-slate-400 text-xs">←</span>
                </Link>
              ))}
            </div>
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleCtaClick();
                }}
                className="w-full text-center bg-[#0454FF] text-white py-3 rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-1.5"
              >
                <Sparkles size={14} />
                <span>احجز استشارة مجانية لبراندك</span>
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
