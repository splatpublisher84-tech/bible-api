const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
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
const { requestTracker } = require('./middlewares/requestTracker');
require('dotenv').config();

const app = express();

// Security middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  methods: ['GET'],
}));

// Rate limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,                  // 500 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
}));

// Request logging
app.use(pinoHttp({ logger }));

// Body parsing
app.use(express.json({ limit: '1mb' }));

// Static files
app.use('/static', express.static(path.join(__dirname, 'public')));

// Request tracking
app.use(requestTracker);

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

// Nonce-based CSP for pages with inline scripts (demo)
function serveWithNonce(filePath) {
  return (req, res) => {
    const nonce = crypto.randomBytes(16).toString('base64');
    res.setHeader('Content-Security-Policy',
      `default-src 'self'; script-src 'nonce-${nonce}'; style-src 'self' 'unsafe-inline'; connect-src 'self'`);
    const html = fs.readFileSync(filePath, 'utf-8')
      .replace(/<script>/g, `<script nonce="${nonce}">`);
    res.type('html').send(html);
  };
}

// CSP for dashboard (external scripts from CDN + static)
function serveDashboard(filePath) {
  return (req, res) => {
    res.setHeader('Content-Security-Policy',
      `default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; connect-src 'self'`);
    let html = fs.readFileSync(filePath, 'utf-8');
    if (process.env.METRICS_KEY) {
      html = html.replace('</head>', `<meta name="metrics-key" content="${process.env.METRICS_KEY}">\n</head>`);
    }
    res.type('html').send(html);
  };
}

// Demo app
app.get('/demo', serveWithNonce(path.join(__dirname, 'views', 'demo.html')));

// Dashboard
app.get('/dashboard', serveDashboard(path.join(__dirname, 'views', 'dashboard.html')));

// API routes
app.use('/api', apiRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use(errorHandler);

module.exports = app;
