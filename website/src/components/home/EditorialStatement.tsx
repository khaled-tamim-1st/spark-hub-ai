import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function EditorialStatement() {
  return (
    <section className="py-24 md:py-32 bg-[#F8FAFC] border-y border-slate-200/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Massive Statement */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#0454FF] mb-6">
              <span className="w-2 h-2 rounded-full bg-[#0454FF]" />
              <span>THE CORE THESIS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight leading-[1.12]">
              Technology is only valuable when it makes the business{" "}
              <span className="text-[#0454FF] underline decoration-blue-200 underline-offset-8">
                measurably better.
              </span>
            </h2>
          </div>

          {/* Right Column: Editorial Explanation + CTA */}
          <div className="lg:col-span-5 space-y-6 lg:border-l lg:border-slate-200 lg:pl-10">
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-normal">
              Most digital initiatives fail not from a lack of technology, but from a disconnect between technology architecture and commercial reality. We eliminate this friction by engineering software, integrations, and automation directly around bottom-line metrics.
            </p>
            <div>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#0454FF] hover:text-[#003ECC] group"
              >
                <span>Read About Our Engineering Philosophy</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
