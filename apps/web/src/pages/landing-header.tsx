import { ArrowRight01Icon } from "hugeicons-react";
import { Link } from "react-router-dom";

function LandingHeader() {
  return (
    <header className="landing-header">
      <div className="landing-wrap landing-header-inner">
        <a aria-label="Airin, beranda" href="/">
          <img
            alt="Airin"
            height={40}
            src="/airin-wordmark-light.png"
            width={414}
          />
        </a>
        <nav aria-label="Navigasi utama">
          <a className="landing-nav-section" href="#fitur">
            Fitur
          </a>
          <a className="landing-nav-section" href="#use-cases">
            Untuk bisnismu
          </a>
          <a className="landing-nav-section" href="#onboarding">
            Cara mulai
          </a>
          <Link className="landing-login" to="/login">
            Masuk
          </Link>
          <a className="landing-button landing-nav-cta" href="#daftar-tunggu">
            Join Waitlist <ArrowRight01Icon aria-hidden />
          </a>
        </nav>
      </div>
    </header>
  );
}

export { LandingHeader };
