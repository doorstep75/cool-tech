import mongoose from 'mongoose';
import OrganisationalUnit from './models/OrganisationalUnit.js';
import User from './models/User.js';
import Division from './models/Division.js';
import Credential from './models/Credential.js';

import dotenv from 'dotenv';
dotenv.config();

// Load the MongoDB URI from the environment variable
const MONGODB_URI = process.env.MONGODB_URI;

async function runDiagnostics() {
  try {
    // Connect to the database
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Fetch all users for inspection
    const users = await User.find({});
    console.log('All Users:', users);

    // Fetch all organisational units for inspection
    const ous = await OrganisationalUnit.find({});
    console.log('All Organisational Units:', ous);

    // Fetch all divisions for inspection
    const divisions = await Division.find({});
    console.log('All Divisions:', divisions);

    // Fetch all credentials for inspection
    const credentials = await Credential.find({});
    console.log('All Credentials:', credentials);

    // Example: Check a specific user's OUs
    const userId = '674f1fe1df3c74ccf93b0e0a'; // Replace with the user ID you're inspecting
    const user = await User.findById(userId).populate('ous').populate('divisions');
    console.log(`User ${user.username}'s OUs:`, user.ous);
    console.log(`User ${user.username}'s Divisions:`, user.divisions);

    // Example: Check divisions linked to a specific OU
    const ouId = '674f1fe0df3c74ccf93b0de7'; // Replace with the OU ID you're inspecting
    const organisationalUnit = await OrganisationalUnit.findById(ouId).populate('divisions');
    console.log(`OU ${organisationalUnit.name}'s Divisions:`, organisationalUnit.divisions);
  } catch (error) {
    console.error('Error during diagnostics:', error);
  } finally {
    // Close the connection
    mongoose.connection.close();
    console.log('Connection closed');
  }
}

const testUserOUs = async () => {
  try {
    const user = await User.findOne({ username: 'normaluser' }); // Replace 'normaluser' with an existing username
    console.log('Testing OUs for User:', user);

    const directlyAssignedOUs = user.ous && user.ous.length > 0
      ? await OrganisationalUnit.find({ _id: { $in: user.ous } })
      : [];
    console.log('Directly Assigned OUs:', directlyAssignedOUs);

    const divisions = await Division.find({ _id: { $in: user.divisions } });
    console.log('User Divisions:', divisions);

    const ouIdsFromDivisions = [...new Set(divisions.map((division) => division.ou.toString()))];
    console.log('OU IDs from Divisions:', ouIdsFromDivisions);

    const ousFromDivisions = await OrganisationalUnit.find({ _id: { $in: ouIdsFromDivisions } });
    console.log('Division-Linked OUs:', ousFromDivisions);

    const allOUs = [...directlyAssignedOUs, ...ousFromDivisions];
    const uniqueOUs = allOUs.filter((ou, index) =>
      allOUs.findIndex(o => o._id.toString() === ou._id.toString()) === index
    );

    console.log('Final OUs:', uniqueOUs);
  } catch (err) {
    console.error('Error testing user OUs:', err);
  }
};

testUserOUs();

// Run the diagnostics
runDiagnostics();