import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { Sparkles, Target, Award, GitMerge, Users2, ShieldCheck, ArrowRight, Layers, Compass } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Business & Technology Solutions",
  description:
    "We build technology around the way businesses actually work. Learn about our business-first engineering philosophy, operating principles, and strategic partnership model.",
};

const principles = [
  {
    icon: Target,
    title: "Business Before Technology",
    description:
      "Technology without commercial context is just overhead. We insist on understanding revenue drivers, cost structures, and operational realities before architecting any technical solution.",
  },
  {
    icon: Award,
    title: "Outcomes Over Deliverables",
    description:
      "Success is not measured simply by lines of code written or features shipped. We measure success by tangible operational outcomes—hours saved, latency reduced, and revenue enabled.",
  },
  {
    icon: Layers,
    title: "Built to Scale",
    description:
      "We design resilient, modular architectures that effortlessly absorb growth. Our solutions evolve smoothly as your transaction volume, user base, and organizational complexity expand.",
  },
  {
    icon: GitMerge,
    title: "Connected by Design",
    description:
      "Modern enterprises do not need more isolated tools. We engineer integrated digital ecosystems where every system, database, and workflow communicates seamlessly.",
  },
  {
    icon: Users2,
    title: "Long-Term Thinking",
    description:
      "We build lasting relationships, not one-off transactions. We act as an extension of your leadership and technical teams to support your long-term strategic evolution.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white text-slate-900 min-h-screen flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-100 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles size={13} />
              <span>About Our Firm</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.12] mb-6">
              We Build Technology Around the Way Businesses Actually Work.
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed">
              We are a strategic business and technology solutions partner. We combine business thinking with high-calibre software engineering to help ambitious companies modernize operations, eliminate complexity, and build durable competitive advantages.
            </p>
          </div>
        </section>

        {/* Who We Are & What We Believe */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-slate-600 leading-relaxed text-base">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                The Gap We Were Founded to Bridge
              </h2>
              <p>
                Too many digital transformation initiatives fail because of a fundamental disconnect: traditional management consultancies understand business strategy but lack hands-on engineering execution, while software agencies build features without understanding bottom-line commercial mechanics.
              </p>
              <p>
                We bridge that divide. Our multidisciplinary team unites strategic business analysts, enterprise software architects, and automation specialists under a single, outcome-driven mandate.
              </p>
              <p>
                Whether modernizing a legacy enterprise architecture, deploying bespoke software platforms, or building proprietary products like our ECO CX customer experience platform—we engineer solutions that withstand real-world operational demands.
              </p>
            </div>

            <div className="bg-slate-950 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-xl space-y-6">
              <div className="text-xs font-mono uppercase tracking-wider text-blue-400">
                Our Operating Philosophy
              </div>
              <blockquote className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
                &ldquo;True innovation is not about adopting every new technology trend. It is about applying the right architecture to eliminate operational friction and create measurable business value.&rdquo;
              </blockquote>
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>BUSINESS-FIRST ENGINEERING</span>
                <ShieldCheck size={16} className="text-blue-400" />
              </div>
            </div>
          </div>
        </section>

        {/* 5 Core Principles */}
        <section id="approach" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              Our Core Principles
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              The Standards That Guide Every Engagement.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {principles.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className="bg-slate-50/80 border border-slate-200/80 rounded-3xl p-8 hover:bg-white hover:border-blue-500/40 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-blue-600 flex items-center justify-center shadow-2xs">
                        <Icon size={24} />
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-400">
                        0{idx + 1}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-950 mb-3">
                      {p.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {p.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-950 text-white rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
            <div>
              <h3 className="text-2xl font-bold mb-2">
                Ready to partner with an engineering-led team?
              </h3>
              <p className="text-slate-400 text-sm">
                Let&apos;s evaluate your current technology stack and discuss how we can support your long-term growth.
              </p>
            </div>
            <Link
              href="/contact"
              className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 group"
            >
              <span>Talk to Our Team</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
