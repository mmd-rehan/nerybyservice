import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from '../config/db';
import Service from '../models/Service';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const verify = async () => {
    try {
        await connectDB();
        const count = await Service.countDocuments();
        console.log(`Total Services: ${count}`);

        const sample = await Service.findOne().sort({ createdAt: -1 });
        console.log('Latest Service Sample:', JSON.stringify(sample, null, 2));
    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

verify();
