import mongoose from 'mongoose';

// Define schema for divisions.
const divisionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Division name is required'], // Ensure name is provided.
      trim: true, // Remove leading/trailing spaces.
      minlength: [3, 'Division name must be at least 3 characters long'], // Enforce minimum length.
    },
    ou: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OrganisationalUnit', // Reference to Organisational Unit.
      required: [true, 'Organisational Unit reference is required'], // Ensure OU is linked.
    },
    credentialRepository: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Credential', // Reference to associated credentials.
      },
    ],
  },
  {
    timestamps: true, // Add `createdAt` and `updatedAt` fields automatically.
  }
);

// Export the Division model.
export default mongoose.model('Division', divisionSchema);