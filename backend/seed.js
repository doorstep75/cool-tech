// needed to prepopulate the database collection so I can test

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

import User from './models/User.js';
import OrganisationalUnit from './models/OrganisationalUnit.js';
import Division from './models/Division.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((error) => console.log(error.message));

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Division.deleteMany({});
    await OrganisationalUnit.deleteMany({});

    // Create Organisational Units
    const ous = await OrganisationalUnit.insertMany([
      { name: 'News management' },
      { name: 'Software reviews' },
      { name: 'Hardware reviews' },
      { name: 'Opinion publishing' },
    ]);

    // Create Divisions for each OU
    const divisions = [];
    for (const ou of ous) {
      for (let i = 1; i <= 3; i++) {
        const division = new Division({
          name: `${ou.name} Division ${i}`,
          ou: ou._id,
        });
        await division.save();
        divisions.push(division);
        ou.divisions.push(division._id);
      }
      await ou.save();
    }

    // Create Users with different roles
    const users = await User.insertMany([
      {
        username: 'normaluser',
        password: await bcrypt.hash('normalpass', 12),
        role: 'normal',
      },
      {
        username: 'managementuser',
        password: await bcrypt.hash('managementpass', 12),
        role: 'management',
      },
      {
        username: 'adminuser',
        password: await bcrypt.hash('adminpass', 12),
        role: 'admin',
      },
    ]);

    // Assign users to divisions and OUs
    const [normalUser, managementUser, adminUser] = users;

    normalUser.divisions.push(divisions[0]._id);
    normalUser.ous.push(divisions[0].ou);

    managementUser.divisions.push(divisions[1]._id);
    managementUser.ous.push(divisions[1].ou);

    adminUser.divisions.push(divisions[2]._id);
    adminUser.ous.push(divisions[2].ou);

    await normalUser.save();
    await managementUser.save();
    await adminUser.save();

    console.log('Database seeded successfully');
    mongoose.connection.close();
  } catch (error) {
    console.error(error);
    mongoose.connection.close();
  }
};

seedDatabase();