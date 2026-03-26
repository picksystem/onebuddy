import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import { AuthController } from './Auth.controller';
import { prisma } from '@bandi/database';

const controller = new AuthController();
const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'bandi-jwt-secret-key';
const uploadsDir = path.join(__dirname, '../../../uploads/attachments');

// ── Multer config ──────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const userId = (req as any).targetUserId ?? 'unknown';
    const dest = path.join(uploadsDir, String(userId));
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${unique}-${file.originalname}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } });

// Pre-parse userId before multer so destination can use it
const extractUserId = (req: Request, _res: Response, next: () => void) => {
  // userId may come as query param or body field (before multer runs)
  (req as any).targetUserId = req.query.userId ?? req.body?.userId ?? 'unknown';
  next();
};

// ── POST /api/auth  (existing handler) ────────────────────────────────────
router.post('/', controller.handleAction);

// ── POST /api/auth/upload-attachments ─────────────────────────────────────
router.post(
  '/upload-attachments',
  extractUserId,
  upload.array('files', 20),
  async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    try {
      jwt.verify(authHeader.slice(7), JWT_SECRET);
    } catch {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }

    const userId = Number(req.query.userId ?? req.body?.userId);
    if (!userId) {
      res.status(400).json({ message: 'userId is required' });
      return;
    }

    const files = (req.files as Express.Multer.File[]) ?? [];
    const newEntries = files.map((f) => ({
      name: f.originalname,
      url: `/uploads/attachments/${userId}/${f.filename}`,
      size: f.size,
    }));

    const user = await (prisma as any).user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    let existing: any[] = [];
    try {
      existing = user.attachments ? JSON.parse(user.attachments) : [];
    } catch {
      existing = [];
    }

    const updated = [...existing, ...newEntries];
    await (prisma as any).user.update({
      where: { id: userId },
      data: { attachments: JSON.stringify(updated) },
    });

    res.json({ message: 'Attachments uploaded', data: updated });
  },
);

// ── DELETE /api/auth/delete-attachment ────────────────────────────────────
router.delete('/delete-attachment', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  try {
    jwt.verify(authHeader.slice(7), JWT_SECRET);
  } catch {
    res.status(401).json({ message: 'Invalid token' });
    return;
  }

  const { userId, url } = req.body as { userId: number; url: string };
  if (!userId || !url) {
    res.status(400).json({ message: 'userId and url are required' });
    return;
  }

  const user = await (prisma as any).user.findUnique({ where: { id: Number(userId) } });
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  let attachments: any[] = [];
  try {
    attachments = user.attachments ? JSON.parse(user.attachments) : [];
  } catch {
    attachments = [];
  }

  const updated = attachments.filter((a: any) => a.url !== url);
  await (prisma as any).user.update({
    where: { id: Number(userId) },
    data: { attachments: JSON.stringify(updated) },
  });

  // Delete physical file
  const filePath = path.join(__dirname, '../../../', url);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  res.json({ message: 'Attachment removed', data: updated });
});

export default router;
