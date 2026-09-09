"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, Sparkles, Layers, ChevronRight } from "lucide-react";

interface NavbarProps {
  onOpenConsultation?: () => void;
}

const navLinks = [
  { label: "Solutions", href: "/solutions" },
  { label: "Industries", href: "/industries" },
  { label: "Digital Products", href: "/digital-products" },
  { label: "About", href: "/about" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar({ onOpenConsultation }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCtaClick = () => {
    if (onOpenConsultation) {
      onOpenConsultation();
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "py-3 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs"
          : "py-5 bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo & Strategic Tagline */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg tracking-tight group-hover:bg-blue-600 transition-colors shadow-sm">
              <Layers size={20} className="text-blue-400 group-hover:text-white transition-colors" />
            </div>
            <div className="flex flex-col">
              <span className="text-slate-950 font-extrabold text-lg tracking-tight flex items-center gap-1">
                <span>ECOMATE</span>
                <span className="text-blue-600">.</span>
              </span>
              <span className="text-[10px] text-slate-500 font-semibold tracking-wide uppercase">
                Business & Technology Solutions
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-50/80 border border-slate-200/80 px-4 py-1.5 rounded-full shadow-2xs backdrop-blur-xs">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? "text-blue-600 bg-white shadow-2xs font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/solutions"
              className="text-slate-700 hover:text-blue-600 text-xs font-semibold px-3 py-2 rounded-xl transition-colors"
            >
              Explore Solutions
            </Link>

            {onOpenConsultation ? (
              <button
                onClick={handleCtaClick}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-md flex items-center gap-1.5 group cursor-pointer"
              >
                <span>Talk to Our Team</span>
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            ) : (
              <Link
                href="/contact"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-md flex items-center gap-1.5 group"
              >
                <span>Talk to Our Team</span>
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-slate-700 p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 focus:outline-none"
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isOpen && (
          <div className="lg:hidden mt-3 bg-white border border-slate-200 rounded-2xl p-4 shadow-xl">
            <div className="flex flex-col space-y-1 pb-3">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between ${
                      isActive
                        ? "text-blue-600 bg-blue-50/70 font-bold"
                        : "text-slate-700 hover:text-blue-600 hover:bg-slate-50"
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronRight size={16} className="text-slate-400" />
                  </Link>
                );
              })}
            </div>
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="w-full text-center bg-blue-600 text-white py-3 rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-2"
              >
                <Sparkles size={14} />
                <span>Talk to Our Team</span>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

