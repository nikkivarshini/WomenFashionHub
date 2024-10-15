import express from 'express';
import { requireSignin } from '../middlewares/authMiddleware.js';
import { addToCartController, removeFromCartController, getCartController, updateCartController } from '../controllers/cartController.js';

const router = express.Router();

// Add to cart
router.post('/add-to-cart/:productId', requireSignin, addToCartController);

// Remove from cart
router.delete('/remove-from-cart/:productId', requireSignin, removeFromCartController);

// Update cart
router.put('/update-cart/:productId', requireSignin, updateCartController);

// Get cart
router.get('/get-cart', requireSignin, getCartController);

export default router;
