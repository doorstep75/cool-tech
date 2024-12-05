// backend/models/Credential.js
import mongoose from 'mongoose';

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
      ref: 'Division',
      required: [true, 'Division reference is required'],
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

export default mongoose.model('Credential', credentialSchema);