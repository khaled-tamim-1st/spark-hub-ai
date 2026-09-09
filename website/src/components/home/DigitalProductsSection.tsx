import Link from "next/link";
import { MessageSquare, ExternalLink, Cpu, Layers, CheckCircle2, ArrowRight } from "lucide-react";

export default function DigitalProductsSection() {
  return (
    <section className="py-20 md:py-28 bg-white text-slate-900 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            Proprietary Products & Labs
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight mb-6">
            Proprietary Technology Built From Real Business Needs.
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Alongside our client-focused solutions, we develop proprietary digital products that address recurring business and operational challenges.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Featured Product: ECO CX */}
          <div className="lg:col-span-8 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 blur-[100px] pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="inline-flex items-center gap-2 bg-blue-900/60 border border-blue-700/80 text-blue-300 px-3 py-1 rounded-full text-xs font-bold font-mono">
                  PROPRIETARY PLATFORM
                </div>
                <span className="text-xs text-slate-400 font-mono">Product Lab 01</span>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">ECO CX</h3>
                  <p className="text-xs sm:text-sm font-semibold text-blue-400">
                    Enterprise Customer Experience & Communication Platform
                  </p>
                </div>
              </div>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-2xl">
                A unified omnichannel communication suite engineered for high-volume enterprises. Centralizes customer conversations, automates support pipelines, and connects directly into enterprise CRM and order databases.
              </p>

              {/* Feature Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-blue-400 flex-shrink-0" />
                  <span>Omnichannel Inbox</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-blue-400 flex-shrink-0" />
                  <span>Automated Routing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-blue-400 flex-shrink-0" />
                  <span>Direct CRM / ERP Sync</span>
                </div>
              </div>
            </div>

            {/* CTA to Dedicated ECO CX website */}
            <div className="relative z-10 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <span className="text-xs text-slate-400">
                ECO CX is maintained as an independent platform product.
              </span>
              <a
                href="https://ecocx.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 shadow-sm group"
              >
                <span>Explore ECO CX</span>
                <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>

          {/* Complementary Card: Proprietary Accelerators */}
          <div className="lg:col-span-4 bg-slate-50 border border-slate-200/80 rounded-3xl p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-blue-600 flex items-center justify-center mb-6 shadow-2xs">
                <Cpu size={24} />
              </div>

              <div className="inline-flex items-center gap-2 text-xs font-bold font-mono text-slate-500 uppercase tracking-wider mb-2">
                Internal Accelerators
              </div>
              <h3 className="text-xl font-bold text-slate-950 mb-3">
                Enterprise Middleware & Connectors
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                Modular data connectors, automated orchestration pipelines, and security adapters built by our team to accelerate client deployments with verified architectural reliability.
              </p>
            </div>

            <Link
              href="/digital-products"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 pt-4 border-t border-slate-200 group"
            >
              <span>View All Digital Products & Accelerators</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
