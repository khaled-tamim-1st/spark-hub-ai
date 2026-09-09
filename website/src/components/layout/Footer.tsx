"use client";

import Link from "next/link";
import { Layers, ArrowRight, ExternalLink, ShieldCheck } from "lucide-react";

const footerNavigation = {
  solutions: [
    { name: "Digital Transformation", href: "/solutions#transformation" },
    { name: "Custom Software & Platforms", href: "/solutions#custom-software" },
    { name: "Intelligent Automation & AI", href: "/solutions#automation" },
    { name: "Systems Integration", href: "/solutions#integration" },
    { name: "Customer Experience (CX)", href: "/solutions#cx" },
    { name: "Technology Advisory", href: "/solutions#advisory" },
  ],
  industries: [
    { name: "Retail & E-Commerce", href: "/industries#retail" },
    { name: "Financial Services & FinTech", href: "/industries#fintech" },
    { name: "Real Estate & PropTech", href: "/industries#real-estate" },
    { name: "Logistics & Supply Chain", href: "/industries#logistics" },
    { name: "Healthcare & Life Sciences", href: "/industries#healthcare" },
    { name: "B2B & Professional Services", href: "/industries#b2b" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Our Methodology", href: "/about#approach" },
    { name: "Case Studies / Impact", href: "/case-studies" },
    { name: "Contact Our Team", href: "/contact" },
  ],
  legal: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Engagement", href: "#" },
    { name: "Information Security", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#0B0F19] border-t border-slate-800 text-slate-300 pt-20 pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Large Signature Statement */}
        <div className="pb-16 border-b border-slate-800 mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#0454FF] block mb-3">
              BUSINESS &amp; TECHNOLOGY SOLUTIONS
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Business challenges. <span className="text-[#0454FF]">Engineered solutions.</span>
            </h2>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#0454FF] hover:bg-[#003ECC] text-white px-6 py-3.5 rounded-xl font-bold text-xs transition-all self-start md:self-auto group"
          >
            <span>Talk to Our Team</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16">
          
          {/* Brand Info & Summary */}
          <div className="md:col-span-4 space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#0454FF] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                <Layers size={20} className="text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-extrabold text-lg tracking-tight flex items-center gap-1">
                  <span>ECOMATE</span>
                  <span className="text-[#0454FF]">.</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono font-semibold uppercase tracking-wider">
                  Solutions &amp; Technology Partner
                </span>
              </div>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              We engineer scalable business solutions that help ambitious companies modernize operations, automate complexity, and build digital capabilities for sustainable growth.
            </p>

            {/* ECO CX Dedicated Reference */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
              <div className="text-[11px] font-mono text-slate-400 font-bold uppercase mb-1">
                Proprietary Platform
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">ECO CX Customer Suite</span>
                <a
                  href="https://ecocx.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#0454FF] hover:text-blue-400 font-bold flex items-center gap-1"
                >
                  <span>Explore Product</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>

          {/* Solutions Column */}
          <div className="md:col-span-3">
            <h4 className="text-white font-mono font-bold text-xs uppercase tracking-wider mb-4">
              Solutions
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              {footerNavigation.solutions.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Industries Column */}
          <div className="md:col-span-3">
            <h4 className="text-white font-mono font-bold text-xs uppercase tracking-wider mb-4">
              Industries
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              {footerNavigation.industries.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div className="md:col-span-2">
            <h4 className="text-white font-mono font-bold text-xs uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
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

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <p>© {new Date().getFullYear()} ECOMATE Solutions. All rights reserved.</p>
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
