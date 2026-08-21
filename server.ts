import './instrument';
import DOMPurify from 'isomorphic-dompurify';
import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import jwt from 'jsonwebtoken';
import { GoogleGenAI, Type } from '@google/genai';
import { initialGlobalConfig, initialPlatforms, initialCustomPages } from './src/data';
import { GamingPlatform, GlobalConfig, AnalyticsStats, TrackLog, SubPartnerApplication } from './src/types';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import mysql from "mysql2/promise";

import fs from 'fs';
import { exec } from 'child_process';
import * as Sentry from '@sentry/node';
import winston from 'winston';
import sharp from 'sharp';

// Configure Winston Logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console()
  ]
});

// Sentry is initialized in instrument.ts


async function generateWithRetry(ai: GoogleGenAI, params: any, retries: number = 3): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      return await ai.models.generateContent(params);
    } catch (e: any) {
      if ((e.status === 503 || e.status === 429) && i < retries - 1) {
        logger.warn(`AI API ${e.status} error, retrying in ${2 * (i + 1)}s...`);
        await new Promise(r => setTimeout(r, 2000 * (i + 1)));
      } else {
        throw e;
      }
    }
  }
}

const app = express();

// Trust reverse proxy (Cloud Run, load balancer) for rate limiting and X-Forwarded-For
app.set("trust proxy", 1);

// Sentry Express handler moved to the end of routes

app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  }
}));
app.disable('x-powered-by');
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'affiliate_default_secure_jwt_secret_2026_key';
const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || 'admin123456';

if (!process.env.JWT_SECRET || !process.env.ADMIN_PASSCODE) {
  logger.warn("WARNING: JWT_SECRET or ADMIN_PASSCODE environment variables not provided. Using secure default fallbacks.");
}

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(generalLimiter);




// In-Memory Database State
let statePlatforms: GamingPlatform[] = [...initialPlatforms];
let stateConfig: GlobalConfig = { ...initialGlobalConfig };
let stateSubPartners: SubPartnerApplication[] = [];
let stateCustomPages: any[] = [];
let stateStats: AnalyticsStats = { totalVisits: 0, totalClicks: 0, totalPromoCopies: 0, totalSubPartnerApps: 0, platformStats: {} };
let stateTrackLogs: TrackLog[] = [];

// 1. FLAT FILE JSON STORAGE (Persistent local JSON DB)
let DATA_FILE = path.join(process.cwd(), 'app_data.json');

let mysqlPool: any = null;
let mysqlConnectionFailed = false;

