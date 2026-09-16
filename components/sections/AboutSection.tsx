import Image from "next/image";
import { Reveal } from "@/components/Reveal";

type Props = {
  ui: {
    imageAlt: string;
    label: string;
    title: { line1: string; emphasis: string; line2: string };
    copy: string;
    link: string;
  };
};

export function AboutSection({ ui }: Props) {
  return (
    <section id="about">
      <div className="about-grid">
        <div className="about-visual">
          <Image
            src="/images/about.jpg"
            alt={ui.imageAlt}
            fill
            className="about-image"
          />
        </div>
        <div className="about-content">
          <div className="section-header">
            <Reveal>
              <p className="section-label">{ui.label}</p>
            </Reveal>
            <Reveal delay="1">
              <h2 className="section-title">
                {ui.title.line1} <em>{ui.title.emphasis}</em>
                <br />
                {ui.title.line2}
              </h2>
            </Reveal>
            <Reveal delay="2">
              <p className="section-copy">{ui.copy}</p>
            </Reveal>
            <Reveal delay="3">
              <a href="#destinations" className="eyebrow-link">
                {ui.link}
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
