"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  locale: "en" | "ar";
  dictionary: {
    solutions: string;
    industries: string;
    digitalProducts: string;
    about: string;
    work: string;
    cta: string;
    langSwitch: string;
  };
}

export default function Navbar({ locale, dictionary }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getToggleLangPath = () => {
    if (!pathname) return "/";
    const currentLocale = locale;
    const targetLocale = currentLocale === "en" ? "ar" : "en";
    const pathWithoutLocale = pathname.replace(new RegExp(`^/${currentLocale}`), "") || "/";
    return `/${targetLocale}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`;
  };

  const navLinks = [
    { href: "/solutions", label: dictionary.solutions },
    { href: "/industries", label: dictionary.industries },
    { href: "/digital-products", label: dictionary.digitalProducts },
    { href: "/about", label: dictionary.about },
    { href: "/work", label: dictionary.work },
  ];

  const isActive = (href: string) => {
    if (!pathname) return false;
    const pathWithoutLocale = pathname.replace(new RegExp(`^/${locale}`), "") || "/";
    return pathWithoutLocale.startsWith(href);
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "py-3 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-[0_4px_30px_rgba(0,0,0,0.03)]"
          : "py-5 bg-transparent"
      }`}
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Logo & Tagline */}
          <Link href={`/${locale}`} className="flex items-center gap-3 group">
            <Image
              src="/logo.png"
              alt="ECOMATE"
              width={40}
              height={40}
              className="w-10 h-10 object-contain"
            />
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight text-slate-900 group-hover:text-[#0454FF] transition-colors">
                ECOMATE
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-mono hidden sm:block">
                Business Growth & Solutions
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Pill Container */}
          <nav className="hidden lg:flex items-center bg-white/60 backdrop-blur-md rounded-full px-2 py-1.5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-white/80 ring-1 ring-slate-900/5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={`/${locale}${link.href}`}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? "text-[#0454FF] bg-blue-50/80"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href={getToggleLangPath()}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-2 py-1"
            >
              {dictionary.langSwitch}
            </Link>

            <Link
              href={`/${locale}/contact`}
              className="flex items-center gap-2 bg-[#0454FF] hover:bg-blue-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 group"
            >
              {dictionary.cta}
              <ArrowRight className="w-4 h-4 rtl:-scale-x-100 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full inset-x-0 bg-white border-b border-slate-200 shadow-xl lg:hidden"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={`/${locale}${link.href}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between p-3 rounded-xl text-base font-medium transition-colors ${
                    isActive(link.href)
                      ? "text-[#0454FF] bg-blue-50"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                  <ChevronRight className="w-4 h-4 rtl:-scale-x-100 text-slate-400" />
                </Link>
              ))}

              <div className="h-px bg-slate-100 my-2" />

              <div className="flex items-center justify-between px-3">
                <span className="text-sm font-medium text-slate-500">Language</span>
                <Link
                  href={getToggleLangPath()}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm font-bold text-slate-900"
                >
                  {dictionary.langSwitch}
                </Link>
              </div>

              <Link
                href={`/${locale}/contact`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 bg-[#0454FF] text-white px-6 py-3.5 rounded-xl text-sm font-semibold shadow-md shadow-blue-500/20 w-full"
              >
                {dictionary.cta}
                <ArrowRight className="w-4 h-4 rtl:-scale-x-100" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