async function getMysqlPool() {
  if (mysqlPool) return mysqlPool;
  if (mysqlConnectionFailed) return null;
  if (!process.env.DB_HOST || !process.env.DB_USER) return null;
  
  try {
    const tempPool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'u123456789_gamingdb',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    
    await tempPool.query(`
      CREATE TABLE IF NOT EXISTS mysql_state_store (
        id INT NOT NULL DEFAULT 1,
        state_json LONGTEXT NOT NULL,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    
    mysqlPool = tempPool;
    return mysqlPool;
  } catch (err: any) {
    mysqlConnectionFailed = true;
    logger.warn('MySQL connection failed, falling back to JSON local storage only. Error: ' + err.message);
    return null;
  }
}

async function readDataFile() {
  const db: any = { platforms: {}, settings: { globalConfig: {} }, custom_pages: {}, sub_partners: {} };
  
  try {
    const pool = await getMysqlPool();
    if (!pool) throw new Error("No MySQL Pool");

    // Retrieve entire state from the monolithic JSON store
    const [jsonRows] = await pool.query('SELECT state_json FROM mysql_state_store WHERE id = 1');
    if (jsonRows && jsonRows.length > 0) {
      const fullJson = JSON.parse(jsonRows[0].state_json);
      
      if (fullJson.settings) db.settings = fullJson.settings;
      if (fullJson.platforms) db.platforms = fullJson.platforms;
      if (fullJson.custom_pages) db.custom_pages = fullJson.custom_pages;
      if (fullJson.sub_partners) db.sub_partners = fullJson.sub_partners;
    } else {
      throw new Error("No state_json found in mysql_state_store");
    }
  } catch(e) {
    // Fallback to local flat file if MySQL fails or is empty
    try {
      let fileToRead = DATA_FILE;
      if (!fs.existsSync(fileToRead) && fs.existsSync('/tmp/app_data.json')) {
        fileToRead = '/tmp/app_data.json';
      }
      if (fs.existsSync(fileToRead)) {
        const fileContent = fs.readFileSync(fileToRead, 'utf-8');
        const parsed = JSON.parse(fileContent);
        if (parsed.platforms) db.platforms = parsed.platforms;
        if (parsed.settings) db.settings = parsed.settings;
        if (parsed.custom_pages) db.custom_pages = parsed.custom_pages;
        if (parsed.sub_partners) db.sub_partners = parsed.sub_partners;
        logger.info('Loaded data from ' + DATA_FILE);
      }
    } catch(fsErr) {
      logger.error('Error reading local data file', fsErr);
    }
  }

  // Seed Initial Data if Tables/JSON are Empty
  if (Object.keys(db.platforms).length === 0) { 
     db.platforms = {};
     for (const p of initialPlatforms) db.platforms[p.id] = p;
     db.settings.globalConfig = initialGlobalConfig;
     for (const c of initialCustomPages) db.custom_pages[c.slug] = c;
     await writeDataFile(db); // Push to DB
  }

  return db;
}

async function writeDataFile(data: any) {
  try {
    await fs.promises.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    try {
      DATA_FILE = '/tmp/app_data.json';
      await fs.promises.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
    } catch (err2) {
      logger.error('Error writing data file', err2);
    }
  }

  // 2. Persist to MySQL Database if available (Lifetime storage for Hostinger/Cloud)
  try {
    const pool = await getMysqlPool();
    if (pool) {
      const stateString = JSON.stringify(data);
      await pool.query(
        'INSERT INTO mysql_state_store (id, state_json) VALUES (1, ?) ON DUPLICATE KEY UPDATE state_json = ?',
        [stateString, stateString]
      );
      logger.info('Successfully persisted state to MySQL database.');
    }
  } catch (mysqlErr) {
    logger.error('Error persisting state to MySQL:', mysqlErr);
  }
}

async function setDoc(collection: string, docId: string, data: any) {
  const db = await readDataFile();
  if (!db[collection]) db[collection] = {};
  db[collection][docId] = data;
  await writeDataFile(db);
}

async function getCollection(collection: string) {
  const db = await readDataFile();
  if (!db[collection]) return [];
  return Object.values(db[collection]);
}

async function getDoc(collection: string, docId: string) {
  const db = await readDataFile();
  if (!db[collection]) return null;
  return db[collection][docId] || null;
}

async function updateDoc(collection: string, docId: string, updates: any) {
  const existing = await getDoc(collection, docId);
  if (existing) {
    await setDoc(collection, docId, { ...existing, ...updates });
  }
}

async function saveState() {
  try {
    const db = await readDataFile();
    
    // 1. Sync Platforms
    if (Array.isArray(statePlatforms)) {
      db.platforms = {};
      for (const p of statePlatforms) {
        db.platforms[p.id] = p;
      }
    }

    // 2. Sync Config
    if (stateConfig) {
      db.settings = db.settings || {};
      db.settings['globalConfig'] = stateConfig;
    }

    // 3. Sync Custom Pages
    if (Array.isArray(stateCustomPages)) {
      db.custom_pages = {};
      for (const cp of stateCustomPages) {
        db.custom_pages[cp.slug] = cp;
      }
    }

    // 4. Sync Sub Partners
    if (Array.isArray(stateSubPartners)) {
      db.sub_partners = {};
      for (const sp of stateSubPartners) {
        db.sub_partners[sp.id] = sp;
      }
    }

    await writeDataFile(db);
    logger.info("Successfully synced all in-memory state to JSON database.");
  } catch (e) {
    logger.error("saveState error:", e);
  }
}

async function loadState() {
  try {
    // 1. Load or Seed Platforms
    const pSnap = await getCollection('platforms');
    if (pSnap.length > 0) {
      statePlatforms = pSnap as GamingPlatform[];
    } else {
      logger.info("Database empty: Seeding initial platforms...");
      for (const p of initialPlatforms) {
        await setDoc('platforms', p.id, p);
      }
      statePlatforms = [...initialPlatforms];
    }

    // 2. Load or Seed Config
    const cSnap = await getDoc('settings', 'globalConfig');
    if (cSnap) {
      stateConfig = cSnap as GlobalConfig;
    } else {
      logger.info("Database empty: Seeding initial global config...");
      await setDoc('settings', 'globalConfig', initialGlobalConfig);
      stateConfig = { ...initialGlobalConfig };
    }

    // 3. Load Sub Partners & Pages
    const spSnap = await getCollection('sub_partners');
    if (spSnap.length > 0) stateSubPartners = spSnap as SubPartnerApplication[];

        const cpSnap = await getCollection('custom_pages');
    stateCustomPages = cpSnap as any[];
    
    // Seed missing default pages
    for (const initCp of initialCustomPages) {
      if (!stateCustomPages.find(cp => cp.slug === initCp.slug)) {
        logger.info(`Database missing custom page ${initCp.slug}: Seeding...`);
        await setDoc('custom_pages', initCp.slug, initCp);
        stateCustomPages.push(initCp);
      }
    }

    logger.info("Loaded state from MySQL Collections.");
  } catch (e) {
    logger.error("Load state error:", e);
  }
}

// Ensure state is loaded asynchronously during boot
loadState();

// --- IMAGE OPTIMIZATION CDN ROUTE ---
app.get('/api/cdn/images/:platformId.webp', async (req, res) => {
  const platform = statePlatforms.find(p => p.id === req.params.platformId);
  if (!platform || !platform.logoUrl) {
    return res.status(404).json({ error: 'Image not found' });
  }

  try {
    let buffer;
    if (platform.logoUrl.startsWith('data:image/')) {
      const base64Data = platform.logoUrl.split(',')[1];
      buffer = Buffer.from(base64Data, 'base64');
    } else {
      const response = await fetch(platform.logoUrl);
      if (!response.ok) throw new Error('Failed to fetch external image');
      const arrayBuffer = await response.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    }
    
    const webpBuffer = await sharp(buffer)
      .resize({ width: 128, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
      
    res.setHeader('Content-Type', 'image/webp');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(webpBuffer);
  } catch (e) {
    logger.error("Image optimization error:", e);
    // Fallback to original
    res.redirect(platform.logoUrl);
  }
});

// --- SENTRY WEBHOOK TO GEMINI AI ---
app.post('/api/sentry-webhook', async (req, res) => {
  try {
    // Sentry sends a ping request to verify the webhook URL
    if (req.header('Sentry-Hook-Resource') === 'installation' || req.body?.action === 'ping' || !req.body?.data?.event) {
      return res.status(200).send('ok');
    }

    const event = req.body.data.event;
    const errorTitle = event.title || 'Unknown Error';
    const exception = event.exception?.values?.[0] || {};
    const stacktrace = exception.stacktrace?.frames || [];
    const tags = event.tags || [];

    logger.info(`Received Sentry webhook for error: ${errorTitle}`);

    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = new GoogleGenAI({ 
          apiKey: process.env.GEMINI_API_KEY,
          httpOptions: {
            headers: { 'User-Agent': 'aistudio-build' }
          }
        });
        
        const systemPrompt = `You are an expert software engineer analyzing a Sentry error report.
Determine the root cause, suggest a code fix (diff/patch), and categorize the severity (Critical, Warning, Info).
Error Title: ${errorTitle}
Exception Type: ${exception.type || 'N/A'}
Exception Value: ${exception.value || 'N/A'}
Stack Trace: ${JSON.stringify(stacktrace.slice(-5))}
Tags: ${JSON.stringify(tags)}

Format your response exactly as JSON:
{
  "severity": "Critical|Warning|Info",
  "rootCause": "Short explanation",
  "suggestedFix": "Code patch or action"
}`;

        const response = await generateWithRetry(ai, {
          model: 'gemini-3.7-flash',
          contents: systemPrompt,
          config: {
            responseMimeType: 'application/json',
          }
        });

        const result = response.text;
        if (result) {
          logger.info(`Sentry Error Analysis for [${errorTitle}]:`, JSON.parse(result));
        }
      } catch (aiError) {
        logger.error('Error analyzing Sentry event with Gemini:', aiError);
      }
    } else {
      logger.warn('GEMINI_API_KEY not configured. Skipping AI analysis for Sentry error.');
    }

    res.status(200).send('ok');
  } catch (error) {
    logger.error('Error processing Sentry webhook:', error);
    // Always return 200 to prevent Sentry from retrying endlessly or disabling the webhook
    res.status(200).send('ok');
  }
});

// Helper to detect country from IP / headers
function getGeoFromRequest(req: Request) {
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.socket.remoteAddress || '127.0.0.1';
  const countryHeader = (req.headers['cf-ipcountry'] as string) || (req.headers['x-appengine-country'] as string);

  if (countryHeader && countryHeader !== 'XX') {
    return {
      country: countryHeader === 'IN' ? 'India' : countryHeader === 'US' ? 'United States' : countryHeader === 'BR' ? 'Brazil' : countryHeader,
      countryCode: countryHeader,
      city: 'Detected City',
      ip,
      flag: countryHeader === 'IN' ? '🇮🇳' : countryHeader === 'US' ? '🇺🇸' : countryHeader === 'BR' ? '🇧🇷' : '🌐'
    };
  }

  // Fallback defaults
  return {
    country: 'United States',
    countryCode: 'US',
    city: 'Global Region',
    ip: ip === '::1' ? '127.0.0.1' : ip,
    flag: '🇺🇸'
  };
}

// Bot Detection Regex for Cloaking
const BOT_USER_AGENTS = /googlebot|bingbot|yandex|baiduspider|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest\/0\.|pinterestbot|slackbot|vkShare|W3C_Validator|AdsBot-Google|Mediapartners-Google|Lighthouse/i;

// Auth Middleware
function verifyJwtToken(req: Request, res: Response, next: Function) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split(' ')[1];
  const data = { statePlatforms, stateConfig, stateSubPartners };
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Brute-force Login Protection & Rate-Limiting Tracker
const loginAttemptTracker: Record<string, { attempts: number[]; lockUntil: number }> = {};

// Rate Limiting Middleware for Admin Login
const adminLoginRateLimiter = (req: Request, res: Response, next: Function) => {
  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.socket.remoteAddress || '127.0.0.1';
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minute sliding window
  const maxAttempts = 5; // Max 5 login attempts per 15 mins

  if (!loginAttemptTracker[clientIp]) {
    loginAttemptTracker[clientIp] = { attempts: [], lockUntil: 0 };
  }

  const record = loginAttemptTracker[clientIp];

  // Check active lockout
  if (record.lockUntil > now) {
    const remainingSeconds = Math.ceil((record.lockUntil - now) / 1000);
    res.setHeader('Retry-After', remainingSeconds);
    res.setHeader('X-RateLimit-Limit', maxAttempts);
    res.setHeader('X-RateLimit-Remaining', 0);
    return res.status(429).json({
      success: false,
      message: `🔒 BRUTE-FORCE LOCKOUT: Too many failed admin login attempts from IP ${clientIp}. Access blocked for ${remainingSeconds} seconds.`
    });
  }

  // Filter attempts within the sliding window
  record.attempts = record.attempts.filter(timestamp => now - timestamp < windowMs);

  if (record.attempts.length >= maxAttempts) {
    record.lockUntil = now + 15 * 60 * 1000; // 15 minute lock
    res.setHeader('Retry-After', 900);
    return res.status(429).json({
      success: false,
      message: `🔒 RATE LIMIT EXCEEDED: 5 failed attempts reached from IP ${clientIp}. Blocked for 15 minutes.`
    });
  }

  res.setHeader('X-RateLimit-Limit', maxAttempts);
  res.setHeader('X-RateLimit-Remaining', maxAttempts - record.attempts.length);
  next();
};

// Login Handler Function
const handleAdminLogin = (req: Request, res: Response) => {
  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.socket.remoteAddress || '127.0.0.1';
  const record = loginAttemptTracker[clientIp] || { attempts: [], lockUntil: 0 };
  const { password } = req.body;

  if (password === ADMIN_PASSCODE) {
    // Successful login -> Reset rate limiter record
    loginAttemptTracker[clientIp] = { attempts: [], lockUntil: 0 };
    const token = jwt.sign({ role: 'admin', authAt: Date.now() }, JWT_SECRET, { expiresIn: '8h' });
    return res.json({ success: true, token });
  } else {
    record.attempts.push(Date.now());
    if (record.attempts.length >= 5) {
      record.lockUntil = Date.now() + 15 * 60 * 1000;
    }
    loginAttemptTracker[clientIp] = record;

    // Introduce security delay to thwart dictionary timing attacks
    setTimeout(() => {
      const remaining = 5 - record.attempts.length;
      return res.status(401).json({
        success: false,
        message: record.attempts.length >= 5
          ? '🔒 Account locked for 15 minutes due to 5 failed password attempts.'
          : `Invalid passcode! Security Warning: ${remaining} attempt(s) remaining before IP lockout.`
      });
    }, 500);
  }
};

// API: Login Endpoints (supports both /api/auth/login and /api/admin/login)
app.post('/api/auth/login', adminLoginRateLimiter, handleAdminLogin);
app.post('/api/admin/login', adminLoginRateLimiter, handleAdminLogin);

// API: S2S Postback (Webhook) Route for Affiliate Networks
app.get('/api/postback/:platform', async (req, res) => {
  const secret = req.query.secret || req.query.key;
  const platform = statePlatforms.find(p => p.id === req.params.platform || p.slug === req.params.platform);

  if (!platform || !secret || secret !== (platform as any).postbackKey) {
    return res.status(403).send('Forbidden');
  }

  const reqPlatform = req.params.platform;
  const { click_id, event, player, sum, currency, ...otherParams } = req.query;

  const postbackData = {
    platform: reqPlatform,
    click_id: click_id || null,
    event: event || 'unknown',
    player_id: player || null,
    sum: sum ? parseFloat(sum as string) : 0,
    currency: currency || null,
    rawQuery: req.query,
    receivedAt: new Date().toISOString()
  };

  const data = { statePlatforms, stateConfig, stateSubPartners };
  try {
    await setDoc('s2s_postbacks', Date.now().toString(), postbackData);
logger.info(`Saved S2S postback for ${reqPlatform} to MySQL.`);
    
    // Also push to local state for temporary viewing in admin
    stateTrackLogs.unshift({
      id: `pb_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      eventType: 'visit' as any,
      platformId: platform.id,
      platformName: platform.name,
      timestamp: new Date().toISOString(),
      country: 'S2S',
      ip: 'Server',
      userAgent: 'S2S Webhook'
    });
    if (stateTrackLogs.length > 100) stateTrackLogs.pop();
    
    // We must return 200 OK so the network knows we received it
    res.status(200).send('OK');
  } catch (error) {
    logger.error("Error saving postback:", error);
    res.status(500).send('Error');
  }
});


