"use client";

import Image from "next/image";
import { type CSSProperties, useEffect, useMemo, useState } from "react";
import { Reveal } from "@/components/Reveal";
import type { GuideCategory } from "@/data/site";

type GuideItem = GuideCategory["groups"][number]["items"][number];

const imageByCategoryId: Record<string, string> = {
  "food-drink": "/images/φαγητο και ποτο.jpg",
  beaches: "/images/παραλια ιεραπετρας 3.jpg",
  areas: "/images/χωρια.jpg",
  attractions: "/images/αξιοθεατα.jpg",
  activities: "/images/δραστηριοτητες.jpg",
  services: "/images/υπηρεσιες.jpg",
};

function isRemoteImage(src: string) {
  return src.startsWith("http://") || src.startsWith("https://");
}

type Props = {
  guideCategories: GuideCategory[];
  ui: {
    label: string;
    title: string;
    copy: string;
    tabsAriaLabel: string;
    closeLabel: string;
    fields: {
      hours: string;
      phone: string;
      address: string;
      priceRange: string;
    };
  };
};

export function GuideSection({ guideCategories, ui }: Props) {
  const [activeCategoryId, setActiveCategoryId] = useState(guideCategories[0]?.id ?? "");
  const activeCategory =
    guideCategories.find((category) => category.id === activeCategoryId) ?? guideCategories[0];
  const [activeGroupTitle, setActiveGroupTitle] = useState(activeCategory?.groups[0]?.title ?? "");
  const [selectedItem, setSelectedItem] = useState<
    { item: GuideItem; categoryId: string; categoryLabel: string; groupTitle: string } | null
  >(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    setActiveGroupTitle(activeCategory?.groups[0]?.title ?? "");
  }, [activeCategoryId, activeCategory]);

  useEffect(() => {
    if (!selectedItem) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedItem(null);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedItem]);

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [selectedItem]);

  const activeGroup =
    activeCategory?.groups.find((group) => group.title === activeGroupTitle) ??
    activeCategory?.groups[0];

  const revealDelays: Array<"0" | "1" | "2" | "3"> = ["0", "1", "2", "3"];

  const featuredImages = useMemo(() => {
    if (!selectedItem) return [];
    const fallbackImage =
      selectedItem.item.image ??
      imageByCategoryId[selectedItem.categoryId] ??
      activeCategory.image;
    return selectedItem.item.images?.length ? selectedItem.item.images : [fallbackImage];
  }, [activeCategory.image, selectedItem]);

  const featuredImage =
    featuredImages[Math.min(selectedImageIndex, Math.max(featuredImages.length - 1, 0))] ?? "";

  if (!activeCategory) {
    return null;
  }

  return (
    <>
      <section id="guide" className="section guide-section">
        <div className="site-shell">
              <div className="section-header">
                <Reveal>
                  <p className="section-label">{ui.label}</p>
                </Reveal>
                <Reveal delay="1">
                  <h2 className="section-title">{ui.title}</h2>
                </Reveal>
                <Reveal delay="2">
                  <p className="section-copy">{ui.copy}</p>
                </Reveal>
              </div>

          <div className="guide-layout">
            <Reveal className="guide-panel">
              <div className="guide-tabs" role="tablist" aria-label={ui.tabsAriaLabel}>
                {guideCategories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    className={`guide-tab ${category.id === activeCategory.id ? "active" : ""}`}
                    onClick={() => setActiveCategoryId(category.id)}
                  >
                    {category.label}
                  </button>
                ))}
              </div>

              <div className="guide-hero">
                <div className="guide-hero-copy">
                  <p className="guide-kicker">{activeCategory.label}</p>
                  <h3>{activeCategory.label}</h3>
                  <p>{activeCategory.intro}</p>
                </div>
                <div className="guide-hero-image-wrap">
                  <Image
                    src={activeCategory.image}
                    alt={activeCategory.label}
                    fill
                    unoptimized={isRemoteImage(activeCategory.image)}
                    className="guide-hero-image"
                  />
                </div>
              </div>

              <div className="guide-subtabs" aria-label="Υποκατηγορίες">
                {activeCategory.groups.map((group) => (
                  <button
                    key={group.title}
                    type="button"
                    className={`guide-subtab ${group.title === activeGroup?.title ? "active" : ""}`}
                    onClick={() => setActiveGroupTitle(group.title)}
                  >
                    {group.title}
                  </button>
                ))}
              </div>

              <div className="guide-items-grid">
                {activeGroup?.items.map((item, index) => {
                  const hasVisualCard =
                    (activeCategory.id === "beaches" || activeCategory.id === "areas") &&
                    Boolean(item.image);
                  const cardStyle = hasVisualCard
                    ? ({
                        "--guide-card-image": `url("${item.image}")`,
                      } as CSSProperties)
                    : undefined;

                  return (
                    <Reveal
                      key={`${activeGroup.title}-${item.name}`}
                      delay={revealDelays[index % revealDelays.length]}
                    >
                      <button
                        type="button"
                        className={`guide-item-card ${hasVisualCard ? "guide-item-card-visual" : ""}`}
                        style={cardStyle}
                        onClick={() =>
                          setSelectedItem({
                            item,
                            categoryId: activeCategory.id,
                            categoryLabel: activeCategory.label,
                            groupTitle: activeGroup.title,
                          })
                        }
                      >
                        <span className="guide-item-meta">{activeGroup.title}</span>
                        <strong>{item.name}</strong>
                        <span>{item.description}</span>
                      </button>
                    </Reveal>
                  );
                })}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {selectedItem ? (
        <div
          className="guide-modal-backdrop"
          role="presentation"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="guide-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="guide-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="guide-modal-close"
              aria-label={ui.closeLabel}
              onClick={() => setSelectedItem(null)}
            >
              ×
            </button>

            <div className="guide-modal-media">
              <Image
                src={featuredImage}
                alt={selectedItem.item.name}
                fill
                unoptimized={isRemoteImage(featuredImage)}
                className="guide-modal-image"
              />
              {featuredImages.length > 1 ? (
                <div className="guide-modal-slider" aria-label="Φωτογραφίες">
                  <button
                    type="button"
                    aria-label="Προηγούμενη φωτογραφία"
                    onClick={() =>
                      setSelectedImageIndex((current) =>
                        current === 0 ? featuredImages.length - 1 : current - 1,
                      )
                    }
                  >
                    ‹
                  </button>
                  <span>
                    {selectedImageIndex + 1}/{featuredImages.length}
                  </span>
                  <button
                    type="button"
                    aria-label="Επόμενη φωτογραφία"
                    onClick={() =>
                      setSelectedImageIndex((current) =>
                        current === featuredImages.length - 1 ? 0 : current + 1,
                      )
                    }
                  >
                    ›
                  </button>
                </div>
              ) : null}
            </div>

            <div className="guide-modal-copy">
              <p className="guide-modal-tag">
                {selectedItem.categoryLabel} • {selectedItem.groupTitle}
              </p>
              <h3 id="guide-modal-title">{selectedItem.item.name}</h3>
              <p>{selectedItem.item.description}</p>
              {selectedItem.item.hours ? (
                <div className="guide-modal-info">
                  <span>{ui.fields.hours}</span>
                  <strong>{selectedItem.item.hours}</strong>
                </div>
              ) : null}
              {selectedItem.item.phone ? (
                <div className="guide-modal-info">
                  <span>{ui.fields.phone}</span>
                  <strong>
                    <a href={`tel:${selectedItem.item.phone}`}>{selectedItem.item.phone}</a>
                  </strong>
                </div>
              ) : null}
              {selectedItem.item.address ? (
                <div className="guide-modal-info">
                  <span>{ui.fields.address}</span>
                  <strong>{selectedItem.item.address}</strong>
                </div>
              ) : null}
              {selectedItem.item.priceRange ? (
                <div className="guide-modal-info">
                  <span>{ui.fields.priceRange}</span>
                  <strong>{selectedItem.item.priceRange}</strong>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
