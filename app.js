const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./database/db');  // Database connection
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { errorHandler } = require('./middlewares/errorHandler');
const responseMiddleware = require('./middlewares/responseMiddleware'); // Response middleware

// Importing routes
const authRecruiterRoutes = require('./routes/recruiter/auth_recruiter_routes');
const authUserRoutes = require('./routes/user/auth_user_routes');
const recruiterProfileRoutes = require('./routes/recruiter/recruiter_profile_routes');
const userProfileRoutes = require('./routes/user/user_profile_routes');
const userJobRoutes = require('./routes/user/user_job_routes');
const recruiterJobRoutes = require('./routes/recruiter/recruiter_job_routes');

dotenv.config();

// Ensure required environment variables are set
if (!process.env.MONGO_URI) {
    console.error('ERROR: Missing MONGO_URI in environment variables');
    process.exit(1); // Exit if necessary environment variables are missing
}

const app = express();

// Middleware
app.use(cors());                      // Enable Cross-Origin Resource Sharing
app.use(helmet());                    // Secure HTTP headers
app.use(express.json());              // Body parsing middleware
app.use(morgan('dev'));               // HTTP request logger for development
app.use(responseMiddleware);          // Response middleware for consistent responses

// Connect to the database
connectDB();

// Routes
app.use('/api/auth/recruiter', authRecruiterRoutes);       // Recruiter Authentication APIs
app.use('/api/auth/user', authUserRoutes);                 // User Authentication APIs
app.use('/api/recruiter/profile', recruiterProfileRoutes); // Recruiter Profile APIs
app.use('/api/user/profile', userProfileRoutes);           // User Profile APIs
app.use('/api/user/jobs', userJobRoutes);                  // User Job APIs
app.use('/api/recruiter/jobs', recruiterJobRoutes);        // Recruiter Job APIs

// Handle Undefined Routes
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

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
