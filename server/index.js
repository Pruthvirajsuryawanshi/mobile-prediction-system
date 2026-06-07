import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import path from 'path';

// Routes
import chatRoutes from './routes/chat.js';
import mobileRoutes from './routes/mobiles.js';
import recommendRoutes from './routes/recommend.js';
import compareRoutes from './routes/compare.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
<<<<<<< HEAD
  origin: (origin, callback) => {
    // Allow any localhost origin (handles port 5173, 5174, 3000, etc.)
    if (!origin || origin.startsWith('http://localhost')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
=======
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
    credentials: true,
>>>>>>> 562805c (Added mobile recommendation feature)
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log('✅ MongoDB Connected'))
        .catch((err) => console.error('❌ MongoDB Error:', err));
} else {
    console.log('⚠️  No MongoDB URI set; running without persistence.');
}

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/mobiles', mobileRoutes);
app.use('/api/recommend', recommendRoutes);
app.use('/api/compare', compareRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'AI Mobile Recommendation API Running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;