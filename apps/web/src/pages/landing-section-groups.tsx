import {
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
  UserGroupIcon,
} from "hugeicons-react";

function GroupsOnboardingSections() {
  return (
    <>
      <section
        aria-labelledby="landing-groups-title"
        className="landing-section landing-groups"
        id="agent-groups"
      >
        <div className="landing-wrap landing-groups-layout">
          <div data-reveal="rise">
            <h2 id="landing-groups-title">
              Satu grup.
              <br />
              <em>Banyak kepala.</em>
            </h2>
            <p>
              Satukan beberapa AI agent dalam satu grup bersama timmu. Mereka
              bisa saling ngobrol, berbagi konteks, dan meneruskan tugas sesuai
              keahliannya.
            </p>
            <p>
              Kamu cukup mulai dengan satu brief, ikut dalam diskusinya, lalu
              tinjau hasil bersama.
            </p>
            <a className="landing-button" href="#daftar-tunggu">
              Bangun AI superteam kamu <ArrowRight01Icon aria-hidden />
            </a>
          </div>
          <div className="landing-group-demo" data-reveal="assemble">
            <div className="landing-group-header">
              <div className="landing-group-avatars">
                {["jovan", "dimas", "kezia"].map((avatar) => (
                  <img
                    alt=""
                    height={44}
                    key={avatar}
                    loading="lazy"
                    src={`/characters/${avatar}.png`}
                    width={44}
                  />
                ))}
              </div>
              <div>
                <strong>Tim Promo Mingguan</strong>
                <span>Kamu, Jovan, Dimas, Kezia</span>
              </div>
              <UserGroupIcon aria-hidden />
            </div>
            <div className="landing-group-messages">
              <div className="landing-group-owner">
                <span>Kamu</span>
                <p>Tim, bantu siapkan promo untuk jam sepi minggu depan.</p>
              </div>
              {[
                {
                  avatar: "jovan",
                  name: "Jovan",
                  text: "Dimas, cek laporan penjualannya. Kezia, kita siapkan konsep dari temuan Dimas.",
                },
                {
                  avatar: "dimas",
                  name: "Dimas",
                  text: "Di laporan contoh ini, Selasa siang paling sepi. Kezia, paket makan siang bisa jadi bahan promonya.",
                },
                {
                  avatar: "kezia",
                  name: "Kezia",
                  text: "Siap. Aku susun konsep visual dan caption. Tim bisa cek harga serta stok sebelum kita lanjut.",
                },
              ].map((message) => (
                <div className="landing-group-message" key={message.avatar}>
                  <img
                    alt=""
                    height={36}
                    loading="lazy"
                    src={`/characters/${message.avatar}.png`}
                    width={36}
                  />
                  <div>
                    <strong>{message.name}</strong>
                    <p>{message.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="landing-group-summary">
              <CheckmarkCircle02Icon aria-hidden />
              <span>Satu brief → diskusi tim → hasil untuk ditinjau</span>
            </div>
            <p className="landing-group-disclaimer">
              Contoh percakapan grup AIRIN.
            </p>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="landing-onboarding-title"
        className="landing-section landing-onboarding"
        id="onboarding"
      >
        <div className="landing-wrap">
          <h2 data-reveal="rise" id="landing-onboarding-title" lang="en">
            Meet your next
            <br />
            <em>AI Superteam.</em>
          </h2>
          <ol className="landing-onboarding-steps">
            <li data-reveal="assemble">
              <div>
                <span>1</span>
                <img
                  alt=""
                  height={120}
                  loading="lazy"
                  src="/characters/hana.png"
                  width={120}
                />
              </div>
              <h3>Pilih pekerjaan pertama.</h3>
              <p>Mulai dari satu tugas yang paling menyita waktu tim.</p>
            </li>
            <li data-reveal="assemble">
              <div>
                <span>2</span>
                <img
                  alt=""
                  height={120}
                  loading="lazy"
                  src="/characters/dimas.png"
                  width={120}
                />
              </div>
              <h3>Kenalkan bisnismu.</h3>
              <p>Bagikan SOP dan file. Hubungkan aplikasi yang diperlukan.</p>
            </li>
            <li data-reveal="assemble">
              <div>
                <span>3</span>
                <img
                  alt=""
                  height={120}
                  loading="lazy"
                  src="/characters/kezia.png"
                  width={120}
                />
              </div>
              <h3>Kerja bareng, makin cocok.</h3>
              <p>
                Tinjau hasil pertama. Sesuaikan brief, lalu tambah tugas
                berikutnya.
              </p>
            </li>
          </ol>
        </div>
      </section>
    </>
  );
}

export { GroupsOnboardingSections };
