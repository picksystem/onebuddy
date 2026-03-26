// Automatically catches async errors thrown inside route handlers
import 'express-async-errors';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import multer from 'multer';

// Centralized error handling middleware
import { errorHandler, notFoundHandler } from '@bandi/middleware';

// Import route modules
import authRoutes from '../api/auth/Auth.routes';
import adminRoutes from '../api/admin/routes';
import userRoutes from '../api/user/routes';
import captainRoutes from '../api/captain/routes';

// Constants for route paths
import { ADMIN_PATHS, USER_PATHS, CAPTAIN_PATHS } from '@bandi/constants';

const app = express();

/**
 * ─────────────────────────────────────────────────
 * Simple In-Memory Rate Limiter
 * ─────────────────────────────────────────────────
 * Protects public auth endpoints (signin, signup, forgot-password, verify-otp)
 * from brute-force and enumeration attacks.
 * Works across both web and mobile without external dependencies.
 *
 * Limits:
 *   - Auth sensitive actions  : 10 requests / 15 min per IP
 *   - All other auth actions  : 60 requests / 1 min per IP
 */
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

// Clean up expired entries every 5 minutes to prevent memory growth
setInterval(
  () => {
    const now = Date.now();
    for (const [key, val] of rateLimitStore.entries()) {
      if (now > val.resetAt) rateLimitStore.delete(key);
    }
  },
  5 * 60 * 1000,
);

function makeRateLimiter(maxRequests: number, windowMs: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Skip rate limiting in development
    if (process.env.NODE_ENV !== 'production') return next();

    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const key = `${ip}:${req.path}`;
    const now = Date.now();
    const entry = rateLimitStore.get(key);

    if (!entry || now > entry.resetAt) {
      rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }
    if (entry.count >= maxRequests) {
      const retryAfterSec = Math.ceil((entry.resetAt - now) / 1000);
      res.setHeader('Retry-After', String(retryAfterSec));
      res.status(429).json({
        message: `Too many requests. Please try again in ${retryAfterSec} seconds.`,
        retryAfter: retryAfterSec,
      });
      return;
    }
    entry.count++;
    next();
  };
}

// Strict limiter for sensitive endpoints
const strictRateLimit = makeRateLimiter(10, 15 * 60 * 1000); // 10 / 15 min
// General limiter for all other auth calls
const generalRateLimit = makeRateLimiter(60, 60 * 1000); // 60 / 1 min

// Middleware that applies strict or general limit based on action
function authRateLimit(req: Request, res: Response, next: NextFunction) {
  const action = (req.body as Record<string, unknown>)?.action as string;
  const sensitiveActions = [
    'signin',
    'signup',
    'forgot-password',
    'verify-otp',
    'reset-password',
    'refresh-token',
  ];
  if (sensitiveActions.includes(action)) return strictRateLimit(req, res, next);
  return generalRateLimit(req, res, next);
}

/**
 * ─────────────────────────────────────────────────
 * CORS Configuration
 * ─────────────────────────────────────────────────
 * Web browsers require CORS headers.
 * Native mobile apps (Android/iOS) do NOT send Origin headers —
 * they bypass CORS entirely and call the API directly.
 *
 * CORS_ORIGIN env var: comma-separated list of allowed web origins.
 * Leave blank/unset to allow all origins (development mode).
 */
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : [];

const corsOptions: cors.CorsOptions = {
  origin:
    allowedOrigins.length > 0
      ? (origin, callback) => {
          // Mobile apps (no Origin header) and configured origins are allowed
          if (!origin || allowedOrigins.includes(origin)) callback(null, true);
          else callback(new Error(`CORS: origin ${origin} not allowed`));
        }
      : true, // allow all in dev
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Platform', 'X-Device-Id'],
};

/**
 * -------------------------
 * Global Middleware
 * -------------------------
 */

// Enable CORS
app.use(cors(corsOptions));

// Parse incoming JSON requests
app.use(express.json({ limit: '10mb' }));

// Serve uploaded files statically
const uploadsDir = path.join(__dirname, '../../uploads/attachments');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads/attachments', express.static(uploadsDir));
// Return plain 404 for missing static files (prevent API notFoundHandler JSON response)
app.use('/uploads', (_req, res) => res.status(404).end());

// ── Multer: user attachment uploads ──────────────────────────────────────────
const attachmentStorage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const userId = (req as any).userId ?? 'unknown';
    const dest = path.join(uploadsDir, String(userId));
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${unique}-${file.originalname}`);
  },
});
const uploadMiddleware = multer({ storage: attachmentStorage, limits: { fileSize: 20 * 1024 * 1024 } });

/**
 * ─────────────────────────────────────────────────
 * API Routes — with versioning
 * ─────────────────────────────────────────────────
 * Both /api/* and /api/v1/* are served by the same handlers.
 * This allows mobile apps to target /api/v1/ while the web
 * continues using /api/. Future breaking changes get /api/v2/.
 * ─────────────────────────────────────────────────
 */

// Helper to mount a route on both unversioned and v1 paths
function mountVersioned(basePath: string, router: express.Router) {
  app.use(basePath, router);
  app.use(`/api/v1${basePath.replace('/api', '')}`, router);
}

/**
 * -------------------------
 * API Routes
 * -------------------------
 */

// Auth API routes (rate-limited)
app.use('/api/auth', authRateLimit, authRoutes);
app.use('/api/v1/auth', authRateLimit, authRoutes);

// Admin API routes
mountVersioned(`/api/${ADMIN_PATHS.ADMIN}`, adminRoutes);

// User API routes
mountVersioned(`/api/${USER_PATHS.USER}`, userRoutes);

// Captain API routes
mountVersioned(`/api/${CAPTAIN_PATHS.CAPTAIN}`, captainRoutes);

/**
 * -------------------------
 * Health Check
 * -------------------------
 */

app.get('/health', (_req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

/**
 * -------------------------
 * Error Handling
 * -------------------------
 */

// Handles unknown routes (404 errors)
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

export default app;
