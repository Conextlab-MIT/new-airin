import {
  ArrowRight01Icon,
  Link01Icon,
  Message01Icon,
  UserGroupIcon,
} from "hugeicons-react";
import { useState } from "react";
import { industries, integrations } from "./landing-content";
import { CampaignPoster } from "./landing-poster";

function Integrations() {
  return (
    <section
      aria-labelledby="landing-integrations-title"
      className="landing-integrations"
    >
      <div className="landing-wrap">
        <h2 id="landing-integrations-title">
          Aplikasi yang sama.
          <br />
          <em>Tenaga baru di dalamnya.</em>
        </h2>
      </div>
      <div className="landing-app-rows">
        {[integrations.slice(0, 4), integrations.slice(4)].map(
          (row, rowIndex) => (
            <div className="landing-marquee" key={row[0].name}>
              <div
                className={`landing-marquee-track landing-marquee-row-${rowIndex}`}
              >
                {[false, true].map((duplicate) => (
                  <ul
                    aria-hidden={duplicate || undefined}
                    key={String(duplicate)}
                  >
                    {row.map((app) => (
                      <li key={app.name}>
                        <img
                          alt=""
                          height={32}
                          loading="lazy"
                          src={`/icons/${app.icon}`}
                          width={32}
                        />
                        <span>{app.name}</span>
                        <Link01Icon aria-hidden />
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>
          )
        )}
      </div>
      <p className="landing-integration-note">
        Hubungkan kanal dan aplikasi lewat konektor yang tersedia.
      </p>
    </section>
  );
}

function IndustryExamples() {
  const [industry, setIndustry] = useState<(typeof industries)[number]>(
    industries[0]
  );

  return (
    <section
      aria-labelledby="landing-use-cases-title"
      className="landing-section landing-industries"
      id="use-cases"
    >
      <div className="landing-wrap">
        <div className="landing-section-heading" data-reveal="rise">
          <h2 id="landing-use-cases-title">
            Bisnis beda.
            <br />
            <em>Sama-sama terbantu.</em>
          </h2>
          <p>
            Dari meja kasir sampai materi promo. Lihat pekerjaan yang bisa timmu
            bagi ke Airin.
          </p>
        </div>
        <div
          aria-label="Pilih industri"
          className="landing-industry-switch"
          role="group"
        >
          {industries.map((item) => (
            <button
              aria-pressed={item === industry}
              key={item.id}
              onClick={() => setIndustry(item)}
              type="button"
            >
              <img
                alt=""
                height={64}
                loading="lazy"
                src={`/landing/${item.id}.webp`}
                width={64}
              />
              <span>{item.label}</span>
              <ArrowRight01Icon aria-hidden />
            </button>
          ))}
        </div>
        <div
          aria-live="polite"
          className={`landing-industry-panel landing-industry-${industry.id}`}
          key={industry.id}
        >
          <div className="landing-industry-copy">
            <h3>{industry.title}</h3>
            <p>{industry.job}</p>
            <div className="landing-industry-brief">
              <Message01Icon aria-hidden />
              <p>“{industry.task}”</p>
            </div>
            <div className="landing-human-role">
              <UserGroupIcon aria-hidden />
              <p>{industry.owner}</p>
            </div>
          </div>
          <div className="landing-industry-gallery" data-reveal="spread">
            <div className="landing-campaign-secondary">
              <span>{industry.brand}</span>
              <strong>{industry.detail}</strong>
              <div aria-hidden className="landing-campaign-mark">
                <ArrowRight01Icon />
              </div>
              <span>Konsep konten sosial</span>
            </div>
            <CampaignPoster industry={industry} />
            <span className="landing-design-note">
              Contoh desain · merek fiktif
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export { IndustryExamples, Integrations };
