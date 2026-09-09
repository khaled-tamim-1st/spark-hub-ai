"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Phone, Building2, User, Sparkles, ArrowRight, Mail, Briefcase, Calendar } from "lucide-react";

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const solutionAreas = [
  "Digital Transformation",
  "Custom Software & Platforms",
  "Intelligent Automation & AI",
  "Systems Integration",
  "Customer Experience Architecture",
  "Technology Advisory",
  "Digital Products (ECO CX)",
];

const timelineOptions = [
  "Immediate (< 1 month)",
  "1 – 3 Months",
  "3 – 6 Months",
  "Planning & Strategy Phase",
];

export default function ConsultationModal({ isOpen, onClose }: ConsultationModalProps) {
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

    // Trigger submission or integration
    console.log("Enterprise Discovery Request:", {
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

  const handleReset = () => {
    setName("");
    setJobTitle("");
    setCompany("");
    setEmail("");
    setPhone("");
    setArea(solutionAreas[0]);
    setTimeline(timelineOptions[1]);
    setChallenge("");
    setSubmitted(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 overflow-hidden z-10 max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {!submitted ? (
              <div>
                {/* Header */}
                <div className="mb-6">
                  <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-100 text-xs font-bold px-3 py-1 rounded-full mb-3">
                    <Sparkles size={13} />
                    <span>Executive Discovery Session</span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-950 tracking-tight mb-2">
                    Talk to Our Solutions Team
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    Discuss your operational bottlenecks, system architecture, or digital roadmap with our senior business & technology team.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name & Job Title */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                          placeholder="e.g. Alex Vance"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all pl-9"
                        />
                        <User size={16} className="absolute left-3 top-3 text-slate-400" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Job Title
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={jobTitle}
                          onChange={(e) => setJobTitle(e.target.value)}
                          placeholder="e.g. CTO / VP Operations"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all pl-9"
                        />
                        <Briefcase size={16} className="absolute left-3 top-3 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  {/* Company & Work Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                          placeholder="e.g. Enterprise Corp"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all pl-9"
                        />
                        <Building2 size={16} className="absolute left-3 top-3 text-slate-400" />
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
                          placeholder="alex@company.com"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all pl-9"
                        />
                        <Mail size={16} className="absolute left-3 top-3 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  {/* Phone & Timeline */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all pl-9"
                        />
                        <Phone size={16} className="absolute left-3 top-3 text-slate-400" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Target Timeline
                      </label>
                      <div className="relative">
                        <select
                          value={timeline}
                          onChange={(e) => setTimeline(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all pl-9 cursor-pointer"
                        >
                          {timelineOptions.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                        <Calendar size={16} className="absolute left-3 top-3 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Primary Area of Interest */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Primary Area of Interest
                    </label>
                    <select
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all cursor-pointer"
                    >
                      {solutionAreas.map((sol) => (
                        <option key={sol} value={sol}>
                          {sol}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Challenge Description */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Brief Project / Challenge Description
                    </label>
                    <textarea
                      rows={2}
                      value={challenge}
                      onChange={(e) => setChallenge(e.target.value)}
                      placeholder="What business process or system are you aiming to improve, automate, or build?"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
                    >
                      <span>Request Discovery Session</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <span className="block text-center text-[11px] text-slate-500 font-medium mt-2">
                      Our senior solutions team will review your objectives and respond within 24 hours.
                    </span>
                  </div>
                </form>
              </div>
            ) : (
              /* Success Confirmation */
              <div className="py-8 text-center">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                  <CheckCircle2 size={32} />
                </div>
                <h4 className="text-2xl font-extrabold text-slate-950 mb-2">
                  Request Received
                </h4>
                <p className="text-slate-600 text-sm font-medium leading-relaxed max-w-sm mx-auto mb-6">
                  Thank you, {name}. A solution architect from our team will contact you at {email} to schedule your discovery call.
                </p>
                <button
                  onClick={handleReset}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

