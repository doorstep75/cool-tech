import mongoose from 'mongoose';
import OrganisationalUnit from './models/OrganisationalUnit.js';
import User from './models/User.js';
import Division from './models/Division.js';
import Credential from './models/Credential.js';

import dotenv from 'dotenv';
dotenv.config();

// Load MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Run diagnostics to inspect database collections and relationships.
 */
async function runDiagnostics() {
  try {
    // Connect to the MongoDB database
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Fetch and log all users
    const users = await User.find({});
    console.log('All Users:', users);

    // Fetch and log all organisational units
    const ous = await OrganisationalUnit.find({});
    console.log('All Organisational Units:', ous);

    // Fetch and log all divisions
    const divisions = await Division.find({});
    console.log('All Divisions:', divisions);

    // Fetch and log all credentials
    const credentials = await Credential.find({});
    console.log('All Credentials:', credentials);

    // Example: Inspect a specific user's assigned OUs and divisions
    const userId = '674f1fe1df3c74ccf93b0e0a'; // Replace with the user ID to inspect
    const user = await User.findById(userId).populate('ous').populate('divisions');
    console.log(`User ${user.username}'s OUs:`, user.ous);
    console.log(`User ${user.username}'s Divisions:`, user.divisions);

    // Example: Inspect divisions linked to a specific OU
    const ouId = '674f1fe0df3c74ccf93b0de7'; // Replace with the OU ID to inspect
    const organisationalUnit = await OrganisationalUnit.findById(ouId).populate('divisions');
    console.log(`OU ${organisationalUnit.name}'s Divisions:`, organisationalUnit.divisions);
  } catch (error) {
    console.error('Error during diagnostics:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
    console.log('Connection closed');
  }
}

/**
 * Test and log the organisational units linked to a specific user.
 */
const testUserOUs = async () => {
  try {
    // Fetch user by username
    const user = await User.findOne({ username: 'normaluser' }); // Replace with an actual username
    console.log('Testing OUs for User:', user);

    // Fetch directly assigned OUs
    const directlyAssignedOUs = user.ous?.length
      ? await OrganisationalUnit.find({ _id: { $in: user.ous } })
      : [];
    console.log('Directly Assigned OUs:', directlyAssignedOUs);

    // Fetch divisions assigned to the user
    const divisions = await Division.find({ _id: { $in: user.divisions } });
    console.log('User Divisions:', divisions);

    // Extract OU IDs from the user's divisions
    const ouIdsFromDivisions = [...new Set(divisions.map((division) => division.ou.toString()))];
    console.log('OU IDs from Divisions:', ouIdsFromDivisions);

    // Fetch OUs linked to the divisions
    const ousFromDivisions = await OrganisationalUnit.find({ _id: { $in: ouIdsFromDivisions } });
    console.log('Division-Linked OUs:', ousFromDivisions);

    // Combine all OUs and remove duplicates
    const allOUs = [...directlyAssignedOUs, ...ousFromDivisions];
    const uniqueOUs = allOUs.filter(
      (ou, index, self) => self.findIndex((o) => o._id.toString() === ou._id.toString()) === index
    );

    console.log('Final OUs:', uniqueOUs);
  } catch (err) {
    console.error('Error testing user OUs:', err);
  }
};

// Execute functions
testUserOUs();
runDiagnostics();