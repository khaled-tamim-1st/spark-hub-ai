import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function BusinessImpact() {
  const impacts = [
    { statement: "Less friction.", detail: "Eliminating manual handoffs and redundant administrative overhead.", size: "lg" },
    { statement: "Faster operations.", detail: "Accelerating execution cycle times across departments.", size: "md" },
    { statement: "Connected teams.", detail: "Single source of truth across ERP, CRM, and cloud services.", size: "md" },
    { statement: "Better customer experiences.", detail: "Instantaneous, omnichannel communication and self-service.", size: "lg" },
    { statement: "Room to scale.", detail: "Architecture built to absorb exponential transaction volume.", size: "xl" },
  ];

  return (
    <section className="py-24 md:py-32 bg-white text-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-[#0454FF] border border-blue-100 px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider mb-4">
            <span>MEASURABLE IMPACT</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight">
            Better Systems Create{" "}
            <span className="text-[#0454FF]">Better Businesses.</span>
          </h2>
        </div>

        {/* Dynamic Asymmetric Editorial Composition */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          {/* Tile 1: Less Friction (Large) */}
          <div className="md:col-span-7 bg-[#0B0F19] text-white rounded-3xl p-8 sm:p-12 flex flex-col justify-between border border-slate-800 shadow-xl group hover:border-[#0454FF] transition-all">
            <span className="text-xs font-mono uppercase tracking-widest text-[#0454FF] mb-8 font-bold">
              01 • OPERATIONAL EFFICIENCY
            </span>
            <div>
              <h3 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 group-hover:text-blue-400 transition-colors">
                Less friction.
              </h3>
              <p className="text-slate-300 text-sm sm:text-base max-w-lg leading-relaxed">
                By automating repetitive tasks and unifying disparate systems, your team stops wasting hours chasing spreadsheets and focuses entirely on high-value execution.
              </p>
            </div>
          </div>

          {/* Tile 2: Faster Operations (Medium) */}
          <div className="md:col-span-5 bg-slate-50 border border-slate-200/80 rounded-3xl p-8 sm:p-10 flex flex-col justify-between hover:bg-white hover:border-[#0454FF]/40 hover:shadow-md transition-all">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-6 font-bold">
              02 • EXECUTION SPEED
            </span>
            <div>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight mb-3">
                Faster operations.
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Order fulfillment, invoice generation, customer intake, and reporting happen in real time with event-driven automation.
              </p>
            </div>
          </div>

          {/* Tile 3: Connected Teams (Medium) */}
          <div className="md:col-span-5 bg-slate-50 border border-slate-200/80 rounded-3xl p-8 sm:p-10 flex flex-col justify-between hover:bg-white hover:border-[#0454FF]/40 hover:shadow-md transition-all">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-6 font-bold">
              03 • DATA INTEGRITY
            </span>
            <div>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight mb-3">
                Connected teams.
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Zero data silos. Sales, finance, operations, and support work from the exact same real-time operational context.
              </p>
            </div>
          </div>

          {/* Tile 4: Better Customer Experiences (Large) */}
          <div className="md:col-span-7 bg-[#0454FF] text-white rounded-3xl p-8 sm:p-12 flex flex-col justify-between shadow-xl">
            <span className="text-xs font-mono uppercase tracking-widest text-blue-200 mb-8 font-bold">
              04 • RETENTION &amp; LOYALTY
            </span>
            <div>
              <h3 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
                Better customer experiences.
              </h3>
              <p className="text-blue-100 text-sm sm:text-base max-w-lg leading-relaxed">
                Provide instant answers across preferred communication channels with intelligent routing and unified conversational history.
              </p>
            </div>
          </div>

          {/* Tile 5: Room to scale (Full-width Banner) */}
          <div className="md:col-span-12 bg-slate-950 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
            <div className="max-w-2xl">
              <span className="text-xs font-mono uppercase tracking-widest text-[#0454FF] block mb-2 font-bold">
                05 • ENTERPRISE SCALABILITY
              </span>
              <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
                Room to scale.
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Our modular enterprise architectures handle 10x spikes in transaction volume without performance degradation or system fragility.
              </p>
            </div>
            <Link
              href="/contact"
              className="flex-shrink-0 bg-[#0454FF] hover:bg-[#003ECC] text-white px-6 py-3.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 group self-start sm:self-auto"
            >
              <span>Build for Scale</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
