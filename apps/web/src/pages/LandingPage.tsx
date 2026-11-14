import { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/use-auth";
import { LandingHeader } from "./landing-header";
import { LandingHero } from "./landing-hero";
import { IndustryExamples, Integrations } from "./landing-industries";
import { AgentSection } from "./landing-section-agent";
import { ComparisonSection } from "./landing-section-comparison";
import { FeatureSection } from "./landing-section-features";
import { LandingFooter } from "./landing-section-footer";
import { GroupsOnboardingSections } from "./landing-section-groups";
import { RosterSection } from "./landing-section-roster";
import { WaitlistSection } from "./landing-section-waitlist";
import "./landing-page.css";

export function LandingPage() {
  const { isAuthenticated } = useAuth();
  const [active, setActive] = useState(0);
  const page = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = page.current;

    if (!element || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target.classList.contains("landing-flow")) {
            entry.target.setAttribute(
              "data-flow-visible",
              String(entry.isIntersecting)
            );
            continue;
          }

          if (entry.isIntersecting) {
            entry.target.setAttribute("data-in-view", "true");
            observer.unobserve(entry.target);
          }
        }
      },
      { root: element, threshold: 0.12 }
    );

    for (const target of element.querySelectorAll("[data-reveal]")) {
      observer.observe(target);
    }

    return () => observer.disconnect();
  }, [isAuthenticated]);

  if (isAuthenticated) {
    return <Navigate replace to="/chat" />;
  }

  return (
    <div className="landing" lang="id" ref={page}>
      <a className="landing-skip" href="#landing-main">
        Langsung ke konten
      </a>
      <LandingHeader />
      <main id="landing-main">
        <LandingHero active={active} setActive={setActive} />
        <Integrations />
        <AgentSection />
        <FeatureSection />
        <RosterSection />
        <IndustryExamples />
        <ComparisonSection />
        <GroupsOnboardingSections />
        <WaitlistSection />
      </main>
      <LandingFooter />
    </div>
  );
}
