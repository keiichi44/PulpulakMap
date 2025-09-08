export interface RoutePoint {
  lat: number;
  lng: number;
}

export interface Route {
  coordinates: RoutePoint[];
  distance: number; // in meters
  duration: number; // in seconds
}

// Using OSRM (Open Source Routing Machine) free public API for pedestrian routing
const OSRM_API_URL = "https://router.project-osrm.org/route/v1/foot";

export async function fetchWalkingRoute(
  start: RoutePoint,
  end: RoutePoint
): Promise<Route | null> {
  try {
    // Format coordinates for OSRM API (longitude,latitude format)
    const startCoord = `${start.lng},${start.lat}`;
    const endCoord = `${end.lng},${end.lat}`;
    
    // Build API URL with proper parameters for pedestrian routing
    const url = `${OSRM_API_URL}/${startCoord};${endCoord}?geometries=geojson&overview=full&steps=false`;
    
    console.log("Requesting route from:", url);
    
    // Create an AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
    
    const response = await fetch(url, { 
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`OSRM API error: ${response.status}`);
    }
    
    console.log("Route response received");
    
    const data = await response.json();
    console.log("Route data parsed:", data);
    
    if (!data.routes || data.routes.length === 0) {
      console.warn("No routes found between the points");
      return null;
    }
    
    const route = data.routes[0];
    console.log("Processing route with", route.geometry.coordinates.length, "coordinates");
    
    // Convert GeoJSON coordinates to our RoutePoint format
    // OSRM returns coordinates as [longitude, latitude] arrays
    const coordinates: RoutePoint[] = route.geometry.coordinates.map(
      (coord: [number, number]) => ({
        lat: coord[1], // latitude is second element
        lng: coord[0], // longitude is first element
      })
    );
    
    const result = {
      coordinates,
      distance: Math.round(route.distance), // OSRM returns distance in meters
      duration: Math.round(route.duration), // OSRM returns duration in seconds
    };
    
    console.log("Returning route result:", result);
    return result;
    
  } catch (error) {
    console.error("Error fetching walking route:", error);
    
    // Fallback to simple straight line if routing service fails
    const straightDistance = calculateStraightDistance(start, end);
    const fallbackCoordinates = [start, end];
    
    console.log("Using fallback route");
    return {
      coordinates: fallbackCoordinates,
      distance: Math.round(straightDistance),
      duration: Math.round(straightDistance / 1.4), // 5 km/h walking speed
    };
  }
}

function calculateStraightDistance(point1: RoutePoint, point2: RoutePoint): number {
  const R = 6371000; // Earth's radius in meters
  const φ1 = (point1.lat * Math.PI) / 180;
  const φ2 = (point2.lat * Math.PI) / 180;
  const Δφ = ((point2.lat - point1.lat) * Math.PI) / 180;
  const Δλ = ((point2.lng - point1.lng) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}