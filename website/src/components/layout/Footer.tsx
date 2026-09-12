"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

interface FooterProps {
  locale: "en" | "ar";
  dictionary: {
    tagline: string;
    statement: string;
    cta: string;
    description: string;
    ecoCxLabel: string;
    ecoCxCta: string;
    solutionsTitle: string;
    industriesTitle: string;
    companyTitle: string;
    copyright: string;
    privacy: string;
    terms: string;
  };
}

export default function Footer({ locale, dictionary }: FooterProps) {
  const isRtl = locale === "ar";
  
  const solutions = isRtl ? [
    "الاستراتيجية وحلول الأعمال",
    "العلامة التجارية والإبداع",
    "التسويق والنمو",
    "التجارب الرقمية",
    "التكنولوجيا والبرمجيات"
  ] : [
    "Strategy & Business Solutions",
    "Branding & Creative",
    "Marketing & Growth",
    "Digital Experiences",
    "Technology & Software"
  ];
  
  const industries = isRtl ? [
    "التجزئة والتجارة الإلكترونية",
    "العقارات",
    "الخدمات المالية",
    "الرعاية الصحية",
    "اللوجستيات",
    "الضيافة"
  ] : [
    "Retail",
    "Real Estate",
    "Financial Services",
    "Healthcare",
    "Logistics",
    "Hospitality"
  ];
  
  const company = isRtl ? [
    { label: "من نحن", href: `/${locale}/about` },
    { label: "منهجيتنا", href: `/${locale}/about#approach` },
    { label: "أعمالنا", href: `/${locale}/work` },
    { label: "تواصل معنا", href: `/${locale}/contact` }
  ] : [
    { label: "About", href: `/${locale}/about` },
    { label: "Our Approach", href: `/${locale}/about#approach` },
    { label: "Work", href: `/${locale}/work` },
    { label: "Contact", href: `/${locale}/contact` }
  ];

  return (
    <footer 
      className="bg-[#0B0F19] text-white pt-24 pb-8 overflow-hidden selection:bg-[#0454FF] selection:text-white"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        
        {/* Top: Large Signature Statement */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-24 border-b border-white/10 pb-16">
          <div className="max-w-3xl">
            <span className="font-mono text-sm tracking-widest text-[#0454FF] uppercase mb-6 block">
              {dictionary.tagline}
            </span>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight">
              {dictionary.statement.replace(/\.$/, '')}<span className="text-[#0454FF]">.</span>
            </h2>
          </div>
          <Link
            href={`/${locale}/contact`}
            className="group flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-[#0B0F19] px-8 py-4 rounded-full text-base font-bold transition-all shrink-0"
          >
            {dictionary.cta}
            <div className="bg-[#0454FF] rounded-full p-1.5 group-hover:scale-110 transition-transform">
              <ArrowRight className="w-4 h-4 text-white rtl:-scale-x-100" />
            </div>
          </Link>
        </div>

        {/* Middle Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
          
          {/* Brand Column */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <Link href={`/${locale}`} className="flex items-center gap-3 group">
              <Image
                src="/logo.png"
                alt="ECOMATE"
                width={48}
                height={48}
                className="w-12 h-12 object-contain brightness-0 invert"
              />
              <span className="font-bold text-2xl tracking-tight group-hover:text-slate-300 transition-colors">ECOMATE</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              {dictionary.description}
            </p>
            
            {/* ECO CX Card */}
            <div className="mt-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 backdrop-blur-sm max-w-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#0454FF] animate-pulse"></div>
                <span className="text-xs font-mono tracking-wider text-slate-300 uppercase">
                  {dictionary.ecoCxLabel}
                </span>
              </div>
              <Link 
                href={`/${locale}/products/eco-cx`}
                className="flex items-center justify-between group"
              >
                <span className="font-semibold text-lg group-hover:text-[#0454FF] transition-colors">
                  {dictionary.ecoCxCta}
                </span>
                <ExternalLink className="w-5 h-5 text-slate-500 group-hover:text-[#0454FF] transition-colors rtl:-scale-x-100" />
              </Link>
            </div>
          </div>

          {/* Solutions Column */}
          <div className="lg:col-span-3 lg:col-start-6 flex flex-col gap-6">
            <h3 className="text-lg font-semibold">{dictionary.solutionsTitle}</h3>
            <ul className="flex flex-col gap-4">
              {solutions.map((item, idx) => (
                <li key={idx}>
                  <Link href={`/${locale}/solutions`} className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-2 group">
                    <span className="w-0 overflow-hidden group-hover:w-2 h-px bg-[#0454FF] transition-all duration-300"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Industries Column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <h3 className="text-lg font-semibold">{dictionary.industriesTitle}</h3>
            <ul className="flex flex-col gap-4">
              {industries.map((item, idx) => (
                <li key={idx}>
                  <Link href={`/${locale}/industries`} className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-2 group">
                    <span className="w-0 overflow-hidden group-hover:w-2 h-px bg-[#0454FF] transition-all duration-300"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <h3 className="text-lg font-semibold">{dictionary.companyTitle}</h3>
            <ul className="flex flex-col gap-4">
              {company.map((item, idx) => (
                <li key={idx}>
                  <Link href={item.href} className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-2 group">
                    <span className="w-0 overflow-hidden group-hover:w-2 h-px bg-[#0454FF] transition-all duration-300"></span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/10 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ECOMATE. {dictionary.copyright}</p>
          <div className="flex items-center gap-6">
            <Link href={`/${locale}/privacy`} className="hover:text-white transition-colors">
              {dictionary.privacy}
            </Link>
            <Link href={`/${locale}/terms`} className="hover:text-white transition-colors">
              {dictionary.terms}
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
