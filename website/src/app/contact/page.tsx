"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Sparkles, ArrowRight, CheckCircle2, Mail, Phone, Building2, User, Briefcase, Calendar, Clock, ShieldCheck } from "lucide-react";

const solutionAreas = [
  "Digital Transformation",
  "Custom Software & Platforms",
  "Intelligent Automation & AI",
  "Systems Integration",
  "Customer Experience (CX)",
  "Technology Advisory",
  "Digital Products (ECO CX)",
  "Other / General Inquiry",
];

const timelineOptions = [
  "Immediate (< 1 month)",
  "1 – 3 Months",
  "3 – 6 Months",
  "Exploring Options & Strategy",
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [area, setArea] = useState(solutionAreas[0]);
  const [timeline, setTimeline] = useState(timelineOptions[1]);
  const [challenge, setChallenge] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    console.log("Contact Request Submitted:", {
      name,
      jobTitle,
      company,
      email,
      phone,
      area,
      timeline,
      challenge,
    });
    setSubmitted(true);
  };

  return (
    <div className="bg-white text-slate-900 min-h-screen flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Context & Discovery Process */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-100 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                  <Sparkles size={13} />
                  <span>Start a Discussion</span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight mb-6">
                  Let&apos;s Talk About Your Business Challenge.
                </h1>
                <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                  Whether you&apos;re modernizing an existing operation, building a new digital platform, automating workflows, or connecting fragmented systems, we&apos;d like to understand what you&apos;re trying to achieve.
                </p>
              </div>

              {/* What Happens Next Box */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-7 space-y-4">
                <h3 className="text-base font-bold text-slate-950">
                  What Happens in the Executive Discovery Call:
                </h3>
                <ul className="space-y-3 text-xs sm:text-sm text-slate-600">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Diagnostic Review:</strong> Direct discussion with senior architects regarding your current workflows and bottlenecks.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Technical Feasibility:</strong> Transparent assessment of architecture options, integration points, and timelines.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Actionable Next Steps:</strong> High-level roadmap tailored strictly to your business priorities.</span>
                  </li>
                </ul>
              </div>

              {/* Trust Indicators */}
              <div className="space-y-3 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-blue-600" />
                  <span>Response guaranteed within 24 business hours.</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-blue-600" />
                  <span>Mutual NDA provided upon request prior to technical review.</span>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-xl">
                {!submitted ? (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* Full Name & Job Title */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Full Name *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Sarah Jenkins"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all pl-10"
                          />
                          <User size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Job Title / Role
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                            placeholder="e.g. VP Operations / CTO"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all pl-10"
                          />
                          <Briefcase size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                        </div>
                      </div>
                    </div>

                    {/* Company & Work Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Company Name *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            placeholder="e.g. Acme Enterprise"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all pl-10"
                          />
                          <Building2 size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Work Email *
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="sarah@acme.com"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all pl-10"
                          />
                          <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                        </div>
                      </div>
                    </div>

                    {/* Phone & Timeline */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Phone / WhatsApp
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+1 (555) 000-0000"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all pl-10"
                          />
                          <Phone size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Project Timeline
                        </label>
                        <div className="relative">
                          <select
                            value={timeline}
                            onChange={(e) => setTimeline(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all pl-10 cursor-pointer"
                          >
                            {timelineOptions.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                          <Calendar size={16} className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Primary Area of Interest */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Area of Interest
                      </label>
                      <select
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all cursor-pointer"
                      >
                        {solutionAreas.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Project / Business Challenge */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Project / Business Challenge
                      </label>
                      <textarea
                        rows={3}
                        value={challenge}
                        onChange={(e) => setChallenge(e.target.value)}
                        placeholder="Describe the operational bottleneck, system integration, or software platform you are looking to build or optimize..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all resize-none"
                      />
                    </div>

                    {/* Submit CTA */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
                      >
                        <span>Start the Conversation</span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>

                  </form>
                ) : (
                  /* Confirmation View */
                  <div className="py-12 text-center">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 border border-emerald-100">
                      <CheckCircle2 size={36} />
                    </div>
                    <h3 className="text-2xl font-extrabold text-slate-950 mb-2">
                      Thank You, {name}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed max-w-md mx-auto mb-8">
                      We have received your request regarding {company}. A member of our solutions architecture team will contact you at {email} within 24 hours.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
