import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

export const addToCartController = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = req.user._id;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send({ error: "Product not found" });
    }

    // Check if the user already has a cart
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // If the user doesn't have a cart, create a new one
      cart = new Cart({ user: userId, items: [{ product: productId, quantity }] });
    } else {
      // If the user already has a cart, check if the product is already in the cart
      const existingItem = cart.items.find(item => item.product.equals(productId));
      if (existingItem) {
        // If the product is already in the cart, update the quantity
        existingItem.quantity += quantity;
      } else {
        // If the product is not in the cart, add it
        cart.items.push({ product: productId, quantity });
      }
    }

    // Save the cart to the database
    await cart.save();

    res.status(200).send({
      success: true,
      message: "Product added to cart successfully",
      cart
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error while adding product to cart",
      error: error.message
    });
  }
};

// Remove product from cart
export const removeFromCartController = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    // Check if the user has a cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).send({ error: "Cart not found" });
    }

    // Remove the product from the cart items
    cart.items = cart.items.filter(item => !item.product.equals(productId));

    // Save the updated cart
    await cart.save();

    res.status(200).send({
      success: true,
      message: "Product removed from cart successfully",
      cart
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error while removing product from cart",
      error: error.message
    });
  }
};

// Update product quantity in cart
export const updateCartController = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = req.user._id;

    // Check if the user has a cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).send({ error: "Cart not found" });
    }

    // Find the product in the cart items and update its quantity
    const cartItem = cart.items.find(item => item.product.equals(productId));
    if (cartItem) {
      cartItem.quantity = quantity;
    }

    // Save the updated cart
    await cart.save();

    res.status(200).send({
      success: true,
      message: "Cart updated successfully",
      cart
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error while updating cart",
      error: error.message
    });
  }
};

// Get user's cart
export const getCartController = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find the user's cart
    const cart = await Cart.findOne({ user: userId }).populate("items.product", "-photo");

    res.status(200).send({
      success: true,
      message: "User's cart retrieved successfully",
      cart
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error while retrieving user's cart",
      error: error.message
    });
  }
};
