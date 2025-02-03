const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./database/db');  // Assuming db.js is in the database folder
const userRoutes = require('./routes/userRoutes');  // User routes
const profileRoutes = require('./routes/profileRoutes');  // Profile routes
const jobRoutes = require('./routes/jobRoutes');  // Job routes
const recruiterRoutes = require('./routes/recruiterRoutes');  // Recruiter routes
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { errorHandler } = require('./middlewares/errorHandler');
const responseMiddleware = require('./middlewares/responseMiddleware'); // Response middleware

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

// Use the response middleware to optimize API responses
app.use(responseMiddleware); // This middleware will now handle response structuring

// Connect to the database
connectDB();

// Routes for different APIs
app.use('/api/user', userRoutes);  // User-specific APIs
app.use('/api/profile', profileRoutes);  // Profile APIs
app.use('/api/jobs', jobRoutes);  // Job-related APIs
app.use('/api/recruiter', recruiterRoutes);  // Recruiter APIs

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
