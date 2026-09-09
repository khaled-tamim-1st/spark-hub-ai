import { Search, Compass, Cpu, LineChart } from "lucide-react";

const steps = [
  {
    step: "01",
    name: "Understand",
    icon: Search,
    title: "Deep Business Discovery",
    description:
      "We analyze your business model, revenue drivers, operational bottlenecks, team workflows, and current technology debt before proposing any technical direction.",
  },
  {
    step: "02",
    name: "Architect",
    icon: Compass,
    title: "Strategic Solution Design",
    description:
      "We design the complete system blueprint, data models, integration touchpoints, security controls, and a phased, risk-mitigated execution roadmap.",
  },
  {
    step: "03",
    name: "Build",
    icon: Cpu,
    title: "Agile Engineering & Integration",
    description:
      "Our senior engineering team develops robust software, builds resilient automated pipelines, connects existing systems, and rigorously tests across edge cases.",
  },
  {
    step: "04",
    name: "Evolve",
    icon: LineChart,
    title: "Optimization & Continuous Growth",
    description:
      "We monitor production metrics, track user adoption, optimize performance bottlenecks, and iterate to ensure the solution scales alongside your enterprise growth.",
  },
];

export default function OurApproach() {
  return (
    <section className="py-20 md:py-28 bg-slate-50 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            Our Delivery Methodology
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight mb-6">
            We Start With the Business. Then We Build the Technology.
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Successful digital solutions fail when technology is built in isolation. Our structured four-stage framework ensures every engineering decision directly supports your core business objectives.
          </p>
        </div>

        {/* 4 Steps Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="bg-white border border-slate-200/80 rounded-3xl p-7 shadow-xs hover:shadow-md hover:border-blue-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-2xl font-mono font-extrabold text-blue-600">
                      {s.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Icon size={20} />
                    </div>
                  </div>

                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Phase {idx + 1} • {s.name}
                  </span>
                  <h3 className="text-lg font-bold text-slate-950 mb-3">
                    {s.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
