"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as LeafletMap, LayerGroup, LatLngExpression } from "leaflet";

type MapLocation = { lat: number; lng: number };

type MapItem = {
  name: string;
  address?: string;
  mapQuery?: string;
  mapsUrl?: string;
  location?: MapLocation;
};

type Props = {
  categoryId: string;
  categoryLabel: string;
  items: MapItem[];
  onItemSelect?: (item: MapItem) => void;
};

type CachedLocation = MapLocation | null;

const geocodeCache = new Map<string, CachedLocation>();

const defaultCenter: LatLngExpression = [35.0119, 25.7423];

const categoryCenters: Record<string, { center: LatLngExpression; zoom: number }> = {
  "food-drink": { center: [35.0119, 25.7423], zoom: 15 },
  beaches: { center: [35.004, 25.82], zoom: 11 },
  areas: { center: [35.045, 25.75], zoom: 10 },
  attractions: { center: [35.012, 25.742], zoom: 13 },
  activities: { center: [35.015, 25.76], zoom: 10 },
  services: { center: [35.0119, 25.7423], zoom: 14 },
};

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function buildQuery(item: MapItem) {
  if (item.mapQuery) return item.mapQuery;
  if (item.address) return `${item.address}, Ιεράπετρα, Κρήτη, Ελλάδα`;
  return `${item.name}, Ιεράπετρα, Κρήτη, Ελλάδα`;
}

export function buildMapsUrl(item: MapItem) {
  if (item.mapsUrl) return item.mapsUrl;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(buildQuery(item))}`;
}

async function geocodeItem(item: MapItem, signal: AbortSignal): Promise<CachedLocation> {
  if (item.location) return item.location;

  const query = buildQuery(item);
  if (geocodeCache.has(query)) return geocodeCache.get(query) ?? null;

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", "1");
  url.searchParams.set("countrycodes", "gr");
  url.searchParams.set("q", query);

  try {
    const response = await fetch(url.toString(), {
      signal,
      headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new Error("Map lookup failed");
    const results = (await response.json()) as Array<{ lat: string; lon: string }>;
    const first = results[0];
    const location = first ? { lat: Number(first.lat), lng: Number(first.lon) } : null;
    geocodeCache.set(query, location);
    return location;
  } catch (error) {
    if (signal.aborted) return null;
    geocodeCache.set(query, null);
    return null;
  }
}

function makePopup(item: MapItem, onItemSelect?: (item: MapItem) => void) {
  const popup = document.createElement("div");
  popup.className = "guide-map-popup";

  const title = document.createElement("button");
  title.type = "button";
  title.className = "guide-map-popup-title";
  title.textContent = item.name;
  title.addEventListener("click", () => onItemSelect?.(item));
  popup.appendChild(title);

  if (item.address) {
    const address = document.createElement("span");
    address.textContent = item.address;
    popup.appendChild(address);
  }

  const link = document.createElement("a");
  link.href = buildMapsUrl(item);
  link.target = "_blank";
  link.rel = "noreferrer";
  link.textContent = "Google Maps";
  popup.appendChild(link);

  return popup;
}

export function GuideCategoryMap({ categoryId, categoryLabel, items, onItemSelect }: Props) {
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerLayerRef = useRef<LayerGroup | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [resolvedCount, setResolvedCount] = useState(0);

  const mapItems = useMemo(
    () =>
      items.filter((item, index, allItems) => {
        const key = item.location
          ? `${item.location.lat},${item.location.lng}`
          : buildQuery(item);
        return (
          allItems.findIndex((candidate) => {
            const candidateKey = candidate.location
              ? `${candidate.location.lat},${candidate.location.lng}`
              : buildQuery(candidate);
            return candidateKey === key;
          }) === index
        );
      }),
    [items],
  );

  useEffect(() => {
    let disposed = false;

    async function setupMap() {
      if (!mapElementRef.current || mapRef.current) return;
      const L = await import("leaflet");
      if (disposed || !mapElementRef.current) return;

      const config = categoryCenters[categoryId] ?? { center: defaultCenter, zoom: 11 };
      const map = L.map(mapElementRef.current, {
        center: config.center,
        zoom: config.zoom,
        scrollWheelZoom: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      markerLayerRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
      setMapReady(true);
      window.setTimeout(() => map.invalidateSize(), 100);
    }

    setupMap();

    return () => {
      disposed = true;
    };
  }, [categoryId]);

  useEffect(() => {
    const controller = new AbortController();
    let disposed = false;

    async function renderMarkers() {
      if (!mapReady) return;
      const L = await import("leaflet");
      const map = mapRef.current;
      const markerLayer = markerLayerRef.current;
      if (!map || !markerLayer) return;

      const config = categoryCenters[categoryId] ?? { center: defaultCenter, zoom: 11 };
      map.setView(config.center, config.zoom);
      markerLayer.clearLayers();
      setResolvedCount(0);

      const icon = L.divIcon({
        className: "guide-map-marker",
        html: "<span></span>",
        iconSize: [26, 34],
        iconAnchor: [13, 34],
        popupAnchor: [0, -32],
      });
      const bounds = L.latLngBounds([]);
      let count = 0;

      for (const item of mapItems) {
        if (disposed || controller.signal.aborted) return;
        const location = await geocodeItem(item, controller.signal);
        if (!location) {
          await wait(80);
          continue;
        }

        const marker = L.marker([location.lat, location.lng], { icon }).bindPopup(
          makePopup(item, onItemSelect),
        );
        marker.addTo(markerLayer);
        bounds.extend([location.lat, location.lng]);
        count += 1;
        setResolvedCount(count);

        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [28, 28], maxZoom: 15 });
        }

        await wait(80);
      }
    }

    renderMarkers();

    return () => {
      disposed = true;
      controller.abort();
    };
  }, [categoryId, mapItems, mapReady, onItemSelect]);

  useEffect(() => {
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      markerLayerRef.current = null;
    };
  }, []);

  return (
    <div className="guide-category-map-shell" aria-label={`Χάρτης: ${categoryLabel}`}>
      <div ref={mapElementRef} className="guide-category-map" />
      <div className="guide-map-status">
        {resolvedCount}/{mapItems.length}
      </div>
    </div>
  );
}
