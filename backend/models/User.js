import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters long'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    role: {
      type: String,
      enum: ['normal', 'management', 'admin'],
      default: 'normal',
      required: [true, 'User role is required'],
    },
    divisions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Division',
      },
    ],
    ous: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrganisationalUnit',
      },
    ],
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

export default mongoose.model('User', userSchema);