"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type GalleryItem = { image: string; alt: string };

type Props = {
  gallery: GalleryItem[];
  ui: { ariaLabel: string };
};

export function GalleryStrip({ gallery, ui }: Props) {
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  useEffect(() => {
    if (!selectedImage) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedImage(null);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedImage]);

  return (
    <>
      <section className="section" aria-label={ui.ariaLabel}>
        <div className="site-shell">
          <div className="gallery-strip">
            {gallery.map((item) => (
              <button
                key={item.image}
                type="button"
                className="gallery-card surface-card"
                onClick={() => setSelectedImage(item)}
              >
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  className="gallery-image"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {selectedImage ? (
        <div
          className="photo-modal-backdrop"
          role="presentation"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="photo-modal"
            role="dialog"
            aria-modal="true"
            aria-label={selectedImage.alt}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="guide-modal-close"
              aria-label="Κλείσιμο"
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>
            <Image
              src={selectedImage.image}
              alt={selectedImage.alt}
              fill
              sizes="(max-width: 900px) 92vw, 1100px"
              className="photo-modal-image"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
