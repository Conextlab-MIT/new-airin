import { team } from "./landing-content";
import { WaitlistForm } from "./landing-waitlist";

function WaitlistSection() {
  return (
    <section
      aria-labelledby="waitlist-title"
      className="landing-waitlist"
      id="daftar-tunggu"
    >
      <div className="landing-wrap landing-waitlist-layout">
        <div data-reveal="rise">
          <h2 id="waitlist-title">
            Tim kecil.
            <br />
            Rencana besar.
            <br />
            <em>Kenalan dulu?</em>
          </h2>
          <p>
            Daftarkan bisnismu untuk mendapat kabar saat Airin siap menyambut
            tim baru.
          </p>
          <div aria-hidden className="landing-waitlist-team">
            {team.map((member) => (
              <img
                alt=""
                height={130}
                key={member.avatar}
                loading="lazy"
                src={`/characters/${member.avatar}.png`}
                width={130}
              />
            ))}
          </div>
        </div>
        <WaitlistForm />
      </div>
    </section>
  );
}

export { WaitlistSection };
