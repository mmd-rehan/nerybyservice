import mongoose, { Document, Schema } from 'mongoose';
import { z } from 'zod';

// --- Zod Schema for Validation ---
export const CategorySchemaZod = z.object({
    name: z.string().min(1, 'Category name is required'),
    slug: z.string().optional(),
});

export type CategoryInput = z.infer<typeof CategorySchemaZod>;

// --- Mongoose Interface ---
export interface ICategory extends Document {
    name: string;
    slug: string;
}

// --- Mongoose Schema ---
const CategorySchema = new Schema<ICategory>(
    {
        name: { type: String, required: true, unique: true, trim: true },
        slug: { type: String, unique: true, lowercase: true },
    },
    {
        timestamps: true,
    }
);

// Pre-save hook to generate slug from name
CategorySchema.pre('save', function (next) {
    if (this.isModified('name')) {
        this.slug = this.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }
    next();
});

export default mongoose.model<ICategory>('Category', CategorySchema);
