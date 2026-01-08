import express from 'express';
import { authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// In-memory orders storage (replace with database in production)
let orders = [];

// Get orders (user can see their own, restaurant can see their restaurant's orders)
router.get('/', (req, res) => {
  if (req.user.role === 'user') {
    // Users see their own orders
    const userOrders = orders.filter((order) => order.userId === req.user.id);
    res.json(userOrders);
  } else if (req.user.role === 'restaurant') {
    // Restaurants see orders for their restaurant
    const restaurantOrders = orders.filter((order) => order.restaurantId === req.user.id);
    res.json(restaurantOrders);
  } else {
    res.status(403).json({ error: 'Unauthorized' });
  }
});

// Create order (users only)
router.post('/', authorizeRoles('user'), (req, res) => {
  const { restaurantId, restaurantName, total, items, coinDelta } = req.body;

  if (!restaurantId || !total || !items || !Array.isArray(items)) {
    return res.status(400).json({ error: 'Invalid order data' });
  }

  const order = {
    id: `o-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId: req.user.id,
    restaurantId,
    restaurantName: restaurantName || 'Unknown',
    total,
    items,
    coinDelta: coinDelta || 0,
    createdAt: new Date().toISOString(),
    status: 'pending',
  };

  orders.push(order);
  res.status(201).json(order);
});

// Update order status (restaurants only)
router.patch('/:id/status', authorizeRoles('restaurant'), (req, res) => {
  const { status } = req.body;
  const order = orders.find((o) => o.id === req.params.id);

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  if (order.restaurantId !== req.user.id) {
    return res.status(403).json({ error: 'Not authorized to update this order' });
  }

  order.status = status;
  res.json(order);
});

export default router;

