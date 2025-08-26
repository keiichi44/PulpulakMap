import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InfoModal({ isOpen, onClose }: InfoModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-4">
        <DialogHeader>
          <DialogTitle>What is Pulpuluck?</DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-4 text-muted-foreground">
              <img
                src="https://images.unsplash.com/photo-1544531585-bb3131d3eb4d?w=400&h=200&fit=crop&auto=format"
                alt="Public drinking fountain"
                className="rounded-lg w-full h-32 object-cover"
              />
              
              <p className="text-sm">
                Pulpuluck helps you find clean, accessible drinking water fountains throughout Yerevan. 
                Stay hydrated while exploring the city!
              </p>
              
              <div className="space-y-2">
                <h3 className="font-medium text-foreground text-sm">Features:</h3>
                <ul className="space-y-1 text-xs">
                  <li>• Real-time fountain locations</li>
                  <li>• Distance to nearest fountain</li>
                  <li>• Accessibility information</li>
                  <li>• Community updates</li>
                </ul>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-6 pt-4 border-t border-border">
          <Button
            onClick={onClose}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            data-testid="button-close-modal"
          >
            <Check className="h-4 w-4 mr-2" />
            Got it!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
