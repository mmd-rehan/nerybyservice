import { Request, Response } from 'express';
const iplocate = require('node-iplocate');
import redisClient from '../config/redisClient';

export const getUserLocation = async (req: Request, res: Response): Promise<void> => {
    try {
        let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
        if (Array.isArray(ip)) {
            ip = ip[0];
        }

        // Handle local development where IP might be ::1 or 127.0.0.1
        if (ip === '::1' || ip === '127.0.0.1') {
            // For testing purposes, you might want to hardcode a public IP or return a mock location
            // Using a public IP for testing (e.g., Google's public DNS IP)
            // or just let it fail/return null if you want strictly real IP behavior.
            // Here we'll just log it and maybe try to proceed (iplocate might handle it or return null)
            console.log('Localhost IP detected:', ip);
        }

        const cacheKey = `location:${ip}`;

        // Check Redis Cache
        const cachedLocation = await redisClient.get(cacheKey);

        if (cachedLocation) {
            console.log('Serving location from Redis Cache');
            res.json(JSON.parse(cachedLocation));
            return;
        }

        // If not in cache, fetch from node-iplocate
        const result = await iplocate(ip, { api_key: process.env.IP_LOCATE_KEY });

        if (result && result.latitude && result.longitude) {
            // Cache the result for 24 hours (86400 seconds)
            await redisClient.set(cacheKey, JSON.stringify(result), {
                EX: 86400
            });

            res.json(result);
        } else {
            // Handle case where location could not be determined
            res.status(404).json({ message: 'Location not found for this IP' });
        }

    } catch (error: any) {
        console.error("Error fetching location:", error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};
