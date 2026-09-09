import Link from "next/link";
import { ArrowRight, RefreshCw, Code2, Bot, Network, Users } from "lucide-react";

const pillars = [
  {
    id: "transformation",
    icon: RefreshCw,
    title: "Digital Transformation",
    tagline: "Modernize legacy environments, processes, and technology ecosystems.",
    description:
      "We help established organizations transition from rigid legacy workflows to modern, cloud-native architectures that reduce operational risk and increase market agility.",
    outcomes: ["Cloud Architecture Modernization", "Legacy Decoupling", "Operational Governance"],
  },
  {
    id: "custom-software",
    icon: Code2,
    title: "Custom Software & Platforms",
    tagline: "Build scalable software, portals, platforms, and internal systems.",
    description:
      "When commercial software falls short, we engineer bespoke web platforms, enterprise portals, and internal management tools tailored precisely to your operational workflows.",
    outcomes: ["B2B Portals & Internal Tools", "High-Concurrency Web Systems", "Secure API Architecture"],
  },
  {
    id: "automation",
    icon: Bot,
    title: "Intelligent Automation",
    tagline: "Automate repetitive processes and leverage practical AI.",
    description:
      "We design resilient workflow pipelines that eliminate manual data entry, reduce human error, and embed artificial intelligence where it creates verifiable operational efficiency.",
    outcomes: ["End-to-End Workflow Pipelines", "Automated Document Processing", "AI-Assisted Operations"],
  },
  {
    id: "integration",
    icon: Network,
    title: "Systems Integration",
    tagline: "Connect ERP, CRM, billing, and operational systems.",
    description:
      "We build robust synchronization bridges between isolated platforms—ensuring seamless, bidirectional data flow between core databases, financial systems, and communication channels.",
    outcomes: ["Cross-Platform Sync (ERP/CRM)", "Event-Driven Middleware", "Unified Data Lakes"],
  },
  {
    id: "cx",
    icon: Users,
    title: "Customer Experience Architecture",
    tagline: "Design connected customer journeys and communication systems.",
    description:
      "We architect omnichannel communication systems and self-service portals that improve customer retention, accelerate resolution times, and elevate brand loyalty.",
    outcomes: ["Omnichannel Routing", "Self-Service Portals", "Customer Lifecycle Workflows"],
  },
];

export default function WhatWeDo() {
  return (
    <section className="py-20 md:py-28 bg-white text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              Core Solutions
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight">
              From Business Challenge to Working Solution.
            </h2>
          </div>
          <p className="text-slate-600 text-sm sm:text-base max-w-md">
            We deliver targeted solution pillars designed to resolve distinct operational bottlenecks and create scalable enterprise capability.
          </p>
        </div>

        {/* 5 Solution Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            const isWide = idx === 3 || idx === 4;
            return (
              <div
                key={p.id}
                className={`bg-slate-50/70 border border-slate-200/80 rounded-3xl p-7 sm:p-8 hover:bg-white hover:border-blue-500/40 hover:shadow-lg transition-all flex flex-col justify-between group ${
                  isWide ? "lg:col-span-1.5" : ""
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-white text-blue-600 border border-slate-200 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-2xs">
                      <Icon size={24} />
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-400">
                      0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-950 mb-2">
                    {p.title}
                  </h3>
                  <p className="text-xs font-bold text-blue-600 mb-4">
                    {p.tagline}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                    {p.description}
                  </p>
                </div>

                <div>
                  <div className="pt-4 border-t border-slate-200/80 space-y-1.5 mb-6">
                    {p.outcomes.map((item) => (
                      <div key={item} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    href={`/solutions#${p.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors"
                  >
                    <span>Explore Capability</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Link */}
        <div className="text-center">
          <Link
            href="/solutions"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline"
          >
            <span>View All Business & Technology Solutions In Detail</span>
            <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </section>
  );
}
