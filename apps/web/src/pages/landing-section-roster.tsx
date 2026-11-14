import { ArrowRight01Icon, CheckmarkCircle02Icon } from "hugeicons-react";
import { featuredAgents } from "./landing-content";

function RosterSection() {
  return (
    <section
      aria-labelledby="landing-roster-title"
      className="landing-section landing-roster"
      id="ai-team"
    >
      <div className="landing-wrap">
        <div className="landing-section-heading" data-reveal="rise">
          <h2 id="landing-roster-title">
            Kenalan dengan
            <br />
            <em>tim AI kamu.</em>
          </h2>
          <div>
            <span className="landing-trained" lang="en">
              <CheckmarkCircle02Icon aria-hidden />
              Trained by professionals
            </span>
            <p>
              Pilih spesialis sesuai pekerjaan yang ingin kamu bagi. Setiap agen
              punya peran untuk membantu timmu.
            </p>
          </div>
        </div>
        <ul className="landing-roster-grid">
          {featuredAgents.map((agent) => (
            <li data-reveal="rise" key={agent.avatar}>
              <div className="landing-roster-portrait">
                <img
                  alt=""
                  height={160}
                  loading="lazy"
                  src={`/characters/${agent.avatar}.png`}
                  width={160}
                />
              </div>
              <div>
                <h3>{agent.name}</h3>
                <span>{agent.role}</span>
                <p>{agent.task}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="landing-roster-more">
          <span lang="en">+ 20 more</span>
          <a className="landing-text-link" href="#daftar-tunggu">
            Temukan tim untuk bisnismu <ArrowRight01Icon aria-hidden />
          </a>
        </div>
      </div>
    </section>
  );
}

export { RosterSection };
