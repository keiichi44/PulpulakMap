export interface FountainFeedback {
  fountainId: string;
  running: number;
  outOfService: number;
  abandoned: number;
}

export type FeedbackType = 'running' | 'outOfService' | 'abandoned';