"use client";

import { useState } from "react";
import type { Dictionary, Locale } from "@/lib/i18n";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import BigStatement from "@/components/home/BigStatement";
import BusinessChallenges from "@/components/home/BusinessChallenges";
import CapabilitiesSection from "@/components/home/CapabilitiesSection";
import HowWeThink from "@/components/home/HowWeThink";
import BusinessImpact from "@/components/home/BusinessImpact";
import IndustriesSection from "@/components/home/IndustriesSection";
import DigitalProductsSection from "@/components/home/DigitalProductsSection";
import WhyUs from "@/components/home/WhyUs";
import FinalCTA from "@/components/home/FinalCTA";
import ConsultationModal from "@/components/corporate/ConsultationModal";

interface HomeClientProps {
  locale: Locale;
  dictionary: Dictionary;
}

export default function HomeClient({ locale, dictionary }: HomeClientProps) {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  const openConsultation = () => setIsConsultationOpen(true);
  const closeConsultation = () => setIsConsultationOpen(false);

  return (
    <div className="bg-white text-slate-900 min-h-screen flex flex-col selection:bg-[#0454FF]/15 selection:text-[#0454FF]">
      {/* Navigation */}
      <Navbar locale={locale} dictionary={dictionary.nav} />

      <main className="flex-1">
        {/* 01 — Hero: We Build. We Grow. We Evolve. */}
        <section id="hero" aria-label={dictionary.hero.headline.join(" ")}>
          <Hero locale={locale} dictionary={dictionary.hero} />
        </section>

        {/* 02 — Big Idea: Great Businesses Don't Grow in Silos */}
        <section id="big-statement" aria-label={dictionary.bigStatement.headline}>
          <BigStatement locale={locale} dictionary={dictionary.bigStatement} />
        </section>

        {/* 03 — Business Challenges: What Are You Trying to Move Forward? */}
        <section id="challenges" aria-label={dictionary.challenges.headline}>
          <BusinessChallenges locale={locale} dictionary={dictionary.challenges} />
        </section>

        {/* 04 — Capabilities: One Partner. Many Capabilities. */}
        <section id="capabilities" aria-label={dictionary.capabilities.headline}>
          <CapabilitiesSection locale={locale} dictionary={dictionary.capabilities} />
        </section>

        {/* 05 — Methodology: Understand → Define → Create → Activate → Evolve */}
        <section id="methodology" aria-label={dictionary.methodology.headline}>
          <HowWeThink locale={locale} dictionary={dictionary.methodology} />
        </section>

        {/* 06 — Impact: Ideas Are Good. Results Are Better. */}
        <section id="impact" aria-label={dictionary.impact.headline}>
          <BusinessImpact locale={locale} dictionary={dictionary.impact} />
        </section>

        {/* 07 — Industries: Where We Create Value */}
        <section id="industries" aria-label={dictionary.industries.headline}>
          <IndustriesSection locale={locale} dictionary={dictionary.industries} />
        </section>

        {/* 08 — Digital Products: ECO CX */}
        <section id="products" aria-label={dictionary.products.headline}>
          <DigitalProductsSection locale={locale} dictionary={dictionary.products} />
        </section>

        {/* 09 — Why Us: Different Disciplines. One Perspective. */}
        <section id="why-us" aria-label={dictionary.whyUs.headline}>
          <WhyUs locale={locale} dictionary={dictionary.whyUs} />
        </section>

        {/* 10 — Final CTA: Let's Build What's Next. */}
        <section id="contact" aria-label={dictionary.finalCta.headline}>
          <FinalCTA locale={locale} dictionary={dictionary.finalCta} />
        </section>
      </main>

      {/* Footer */}
      <Footer locale={locale} dictionary={dictionary.footer} />

      {/* Consultation Modal */}
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={closeConsultation}
        locale={locale}
      />
    </div>
  );
}