// API: Image Optimization Proxy
app.get('/api/image-optimize', async (req, res) => {
  const url = req.query.url;
  if (!url || typeof url !== 'string') {
    return res.status(400).send('URL required');
  }
  
  const width = parseInt(req.query.w as string) || 400;
  const quality = parseInt(req.query.q as string) || 75;

  try {
    const fetchRes = await fetch(url);
    if (!fetchRes.ok) throw new Error('Failed to fetch image');
    const arrayBuffer = await fetchRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const optimized = await sharp(buffer)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality })
      .toBuffer();
      
    res.set('Content-Type', 'image/webp');
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(optimized);
  } catch (error) {
    // If anything fails, fallback to redirecting to the original URL
    res.redirect(url);
  }
});

// API: Get Public Data
app.get('/api/data', (req, res) => {
  stateStats.totalVisits += 1;
  const geo = getGeoFromRequest(req);

  const safePlatforms = statePlatforms.map(p => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    logoUrl: p.logoUrl,
    rating: p.rating,
    starRating: p.starRating,
    badges: p.badges,
    bonusText: p.bonusText,
    promoCode: p.promoCode,
    isFeatured: p.isFeatured,
    featuredRank: p.featuredRank,
    isActive: p.isActive,
    category: p.category
  }));

  const safeConfig = {
    heroHeadline: stateConfig.heroHeadline,
    heroSubheading: stateConfig.heroSubheading,
    topBannerTemplate: stateConfig.topBannerTemplate,
    enableSubPartnerProgram: stateConfig.enableSubPartnerProgram,
    subPartnerHeadline: stateConfig.subPartnerHeadline,
    customCoupons: stateConfig.customCoupons,
    approvedFeedbacks: stateConfig.approvedFeedbacks,
    pushNotifications: stateConfig.pushNotifications,
    abTestConfig: stateConfig.abTestConfig,
    sidebarAdHtml: stateConfig.sidebarAdHtml,
    telegramUrl: stateConfig.telegramUrl,
    instagramUrl: stateConfig.instagramUrl,
    tiktokUrl: stateConfig.tiktokUrl,
    whatsappGroupUrl: stateConfig.whatsappGroupUrl,
    youtubeUrl: stateConfig.youtubeUrl,
    articles: stateConfig.articles,
    footerColumns: stateConfig.footerColumns,
    copyrightText: stateConfig.copyrightText,
    footerDisclaimerText: stateConfig.footerDisclaimerText,
    autoBlogSettings: stateConfig.autoBlogSettings
  };

  res.json({
    platforms: safePlatforms,
    config: safeConfig,
    customPages: stateCustomPages,
    geo
  });
});

