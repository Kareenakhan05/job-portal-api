const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const connectDB = require('./database/db');
const errorHandler = require('./middlewares/errorHandler');
const responseMiddleware = require('./middlewares/responseMiddleware');
const routes = require('./routes'); // Import centralized routes

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['MONGO_URI', 'PORT'];
requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
        console.error(`❌ ERROR: Missing ${varName} in environment variables`);
        process.exit(1);
    }
});

// Initialize Express app
const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors());

// Logging and Parsing Middlewares
app.use(morgan('dev'));
app.use(express.json());

// Attach response middleware correctly
app.use(responseMiddleware);

// Connect to Database
connectDB();

// Use Routes from `routes/index.js`
app.use(routes);

// Error Handling Middleware
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// Graceful Shutdown
process.on('SIGINT', async () => {
    console.log('🔻 Gracefully shutting down...');
    
    // Close MongoDB Connection (If Needed)
    try {
        const mongoose = require('mongoose');
        await mongoose.connection.close();
        console.log('📌 MongoDB connection closed.');
    } catch (err) {
        console.error('❌ Error closing MongoDB connection:', err);
    }

    server.close(() => {
        console.log('🛑 Server shutdown complete.');
        process.exit(0);
    });
});
