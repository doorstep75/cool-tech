import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Credential from './models/Credential.js';
dotenv.config();

const deleteAllCredentials = async () => {
  try {
    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Delete all documents from the 'credentials' collection
    const result = await Credential.deleteMany({});
    console.log(`Deleted ${result.deletedCount} credentials.`);

    // Close the connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error deleting credentials:', error);
    process.exit(1);
  }
};

deleteAllCredentials();