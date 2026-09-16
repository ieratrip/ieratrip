"use client";

import { useEffect, useState } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { AboutSection } from "@/components/sections/AboutSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { DestinationsSection } from "@/components/sections/DestinationsSection";
import { ExperiencesSection } from "@/components/sections/ExperiencesSection";
import { GalleryStrip } from "@/components/sections/GalleryStrip";
import { GuideSection } from "@/components/sections/GuideSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { StatsStrip } from "@/components/sections/StatsStrip";
import { TravelSection } from "@/components/sections/TravelSection";
import * as el from "@/data/site";
import * as en from "@/data/site.en";

type Lang = "el" | "en";

function getLangFromCookie(): Lang | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )lang=([^;]+)/);
  const value = match ? decodeURIComponent(match[1] ?? "") : "";
  if (value === "el") return "el";
  if (value === "en") return "en";
  return null;
}

export default function HomePage() {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const cookieLang = getLangFromCookie();
    if (cookieLang) setLang(cookieLang);
  }, []);

  const site = lang === "en" ? en : el;

  return (
    <>
      <Header
        navigation={site.navigation}
        ui={site.ui.header}
        lang={lang}
        onLangChange={setLang}
      />
      <main>
        <HeroSection ui={site.ui.hero} />
        <StatsStrip stats={site.stats} />
        <AboutSection ui={site.ui.about} />
        <DestinationsSection destinations={site.destinations} ui={site.ui.destinations} />
        <GuideSection guideCategories={site.guideCategories} ui={site.ui.guide} />
        <GalleryStrip gallery={site.gallery} ui={site.ui.gallery} />
        <ExperiencesSection experiences={site.experiences} ui={site.ui.experiences} />
        <TravelSection travelInfo={site.travelInfo} ui={site.ui.travel} />
        <ContactSection contactDetails={site.contactDetails} ui={site.ui.contact} />
      </main>
      <Footer navigation={site.navigation} contactDetails={site.contactDetails} ui={site.ui.footer} />
    </>
  );
}
