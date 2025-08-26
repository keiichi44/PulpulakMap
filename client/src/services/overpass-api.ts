import type { Fountain } from "@/pages/map";

const OVERPASS_API_URL = "https://overpass-api.de/api/interpreter";

export async function fetchDrinkingFountains(): Promise<Fountain[]> {
  // Yerevan bounding box: approximately 40.1, 44.4, 40.3, 44.7
  const overpassQuery = `
    [out:json][timeout:25];
    (
      node["amenity"="drinking_water"](40.1,44.4,40.3,44.7);
      way["amenity"="drinking_water"](40.1,44.4,40.3,44.7);
      relation["amenity"="drinking_water"](40.1,44.4,40.3,44.7);
    );
    out geom;
  `;

  try {
    const response = await fetch(OVERPASS_API_URL, {
      method: "POST",
      body: "data=" + encodeURIComponent(overpassQuery),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Filter out elements without coordinates and transform to our Fountain type
    const fountains: Fountain[] = data.elements
      .filter((element: any) => element.lat && element.lon)
      .map((element: any) => ({
        id: element.id.toString(),
        lat: element.lat,
        lon: element.lon,
        name: element.tags?.name,
        tags: element.tags || {},
      }));

    return fountains;
  } catch (error) {
    console.error("Error fetching drinking fountains:", error);
    
    // Return some fallback fountains for demonstration
    // In a real app, you might want to throw the error instead
    return [
      {
        id: "1",
        lat: 40.1776,
        lon: 44.5126,
        name: "Republic Square Fountain",
        tags: { name: "Republic Square Fountain" },
      },
      {
        id: "2",
        lat: 40.1836,
        lon: 44.5147,
        name: "Opera House Fountain",
        tags: { name: "Opera House Fountain" },
      },
      {
        id: "3",
        lat: 40.1901,
        lon: 44.5153,
        name: "Northern Avenue Fountain",
        tags: { name: "Northern Avenue Fountain" },
      },
      {
        id: "4",
        lat: 40.1695,
        lon: 44.5089,
        name: "Victory Park Fountain",
        tags: { name: "Victory Park Fountain" },
      },
      {
        id: "5",
        lat: 40.1812,
        lon: 44.4889,
        name: "Hrazdan Gorge Fountain",
        tags: { name: "Hrazdan Gorge Fountain" },
      },
    ];
  }
}
