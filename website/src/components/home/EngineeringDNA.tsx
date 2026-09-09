import { Layers, ShieldCheck, Cpu, Database, Workflow, Smartphone, Server } from "lucide-react";

export default function EngineeringDNA() {
  const stackLayers = [
    { num: "01", name: "Commercial Strategy", icon: Workflow, desc: "Revenue models, unit economics, and operational KPI alignment." },
    { num: "02", name: "Experience Architecture", icon: Smartphone, desc: "Omnichannel customer messaging, self-service portals, and UX." },
    { num: "03", name: "Application Engineering", icon: Layers, desc: "Custom web platforms, B2B portals, and internal management tools." },
    { num: "04", name: "Intelligent Automation", icon: Cpu, desc: "Event-driven workflow engines, exception handling, and AI triage." },
    { num: "05", name: "Unified Data Layer", icon: Database, desc: "Zero-silo data lakes, normalized schemas, and single sources of truth." },
    { num: "06", name: "Enterprise Infrastructure", icon: Server, desc: "SOC2 compliance, encrypted API gateways, and cloud auto-scaling." },
  ];

  return (
    <section className="py-24 md:py-32 bg-[#0B0F19] text-white relative overflow-hidden">
      <div className="absolute top-1/2 right-10 w-80 h-80 bg-[#0454FF]/10 blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-900/50 border border-blue-700/60 text-blue-300 px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider mb-4">
            <span>ENGINEERING RIGOR</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white mb-6">
            Built With Engineering Discipline.{" "}
            <span className="text-[#0454FF]">Designed for Business.</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            We architect comprehensive digital ecosystems from the underlying cloud infrastructure up to the final executive and customer interfaces.
          </p>
        </div>

        {/* Visual Architecture Layer Stack */}
        <div className="space-y-3 max-w-4xl">
          {stackLayers.map((layer) => {
            const Icon = layer.icon;
            return (
              <div
                key={layer.num}
                className="bg-slate-900/90 border border-slate-800 hover:border-[#0454FF]/60 rounded-2xl p-5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-slate-900"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-950 text-[#0454FF] flex items-center justify-center group-hover:bg-[#0454FF] group-hover:text-white transition-colors flex-shrink-0">
                    <Icon size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider block">
                      LAYER {layer.num}
                    </span>
                    <h3 className="text-base font-extrabold text-white">
                      {layer.name}
                    </h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-400 max-w-md sm:text-right">
                  {layer.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
