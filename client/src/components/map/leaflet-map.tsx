import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Fountain, UserLocation } from "@/pages/map";
import type { Route } from "@/services/routing-api";
import { calculateDistance } from "@/utils/distance";

// Fix for default markers in Leaflet with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface LeafletMapProps {
  fountains: Fountain[];
  userLocation: UserLocation | null;
  walkingRoute: Route | null;
  nearestFountain: Fountain | null;
}

const YEREVAN_CENTER: [number, number] = [40.1792, 44.4991];

export default function LeafletMap({ fountains, userLocation, walkingRoute, nearestFountain }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const fountainMarkersRef = useRef<L.Marker[]>([]);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: YEREVAN_CENTER,
      zoom: 13,
      zoomControl: false,
    });

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add custom zoom control
    L.control.zoom({
      position: "topleft",
    }).addTo(map);

    mapInstanceRef.current = map;

    // Custom CSS for markers
    const style = document.createElement("style");
    style.textContent = `
      .custom-marker-fountain {
        background: #9333ea;
        border: 2px solid #ffffff;
        border-radius: 50%;
        height: 16px;
        width: 16px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }
      
      .custom-marker-fountain-nearest {
        background: #7c3aed;
        border: 3px solid #ffffff;
        border-radius: 50%;
        height: 20px;
        width: 20px;
        box-shadow: 0 3px 8px rgba(147, 51, 234, 0.6);
        animation: pulse-nearest 2s infinite;
      }
      
      @keyframes pulse-nearest {
        0% {
          box-shadow: 0 3px 8px rgba(147, 51, 234, 0.6);
        }
        50% {
          box-shadow: 0 3px 12px rgba(147, 51, 234, 1);
        }
        100% {
          box-shadow: 0 3px 8px rgba(147, 51, 234, 0.6);
        }
      }
      
      .custom-marker-user {
        background: #4285f4;
        border: 3px solid #ffffff;
        border-radius: 50%;
        height: 20px;
        width: 20px;
        box-shadow: 0 2px 8px rgba(66, 133, 244, 0.4);
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      document.head.removeChild(style);
    };
  }, []);

  // Update fountain markers
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing fountain markers
    fountainMarkersRef.current.forEach((marker) => {
      mapInstanceRef.current?.removeLayer(marker);
    });
    fountainMarkersRef.current = [];

    // Add new fountain markers
    fountains.forEach((fountain) => {
      // Check if this is the nearest fountain
      const isNearest = nearestFountain && nearestFountain.id === fountain.id;
      
      const marker = L.marker([fountain.lat, fountain.lon], {
        icon: L.divIcon({
          className: isNearest ? "custom-marker-fountain-nearest" : "custom-marker-fountain",
          html: "",
          iconSize: isNearest ? [20, 20] : [16, 16],
          iconAnchor: isNearest ? [10, 10] : [8, 8],
        }),
      });
      
      // Get the best available name (prioritize English name)
      const englishName = fountain.tags?.["name:en"];
      const localName = fountain.name || fountain.tags?.name;
      const displayName = englishName || localName || "Public water fountain";
      const hasMultipleNames = englishName && localName && englishName !== localName;
      
      // Get image URL if available
      let imageUrl = fountain.tags?.image || fountain.tags?.wikimedia_commons;
      if (fountain.tags?.wikimedia_commons && !fountain.tags.wikimedia_commons.startsWith('http')) {
        // Convert Wikimedia Commons filename to URL
        const filename = fountain.tags.wikimedia_commons.replace(/^File:/, '');
        imageUrl = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=300`;
      }
      
      const popupContent = `
        <div class="p-3 min-w-[200px] max-w-[280px]">
          ${imageUrl ? `
            <img src="${imageUrl}" 
                 alt="Fountain image" 
                 class="w-full h-24 object-cover rounded-md mb-2"
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
                 style="display: block;" />
            <div style="display: none; background-color: #f3f4f6; border: 2px dashed #d1d5db; border-radius: 6px; padding: 12px; margin-bottom: 8px; text-align: center; color: #6b7280; font-size: 11px;">
              📷 Image unavailable
            </div>
          ` : ''}
          
          <h3 class="font-semibold text-sm mb-1 text-gray-900">${isNearest ? "🎯 Nearest Fountain" : "🚰 Drinking Fountain"}</h3>
          
          <div class="mb-2">
            <p class="text-sm font-medium text-gray-800 leading-tight">${displayName}</p>
            ${hasMultipleNames ? `<p class="text-xs text-gray-600 mt-1 italic">${localName}</p>` : ''}
          </div>
          
          <div class="text-xs text-gray-600 space-y-1">
            ${userLocation ? `
              <p class="flex items-center">
                <span class="mr-1">📍</span>
                Distance: ${Math.round(calculateDistance(userLocation.lat, userLocation.lng, fountain.lat, fountain.lon))}m
              </p>
            ` : ''}
            
            ${isNearest && walkingRoute ? `
              <p class="text-blue-600 font-medium flex items-center">
                <span class="mr-1">🗺️</span>
                Route shown in blue
              </p>
            ` : ''}
            
            ${fountain.tags?.access ? `
              <p class="flex items-center">
                <span class="mr-1">🔓</span>
                Access: ${fountain.tags.access}
              </p>
            ` : ''}
            
            ${fountain.tags?.fee === 'no' ? `
              <p class="flex items-center text-green-600">
                <span class="mr-1">💚</span>
                Free to use
              </p>
            ` : fountain.tags?.fee === 'yes' ? `
              <p class="flex items-center text-amber-600">
                <span class="mr-1">💰</span>
                Fee required
              </p>
            ` : ''}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.addTo(mapInstanceRef.current!);
      fountainMarkersRef.current.push(marker);
    });
  }, [fountains, userLocation, nearestFountain, walkingRoute]);

  // Update user marker
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Remove existing user marker
    if (userMarkerRef.current) {
      mapInstanceRef.current.removeLayer(userMarkerRef.current);
      userMarkerRef.current = null;
    }

    // Add new user marker if location exists
    if (userLocation) {
      const marker = L.marker([userLocation.lat, userLocation.lng], {
        icon: L.divIcon({
          className: "custom-marker-user",
          html: "",
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        }),
      });

      marker.bindPopup(`
        <div class="p-2">
          <h3 class="font-semibold text-sm">Your Location</h3>
        </div>
      `);

      marker.addTo(mapInstanceRef.current);
      userMarkerRef.current = marker;

      // If we have fountains, fit bounds to show user and nearest fountain
      if (fountains.length > 0) {
        let nearestFountain: Fountain | null = null;
        let shortestDistance = Infinity;

        fountains.forEach((fountain) => {
          const distance = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            fountain.lat,
            fountain.lon
          );

          if (distance < shortestDistance) {
            shortestDistance = distance;
            nearestFountain = fountain;
          }
        });

        if (nearestFountain) {
          const foundFountain = nearestFountain as Fountain;
          const bounds = L.latLngBounds([
            [userLocation.lat, userLocation.lng],
            [foundFountain.lat, foundFountain.lon],
          ]);
          mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
        }
      }
    }
  }, [userLocation, fountains]);

  // Display walking route
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Remove existing route
    if (routeLayerRef.current) {
      mapInstanceRef.current.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }

    // Add new route if it exists
    if (walkingRoute && walkingRoute.coordinates.length > 0) {
      const routeCoordinates: [number, number][] = walkingRoute.coordinates.map(
        (point) => [point.lat, point.lng]
      );

      const routePolyline = L.polyline(routeCoordinates, {
        color: '#4285f4',
        weight: 4,
        opacity: 0.8,
        smoothFactor: 1,
      });

      routePolyline.addTo(mapInstanceRef.current);
      routeLayerRef.current = routePolyline;

      // Fit map to show the route
      const bounds = routePolyline.getBounds();
      mapInstanceRef.current.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [walkingRoute]);

  return <div ref={mapRef} className="h-full w-full" />;
}
