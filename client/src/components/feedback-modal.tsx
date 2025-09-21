import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  fountainId: string;
  fountainName: string;
}

export default function FeedbackModal({ isOpen, onClose, fountainId, fountainName }: FeedbackModalProps) {
  const [selectedVote, setSelectedVote] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const voteMutation = useMutation({
    mutationFn: async (voteType: string) => {
      return apiRequest('POST', `/api/feedback/${fountainId}/vote`, { voteType });
    },
    onSuccess: () => {
      // Invalidate and refetch feedback data
      queryClient.invalidateQueries({ queryKey: [`/api/feedback/${fountainId}`] });
      toast({
        title: "Thank you!",
        description: "Your feedback has been submitted successfully.",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit your feedback. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (selectedVote) {
      voteMutation.mutate(selectedVote);
    }
  };

  const voteOptions = [
    {
      id: 'running',
      label: 'It\'s running',
      emoji: '✅',
      description: 'Water is flowing normally',
      color: 'text-green-600 hover:bg-green-50 border-green-200'
    },
    {
      id: 'outOfService',
      label: 'Out of service',
      emoji: '❌',
      description: 'No water or broken',
      color: 'text-red-600 hover:bg-red-50 border-red-200'
    },
    {
      id: 'abandoned',
      label: 'Abandoned',
      emoji: '❓',
      description: 'Unclear status or missing',
      color: 'text-yellow-600 hover:bg-yellow-50 border-yellow-200'
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Report Fountain Status
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            How is <span className="font-medium">{fountainName}</span> working?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {voteOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelectedVote(option.id)}
              className={`w-full p-4 border-2 rounded-lg transition-all duration-200 text-left ${
                selectedVote === option.id 
                  ? `border-primary bg-primary/5 ${option.color.split(' ')[0]}` 
                  : `border-gray-200 hover:border-gray-300 ${option.color}`
              }`}
              data-testid={`button-vote-${option.id}`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{option.emoji}</span>
                <div>
                  <div className="font-medium text-sm">{option.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{option.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="flex space-x-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            data-testid="button-cancel-feedback"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedVote || voteMutation.isPending}
            className="flex-1"
            data-testid="button-submit-feedback"
          >
            {voteMutation.isPending ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}