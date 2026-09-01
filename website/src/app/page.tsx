"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/corporate/HeroSection";
import GrowthJourney from "@/components/corporate/GrowthJourney";
import SectorShowcase from "@/components/corporate/SectorShowcase";
import EcoCxSection from "@/components/corporate/EcoCxSection";
import BlogShowcase from "@/components/corporate/BlogShowcase";
import FinalContactCTA from "@/components/corporate/FinalContactCTA";
import ConsultationModal from "@/components/corporate/ConsultationModal";
import FloatingWhatsApp from "@/components/corporate/FloatingWhatsApp";

export default function Home() {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  const openConsultation = () => setIsConsultationOpen(true);
  const closeConsultation = () => setIsConsultationOpen(false);

  return (
    <div className="bg-white text-slate-900 min-h-screen flex flex-col selection:bg-[#0454FF]/15 selection:text-[#0454FF] font-sans" dir="rtl">
      {/* 1. Header / Navbar */}
      <Navbar onOpenConsultation={openConsultation} />

      <main className="flex-1">
        {/* 2. Hero Section: إدارة نمو المنشآت مدعومة بنظام ECO CX */}
        <section id="hero">
          <HeroSection onOpenConsultation={openConsultation} />
        </section>

        {/* 3. رحلة النمو: الأعمدة الأربعة (الهوية، التسويق، التقنية، الأتمتة) */}
        <section id="solutions">
          <GrowthJourney onOpenConsultation={openConsultation} />
        </section>

        {/* 4. نماذج التطبيق العملي لمختلف الأنشطة التجارية */}
        <section id="sectors">
          <SectorShowcase onOpenConsultation={openConsultation} />
        </section>

        {/* 5. قسم نظام ECO CX الحصري لإدارة وتتبع علاقات العملاء */}
        <section id="eco-cx">
          <EcoCxSection />
        </section>

        {/* 6. قسم المعرفة وأدلة نمو الأعمال */}
        <section id="blog">
          <BlogShowcase />
        </section>

        {/* 7. قسم التواصل والبدء: طلب دراسة نمو لمنشأتك */}
        <section id="contact">
          <FinalContactCTA onOpenConsultation={openConsultation} />
        </section>
      </main>

      {/* 8. Footer */}
      <Footer />

      {/* 9. Interactive Consultation Modal */}
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={closeConsultation}
      />

      {/* 10. Floating WhatsApp Button for Instant Saudi Conversion */}
      <FloatingWhatsApp />
    </div>
  );
}
