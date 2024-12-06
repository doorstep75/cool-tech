// Import dependencies.
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet'; // For security headers.
import morgan from 'morgan'; // For request logging.

// Import route modules.
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import userRoutes from './routes/user.js';
import credentialRoutes from './routes/credentials.js';

// Load environment variables.
dotenv.config();

// Ensure required environment variables are set.
if (!process.env.MONGODB_URI) {
  console.error('Error: MONGODB_URI not defined in .env file');
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.error('Error: JWT_SECRET not defined in .env file');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Apply middleware.
app.use(helmet()); // Secure HTTP headers.
app.use(cors()); // Enable cross-origin requests.
app.use(express.json()); // Parse JSON bodies.
app.use(morgan('dev')); // Log HTTP requests.

// Register routes.
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/credentials', credentialRoutes);
app.use('/api/user', userRoutes);

// Debug log for route registration.
console.log('Routes registered: /api/auth, /api/admin, /api/credentials, /api/user');

// Connect to MongoDB.
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  });

// Graceful shutdown.
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});

// Global error handler.
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error.
  res.status(500).json({ message: 'Internal Server Error' });
});