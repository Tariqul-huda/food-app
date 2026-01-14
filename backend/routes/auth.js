import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userModel, restaurantModel } from '../models/users.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production';
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

// Store refresh tokens (in production, use Redis or database)
const refreshTokens = new Set();

// Helper function to generate tokens
const generateTokens = (payload) => {
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
  return { accessToken, refreshToken };
};

// Register User
router.post('/register/user', async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // Check if user already exists
    if (userModel.findByEmail(email)) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = userModel.create({
      email,
      password: hashedPassword,
      name,
      phone: phone || null,
      coinBalances: [],
    });

    // Generate tokens
    const payload = { id: user.id, email: user.email, role: user.role };
    const { accessToken, refreshToken } = generateTokens(payload);
    refreshTokens.add(refreshToken);

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Register user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Register Restaurant
router.post('/register/restaurant', async (req, res) => {
  try {
    const { email, password, name, phone, address, cuisine } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // Check if restaurant already exists
    if (restaurantModel.findByEmail(email)) {
      return res.status(409).json({ error: 'Restaurant with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create restaurant
    const restaurant = restaurantModel.create({
      email,
      password: hashedPassword,
      name,
      phone: phone || null,
      address: address || null,
      cuisine: cuisine || null,
    });

    // Generate tokens
    const payload = { id: restaurant.id, email: restaurant.email, role: restaurant.role };
    const { accessToken, refreshToken } = generateTokens(payload);
    refreshTokens.add(refreshToken);

    // Return restaurant data (without password)
    const { password: _, ...restaurantWithoutPassword } = restaurant;
    res.status(201).json({
      user: restaurantWithoutPassword,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Register restaurant error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user or restaurant based on role
    let account = null;
    if (role === 'restaurant') {
      account = restaurantModel.findByEmail(email);
    } else {
      account = userModel.findByEmail(email);
    }

    if (!account) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, account.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate tokens
    const payload = { id: account.id, email: account.email, role: account.role };
    const { accessToken, refreshToken } = generateTokens(payload);
    refreshTokens.add(refreshToken);

    // Return account data (without password)
    const { password: _, ...accountWithoutPassword } = account;
    res.json({
      user: accountWithoutPassword,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Refresh Token
router.post('/refresh', (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token required' });
    }

    if (!refreshTokens.has(refreshToken)) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }

    jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) {
        refreshTokens.delete(refreshToken);
        return res.status(403).json({ error: 'Invalid or expired refresh token' });
      }

      // Generate new tokens
      const payload = { id: decoded.id, email: decoded.email, role: decoded.role };
      const { accessToken, refreshToken: newRefreshToken } = generateTokens(payload);
      
      // Remove old refresh token and add new one
      refreshTokens.delete(refreshToken);
      refreshTokens.add(newRefreshToken);

      res.json({
        accessToken,
        refreshToken: newRefreshToken,
      });
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    refreshTokens.delete(refreshToken);
  }
  res.json({ message: 'Logged out successfully' });
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid or expired token' });
      }

      // Find user or restaurant
      let account = null;
      if (decoded.role === 'restaurant') {
        account = restaurantModel.findById(decoded.id);
      } else {
        account = userModel.findById(decoded.id);
      }

      if (!account) {
        return res.status(404).json({ error: 'User not found' });
      }

      const { password: _, ...accountWithoutPassword } = account;
      res.json({ user: accountWithoutPassword });
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

