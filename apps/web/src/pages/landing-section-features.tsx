import {
  ArrowRight01Icon,
  Calendar03Icon,
  CheckmarkCircle02Icon,
  Shield01Icon,
} from "hugeicons-react";
import { industries, integrations, team } from "./landing-content";
import { CampaignPoster } from "./landing-poster";

function FeatureSection() {
  return (
    <section
      aria-labelledby="landing-features-title"
      className="landing-section landing-features"
      id="fitur"
    >
      <div className="landing-wrap">
        <div className="landing-section-heading" data-reveal="rise">
          <h2 id="landing-features-title">
            Bagi pekerjaannya.
            <br />
            <em>Pegang kendalinya.</em>
          </h2>
          <p>
            Setiap spesialis punya peran, konteks, dan alat untuk membantu
            pekerjaan tim.
          </p>
        </div>
        <div className="landing-feature-grid">
          <article className="landing-feature-team" data-reveal="assemble">
            <div className="landing-feature-copy">
              <h3>
                Kenal bisnis.
                <br />
                Paham tugasnya.
              </h3>
              <p>
                Bagikan SOP, cara bicara, dan panduan bisnis. Atur keahlian tiap
                agen sesuai kebutuhan tim.
              </p>
            </div>
            <div className="landing-role-cards">
              {team.map((member) => (
                <div key={member.avatar}>
                  <img
                    alt=""
                    height={130}
                    loading="lazy"
                    src={`/characters/${member.avatar}.png`}
                    width={130}
                  />
                  <strong>{member.name}</strong>
                  <span>{member.role}</span>
                  <small>
                    <CheckmarkCircle02Icon aria-hidden />
                    Brief diterima
                  </small>
                </div>
              ))}
            </div>
          </article>
          <article className="landing-feature-schedule" data-reveal="rise">
            <div className="landing-feature-copy">
              <Calendar03Icon aria-hidden />
              <h3>Rutinitas punya jadwal.</h3>
              <p>
                Ringkasan penjualan Senin pagi. Pengingat stok Jumat sore. Atur
                sesuai ritme bisnis.
              </p>
            </div>
            <div className="landing-schedule">
              <div>
                <span>Sen</span>
                <span>Sel</span>
                <span>Rab</span>
                <span>Kam</span>
                <span>Jum</span>
              </div>
              <div>
                <span>10</span>
                <span>11</span>
                <span>12</span>
                <span>13</span>
                <span>14</span>
              </div>
              <p>
                <span className="landing-status-dot" />
                <strong>Ringkasan penjualan</strong>
                <span>09.00</span>
              </p>
            </div>
          </article>
          <article className="landing-feature-access" data-reveal="rise">
            <div className="landing-feature-copy">
              <Shield01Icon aria-hidden />
              <h3>Akses sesuai peran.</h3>
              <p>
                Tentukan aplikasi, file, dan alat yang boleh dipakai. Tim tetap
                mengatur ruang kerja tiap agen.
              </p>
            </div>
            <div className="landing-access-list">
              {integrations.slice(0, 3).map((app, index) => (
                <div key={app.name}>
                  <img
                    alt=""
                    height={26}
                    loading="lazy"
                    src={`/icons/${app.icon}`}
                    width={26}
                  />
                  <span>{app.name}</span>
                  <span>{team[index].name}</span>
                  <CheckmarkCircle02Icon aria-hidden />
                </div>
              ))}
            </div>
          </article>
          <article className="landing-feature-design" data-reveal="spread">
            <div className="landing-feature-copy">
              <h3>
                Dari brief
                <br />
                jadi bahan promo.
              </h3>
              <p>
                Konsep, teks, dan gambar dalam satu alur. Aktifkan alat gambar
                untuk menyiapkan desain yang bisa tim tinjau.
              </p>
              <a className="landing-text-link" href="#use-cases">
                Lihat hasilnya <ArrowRight01Icon aria-hidden />
              </a>
            </div>
            <div className="landing-feature-posters">
              <CampaignPoster compact industry={industries[0]} />
              <CampaignPoster compact industry={industries[2]} />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

export { FeatureSection };
