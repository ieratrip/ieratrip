import { Reveal } from "@/components/Reveal";

type TravelItem = {
  title: string;
  detail: string;
};

type Props = {
  travelInfo: TravelItem[];
  ui: {
    label: string;
    title: { line1: string; line2: string };
    googleMaps: string;
    googleMapsUrl: string;
    appleMaps: string;
    appleMapsUrl: string;
    iframeTitle: string;
    iframeSrc: string;
  };
};

export function TravelSection({ travelInfo, ui }: Props) {
  return (
    <section id="travel">
      <div className="travel-grid">
        <div className="travel-content">
          <div className="section-header">
            <Reveal>
              <p className="section-label">{ui.label}</p>
            </Reveal>
            <Reveal delay="1">
              <h2 className="section-title">
                {ui.title.line1}
                <br />
                {ui.title.line2}
              </h2>
            </Reveal>
          </div>

          <ul className="travel-list">
            {travelInfo.map((item, index) => (
              <Reveal
                key={item.title}
                delay={String(Math.min(index + 1, 3)) as "1" | "2" | "3"}
              >
                <li>
                  <strong>{item.title}</strong>
                  <span>{item.detail}</span>
                </li>
              </Reveal>
            ))}
          </ul>

          <div className="travel-actions">
            <a
              className="button-primary"
              href={ui.googleMapsUrl}
              target="_blank"
              rel="noreferrer"
            >
              {ui.googleMaps}
            </a>
            <a
              className="button-secondary"
              href={ui.appleMapsUrl}
              target="_blank"
              rel="noreferrer"
            >
              {ui.appleMaps}
            </a>
          </div>
        </div>

        <div className="travel-map">
          <iframe
            src={ui.iframeSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={ui.iframeTitle}
          />
        </div>
      </div>
    </section>
  );
}
