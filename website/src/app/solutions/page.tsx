import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { ArrowRight, RefreshCw, Code2, Bot, Network, Users, Compass, CheckCircle2, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Business & Technology Solutions",
  description:
    "We combine strategic thinking, software engineering, automation, integration, and digital experience to solve complex operational challenges.",
};

const solutions = [
  {
    id: "transformation",
    icon: RefreshCw,
    number: "01",
    title: "Digital Transformation & Enterprise Strategy",
    tagline: "Modernize legacy environments, processes, and technology ecosystems.",
    challenge:
      "Organizations often accumulate years of technical debt and rigid operational habits, making it slow, expensive, and risky to launch new digital initiatives or adapt to market changes.",
    whatWeDo:
      "We conduct comprehensive technical audits, decouple outdated monolithic architectures, design cloud-native systems, and construct phased transformation roadmaps that minimize disruption to ongoing revenue operations.",
    outcomes: [
      "Modernized cloud-native infrastructure with low maintenance overhead.",
      "Eliminated technical debt and architectural bottlenecks.",
      "Accelerated time-to-market for new digital initiatives.",
    ],
  },
  {
    id: "custom-software",
    icon: Code2,
    number: "02",
    title: "Custom Enterprise Software & Platforms",
    tagline: "Build scalable software, portals, and internal systems around specific business requirements.",
    challenge:
      "Commercial SaaS solutions often force companies to compromise on their unique workflows, resulting in fragmented spreadsheet workarounds and disconnected team operations.",
    whatWeDo:
      "We engineer bespoke enterprise web platforms, partner and client portals, internal operating systems, and API-first tools tailored strictly around your proprietary business logic.",
    outcomes: [
      "Software that mirrors and accelerates your exact operational model.",
      "Secure, scalable cloud applications with enterprise access controls.",
      "Proprietary digital IP that provides a lasting competitive advantage.",
    ],
  },
  {
    id: "automation",
    icon: Bot,
    number: "03",
    title: "Intelligent Process Automation & AI",
    tagline: "Automate repetitive processes and leverage practical AI where it creates real value.",
    challenge:
      "Knowledge workers spend significant hours copying data between systems, verifying documents manually, and chasing routine status approvals, leading to high operational costs and human errors.",
    whatWeDo:
      "We architect event-driven automation workflows, intelligent document processing pipelines, and AI-assisted decisioning engines that eliminate manual friction across operations.",
    outcomes: [
      "Significant reduction in manual data handling and turnaround times.",
      "Zero human transcription error across core operational transactions.",
      "Freeing high-value staff to focus on strategic client growth.",
    ],
  },
  {
    id: "integration",
    icon: Network,
    number: "04",
    title: "Systems Integration & Middleware Architecture",
    tagline: "Connect ERP, CRM, billing, and operational systems into cohesive workflows.",
    challenge:
      "Critical business data is trapped in isolated departmental silos (ERP, CRM, accounting, inventory, support), preventing real-time cross-functional visibility.",
    whatWeDo:
      "We build resilient, event-driven API middleware and secure synchronization pipelines that connect disparate cloud and on-premise systems into a unified operational ecosystem.",
    outcomes: [
      "Real-time bidirectional data synchronization across the enterprise.",
      "A single source of truth for operations, finance, and customer service.",
      "Eliminated double-entry and cross-system discrepancies.",
    ],
  },
  {
    id: "cx",
    icon: Users,
    number: "05",
    title: "Customer Experience (CX) & Omnichannel Architecture",
    tagline: "Design connected customer journeys, communication systems, and engagement layers.",
    challenge:
      "Customers demand instantaneous, personalized responses across multiple digital channels, yet support teams struggle with fragmented inboxes and slow resolution times.",
    whatWeDo:
      "We architect centralized omnichannel communication hubs, intelligent routing engines, and automated self-service portals (including integration with specialized platforms like our proprietary ECO CX platform).",
    outcomes: [
      "Unified customer communication history across all touchpoints.",
      "Faster first-response times and automated routine inquiry handling.",
      "Higher customer satisfaction (CSAT) and elevated lifetime value (LTV).",
    ],
  },
  {
    id: "advisory",
    icon: Compass,
    number: "06",
    title: "Technology Advisory & Architecture Consulting",
    tagline: "Strategic guidance for executive leaders navigating complex technology decisions.",
    challenge:
      "Selecting the wrong software stack, cloud vendor, or architecture design can cost organizations hundreds of thousands of dollars and months of wasted engineering effort.",
    whatWeDo:
      "We serve as trusted technical advisors to C-suite and VP leadership—providing technology due diligence, vendor evaluation, enterprise architecture design, and technical governance.",
    outcomes: [
      "Clarity on technical feasibility, total cost of ownership (TCO), and ROI.",
      "Vendor-neutral architectural blueprints and technology roadmaps.",
      "De-risked engineering investments and vendor commitments.",
    ],
  },
];

export default function SolutionsPage() {
  return (
    <div className="bg-white text-slate-900 min-h-screen flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        {/* Page Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-100 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles size={13} />
              <span>Business & Technology Solutions</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.12] mb-6">
              Technology Solutions Designed Around Your Business.
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed">
              We combine strategic thinking, software engineering, automation, integration, and digital experience to solve complex operational challenges.
            </p>
          </div>
        </section>

        {/* Solutions Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {solutions.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.id}
                  id={s.id}
                  className="bg-slate-50/80 border border-slate-200/80 rounded-3xl p-8 sm:p-12 transition-all hover:border-blue-500/30 hover:bg-white hover:shadow-lg scroll-mt-28"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Column 1: Title & Tagline */}
                    <div className="lg:col-span-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                          <Icon size={24} />
                        </div>
                        <span className="text-sm font-mono font-bold text-slate-400">
                          {s.number}
                        </span>
                      </div>
                      <h2 className="text-2xl font-extrabold text-slate-950 tracking-tight mb-2">
                        {s.title}
                      </h2>
                      <p className="text-xs sm:text-sm font-bold text-blue-600 mb-4">
                        {s.tagline}
                      </p>
                    </div>

                    {/* Column 2: Challenge -> Solution -> Outcome */}
                    <div className="lg:col-span-8 space-y-6">
                      
                      {/* Challenge */}
                      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
                        <span className="text-xs font-bold uppercase tracking-wider text-red-600 block mb-1">
                          The Business Challenge
                        </span>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                          {s.challenge}
                        </p>
                      </div>

                      {/* What We Do */}
                      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
                          What We Do (Our Solution)
                        </span>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                          {s.whatWeDo}
                        </p>
                      </div>

                      {/* Business Outcomes */}
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block mb-3">
                          Measurable Business Outcomes
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {s.outcomes.map((out, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                              <CheckCircle2 size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
                              <span>{out}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Action CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <div className="bg-slate-950 text-white rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
            <div>
              <h3 className="text-2xl font-bold mb-2">
                Have a specific operational challenge in mind?
              </h3>
              <p className="text-slate-400 text-sm">
                Our senior solution architects can evaluate your systems and provide a structured technical recommendation.
              </p>
            </div>
            <Link
              href="/contact"
              className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 group"
            >
              <span>Schedule Architecture Discussion</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
