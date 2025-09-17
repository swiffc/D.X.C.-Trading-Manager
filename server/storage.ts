import { 
  type User, 
  type InsertUser,
  type Trade,
  type InsertTrade,
  type Screenshot,
  type InsertScreenshot,
  type Asset,
  type InsertAsset,
  users,
  trades,
  screenshots,
  assets
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";
import { randomUUID } from "crypto";

// Trading screenshot manager storage interface
export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Trade methods
  createTrade(trade: InsertTrade): Promise<Trade>;
  getTrade(id: string): Promise<Trade | undefined>;
  getTradesByUser(userId: string): Promise<Trade[]>;
  updateTrade(id: string, updates: Partial<InsertTrade>): Promise<Trade | undefined>;
  deleteTrade(id: string): Promise<boolean>;
  
  // Screenshot methods
  createScreenshot(screenshot: InsertScreenshot): Promise<Screenshot>;
  getScreenshotsByTrade(tradeId: string): Promise<Screenshot[]>;
  updateScreenshot(id: string, updates: Partial<InsertScreenshot>): Promise<Screenshot | undefined>;
  deleteScreenshot(id: string): Promise<boolean>;
  
  // Convenience methods
  getTradeWithScreenshots(tradeId: string): Promise<(Trade & { screenshots: Screenshot[] }) | undefined>;

  // Asset methods (imported charts)
  createAsset(asset: InsertAsset): Promise<Asset>;
  listAssets(): Promise<Asset[]>;
  listChartAssets(): Promise<Asset[]>;
  updateAsset(id: string, updates: Partial<InsertAsset>): Promise<Asset | undefined>;
  deleteAsset(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  private inMemoryAssets: Asset[] = []

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Trade methods
  async createTrade(insertTrade: InsertTrade): Promise<Trade> {
    const [trade] = await db
      .insert(trades)
      .values({
        ...insertTrade,
        updatedAt: new Date(),
      })
      .returning();
    return trade;
  }

  async getTrade(id: string): Promise<Trade | undefined> {
    const [trade] = await db.select().from(trades).where(eq(trades.id, id));
    return trade || undefined;
  }

  async getTradesByUser(userId: string): Promise<Trade[]> {
    return await db
      .select()
      .from(trades)
      .where(eq(trades.userId, userId))
      .orderBy(desc(trades.createdAt));
  }

  async updateTrade(id: string, updates: Partial<InsertTrade>): Promise<Trade | undefined> {
    const [trade] = await db
      .update(trades)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(trades.id, id))
      .returning();
    return trade || undefined;
  }

  async deleteTrade(id: string): Promise<boolean> {
    // First delete associated screenshots
    await db.delete(screenshots).where(eq(screenshots.tradeId, id));
    
    // Then delete the trade
    const result = await db.delete(trades).where(eq(trades.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Screenshot methods
  async createScreenshot(insertScreenshot: InsertScreenshot): Promise<Screenshot> {
    const [screenshot] = await db
      .insert(screenshots)
      .values(insertScreenshot)
      .returning();
    return screenshot;
  }

  async getScreenshotsByTrade(tradeId: string): Promise<Screenshot[]> {
    return await db
      .select()
      .from(screenshots)
      .where(eq(screenshots.tradeId, tradeId))
      .orderBy(screenshots.orderIndex);
  }

  async updateScreenshot(id: string, updates: Partial<InsertScreenshot>): Promise<Screenshot | undefined> {
    const [screenshot] = await db
      .update(screenshots)
      .set(updates)
      .where(eq(screenshots.id, id))
      .returning();
    return screenshot || undefined;
  }

  async deleteScreenshot(id: string): Promise<boolean> {
    const result = await db.delete(screenshots).where(eq(screenshots.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Convenience methods
  async getTradeWithScreenshots(tradeId: string): Promise<(Trade & { screenshots: Screenshot[] }) | undefined> {
    const trade = await this.getTrade(tradeId);
    if (!trade) return undefined;
    
    const tradeScreenshots = await this.getScreenshotsByTrade(tradeId);
    
    return {
      ...trade,
      screenshots: tradeScreenshots,
    };
  }

  // Asset methods (imported charts)
  async createAsset(insertAsset: InsertAsset): Promise<Asset> {
    // Fallback to memory if db is unavailable
    if (!db) {
      const asset: Asset = {
        id: randomUUID(),
        createdAt: new Date(),
        ...insertAsset,
      } as unknown as Asset
      this.inMemoryAssets.push(asset)
      return asset
    }
    const [asset] = await db.insert(assets).values(insertAsset).returning();
    return asset
  }

  async listAssets(): Promise<Asset[]> {
    if (!db) {
      return this.inMemoryAssets.sort((a, b) =>
        new Date(a.createdAt as unknown as string).getTime() - new Date(b.createdAt as unknown as string).getTime()
      )
    }
    return await db.select().from(assets).orderBy(assets.createdAt);
  }

  async listChartAssets(): Promise<Asset[]> {
    if (!db) {
      return this.inMemoryAssets.filter(a => a.isChart).sort((a, b) =>
        new Date(a.createdAt as unknown as string).getTime() - new Date(b.createdAt as unknown as string).getTime()
      )
    }
    // @ts-expect-error drizzle boolean filter typing quirk
    return await db.select().from(assets).where(assets.isChart.eq(true)).orderBy(assets.createdAt);
  }

  async updateAsset(id: string, updates: Partial<InsertAsset>): Promise<Asset | undefined> {
    if (!db) {
      const idx = this.inMemoryAssets.findIndex(a => a.id === id)
      if (idx === -1) return undefined
      this.inMemoryAssets[idx] = { ...this.inMemoryAssets[idx], ...updates } as Asset
      return this.inMemoryAssets[idx]
    }
    const [asset] = await db.update(assets).set(updates).where(eq(assets.id, id)).returning();
    return asset || undefined
  }

  async deleteAsset(id: string): Promise<boolean> {
    if (!db) {
      const before = this.inMemoryAssets.length
      this.inMemoryAssets = this.inMemoryAssets.filter(a => a.id !== id)
      return this.inMemoryAssets.length < before
    }
    const result = await db.delete(assets).where(eq(assets.id, id))
    return result.rowCount ? result.rowCount > 0 : false
  }
}

export const storage = new DatabaseStorage();
