import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import { connectDB } from './config/database';
import bcrypt from 'bcryptjs';
import User from './models/User.model';
import { authRoutes, bookIssueRoutes } from './routes';
import { errorHandler } from './middleware';

// Load environment variables
dotenv.config();

const app: Application = express();
// Prefer explicit PORT from env, fall back to 5002 (documented dev port)
const PORT = process.env.PORT ? Number(process.env.PORT) : 5002;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL?.split(',') || ['http://localhost:3000'],
  credentials: true
}));
// Production hardening
if (process.env.NODE_ENV === 'production') {
  app.use(helmet());
  // Cast compression to any to satisfy differing overload expectations
  app.use(compression() as any);
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/book-issues', bookIssueRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Debug: Database status (disabled in production)
app.get('/api/debug/db-status', async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ message: 'Disabled in production' });
  }
  try {
    const mongoose = require('mongoose');
    const stateMap: Record<number, string> = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    const readyState = mongoose.connection.readyState;
    // Attempt lightweight counts (may fail if not connected yet)
    let userCount: number | null = null;
    let bookIssueCount: number | null = null;
    if (readyState === 1) {
      try { userCount = await mongoose.model('User').countDocuments(); } catch {}
      try { bookIssueCount = await mongoose.model('BookIssue').countDocuments(); } catch {}
    }
    res.json({
      mongodb: {
        uriDefined: !!process.env.MONGODB_URI,
        readyState,
        readyStateText: stateMap[readyState] || 'unknown',
        userCount,
        bookIssueCount
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Debug error', error: (err as Error).message });
  }
});

// Error handling middleware
app.use(errorHandler);

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await connectDB();
    // Optional seeding (enable with SEED_ADMIN=true)
    if (process.env.SEED_ADMIN === 'true') {
      try {
        const usersCount = await User.countDocuments();
        if (usersCount === 0) {
          const username = 'admin';
          const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
          const fullName = 'Головний Бібліотекар';
          const hashedPassword = await bcrypt.hash(password, 10);
          await User.create({ username, password: hashedPassword, fullName, role: 'librarian' });
          console.log(`👤 Seeded admin: ${username} / ${password}`);
        }
      } catch (seedErr) {
        console.warn('Seed step skipped or failed:', (seedErr as Error).message);
      }
    }
    // NOTE: For security reasons the manual seed endpoint was removed.
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📚 Бібліотека Військового інституту телекомунікацій та інформатизації імені Героїв Крут API`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
