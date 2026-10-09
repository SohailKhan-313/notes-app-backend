const express = require('express');
const cors = require('cors');
const passport = require('passport');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect Database
const connectDB = require('./src/config/db');
connectDB();

// Initialize Express App
const app = express();

// Passport Configuration
const configurePassport = require('./src/config/passport');
app.use(passport.initialize());
configurePassport(passport);

// Middlewares
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman)
      if (!origin) return callback(null, true);

      // Allow if origin matches allowed list or ends with netlify.app
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.netlify.app') || origin.endsWith('.vercel.app') ||
        process.env.CLIENT_URL === '*'
      ) {
        return callback(null, true);
      }

      // Default allow to prevent unexpected CORS blocks during deployment
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root Route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🚀 Notes App Backend API is running successfully!',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      notes: '/api/notes',
    },
    timestamp: new Date().toISOString(),
  });
});

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Notes API backend is running',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/notes', require('./src/routes/noteRoutes'));

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.originalUrl}`,
  });
});

// Centralized Error Handler
const errorHandler = require('./src/middlewares/errorHandler');
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
});

module.exports = app;
