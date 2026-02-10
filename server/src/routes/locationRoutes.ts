import express from 'express';
import { getUserLocation } from '../controllers/location.controller';

const router = express.Router();

router.get('/', getUserLocation);

export default router;
