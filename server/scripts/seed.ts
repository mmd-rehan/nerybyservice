import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Service from '../src/models/Service';
import { connectDB } from '../src/config/db';

dotenv.config();

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await Service.deleteMany({});
        console.log('Services cleared.');

        // Dummy Data
        // Center Point: (e.g., Downtown Los Angeles) -> [ -118.2437, 34.0522 ]
        const centerLng = -118.2437;
        const centerLat = 34.0522;

        const services = [
            {
                phoneNumber: '+15550101',
                serviceTitle: 'Downtown Plumber',
                category: 'Plumber',
                location: { type: 'Point', coordinates: [centerLng, centerLat] }, // Exact center
                radius: 5000,
                description: 'Expert plumbing services in downtown.',
                contactDetails: { phone: '+15550101', whatsapp: '+15550101' },
                language: 'English',
            },
            {
                phoneNumber: '+15550102',
                serviceTitle: 'Electrician Pro',
                category: 'Electrician',
                location: { type: 'Point', coordinates: [centerLng + 0.01, centerLat + 0.01] }, // Slightly NE
                radius: 10000,
                description: 'Residential and commercial electrical work.',
                contactDetails: { phone: '+15550102', whatsapp: '+15550102' },
                language: 'Spanish',
            },
            {
                phoneNumber: '+15550103',
                serviceTitle: 'Emergency Pipe Fix',
                category: 'Plumber',
                location: { type: 'Point', coordinates: [centerLng - 0.02, centerLat - 0.02] }, // SW
                radius: 8000,
                description: '24/7 emergency pipe repair.',
                contactDetails: { phone: '+15550103', whatsapp: '+15550103' },
                language: 'English',
            },
            {
                phoneNumber: '+15550104',
                serviceTitle: 'City Electric',
                category: 'Electrician',
                location: { type: 'Point', coordinates: [centerLng + 0.05, centerLat] }, // East, further out
                radius: 12000,
                description: 'Licensed electricians for the whole city.',
                contactDetails: { phone: '+15550104', whatsapp: '+15550104' },
                language: 'English',
            },
            {
                phoneNumber: '+15550105',
                serviceTitle: 'Local Handyman & Plumber',
                category: 'Plumber',
                location: { type: 'Point', coordinates: [centerLng, centerLat + 0.03] }, // North
                radius: 3000,
                description: 'Versatile handyman for small plumbing jobs.',
                contactDetails: { phone: '+15550105', whatsapp: '+15550105' },
                language: 'English',
            },
        ];

        await Service.insertMany(services);
        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error}`);
        process.exit(1);
    }
};

seedData();