// API: Get Full Admin State
app.get('/api/admin/data', verifyJwtToken, (req, res) => {
  const geo = getGeoFromRequest(req);
  res.json({
    platforms: statePlatforms,
    config: stateConfig,
    stats: stateStats,
    logs: stateTrackLogs,
    subPartners: stateSubPartners,
    customPages: stateCustomPages,
    geo
  });
});

// API: Submit Sub-Partner Application
app.post('/api/sub-partners', (req, res) => {
  const { fullName, email, whatsapp, platformId, platformName, trafficSource, estimatedMonthlyPlayers } = req.body;

  if (!fullName || !email || !whatsapp) {
    return res.status(400).json({ error: 'Name, email, and WhatsApp number are required' });
  }

  const newApp: SubPartnerApplication = {
    id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
    fullName,
    email,
    whatsapp,
    platformId: platformId || '1win',
    platformName: platformName || '1Win Casino',
    trafficSource: trafficSource || 'Social Media',
    estimatedMonthlyPlayers: estimatedMonthlyPlayers || '50-100 Players',
    status: 'pending',
    appliedAt: new Date().toISOString()
  };

  stateSubPartners.unshift(newApp);
  stateStats.totalSubPartnerApps = (stateStats.totalSubPartnerApps || 0) + 1;

  res.json({ success: true, application: newApp });
});

// API: Update Sub-Partner Status (Protected)
app.patch('/api/admin/sub-partners/:id', verifyJwtToken, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const appItem = stateSubPartners.find(s => s.id === id);
  if (!appItem) {
    return res.status(404).json({ error: 'Sub-partner application not found' });
  }

  if (status) {
    appItem.status = status;
    saveState();
  }

  res.json({ success: true, application: appItem });
});

// API: Save Platforms (Protected)
app.post('/api/admin/platforms', verifyJwtToken, (req, res) => {
  const { platforms } = req.body;
  if (Array.isArray(platforms)) {
    statePlatforms = platforms; saveState();
    return res.json({ success: true, platforms: statePlatforms });
  }
  return res.status(400).json({ error: 'Invalid platform data array' });
});

// API: Save Config (Protected)

app.post('/api/admin/custom-pages', verifyJwtToken, express.json(), (req, res) => {
  const { pages } = req.body;
  if (Array.isArray(pages)) {
    stateCustomPages = pages;
    saveState();
  }
  res.json({ success: true });
});

app.post('/api/admin/config', verifyJwtToken, (req, res) => {
  const { config } = req.body;
  if (config) {
    stateConfig = { ...stateConfig, ...config };
    saveState();
    return res.json({ success: true, config: stateConfig });
  }
  return res.status(400).json({ error: 'Invalid config payload' });
});

// API: Track Conversion Events (Click / Copy / Spin)
app.post('/api/track', (req, res) => {
  const { eventType, platformId } = req.body;
  const geo = getGeoFromRequest(req);

  const platform = statePlatforms.find(p => p.id === platformId);

  if (eventType === 'click') {
    stateStats.totalClicks += 1;
    if (platform) platform.clicksCount = (platform.clicksCount || 0) + 1;
  } else if (eventType === 'copy') {
    stateStats.totalPromoCopies += 1;
    if (platform) platform.copiesCount = (platform.copiesCount || 0) + 1;
  }

  const logEntry: TrackLog = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
    eventType,
    platformId,
    platformName: platform ? platform.name : 'Wheel Spin',
    timestamp: new Date().toISOString(),
    country: geo.country,
    ip: geo.ip,
    userAgent: req.headers['user-agent'] || 'Unknown'
  };

  stateTrackLogs.unshift(logEntry);
  if (stateTrackLogs.length > 100) stateTrackLogs.pop();

  res.json({ success: true });
});

