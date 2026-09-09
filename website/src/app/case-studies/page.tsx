import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { Sparkles, ArrowRight, CheckCircle2, Layers, RefreshCw, Bot, Network, ShoppingBag } from "lucide-react";

export const metadata: Metadata = {
  title: "Case Studies & Architectural Impact",
  description:
    "Explore how we solve complex business and operational challenges through strategic consulting, custom software, and intelligent automation.",
};

const caseStudies = [
  {
    id: "omnichannel-retail",
    sector: "Retail & E-Commerce",
    icon: ShoppingBag,
    title: "Unifying Disjointed Customer Communication & Inventory Streams for Multi-Branch Retail",
    challenge:
      "A high-growth multi-branch retailer struggled with fragmented customer inquiries across WhatsApp, Instagram, and web chat. Inventory counts between warehouses and physical storefronts drifted constantly, causing order cancellations and customer frustration.",
    approach:
      "We mapped all customer communication touchpoints and inventory reconciliation workflows. We designed an event-driven integration layer connecting their core ERP with automated messaging channels.",
    solution:
      "Engineered an omnichannel customer routing system combined with real-time bidirectional inventory synchronization webhooks and automated status notifications.",
    outcomes: [
      "Eliminated manual inventory stock checks across channels.",
      "Accelerated customer inquiry resolution through unified agent inboxes.",
      "Reduced stockout-related order cancellations and elevated customer trust.",
    ],
  },
  {
    id: "financial-onboarding",
    sector: "Financial Services",
    icon: Network,
    title: "Modernizing Enterprise Client Onboarding & Compliance Pipelines",
    challenge:
      "An enterprise financial services firm was losing qualified institutional clients due to a 7-day manual document review cycle that required multiple manual data re-entries across legacy core databases.",
    approach:
      "We conducted a security and compliance audit, identified document verification bottlenecks, and blueprinted an encrypted automated onboarding pipeline with strict role-based access control.",
    solution:
      "Built a secure client onboarding portal integrated with automated identity validation, audit-logging microservices, and direct API adapters into their legacy database.",
    outcomes: [
      "Condensed onboarding cycle times from days to hours.",
      "Achieved 100% automated audit traceability for all compliance submissions.",
      "Eliminated human transcription error in high-value account setups.",
    ],
  },
  {
    id: "logistics-dispatch",
    sector: "Logistics & Supply Chain",
    icon: Bot,
    title: "Automating Multi-Carrier Dispatch & Real-Time Tracking Middleware",
    challenge:
      "A regional logistics provider managed hundreds of daily dispatches using disconnected carrier portals and spreadsheets, resulting in frequent dispatch delays and high support call volume.",
    approach:
      "We architected a centralized carrier integration middleware that normalizes disparate carrier APIs into a unified dispatch pipeline and automated event tracking framework.",
    solution:
      "Engineered a custom dispatch orchestration engine with automated carrier rate selection, real-time webhook ingestion, and automated tracking alerts for end recipients.",
    outcomes: [
      "Centralized multi-carrier operations into a single operational view.",
      "Eliminated repetitive 'Where is my order?' phone calls through automated alerts.",
      "Streamlined dispatch operations without increasing back-office headcount.",
    ],
  },
];

export default function CaseStudiesPage() {
  return (
    <div className="bg-white text-slate-900 min-h-screen flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        {/* Page Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-100 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles size={13} />
              <span>Problem Solving & Impact</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.12] mb-6">
              Explore How We Solve Complex Business Challenges.
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed">
              Real business problems require thoughtful system architecture. Explore representative engagement models illustrating how our business-first engineering creates measurable operational value.
            </p>
          </div>
        </section>

        {/* Case Studies List */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {caseStudies.map((cs) => {
              const Icon = cs.icon;
              return (
                <div
                  key={cs.id}
                  className="bg-slate-50/80 border border-slate-200/80 rounded-3xl p-8 sm:p-12 hover:bg-white hover:border-blue-500/30 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-200/80">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-2xs">
                        <Icon size={20} />
                      </div>
                      <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">
                        {cs.sector}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-400">
                      Representative Architectural Case
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight mb-8">
                    {cs.title}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Challenge */}
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs">
                      <span className="text-xs font-bold uppercase tracking-wider text-red-600 block mb-2">
                        01. The Challenge
                      </span>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        {cs.challenge}
                      </p>
                    </div>

                    {/* Approach */}
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block mb-2">
                        02. Our Strategic Approach
                      </span>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        {cs.approach}
                      </p>
                    </div>

                    {/* Solution */}
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-2">
                        03. Engineered Solution
                      </span>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        {cs.solution}
                      </p>
                    </div>
                  </div>

                  {/* Measurable Outcomes */}
                  <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-900 block mb-3">
                      Measurable Business Outcomes
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {cs.outcomes.map((outcome, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-800 font-medium">
                          <CheckCircle2 size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
                          <span>{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <div className="bg-slate-950 text-white rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
            <div>
              <h3 className="text-2xl font-bold mb-2">
                Have an operational challenge that needs solving?
              </h3>
              <p className="text-slate-400 text-sm">
                Discuss your business objectives and current workflows with our senior technology team.
              </p>
            </div>
            <Link
              href="/contact"
              className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 group"
            >
              <span>Schedule an Assessment</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
