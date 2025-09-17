import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import express from "express";
import multer from "multer";
import path from "path";
import { storage } from "./storage";
import { insertTradeSchema, insertScreenshotSchema } from "@shared/schema";
import { z } from "zod";

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: './uploads/screenshots/',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'))
    }
  }
})

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all trades for a user
  app.get('/api/trades', async (req: Request, res: Response) => {
    try {
      const userId = 'user-1' // TODO: Get from auth context
      const trades = await storage.getTradesByUser(userId)
      
      // Get screenshots for each trade
      const tradesWithScreenshots = await Promise.all(
        trades.map(async (trade) => {
          const screenshots = await storage.getScreenshotsByTrade(trade.id)
          return {
            ...trade,
            screenshots: screenshots.map(s => ({
              id: s.id,
              url: `/uploads/screenshots/${path.basename(s.url)}`,
              timeframe: s.timeframe,
              name: s.originalName
            }))
          }
        })
      )
      
      res.json(tradesWithScreenshots)
    } catch (error) {
      console.error('Error fetching trades:', error)
      res.status(500).json({ error: 'Failed to fetch trades' })
    }
  })

  // Create a new trade
  app.post('/api/trades', async (req: Request, res: Response) => {
    try {
      const validatedData = insertTradeSchema.parse(req.body)
      
      const trade = await storage.createTrade({
        ...validatedData,
        userId: 'user-1' // TODO: Get from auth context
      })
      
      res.status(201).json(trade)
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Validation error', details: error.errors })
      } else {
        console.error('Error creating trade:', error)
        res.status(500).json({ error: 'Failed to create trade' })
      }
    }
  })

  // Get a specific trade with screenshots
  app.get('/api/trades/:id', async (req: Request, res: Response) => {
    try {
      const trade = await storage.getTradeWithScreenshots(req.params.id)
      
      if (!trade) {
        return res.status(404).json({ error: 'Trade not found' })
      }
      
      // Format screenshot URLs
      const formattedTrade = {
        ...trade,
        screenshots: trade.screenshots.map(s => ({
          ...s,
          url: `/uploads/screenshots/${path.basename(s.url)}`
        }))
      }
      
      res.json(formattedTrade)
    } catch (error) {
      console.error('Error fetching trade:', error)
      res.status(500).json({ error: 'Failed to fetch trade' })
    }
  })

  // Update a trade
  app.put('/api/trades/:id', async (req: Request, res: Response) => {
    try {
      const validatedData = insertTradeSchema.partial().parse(req.body)
      
      const trade = await storage.updateTrade(req.params.id, validatedData)
      
      if (!trade) {
        return res.status(404).json({ error: 'Trade not found' })
      }
      
      res.json(trade)
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Validation error', details: error.errors })
      } else {
        console.error('Error updating trade:', error)
        res.status(500).json({ error: 'Failed to update trade' })
      }
    }
  })

  // Delete a trade
  app.delete('/api/trades/:id', async (req: Request, res: Response) => {
    try {
      const success = await storage.deleteTrade(req.params.id)
      
      if (!success) {
        return res.status(404).json({ error: 'Trade not found' })
      }
      
      res.status(204).send()
    } catch (error) {
      console.error('Error deleting trade:', error)
      res.status(500).json({ error: 'Failed to delete trade' })
    }
  })

  // Upload screenshots for a trade
  app.post('/api/trades/:id/screenshots', upload.array('files', 8), async (req: Request, res: Response) => {
    try {
      const tradeId = req.params.id
      const files = req.files as Express.Multer.File[]
      
      if (!files || files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' })
      }
      
      // Verify trade exists
      const trade = await storage.getTrade(tradeId)
      if (!trade) {
        return res.status(404).json({ error: 'Trade not found' })
      }
      
      const screenshots = []
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const name = req.body[`names[${i}]`] || file.originalname
        const timeframe = req.body[`timeframes[${i}]`] || 'H1'
        const orderIndex = parseInt(req.body[`orders[${i}]`] || i.toString())
        
        const screenshot = await storage.createScreenshot({
          tradeId,
          fileName: file.filename,
          originalName: name,
          url: file.path,
          timeframe,
          orderIndex
        })
        
        screenshots.push({
          ...screenshot,
          url: `/uploads/screenshots/${file.filename}`
        })
      }
      
      res.status(201).json(screenshots)
    } catch (error) {
      console.error('Error uploading screenshots:', error)
      res.status(500).json({ error: 'Failed to upload screenshots' })
    }
  })

  // Serve uploaded files
  app.use('/uploads', (req, res, next) => {
    // Set proper headers for images
    res.set('Cache-Control', 'public, max-age=86400') // 24 hours
    next()
  })
  app.use('/uploads', express.static('uploads'))

  // Placeholder endpoint for development
  app.get('/api/placeholder/:filename', (req: Request, res: Response) => {
    // For development - return a simple placeholder image response
    res.status(200).json({ message: `Placeholder for ${req.params.filename}` })
  })

  const httpServer = createServer(app);
  return httpServer;
}
