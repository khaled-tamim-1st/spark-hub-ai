import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { MessageSquare, ExternalLink, Cpu, Layers, CheckCircle2, Sparkles, Database, Shield, Zap, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Proprietary Digital Products & Platforms",
  description:
    "Explore our proprietary enterprise software products and technology accelerators built to solve recurring operational and customer experience challenges.",
};

export default function DigitalProductsPage() {
  return (
    <div className="bg-white text-slate-900 min-h-screen flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        {/* Page Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-100 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles size={13} />
              <span>Technology Ecosystem</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.12] mb-6">
              Products Built From Real-World Business Challenges.
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed">
              Our product capabilities complement our solutions practice, allowing us to turn recurring business challenges into scalable digital platforms.
            </p>
          </div>
        </section>

        {/* Featured Flagship Product: ECO CX */}
        <section id="ecocx" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 scroll-mt-28">
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-14 border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/15 blur-[120px] pointer-events-none" />

            <div className="relative z-10">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div className="inline-flex items-center gap-2 bg-blue-900/60 border border-blue-700/80 text-blue-300 px-3.5 py-1.5 rounded-full text-xs font-bold font-mono">
                  FEATURED PROPRIETARY PLATFORM
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  Product Ecosystem #01
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg">
                      <MessageSquare size={28} />
                    </div>
                    <div>
                      <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">ECO CX</h2>
                      <p className="text-sm sm:text-base font-semibold text-blue-400">
                        Enterprise Customer Experience & Communication Suite
                      </p>
                    </div>
                  </div>

                  <p className="text-slate-300 text-base leading-relaxed">
                    ECO CX is an enterprise-grade omnichannel communication engine designed to help high-volume businesses unify, manage, and automate customer conversations across modern messaging channels.
                  </p>

                  <div className="space-y-3 text-sm text-slate-300">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
                      <span><strong>Unified Multi-Channel Inbox:</strong> Consolidates WhatsApp, Instagram, web chat, and social messaging into a centralized agent workspace.</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
                      <span><strong>Automated Routing & AI Triage:</strong> Automatically identifies intent, routes high-priority VIP leads, and resolves standard inquiries.</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
                      <span><strong>Deep ERP & CRM Interoperability:</strong> Syncs directly with existing commercial databases for instantaneous customer order context.</span>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                    <a
                      href="https://ecocx.ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
                    >
                      <span>Visit Dedicated ECO CX Website</span>
                      <ExternalLink size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                    <span className="text-xs text-slate-400 text-center sm:text-left">
                      Access complete feature documentation & product demos at ecocx.ai
                    </span>
                  </div>
                </div>

                {/* Architecture Visual */}
                <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-3">
                    ECO CX Core Architecture
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare size={16} className="text-blue-400" />
                        <span className="font-bold text-slate-200">Omnichannel Gateway</span>
                      </div>
                      <span className="text-slate-400 font-mono">WhatsApp • Web • Social</span>
                    </div>

                    <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap size={16} className="text-blue-400" />
                        <span className="font-bold text-slate-200">Automated Pipeline Engine</span>
                      </div>
                      <span className="text-slate-400 font-mono">Rule-based + AI Routing</span>
                    </div>

                    <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Database size={16} className="text-indigo-400" />
                        <span className="font-bold text-slate-200">Enterprise Data Sync</span>
                      </div>
                      <span className="text-slate-400 font-mono">REST API • Webhooks</span>
                    </div>

                    <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield size={16} className="text-emerald-400" />
                        <span className="font-bold text-slate-200">Security & RBAC</span>
                      </div>
                      <span className="text-emerald-400 font-mono">Encrypted & Audited</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Modular Ecosystem / Additional Accelerators */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h3 className="text-2xl font-extrabold text-slate-950 tracking-tight mb-2">
              Modular Enterprise Accelerators
            </h3>
            <p className="text-slate-600 text-sm">
              Proprietary internal libraries and pre-engineered modules that reduce delivery timelines for our custom client engagements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div id="connectors" className="bg-slate-50 border border-slate-200/80 rounded-3xl p-7 flex flex-col justify-between scroll-mt-28">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-blue-600 flex items-center justify-center mb-6 shadow-2xs">
                  <Database size={24} />
                </div>
                <h4 className="text-lg font-bold text-slate-950 mb-2">
                  Unified Data Connectors
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  Pre-validated bi-directional connectors for leading ERPs, CRMs, logistics carriers, and payment gateways.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-blue-600">
                Integration Accelerator
              </span>
            </div>

            <div id="frameworks" className="bg-slate-50 border border-slate-200/80 rounded-3xl p-7 flex flex-col justify-between scroll-mt-28">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-blue-600 flex items-center justify-center mb-6 shadow-2xs">
                  <Cpu size={24} />
                </div>
                <h4 className="text-lg font-bold text-slate-950 mb-2">
                  Workflow Orchestration Engines
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  Resilient event-driven workflow templates that manage multi-step business transactions with automated retry and rollback logic.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-blue-600">
                Automation Accelerator
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-7 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-blue-600 flex items-center justify-center mb-6 shadow-2xs">
                  <Shield size={24} />
                </div>
                <h4 className="text-lg font-bold text-slate-950 mb-2">
                  Enterprise Security & Auth Middleware
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  Turnkey SAML/SSO, granular role-based permissions, and immutable audit-logging modules ready for regulated environments.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-blue-600">
                Security Accelerator
              </span>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <div className="bg-slate-950 text-white rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
            <div>
              <h3 className="text-2xl font-bold mb-2">
                Looking to deploy a custom platform or integrate ECO CX?
              </h3>
              <p className="text-slate-400 text-sm">
                Our solutions engineering team can help determine the optimal architecture for your infrastructure.
              </p>
            </div>
            <Link
              href="/contact"
              className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 group"
            >
              <span>Speak with Our Platform Team</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
