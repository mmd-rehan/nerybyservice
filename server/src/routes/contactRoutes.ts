import express from 'express';
import { sendContactEmail } from '../controllers/contactController';

const router = express.Router();

router.post('/contact', sendContactEmail as any);

export default router;
