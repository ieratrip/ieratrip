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
    weather: {
      label: string;
      location: string;
      loading: string;
      fallback: string;
      wind: string;
    };
  };
};

type WeatherState = {
  temperature: number;
  windSpeed: number;
  code: number;
};

const heroSlides = [
  "/images/hero.jpg",
  "/images/ΑΡΧΙΚΗ 2.jpg",
  "/images/ΧΡΥΣΗ 3.jpg",
  "/images/μακρυ γιαλλος 2.jpg",
  "/images/ΚΑΛΕ 1.jpg",
];

const weatherLabels: Record<number, { icon: string; el: string; en: string }> = {
  0: { icon: "☀️", el: "Καθαρός", en: "Clear" },
  1: { icon: "🌤️", el: "Κυρίως αίθριος", en: "Mainly clear" },
  2: { icon: "⛅", el: "Λίγα σύννεφα", en: "Partly cloudy" },
  3: { icon: "☁️", el: "Συννεφιά", en: "Cloudy" },
  45: { icon: "🌫️", el: "Ομίχλη", en: "Fog" },
  48: { icon: "🌫️", el: "Ομίχλη", en: "Fog" },
  51: { icon: "🌦️", el: "Ψιλόβροχο", en: "Drizzle" },
  53: { icon: "🌦️", el: "Ψιλόβροχο", en: "Drizzle" },
  55: { icon: "🌦️", el: "Ψιλόβροχο", en: "Drizzle" },
  61: { icon: "🌧️", el: "Βροχή", en: "Rain" },
  63: { icon: "🌧️", el: "Βροχή", en: "Rain" },
  65: { icon: "🌧️", el: "Δυνατή βροχή", en: "Heavy rain" },
  80: { icon: "🌦️", el: "Μπόρες", en: "Showers" },
  81: { icon: "🌦️", el: "Μπόρες", en: "Showers" },
  82: { icon: "🌧️", el: "Δυνατές μπόρες", en: "Heavy showers" },
  95: { icon: "⛈️", el: "Καταιγίδα", en: "Thunderstorm" },
};

function getWeatherLabel(code: number, locale: "el" | "en") {
  const label = weatherLabels[code] ?? { icon: "🌡️", el: "Καιρός", en: "Weather" };
  return { icon: label.icon, text: locale === "el" ? label.el : label.en };
}

export function HeroSection({ ui }: Props) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [weather, setWeather] = useState<WeatherState | null>(null);
  const [weatherFailed, setWeatherFailed] = useState(false);
  const locale = ui.weather.label.startsWith("Κ") ? "el" : "en";

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const url =
      "https://api.open-meteo.com/v1/forecast?latitude=35.0119&longitude=25.7423&current=temperature_2m,weather_code,wind_speed_10m&timezone=Europe%2FAthens";

    async function loadWeather() {
      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error("Weather request failed");
        const data = (await response.json()) as {
          current?: {
            temperature_2m?: number;
            weather_code?: number;
            wind_speed_10m?: number;
          };
        };
        const current = data.current;
        if (
          typeof current?.temperature_2m !== "number" ||
          typeof current.weather_code !== "number" ||
          typeof current.wind_speed_10m !== "number"
        ) {
          throw new Error("Weather data missing");
        }

        setWeather({
          temperature: Math.round(current.temperature_2m),
          windSpeed: Math.round(current.wind_speed_10m),
          code: current.weather_code,
        });
      } catch (error) {
        if (!controller.signal.aborted) setWeatherFailed(true);
      }
    }

    loadWeather();

    return () => controller.abort();
  }, []);

  const weatherLabel = weather ? getWeatherLabel(weather.code, locale) : null;

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
          <div className="hero-weather" aria-live="polite">
            {weather ? (
              <>
                <span className="hero-weather-icon" aria-hidden="true">
                  {weatherLabel?.icon}
                </span>
                <span>
                  <strong>{ui.weather.label}</strong>
                  <small>{ui.weather.location}</small>
                </span>
                <span className="hero-weather-temp">{weather.temperature}°C</span>
                <span className="hero-weather-meta">
                  {weatherLabel?.text} · {ui.weather.wind} {weather.windSpeed} km/h
                </span>
              </>
            ) : (
              <>
                <span className="hero-weather-icon" aria-hidden="true">
                  🌡️
                </span>
                <span>
                  <strong>{weatherFailed ? ui.weather.fallback : ui.weather.loading}</strong>
                  <small>{ui.weather.location}</small>
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
