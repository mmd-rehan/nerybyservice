import { Request, Response } from 'express';
import Service, { ServiceSchemaZod } from '../models/Service';
import { z } from 'zod';

export const createService = async (req: Request, res: Response) => {
    try {
        // 1. Validate Input
        const validatedData = ServiceSchemaZod.parse(req.body);

        // 2. Create Service
        // Mock OTP check: In a real app, we'd verify a code here.
        // For now, we trust the input and create 'approved' by default (as per schema default)
        const service = await Service.create(validatedData);

        res.status(201).json({
            success: true,
            data: service,
        });
    } catch (error: any) {
        console.error(error);
        if (error instanceof z.ZodError) {
            // Cast to any to avoid TS error with .errors vs .issues depending on version/types
            return res.status(400).json({ success: false, errors: (error as any).errors });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

export const searchServices = async (req: Request, res: Response) => {
    try {
        const { lat, lng, radius, text, query: searchQuery } = req.query;
        const searchTerm = (text as string) || (searchQuery as string);


        if (!lat || !lng) {
            return res.status(400).json({ success: false, message: 'Latitude (lat) and Longitude (lng) are required.' });
        }

        const latitude = parseFloat(lat as string);
        const longitude = parseFloat(lng as string);
        const radiusInMeters = radius ? parseFloat(radius as string) : 160934; // Default 100 miles ~ 160934 meters


        // Since $near sorts by distance automatically, we don't need additional sort.
        // However, $near does not return the calculated distance field in the document unless using aggregation ($geoNear).
        // The prompt asks to "Return distance calculated in the response." -> We MUST use aggregation.

        const pipeline: any[] = [
            {
                $geoNear: {
                    near: { type: 'Point', coordinates: [longitude, latitude] },
                    distanceField: 'distance',
                    maxDistance: radiusInMeters,
                    spherical: true,
                    // query: ... (we can put the rest of the match here)
                },
            },
            {
                $match: {
                    status: 'approved',
                },
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category',
                },
            },
            {
                $unwind: {
                    path: '$category',
                    preserveNullAndEmptyArrays: true,
                },
            },
        ];

        if (searchTerm) {
            pipeline.push({
                $match: {
                    $or: [
                        { serviceTitle: { $regex: searchTerm, $options: 'i' } },
                        { 'category.name': { $regex: searchTerm, $options: 'i' } },
                        { description: { $regex: searchTerm, $options: 'i' } },
                    ],
                },
            });
        }


        const services = await Service.aggregate(pipeline);

        res.status(200).json({
            success: true,
            count: services.length,
            data: services,
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
