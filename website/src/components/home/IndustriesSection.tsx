import Link from "next/link";
import { ArrowRight, ShoppingBag, Landmark, Building, Truck, Activity, Briefcase } from "lucide-react";

const industries = [
  {
    id: "retail",
    icon: ShoppingBag,
    name: "Retail & E-Commerce",
    challenge: "Managing high transaction volumes, multi-channel customer inquiries, and disjointed inventory syncs.",
    solution: "Omnichannel communication hubs, real-time inventory and ERP sync, automated order state notifications.",
  },
  {
    id: "fintech",
    icon: Landmark,
    name: "Financial Services & FinTech",
    challenge: "Complex regulatory compliance, manual document validation, and fragmented client onboarding pipelines.",
    solution: "Secure automated KYC/onboarding pipelines, audit-compliant data sync, and high-security API architectures.",
  },
  {
    id: "real-estate",
    icon: Building,
    name: "Real Estate & PropTech",
    challenge: "Delayed responses to high-value property inquiries, unstructured lead tracking, and manual tenant management.",
    solution: "Instant automated lead routing, CRM integration, tenant portal systems, and automated maintenance workflows.",
  },
  {
    id: "logistics",
    icon: Truck,
    name: "Logistics & Supply Chain",
    challenge: "Operational blind spots across fleet dispatch, manual shipping status updates, and disconnected legacy software.",
    solution: "Custom carrier integration middleware, automated shipment event tracking, and dispatch intelligence dashboards.",
  },
  {
    id: "healthcare",
    icon: Activity,
    name: "Healthcare & Life Sciences",
    challenge: "High administrative burden, patient appointment drop-offs, and disjointed medical communication channels.",
    solution: "HIPAA-ready automated appointment booking, secure patient messaging flows, and integrated clinic operations.",
  },
  {
    id: "b2b",
    icon: Briefcase,
    name: "B2B & Professional Services",
    challenge: "Prolonged sales cycles, manual proposal tracking, and fragmented client communication across consulting teams.",
    solution: "Custom client collaboration portals, automated billing integrations, and end-to-end project lifecycle systems.",
  },
];

export default function IndustriesSection() {
  return (
    <section className="py-20 md:py-28 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              Sector Expertise
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight">
              Solutions Designed Around the Way Your Industry Works.
            </h2>
          </div>
          <p className="text-slate-600 text-sm sm:text-base max-w-md">
            We adapt our technology architectures to the operational realities, regulatory demands, and customer expectations of your specific industry.
          </p>
        </div>

        {/* 6 Industry Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {industries.map((ind) => {
            const Icon = ind.icon;
            return (
              <div
                key={ind.id}
                className="bg-white border border-slate-200/80 rounded-3xl p-7 shadow-2xs hover:shadow-md hover:border-blue-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                    <Icon size={24} />
                  </div>

                  <h3 className="text-lg font-bold text-slate-950 mb-3">
                    {ind.name}
                  </h3>

                  <div className="space-y-3 mb-6 text-xs sm:text-sm">
                    <div>
                      <span className="font-bold text-slate-800 block mb-0.5">The Challenge:</span>
                      <p className="text-slate-600 leading-relaxed">{ind.challenge}</p>
                    </div>
                    <div>
                      <span className="font-bold text-blue-700 block mb-0.5">Our Solution:</span>
                      <p className="text-slate-600 leading-relaxed">{ind.solution}</p>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/industries#${ind.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 group pt-4 border-t border-slate-100"
                >
                  <span>Learn More About {ind.name}</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Link to all Industries */}
        <div className="text-center">
          <Link
            href="/industries"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline"
          >
            <span>Explore All Industry Solutions</span>
            <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </section>
  );
}
