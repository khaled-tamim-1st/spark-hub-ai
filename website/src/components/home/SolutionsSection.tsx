"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, RefreshCw, Code2, Bot, Network, Users, CheckCircle2, ChevronRight, Layers } from "lucide-react";

const solutions = [
  {
    number: "01",
    id: "transformation",
    icon: RefreshCw,
    title: "Digital Transformation",
    tagline: "Modernize legacy environments, processes, and technology ecosystems.",
    description:
      "We replace brittle legacy software and fragmented workflows with resilient, cloud-native architectures that reduce operating risk and accelerate market agility.",
    outcomes: ["Cloud Architecture Modernization", "Legacy Decoupling", "Operational Agility"],
    visualType: "layers",
  },
  {
    number: "02",
    id: "custom-software",
    icon: Code2,
    title: "Custom Software & Platforms",
    tagline: "Build scalable software, portals, and internal operating systems.",
    description:
      "When commercial SaaS forces you to compromise, we build bespoke web platforms, partner portals, and internal operating systems tailored strictly to your proprietary business logic.",
    outcomes: ["B2B Portals & Internal Systems", "API-First Architecture", "Proprietary IP"],
    visualType: "modular",
  },
  {
    number: "03",
    id: "automation",
    icon: Bot,
    title: "Intelligent Automation & AI",
    tagline: "Automate repetitive processes and use AI where it creates real value.",
    description:
      "We design automated event pipelines, intelligent document processing, and AI-assisted decisioning engines that eliminate manual friction across operations.",
    outcomes: ["Event-Driven Pipelines", "Document & Data Extraction", "Reduced Error Rates"],
    visualType: "flows",
  },
  {
    number: "04",
    id: "integration",
    icon: Network,
    title: "Systems Integration",
    tagline: "Connect ERP, CRM, billing, and operational systems.",
    description:
      "We build resilient synchronization middleware that establishes a single source of truth across your ERP, CRM, databases, and customer communication channels.",
    outcomes: ["Bi-directional Data Sync", "Cross-Platform Orchestration", "Zero Siloed Data"],
    visualType: "mesh",
  },
  {
    number: "05",
    id: "cx",
    icon: Users,
    title: "Customer Experience (CX)",
    tagline: "Design connected customer journeys and communication architectures.",
    description:
      "We architect omnichannel communication systems and self-service portals that improve customer retention, accelerate resolution times, and elevate brand loyalty.",
    outcomes: ["Omnichannel Routing", "Self-Service Portals", "Lifecycle Automation"],
    visualType: "journey",
  },
];

export default function SolutionsSection() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(0);

  return (
    <section className="py-24 md:py-32 bg-white text-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-[#0454FF] border border-blue-100 px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider mb-4">
              <span>CORE CAPABILITIES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight">
              We Turn Business Complexity Into{" "}
              <span className="text-[#0454FF]">Working Systems.</span>
            </h2>
          </div>
          <p className="text-slate-600 text-sm sm:text-base max-w-md">
            We don&apos;t build technology in a vacuum. We engineer targeted, enterprise-grade capabilities that solve specific operational bottlenecks and scale seamlessly.
          </p>
        </div>

        {/* Dynamic Numbered Solution Blocks */}
        <div className="space-y-4 mb-16">
          {solutions.map((sol, idx) => {
            const Icon = sol.icon;
            const isHovered = hoveredIdx === idx;
            return (
              <div
                key={sol.id}
                onMouseEnter={() => setHoveredIdx(idx)}
                className={`rounded-3xl p-6 sm:p-8 transition-all duration-300 border cursor-pointer ${
                  isHovered
                    ? "bg-[#0B0F19] text-white border-[#0454FF] shadow-xl"
                    : "bg-slate-50/80 text-slate-900 border-slate-200/80 hover:bg-slate-100/80"
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  
                  {/* Col 1: Number & Icon */}
                  <div className="lg:col-span-3 flex items-center gap-4">
                    <span className={`text-3xl sm:text-4xl font-mono font-extrabold transition-colors ${
                      isHovered ? "text-[#0454FF]" : "text-slate-400"
                    }`}>
                      {sol.number}
                    </span>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                      isHovered ? "bg-[#0454FF] text-white" : "bg-white text-[#0454FF] border border-slate-200 shadow-2xs"
                    }`}>
                      <Icon size={24} />
                    </div>
                  </div>

                  {/* Col 2: Title & Description */}
                  <div className="lg:col-span-6 space-y-2">
                    <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                      {sol.title}
                    </h3>
                    <p className={`text-xs font-mono font-bold ${
                      isHovered ? "text-blue-400" : "text-[#0454FF]"
                    }`}>
                      {sol.tagline}
                    </p>
                    <p className={`text-xs sm:text-sm leading-relaxed ${
                      isHovered ? "text-slate-300" : "text-slate-600"
                    }`}>
                      {sol.description}
                    </p>
                  </div>

                  {/* Col 3: Outcomes & Action */}
                  <div className="lg:col-span-3 flex flex-col justify-between items-start lg:items-end gap-4">
                    <div className="space-y-1.5 hidden sm:block">
                      {sol.outcomes.map((out) => (
                        <div key={out} className="flex items-center gap-2 text-xs font-mono">
                          <CheckCircle2 size={13} className={isHovered ? "text-emerald-400" : "text-[#0454FF]"} />
                          <span className={isHovered ? "text-slate-200" : "text-slate-700"}>{out}</span>
                        </div>
                      ))}
                    </div>

                    <Link
                      href={`/solutions#${sol.id}`}
                      className={`inline-flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl transition-all ${
                        isHovered
                          ? "bg-[#0454FF] text-white hover:bg-[#003ECC]"
                          : "bg-white text-slate-900 border border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <span>Explore Capability</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
