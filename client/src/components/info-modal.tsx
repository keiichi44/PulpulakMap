import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InfoModal({ isOpen, onClose }: InfoModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
      style={{ zIndex: 1200 }}
      onClick={onClose}
    >
      <div 
        className="bg-background border rounded-lg shadow-lg max-w-md w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold">What is a Pulpulak?</h2>
          <button
            onClick={onClose}
            className="rounded-sm opacity-70 hover:opacity-100 transition-opacity"
            data-testid="button-close-modal-x"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-4 text-muted-foreground">
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
        
        {/* Footer */}
        <div className="p-6 pt-0">
          <Button
            onClick={onClose}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            data-testid="button-close-modal"
          >
            <Check className="h-4 w-4 mr-2" />
            Got it!
          </Button>
        </div>
      </div>
    </div>
  );
}
