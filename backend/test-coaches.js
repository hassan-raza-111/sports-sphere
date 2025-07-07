import mongoose from 'mongoose';
import Coach from './models/Coach.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/sports-sphere';

async function createSampleCoaches() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const sampleCoaches = [
      {
        userId: new mongoose.Types.ObjectId(),
        name: 'Coach Sarah Williams',
        email: 'sarah.williams@example.com',
        phone: '+1-555-0123',
        sports: 'Tennis',
        sessionType: 'Individual',
        location: 'New York, NY',
        profileImage:
          'https://images.unsplash.com/photo-1547347298-4074fc3086f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        about:
          'Former professional tennis player with 5+ years coaching experience. Specializes in technique refinement and competitive strategy.',
        certifications: ['USPTA Certified', 'Tennis Performance Specialist'],
        specialties: ['Technique', 'Strategy', 'Competition'],
        rating: 4.8,
        reviewCount: 128,
        hourlyRate: 75,
        experience: 5,
        isAvailable: true,
        availability: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: false,
          sunday: false,
        },
      },
      {
        userId: new mongoose.Types.ObjectId(),
        name: 'Coach David Chen',
        email: 'david.chen@example.com',
        phone: '+1-555-0124',
        sports: 'Football',
        sessionType: 'Group',
        location: 'Los Angeles, CA',
        profileImage:
          'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        about:
          'NFL certified coach with 7 years experience developing athletes at all levels. Focuses on speed, agility, and game intelligence.',
        certifications: [
          'NFL Certified Coach',
          'Strength & Conditioning Specialist',
        ],
        specialties: ['Speed Training', 'Agility', 'Game Strategy'],
        rating: 5.0,
        reviewCount: 94,
        hourlyRate: 85,
        experience: 7,
        isAvailable: true,
        availability: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: false,
        },
      },
      {
        userId: new mongoose.Types.ObjectId(),
        name: 'Coach Jessica Lee',
        email: 'jessica.lee@example.com',
        phone: '+1-555-0125',
        sports: 'Swimming',
        sessionType: 'Individual',
        location: 'Miami, FL',
        profileImage:
          'https://images.unsplash.com/photo-1519861531473-9200262188bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80',
        about:
          'Former Olympic swimmer with 10+ years coaching experience. Specializes in stroke technique and endurance training.',
        certifications: ['US Swimming Coach', 'Olympic Coach Certification'],
        specialties: ['Stroke Technique', 'Endurance', 'Competition'],
        rating: 4.2,
        reviewCount: 76,
        hourlyRate: 65,
        experience: 10,
        isAvailable: true,
        availability: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        },
      },
      {
        userId: new mongoose.Types.ObjectId(),
        name: 'Coach Michael Rodriguez',
        email: 'michael.rodriguez@example.com',
        phone: '+1-555-0126',
        sports: 'Basketball',
        sessionType: 'Group',
        location: 'Chicago, IL',
        profileImage:
          'https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
        about:
          'Former college basketball player with 8 years coaching experience. Specializes in shooting mechanics and team dynamics.',
        certifications: ['NCAA Coach', 'Basketball Performance Specialist'],
        specialties: ['Shooting', 'Team Play', 'Defense'],
        rating: 4.6,
        reviewCount: 112,
        hourlyRate: 70,
        experience: 8,
        isAvailable: true,
        availability: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: false,
          sunday: false,
        },
      },
      {
        userId: new mongoose.Types.ObjectId(),
        name: 'Coach Emma Thompson',
        email: 'emma.thompson@example.com',
        phone: '+1-555-0127',
        sports: 'Athletics',
        sessionType: 'Individual',
        location: 'Austin, TX',
        profileImage:
          'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        about:
          'Former track and field athlete with 6 years coaching experience. Specializes in sprint training and conditioning.',
        certifications: ['USATF Coach', 'Track & Field Specialist'],
        specialties: ['Sprint Training', 'Conditioning', 'Technique'],
        rating: 4.9,
        reviewCount: 89,
        hourlyRate: 80,
        experience: 6,
        isAvailable: true,
        availability: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: false,
        },
      },
      {
        userId: new mongoose.Types.ObjectId(),
        name: 'Coach Alex Johnson',
        email: 'alex.johnson@example.com',
        phone: '+1-555-0128',
        sports: 'Boxing',
        sessionType: 'Individual',
        location: 'Las Vegas, NV',
        profileImage:
          'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2020&q=80',
        about:
          'Professional boxing trainer with 12 years experience. Specializes in technique, footwork, and conditioning.',
        certifications: ['Professional Boxing Trainer', 'Fitness Specialist'],
        specialties: ['Technique', 'Footwork', 'Conditioning'],
        rating: 4.7,
        reviewCount: 67,
        hourlyRate: 90,
        experience: 12,
        isAvailable: true,
        availability: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        },
      },
    ];

    // Clear existing coaches and insert sample data
    await Coach.deleteMany({});
    const createdCoaches = await Coach.insertMany(sampleCoaches);

    console.log(
      `✅ Successfully created ${createdCoaches.length} sample coaches`
    );
    console.log('Sample coaches created:');
    createdCoaches.forEach((coach) => {
      console.log(`- ${coach.name} (${coach.sports})`);
    });
  } catch (error) {
    console.error('❌ Error creating sample coaches:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
createSampleCoaches();
