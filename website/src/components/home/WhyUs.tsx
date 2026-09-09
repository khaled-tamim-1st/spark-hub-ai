import { Target, Award, GitMerge, Users2 } from "lucide-react";

const principles = [
  {
    icon: Target,
    title: "Business-First Thinking",
    description: "We begin with your revenue model, cost structures, and operational bottlenecks—not technical jargon. Every line of architecture serves a business goal.",
  },
  {
    icon: Award,
    title: "Engineering Excellence",
    description: "We design resilient, secure, and maintainable software systems built according to modern enterprise standards and architectural best practices.",
  },
  {
    icon: GitMerge,
    title: "Integration Over Isolation",
    description: "We do not create isolated software islands. Our solutions are built from the ground up to integrate seamlessly with your existing enterprise tech stack.",
  },
  {
    icon: Users2,
    title: "Long-Term Partnership",
    description: "We act as an extension of your leadership and technical organization—continuously evolving and optimizing your systems as your enterprise scales.",
  },
];

export default function WhyUs() {
  return (
    <section className="py-20 md:py-28 bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-900/50 border border-blue-700/60 text-blue-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            Why Partner With Us
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-6">
            A Technology Partner Built Around Business Outcomes.
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            We reject the transactional vendor model. We build strategic, engineering-led partnerships with decision-makers who value reliability, technical rigor, and commercial impact.
          </p>
        </div>

        {/* 4 Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {principles.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-7 hover:border-blue-500/40 transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-800 text-blue-400 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">
                  {p.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {p.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
