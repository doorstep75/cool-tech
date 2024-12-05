import mongoose from 'mongoose';

const divisionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Division name is required'],
      trim: true, // Removes extra spaces
      minlength: [3, 'Division name must be at least 3 characters long'],
    },
    ou: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OrganisationalUnit',
      required: [true, 'Organisational Unit reference is required'],
    },
    credentialRepository: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Credential',
      },
    ],
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

export default mongoose.model('Division', divisionSchema);