import Link from "next/link";
import { ArrowRight, Target, Award, Layers, GitMerge, Users2 } from "lucide-react";

export default function AboutPhilosophy() {
  const principles = [
    { name: "Business First", desc: "Technology serves a clear commercial objective.", icon: Target },
    { name: "Outcome Driven", desc: "Success is measured by impact, not deliverables.", icon: Award },
    { name: "Built to Scale", desc: "Architectures that absorb exponential growth.", icon: Layers },
    { name: "Connected by Design", desc: "Unified digital ecosystems, zero data silos.", icon: GitMerge },
    { name: "Long-Term Thinking", desc: "Strategic capabilities that create enduring value.", icon: Users2 },
  ];

  return (
    <section className="py-24 md:py-32 bg-white text-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-[#0454FF] border border-blue-100 px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider mb-4">
            <span>OPERATING PRINCIPLES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight mb-6">
            We Build Technology Around the Way{" "}
            <span className="text-[#0454FF]">Businesses Actually Work.</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Our firm was established on the conviction that enterprise technology should be straightforward to operate, seamless to integrate, and ruthlessly focused on commercial return.
          </p>
        </div>

        {/* 5 Principles Horizontal/Vertical Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
          {principles.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={p.name}
                className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-6 hover:bg-white hover:border-[#0454FF]/40 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-[#0454FF] flex items-center justify-center group-hover:bg-[#0454FF] group-hover:text-white transition-colors shadow-2xs">
                      <Icon size={20} />
                    </div>
                    <span className="text-xs font-mono text-slate-400 font-bold">0{idx + 1}</span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-950 mb-2">
                    {p.name}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Link to About Us */}
        <div className="text-center">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#0454FF] hover:text-[#003ECC] group"
          >
            <span>Learn More About Our Team &amp; Partnership Approach</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
}
