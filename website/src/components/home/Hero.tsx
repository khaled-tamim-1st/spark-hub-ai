"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Server, Workflow, Database, Cpu, ShieldCheck, CheckCircle2, Layers, RefreshCw, Zap, Users } from "lucide-react";

interface HeroProps {
  onOpenConsultation?: () => void;
}

export default function Hero({ onOpenConsultation }: HeroProps) {
  const [activeNode, setActiveNode] = useState<number | null>(null);

  const nodes = [
    { id: 1, label: "Business Strategy", sub: "Operational Objectives", x: "12%", y: "20%", icon: Workflow, color: "#0454FF" },
    { id: 2, label: "Data & Systems", sub: "ERP • CRM • Cloud", x: "78%", y: "18%", icon: Database, color: "#3B82F6" },
    { id: 3, label: "Intelligent Engine", sub: "Automation & Logic", x: "48%", y: "50%", icon: Cpu, color: "#0454FF", primary: true },
    { id: 4, label: "Customer Experience", sub: "Omnichannel Touchpoints", x: "18%", y: "80%", icon: Users, color: "#2563EB" },
    { id: 5, label: "Scalable Growth", sub: "Measurable Impact", x: "80%", y: "78%", icon: Zap, color: "#1D4ED8" },
  ];

  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 overflow-hidden bg-white">
      {/* Subtle Technical Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0454FF08_1px,transparent_1px),linear-gradient(to_bottom,#0454FF08_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-blue-500/8 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left / Editorial Typography Area */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Small Technical Label */}
            <div className="inline-flex items-center gap-2 bg-blue-50/90 border border-blue-200/80 text-[#0454FF] px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#0454FF] animate-pulse" />
              <span>BUSINESS &amp; TECHNOLOGY SOLUTIONS</span>
            </div>

            {/* Massive Editorial Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.08]">
              We Engineer{" "}
              <span className="text-[#0454FF] underline decoration-blue-200 underline-offset-8">
                Scalable Solutions
              </span>{" "}
              for Complex Business Challenges.
            </h1>

            {/* Supporting Headline */}
            <p className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight">
              Technology Built Around Your Business — Not the Other Way Around.
            </p>

            {/* Subheadline Paragraph */}
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl font-normal">
              We help ambitious organizations modernize operations, automate complexity, integrate disconnected systems, and build digital capabilities that support sustainable growth.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              {onOpenConsultation ? (
                <button
                  onClick={onOpenConsultation}
                  className="bg-[#0454FF] hover:bg-[#003ECC] text-white px-7 py-4 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Talk to Our Team</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <Link
                  href="/contact"
                  className="bg-[#0454FF] hover:bg-[#003ECC] text-white px-7 py-4 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Talk to Our Team</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              )}

              <Link
                href="/solutions"
                className="bg-slate-50 hover:bg-slate-100 text-slate-900 border border-slate-200 px-6 py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Explore Our Solutions</span>
              </Link>
            </div>

          </div>

          {/* Right / Living Ecosystem Interactive Visual */}
          <div className="lg:col-span-6 relative">
            <div className="relative bg-[#0B0F19] text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 overflow-hidden min-h-[440px] flex flex-col justify-between">
              
              {/* Subtle ambient glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#0454FF]/20 blur-[80px] rounded-full pointer-events-none" />

              {/* Terminal / System Status Header */}
              <div className="relative z-10 flex items-center justify-between pb-4 border-b border-slate-800 text-xs text-slate-400">
                <div className="flex items-center gap-2 font-mono">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-slate-300 font-bold text-[11px]">ECOSYSTEM ARCHITECTURE</span>
                </div>
                <div className="text-[11px] font-mono text-blue-400 bg-blue-950/80 border border-blue-800 px-2.5 py-0.5 rounded-md">
                  CONNECTED • LIVE
                </div>
              </div>

              {/* Connected Interactive Blueprint Canvas */}
              <div className="relative z-10 my-auto py-6">
                
                {/* SVG Connecting Flow Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                  <line x1="20%" y1="20%" x2="50%" y2="50%" stroke="#0454FF" strokeWidth="1.5" strokeDasharray="4 4" className="animate-pulse" />
                  <line x1="80%" y1="20%" x2="50%" y2="50%" stroke="#0454FF" strokeWidth="1.5" strokeDasharray="4 4" />
                  <line x1="20%" y1="80%" x2="50%" y2="50%" stroke="#0454FF" strokeWidth="1.5" strokeDasharray="4 4" />
                  <line x1="80%" y1="80%" x2="50%" y2="50%" stroke="#0454FF" strokeWidth="1.5" strokeDasharray="4 4" />
                </svg>

                {/* Nodes Stack */}
                <div className="grid grid-cols-2 gap-4 relative z-10">
                  
                  {/* Strategy Node */}
                  <div
                    onMouseEnter={() => setActiveNode(1)}
                    onMouseLeave={() => setActiveNode(null)}
                    className="p-3.5 bg-slate-900/90 border border-slate-800 hover:border-[#0454FF] rounded-2xl transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-950 text-[#0454FF] flex items-center justify-center group-hover:bg-[#0454FF] group-hover:text-white transition-colors">
                        <Workflow size={14} />
                      </div>
                      <span className="text-xs font-bold text-slate-200">Business Model</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono">Process Mapping &amp; Logic</p>
                  </div>

                  {/* Systems Layer Node */}
                  <div
                    onMouseEnter={() => setActiveNode(2)}
                    onMouseLeave={() => setActiveNode(null)}
                    className="p-3.5 bg-slate-900/90 border border-slate-800 hover:border-[#0454FF] rounded-2xl transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-950 text-blue-400 flex items-center justify-center group-hover:bg-[#0454FF] group-hover:text-white transition-colors">
                        <Database size={14} />
                      </div>
                      <span className="text-xs font-bold text-slate-200">Unified Systems</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono">ERP • CRM • Custom APIs</p>
                  </div>

                  {/* Central Intelligent Core (Spans full width) */}
                  <div
                    onMouseEnter={() => setActiveNode(3)}
                    onMouseLeave={() => setActiveNode(null)}
                    className="col-span-2 p-4 bg-gradient-to-r from-blue-950/80 via-slate-900 to-blue-950/80 border border-[#0454FF]/60 rounded-2xl shadow-lg transition-all"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#0454FF] text-white flex items-center justify-center shadow-sm animate-pulse">
                          <Cpu size={18} />
                        </div>
                        <div>
                          <span className="text-sm font-extrabold text-white block">
                            Intelligent Automation &amp; Middleware Engine
                          </span>
                          <span className="text-[11px] text-blue-300 font-mono">
                            Event-driven synchronization &amp; business rules
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                        99.9% RELIABILITY
                      </span>
                    </div>
                  </div>

                  {/* Customer Experience Node */}
                  <div
                    onMouseEnter={() => setActiveNode(4)}
                    onMouseLeave={() => setActiveNode(null)}
                    className="p-3.5 bg-slate-900/90 border border-slate-800 hover:border-[#0454FF] rounded-2xl transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-950 text-blue-400 flex items-center justify-center group-hover:bg-[#0454FF] group-hover:text-white transition-colors">
                        <Users size={14} />
                      </div>
                      <span className="text-xs font-bold text-slate-200">Experience Layer</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono">Omnichannel &amp; Portals</p>
                  </div>

                  {/* Business Impact Node */}
                  <div
                    onMouseEnter={() => setActiveNode(5)}
                    onMouseLeave={() => setActiveNode(null)}
                    className="p-3.5 bg-slate-900/90 border border-slate-800 hover:border-[#0454FF] rounded-2xl transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-950 text-blue-400 flex items-center justify-center group-hover:bg-[#0454FF] group-hover:text-white transition-colors">
                        <Zap size={14} />
                      </div>
                      <span className="text-xs font-bold text-slate-200">Scalable Outcomes</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono">Reduced Friction &amp; Growth</p>
                  </div>

                </div>

              </div>

              {/* Bottom Architectural Summary */}
              <div className="relative z-10 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="text-[11px] font-mono text-slate-400">
                  Business Challenge → Engineered Technology
                </span>
                <span className="text-[11px] font-mono text-[#0454FF] font-bold">
                  Zero Technical Debt
                </span>
              </div>

            </div>
          </div>

        </div>

        {/* Hero Trust Statement Strip */}
        <div className="mt-16 pt-8 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-6 text-xs text-slate-600 font-mono font-semibold uppercase tracking-wider">
          <div className="flex items-center gap-2 text-slate-900 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0454FF]" />
            <span>Strategy</span>
          </div>
          <span className="text-slate-300">•</span>
          <div className="flex items-center gap-2 text-slate-900 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0454FF]" />
            <span>Software Engineering</span>
          </div>
          <span className="text-slate-300">•</span>
          <div className="flex items-center gap-2 text-slate-900 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0454FF]" />
            <span>Intelligent Automation</span>
          </div>
          <span className="text-slate-300">•</span>
          <div className="flex items-center gap-2 text-slate-900 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0454FF]" />
            <span>Systems Integration</span>
          </div>
          <span className="text-slate-300">•</span>
          <div className="flex items-center gap-2 text-slate-900 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0454FF]" />
            <span>Customer Experience Architecture</span>
          </div>
        </div>

      </div>
    </section>
  );
}
