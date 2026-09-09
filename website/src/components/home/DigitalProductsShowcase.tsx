import Link from "next/link";
import { MessageSquare, ExternalLink, Cpu, Database, CheckCircle2, ArrowRight } from "lucide-react";

export default function DigitalProductsShowcase() {
  return (
    <section className="py-24 md:py-32 bg-white text-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-[#0454FF] border border-blue-100 px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider mb-4">
            <span>PROPRIETARY LABS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight mb-6">
            Proprietary Products.{" "}
            <span className="text-[#0454FF]">Real Business Problems.</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Alongside our client-focused solutions, our product division conceives, engineers, and scales specialized software platforms that solve universal industry challenges.
          </p>
        </div>

        {/* Featured Flagship Product: ECO CX */}
        <div className="bg-[#0B0F19] text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-2xl relative overflow-hidden mb-12">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#0454FF]/15 blur-[120px] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Product Story */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-blue-900/60 border border-blue-700/80 text-blue-300 px-3 py-1 rounded-full text-xs font-mono font-bold">
                FLAGSHIP DIGITAL PLATFORM
              </div>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#0454FF] text-white flex items-center justify-center shadow-lg">
                  <MessageSquare size={28} />
                </div>
                <div>
                  <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">ECO CX</h3>
                  <p className="text-xs sm:text-sm font-semibold text-blue-400">
                    Enterprise Customer Experience &amp; Communication Platform
                  </p>
                </div>
              </div>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
                A unified communication engine engineered for high-volume enterprises. Unifies WhatsApp, social messaging, and webchat into a single automated operational hub with direct ERP and CRM synchronization.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#0454FF] flex-shrink-0" />
                  <span>Omnichannel Inbox</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#0454FF] flex-shrink-0" />
                  <span>AI Triage &amp; Routing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#0454FF] flex-shrink-0" />
                  <span>ERP / CRM Live Sync</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <a
                  href="https://ecocx.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#0454FF] hover:bg-[#003ECC] text-white px-6 py-3.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 shadow-md group"
                >
                  <span>Explore ECO CX Website</span>
                  <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
                <span className="text-xs text-slate-400 font-mono">
                  Maintained as a standalone SaaS product
                </span>
              </div>
            </div>

            {/* Architecture Visual Fragment */}
            <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-3 font-mono text-xs">
              <div className="text-slate-400 text-[11px] pb-2 border-b border-slate-800 flex justify-between">
                <span>ECO_CX_ROUTER</span>
                <span className="text-emerald-400">ACTIVE</span>
              </div>
              
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-200">
                  <MessageSquare size={14} className="text-blue-400" />
                  <span>Inbound Message Ingestion</span>
                </div>
                <span className="text-blue-400 text-[10px]">ALL CHANNELS</span>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-200">
                  <Cpu size={14} className="text-blue-400" />
                  <span>Intent Parsing &amp; Routing</span>
                </div>
                <span className="text-emerald-400 text-[10px]">&lt; 120ms</span>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-200">
                  <Database size={14} className="text-blue-400" />
                  <span>Bidirectional Database Sync</span>
                </div>
                <span className="text-blue-400 text-[10px]">ERP CONNECTED</span>
              </div>
            </div>

          </div>
        </div>

        {/* Link to Digital Products page */}
        <div className="text-center">
          <Link
            href="/digital-products"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#0454FF] hover:text-[#003ECC] group"
          >
            <span>View All Proprietary Products &amp; Enterprise Accelerators</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
}
