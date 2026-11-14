import { ArrowDown01Icon, ArrowRight01Icon } from "hugeicons-react";
import type { Dispatch, SetStateAction } from "react";
import { team } from "./landing-content";
import { TeamWorkbench } from "./landing-workbench";

function LandingHero({
  active,
  setActive,
}: {
  active: number;
  setActive: Dispatch<SetStateAction<number>>;
}) {
  return (
    <section
      aria-labelledby="landing-title"
      className="landing-hero landing-wrap"
    >
      <div className="landing-intro">
        <h1 id="landing-title" lang="en">
          <span>Your next hire</span>
          <span>
            is an{" "}
            <span className="landing-title-avatar">
              <img
                alt=""
                height={88}
                key={team[active].avatar}
                src={`/characters/${team[active].avatar}.png`}
                width={88}
              />
            </span>
          </span>
          <em>AI Superteam.</em>
        </h1>
        <p className="landing-hero-tagline">Kerja nyata. Tim lebih kuat.</p>
        <p>
          Rekan AI untuk bisnis kamu. Bantu balas pelanggan, baca laporan, dan
          bikin konten. Orang-orang di timmu tetap pegang keputusan.
        </p>
        <div className="landing-actions">
          <a className="landing-button" href="#daftar-tunggu" lang="en">
            Join Waitlist <ArrowRight01Icon aria-hidden />
          </a>
          <a className="landing-text-link" href="#use-cases">
            Lihat cara kerja <ArrowDown01Icon aria-hidden />
          </a>
        </div>
        <div className="landing-hero-team">
          <div aria-hidden>
            {team.map((member) => (
              <img
                alt=""
                height={32}
                key={member.avatar}
                src={`/characters/${member.avatar}.png`}
                width={32}
              />
            ))}
          </div>
          <span>Satu tim. Banyak keahlian.</span>
        </div>
      </div>
      <TeamWorkbench active={active} setActive={setActive} />
      <a className="landing-scroll-hint" href="#ai-agent">
        <ArrowDown01Icon aria-hidden />
        <span>Kenalan dengan tim barumu</span>
      </a>
    </section>
  );
}

export { LandingHero };
