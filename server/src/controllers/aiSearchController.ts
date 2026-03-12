import { Request, Response } from 'express';
import { extractSearchParameters } from '../services/novaAI';
import Service from '../models/Service';
import Category from '../models/Category';

export const handleAiSearch = async (req: Request, res: Response): Promise<void> => {
    try {
        const { query, userLocation } = req.body;

        if (!query || !userLocation || !userLocation.lat || !userLocation.lng) {
            res.status(400).json({ success: false, message: 'query and userLocation (lat, lng) are required' });
            return;
        }

        let interpretedQuery: any = {};
        
        try {
            interpretedQuery = await extractSearchParameters(query);
        } catch (error) {
            console.error('Nova AI Extraction Failed, falling back to basic search:', error);
            interpretedQuery = { keywords: query.split(' ') };
        }

        const { lat, lng } = userLocation;

        // Build search conditions
        const searchTerms: RegExp[] = [];
        if (interpretedQuery.service) searchTerms.push(new RegExp(interpretedQuery.service, 'i'));
        if (interpretedQuery.category) searchTerms.push(new RegExp(interpretedQuery.category, 'i'));
        if (Array.isArray(interpretedQuery.keywords)) {
            interpretedQuery.keywords.forEach((k: string) => {
                if (k.length > 2) searchTerms.push(new RegExp(k, 'i')); // avoid very short generic keywords
            });
        }

        // We will optionally try to find matching category ObjectIds if category is found
        let categoryIds: any[] = [];
        if (interpretedQuery.category) {
            const categories = await Category.find({ name: new RegExp(interpretedQuery.category, 'i') });
            categoryIds = categories.map(c => c._id);
        }

        const matchQuery: any = {
            status: 'approved',
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [lng, lat],
                    },
                    $maxDistance: 5000,
                },
            },
        };

        if (searchTerms.length > 0 || categoryIds.length > 0) {
            const orConditions: any[] = [];
            if (searchTerms.length > 0) {
                // MongoDB allows regex array in $in directly 
                orConditions.push({ serviceTitle: { $in: searchTerms } });
                orConditions.push({ description: { $in: searchTerms } });
            }
            if (categoryIds.length > 0) {
                orConditions.push({ category: { $in: categoryIds } });
            }
            matchQuery.$or = orConditions;
        }

        // Execute MongoDB query
        const results = await Service.find(matchQuery)
            .populate('category', 'name slug')
            .limit(20)
            .lean(); // Faster reads

        res.status(200).json({
            success: true,
            interpretedQuery,
            results,
        });

    } catch (error: any) {
        console.error('AI Search Error:', error);
        res.status(500).json({ success: false, message: 'Server error during AI search', error: error.message });
    }
};
