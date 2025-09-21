import { promises as fs } from 'fs';
import path from 'path';

export interface FountainFeedback {
  fountainId: string;
  running: number;
  outOfService: number;
  abandoned: number;
}

export type FeedbackType = 'running' | 'outOfService' | 'abandoned';

class FeedbackStorage {
  private feedbackFile = path.join(process.cwd(), 'fountain-feedback.json');
  private cache: Map<string, FountainFeedback> = new Map();
  private initialized = false;

  private async ensureInitialized() {
    if (this.initialized) return;
    
    try {
      const data = await fs.readFile(this.feedbackFile, 'utf-8');
      const feedbackData: FountainFeedback[] = JSON.parse(data);
      
      for (const feedback of feedbackData) {
        this.cache.set(feedback.fountainId, feedback);
      }
    } catch (error) {
      // File doesn't exist or is corrupted, start with empty cache
      console.log('Starting with empty feedback data');
    }
    
    this.initialized = true;
  }

  private async saveToFile() {
    const feedbackArray = Array.from(this.cache.values());
    await fs.writeFile(this.feedbackFile, JSON.stringify(feedbackArray, null, 2));
  }

  async getFeedback(fountainId: string): Promise<FountainFeedback> {
    await this.ensureInitialized();
    
    const existing = this.cache.get(fountainId);
    if (existing) {
      return existing;
    }
    
    // Return default counts for new fountains
    const defaultFeedback: FountainFeedback = {
      fountainId,
      running: 0,
      outOfService: 0,
      abandoned: 0
    };
    
    this.cache.set(fountainId, defaultFeedback);
    await this.saveToFile();
    
    return defaultFeedback;
  }

  async addVote(fountainId: string, voteType: FeedbackType): Promise<FountainFeedback> {
    await this.ensureInitialized();
    
    const feedback = await this.getFeedback(fountainId);
    feedback[voteType]++;
    
    this.cache.set(fountainId, feedback);
    await this.saveToFile();
    
    return feedback;
  }

  async getAllFeedback(): Promise<FountainFeedback[]> {
    await this.ensureInitialized();
    return Array.from(this.cache.values());
  }
}

export const feedbackStorage = new FeedbackStorage();