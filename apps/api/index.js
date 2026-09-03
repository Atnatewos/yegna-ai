/**
 * File: apps/api/index.js
 * Yegna AI - Express API Entry Point
 */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const { apiRateLimiter } = require('./middleware/rateLimit.middleware');
const { notFoundHandler, errorHandler } = require('./middleware/error.middleware');

const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');
const walletRoutes = require('./routes/wallet.routes');
const teamRoutes = require('./routes/team.routes');
const levelRoutes = require('./routes/level.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

app.use(helmet());

const corsOptions = {
  origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  credentials: true
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.use('/api', apiRateLimiter);

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Yegna AI API is running',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/levels', levelRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;

if (require.main === module) {
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`Yegna AI API running on port ${port}`);
  });
}