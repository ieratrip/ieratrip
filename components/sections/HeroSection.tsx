"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Reveal } from "@/components/Reveal";

type Props = {
  ui: {
    imageAlt: string;
    badge: string;
    title: { primary: string; emphasis: string };
    subtitle: string;
    cta: string;
  };
};

const heroSlides = [
  "/images/hero.jpg",
  "/images/μακρυ γιαλλος 6.jpg",
  "/images/ΧΡΥΣΗ 3.jpg",
  "/images/μακρυ γιαλλος 2.jpg",
  "/images/ΚΑΛΕ 1.jpg",
];

export function HeroSection({ ui }: Props) {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section id="top">
      <div className="hero-grid">
        <div className="hero-panel">
          <div className="hero-slides" aria-hidden="true">
            {heroSlides.map((slide, index) => (
              <Image
                key={slide}
                src={slide}
                alt=""
                fill
                priority={index === 0}
                sizes="100vw"
                className={`hero-image ${activeSlide === index ? "active" : ""}`}
              />
            ))}
          </div>
          <div className="hero-copy">
            <Reveal>
              <div className="hero-badge">{ui.badge}</div>
            </Reveal>
            <Reveal delay="1">
              <h1 className="hero-title">
                {ui.title.primary}
                <br />
                <em>{ui.title.emphasis}</em>
              </h1>
            </Reveal>
            <Reveal delay="2">
              <p className="hero-subtitle">{ui.subtitle}</p>
            </Reveal>
            <Reveal delay="3">
              <div className="hero-actions">
                <a className="button-primary" href="#destinations">
                  {ui.cta}
                </a>
              </div>
            </Reveal>
          </div>
          <div className="hero-slide-dots" aria-label={ui.imageAlt}>
            {heroSlides.map((slide, index) => (
              <button
                key={slide}
                type="button"
                className={activeSlide === index ? "active" : ""}
                aria-label={`Slide ${index + 1}`}
                aria-current={activeSlide === index}
                onClick={() => setActiveSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
