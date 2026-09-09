"use client";

import { useState } from "react";
import { Search, Compass, Cpu, LineChart, CheckCircle2, ArrowRight } from "lucide-react";

const steps = [
  {
    num: "01",
    name: "Understand",
    icon: Search,
    headline: "Diagnostic & Commercial Discovery",
    desc: "We analyze your business model, revenue mechanics, operational bottlenecks, team workflows, and technical debt before recommending any technical architecture.",
    deliverables: ["Operational Workflow Audit", "Bottleneck Root-Cause Analysis", "Commercial ROI Blueprint"],
  },
  {
    num: "02",
    name: "Architect",
    icon: Compass,
    headline: "System Design & Integration Roadmap",
    desc: "We design the complete system blueprint, data models, API endpoints, security controls, and a phased execution roadmap that avoids operational disruption.",
    deliverables: ["Enterprise System Architecture", "Data Flow & API Contracts", "Risk-Mitigated Roadmap"],
  },
  {
    num: "03",
    name: "Build",
    icon: Cpu,
    headline: "Agile Engineering & Integration",
    desc: "Our senior engineering team develops resilient software, connects existing ERP/CRM systems, configures automated pipelines, and performs rigorous end-to-end testing.",
    deliverables: ["Production-Grade Codebase", "Zero-Downtime Data Sync", "Automated QA & Security Audits"],
  },
  {
    num: "04",
    name: "Evolve",
    icon: LineChart,
    headline: "Continuous Optimization & Scale",
    desc: "We monitor production latency, optimize workflows based on user feedback, and iterate capabilities to ensure your digital ecosystem effortlessly scales with growth.",
    deliverables: ["Production Performance Telemetry", "User Adoption Support", "Quarterly Scaling Reviews"],
  },
];

export default function HowWeThink() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="py-24 md:py-32 bg-[#F8FAFC] border-y border-slate-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-[#0454FF] border border-blue-100 px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider mb-4">
            <span>OUR METHODOLOGY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight mb-6">
            We Start With the Business.{" "}
            <span className="text-[#0454FF]">Then We Build the Technology.</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Successful digital solutions fail when technology is built in isolation. Our structured four-stage framework ensures every engineering decision directly supports your commercial objectives.
          </p>
        </div>

        {/* Process Stepper Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isActive = activeTab === idx;
            return (
              <button
                key={s.num}
                onClick={() => setActiveTab(idx)}
                className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#0454FF] text-white border-[#0454FF] shadow-lg shadow-[#0454FF]/20"
                    : "bg-white text-slate-700 border-slate-200/80 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-mono font-bold ${isActive ? "text-blue-200" : "text-slate-400"}`}>
                    STAGE {s.num}
                  </span>
                  <Icon size={18} className={isActive ? "text-white" : "text-[#0454FF]"} />
                </div>
                <h3 className={`text-base font-extrabold ${isActive ? "text-white" : "text-slate-950"}`}>
                  {s.name}
                </h3>
              </button>
            );
          })}
        </div>

        {/* Dynamic Detail Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#0454FF]">
                <span>PHASE {steps[activeTab].num} • {steps[activeTab].name}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                {steps[activeTab].headline}
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {steps[activeTab].desc}
              </p>
            </div>

            <div className="lg:col-span-5 bg-slate-50 border border-slate-200/80 rounded-2xl p-6 space-y-3">
              <div className="text-xs font-mono font-bold uppercase text-slate-500 tracking-wider mb-2">
                Key Phase Deliverables:
              </div>
              {steps[activeTab].deliverables.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-slate-800">
                  <CheckCircle2 size={16} className="text-[#0454FF] flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
