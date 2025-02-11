const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const connectDB = require('./database/db');  
const errorHandler = require('./middlewares/errorHandler');
const responseMiddleware = require('./middlewares/responseMiddleware');

// Load environment variables
dotenv.config();

// Validate required environment variables
if (!process.env.MONGO_URI) {
    console.error('❌ ERROR: Missing MONGO_URI in environment variables');
    process.exit(1);
}

// Initialize Express app
const app = express();

// Global Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

// Attach response middleware correctly
app.use(responseMiddleware);

// Connect to Database
connectDB();

// Routes
const routes = {
    recruiterAuth: require('./routes/recruiter/auth_recruiter_routes'),
    userAuth: require('./routes/user/auth_user_routes'),
    recruiterProfile: require('./routes/recruiter/recruiter_profile_routes'),
    userProfile: require('./routes/user/user_profile_routes'),
    userJobs: require('./routes/user/user_job_routes'),
    recruiterJobs: require('./routes/recruiter/recruiter_job_routes'),
    admin_auth_routes: require('./routes/admin/admin_auth_routes'),
 admin_dashboard_routes: require('./routes/admin/admin_dashboard_routes'),
 manage_recruiters_routes: require('./routes/admin/manage_recruiters_routes'),
 team_routes: require('./routes/admin/team_routes')
};

// Assign Routes
app.use('/api/auth/recruiter', routes.recruiterAuth);
app.use('/api/auth/user', routes.userAuth);
app.use('/api/recruiter/profile', routes.recruiterProfile);
app.use('/api/user/profile', routes.userProfile);
app.use('/api/user/jobs', routes.userJobs);
app.use('/api/recruiter/jobs', routes.recruiterJobs);
app.use('/api/admin/auth', routes.admin_auth_routes); // Admin Authentication APIs
app.use('/api/admin/dashboard', routes.admin_dashboard_routes); // Admin Dashboard APIs
app.use('/api/admin/recruiters', routes.manage_recruiters_routes); // Recruiter Management APIs
app.use('/api/admin/team', routes.team_routes); // Team Management APIs

// Handle Undefined Routes
app.use((req, res) => res.status(404).json({ status: 404, message: 'Route not found' }));

// Error Handling Middleware
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// Graceful Shutdown
process.on('SIGINT', () => {
    console.log('🔻 Gracefully shutting down...');
    process.exit(0);
});


