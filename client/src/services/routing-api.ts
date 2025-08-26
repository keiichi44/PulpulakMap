export interface RoutePoint {
  lat: number;
  lng: number;
}

export interface Route {
  coordinates: RoutePoint[];
  distance: number; // in meters
  duration: number; // in seconds
}

// Using OpenRouteService API for routing (free tier available)
const ORS_API_URL = "https://api.openrouteservice.org/v2/directions/foot-walking";

export async function fetchWalkingRoute(
  start: RoutePoint,
  end: RoutePoint
): Promise<Route | null> {
  try {
    // For demo purposes, create a simple straight-line route with some waypoints
    // In a real app, you'd use an actual routing service with an API key
    
    // Calculate intermediate points for a more realistic looking route
    const coordinates: RoutePoint[] = [];
    const steps = 5;
    
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const lat = start.lat + (end.lat - start.lat) * t;
      const lng = start.lng + (end.lng - start.lng) * t;
      
      // Add some slight curves to make it look more like a walking route
      const curvature = Math.sin(t * Math.PI) * 0.001;
      coordinates.push({
        lat: lat + curvature,
        lng: lng + curvature * 0.5,
      });
    }
    
    // Calculate approximate distance (straight line distance * 1.3 for walking route)
    const straightDistance = calculateStraightDistance(start, end);
    const walkingDistance = Math.round(straightDistance * 1.3);
    
    // Estimate walking time (average 5 km/h = 1.4 m/s)
    const walkingDuration = Math.round(walkingDistance / 1.4);
    
    return {
      coordinates,
      distance: walkingDistance,
      duration: walkingDuration,
    };
  } catch (error) {
    console.error("Error fetching walking route:", error);
    return null;
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