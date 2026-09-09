"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Clock, ShieldCheck, CheckCircle2 } from "lucide-react";

interface FinalCTAProps {
  onOpenConsultation?: () => void;
}

export default function FinalCTA({ onOpenConsultation }: FinalCTAProps) {
  return (
    <section className="py-24 md:py-32 bg-white text-slate-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Culmination Canvas Box */}
        <div className="relative bg-[#0454FF] text-white rounded-3xl p-8 sm:p-14 lg:p-16 shadow-2xl overflow-hidden">
          
          {/* Subtle Dynamic Ambient Circles */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/20 blur-[100px] rounded-full pointer-events-none" />

          {/* SVG Flowing Path Line (Challenge -> Solution -> Growth) */}
          <svg className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-20 hidden md:block">
            <path
              d="M 100,300 C 300,100 600,400 900,200 S 1200,350 1400,150"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeDasharray="6 6"
            />
            <circle cx="100" cy="300" r="6" fill="#FFFFFF" />
            <circle cx="900" cy="200" r="6" fill="#FFFFFF" />
            <circle cx="1400" cy="150" r="6" fill="#FFFFFF" />
          </svg>

          <div className="relative z-10 max-w-3xl">
            
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 text-white px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider mb-6">
              <Sparkles size={13} />
              <span>START THE CONVERSATION</span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] mb-6 text-white">
              Let&apos;s Build What&apos;s Next.
            </h2>

            <p className="text-blue-100 text-base sm:text-lg leading-relaxed mb-10 max-w-2xl font-normal">
              Tell us what you&apos;re trying to improve, automate, connect, or build. We&apos;ll help you find the right path forward and engineer a scalable technology roadmap tailored to your business goals.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
              {onOpenConsultation ? (
                <button
                  onClick={onOpenConsultation}
                  className="bg-[#0B0F19] hover:bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Talk to Our Team</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <Link
                  href="/contact"
                  className="bg-[#0B0F19] hover:bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Talk to Our Team</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              )}

              <Link
                href="/solutions"
                className="bg-white/15 hover:bg-white/25 text-white border border-white/20 px-7 py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 backdrop-blur-xs"
              >
                <span>Explore Solutions</span>
              </Link>
            </div>

            {/* Trust Assurance */}
            <div className="pt-6 border-t border-white/20 flex flex-wrap items-center gap-6 text-xs text-blue-100 font-medium">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-white" />
                <span>30-minute executive discovery call</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-white" />
                <span>Confidential diagnostic with senior architects</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
