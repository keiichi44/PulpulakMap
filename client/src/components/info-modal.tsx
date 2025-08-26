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
          <DialogTitle>What is a Pulpulak?</DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-4 text-muted-foreground">
              <p className="text-sm leading-relaxed">
                A pulpulak (Armenian: պուլպուլակ, Armenian pronunciation: [pulpuˈlɑk]) is a public water fountain common in Armenia and in the former Armenian-populated Republic of Artsakh. Pulpulaks are a significant part of Armenian culture, and first appeared on the streets of Yerevan in the 1920s before becoming extremely popular.
              </p>
              
              <p className="text-sm leading-relaxed">
                Pulpulaks were, and still are, often used by people to arrange meetings and by couples as dating locations. Pulpulaks are small, usually one meter tall, stone memorials with running water, often fed by a mountain spring.
              </p>
              
              <p className="text-sm leading-relaxed">
                Some pulpulaks are erected in memory of dead relatives. In drinking from a memorial pulpulak, passersby give their blessing to the person in memory of whom it is constructed.
              </p>
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
