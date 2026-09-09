"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Landmark, Building, Truck, Activity, Briefcase, ArrowRight, CheckCircle2, ChevronRight } from "lucide-react";

const industries = [
  {
    id: "retail",
    name: "Retail & E-Commerce",
    icon: ShoppingBag,
    headline: "Unified Multi-Channel Inventory & Customer Operations",
    challenge: "Managing high transaction volumes, multi-channel customer inquiries, and inventory sync drifts between physical branches and online stores.",
    solution: "Omnichannel communication hubs, real-time bidirectional ERP inventory synchronization, and automated order milestone triggers.",
    architecture: ["Omnichannel Routing Hub", "ERP Inventory Sync Webhooks", "Automated Post-Purchase Sequences"],
  },
  {
    id: "fintech",
    name: "Financial Services & FinTech",
    icon: Landmark,
    headline: "Secure Onboarding Pipelines & Compliant Systems Integration",
    challenge: "Strict regulatory governance, manual KYC friction causing account abandonment, and legacy mainframes that resist modern API integration.",
    solution: "Automated document verification workflows, encrypted client intake portals, and secure API adapter middleware.",
    architecture: ["Automated KYC Pipelines", "Role-Based Access Control", "Legacy API Middleware"],
  },
  {
    id: "real-estate",
    name: "Real Estate & PropTech",
    icon: Building,
    headline: "Automated Lead Qualification & Property Management Portals",
    challenge: "Delayed responses to high-value inbound buyer leads, unstructured tracking across portals, and manual tenant maintenance ticketing.",
    solution: "24/7 automated lead routing, CRM inventory synchronization, and self-service tenant request portals.",
    architecture: ["Instant Inbound Lead Triage", "Broker Assignment Logic", "Tenant Self-Service Portals"],
  },
  {
    id: "logistics",
    name: "Logistics & Supply Chain",
    icon: Truck,
    headline: "Dispatch Intelligence & Carrier Integration Middleware",
    challenge: "Operational blind spots across multi-carrier dispatch, manual shipping status lookups, and disconnected legacy software.",
    solution: "Custom carrier integration middleware, automated tracking webhooks, and centralized fleet operational dashboards.",
    architecture: ["Multi-Carrier API Aggregator", "Event Tracking Webhooks", "Real-Time Dispatch Dashboard"],
  },
  {
    id: "healthcare",
    name: "Healthcare & Life Sciences",
    icon: Activity,
    headline: "Patient Engagement Automation & Secure Integration Layers",
    challenge: "High patient appointment drop-offs, redundant intake paperwork, and disjointed medical communication systems.",
    solution: "HIPAA-ready automated appointment workflows, integrated practice management sync, and centralized patient engagement.",
    architecture: ["Automated Appointment Reminders", "Encrypted Patient Intake", "EMR Integration Layer"],
  },
  {
    id: "b2b",
    name: "B2B & Professional Services",
    headline: "Client Collaboration Platforms & Project Lifecycle Systems",
    icon: Briefcase,
    challenge: "Extended sales cycles, manual proposal tracking, and fragmented collaboration between account managers and consulting teams.",
    solution: "Bespoke client collaboration portals, automated billing integrations, and centralized project governance.",
    architecture: ["Client Collaboration Portals", "Milestone Billing Triggers", "Document Execution Pipelines"],
  },
];

export default function IndustryExplorer() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const current = industries[selectedIdx];
  const Icon = current.icon;

  return (
    <section className="py-24 md:py-32 bg-[#F8FAFC] border-y border-slate-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-[#0454FF] border border-blue-100 px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider mb-4">
            <span>SECTOR SPECIALIZATION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight mb-6">
            Solutions Designed Around the Way{" "}
            <span className="text-[#0454FF]">Your Industry Works.</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            We adapt our technology architectures to the operational realities, regulatory standards, and customer dynamics of your specific sector.
          </p>
        </div>

        {/* Interactive Industry Explorer Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Industry List */}
          <div className="lg:col-span-5 space-y-2.5">
            {industries.map((ind, idx) => {
              const IndIcon = ind.icon;
              const isSelected = selectedIdx === idx;
              return (
                <button
                  key={ind.id}
                  onClick={() => setSelectedIdx(idx)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? "bg-[#0B0F19] text-white border-[#0454FF] shadow-lg shadow-blue-950/20"
                      : "bg-white text-slate-700 border-slate-200/80 hover:bg-slate-100/70"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isSelected ? "bg-[#0454FF] text-white" : "bg-blue-50 text-[#0454FF]"
                    }`}>
                      <IndIcon size={18} />
                    </div>
                    <span className={`text-sm font-extrabold ${isSelected ? "text-white" : "text-slate-900"}`}>
                      {ind.name}
                    </span>
                  </div>
                  <ChevronRight size={16} className={isSelected ? "text-[#0454FF]" : "text-slate-400"} />
                </button>
              );
            })}
          </div>

          {/* Right Column: Dynamic Visual & Architecture Panel */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#0454FF] text-white flex items-center justify-center shadow-xs">
                    <Icon size={24} />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-slate-400 font-bold block">SELECTED VERTICAL</span>
                    <h3 className="text-2xl font-extrabold text-slate-950 tracking-tight">
                      {current.name}
                    </h3>
                  </div>
                </div>
                <span className="text-xs font-mono text-[#0454FF] font-bold bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                  ACTIVE BLUEPRINT
                </span>
              </div>

              <h4 className="text-lg font-bold text-slate-900 mb-4">
                {current.headline}
              </h4>

              <div className="space-y-4 mb-8">
                <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-600 block mb-1">
                    Operational Challenge
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {current.challenge}
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0454FF] block mb-1">
                    Targeted Technology Solution
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {current.solution}
                  </p>
                </div>
              </div>

              {/* Architectural Nodes Strip */}
              <div className="mb-8">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block mb-3">
                  Key Solution Components
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {current.architecture.map((item, i) => (
                    <div key={i} className="p-2.5 bg-blue-50/60 border border-blue-100 rounded-xl text-xs font-semibold text-slate-800 flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-[#0454FF] flex-shrink-0" />
                      <span className="truncate">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <Link
                href={`/industries#${current.id}`}
                className="inline-flex items-center gap-2 text-xs font-bold text-[#0454FF] hover:text-[#003ECC] group"
              >
                <span>Read Full {current.name} Breakdown</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/contact"
                className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all"
              >
                Discuss Industry Project
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
