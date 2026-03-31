require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const authRoutes    = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const dietRoutes    = require('./routes/dietRoutes');
const mealRoutes    = require('./routes/mealRoutes');
const insightRoutes = require('./routes/insightRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Security
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use('/api/', limiter);

// API Routes
app.use('/api/auth',     authRoutes);
app.use('/api/profile',  profileRoutes);
app.use('/api/diet',     dietRoutes);
app.use('/api/meals',    mealRoutes);
app.use('/api/insights', insightRoutes);

// Serve React frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

app.get('/health', (req, res) => res.json({ status: 'ok', ts: new Date() }));

app.listen(PORT, () => console.log(`NutriSmart backend running on port ${PORT}`));
