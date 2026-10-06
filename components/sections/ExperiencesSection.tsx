"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";

type Experience = {
  icon: string;
  title: string;
  description: string;
  image: string;
};

type Props = {
  experiences: Experience[];
  ui: { label: string; title: string; closeLabel: string };
};

function ExperienceIcon({ icon }: { icon: string }) {
  const commonProps = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (icon === "boat") {
    return (
      <svg {...commonProps} aria-hidden="true">
        <path d="M4 15.5h16l-2.2 4H6.2L4 15.5Z" />
        <path d="M8 15.5V6.5l6 3.1-6 2.9" />
        <path d="M8 6.5h5" />
      </svg>
    );
  }

  if (icon === "history") {
    return (
      <svg {...commonProps} aria-hidden="true">
        <path d="M5 20h14" />
        <path d="M7 20V9l5-4 5 4v11" />
        <path d="M9.5 20v-6h5v6" />
        <path d="M8 10h8" />
      </svg>
    );
  }

  if (icon === "olive") {
    return (
      <svg {...commonProps} aria-hidden="true">
        <path d="M12 20V5" />
        <path d="M12 9c-3.2-.3-5.2 1-6 3.8 3.1.4 5.1-.9 6-3.8Z" />
        <path d="M12 13c3.2-.3 5.2 1 6 3.8-3.1.4-5.1-.9-6-3.8Z" />
        <path d="M12 5c2.2.9 3.3 2.5 3.2 4.8-2.2-.7-3.3-2.3-3.2-4.8Z" />
      </svg>
    );
  }

  if (icon === "fish") {
    return (
      <svg {...commonProps} aria-hidden="true">
        <path d="M3.5 12s3.2-4.5 8.2-4.5S20.5 12 20.5 12s-3.8 4.5-8.8 4.5S3.5 12 3.5 12Z" />
        <path d="m20.5 12 2-2.5v5l-2-2.5Z" />
        <path d="M8 12h.01" />
        <path d="M13.5 8.2c1 1.7 1 5.9 0 7.6" />
      </svg>
    );
  }

  return <span aria-hidden="true">{icon}</span>;
}

export function ExperiencesSection({ experiences, ui }: Props) {
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);

  useEffect(() => {
    if (!selectedExperience) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedExperience(null);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedExperience]);

  return (
    <>
      <section id="experiences" className="section experiences-section">
        <div className="site-shell">
          <div className="section-header">
            <Reveal>
              <p className="section-label">{ui.label}</p>
            </Reveal>
            <Reveal delay="1">
              <h2 className="section-title" style={{ color: "white" }}>
                {ui.title}
              </h2>
            </Reveal>
          </div>

          <div className="experiences-grid">
            {experiences.map((experience, index) => (
              <Reveal
                key={experience.title}
                delay={String(Math.min(index, 3)) as "0" | "1" | "2" | "3"}
              >
                <button
                  type="button"
                  className="experience-card"
                  onClick={() => setSelectedExperience(experience)}
                >
                  <span className="experience-icon" aria-hidden="true">
                    <ExperienceIcon icon={experience.icon} />
                  </span>
                  <h3 className="experience-title">{experience.title}</h3>
                  <p className="experience-copy">{experience.description}</p>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {selectedExperience ? (
        <div
          className="guide-modal-backdrop"
          role="presentation"
          onClick={() => setSelectedExperience(null)}
        >
          <div
            className="guide-modal experience-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="experience-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="guide-modal-close"
              aria-label={ui.closeLabel}
              onClick={() => setSelectedExperience(null)}
            >
              ×
            </button>

            <div className="guide-modal-media">
              <Image
                src={selectedExperience.image}
                alt={selectedExperience.title}
                fill
                sizes="(max-width: 768px) 100vw, 45vw"
                className="guide-modal-image experience-modal-image"
              />
            </div>

            <div className="guide-modal-copy">
              <p className="guide-modal-tag">{ui.label}</p>
              <h3 id="experience-modal-title">{selectedExperience.title}</h3>
              <p>{selectedExperience.description}</p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
