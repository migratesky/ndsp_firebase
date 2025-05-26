import { School } from './models/School';
import { StateGraduationRequirement } from './models/StateGraduationRequirement';
import { Resource } from './models/Resource';
import { Announcement } from './models/Announcement';
import { ContactRegion } from './models/ContactRegion';
import { mockSchools } from './data/mockData';
import { mockStateRequirements } from './data/mockData';
import { mockResources } from './data/mockData';
import { mockAnnouncements } from './data/mockData';
import { mockContactRegions } from './data/mockData';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://chaitanyapinnaka:GwjSKlkyrDsBMsLw@cluster0.tp0kf5a.mongodb.net/interactivemap?retryWrites=true&w=majority&appName=Cluster0';

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding');

    // Clear existing data
    await School.deleteMany({});
    await StateGraduationRequirement.deleteMany({});
    await Resource.deleteMany({});
    await Announcement.deleteMany({});
    await ContactRegion.deleteMany({});

    // Process schools to ensure required fields
    const processedSchools = mockSchools.map(school => ({
      ...school,
      lat: school.lat || 0, // Default to 0 if missing
      lng: school.lng || 0  // Default to 0 if missing
    }));

    // Insert mock data
    await School.insertMany(processedSchools);
    await StateGraduationRequirement.insertMany(mockStateRequirements);
    await Resource.insertMany(mockResources);
    await Announcement.insertMany(mockAnnouncements);
    await ContactRegion.insertMany(mockContactRegions);

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedDatabase();
