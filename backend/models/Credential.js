import mongoose from 'mongoose';

// Schema for storing credentials
const credentialSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true, // Removes extra spaces
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    description: {
      type: String,
      trim: true, // Removes extra spaces
    },
    division: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Division', // Reference to Division model
      required: [true, 'Division reference is required'],
    },
  },
  {
    timestamps: true, // Adds `createdAt` and `updatedAt` fields
  }
);

export default mongoose.model('Credential', credentialSchema);