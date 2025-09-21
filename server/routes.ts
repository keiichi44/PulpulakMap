import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { feedbackStorage, type FeedbackType } from "./feedback-storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // Feedback routes for fountain voting system
  app.get('/api/feedback/:fountainId', async (req, res) => {
    try {
      const { fountainId } = req.params;
      const feedback = await feedbackStorage.getFeedback(fountainId);
      res.json(feedback);
    } catch (error) {
      console.error('Error getting feedback:', error);
      res.status(500).json({ error: 'Failed to get feedback' });
    }
  });

  app.post('/api/feedback/:fountainId/vote', async (req, res) => {
    try {
      const { fountainId } = req.params;
      const { voteType } = req.body;
      
      if (!['running', 'outOfService', 'abandoned'].includes(voteType)) {
        return res.status(400).json({ error: 'Invalid vote type' });
      }
      
      const feedback = await feedbackStorage.addVote(fountainId, voteType as FeedbackType);
      res.json(feedback);
    } catch (error) {
      console.error('Error submitting vote:', error);
      res.status(500).json({ error: 'Failed to submit vote' });
    }
  });

  app.get('/api/feedback', async (req, res) => {
    try {
      const allFeedback = await feedbackStorage.getAllFeedback();
      res.json(allFeedback);
    } catch (error) {
      console.error('Error getting all feedback:', error);
      res.status(500).json({ error: 'Failed to get feedback data' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
