import { Unlink, RefreshCw, ServerOff, Clock, UserX, GitFork, EyeOff, TrendingDown, ArrowRight } from "lucide-react";
import Link from "next/link";

const challenges = [
  {
    icon: Unlink,
    title: "Disconnected Systems",
    description: "Siloed CRMs, ERPs, databases, and third-party tools that do not communicate or synchronize data seamlessly.",
  },
  {
    icon: RefreshCw,
    title: "Manual Processes",
    description: "High-friction, repetitive manual tasks that consume executive hours and introduce human error.",
  },
  {
    icon: ServerOff,
    title: "Legacy Infrastructure",
    description: "Aging systems and rigid architectures that slow down innovation and resist modern cloud upgrades.",
  },
  {
    icon: Clock,
    title: "Operational Bottlenecks",
    description: "Inflexible workflows that cause cross-departmental delays and stall project execution.",
  },
  {
    icon: UserX,
    title: "Fragmented Customer Journeys",
    description: "Inconsistent communication across channels that leads to customer churn and dropped leads.",
  },
  {
    icon: GitFork,
    title: "Inefficient Workflows",
    description: "Complex handoffs between teams without centralized governance or automated state tracking.",
  },
  {
    icon: EyeOff,
    title: "Poor Data Visibility",
    description: "Lack of real-time operational intelligence, leaving decision-makers to rely on outdated spreadsheets.",
  },
  {
    icon: TrendingDown,
    title: "Rigid, Unscalable Tech",
    description: "Off-the-shelf tools that fail to adapt as transaction volumes, team sizes, and markets expand.",
  },
];

export default function BusinessChallenges() {
  return (
    <section className="py-20 md:py-28 bg-slate-950 text-white relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-900/40 border border-blue-800/80 text-blue-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            The Operational Reality
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-6">
            Complex Business Problems Require More Than Off-the-Shelf Software.
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Standard software packages are built for generic use cases. When businesses grow, they outgrow rigid tools and accumulate operational friction across departments.
          </p>
        </div>

        {/* 8 Challenges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {challenges.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.title}
                className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl hover:border-blue-500/40 transition-all hover:bg-slate-900 group"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-800 text-blue-400 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Icon size={20} />
                </div>
                <h3 className="text-base font-bold text-slate-100 mb-2">{c.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{c.description}</p>
              </div>
            );
          })}
        </div>

        {/* Strategic Positioning Callout Banner */}
        <div className="bg-gradient-to-r from-blue-950/70 via-slate-900 to-blue-950/70 border border-blue-800/60 rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 block mb-2">
              Our Strategic Role
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
              We Bridge the Gap Between Business Strategy & Technology Execution.
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              We do not sell generic software licenses. We diagnose root operational friction and engineer bespoke, integrated technology architectures that solve your specific operational bottlenecks.
            </p>
          </div>
          <Link
            href="/about"
            className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-xs transition-all flex items-center gap-2 group"
          >
            <span>Learn About Our Approach</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
}
