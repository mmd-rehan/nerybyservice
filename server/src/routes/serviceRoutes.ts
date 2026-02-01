import express from 'express';
import { createService, searchServices } from '../controllers/serviceController';

const router = express.Router();

router.post('/services', createService);
router.get('/search', searchServices);

export default router;
