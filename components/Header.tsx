"use client";

import { useEffect, useState } from "react";
import { LanguageSwitcher, type Lang } from "@/components/LanguageSwitcher";

type NavigationItem = { href: string; label: string };

type Props = {
  navigation: NavigationItem[];
  ui: { ariaLabel: string; brand: string };
  lang: Lang;
  onLangChange?: (lang: Lang) => void;
};

export function Header({ navigation, ui, lang, onLangChange }: Props) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="site-header">
      <nav className={scrolled ? "scrolled" : ""} aria-label={ui.ariaLabel}>
        <a className="brand" href="#top">
          <img src="/images/ieratrip-logo.svg" alt={ui.brand} className="brand-logo" />
        </a>
        <div className="nav-actions">
          <div className="nav-links">
            {navigation.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </div>
          <LanguageSwitcher lang={lang} variant="header" onChange={onLangChange} />
        </div>
      </nav>
    </header>
  );
}
