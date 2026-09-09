"use client";

import { useState } from "react";
import { ArrowRight, Unlink, Network, ShieldCheck, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function BusinessComplexity() {
  const [viewState, setViewState] = useState<"fragmented" | "connected">("connected");

  const modules = [
    { name: "ERP & Inventory", tag: "Operations", desc: "Core business ledger & physical stock" },
    { name: "CRM & Pipelines", tag: "Sales", desc: "Lead qualification & account history" },
    { name: "Customer Channels", tag: "Communication", desc: "WhatsApp, Social, Webchat & Email" },
    { name: "Finance & Billing", tag: "Accounting", desc: "Invoicing, payment gateways & reconciliations" },
    { name: "Field & Logistics", tag: "Fulfillment", desc: "Dispatch tracking & carrier updates" },
    { name: "Executive Dashboards", tag: "Intelligence", desc: "Real-time KPI & revenue metrics" },
  ];

  return (
    <section className="py-24 md:py-32 bg-[#0B0F19] text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0454FF]/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/10 blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-blue-900/50 border border-blue-700/60 text-blue-300 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider mb-4">
              <span>SYSTEM ARCHITECTURE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
              Your Business Doesn&apos;t Run on One System.{" "}
              <span className="text-[#0454FF]">
                Neither Should Your Solution.
              </span>
            </h2>
          </div>

          {/* Interactive State Toggle */}
          <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-2xl flex items-center gap-2 self-start lg:self-auto">
            <button
              onClick={() => setViewState("fragmented")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                viewState === "fragmented"
                  ? "bg-red-500/20 text-red-300 border border-red-500/40 shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Unlink size={14} />
              <span>Fragmented Silos</span>
            </button>
            <button
              onClick={() => setViewState("connected")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                viewState === "connected"
                  ? "bg-[#0454FF] text-white shadow-md shadow-[#0454FF]/30 font-extrabold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Network size={14} />
              <span>Connected Ecosystem</span>
            </button>
          </div>
        </div>

        {/* Dynamic Architectural Visualization */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 mb-12 shadow-2xl relative overflow-hidden">
          
          {/* Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-800 text-xs font-mono">
            <div className="flex items-center gap-2">
              {viewState === "connected" ? (
                <>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-300 font-bold">STATE: UNIFIED ARCHITECTURE &amp; AUTOMATED PIPELINES</span>
                </>
              ) : (
                <>
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="text-red-300 font-bold">STATE: DISCONNECTED SILOS &amp; MANUAL SPREADSHEETS</span>
                </>
              )}
            </div>
            <span className="text-slate-400">
              {viewState === "connected" ? "Real-Time Synchronization Active" : "Operational Friction High"}
            </span>
          </div>

          {/* Connected vs Fragmented Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {modules.map((m, idx) => {
              const isConnected = viewState === "connected";
              return (
                <div
                  key={m.name}
                  className={`p-6 rounded-2xl border transition-all duration-300 ${
                    isConnected
                      ? "bg-slate-900 border-blue-500/40 shadow-lg shadow-blue-950/20 hover:border-[#0454FF]"
                      : "bg-slate-950/60 border-slate-800/80 opacity-75 grayscale"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                      isConnected
                        ? "bg-blue-950 text-blue-300 border border-blue-800"
                        : "bg-slate-800 text-slate-400"
                    }`}>
                      {m.tag}
                    </span>
                    <span className="text-xs font-mono text-slate-500">0{idx + 1}</span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1.5">{m.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{m.desc}</p>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                    <span className={isConnected ? "text-emerald-400 flex items-center gap-1.5" : "text-red-400 flex items-center gap-1.5"}>
                      {isConnected ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                      {isConnected ? "Synchronized API" : "Manual Export Required"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Central Architecture Callout */}
          <div className={`mt-8 p-5 rounded-2xl border transition-all ${
            viewState === "connected"
              ? "bg-gradient-to-r from-blue-950/70 via-slate-900 to-blue-950/70 border-blue-500/40"
              : "bg-slate-950 border-red-900/40"
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-bold block mb-1">
                  {viewState === "connected" ? "The Outcome of Our Engineering" : "The Cost of Inaction"}
                </span>
                <p className="text-xs sm:text-sm text-slate-200">
                  {viewState === "connected"
                    ? "Eliminates repetitive data re-entry, accelerates turnaround times, and provides leadership with instant operational visibility."
                    : "Accumulates technical debt, increases labor overhead, and limits the company's ability to scale without adding headcount."}
                </p>
              </div>
              <Link
                href="/solutions"
                className="flex-shrink-0 bg-[#0454FF] hover:bg-[#003ECC] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 group self-start sm:self-auto"
              >
                <span>Explore Solutions</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
