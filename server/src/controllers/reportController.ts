import { Request, Response } from 'express';
import { z } from 'zod';
import Report, { ReportSchemaZod } from '../models/Report';
import Service from '../models/Service';
import mongoose from 'mongoose';

export const createReport = async (req: Request, res: Response) => {
    try {
        // Validate request body
        const validatedData = ReportSchemaZod.parse(req.body);

        // Verify serviceId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(validatedData.serviceId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid service ID format',
            });
        }

        // Verify the service exists
        const serviceExists = await Service.findById(validatedData.serviceId);
        if (!serviceExists) {
            return res.status(404).json({
                success: false,
                message: 'Service not found',
            });
        }

        // Create report
        const report = await Report.create({
            serviceId: validatedData.serviceId,
            userId: validatedData.userId || undefined,
            reason: validatedData.reason,
            comment: validatedData.comment || undefined,
            status: 'pending',
        });

        res.status(201).json({
            success: true,
            message: 'Report submitted successfully',
            data: report,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                success: false,
                errors: error.issues,
            });
        }
        console.error('Error creating report:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit report',
        });
    }
};
