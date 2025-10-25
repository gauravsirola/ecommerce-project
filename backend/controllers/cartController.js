import Cart from "../model/cartModel.js";

// Helper to recalculate totals
const calculateCartTotals = (cart) => {
  let total = 0;
  let discountedTotal = 0;
  let totalQuantity = 0;

  cart.products.forEach((p) => {
    total += p.total;
    discountedTotal += p.discountedTotal;
    totalQuantity += p.quantity;
  });

  cart.total = total;
  cart.discountedTotal = discountedTotal;
  cart.totalProducts = cart.products.length;
  cart.totalQuantity = totalQuantity;
};

// GET cart by user
export const getCartByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    let cart = await Cart.findOne({ userId: Number(userId) });

    if (!cart) {
      cart = new Cart({
        userId: Number(userId),
        products: [],
        total: 0,
        discountedTotal: 0,
        totalProducts: 0,
        totalQuantity: 0,
      });

      await cart.save();
    }

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADD product to cart
export const addToCart = async (req, res) => {
  const { userId } = req.params;
  const { product } = req.body;

  try {
    let cart = await Cart.findOne({ userId: Number(userId) });

    if (!cart) {
      cart = new Cart({
        userId: Number(userId),
        products: [],
        total: 0,
        discountedTotal: 0,
        totalProducts: 0,
        totalQuantity: 0,
      });
    }

    // Normalize product ID comparison
    const existingProduct = cart.products.find(
      (p) => String(p.id) === String(product.id)
    );

    if (existingProduct) {
      existingProduct.quantity += product.quantity || 1;
      existingProduct.total = existingProduct.price * existingProduct.quantity;
      existingProduct.discountedTotal =
        existingProduct.total *
        (1 - (existingProduct.discountPercentage || 0) / 100);
      console.log("Product already existed, updated quantity");
    } else {
      product.quantity = product.quantity || 1;
      product.total = product.price * product.quantity;
      product.discountedTotal =
        product.total * (1 - (product.discountPercentage || 0) / 100);
      cart.products.push(product);
      console.log("New product added to cart");
    }

    calculateCartTotals(cart);
    await cart.save();

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// REMOVE product from cart
export const removeFromCart = async (req, res) => {
  const { userId, productId } = req.params;
  console.log(userId, productId)

  try {
    const cart = await Cart.findOne({ userId: Number(userId) });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.products = cart.products.filter(
      (p) => String(p.id) !== String(productId)
    );

    calculateCartTotals(cart);
    await cart.save();

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE product quantity
export const updateQuantity = async (req, res) => {
  const { userId } = req.params;
  const { productId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ userId: Number(userId) });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const product = cart.products.find(
      (p) => String(p.id) === String(productId)
    );
    if (!product)
      return res.status(404).json({ message: "Product not found in cart" });

    product.quantity = quantity;
    product.total = product.price * quantity;
    product.discountedTotal =
      product.total * (1 - (product.discountPercentage || 0) / 100);

    calculateCartTotals(cart);
    await cart.save();

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
