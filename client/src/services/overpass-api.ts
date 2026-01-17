import type { Fountain } from "@/pages/map";

const OVERPASS_API_URL = "https://overpass-api.de/api/interpreter";
const CACHE_KEY = "pulpuluck-fountains-cache";

function getCachedFountains(): Fountain[] | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {
    console.error("Error reading fountain cache:", e);
  }
  return null;
}

function setCachedFountains(fountains: Fountain[]): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(fountains));
  } catch (e) {
    console.error("Error caching fountains:", e);
  }
}

export async function fetchDrinkingFountains(): Promise<Fountain[]> {
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
    
    const fountains: Fountain[] = data.elements
      .filter((element: any) => element.lat && element.lon)
      .map((element: any) => ({
        id: element.id.toString(),
        lat: element.lat,
        lon: element.lon,
        name: element.tags?.name,
        tags: element.tags || {},
      }));

    setCachedFountains(fountains);
    return fountains;
  } catch (error) {
    console.error("Error fetching drinking fountains:", error);
    
    const cachedFountains = getCachedFountains();
    if (cachedFountains && cachedFountains.length > 0) {
      console.log("Using cached fountain data");
      return cachedFountains;
    }
    
    throw new Error("Failed to load fountain data and no cache available");
  }
}
