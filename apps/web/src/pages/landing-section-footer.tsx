import { ArrowRight01Icon } from "hugeicons-react";
import { Link } from "react-router-dom";
import { industries } from "./landing-content";

function LandingFooter() {
  return (
    <footer className="landing-footer landing-wrap">
      <div>
        <a aria-label="Airin, beranda" href="/">
          <img
            alt="Airin"
            height={40}
            src="/airin-wordmark-light.png"
            width={414}
          />
        </a>
        <span>Kerja nyata. Tim lebih kuat.</span>
      </div>
      <div>
        <p>
          Foto industri:{" "}
          {industries.map((item) => (
            <a href={item.photo} key={item.id}>
              {item.credit}
            </a>
          ))}
        </p>
        <Link to="/login">
          Masuk ke Airin <ArrowRight01Icon aria-hidden />
        </Link>
      </div>
    </footer>
  );
}

export { LandingFooter };
