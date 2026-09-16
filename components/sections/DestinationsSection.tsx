"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Reveal } from "@/components/Reveal";

type Destination = {
  name: string;
  tag: string;
  description: string;
  image: string;
  images?: string[];
  featured?: boolean;
};

type Props = {
  destinations: Destination[];
  ui: { label: string; title: string; closeLabel: string };
};

export function DestinationsSection({ destinations, ui }: Props) {
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (!selectedDestination) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedDestination(null);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedDestination]);

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [selectedDestination]);

  const selectedImages = selectedDestination?.images?.length
    ? selectedDestination.images
    : selectedDestination
      ? [selectedDestination.image]
      : [];
  const selectedImage =
    selectedImages[Math.min(selectedImageIndex, Math.max(selectedImages.length - 1, 0))] ?? "";

  return (
    <>
      <section id="destinations" className="section">
        <div className="site-shell">
          <div className="section-header">
            <Reveal>
              <p className="section-label">{ui.label}</p>
            </Reveal>
            <Reveal delay="1">
              <h2 className="section-title">{ui.title}</h2>
            </Reveal>
          </div>

          <div className="destination-grid">
            {destinations.map((destination, index) => (
              <Reveal
                key={destination.name}
                delay={String(Math.min((index % 3) + 1, 3)) as "1" | "2" | "3"}
              >
                <button
                  type="button"
                  className={`destination-card ${
                    destination.featured ? "destination-featured" : ""
                  }`}
                  onClick={() => setSelectedDestination(destination)}
                >
                  <Image
                    src={destination.image}
                    alt={destination.name}
                    fill
                    unoptimized={destination.image.startsWith("http")}
                    className="destination-image"
                  />
                  <div className="destination-content">
                    <p className="destination-tag">{destination.tag}</p>
                    <h3 className="destination-title">{destination.name}</h3>
                    <p className="destination-copy">{destination.description}</p>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {selectedDestination ? (
        <div
          className="guide-modal-backdrop"
          role="presentation"
          onClick={() => setSelectedDestination(null)}
        >
          <div
            className="guide-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="destination-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="guide-modal-close"
              aria-label={ui.closeLabel}
              onClick={() => setSelectedDestination(null)}
            >
              ×
            </button>

            <div className="guide-modal-media">
              <Image
                src={selectedImage}
                alt={selectedDestination.name}
                fill
                unoptimized={selectedImage.startsWith("http")}
                className="guide-modal-image"
              />
              {selectedImages.length > 1 ? (
                <div className="guide-modal-slider" aria-label="Φωτογραφίες">
                  <button
                    type="button"
                    aria-label="Προηγούμενη φωτογραφία"
                    onClick={() =>
                      setSelectedImageIndex((current) =>
                        current === 0 ? selectedImages.length - 1 : current - 1,
                      )
                    }
                  >
                    ‹
                  </button>
                  <span>
                    {selectedImageIndex + 1}/{selectedImages.length}
                  </span>
                  <button
                    type="button"
                    aria-label="Επόμενη φωτογραφία"
                    onClick={() =>
                      setSelectedImageIndex((current) =>
                        current === selectedImages.length - 1 ? 0 : current + 1,
                      )
                    }
                  >
                    ›
                  </button>
                </div>
              ) : null}
            </div>

            <div className="guide-modal-copy">
              <p className="guide-modal-tag">{selectedDestination.tag}</p>
              <h3 id="destination-modal-title">{selectedDestination.name}</h3>
              <p>{selectedDestination.description}</p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
