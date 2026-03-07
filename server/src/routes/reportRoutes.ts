import express from 'express';
import { createReport } from '../controllers/reportController';

const router = express.Router();

router.post('/reports', createReport as any);

export default router;
