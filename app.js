import express from 'express';
import dotenv from 'dotenv';
import connectDB from './database/db.js';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middlewares/errorHandler.js';

dotenv.config();

// Ensure required environment variables are set
if (!process.env.MONGO_URI) {
    console.error('ERROR: Missing MONGO_URI in environment variables');
    process.exit(1); // Exit the application if the necessary variables are missing
}

const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(helmet()); // Secure HTTP headers
app.use(express.json()); // Body parsing middleware
app.use(morgan('dev')); // HTTP request logger for development

// Connect to the database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/jobs', jobRoutes);

// Centralized Error Handling Middleware
app.use(errorHandler);

// Handle Undefined Routes
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

// Server initialization
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown handling
process.on('SIGINT', () => {
    console.log('Gracefully shutting down...');
    process.exit(0); // Exit gracefully on termination
});