// CLOAKED LINK REDIRECTION ROUTE (/go/:slug)
app.get('/go/:slug', (req, res) => {
  const { slug } = req.params;
  const userAgent = req.headers['user-agent'] || '';
  const isBot = BOT_USER_AGENTS.test(userAgent);
  
  // Extract tracking parameters from query string
  const clickId = req.query.click_id || req.query.utm_source || '';
  const sub1 = req.query.sub1 || '';
  const sub2 = req.query.sub2 || '';

  const platform = statePlatforms.find(p => p.slug === slug || p.id === slug);

  if (!platform) {
    return res.redirect('/');
  }

  // Build the dynamic Affiliate URL with tracking parameters
  let targetUrl = platform.rawAffiliateUrl;
  if (clickId || sub1 || sub2) {
    const urlObj = new URL(targetUrl);
    if (clickId) urlObj.searchParams.set('click_id', clickId as string);
    if (sub1) urlObj.searchParams.set('sub1', sub1 as string);
    if (sub2) urlObj.searchParams.set('sub2', sub2 as string);
    targetUrl = urlObj.toString();
  }

  // Record click count
  platform.clicksCount = (platform.clicksCount || 0) + 1;
  stateStats.totalClicks += 1;

  // Tracking Pixels Helper
  const fbPixelId = platform.trackingPixels?.facebookPixelId || stateConfig.globalTrackingPixels?.facebookPixelId;
  const gaPixelId = platform.trackingPixels?.googleAnalyticsId || stateConfig.globalTrackingPixels?.googleAnalyticsId;
  const customScript = stateConfig.globalTrackingPixels?.customHeaderScript || '';

  const pixelScriptHeader = `
    ${fbPixelId ? `
      <script>
        !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
        n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
        document,'script','https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${fbPixelId}');
        fbq('track', 'Lead');
      </script>
    ` : ''}
    ${gaPixelId ? `
      <script async src="https://www.googletagmanager.com/gtag/js?id=${gaPixelId}"></script>
      <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${gaPixelId}');
        gtag('event', 'conversion', {'send_to': '${gaPixelId}'});
      </script>
    ` : ''}
    ${customScript ? customScript : ''}
  `;

  // Real user -> Serve High-Converting 10-Minute Registration Urgency Interstitial Page then auto-redirect
  return res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Activating 500% Bonus - ${platform.name}</title>
      ${pixelScriptHeader}
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-slate-950 text-white font-sans min-h-screen flex items-center justify-center p-4">
      <div id="cardBox" class="max-w-md w-full bg-slate-900 border-2 border-emerald-500/70 rounded-3xl p-6 shadow-2xl text-center space-y-5 relative overflow-hidden transition-all duration-500">
        
        <!-- Glow accent -->
        <div id="glowAccent" class="absolute -top-12 -left-12 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none transition-all duration-500"></div>
        <div class="absolute -bottom-12 -right-12 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl pointer-events-none"></div>

        <!-- Header badge -->
        <div id="timerBadge" class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-black uppercase tracking-wider transition-all">
          <span>🟢 10-MINUTE REGISTRATION TIMER ACTIVATED</span>
        </div>

        <!-- Logo & Title -->
        <div class="flex flex-col items-center gap-2">
          <img src="${platform.logoUrl}" alt="${platform.name}" class="w-16 h-16 rounded-2xl border-2 border-amber-500/60 shadow-lg object-cover" />
          <h1 class="text-2xl font-black text-white">${platform.name} Welcome Bonus</h1>
          <p class="text-xs text-slate-300">Your 500% Deposit Bonus & 200 Free Spins are reserved for the next 10 minutes.</p>
        </div>

        <!-- 10 Minute Urgency Timer Box -->
        <div id="timerBox" class="bg-slate-950 border-2 border-emerald-500/50 rounded-2xl p-4 space-y-1 transition-all duration-500">
          <span id="timerLabel" class="text-[10px] uppercase font-black text-emerald-400 tracking-widest block">RESERVED BONUS COUNTDOWN</span>
          <div id="timer" class="font-mono text-4xl font-black text-emerald-300 tracking-wider">10:00</div>
          <span className="text-[11px] text-slate-400 block">Complete registration before timer expires to guarantee bonus</span>
        </div>

        <!-- Promo Code Box -->
        <div class="bg-purple-950/60 border border-purple-500/40 rounded-xl p-3 flex items-center justify-between">
          <div class="text-left">
            <span class="text-[9px] uppercase font-bold text-purple-300 block">REQUIRED PROMO CODE</span>
            <span class="font-mono font-black text-amber-300 text-base tracking-wider">${platform.promoCode || 'MAXBOOST500'}</span>
          </div>
          <button onclick="copyCode()" id="copyBtn" class="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 transition-colors">
            COPY CODE
          </button>
        </div>

        <!-- CTA Direct Button -->
        <a id="redirectLink" href="${targetUrl}" class="block w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm uppercase tracking-wide shadow-xl shadow-amber-500/20 transform active:scale-95 transition-all">
          PROCEED TO OFFICIAL REGISTRATION NOW (<span id="count">2</span>s)
        </a>

        <p class="text-[11px] text-slate-500">18+ Only • Safe Encrypted Redirect to Official Registration Page</p>
      </div>

      <script>
        // Copy Code Functionality
        function copyCode() {
          navigator.clipboard.writeText('${platform.promoCode || 'MAXBOOST500'}');
          const btn = document.getElementById('copyBtn');
          btn.innerText = 'COPIED! ✅';
          btn.classList.add('bg-emerald-400', 'text-slate-950');
        }

        // 10 Minute Urgency Timer Counter with Dynamic Visual Color Shift & Pulse Animation
        let totalSeconds = 600;
        const timerElem = document.getElementById('timer');
        const timerBox = document.getElementById('timerBox');
        const timerLabel = document.getElementById('timerLabel');
        const cardBox = document.getElementById('cardBox');
        const timerBadge = document.getElementById('timerBadge');

        setInterval(() => {
          if (totalSeconds > 0) {
            totalSeconds--;
            const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
            const s = (totalSeconds % 60).toString().padStart(2, '0');
            timerElem.innerText = m + ':' + s;

            // Phase 1: 10m to 6m (> 360s) -> Emerald Green
            if (totalSeconds > 360) {
              // Default Green
            } 
            // Phase 2: 6m to 3m (180s - 360s) -> Amber Yellow Pulse
            else if (totalSeconds <= 360 && totalSeconds > 180) {
              cardBox.className = "max-w-md w-full bg-slate-900 border-2 border-amber-500/80 rounded-3xl p-6 shadow-2xl text-center space-y-5 relative overflow-hidden transition-all duration-500";
              timerBox.className = "bg-amber-950/80 border-2 border-amber-500 rounded-2xl p-4 space-y-1 animate-pulse transition-all duration-500";
              timerElem.className = "font-mono text-4xl font-black text-amber-300 tracking-wider";
              timerLabel.className = "text-[10px] uppercase font-black text-amber-400 tracking-widest block";
              timerLabel.innerText = "⚠️ OFFER EXPIRING SOON - REGISTER NOW";
              timerBadge.className = "inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-950 border border-amber-500/60 text-amber-300 text-xs font-black uppercase tracking-wider";
              timerBadge.innerText = "⚠️ OFFER EXPIRING SOON";
            } 
            // Phase 3: < 3m (0s - 180s) -> Crimson Red Urgent Rapid Pulse / Bounce
            else if (totalSeconds <= 180) {
              cardBox.className = "max-w-md w-full bg-slate-900 border-4 border-red-500 rounded-3xl p-6 shadow-2xl shadow-red-900/50 text-center space-y-5 relative overflow-hidden transition-all duration-500";
              timerBox.className = "bg-red-950 border-4 border-red-500 rounded-2xl p-4 space-y-1 animate-bounce transition-all duration-500";
              timerElem.className = "font-mono text-4xl font-black text-red-400 tracking-wider";
              timerLabel.className = "text-[10px] uppercase font-black text-red-300 tracking-widest block animate-pulse";
              timerLabel.innerText = "🚨 CRITICAL WARNING - EXPIRING IN MINUTES!";
              timerBadge.className = "inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-950 border border-red-500 text-red-400 text-xs font-black uppercase tracking-wider animate-pulse";
              timerBadge.innerText = "🚨 CRITICAL WARNING";
            }
          }
        }, 1000);

        // Auto Redirect Countdown
        let redirectSeconds = 2;
        const countElem = document.getElementById('count');
        const interval = setInterval(() => {
          redirectSeconds--;
          if (countElem) countElem.innerText = redirectSeconds;
          if (redirectSeconds <= 0) {
            clearInterval(interval);
            window.location.href = "${targetUrl}";
          }
        }, 1000);
      </script>
    </body>
    </html>
  `);
});


app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin
Disallow: /go/
Disallow: /api/admin/

Sitemap: https://bonuspromocode.in/sitemap.xml
`);
});

