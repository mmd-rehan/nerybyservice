import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Service from '../src/models/Service';
import Category from '../src/models/Category';
import { connectDB } from '../src/config/db';

dotenv.config();

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await Service.deleteMany({});
        await Category.deleteMany({});
        console.log('Data cleared.');

        // Create Categories
        const categories = await Category.insertMany([
            { name: 'Plumber', slug: 'plumber' },
            { name: 'Electrician', slug: 'electrician' },
            { name: 'Carpenter', slug: 'carpenter' },
            { name: 'Painter', slug: 'painter' },
            { name: 'Mechanic', slug: 'mechanic' },
            { name: 'AC Repair', slug: 'ac-repair' },
            { name: 'Cleaning', slug: 'cleaning' },
            { name: 'Salon', slug: 'salon' },
            { name: 'Tutor', slug: 'tutor' },
            { name: 'Delivery', slug: 'delivery' },
            { name: 'Laundry', slug: 'laundry' },
            { name: 'Photography', slug: 'photography' },
            { name: 'Handyman', slug: 'handyman' },
            { name: 'Pest Control', slug: 'pest-control' },
            { name: 'Painting', slug: 'painting' }
        ]);
        console.log('Categories seeded.');

        const categoryMap = categories.reduce((acc, cat) => {
            acc[cat.name] = cat._id;
            return acc;
        }, {} as Record<string, any>);

        // Dubai, UAE Coordinates
        const centerLng = 55.2708;
        const centerLat = 25.2048;

        const services = [
            {
                phoneNumber: '+971501112221',
                serviceTitle: 'Dubai Sparkling Laundry',
                category: categoryMap['Laundry'],
                location: { type: 'Point', coordinates: [55.2708, 25.2048] },
                radius: 5000,
                description: 'Premium laundry and dry cleaning services with free pickup and delivery across Dubai.',
                contactDetails: { phone: '+971501112221', whatsapp: '+971501112221' },
                language: 'English',
            },
            {
                phoneNumber: '+971502223332',
                serviceTitle: 'Fresh & Clean Laundry',
                category: categoryMap['Laundry'],
                location: { type: 'Point', coordinates: [55.2962, 25.2632] },
                radius: 3000,
                description: 'Express laundry services in Bur Dubai. Quality care for your clothes.',
                contactDetails: { phone: '+971502223332', whatsapp: '+971502223332' },
                language: 'English/Arabic',
            },
            {
                phoneNumber: '+971503334443',
                serviceTitle: 'Elite Plumbers Dubai',
                category: categoryMap['Plumber'],
                location: { type: 'Point', coordinates: [55.2797, 25.1972] },
                radius: 7000,
                description: '24/7 emergency plumbing services. Leak detection and pipe repairs.',
                contactDetails: { phone: '+971503334443', whatsapp: '+971503334443' },
                language: 'English/Urdu',
            },
            {
                phoneNumber: '+971504445554',
                serviceTitle: 'Master Pipe Fixers',
                category: categoryMap['Plumber'],
                location: { type: 'Point', coordinates: [55.3128, 25.2341] },
                radius: 5000,
                description: 'Professional plumbing solutions for home and office. Certified technicians.',
                contactDetails: { phone: '+971504445554' },
                language: 'English',
            },
            {
                phoneNumber: '+971505556665',
                serviceTitle: 'Safe Spark Electricians',
                category: categoryMap['Electrician'],
                location: { type: 'Point', coordinates: [55.2512, 25.1234] },
                radius: 6000,
                description: 'Complete electrical maintenance and installation. Fast response time.',
                contactDetails: { phone: '+971505556665', whatsapp: '+971505556665' },
                language: 'English/Hindi',
            },
            {
                phoneNumber: '+971506667776',
                serviceTitle: 'Power Grid Electricals',
                category: categoryMap['Electrician'],
                location: { type: 'Point', coordinates: [55.3345, 25.2890] },
                radius: 4000,
                description: 'Expert electrical repairs and wiring. Resident electrician available.',
                contactDetails: { phone: '+971506667776' },
                language: 'English',
            },
            {
                phoneNumber: '+971507778887',
                serviceTitle: 'Spotless Home Cleaning',
                category: categoryMap['Cleaning'],
                location: { type: 'Point', coordinates: [55.2812, 25.1892] },
                radius: 8000,
                description: 'Professional deep cleaning and maid services. Hourly and monthly rates.',
                contactDetails: { phone: '+971507778887', whatsapp: '+971507778887' },
                language: 'English',
            },
            {
                phoneNumber: '+971508889998',
                serviceTitle: 'Shiny Dubai Cleaners',
                category: categoryMap['Cleaning'],
                location: { type: 'Point', coordinates: [55.3678, 25.2456] },
                radius: 5000,
                description: 'Reliable house cleaning and office sanitization. Eco-friendly products.',
                contactDetails: { phone: '+971508889998', whatsapp: '+971508889998' },
                language: 'English',
            },
            {
                phoneNumber: '+971509990009',
                serviceTitle: 'Arctic AC Solutions',
                category: categoryMap['AC Repair'],
                location: { type: 'Point', coordinates: [55.2234, 25.1122] },
                radius: 10000,
                description: 'Expert AC repair and maintenance. Keep your home cool this summer.',
                contactDetails: { phone: '+971509990009', whatsapp: '+971509990009' },
                language: 'English/Arabic',
            },
            {
                phoneNumber: '+971501113331',
                serviceTitle: 'Cool Breeze AC Services',
                category: categoryMap['AC Repair'],
                location: { type: 'Point', coordinates: [55.2912, 25.2512] },
                radius: 5000,
                description: 'Complete AC servicing and gas refilling. Same-day repair available.',
                contactDetails: { phone: '+971501113331' },
                language: 'English',
            },
            {
                phoneNumber: '+971502224442',
                serviceTitle: 'Top Gear Car Repair',
                category: categoryMap['Mechanic'],
                location: { type: 'Point', coordinates: [55.2341, 25.1423] },
                radius: 7000,
                description: 'Full engine diagnostic and car repair service in Al Quoz.',
                contactDetails: { phone: '+971502224442', whatsapp: '+971502224442' },
                language: 'English/Hindi',
            },
            {
                phoneNumber: '+971503335553',
                serviceTitle: 'Quick Fix Garage',
                category: categoryMap['Mechanic'],
                location: { type: 'Point', coordinates: [55.3212, 25.2678] },
                radius: 5000,
                description: 'Reliable car maintenance and tire services. Mobile mechanic available.',
                contactDetails: { phone: '+971503335553' },
                language: 'English',
            },
            {
                phoneNumber: '+971504446664',
                serviceTitle: 'Glow Beauty Salon',
                category: categoryMap['Salon'],
                location: { type: 'Point', coordinates: [55.2678, 25.2123] },
                radius: 4000,
                description: 'Premium hair and skin care services for women. Home service available.',
                contactDetails: { phone: '+971504446664', whatsapp: '+971504446664' },
                language: 'English/Urdu',
            },
            {
                phoneNumber: '+971505557775',
                serviceTitle: 'Mirage Men\'s Salon',
                category: categoryMap['Salon'],
                location: { type: 'Point', coordinates: [55.3012, 25.2789] },
                radius: 3000,
                description: 'Professional grooming and haircuts for men. Top-rated barbers.',
                contactDetails: { phone: '+971505557775' },
                language: 'English',
            },
            {
                phoneNumber: '+971506668886',
                serviceTitle: 'Dubai Handyman Pros',
                category: categoryMap['Handyman'],
                location: { type: 'Point', coordinates: [55.2456, 25.1345] },
                radius: 6000,
                description: 'General home repairs, furniture assembly, and mounting services.',
                contactDetails: { phone: '+971506668886', whatsapp: '+971506668886' },
                language: 'English',
            },
            {
                phoneNumber: '+971508880008',
                serviceTitle: 'No Bugs Pest Control',
                category: categoryMap['Pest Control'],
                location: { type: 'Point', coordinates: [55.2789, 25.1567] },
                radius: 10000,
                description: 'Effective pest control and termite treatment. Safe for families.',
                contactDetails: { phone: '+971508880008', whatsapp: '+971508880008' },
                language: 'English/Arabic',
            },
            {
                phoneNumber: '+971501114441',
                serviceTitle: 'Color Palette Painting',
                category: categoryMap['Painting'],
                location: { type: 'Point', coordinates: [55.2123, 25.1012] },
                radius: 7000,
                description: 'Interior and exterior painting services. High-quality finishes.',
                contactDetails: { phone: '+971501114441', whatsapp: '+971501114441' },
                language: 'English/Hindi',
            }
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