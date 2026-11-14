import { CheckmarkCircle02Icon } from "hugeicons-react";
import { comparison } from "./landing-content";

function ComparisonSection() {
  return (
    <section
      aria-labelledby="landing-comparison-title"
      className="landing-section landing-comparison"
    >
      <div className="landing-wrap">
        <div className="landing-section-heading" data-reveal="rise">
          <h2 id="landing-comparison-title">
            Dari satu chat
            <br />
            <em>ke satu tim.</em>
          </h2>
          <p>
            Bandingkan Airin dengan alur kerja biasa menggunakan satu asisten di
            chat. Fitur tiap layanan bisa berbeda.
          </p>
        </div>
        <div className="landing-table-scroll">
          <table className="landing-table">
            <caption className="sr-only">
              Perbandingan alur kerja AIRIN Superteam dengan satu asisten di
              chat
            </caption>
            <thead>
              <tr>
                <th scope="col">Cara kerja</th>
                <th scope="col">
                  <img
                    alt=""
                    height={28}
                    loading="lazy"
                    src="/super-agent-light.png"
                    width={28}
                  />
                  AIRIN Superteam
                </th>
                <th scope="col">Satu asisten di chat</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map(([topic, airin, chat]) => (
                <tr key={topic}>
                  <th scope="row">{topic}</th>
                  <td>
                    <CheckmarkCircle02Icon aria-hidden />
                    <span>{airin}</span>
                  </td>
                  <td>{chat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export { ComparisonSection };