// SEO Helper function
// to dynamically inject sitemap.xml route
function injectSitemapRoute(app: express.Application) {
  app.get('/sitemap.xml', (req, res) => {
    const host = `https://${req.get('host')}`;
    const now = new Date().toISOString().split('T')[0];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Homepage
    xml += `  <url>\n`;
    xml += `    <loc>${host}/</loc>\n`;
    xml += `    <lastmod>${now}</lastmod>\n`;
    xml += `    <changefreq>daily</changefreq>\n`;
    xml += `    <priority>1.0</priority>\n`;
    xml += `  </url>\n`;

    // Active Gaming Platforms
    statePlatforms.filter(p => p.isActive).forEach(p => {


      // Review Route
      xml += `  <url>\n`;
      xml += `    <loc>${host}/review/${p.slug}</loc>\n`;
      xml += `    <lastmod>${now}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    });

    // Active Custom Standalone Coupons
    if (stateConfig.customCoupons) {
      stateConfig.customCoupons.filter(c => c.isActive).forEach(c => {
        xml += `  <url>\n`;
        xml += `    <loc>${host}/coupon/${c.id}</loc>\n`;
        xml += `    <lastmod>${now}</lastmod>\n`;
        xml += `    <changefreq>daily</changefreq>\n`;
        xml += `    <priority>0.85</priority>\n`;
        xml += `  </url>\n`;
      });
    }

    xml += `</urlset>`;
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  });
}

// Inject the sitemap route
injectSitemapRoute(app);

// Gemini SEO Generation API
app.post('/api/generate-seo', verifyJwtToken, async (req, res) => {
  const data = { statePlatforms, stateConfig, stateSubPartners };
  try {
    const { platformName, existingDescription } = req.body;
    
    if (!platformName) {
      return res.status(400).json({ error: 'platformName is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
    }

    const ai = new GoogleGenAI({ 
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const prompt = `You are an expert iGaming SEO copywriter. Generate SEO metadata (title, description, keywords) and exactly 2 FAQ entries for the gaming platform "${platformName}". Make the content sound professional, trustworthy, and engaging for affiliates and players. Focus on bonuses, withdrawals, and reliability. IMPORTANT: Keep the title strictly under 60 characters and the description strictly under 160 characters to comply with Google SEO guidelines.${existingDescription ? ' Here is existing info to build on: ' + existingDescription : ''}`;

    const response = await generateWithRetry(ai, {
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: 'SEO optimized title strictly under 60 characters.',
            },
            description: {
              type: Type.STRING,
              description: 'SEO optimized description strictly under 160 characters.',
            },
            keywords: {
              type: Type.STRING,
              description: 'Comma separated list of 4-6 target keywords.',
            },
            faqs: {
              type: Type.ARRAY,
              description: 'Exactly 2 FAQ items about the platform.',
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  answer: { type: Type.STRING },
                },
                required: ['question', 'answer']
              }
            }
          },
          required: ['title', 'description', 'keywords', 'faqs']
        }
      }
    });

    const output = JSON.parse(response.text || '{}');
    res.json({ success: true, data: output });
  } catch (error: any) {
    logger.error('Error generating SEO content with Gemini:', error);
    res.status(500).json({ error: error.message || 'Failed to generate SEO content' });
  }
});

app.post('/api/generate-article', verifyJwtToken, async (req, res) => {
  const data = { statePlatforms, stateConfig, stateSubPartners };
  try {
    const { topic, category, platformName, platformId } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not set on the server.' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const prompt = `You are an expert SEO content writer and copywriter for a gaming/finance affiliate website. 
    Write a comprehensive, engaging, and highly SEO-optimized article about "${topic}" in the category of "${category}".
    ${platformName ? `The article should focus heavily on the brand/platform: ${platformName}.` : ''}
    
    Guidelines:
    - Use proper markdown formatting (H2, H3, bold text, bullet points).
    - Write an engaging introduction and a strong conclusion.
    - Naturally include relevant keywords related to the topic.
    - Return the response as JSON matching the schema precisely.
    `;

    const response = await generateWithRetry(ai, {
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'A catchy, SEO-friendly H1 title' },
            metaTitle: { type: Type.STRING, description: 'SEO Meta Title (max 60 chars)' },
            metaDescription: { type: Type.STRING, description: 'SEO Meta Description (max 160 chars)' },
            content: { type: Type.STRING, description: 'The full article content in Markdown format' },
            tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: '5-7 relevant SEO tags/keywords' }
          },
          required: ['title', 'metaTitle', 'metaDescription', 'content', 'tags']
        }
      }
    });

    if (!response.text) {
      logger.error('AI returned empty response for article generation');
      return res.status(500).json({ error: 'AI returned empty response' });
    }
    
    let generated;
    try {
      generated = JSON.parse(response.text);
    } catch (parseError: any) {
      logger.error('JSON parsing failed for AI response:', {
        error: parseError.message,
        rawText: response.text
      });
      return res.status(500).json({ error: 'Failed to parse AI response as JSON.', details: parseError.message });
    }

    res.json(generated);
  } catch (error: any) {
    logger.error('Error generating AI article API call:', {
      message: error.message,
      name: error.name,
      status: error.status || error.code,
      stack: error.stack
    });

    let statusCode = error.status || error.code || 500;
    let errorMsg = 'Failed to generate article: ' + (error.message || 'Unknown error');

    if (statusCode === 401 || error.message?.includes('API key')) {
      errorMsg = 'AI API authentication failed (invalid or expired key).';
      statusCode = 401;
    } else if (statusCode === 429 || error.message?.includes('quota')) {
      errorMsg = 'AI API rate limit or quota exceeded.';
      statusCode = 429;
    } else if (error.message?.includes('timeout') || error.name === 'AbortError') {
      errorMsg = 'AI API request timed out.';
      statusCode = 504;
    }

    res.status(statusCode).json({ error: errorMsg, details: error.message });
  }
});

// Vite / Static Files Setup
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production' || (typeof __filename !== 'undefined' && __filename.endsWith('.cjs'));
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const fs = await import('fs');
    
    // Find the correct dist directory regardless of working directory
    const candidates = [
      path.join(process.cwd(), 'dist'),
      path.join(__dirname, 'dist'),
      path.join(__dirname),
      process.cwd()
    ];
    const distPath = candidates.find(c => fs.existsSync(path.join(c, 'index.html')) && fs.existsSync(path.join(c, 'assets')))
      || candidates.find(c => fs.existsSync(path.join(c, 'index.html')))
      || path.join(process.cwd(), 'dist');

    logger.info(`[Production] Serving static files from: ${distPath}`);

    // Serve static files with proper MIME types & cache headers
    app.use(express.static(distPath, {
      maxAge: '1y',
      immutable: true,
      index: false,
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.js') || filePath.endsWith('.mjs')) {
          res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
        } else if (filePath.endsWith('.css')) {
          res.setHeader('Content-Type', 'text/css; charset=UTF-8');
        } else if (filePath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
          res.setHeader('Pragma', 'no-cache');
          res.setHeader('Expires', '0');
        }
      }
    }));

    // Explicitly serve assets folder if nested
    const assetsPath = path.join(distPath, 'assets');
    if (fs.existsSync(assetsPath)) {
      app.use('/assets', express.static(assetsPath, {
        maxAge: '1y',
        immutable: true,
        setHeaders: (res, filePath) => {
          if (filePath.endsWith('.js') || filePath.endsWith('.mjs')) {
            res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
          } else if (filePath.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css; charset=UTF-8');
          }
        }
      }));
    }

    // Explicitly return 404 for missing static assets so they never fall back to index.html
    app.use('/assets', (req, res) => {
      res.status(404).setHeader('Content-Type', 'text/plain').send('Asset not found');
    });

    app.get('*', (req, res) => {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      
      const htmlFile = path.join(distPath, 'index.html');
      if (fs.existsSync(htmlFile)) {
        let html = fs.readFileSync(htmlFile, 'utf-8');
        const geo = getGeoFromRequest(req);
        
        // --- DYNAMIC SEO ENGINE ---
        // Defaults
        let seoTitle = stateConfig.heroHeadline || 'Best Promo Codes';
        let seoDesc = stateConfig.heroSubheading || 'Find the latest and greatest promo codes.';
        let injectedSchema = '';

        // Check if viewing a specific platform via path (e.g. /platform/1win)
        const platformMatch = req.path.match(/^\/platform\/([^/]+)/);
        if (platformMatch) {
          const pSlug = platformMatch[1];
          const platform = statePlatforms.find(p => p.slug === pSlug);
          if (platform) {
            seoTitle = `${platform.name} Promo Code ${platform.promoCode} | Get ${platform.bonusText}`;
            seoDesc = `Claim the exclusive ${platform.name} bonus with promo code ${platform.promoCode}. ${platform.bonusText}. Updated and verified!`.substring(0, 160);
            
            // Generate Review Schema
            const reviewSchema = {
              "@context": "https://schema.org/",
              "@type": "Review",
              "itemReviewed": {
                "@type": "Organization",
                "name": platform.name,
                "image": platform.logoUrl
              },
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": platform.rating || "5.0",
                "bestRating": "5"
              },
              "author": {
                "@type": "Organization",
                "name": "Bonus Promo Code"
              }
            };
            
            // Generate FAQ Schema
            const faqSchema = {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": `What is the best promo code for ${platform.name}?`,
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `The best promo code for ${platform.name} is ${platform.promoCode}. Use it to claim ${platform.bonusText}.`
                  }
                },
                {
                  "@type": "Question",
                  "name": `Is ${platform.name} legit?`,
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `Yes, ${platform.name} is a highly rated platform with a rating of ${platform.rating} out of 5 stars.`
                  }
                }
              ]
            };
            
            injectedSchema = `\n<script type="application/ld+json">${JSON.stringify(reviewSchema)}</script>\n<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>`;
          }
        }

        // Check if viewing an article
        const articleMatch = req.path.match(/^\/blog\/([^/]+)/);
        if (articleMatch) {
          const aSlug = articleMatch[1];
          const article = stateConfig.articles?.find(a => a.slug === aSlug);
          if (article) {
            seoTitle = article.metaTitle || article.title;
            seoDesc = (article.metaDescription || article.content.substring(0, 150)).substring(0, 160);
          }
        }

        // Replace SEO Tags in HTML
        html = html.replace(/<title>.*?<\/title>/, `<title>${seoTitle}</title>`);
        if (!html.includes('<meta name="description"')) {
           html = html.replace('<head>', `<head>\n<meta name="description" content="${seoDesc}">`);
        } else {
           html = html.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${seoDesc}">`);
        }

        const safePlatforms = statePlatforms.map(p => ({
          id: p.id, slug: p.slug, name: p.name, logoUrl: p.logoUrl,
          rating: p.rating, starRating: p.starRating, badges: p.badges,
          bonusText: p.bonusText, promoCode: p.promoCode, isFeatured: p.isFeatured,
          featuredRank: p.featuredRank, isActive: p.isActive, category: p.category
        }));
        
        const safeConfig = {
          heroHeadline: stateConfig.heroHeadline, heroSubheading: stateConfig.heroSubheading,
          topBannerTemplate: stateConfig.topBannerTemplate, enableSubPartnerProgram: stateConfig.enableSubPartnerProgram,
          subPartnerHeadline: stateConfig.subPartnerHeadline, customCoupons: stateConfig.customCoupons,
          approvedFeedbacks: stateConfig.approvedFeedbacks, pushNotifications: stateConfig.pushNotifications,
          abTestConfig: stateConfig.abTestConfig, sidebarAdHtml: stateConfig.sidebarAdHtml,
          telegramUrl: stateConfig.telegramUrl, instagramUrl: stateConfig.instagramUrl,
          tiktokUrl: stateConfig.tiktokUrl, whatsappGroupUrl: stateConfig.whatsappGroupUrl,
          youtubeUrl: stateConfig.youtubeUrl, articles: stateConfig.articles,
          footerColumns: stateConfig.footerColumns, copyrightText: stateConfig.copyrightText,
          footerDisclaimerText: stateConfig.footerDisclaimerText, autoBlogSettings: stateConfig.autoBlogSettings
        };
        
        const initialData = { platforms: safePlatforms, config: safeConfig, customPages: stateCustomPages, geo };
        const scriptTag = `${injectedSchema}<script>window.__INITIAL_DATA__ = ${JSON.stringify(initialData).replace(/</g, '\\u003c')};</script></head>`;
        html = html.replace('</head>', scriptTag);
        
        res.send(html);
      } else {
        res.status(500).send('Production build not found. Run npm run build.');
      }
    });
  }


