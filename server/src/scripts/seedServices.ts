import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from '../config/db';
import Service from '../models/Service';
import Category from '../models/Category';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const TARGET_COORDS = [55.371808379889515, 25.302203831745345]; // [lon, lat]
const NUM_RECORDS = 1000; // increase safely
const BATCH_SIZE = 500;

const SERVICES_TITLES = [
  "AC Repair Professional",
  "Plumbing Expert",
  "Home Cleaning Service",
  "Electrician on Call",
  "Car Wash at Home",
  "Gardening Service",
  "Pest Control",
  "Painting Services",
  "Carpenter Helper",
  "Appliance Repair"
];

const DESCRIPTIONS = [
  "Professional service with 5 years experience.",
  "Quick and reliable service at your doorstep.",
  "Certified experts available 24/7.",
  "Best in town for affordable rates.",
  "Satisfaction guaranteed or money back."
];

// Generate random coords within ~5km
const getRandomLocation = (center: number[]) => {
  const r = 0.05;
  const lon = center[0] + (Math.random() - 0.5) * r;
  const lat = center[1] + (Math.random() - 0.5) * r;

  return {
    type: 'Point' as const,
    coordinates: [lon, lat]
  };
};

const getRandomPhone = () =>
  `+9715${Math.floor(0 + Math.random() * 9)}${Math.floor(
    1000000 + Math.random() * 9000000
  )}`;

const seed = async () => {
  try {
    await connectDB();
    console.log('Connected to DB');

    // Optional: clear previous seeded services
    await Service.deleteMany({ status: 'approved' });
    console.log('Old approved services cleared');

    // Ensure category exists
    let category = await Category.findOne({ name: 'General Services' });

    if (!category) {
      category = await Category.create({ name: 'General Services' });
      console.log('Created General Services category');
    }

    let inserted = 0;

    while (inserted < NUM_RECORDS) {
      const batch = [];

      for (
        let i = 0;
        i < BATCH_SIZE && inserted + i < NUM_RECORDS;
        i++
      ) {
        const title =
          SERVICES_TITLES[
          Math.floor(Math.random() * SERVICES_TITLES.length)
          ];

        const desc =
          DESCRIPTIONS[
          Math.floor(Math.random() * DESCRIPTIONS.length)
          ];

        const uniqueSuffix = Date.now() + Math.floor(Math.random() * 10000);

        batch.push({
          phoneNumber: getRandomPhone(),
          serviceTitle: `${title} #${uniqueSuffix}`,
          category: category!._id,
          location: getRandomLocation(TARGET_COORDS),
          radius: 5000,
          description: desc,
          status: 'approved',
          contactDetails: {
            phone: getRandomPhone(),
            whatsapp: getRandomPhone()
          },
          language: Math.random() > 0.5 ? 'English' : 'Arabic',
          createdAt: new Date(
            Date.now() - Math.floor(Math.random() * 1000000000)
          )
        });
      }

      await Service.insertMany(batch, { ordered: false });
      inserted += batch.length;

      console.log(`Inserted ${inserted}/${NUM_RECORDS}`);
    }

    console.log(
      `Successfully added ${NUM_RECORDS} mock services near [${TARGET_COORDS.join(
        ', '
      )}]`
    );
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seed();
