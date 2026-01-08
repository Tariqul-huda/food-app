import express from 'express';
import { restaurantModel } from '../models/users.js';

const router = express.Router();

// Get all restaurants (public)
router.get('/', (req, res) => {
  const restaurants = restaurantModel.getAll();
  // Remove sensitive data
  const publicRestaurants = restaurants.map(({ password, ...rest }) => rest);
  res.json(publicRestaurants);
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

