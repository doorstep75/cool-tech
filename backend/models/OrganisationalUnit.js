import mongoose from 'mongoose';

const organisationalUnitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Organisational Unit name is required'],
      unique: true,
      trim: true, // Automatically removes extra spaces
      minlength: [3, 'Name must be at least 3 characters long'],
    },
    divisions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Division',
      },
    ],
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

export default mongoose.model('OrganisationalUnit', organisationalUnitSchema);