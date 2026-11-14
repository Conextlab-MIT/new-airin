import { ArrowRight01Icon } from "hugeicons-react";
import type { industries } from "./landing-content";

function CampaignPoster({
  industry,
  compact = false,
}: {
  industry: (typeof industries)[number];
  compact?: boolean;
}) {
  return (
    <div
      aria-label={`Contoh desain promo ${industry.label}, merek fiktif`}
      className={`landing-poster landing-poster-${industry.id}${compact ? "landing-poster-compact" : ""}`}
    >
      <div className="landing-poster-top">
        <span>{industry.brand}</span>
        <span>EST. 2026</span>
      </div>
      <strong className="landing-poster-title">
        {industry.headline.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </strong>
      <div className="landing-poster-photo">
        <img
          alt=""
          height={800}
          loading="lazy"
          src={`/landing/${industry.id}.webp`}
          width={1200}
        />
        <span>{industry.offer}</span>
      </div>
      <div className="landing-poster-bottom">
        <span>{industry.action}</span>
        <ArrowRight01Icon aria-hidden />
      </div>
    </div>
  );
}

export { CampaignPoster };