// ----------------------------------------------------------------------
// AUTOMATED AUTO-BLOGGER BACKGROUND SERVICE
// ----------------------------------------------------------------------
const autoblogInterval = setInterval(async () => {
  if (!stateConfig.autoBlogSettings?.enabled) return;
  if (!process.env.GEMINI_API_KEY) return;
  
  const { categories, topics } = stateConfig.autoBlogSettings;
  if (!categories || categories.length === 0) return;
  
  const data = { statePlatforms, stateConfig, stateSubPartners };
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Pick random category and topic
    const defaultCategories = ['Gaming', 'Crypto', 'Finance', 'Loans', 'Virtual Cards'];
    const cats = categories && categories.length > 0 ? categories : defaultCategories;
    const category = cats[Math.floor(Math.random() * cats.length)];
    const defaultTopics = ['Best crypto wallets for gaming withdrawals', '1Win vs Mostbet: Which is better?', 'Best Casino Promo Codes 2026', 'No KYC Crypto Casinos', 'Instant Withdrawal Casinos in India', 'Stake vs BC.Game Comparison', 'Top 5 Casino Welcome Bonuses', 'How to claim 1Win 500% Bonus'];
    const tops = topics && topics.length > 0 ? topics : defaultTopics;
    const topic = tops[Math.floor(Math.random() * tops.length)];

    logger.info(`[Auto-Blogger] Generating draft for: ${topic} in ${category}`);
    
    const prompt = `You are an expert iGaming SEO copywriter. Write a comprehensive, highly engaging, and highly converting article (800-1500 words) about: "${topic}".
    Category: ${category}.
    Make sure to include sections for:
    - Introduction and target audience
    - Detailed breakdown (Pros/Cons, Comparisons if applicable)
    - Payment methods and withdrawal speeds
    - Step-by-step guide on how to claim promo codes (mention code MAXBOOST500)
    - Responsible gambling disclaimer at the end
    
    Use rich Markdown formatting (H2, H3, bullet points, bold text).
    Return ONLY valid JSON in this exact format:
    {
      "title": "Catchy SEO Title",
      "content": "Markdown formatted content. At least 500 words.",
      "metaTitle": "SEO Meta Title under 60 chars",
      "metaDescription": "SEO Meta Description under 160 chars",
      "tags": ["tag1", "tag2", "tag3"]
    }`;

    const response = await generateWithRetry(ai, {
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            metaTitle: { type: Type.STRING },
            metaDescription: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["title", "content", "metaTitle", "metaDescription", "tags"]
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      const newArticle = {
        id: 'art_auto_' + Math.floor(Math.random() * 1000000),
        slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        title: data.title,
        content: data.content,
        category,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        publishedAt: new Date().toISOString(),
        author: 'AI Auto-Blogger',
        tags: data.tags || [],
        views: 0,
        status: 'draft' as const
      };

      if (!stateConfig.articles) stateConfig.articles = [];
      stateConfig.articles = [newArticle, ...stateConfig.articles];
      logger.info(`[Auto-Blogger] Successfully created draft: ${data.title}`);
    }
  } catch (err) {
    logger.error('[Auto-Blogger] Error generating article:', err);
  }
}, (stateConfig.autoBlogSettings?.intervalHours || 24) * 60 * 60 * 1000); // Default to checking daily, but interval updates when hours change.

  // Setup Sentry error handler BEFORE any other error middlewares, but AFTER all routes
  if (process.env.SENTRY_DSN) {
    Sentry.setupExpressErrorHandler(app);
  }

  const server = app.listen(Number(PORT), '0.0.0.0', () => {
    logger.info(`Affiliate Hub App listening on port ${PORT}`);
  });

  server.on('error', (e: any) => {
    if (e.code === 'EADDRINUSE') {
      logger.error(`Port ${PORT} is in use, aborting...`);
      process.exit(1);
    } else {
      logger.error('Server error:', e);
    }
  });
}

startServer();
