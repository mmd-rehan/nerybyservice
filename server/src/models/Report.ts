import mongoose, { Document, Schema } from 'mongoose';
import { z } from 'zod';
const ReportReasons = [
    'Spam',
    'Fake Service',
    'Incorrect Information',
    'Offensive Content',
    'Scam / Fraud',
    'Other',
] as const;

export const ReportSchemaZod = z.object({
    serviceId: z.string().min(1, 'Service ID is required'),
    userId: z.string().optional(),
    reason: z.enum(ReportReasons, { message: 'Reason is required' }),
    comment: z.string({ message: 'Comment is required' }).refine((val) => val.trim().split(/\s+/).length >= 3, {
        message: 'Comment must be at least 3 words',
    }),
    reportedAt: z.string().optional(),
});

export type ReportInput = z.infer<typeof ReportSchemaZod>;

// --- Mongoose Interface ---
export interface IReport extends Document {
    serviceId: mongoose.Types.ObjectId;
    userId?: mongoose.Types.ObjectId;
    reason: string;
    comment: string;
    status: 'pending' | 'reviewed' | 'resolved';
}

const ReportSchema = new Schema<IReport>(
    {
        serviceId: {
            type: Schema.Types.ObjectId,
            ref: 'Service',
            required: true,
            index: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        reason: {
            type: String,
            required: true,
            enum: ReportReasons,
        },
        comment: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'reviewed', 'resolved'],
            default: 'pending',
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IReport>('Report', ReportSchema);
