import express from 'express';
import { restaurantModel } from '../models/users.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Get all restaurants (public)
router.get('/', (req, res) => {
  const restaurants = restaurantModel.getAll();
  // Remove sensitive data
  const publicRestaurants = restaurants.map(({ password, ...rest }) => rest);
  res.json(publicRestaurants);
});

// Get current restaurant's profile (protected - restaurant only)
// Must be before /:id route to avoid route conflicts
router.get('/profile', authenticateToken, authorizeRoles('restaurant'), (req, res) => {
  try {
    const restaurant = restaurantModel.findById(req.user.id);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    const { password, ...restaurantWithoutPassword } = restaurant;
    res.json({ restaurant: restaurantWithoutPassword });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update current restaurant's profile (protected - restaurant only)
router.put('/profile', authenticateToken, authorizeRoles('restaurant'), (req, res) => {
  try {
    const restaurant = restaurantModel.findById(req.user.id);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    // Update allowed fields
    const allowedFields = ['name', 'phone', 'address', 'cuisine', 'description', 'coinRate', 'coinThreshold'];
    const updates = {};
    
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    // Apply updates
    Object.assign(restaurant, updates);

    const { password, ...restaurantWithoutPassword } = restaurant;
    res.json({ restaurant: restaurantWithoutPassword });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get restaurant by ID (public)
router.get('/:id', (req, res) => {
  const restaurant = restaurantModel.findById(req.params.id);
  if (!restaurant) {
    return res.status(404).json({ error: 'Restaurant not found' });
  }
  const { password, ...publicRestaurant } = restaurant;
  res.json(publicRestaurant);
});

export default router;

