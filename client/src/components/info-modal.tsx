import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import pulpulakImage from "@assets/Pulpulak_1758138201916.jpg";

import pplk_drop_201 from "@assets/pplk-drop 1.png";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InfoModal({ isOpen, onClose }: InfoModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!isOpen) return null;

  const nextSlide = () => {
    if (currentSlide < 2) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleClose = () => {
    setCurrentSlide(0);
    onClose();
  };

  const renderSlide = () => {
    switch (currentSlide) {
      case 0:
        return (
          <div className="flex flex-col md:flex-row items-start gap-6 p-6">
            {/* Image on the left */}
            <div className="w-full md:w-1/2 flex-shrink-0">
              <img 
                src={pulpulakImage} 
                alt="Pulpulak water fountain"
                className="w-full h-48 md:h-64 object-cover rounded-lg"
                data-testid="img-pulpulak"
              />
            </div>
            
            {/* Content on the right */}
            <div className="w-full md:w-1/2 space-y-4">
              <h2 className="text-xl font-bold text-gray-900" data-testid="text-slide1-header">
                Pulpulak brings you luck!
              </h2>
              
              <p className="text-sm text-gray-700 leading-relaxed" data-testid="text-slide1-content">
                Welcome to the interactive map of Pulpulaks across Yerevan! Pulpulak is a free drinking fountain and a beloved cultural icon of Armenia. 
                This service uses OpenStreetMap data to provide a comprehensive list of locations. However, it is still in preview mode, so feel free to <a href="mailto:keiichi44@gmail.com" className="text-blue-600 hover:text-blue-800 underline">email</a> me with any suggestions.
              </p>
            </div>
          </div>
        );
        
      case 1:
        return (
          <div className="p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4" data-testid="text-slide2-header">
              What is Pulpulak?
            </h2>
            
            <div className="space-y-4" data-testid="text-slide2-content">
              <p className="text-sm text-gray-700 leading-relaxed">
                A pulpulak is a public water fountain common in Armenia and in the former Armenian-populated Republic of Artsakh.
              </p>
              
              <p className="text-sm text-gray-700 leading-relaxed">
                Pulpulaks were, and still are, often used by people to arrange meetings and by couples as dating locations. Pulpulaks are small, usually one meter tall, stone memorials with running water, often fed by a mountain spring.
              </p>
              
              <p className="text-sm text-gray-700 leading-relaxed">
                Some pulpulaks are erected in memory of dead relatives. In drinking from a memorial pulpulak, passersby give their blessing to the person in memory of whom it is constructed.
              </p>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4" data-testid="text-slide3-header">FAQ</h2>
            <div className="max-h-80 overflow-y-auto space-y-4 pr-2" data-testid="text-slide3-content">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-2">
                    What does the name "Pulpulak" mean?
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    This name is onomatopoeic - it sounds like the water running from the tap. Try listening closely, and you'll notice it.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-2">
                    Is it safe to drink from pulpulaks?
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Well, it's generally safe. The water in Yerevan is clean and safe to drink. It comes from mountain springs, has few impurities, and is regularly tested.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-2">
                    Do animals drink from pulpulaks? Can I catch something?
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Yes, animals and birds can drink from pulpulaks. However, it is safe for humans because the water does not circulate but is constantly renewed. The only recommendation is not to touch the water tap.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-2">I have found a broken one. How should I report it?</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">As most pulpulaks are owned by the municipality, you can report a broken pulpulak using the Active Citizen app. They will repair it and provide you with a report.</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-2">
                    I have found a new pulpulak which is not on the map. How can I add it?
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Since we are using OpenStreetMap data, the only way right now is to sign up for OSM (<a href="https://www.openstreetmap.org/user/new" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">link</a>) and click the "Edit" button to access the visual map editor. You can add a pulpulak there (Public services - Drinking water), and it will be displayed here immediately.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
      style={{ zIndex: 1200 }}
      onClick={handleClose}
    >
      <div 
        className="bg-white border rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with logo and close button */}
        <div className="flex items-center justify-between p-4 border-b">
          {/* Logo and title */}
          <div className="flex items-center space-x-2">
            <img 
              src={pplk_drop_201} 
              alt="Fountain icon" 
              className="h-6 w-6"
              data-testid="img-logo"
            />
            <div className="text-lg font-bold">
              <span className="text-primary">Pulpu</span>
              <span className="text-purple-600">luck</span>
            </div>
          </div>
          
          {/* Close button */}
          <button
            onClick={handleClose}
            className="rounded-sm opacity-70 hover:opacity-100 transition-opacity p-1 hover:bg-gray-100"
            data-testid="button-close-modal-x"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Slide content */}
        <div className="min-h-[400px]">
          {renderSlide()}
        </div>
        
        {/* Navigation footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          {/* Slide indicators */}
          <div className="flex items-center space-x-2">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === currentSlide ? 'bg-blue-600 w-6' : 'bg-gray-300'
                }`}
                data-testid={`indicator-slide-${index}`}
              />
            ))}
          </div>
          
          {/* Navigation buttons */}
          <div className="flex items-center space-x-3">
            {currentSlide > 0 && (
              <Button
                onClick={prevSlide}
                variant="outline"
                size="sm"
                className="flex items-center"
                data-testid="button-prev"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            )}
            
            {currentSlide < 2 ? (
              <Button
                onClick={nextSlide}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                data-testid="button-next"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleClose}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
                data-testid="button-done"
              >
                Done
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
