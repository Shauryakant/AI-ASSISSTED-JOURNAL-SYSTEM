require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const journalRoutes = require('./routes/journal.routes');

const app = express();

// Set specific port from .env or override if in use
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Main API Limiter applies to all requests to /api/
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later"
});
app.use('/api', apiLimiter);

// Make LLM endpoint have a stricter limit
const analyzeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: "Too many emotion analysis requests, please try again later"
});
app.use('/api/journal/analyze', analyzeLimiter);

// Map Routes
app.use('/api/journal', journalRoutes);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
