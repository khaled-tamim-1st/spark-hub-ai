"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "الرئيسية", href: "/" },
  { label: "المميزات", href: "#features" },
  { label: "كيف يعمل", href: "#how-it-works" },
  { label: "الأسعار", href: "#pricing" },
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
          ? "bg-[#0A0A0F]/95 backdrop-blur-md border-b border-[#6B00FF]/20 shadow-lg shadow-[#6B00FF]/5"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 relative flex-shrink-0">
              <Image
                src="/logo.png"
                alt="شعار سند"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">سند</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-white/70 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-white/5"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://app.sanadai.com/login"
              className="text-white/70 hover:text-white text-sm font-medium transition-colors"
            >
              تسجيل الدخول
            </a>
            <a
              href="https://app.sanadai.com/register"
              className="bg-[#6B00FF] hover:bg-[#5800D9] text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all hover:shadow-lg hover:shadow-[#6B00FF]/30 hover:scale-105 active:scale-95"
            >
              جرّب مجاناً
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label={isOpen ? "إغلاق القائمة" : "فتح القائمة"}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-[#0A0A0F]/98 backdrop-blur-md border-b border-[#6B00FF]/20 px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block text-white/80 hover:text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-white/5"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              <a
                href="https://app.sanadai.com/login"
                className="text-center text-white/70 hover:text-white py-2 text-sm"
              >
                تسجيل الدخول
              </a>
              <a
                href="https://app.sanadai.com/register"
                className="text-center bg-[#6B00FF] hover:bg-[#5800D9] text-white py-3 rounded-xl text-sm font-semibold transition-colors"
              >
                جرّب مجاناً — مجاناً لمدة 14 يوم
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
