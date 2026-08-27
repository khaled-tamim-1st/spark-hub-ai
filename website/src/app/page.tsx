import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import SocialProof from "@/components/sections/SocialProof";
import ProblemSolution from "@/components/sections/ProblemSolution";
import Features from "@/components/sections/Features";
import RoiCalculator from "@/components/sections/RoiCalculator";
import HowItWorks from "@/components/sections/HowItWorks";
import Integrations from "@/components/sections/Integrations";
import Pricing from "@/components/sections/Pricing";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <div className="bg-white text-slate-900 min-h-screen flex flex-col selection:bg-[#3B4FE8]/15 selection:text-[#3B4FE8]">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <SocialProof />
        <ProblemSolution />
        <Features />
        <RoiCalculator />
        <HowItWorks />
        <Integrations />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
