import express from 'express';
import { handleAiSearch } from '../controllers/aiSearchController';

const router = express.Router();

// POST /api/ai/search
router.post('/search', handleAiSearch);

export default router;
