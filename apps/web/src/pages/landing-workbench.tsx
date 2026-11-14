import {
  CheckmarkCircle02Icon,
  File01Icon,
  UserGroupIcon,
} from "hugeicons-react";
import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { industries, team } from "./landing-content";
import { CampaignPoster } from "./landing-poster";

function TeamWorkbench({
  active,
  setActive,
}: {
  active: number;
  setActive: Dispatch<SetStateAction<number>>;
}) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const workbench = useRef<HTMLDivElement>(null);
  const agent = team[active];

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener("change", update);

    const observer =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(
            ([entry]) => setVisible(entry?.isIntersecting ?? false),
            { threshold: 0.15 }
          );

    if (workbench.current) {
      observer?.observe(workbench.current);
    }

    return () => {
      preference.removeEventListener("change", update);
      observer?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (reducedMotion || hovered || focused || !visible) {
      return;
    }

    const timer = window.setInterval(() => {
      if (!document.hidden) {
        setActive((current) => (current + 1) % team.length);
      }
    }, 6500);

    return () => window.clearInterval(timer);
  }, [reducedMotion, hovered, focused, visible, setActive]);

  return (
    <div
      className="landing-workbench"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setFocused(false);
        }
      }}
      onFocus={() => setFocused(true)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      ref={workbench}
    >
      <div className="landing-agent-stage">
        <div className="landing-active-agent" key={agent.avatar}>
          <img
            alt={agent.name}
            height={160}
            src={`/characters/${agent.avatar}.png`}
            width={160}
          />
          <div className="landing-agent-badge">
            <span className="landing-status-dot" />
            <strong>{agent.name}</strong>
            <span>{agent.role}</span>
          </div>
        </div>
        <div
          aria-label="Pilih anggota tim AI"
          className="landing-team-picker"
          role="group"
        >
          {team.map((member, index) => (
            <button
              aria-pressed={active === index}
              className="landing-team-choice"
              key={member.name}
              onClick={() => setActive(index)}
              type="button"
            >
              {member.name}
            </button>
          ))}
        </div>
      </div>
      <div className="landing-workspace">
        <div className="landing-workspace-bar">
          <span>
            <span className="landing-status-dot" />
            Tim bisnismu
          </span>
          <span>Demo tugas</span>
        </div>
        <div
          className="landing-workspace-scene"
          data-agent={agent.avatar}
          key={agent.avatar}
        >
          <div className="landing-brief">
            <span>Kamu</span>
            <p>{agent.task}</p>
          </div>
          <div className="landing-agent-response">
            <img
              alt=""
              height={44}
              src={`/characters/${agent.avatar}.png`}
              width={44}
            />
            <div>
              <strong>
                {agent.name}
                <span>{agent.role}</span>
              </strong>
              <p>{agent.reply}</p>
            </div>
          </div>
          {agent.kind === "support" && (
            <div className="landing-task-output landing-message-output">
              <div>
                <img alt="" height={24} src="/icons/whatsapp.svg" width={24} />
                <strong>Draf untuk Bu Rina</strong>
                <span>#LD-208</span>
              </div>
              <p>
                Halo Bu Rina, cucian Ibu sudah rapi dan siap diambil. Kami buka
                sampai pukul 19.00. Terima kasih sudah menunggu!
              </p>
              <span>
                <CheckmarkCircle02Icon aria-hidden />
                Menunggu pemeriksaan tim
              </span>
            </div>
          )}
          {agent.kind === "finance" && (
            <div className="landing-task-output landing-finance-output">
              <div>
                <span>Penjualan minggu ini</span>
                <strong>Rp18.450.000</strong>
              </div>
              <div aria-hidden className="landing-mini-bars">
                {[38, 62, 48, 75, 56, 92, 68].map((height, index) => (
                  <i key={height} style={{ height: `${height}%` }}>
                    <span>{["S", "S", "R", "K", "J", "S", "M"][index]}</span>
                  </i>
                ))}
              </div>
              <p>
                <File01Icon aria-hidden />3 invoice perlu ditindaklanjuti
              </p>
            </div>
          )}
          {agent.kind === "marketing" && (
            <div className="landing-task-output landing-marketing-output">
              <CampaignPoster compact industry={industries[2]} />
              <div>
                <strong>Selasa, makan enak dulu.</strong>
                <p>Menu favoritmu, siap menemani jam istirahat.</p>
                <span>Draf caption Instagram</span>
              </div>
            </div>
          )}
          <div className="landing-deliverable">
            <File01Icon aria-hidden />
            <span>{agent.file}</span>
            <span>Siap ditinjau</span>
          </div>
        </div>
        <div className="landing-workspace-bottom">
          <span>Data contoh · keputusan tetap di timmu</span>
          <UserGroupIcon aria-hidden />
        </div>
      </div>
      <div aria-hidden className="landing-workbench-note">
        <img alt="" height={28} src={`/icons/${agent.app}`} width={28} />
        <span>Kerja di aplikasi yang kamu pakai.</span>
        <CheckmarkCircle02Icon />
      </div>
    </div>
  );
}

export { TeamWorkbench };
