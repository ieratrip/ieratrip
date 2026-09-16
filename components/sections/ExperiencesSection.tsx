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
                    {experience.icon}
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
