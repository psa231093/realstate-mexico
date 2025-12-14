"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { formatMXN } from "@/lib/utils";

interface Property {
  id: string;
  slug: string;
  title: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  imageUrl: string;
  address: string;
  status: string;
  badge?: string;
  latitude: number;
  longitude: number;
}

interface PropertyMapProps {
  properties: Property[];
  onPropertyHover?: (propertyId: string | null) => void;
  hoveredPropertyId?: string | null;
}

export function PropertyMap({
  properties,
  onPropertyHover,
  hoveredPropertyId,
}: PropertyMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const popupRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    // Dynamically import mapbox-gl
    import("mapbox-gl").then((mapboxgl) => {
      // Import CSS
      import("mapbox-gl/dist/mapbox-gl.css");

      const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
      if (!token) {
        console.error("Mapbox token not found");
        return;
      }

      mapboxgl.default.accessToken = token;

      const mapStyle = process.env.NEXT_PUBLIC_MAPBOX_STYLE || "mapbox://styles/mapbox/streets-v12";

      const map = new mapboxgl.default.Map({
        container: mapContainerRef.current!,
        style: mapStyle,
        center: [-99.1332, 19.4326], // Mexico City
        zoom: 11,
      });

      map.addControl(new mapboxgl.default.NavigationControl(), "bottom-right");

      mapRef.current = map;

      map.on("load", () => {
        setMapLoaded(true);
      });

      return () => {
        map.remove();
      };
    });
  }, []);

  // Add markers when map is loaded
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    import("mapbox-gl").then((mapboxgl) => {
      // Clear existing markers
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      // Add new markers
      properties.forEach((property) => {
        // Create custom marker element
        const el = document.createElement("div");
        el.className = "property-marker";
        el.innerHTML = `
          <div class="px-2 py-1 rounded-md font-semibold text-xs cursor-pointer shadow-md transition-all duration-200 bg-white text-gray-900 border border-gray-300 hover:bg-blue-600 hover:text-white hover:border-blue-600" data-property-id="${property.id}">
            ${formatMXN(property.price, true)}
          </div>
        `;

        // Create popup
        const popup = new mapboxgl.default.Popup({
          offset: 25,
          closeButton: true,
          closeOnClick: false,
          maxWidth: "280px",
        }).setHTML(`
          <a href="/propiedades/${property.slug}" class="block" target="_blank">
            <div class="w-64">
              <img src="${property.imageUrl}" alt="${property.title}" class="w-full h-32 object-cover rounded-t-md" />
              <div class="p-2">
                <p class="font-bold text-gray-900">${formatMXN(property.price)}</p>
                <p class="text-xs text-gray-600 mt-1">
                  ${property.bedrooms ? `${property.bedrooms} rec` : ""}
                  ${property.bathrooms ? ` · ${property.bathrooms} baños` : ""}
                  ${property.area ? ` · ${property.area} m²` : ""}
                </p>
                <p class="text-xs text-gray-500 mt-1 truncate">${property.address}</p>
              </div>
            </div>
          </a>
        `);

        const marker = new mapboxgl.default.Marker({ element: el })
          .setLngLat([property.longitude, property.latitude])
          .setPopup(popup)
          .addTo(mapRef.current);

        // Add hover events
        el.addEventListener("mouseenter", () => {
          onPropertyHover?.(property.id);
        });
        el.addEventListener("mouseleave", () => {
          onPropertyHover?.(null);
        });

        markersRef.current.push(marker);
      });
    });
  }, [mapLoaded, properties, onPropertyHover]);

  // Update marker styles when hoveredPropertyId changes
  useEffect(() => {
    if (!mapLoaded) return;

    markersRef.current.forEach((marker) => {
      const el = marker.getElement();
      const markerDiv = el.querySelector("[data-property-id]");
      if (markerDiv) {
        const propertyId = markerDiv.getAttribute("data-property-id");
        if (propertyId === hoveredPropertyId) {
          markerDiv.className =
            "px-2 py-1 rounded-md font-semibold text-xs cursor-pointer shadow-md transition-all duration-200 bg-blue-600 text-white scale-110 z-10";
        } else {
          markerDiv.className =
            "px-2 py-1 rounded-md font-semibold text-xs cursor-pointer shadow-md transition-all duration-200 bg-white text-gray-900 border border-gray-300 hover:bg-blue-600 hover:text-white hover:border-blue-600";
        }
      }
    });
  }, [hoveredPropertyId, mapLoaded]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full" />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="text-muted-foreground">Cargando mapa...</div>
        </div>
      )}
    </div>
  );
}
