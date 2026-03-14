import express from 'express';
import { handleAiSearch } from '../controllers/aiSearchController';

import multer from 'multer';

// Use memory storage for quick processing without saving to disk
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

// POST /api/ai/search
router.post('/search', upload.fields([{ name: 'audio', maxCount: 1 }, { name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), handleAiSearch);

export default router;
