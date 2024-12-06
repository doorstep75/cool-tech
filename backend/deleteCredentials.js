import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Credential from './models/Credential.js';

// Load environment variables
dotenv.config();

/**
 * Deletes all documents from the 'credentials' collection in MongoDB
 */
const deleteAllCredentials = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Remove all credentials
    const result = await Credential.deleteMany({});
    console.log(`Deleted ${result.deletedCount} credentials.`);

    // Close the database connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error deleting credentials:', error);
    process.exit(1); // Exit with failure
  }
};

// Execute the deletion script
deleteAllCredentials();