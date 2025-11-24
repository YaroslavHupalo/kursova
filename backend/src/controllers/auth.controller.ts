import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.model';
import { AuthRequest } from '../middleware/auth.middleware';

// Register new librarian
export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
  const { username, password, fullName } = req.body;
  const normalizedUsername = String(username).trim().toLowerCase();

    // Check if user already exists
  const existingUser = await User.findOne({ username: normalizedUsername });
    if (existingUser) {
      res.status(400).json({ message: 'Username already exists' });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
  username: normalizedUsername,
      password: hashedPassword,
      fullName,
      role: 'librarian'
    });

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET || 'default_secret';
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      jwtSecret
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// Login
export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
  const { username, password } = req.body;
  const normalizedUsername = String(username).trim().toLowerCase();

    // Find user
  const user = await User.findOne({ username: normalizedUsername });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET || 'default_secret';
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      jwtSecret
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// Get current user profile
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};
