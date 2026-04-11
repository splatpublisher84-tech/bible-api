const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const pinoHttp = require('pino-http');
const swaggerUi = require('swagger-ui-express');
const logger = require('./config/logger');
const swaggerSpec = require('./config/swagger');
const path = require('path');
const apiRoutes = require('./routes');
const { errorHandler } = require('./middlewares/errorHandler');
require('dotenv').config();

const app = express();

// Security middlewares
app.use(helmet());
app.use(cors());

// Rate limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,                  // 100 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
}));

// Request logging
app.use(pinoHttp({ logger }));

// Body parsing
app.use(express.json());

// Swagger API docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Test route
app.get('/', (req, res) => {
  res.json({
    message: 'Bible API is running!',
    version: '1.0.0',
    endpoints: {
      health: '/health',
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Shared CSP for pages with inline scripts
const pageCsp = helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    scriptSrcAttr: ["'unsafe-inline'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    connectSrc: ["'self'"],
  },
});

// Demo app
app.get('/demo', pageCsp, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'demo.html'));
});

// Dashboard
app.get('/dashboard', pageCsp, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

// API routes
app.use('/api', apiRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use(errorHandler);

module.exports = app;
