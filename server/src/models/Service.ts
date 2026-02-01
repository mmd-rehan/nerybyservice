import mongoose, { Document, Schema } from 'mongoose';
import { z } from 'zod';

// --- Zod Schema for Validation ---
export const ContactDetailsSchema = z.object({
    phone: z.string(),
    whatsapp: z.string(),
});

export const ServiceSchemaZod = z.object({
    phoneNumber: z.string(),
    serviceTitle: z.string(),
    category: z.string(),
    location: z.object({
        type: z.literal('Point'),
        coordinates: z.tuple([z.number(), z.number()]), // [lon, lat]
    }),
    radius: z.number().optional().default(100), // in meters
    description: z.string(),
    status: z.enum(['pending', 'approved']).default('approved'),
    contactDetails: ContactDetailsSchema,
    language: z.string(),
});

export type ServiceInput = z.infer<typeof ServiceSchemaZod>;

// --- Mongoose Interface ---
export interface IService extends Document {
    phoneNumber: string;
    serviceTitle: string;
    category: string;
    location: {
        type: 'Point';
        coordinates: number[];
    };
    radius: number;
    description: string;
    status: 'pending' | 'approved';
    contactDetails: {
        phone: string;
        whatsapp: string;
    };
    language: string;
}

// --- Mongoose Schema ---
const ServiceSchema = new Schema<IService>(
    {
        phoneNumber: { type: String, required: true, index: true },
        serviceTitle: { type: String, required: true }, // Text index added below
        category: { type: String, required: true, index: true },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                required: true,
            },
            coordinates: {
                type: [Number],
                required: true,
            },
        },
        radius: { type: Number, required: true, default: 100 },
        description: { type: String, required: true },
        status: {
            type: String,
            enum: ['pending', 'approved'],
            default: 'approved',
        },
        contactDetails: {
            phone: { type: String, required: true },
            whatsapp: { type: String, required: true },
        },
        language: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

// Indexes
// 2dsphere index for geospatial queries on 'location'
ServiceSchema.index({ location: '2dsphere' });
// Text index for search on 'serviceTitle'
ServiceSchema.index({ serviceTitle: 'text' });

export default mongoose.model<IService>('Service', ServiceSchema);
