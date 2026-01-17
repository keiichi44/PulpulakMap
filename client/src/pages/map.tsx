import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Navigation, HelpCircle, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import LeafletMap from "@/components/map/leaflet-map";
import InfoModal from "@/components/info-modal";
import { fetchDrinkingFountains } from "@/services/overpass-api";
import { fetchWalkingRoute, type Route } from "@/services/routing-api";
import { getCurrentPosition } from "@/utils/geolocation";
import { calculateDistance } from "@/utils/distance";

import pplk from "@assets/pplk.png";

import pplk_drop_1 from "@assets/pplk-drop 1.png";

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
  const [isCounterModalOpen, setIsCounterModalOpen] = useState(false);
  const [walkingRoute, setWalkingRoute] = useState<Route | null>(null);
  const [nearestFountain, setNearestFountain] = useState<Fountain | null>(null);
  const { toast } = useToast();

  // Check if this is the first visit and auto-open modal for new users
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('pulpuluck-hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setIsInfoModalOpen(true);
    }
  }, []);

  // Handle modal close and mark onboarding as seen
  const handleInfoModalClose = () => {
    localStorage.setItem('pulpuluck-hasSeenOnboarding', 'true');
    setIsInfoModalOpen(false);
  };

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
    // Clear previous route and nearest fountain
    setWalkingRoute(null);
    setNearestFountain(null);
    
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
          setNearestFountain(nearestFountain);
          
          // Fetch walking route to the nearest fountain  
          const foundFountain = nearestFountain as Fountain;
          const route = await fetchWalkingRoute(
            { lat: location.lat, lng: location.lng },
            { lat: foundFountain.lat, lng: foundFountain.lon }
          );
          
          if (route) {
            setWalkingRoute(route);
            const walkingTime = Math.round(route.duration / 60);
            toast({
              title: "Route found!",
              description: `${Math.round(route.distance)}m away • ${walkingTime} min walk`,
            });
          } else {
            toast({
              title: "Nearest fountain found!",
              description: `${Math.round(shortestDistance)}m away`,
            });
          }
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
            <img 
              src={pplk_drop_1} 
              alt="Fountain icon" 
              className="h-8 w-8"
            />
            <div className="text-2xl font-bold">
              <span className="text-primary">Pulpu</span>
              <span className="text-purple-600">luck</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
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
      <main className="flex-1 pt-16 relative">
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
            walkingRoute={walkingRoute}
            nearestFountain={nearestFountain}
            data-testid="map-container"
          />
        )}
        
        {/* Fountain Counter */}
        <button 
          onClick={() => setIsCounterModalOpen(true)}
          className="absolute top-20 right-4 z-[999] bg-white rounded-full px-4 py-2 flex items-center space-x-2 cursor-pointer hover:bg-gray-50 transition-colors"
          style={{ 
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3), 0 6px 10px rgba(0, 0, 0, 0.15)'
          }}
        >
          <span className="text-lg">💧</span>
          <span className="font-bold text-black">{fountains.length.toLocaleString()}</span>
        </button>
        
        {/* Floating Find Nearby Button */}
        <div className="absolute bottom-20 md:bottom-8 left-1/2 transform -translate-x-1/2 z-[999]">
          <Button
            onClick={handleFindNearby}
            disabled={isGettingLocation || isFountainsLoading}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 py-3 shadow-2xl hover:shadow-3xl transition-all duration-200 font-semibold text-base mb-6 md:mb-8"
            style={{ 
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3), 0 6px 10px rgba(0, 0, 0, 0.15)'
            }}
            data-testid="button-find-nearby"
          >
            {isGettingLocation ? (
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            ) : (
              <Navigation className="h-5 w-5 mr-2" />
            )}
            <span className="font-bold">Find nearby</span>
          </Button>
        </div>
      </main>
      {/* Info Modal */}
      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={handleInfoModalClose}
      />
      
      {/* Counter Modal */}
      {isCounterModalOpen && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
          style={{ zIndex: 1200 }}
          onClick={() => setIsCounterModalOpen(false)}
        >
          <div 
            className="bg-white border rounded-lg shadow-lg max-w-2xl w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with logo and close button */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-2">
                <img 
                  src={pplk_drop_1} 
                  alt="Fountain icon" 
                  className="h-6 w-6"
                />
                <div className="text-lg font-bold">
                  <span className="text-primary">Pulpu</span>
                  <span className="text-purple-600">luck</span>
                </div>
              </div>
              <button
                onClick={() => setIsCounterModalOpen(false)}
                className="rounded-sm opacity-70 hover:opacity-100 transition-opacity p-1 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-8 text-center">
              <div className="text-6xl font-bold text-black mb-4">
                {fountains.length.toLocaleString()}
              </div>
              <p className="text-gray-700">
                The number of pulpulacks within Yerevan municipality.
              </p>
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t bg-gray-50 flex justify-center">
              <Button
                onClick={() => setIsCounterModalOpen(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
