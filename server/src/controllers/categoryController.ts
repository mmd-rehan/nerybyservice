import { Request, Response } from 'express';
import Category, { CategorySchemaZod } from '../models/Category';

// Create a new category
export const createCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const validation = CategorySchemaZod.safeParse(req.body);

        if (!validation.success) {
            res.status(400).json({ message: 'Invalid input', errors: validation.error.issues });

            return;
        }

        const { name } = validation.data;

        // Check if category already exists
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            res.status(400).json({ message: 'Category already exists' });
            return;
        }

        const newCategory = new Category({ name });
        await newCategory.save();

        res.status(201).json(newCategory);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all categories
export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.status(200).json(categories);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
