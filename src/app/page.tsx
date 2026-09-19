import { MarketingNav } from "@/components/marketing/MarketingNav";
import { Hero } from "@/components/marketing/Hero";
import {
  ProblemSection,
  HowItWorks,
} from "@/components/marketing/ProblemAndHowItWorks";
import { FeatureShowcase } from "@/components/marketing/FeatureShowcase";
import { MeetSage } from "@/components/marketing/MeetSage";
import { ExamCoverage } from "@/components/marketing/ExamCoverage";
import { SocialProof } from "@/components/marketing/SocialProof";
import { FinalCta } from "@/components/marketing/FinalCta";
import { Faq } from "@/components/marketing/Faq";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <MarketingNav />

      <main>
        <Hero />

        <ProblemSection />

        <HowItWorks />

        <FeatureShowcase />

        <MeetSage />

        <ExamCoverage />

        <SocialProof />

        <FinalCta />

        <Faq />
      </main>

      <MarketingFooter />
    </div>
  );
}