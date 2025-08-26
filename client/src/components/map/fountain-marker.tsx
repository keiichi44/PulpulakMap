import L from "leaflet";

export function createFountainMarker(lat: number, lon: number) {
  return L.marker([lat, lon], {
    icon: L.divIcon({
      className: "custom-marker-fountain",
      html: "",
      iconSize: [24, 24],
      iconAnchor: [12, 24],
    }),
  });
}
