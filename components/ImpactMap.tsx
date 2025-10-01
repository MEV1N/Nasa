"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface ImpactMapProps {
  onLocationSelect: (lat: number, lng: number) => void;
  impactLocation: { lat: number; lng: number } | null;
  craterRadius?: number;
}

export default function ImpactMap({ onLocationSelect, impactLocation, craterRadius }: ImpactMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const circleRef = useRef<L.Circle | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!mapRef.current) {
      const map = L.map("impact-map").setView([20, 0], 2);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      map.on("click", (e) => {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      });

      mapRef.current = map;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [onLocationSelect]);

  useEffect(() => {
    if (!mapRef.current || !impactLocation) return;

    if (markerRef.current) {
      markerRef.current.remove();
    }

    const impactIcon = L.divIcon({
      className: "custom-impact-marker",
      html: `<div style="width: 30px; height: 30px; background: radial-gradient(circle, #ef4444, #dc2626); border: 3px solid #fca5a5; border-radius: 50%; box-shadow: 0 0 20px #ef4444;"></div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });

    markerRef.current = L.marker([impactLocation.lat, impactLocation.lng], {
      icon: impactIcon,
    }).addTo(mapRef.current);

    mapRef.current.setView([impactLocation.lat, impactLocation.lng], 6);
  }, [impactLocation]);

  useEffect(() => {
    if (!mapRef.current || !impactLocation || !craterRadius) return;

    if (circleRef.current) {
      circleRef.current.remove();
    }

    circleRef.current = L.circle([impactLocation.lat, impactLocation.lng], {
      color: "#ef4444",
      fillColor: "#dc2626",
      fillOpacity: 0.3,
      radius: craterRadius * 1000,
    }).addTo(mapRef.current);
  }, [impactLocation, craterRadius]);

  return (
    <div
      id="impact-map"
      className="w-full h-full rounded-lg overflow-hidden border-2 border-gray-800"
      style={{ minHeight: "500px" }}
    />
  );
}
