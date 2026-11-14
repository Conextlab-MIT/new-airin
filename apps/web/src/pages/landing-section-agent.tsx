import {
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
  File01Icon,
  Message01Icon,
  UserGroupIcon,
} from "hugeicons-react";

function AgentSection() {
  return (
    <section
      aria-labelledby="landing-agent-title"
      className="landing-section landing-agent"
      id="ai-agent"
    >
      <div className="landing-wrap landing-agent-layout">
        <div data-reveal="rise">
          <h2 id="landing-agent-title">
            AI agent itu
            <br />
            <em>rekan kerja digital.</em>
          </h2>
          <p>
            Beri tujuan, konteks, dan akses ke alat kerja. Airin membantu
            mengerjakan langkah-langkahnya, lalu membawa hasilnya ke timmu.
          </p>
          <a className="landing-text-link" href="#onboarding">
            Kenalkan pada bisnismu <ArrowRight01Icon aria-hidden />
          </a>
        </div>
        <div className="landing-flow" data-reveal="assemble">
          <div className="landing-flow-brief">
            <Message01Icon aria-hidden />
            <span>“Bantu siapkan promo dari laporan minggu ini.”</span>
          </div>
          <div className="landing-flow-handoff">
            <div>
              <img
                alt=""
                height={72}
                loading="lazy"
                src="/characters/dimas.png"
                width={72}
              />
              <strong>Dimas</strong>
              <span>Baca laporan</span>
            </div>
            <ArrowRight01Icon aria-hidden />
            <div>
              <img
                alt=""
                height={72}
                loading="lazy"
                src="/characters/kezia.png"
                width={72}
              />
              <strong>Kezia</strong>
              <span>Siapkan materi</span>
            </div>
            <ArrowRight01Icon aria-hidden />
            <div>
              <span className="landing-flow-human">
                <UserGroupIcon aria-hidden />
              </span>
              <strong>Timmu</strong>
              <span>Tinjau & putuskan</span>
            </div>
          </div>
          <div className="landing-flow-result">
            <File01Icon aria-hidden />
            <div>
              <strong>Brief promo + konsep konten</strong>
              <span>Siap dibahas bersama tim</span>
            </div>
            <CheckmarkCircle02Icon aria-hidden />
          </div>
        </div>
      </div>
    </section>
  );
}

export { AgentSection };
