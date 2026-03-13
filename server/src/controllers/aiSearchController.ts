import { Request, Response } from 'express';
import { extractSearchParameters } from '../services/novaTextService';
import { analyzeImage } from '../services/novaImageService';
import { transcribeAudio } from '../services/novaVoiceService';
import Service from '../models/Service';
import Category from '../models/Category';

export const handleAiSearch = async (req: Request, res: Response): Promise<void> => {
    try {
        let { query, userLocation } = req.body;

        // In multipart/form-data, objects are often sent as strings
        if (typeof userLocation === 'string') {
            try {
                userLocation = JSON.parse(userLocation);
            } catch (e) {
                console.error("Failed to parse userLocation string");
            }
        }

        if (!userLocation || !userLocation.lat || !userLocation.lng) {
            res.status(400).json({ success: false, message: 'userLocation (lat, lng) is required' });
            return;
        }

        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
        let finalQueryText = query || "";

        try {
            if (files?.image && files.image[0]) {
                const imageFile = files.image[0];
                console.log(`Processing image upload (${imageFile.mimetype})`);
                finalQueryText = await analyzeImage(imageFile.buffer, imageFile.mimetype);
            } else if (files?.audio && files.audio[0]) {
                const audioFile = files.audio[0];
                console.log(`Processing audio upload (${audioFile.mimetype})`);
                finalQueryText = await transcribeAudio(audioFile.buffer, audioFile.mimetype);
            }
        } catch (error) {
            console.error("Multimodal AI Extraction Failed:", error);
            // Fallback: use query if provided, else return error
            if (!finalQueryText) {
                res.status(500).json({ success: false, message: 'Failed to process audio/image and no text query provided.' });
                return;
            }
        }

        if (!finalQueryText) {
            res.status(400).json({ success: false, message: 'Missing text query, audio, or image input.' });
            return;
        }

        let interpretedQuery: any = {};
        
        try {
            interpretedQuery = await extractSearchParameters(finalQueryText);
        } catch (error) {
            console.error('Nova Text AI Extraction Failed, falling back to basic search:', error);
            interpretedQuery = { keywords: finalQueryText.split(' ') };
        }

        // Add original text if it was derived from multimodal
        if (files?.image?.[0] || files?.audio?.[0]) {
            interpretedQuery.originalExtractedText = finalQueryText;
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
