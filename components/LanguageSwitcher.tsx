"use client";

import { useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";

export type Lang = "el" | "en";

type Props = {
  lang: Lang;
  onChange?: (lang: Lang) => void;
  variant?: "hero" | "header";
};

function setLangCookie(lang: Lang) {
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `lang=${lang}; path=/; max-age=${maxAge}; samesite=lax`;
}

export function LanguageSwitcher({ lang, onChange, variant = "header" }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onSelect = useCallback(
    (nextLang: Lang) => {
      if (nextLang === lang) return;
      setLangCookie(nextLang);
      onChange?.(nextLang);
      startTransition(() => {
        router.refresh();
      });
    },
    [lang, onChange, router],
  );

  return (
    <div className={`language-switch ${variant}`} role="group" aria-label="Language">
      <button
        type="button"
        className={`language-switch-button ${lang === "el" ? "active" : ""}`}
        aria-pressed={lang === "el"}
        onClick={() => onSelect("el")}
        disabled={isPending}
      >
        Ελληνικά
      </button>
      <button
        type="button"
        className={`language-switch-button ${lang === "en" ? "active" : ""}`}
        aria-pressed={lang === "en"}
        onClick={() => onSelect("en")}
        disabled={isPending}
      >
        English
      </button>
    </div>
  );
}
