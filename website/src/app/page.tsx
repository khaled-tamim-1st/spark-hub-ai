"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import EditorialStatement from "@/components/home/EditorialStatement";
import BusinessComplexity from "@/components/home/BusinessComplexity";
import SolutionsSection from "@/components/home/SolutionsSection";
import HowWeThink from "@/components/home/HowWeThink";
import BusinessImpact from "@/components/home/BusinessImpact";
import IndustryExplorer from "@/components/home/IndustryExplorer";
import DigitalProductsShowcase from "@/components/home/DigitalProductsShowcase";
import EngineeringDNA from "@/components/home/EngineeringDNA";
import AboutPhilosophy from "@/components/home/AboutPhilosophy";
import FinalCTA from "@/components/home/FinalCTA";
import ConsultationModal from "@/components/corporate/ConsultationModal";

export default function Home() {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  const openConsultation = () => setIsConsultationOpen(true);
  const closeConsultation = () => setIsConsultationOpen(false);

  return (
    <div className="bg-white text-slate-900 min-h-screen flex flex-col font-sans selection:bg-[#0454FF]/15 selection:text-[#0454FF]">
      {/* 1. Global Navigation */}
      <Navbar onOpenConsultation={openConsultation} />

      <main className="flex-1">
        {/* 2. Hero: We Engineer Scalable Solutions for Complex Business Challenges */}
        <section id="hero">
          <Hero onOpenConsultation={openConsultation} />
        </section>

        {/* 3. Big Editorial Statement Transition */}
        <section id="thesis">
          <EditorialStatement />
        </section>

        {/* 4. Business Complexity: Fragmented vs. Connected Ecosystem */}
        <section id="complexity">
          <BusinessComplexity />
        </section>

        {/* 5. Core Capabilities: We Turn Business Complexity Into Working Systems */}
        <section id="solutions">
          <SolutionsSection />
        </section>

        {/* 6. How We Think: Understand → Architect → Build → Evolve */}
        <section id="methodology">
          <HowWeThink />
        </section>

        {/* 7. Business Impact: Better Systems Create Better Businesses */}
        <section id="impact">
          <BusinessImpact />
        </section>

        {/* 8. Interactive Industry Explorer */}
        <section id="industries">
          <IndustryExplorer />
        </section>

        {/* 9. Proprietary Products & ECO CX Showcase */}
        <section id="products">
          <DigitalProductsShowcase />
        </section>

        {/* 10. Engineering DNA: 6-Layer Architectural Discipline */}
        <section id="engineering-dna">
          <EngineeringDNA />
        </section>

        {/* 11. About & Operating Philosophy */}
        <section id="about-philosophy">
          <AboutPhilosophy />
        </section>

        {/* 12. Final Culmination CTA: Let's Build What's Next */}
        <section id="contact">
          <FinalCTA onOpenConsultation={openConsultation} />
        </section>
      </main>

      {/* 13. Global Signature Footer */}
      <Footer />

      {/* 14. Executive Discovery Session Modal */}
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={closeConsultation}
      />
    </div>
  );
}
