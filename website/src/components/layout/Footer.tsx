import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Heart, ExternalLink } from "lucide-react";
import { getAppUrl } from "@/lib/config";

function IconX() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-slate-500 hover:text-[#0052FF] transition-colors" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.213 5.567 5.95-5.567zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-slate-500 hover:text-[#0052FF] transition-colors" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function IconLinkedin() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-slate-500 hover:text-[#0052FF] transition-colors" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 relative flex-shrink-0 rounded-xl bg-white p-1 shadow-sm">
                <Image
                  src="/logo.png"
                  alt="Ecomate Logo"
                  fill
                  className="object-contain p-0.5"
                />
              </div>
              <span className="text-white font-black text-2xl tracking-tight font-sans">
                <span>ECOM</span>
                <span className="text-[#3B82F6]">ATE</span>
              </span>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-sm font-medium">
              Ecomate هو المساعد الذكي المتخصص لمتاجر سلة والتجارة الإلكترونية. أتمتة الردود وخدمة العملاء على مدار الساعة بدقة وموثوقية 100%.
            </p>

            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl text-xs text-slate-300 font-bold">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>مطور خصيصاً لمتاجر التجارة الإلكترونية وسلة</span>
            </div>
          </div>

          {/* Column 1: Links */}
          <div>
            <h4 className="text-white font-black text-sm mb-4">المنتج</h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-bold">
              <li>
                <a href="#features" className="hover:text-[#60A5FA] transition-colors">المميزات الرئيسية</a>
              </li>
              <li>
                <a href="#roi-calculator" className="hover:text-[#60A5FA] transition-colors">حاسبة التوفير (ROI)</a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-[#60A5FA] transition-colors">كيف يعمل Ecomate؟</a>
              </li>
              <li>
                <a href="#integrations" className="hover:text-[#60A5FA] transition-colors">التكاملات والشركاء</a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-[#60A5FA] transition-colors">خطط الأسعار</a>
              </li>
            </ul>
          </div>

          {/* Column 2: System Links */}
          <div>
            <h4 className="text-white font-black text-sm mb-4">النظام واللوحة</h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-bold">
              <li>
                <a href={getAppUrl("/login")} className="hover:text-[#60A5FA] transition-colors flex items-center gap-1">
                  <span>تسجيل الدخول</span>
                  <ExternalLink size={11} className="text-slate-500" />
                </a>
              </li>
              <li>
                <a href={getAppUrl("/register")} className="hover:text-[#60A5FA] transition-colors flex items-center gap-1">
                  <span>إنشاء حساب جديد</span>
                  <ExternalLink size={11} className="text-slate-500" />
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#60A5FA] transition-colors">مركز الأسئلة والمساعدة</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Legal */}
          <div>
            <h4 className="text-white font-black text-sm mb-4">الدعم والتواصل</h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium mb-5">
              <li>
                <a href="mailto:hello@ecomate.ai" className="hover:text-[#60A5FA] transition-colors font-bold">hello@ecomate.ai</a>
              </li>
              <li>
                <span className="text-slate-500">الرياض، المملكة العربية السعودية</span>
              </li>
            </ul>

            {/* Social Icons */}
            <div className="flex gap-2">
              <a href="#" aria-label="X (Twitter)" className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center hover:bg-slate-700 transition-colors">
                <IconX />
              </a>
              <a href="#" aria-label="Instagram" className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center hover:bg-slate-700 transition-colors">
                <IconInstagram />
              </a>
              <a href="#" aria-label="LinkedIn" className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center hover:bg-slate-700 transition-colors">
                <IconLinkedin />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <p>© {year} Ecomate AI. جميع الحقوق محفوظة.</p>
          <p className="flex items-center gap-1">
            صُنع بـ <Heart size={13} className="text-blue-500 fill-blue-500" /> لرواد الأعمال والمتاجر الإلكترونية
          </p>
        </div>
      </div>
    </footer>
  );
}
