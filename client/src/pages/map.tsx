import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Navigation, HelpCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import LeafletMap from "@/components/map/leaflet-map";
import InfoModal from "@/components/info-modal";
import { fetchDrinkingFountains } from "@/services/overpass-api";
import { getCurrentPosition } from "@/utils/geolocation";
import { calculateDistance } from "@/utils/distance";

export interface Fountain {
  id: string;
  lat: number;
  lon: number;
  name?: string;
  tags?: Record<string, string>;
}

export interface UserLocation {
  lat: number;
  lng: number;
}

export default function MapPage() {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const { toast } = useToast();

  const {
    data: fountains = [],
    isLoading: isFountainsLoading,
    error: fountainsError,
  } = useQuery({
    queryKey: ["/api/fountains", "yerevan"],
    queryFn: fetchDrinkingFountains,
    retry: 2,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });

  const handleFindNearby = async () => {
    setIsGettingLocation(true);
    
    try {
      const position = await getCurrentPosition();
      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      
      setUserLocation(location);

      if (fountains.length > 0) {
        let nearestFountain: Fountain | null = null;
        let shortestDistance = Infinity;

        fountains.forEach((fountain) => {
          const distance = calculateDistance(
            location.lat,
            location.lng,
            fountain.lat,
            fountain.lon
          );

          if (distance < shortestDistance) {
            shortestDistance = distance;
            nearestFountain = fountain;
          }
        });

        if (nearestFountain) {
          toast({
            title: "Nearest fountain found!",
            description: `${Math.round(shortestDistance)}m away`,
          });
        }
      }
    } catch (error) {
      let message = "Unable to get your location";
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "Location access denied. Please enable location services.";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "Location information unavailable.";
            break;
          case error.TIMEOUT:
            message = "Location request timed out.";
            break;
        }
      }
      
      toast({
        variant: "destructive",
        title: "Location Error",
        description: message,
      });
    } finally {
      setIsGettingLocation(false);
    }
  };

  useEffect(() => {
    if (fountainsError) {
      toast({
        variant: "destructive",
        title: "Error loading fountains",
        description: "Failed to load drinking fountain data. Please try refreshing the page.",
      });
    }
  }, [fountainsError, toast]);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-[1000] bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-3 md:px-6">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-primary">Pulpuluck</div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleFindNearby}
              disabled={isGettingLocation || isFountainsLoading}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-4 py-2"
              data-testid="button-find-nearby"
            >
              {isGettingLocation ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Navigation className="h-4 w-4 mr-2" />
              )}
              <span className="font-medium">Find nearby</span>
            </Button>

            <Button
              onClick={() => setIsInfoModalOpen(true)}
              variant="secondary"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-full px-4 py-2"
              data-testid="button-what-is-it"
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              <span className="font-medium">What is it?</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Map Container */}
      <main className="flex-1 pt-16">
        {isFountainsLoading ? (
          <div className="h-full flex items-center justify-center bg-muted">
            <div className="flex items-center space-x-3">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="text-muted-foreground font-medium">Loading fountains...</span>
            </div>
          </div>
        ) : (
          <LeafletMap
            fountains={fountains}
            userLocation={userLocation}
            data-testid="map-container"
          />
        )}
      </main>

      {/* Info Modal */}
      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />
    </div>
  );
}
