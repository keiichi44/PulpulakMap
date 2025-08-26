import L from "leaflet";

export function createUserMarker(lat: number, lng: number) {
  return L.marker([lat, lng], {
    icon: L.divIcon({
      className: "custom-marker-user",
      html: "",
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    }),
  });
}
